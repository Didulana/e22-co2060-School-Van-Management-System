import { Router } from "express";
import {
  updateLocation,
  fetchLatestLocations,
} from "../controllers/trackingController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

router.post("/location", authenticateToken, updateLocation);
router.get("/locations", fetchLatestLocations);

export default router;