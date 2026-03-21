import { pool } from "../config/db";

export async function getJourneyTimeline(journeyId: number) {

  const query = `
    SELECT
      'event' as type,
      event_type,
      message,
      created_at as time
    FROM journey_events
    WHERE journey_id = $1

    UNION ALL

    SELECT
      'boarding' as type,
      NULL as event_type,
      CONCAT('Student ', student_id, ' boarded') as message,
      boarded_at as time
    FROM student_boarding
    WHERE journey_id = $1

    UNION ALL

    SELECT
      'dropoff' as type,
      NULL as event_type,
      CONCAT('Student ', student_id, ' dropped') as message,
      dropped_at as time
    FROM student_dropoff
    WHERE journey_id = $1

    UNION ALL

    SELECT
      'notification' as type,
      type as event_type,
      message,
      created_at as time
    FROM notifications
    WHERE journey_id = $1

    ORDER BY time ASC
  `;

  const result = await pool.query(query, [journeyId]);

  return result.rows;
}