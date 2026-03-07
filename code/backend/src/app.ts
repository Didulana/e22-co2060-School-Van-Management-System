import express from "express";
import cors from "cors";
import trackingRoutes from "./routes/trackingRoutes";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ message: "Backend is running" });
});

app.use("/api/tracking", trackingRoutes);

export default app;