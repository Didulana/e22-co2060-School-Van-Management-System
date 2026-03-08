import express from "express";
import cors from "cors";
import trackingRoutes from "./routes/trackingRoutes";
import devAuthRoutes from "./routes/devAuthRoutes";

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
app.use("/api/dev-auth", devAuthRoutes);

export default app;