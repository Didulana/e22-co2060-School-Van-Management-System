import { Router } from "express";
import { getJourneyStatus } from "../controllers/journeyStatusController";

const router = Router();

router.get("/:id/status", getJourneyStatus);

export default router;