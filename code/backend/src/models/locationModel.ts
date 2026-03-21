import { pool } from "../config/db";

export interface LocationRecord {
  driverId: number;
  journeyId: number;
  lat: number;
  lng: number;
  timestamp?: string;
}

export async function saveLocation(record: LocationRecord): Promise<void> {
  const query = `
    INSERT INTO journey_locations (
      driver_id,
      journey_id,
      latitude,
      longitude,
      recorded_at
    )
    VALUES ($1, $2, $3, $4, $5)
  `;

  const values = [
    record.driverId,
    record.journeyId,
    record.lat,
    record.lng,
    record.timestamp || new Date().toISOString(),
  ];

  await pool.query(query, values);
}

export async function getLatestLocations() {
  const query = `
    SELECT
      id,
      driver_id,
      journey_id,
      latitude,
      longitude,
      recorded_at
    FROM journey_locations
    ORDER BY recorded_at DESC
    LIMIT 20
  `;

  const result = await pool.query(query);
  return result.rows;
}