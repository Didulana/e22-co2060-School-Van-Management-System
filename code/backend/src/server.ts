import "dotenv/config";
import http from "http";
import { Server } from "socket.io";
import app from "./app";
import { initSocket } from "./services/socketService";
import { registerTrackingSocket } from "./sockets/trackingSocket";

const PORT = Number(process.env.PORT) || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  },
});

initSocket(io);
registerTrackingSocket(io);

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});