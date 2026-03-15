import { pool } from "../config/db";

export async function getChildrenByParentId(parentId: number) {
  const query = `
    SELECT
      student_id
    FROM parent_students
    WHERE parent_id = $1
    ORDER BY student_id ASC
  `;

  const result = await pool.query(query, [parentId]);
  return result.rows;
}

export async function getLatestBoardingForStudent(studentId: number) {
  const query = `
    SELECT
      id,
      journey_id,
      student_id,
      driver_id,
      boarded_at
    FROM student_boarding
    WHERE student_id = $1
    ORDER BY boarded_at DESC
    LIMIT 1
  `;

  const result = await pool.query(query, [studentId]);
  return result.rows[0] || null;
}

export async function getLatestDropoffForStudent(studentId: number) {
  const query = `
    SELECT
      id,
      journey_id,
      student_id,
      driver_id,
      dropped_at
    FROM student_dropoff
    WHERE student_id = $1
    ORDER BY dropped_at DESC
    LIMIT 1
  `;

  const result = await pool.query(query, [studentId]);
  return result.rows[0] || null;
}

export async function getLatestLocationByJourneyId(journeyId: number) {
  const query = `
    SELECT
      latitude,
      longitude,
      recorded_at
    FROM journey_locations
    WHERE journey_id = $1
    ORDER BY recorded_at DESC
    LIMIT 1
  `;

  const result = await pool.query(query, [journeyId]);
  return result.rows[0] || null;
}

export async function getNotificationsByStudentId(studentId: number) {
  const query = `
    SELECT
      id,
      journey_id,
      student_id,
      type,
      message,
      is_read,
      created_at
    FROM notifications
    WHERE student_id = $1
    ORDER BY created_at DESC
  `;

  const result = await pool.query(query, [studentId]);
  return result.rows;
}