import { Router } from "express";
import { fetchJourneyTimeline } from "../controllers/journeyTimelineController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

router.get("/:id/timeline", authenticateToken, fetchJourneyTimeline);

export default router;