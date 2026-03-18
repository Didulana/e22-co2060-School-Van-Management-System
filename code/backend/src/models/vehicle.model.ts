import db from "../config/db";

export interface Vehicle {
  id?: number;
  vehicle_number: string;
  type: string;
  capacity: number;
}

/**
 * Create vehicle
 */
export const createVehicle = async (vehicle: Vehicle): Promise<Vehicle> => {
  const { vehicle_number, type, capacity } = vehicle;

  const query = `
    INSERT INTO vehicles (vehicle_number, type, capacity)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;

  const values = [vehicle_number, type, capacity];

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
  const { vehicle_number, type, capacity } = vehicle;

  const query = `
    UPDATE vehicles
    SET vehicle_number = $1,
        type = $2,
        capacity = $3
    WHERE id = $4
    RETURNING *;
  `;

  const values = [vehicle_number, type, capacity, id];

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
