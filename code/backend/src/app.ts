import express from "express";
import cors from "cors";

// --- ROUTES FROM feature/auth-frontend ---
import authRoutes from "./routes/authRoutes";

// --- ROUTES FROM feature/driver-route ---
import routes from "./routes";
import driverJourneyRoutes from "./routes/driverJourney.routes";
import driverAnnounceRoutes from "./routes/driverAnnounce.routes";

// --- ROUTES FROM develop ---
import trackingRoutes from "./routes/trackingRoutes";
import devAuthRoutes from "./routes/devAuthRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import journeyEventRoutes from "./routes/journeyEventRoutes";
import studentBoardingRoutes from "./routes/studentBoardingRoutes";
import studentDropoffRoutes from "./routes/studentDropoffRoutes";
import journeyStatusRoutes from "./routes/journeyStatusRoutes";
import journeyTimelineRoutes from "./routes/journeyTimelineRoutes";
import parentRoutes from "./routes/parentRoutes";
import { authenticateToken, requireRole } from "./middleware/authMiddleware";

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
    timestamp: new Date(),
  });
});

// Routes from feature/auth-frontend
app.use("/api/auth", authRoutes);

// General API routes (Driver, Vehicle, Route info)
app.use("/api", authenticateToken, routes);

// Driver journey lifecycle & announcements
app.use("/api/driver", authenticateToken, requireRole("driver"));
app.use("/api/driver/journey", driverJourneyRoutes);
app.use("/api/driver/announce", driverAnnounceRoutes);

// Parent routes
app.use("/api/tracking", authenticateToken, requireRole("parent"), trackingRoutes);
app.use("/api/parent", authenticateToken, requireRole("parent"), parentRoutes);

// Other protected routes
app.use("/api/dev-auth", devAuthRoutes);
app.use("/api/notifications", authenticateToken, notificationRoutes);
app.use("/api/journey-events", authenticateToken, journeyEventRoutes);
app.use("/api/boarding", authenticateToken, requireRole("driver"), studentBoardingRoutes);
app.use("/api/dropoff", authenticateToken, requireRole("driver"), studentDropoffRoutes);
app.use("/api/journey", authenticateToken, journeyStatusRoutes);
app.use("/api/journey", authenticateToken, journeyTimelineRoutes);

export default app;
