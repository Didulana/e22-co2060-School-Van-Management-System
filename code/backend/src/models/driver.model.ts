import { Pool, PoolClient } from "pg";
import db from "../config/db";

export interface Driver {
  id?: number;
  user_id: number;
  license_number: string;
  vehicle_id?: number | null;
  license_image?: string | null;
  license_expiry?: string | null;
}

/**
 * Create a new driver
 */
export const createDriver = async (driver: Driver, client: Pool | PoolClient = db): Promise<Driver> => {
  const { user_id, license_number, license_image, license_expiry } = driver;

  const query = `
    INSERT INTO drivers (user_id, license_number, license_image, license_expiry)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;

  const values = [user_id, license_number, license_image || null, license_expiry || null];

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
  const { license_number, vehicle_id, license_image, license_expiry } = driver;

  const query = `
    UPDATE drivers
    SET license_number = COALESCE($1, license_number),
        vehicle_id = COALESCE($2, vehicle_id),
        license_image = COALESCE($3, license_image),
        license_expiry = COALESCE($4, license_expiry)
    WHERE id = $5
    RETURNING *;
  `;

  const values = [license_number, vehicle_id, license_image, license_expiry, id];

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

/**
 * Get schools covered by a driver
 */
export const getDriverSchools = async (driverId: number): Promise<{ id: number; name: string }[]> => {
  const result = await db.query(
    `SELECT s.id, s.name FROM driver_schools ds JOIN schools s ON ds.school_id = s.id WHERE ds.driver_id = $1 ORDER BY s.name`,
    [driverId]
  );
  return result.rows;
};

/**
 * Set schools for a driver (replace all)
 */
export const setDriverSchools = async (driverId: number, schoolIds: number[], client: Pool | PoolClient = db): Promise<void> => {
  await client.query("DELETE FROM driver_schools WHERE driver_id = $1", [driverId]);
  for (const schoolId of schoolIds) {
    await client.query(
      "INSERT INTO driver_schools (driver_id, school_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
      [driverId, schoolId]
    );
  }
};

/**
 * Get full driver profile for admin review (joins users + drivers + vehicles + schools)
 */
export const getDriverFullProfile = async (userId: number): Promise<any> => {
  const result = await db.query(`
    SELECT 
      u.id as user_id, u.name, u.email, u.phone, u.nic, u.address, u.province, u.dob,
      u.selfie_url, u.is_approved, u.created_at,
      d.id as driver_id, d.license_number, d.license_image, d.license_expiry,
      v.id as vehicle_id, v.vehicle_number, v.type as vehicle_type, v.capacity as seat_count, v.is_ac
    FROM users u
    LEFT JOIN drivers d ON u.id = d.user_id
    LEFT JOIN vehicles v ON d.vehicle_id = v.id
    WHERE u.id = $1 AND u.role = 'driver'
  `, [userId]);

  if (result.rows.length === 0) return null;

  const row = result.rows[0];
  
  // Get schools
  let schools: any[] = [];
  if (row.driver_id) {
    schools = await getDriverSchools(row.driver_id);
  }

  return {
    ...row,
    schools
  };
};
