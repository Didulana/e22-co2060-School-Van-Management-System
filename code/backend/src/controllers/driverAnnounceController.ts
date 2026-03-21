import { Request, Response } from "express";
import { pool } from "../config/db";

/**
 * POST / — Send announcement to all parents on the driver's route
 */
export const sendAnnouncement = async (req: Request, res: Response) => {
  try {
    const { driver_id, message } = req.body;

    if (!driver_id || !message) {
      return res.status(400).json({ error: "driver_id and message are required" });
    }

    // Find all parent IDs linked to this driver via parent_students
    const parentsResult = await pool.query(
      `SELECT DISTINCT parent_id FROM parent_students WHERE driver_id = $1`,
      [driver_id]
    );

    if (parentsResult.rows.length === 0) {
      return res.status(404).json({ error: "No parents found for this driver" });
    }

    // Create a notification for each parent
    const insertPromises = parentsResult.rows.map((row) =>
      pool.query(
        `INSERT INTO notifications (parent_id, type, message)
         VALUES ($1, $2, $3)`,
        [row.parent_id, "driver_announcement", message]
      )
    );

    await Promise.all(insertPromises);

    res.status(201).json({
      message: "Announcement sent",
      recipientCount: parentsResult.rows.length,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
