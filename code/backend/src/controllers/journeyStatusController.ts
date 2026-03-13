import { Request, Response } from "express";
import {
  getLatestLocation,
  getBoardedCount,
  getDroppedCount,
  getNotificationCount,
} from "../models/journeyStatusModel";

export async function getJourneyStatus(req: Request, res: Response) {
  try {
    const journeyId = Number(req.params.id);

    if (!journeyId || Number.isNaN(journeyId)) {
      return res.status(400).json({
        error: "Invalid journey id",
      });
    }

    const latestLocation = await getLatestLocation(journeyId);
    const boardedCount = await getBoardedCount(journeyId);
    const droppedCount = await getDroppedCount(journeyId);
    const notifications = await getNotificationCount(journeyId);

    return res.json({
      journeyId,
      latestLocation,
      boardedCount,
      droppedCount,
      notifications,
    });
  } catch (error) {
    console.error("getJourneyStatus error:", error);

    return res.status(500).json({
      error: "Failed to fetch journey status",
    });
  }
}