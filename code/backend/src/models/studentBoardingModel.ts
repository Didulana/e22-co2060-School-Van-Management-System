import { pool } from "../config/db";

export async function recordStudentBoarding(
  journeyId: number,
  studentId: number,
  driverId: number
) {
  const query = `
    INSERT INTO student_boarding (
      journey_id,
      student_id,
      driver_id
    )
    VALUES ($1,$2,$3)
  `;

  await pool.query(query, [journeyId, studentId, driverId]);
}