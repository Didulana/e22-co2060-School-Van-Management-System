import { pool } from "../config/db";

export async function saveJourneyEvent(
  journeyId: number,
  driverId: number,
  eventType: string,
  message: string
) {
  const query = `
    INSERT INTO journey_events (
      journey_id,
      driver_id,
      event_type,
      message
    )
    VALUES ($1, $2, $3, $4)
  `;

  await pool.query(query, [
    journeyId,
    driverId,
    eventType,
    message,
  ]);
}

export async function getJourneyEventsByJourneyId(journeyId: number) {
  const query = `
    SELECT
      id,
      journey_id,
      driver_id,
      event_type,
      message,
      created_at
    FROM journey_events
    WHERE journey_id = $1
    ORDER BY created_at DESC
  `;

  const result = await pool.query(query, [journeyId]);
  return result.rows;
}