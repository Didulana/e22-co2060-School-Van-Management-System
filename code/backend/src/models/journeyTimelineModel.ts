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
      CONCAT(COALESCE(s.nickname, s.name, 'Student '), ' boarded') as message,
      boarded_at as time
    FROM student_boarding sb
    LEFT JOIN students s ON sb.student_id = s.id
    WHERE journey_id = $1

    UNION ALL

    SELECT
      'dropoff' as type,
      NULL as event_type,
      CONCAT(COALESCE(s.nickname, s.name, 'Student '), ' dropped') as message,
      dropped_at as time
    FROM student_dropoff sd
    LEFT JOIN students s ON sd.student_id = s.id
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