import express from "express";
import cors from "cors";

// --- ROUTES FROM feature/auth-frontend ---
import authRoutes from "./routes/authRoutes";

// --- ROUTES FROM feature/driver-route ---
import driverRoutes from "./routes/driver.routes";
import adminDriverRoutes from "./routes/adminDriver.routes";
import driverJourneyRoutes from "./routes/driverJourney.routes";
import driverAnnounceRoutes from "./routes/driverAnnounce.routes";
import vehicleRoutes from "./routes/vehicle.routes";
import routeRoutes from "./routes/route.routes";

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
import adminRoutes from "./routes/adminRoutes";
import { authenticateToken, requireRole } from "./middleware/authMiddleware";
import { getCorsOptions } from "./config/cors";

const app = express();

app.use(cors(getCorsOptions()));

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

// Driver group routes
app.use("/api/driver", authenticateToken, requireRole("driver"), driverRoutes);
app.use("/api/driver/journey", authenticateToken, requireRole("driver"), driverJourneyRoutes);
app.use("/api/driver/announce", authenticateToken, requireRole("driver"), driverAnnounceRoutes);

// Generic info routes
app.use("/api/drivers", authenticateToken, requireRole("admin"), adminDriverRoutes);
app.use("/api/vehicles", authenticateToken, vehicleRoutes);
app.use("/api/routes", authenticateToken, routeRoutes);

// Parent routes
app.use("/api/parent", authenticateToken, requireRole("parent"), parentRoutes);
app.use("/api/admin", authenticateToken, requireRole("admin"), adminRoutes);

// Other protected routes
if (process.env.NODE_ENV !== "production") {
  app.use("/api/dev-auth", devAuthRoutes);
}
app.use("/api/notifications", authenticateToken, notificationRoutes);
app.use("/api/journey-events", authenticateToken, journeyEventRoutes);
app.use("/api/boarding", authenticateToken, requireRole("driver", "parent"), studentBoardingRoutes);
app.use("/api/dropoff", authenticateToken, requireRole("driver", "parent"), studentDropoffRoutes);
app.use("/api/journey", authenticateToken, journeyStatusRoutes);
app.use("/api/journey", authenticateToken, journeyTimelineRoutes);
app.use("/api/tracking", trackingRoutes);

export default app;
