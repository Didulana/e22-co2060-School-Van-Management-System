import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { triggerJourneyEvent } from "../services/journeyEventService";

export async function createJourneyEvent(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const { journeyId, type, message } = req.body;

    if (!req.user) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    if (!journeyId || !type) {
      return res.status(400).json({
        error: "Missing fields",
      });
    }

    await triggerJourneyEvent(
      journeyId,
      req.user.id,
      type,
      message || ""
    );

    return res.json({
      status: "event recorded",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Event failed",
    });
  }
}