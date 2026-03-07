import { Router } from "express";
import {
  updateLocation,
  fetchLatestLocations,
} from "../controllers/trackingController";

const router = Router();

router.post("/location", updateLocation);
router.get("/locations", fetchLatestLocations);

export default router;