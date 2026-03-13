import express from "express";
import cors from "cors";
import trackingRoutes from "./routes/trackingRoutes";
import devAuthRoutes from "./routes/devAuthRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import journeyEventRoutes from "./routes/journeyEventRoutes";
import studentBoardingRoutes from "./routes/studentBoardingRoutes";
import journeyStatusRoutes from "./routes/journeyStatusRoutes";

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

app.get("/api/system/status", (_req, res) => {
  res.json({
    status: "ok",
    service: "tracking-service",
    timestamp: new Date()
  });
});

app.use("/api/tracking", trackingRoutes);
app.use("/api/dev-auth", devAuthRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/journey-events", journeyEventRoutes);
app.use("/api/boarding", studentBoardingRoutes);
app.use("/api/journey", journeyStatusRoutes);

export default app;