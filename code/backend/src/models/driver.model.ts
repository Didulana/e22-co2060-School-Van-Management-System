import db from "../config/db";

export interface Driver {
  id?: number;
  name: string;
  phone: string;
  license_number: string;
  vehicle_id?: number | null;
}

/**
 * Create a new driver
 */
export const createDriver = async (driver: Driver): Promise<Driver> => {
  const { name, phone, license_number } = driver;

  const query = `
    INSERT INTO drivers (name, phone, license_number)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;

  const values = [name, phone, license_number];

  const result = await db.query(query, values);
  return result.rows[0];
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
export const updateDriver = async (id: number, driver: Driver): Promise<Driver> => {
  const { name, phone, license_number } = driver;

  const query = `
    UPDATE drivers
    SET name = $1,
        phone = $2,
        license_number = $3
    WHERE id = $4
    RETURNING *;
  `;

  const values = [name, phone, license_number, id];

  const result = await db.query(query, values);
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
