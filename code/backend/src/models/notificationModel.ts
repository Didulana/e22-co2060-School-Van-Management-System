import { pool } from "../config/db";

interface NotificationRecord {
  journeyId: number;
  userId?: number;
  type: string;
  message: string;
}

export async function saveNotification(record: NotificationRecord) {
  const query = `
    INSERT INTO notifications (journey_id, user_id, type, message)
    VALUES ($1, $2, $3, $4)
  `;

  const values = [
    record.journeyId,
    record.userId || null,
    record.type,
    record.message,
  ];

  await pool.query(query, values);
}