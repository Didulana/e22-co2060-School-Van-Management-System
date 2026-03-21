import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { getJourneyTimeline } from "../models/journeyTimelineModel";

export async function fetchJourneyTimeline(
  req: AuthenticatedRequest,
  res: Response
) {
  try {

    const journeyId = Number(req.params.id);

    if (!journeyId || Number.isNaN(journeyId)) {
      return res.status(400).json({
        error: "Invalid journey id",
      });
    }

    const timeline = await getJourneyTimeline(journeyId);

    return res.json({
      journeyId,
      count: timeline.length,
      timeline,
    });

  } catch (error) {

    console.error("fetchJourneyTimeline error:", error);

    return res.status(500).json({
      error: "Failed to fetch journey timeline",
    });

  }
}