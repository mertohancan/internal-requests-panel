import type {
  Middleware,
  ThunkDispatch,
  UnknownAction,
} from "@reduxjs/toolkit";
import { io, Socket } from "socket.io-client";
import { fetchTasks } from "@/features/tasks/tasksSlice";
import toast from "react-hot-toast";

let socket: Socket | null = null;

export const socketMiddleware: Middleware = (store) => {
  if (!socket) {
    socket = io("http://localhost:4000", {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 120,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 600000,
    });

    socket.on("connect", () => {
      (store.dispatch as ThunkDispatch<unknown, unknown, UnknownAction>)(
        fetchTasks(),
      );
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

    socket.on("task:updated", () => {
      (store.dispatch as ThunkDispatch<unknown, unknown, UnknownAction>)(
        fetchTasks(),
      );
    });

    socket.on("task:deleted", () => {
      (store.dispatch as ThunkDispatch<unknown, unknown, UnknownAction>)(
        fetchTasks(),
      );
    });
  }

  return (next) => (action) => {
    return next(action);
  };
};

export const getSocket = () => socket;
