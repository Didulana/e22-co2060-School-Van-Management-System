import { Request, Response } from "express";
import { pool } from "../config/db";

/**
 * POST / — Send announcement to all parents on the driver's route
 */
export const sendAnnouncement = async (req: any, res: Response) => {
  try {
    const userId = req.user!.id;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "message is required" });
    }

    // Find the driver ID from user ID
    const driverRes = await pool.query(`SELECT id FROM drivers WHERE user_id = $1`, [userId]);
    if (driverRes.rows.length === 0) {
      return res.status(404).json({ error: "Driver profile not found for this user account" });
    }
    const driver_id = driverRes.rows[0].id;

    // Find all parent IDs linked to this driver via their assigned routes and students
    const parentsResult = await pool.query(
      `SELECT DISTINCT ps.parent_id 
       FROM routes r
       JOIN route_stops rs ON r.id = rs.route_id
       JOIN students s ON (s.pickup_stop_id = rs.id OR s.dropoff_stop_id = rs.id)
       JOIN parent_students ps ON s.id = ps.student_id
       WHERE r.driver_id = $1`,
      [driver_id]
    );

    if (parentsResult.rows.length === 0) {
      return res.status(404).json({ error: "No parents found for this driver's route stops" });
    }

    // Create a notification for each parent
    const insertPromises = parentsResult.rows.map((row) =>
      pool.query(
        `INSERT INTO notifications (journey_id, user_id, type, message)
         VALUES ($1, $2, $3, $4)`,
        [0, row.parent_id, "driver_announcement", message]
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
