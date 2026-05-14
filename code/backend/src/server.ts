import "dotenv/config";
import http from "http";
import { Server } from "socket.io";
import app from "./app";
import { initSocket } from "./services/socketService";
import { registerTrackingSocket } from "./sockets/trackingSocket";
import { testDbConnection } from "./config/db";
import { isOriginAllowed } from "./config/cors";

const PORT = Number(process.env.PORT) || 5001;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin(origin, callback) {
      if (isOriginAllowed(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`Socket CORS blocked origin: ${origin}`));
    },
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
