import { pool } from "../config/db";

export async function recordStudentDropoff(
  journeyId: number,
  studentId: number,
  driverId: number
) {
  const query = `
    INSERT INTO student_dropoff (
      journey_id,
      student_id,
      driver_id
    )
    VALUES ($1, $2, $3)
    RETURNING *
  `;

  const result = await pool.query(query, [
    journeyId,
    studentId,
    driverId,
  ]);

  return result.rows[0];
}