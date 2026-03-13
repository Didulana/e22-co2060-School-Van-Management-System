import { Request, Response } from "express";
import {
  getLatestLocation,
  getBoardedCount,
  getDroppedCount,
  getNotificationCount
} from "../models/journeyStatusModel";

export async function getJourneyStatus(req: Request, res: Response) {
  try {
    const journeyId = Number(req.params.id);

    const location = await getLatestLocation(journeyId);
    const boarded = await getBoardedCount(journeyId);
    const dropped = await getDroppedCount(journeyId);
    const notifications = await getNotificationCount(journeyId);

    return res.json({
      journeyId,
      latestLocation: location,
      boardedCount: boarded,
      droppedCount: dropped,
      notifications
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Failed to fetch journey status"
    });
  }
}