import { pool } from "../config/db";

export async function getLatestLocation(journeyId: number) {
  const query = `
    SELECT latitude, longitude, recorded_at
    FROM journey_locations
    WHERE journey_id = $1
    ORDER BY recorded_at DESC
    LIMIT 1
  `;

  const result = await pool.query(query, [journeyId]);

  return result.rows[0] || null;
}

export async function getBoardedCount(journeyId: number) {
  const query = `
    SELECT COUNT(*) AS count
    FROM student_boarding
    WHERE journey_id = $1
  `;

  const result = await pool.query(query, [journeyId]);

  return Number(result.rows[0].count);
}

export async function getDroppedCount(journeyId: number) {
  const query = `
    SELECT COUNT(*) AS count
    FROM student_dropoff
    WHERE journey_id = $1
  `;

  const result = await pool.query(query, [journeyId]);

  return Number(result.rows[0].count);
}

export async function getNotificationCount(journeyId: number) {
  const query = `
    SELECT COUNT(*) AS count
    FROM notifications
    WHERE journey_id = $1
  `;

  const result = await pool.query(query, [journeyId]);

  return Number(result.rows[0].count);
}