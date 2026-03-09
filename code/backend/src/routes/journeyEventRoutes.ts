import { Router } from "express";
import { createJourneyEvent } from "../controllers/journeyEventController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

router.post("/", authenticateToken, createJourneyEvent);

export default router;