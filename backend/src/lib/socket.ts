import { safePayload } from "../utils/safePayload";
import http, { IncomingMessage, ServerResponse } from "http";
import { Server as SocketIOServer } from "socket.io";

let io: SocketIOServer;

export const initializeWebSocketServer = (
  httpServer: http.Server<typeof IncomingMessage, typeof ServerResponse>
) => {
  io = require("socket.io")(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ["GET", "POST"],
    },
  });
  if (process.env.UNICONNECT_PUBLIC_HOST === "1") {
    io.use((_socket, next) => next(new Error("Hosted demo uses authenticated HTTP polling.")));
    const emit = io.emit.bind(io);
    io.emit = ((name: string, ...args: any[]) => emit(name, ...args.map(safePayload))) as typeof io.emit;
  }
  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket.io is not initialized");

  return io;
};
