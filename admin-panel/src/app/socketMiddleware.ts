import type {
  Middleware,
  ThunkDispatch,
  UnknownAction,
} from "@reduxjs/toolkit";
import { io, Socket } from "socket.io-client";
import {
  fetchTasks,
  taskUpdated,
  taskDeleted,
} from "@/features/tasks/tasksSlice";
import { login, loadCurrentUser } from "@/features/auth/authSlice";
import toast from "react-hot-toast";

let socket: Socket | null = null;

export const socketMiddleware: Middleware = (store) => {
  if (!socket) {
    socket = io(import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000", {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 120,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 600000,
    });

    socket.on("connect", () => {
      // Only fetch tasks if user is authenticated
      const state = store.getState() as { auth: { user: unknown } };
      if (state.auth.user) {
        (store.dispatch as ThunkDispatch<unknown, unknown, UnknownAction>)(
          fetchTasks(),
        );
      }
    });

    socket.on("disconnect", () => {
      toast.error("Bağlantı kesildi", { id: "socket-disconnect" });
    });

    socket.on("reconnect_attempt", (attemptNumber) => {
      if (attemptNumber === 1) {
        toast.loading("Bağlantı yeniden kuruluyor...", { id: "reconnecting" });
      }
    });

    socket.on("reconnect", () => {
      toast.dismiss("reconnecting");
      toast.success("Bağlantı yeniden kuruldu");
      (store.dispatch as ThunkDispatch<unknown, unknown, UnknownAction>)(
        fetchTasks(),
      );
    });

    socket.on("reconnect_failed", () => {
      toast.dismiss("reconnecting");
      toast.error("Bağlantı kurulamadı. Lütfen sayfayı yenileyin.", {
        duration: 5000,
      });
    });

    socket.on("task:created", () => {
      toast.success("🔔 Yeni talep geldi!");
      (store.dispatch as ThunkDispatch<unknown, unknown, UnknownAction>)(
        fetchTasks(),
      );
    });

    socket.on("task:updated", (data) => {
      if (data && data.task) {
        store.dispatch(taskUpdated(data.task));
      } else {
        (store.dispatch as ThunkDispatch<unknown, unknown, UnknownAction>)(
          fetchTasks(),
        );
      }
    });

    socket.on("task:deleted", (data) => {
      if (data && data.taskId) {
        store.dispatch(taskDeleted(data.taskId));
      } else {
        // Veri gelmiyorsa tüm listeyi yenile
        (store.dispatch as ThunkDispatch<unknown, unknown, UnknownAction>)(
          fetchTasks(),
        );
      }
    });
  }

  return (next) => (action) => {
    const result = next(action);

    if (
      login.fulfilled.match(action) ||
      loadCurrentUser.fulfilled.match(action)
    ) {
      if (action.payload) {
        (store.dispatch as ThunkDispatch<unknown, unknown, UnknownAction>)(
          fetchTasks(),
        );
      }
    }

    return result;
  };
};

export const getSocket = () => socket;
