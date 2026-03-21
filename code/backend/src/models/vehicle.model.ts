import db from "../config/db";

export interface Vehicle {
  id?: number;
  vehicle_number: string;
  type: string;
  capacity: number;
  is_ac?: boolean;
}

/**
 * Create vehicle
 */
export const createVehicle = async (vehicle: Vehicle): Promise<Vehicle> => {
  const { vehicle_number, type, capacity, is_ac } = vehicle;

  const query = `
    INSERT INTO vehicles (vehicle_number, type, capacity, is_ac)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;

  const values = [vehicle_number, type, capacity, is_ac || false];

  const result = await db.query(query, values);
  return result.rows[0];
};

/**
 * Get all vehicles
 */
export const getAllVehicles = async (): Promise<Vehicle[]> => {
  const result = await db.query("SELECT * FROM vehicles ORDER BY id;");
  return result.rows;
};

/**
 * Update vehicle
 */
export const updateVehicle = async (id: number, vehicle: Vehicle): Promise<Vehicle> => {
  const { vehicle_number, type, capacity, is_ac } = vehicle;

  const query = `
    UPDATE vehicles
    SET vehicle_number = $1,
        type = $2,
        capacity = $3,
        is_ac = $4
    WHERE id = $5
    RETURNING *;
  `;

  const values = [vehicle_number, type, capacity, is_ac, id];

  const result = await db.query(query, values);
  return result.rows[0];
};

/**
 * Delete vehicle
 */
export const deleteVehicle = async (id: number): Promise<void> => {
  const query = "DELETE FROM vehicles WHERE id = $1;";
  await db.query(query, [id]);
};
