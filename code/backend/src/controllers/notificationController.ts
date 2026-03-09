import { Request, Response } from "express";
import { sendJourneyNotification } from "../services/notificationService";
import { getNotificationsByJourney } from "../models/notificationModel";

export async function createNotification(req: Request, res: Response) {
  try {
    const { journeyId, type, message } = req.body;

    if (!journeyId || !type || !message) {
      return res.status(400).json({
        error: "Missing notification fields",
      });
    }

    await sendJourneyNotification(journeyId, type, message);

    return res.json({
      status: "notification sent",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Notification failed",
    });
  }
}

export async function getNotifications(req: Request, res: Response) {
  try {
    const { journeyId } = req.query;

    if (!journeyId) {
      return res.status(400).json({
        error: "journeyId required",
      });
    }

    const notifications = await getNotificationsByJourney(
      Number(journeyId)
    );

    return res.json({
      count: notifications.length,
      data: notifications,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Failed to fetch notifications",
    });
  }
}