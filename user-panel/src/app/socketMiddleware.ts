import type {
  Middleware,
  ThunkDispatch,
  UnknownAction,
} from "@reduxjs/toolkit";
import { io, Socket } from "socket.io-client";
import { fetchTasks } from "@/features/tasks/tasksSlice";

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
      (store.dispatch as ThunkDispatch<unknown, unknown, UnknownAction>)(
        fetchTasks(),
      );
    });

    socket.on("reconnect", () => {
      (store.dispatch as ThunkDispatch<unknown, unknown, UnknownAction>)(
        fetchTasks(),
      );
    });

    socket.on("task:created", () => {
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
