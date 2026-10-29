import { io } from "socket.io-client";

export const socket = io(import.meta.env.VITE_SERVER_URL!, {
  autoConnect: import.meta.env.VITE_HOSTED !== "1",
  transports: import.meta.env.VITE_HOSTED === "1" ? ["websocket"] : ["polling", "websocket"],
});

socket.on("connect", () => {
  console.log("✅ Socket connected:", socket.id);
});
