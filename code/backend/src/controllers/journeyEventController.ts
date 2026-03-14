import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { handleJourneyEventWorkflow } from "../services/journeyOrchestratorService";
import { getJourneyEventsByJourneyId } from "../models/journeyEventModel";

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

    await handleJourneyEventWorkflow(
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

export async function getJourneyEvents(req: AuthenticatedRequest, res: Response) {
  try {
    const journeyId = Number(req.params.journeyId);

    if (!journeyId || Number.isNaN(journeyId)) {
      return res.status(400).json({
        error: "Invalid journey id",
      });
    }

    const events = await getJourneyEventsByJourneyId(journeyId);

    return res.json({
      journeyId,
      count: events.length,
      data: events,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Failed to fetch journey events",
    });
  }
}