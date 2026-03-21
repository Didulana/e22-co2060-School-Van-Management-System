import { pool } from "../config/db";

interface NotificationRecord {
  journeyId: number;
  userId?: number;
  studentId?: number;
  type: string;
  message: string;
}

export async function saveNotification(record: NotificationRecord) {
  const query = `
    INSERT INTO notifications (
      journey_id,
      user_id,
      student_id,
      type,
      message
    )
    VALUES ($1, $2, $3, $4, $5)
  `;

  const values = [
    record.journeyId,
    record.userId || null,
    record.studentId || null,
    record.type,
    record.message,
  ];

  await pool.query(query, values);
}

export async function getNotificationsByJourney(journeyId: number) {
  const query = `
    SELECT
      id,
      journey_id,
      user_id,
      student_id,
      type,
      message,
      is_read,
      created_at
    FROM notifications
    WHERE journey_id = $1
    ORDER BY created_at DESC
  `;

  const result = await pool.query(query, [journeyId]);

  return result.rows;
}

export async function markNotificationAsRead(id: number) {
  const query = `
    UPDATE notifications
    SET is_read = TRUE
    WHERE id = $1
  `;

  await pool.query(query, [id]);
}

export async function getUnreadNotificationCount(journeyId: number) {
  const query = `
    SELECT COUNT(*) AS unread_count
    FROM notifications
    WHERE journey_id = $1
      AND is_read = FALSE
  `;

  const result = await pool.query(query, [journeyId]);

  return Number(result.rows[0].unread_count);
}