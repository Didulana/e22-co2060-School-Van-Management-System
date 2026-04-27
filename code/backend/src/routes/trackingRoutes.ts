import { Router } from "express";
import {
  updateLocation,
  fetchLatestLocations,
} from "../controllers/trackingController";
import { authenticateToken } from "../middleware/authMiddleware";
import { locationRateLimiter } from "../middleware/locationRateLimiter";

const router = Router();

router.post(
  "/location",
  authenticateToken,
  locationRateLimiter,
  updateLocation
);
router.get("/locations", fetchLatestLocations);


export default router;