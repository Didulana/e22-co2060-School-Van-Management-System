import "dotenv/config";
import http from "http";
import { Server } from "socket.io";
import app from "./app";
import { initSocket } from "./services/socketService";
import { registerTrackingSocket } from "./sockets/trackingSocket";
import { testDbConnection } from "./config/db";

const PORT = Number(process.env.PORT) || 5001;

const server = http.createServer(app);

const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
const trimmedUrl = frontendUrl.endsWith('/') ? frontendUrl.slice(0, -1) : frontendUrl;

const io = new Server(server, {
  cors: {
    origin: [trimmedUrl, "http://localhost:5173"],
    credentials: true,
  },
});

initSocket(io);
registerTrackingSocket(io);

server.listen(PORT, async () => {
  console.log(`Server listening on port ${PORT}`);

  try {
    await testDbConnection();
  } catch (error) {
    console.error("Database connection failed:", error);
  }
});
