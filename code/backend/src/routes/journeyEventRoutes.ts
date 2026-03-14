import { Router } from "express";
import {
  createJourneyEvent,
  getJourneyEvents,
} from "../controllers/journeyEventController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

router.post("/", authenticateToken, createJourneyEvent);
router.get("/:journeyId", authenticateToken, getJourneyEvents);

export default router;