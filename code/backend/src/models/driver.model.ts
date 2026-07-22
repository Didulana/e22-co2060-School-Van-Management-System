import { Pool, PoolClient } from "pg";
import db from "../config/db";

export interface Driver {
  id?: number;
  user_id: number;
  license_number: string;
  vehicle_id?: number | null;
}

/**
 * Create a new driver
 */
export const createDriver = async (driver: Driver, client: Pool | PoolClient = db): Promise<Driver> => {
  const { user_id, license_number } = driver;

  const query = `
    INSERT INTO drivers (user_id, license_number)
    VALUES ($1, $2)
    RETURNING *;
  `;

  const values = [user_id, license_number];

  const result = await client.query(query, values);
  return result.rows[0];
};

export const getDriverByUserId = async (userId: number, client: Pool | PoolClient = db): Promise<Driver | null> => {
  const result = await client.query("SELECT * FROM drivers WHERE user_id = $1", [userId]);
  return result.rows[0] || null;
};

/**
 * Get all drivers
 */
export const getAllDrivers = async (): Promise<Driver[]> => {
  const result = await db.query("SELECT * FROM drivers ORDER BY id;");
  return result.rows;
};

/**
 * Update driver
 */
export const updateDriver = async (id: number, driver: Partial<Driver>, client: Pool | PoolClient = db): Promise<Driver> => {
  const { license_number, vehicle_id } = driver;

  const query = `
    UPDATE drivers
    SET license_number = COALESCE($1, license_number),
        vehicle_id = COALESCE($2, vehicle_id)
    WHERE id = $3
    RETURNING *;
  `;

  const values = [license_number, vehicle_id, id];

  const result = await client.query(query, values);
  return result.rows[0];
};

/**
 * Delete driver
 */
export const deleteDriver = async (id: number): Promise<void> => {
  const query = "DELETE FROM drivers WHERE id = $1;";
  await db.query(query, [id]);
};

/**
 * Assign vehicle to driver
 */
export const assignVehicle = async (driverId: number, vehicleId: number): Promise<Driver> => {
  const query = `
    UPDATE drivers
    SET vehicle_id = $1
    WHERE id = $2
    RETURNING *;
  `;

  const result = await db.query(query, [vehicleId, driverId]);
  return result.rows[0];
};
