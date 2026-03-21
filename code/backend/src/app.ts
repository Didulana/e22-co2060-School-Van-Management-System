import express from "express";
import cors from "cors";

// --- ROUTES FROM feature/driver-route ---
import routes from "./routes";

// --- ROUTES FROM develop ---
import trackingRoutes from "./routes/trackingRoutes";
import devAuthRoutes from "./routes/devAuthRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import journeyEventRoutes from "./routes/journeyEventRoutes";
import studentBoardingRoutes from "./routes/studentBoardingRoutes";
import studentDropoffRoutes from "./routes/studentDropoffRoutes";
import journeyStatusRoutes from "./routes/journeyStatusRoutes";
import journeyTimelineRoutes from "./routes/journeyTimelineRoutes";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

// Root path from feature/driver-route
app.get("/", (req, res) => {
  res.send("School Transport Management Backend Running");
});

// Health checks from develop
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

// Routes from feature/driver-route (mounts /api/drivers, /api/vehicles, etc.)
app.use("/api", routes);

// Routes from develop
app.use("/api/tracking", trackingRoutes);
app.use("/api/dev-auth", devAuthRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/journey-events", journeyEventRoutes);
app.use("/api/boarding", studentBoardingRoutes);
app.use("/api/dropoff", studentDropoffRoutes);
app.use("/api/journey", journeyStatusRoutes);
app.use("/api/journey", journeyTimelineRoutes);

export default app;
