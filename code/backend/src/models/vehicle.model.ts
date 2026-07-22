import { Pool, PoolClient } from "pg";
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
export const createVehicle = async (vehicle: Vehicle, client: Pool | PoolClient = db): Promise<Vehicle> => {
  const { vehicle_number, type, capacity, is_ac } = vehicle;

  const query = `
    INSERT INTO vehicles (vehicle_number, type, capacity, is_ac)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;

  const values = [vehicle_number, type, capacity, is_ac || false];

  const result = await client.query(query, values);
  return result.rows[0];
};

export const getVehicleByNumber = async (vehicleNumber: string, client: Pool | PoolClient = db): Promise<Vehicle | null> => {
  const result = await client.query("SELECT * FROM vehicles WHERE vehicle_number = $1", [vehicleNumber]);
  return result.rows[0] || null;
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
export const updateVehicle = async (id: number, vehicle: Partial<Vehicle>, client: Pool | PoolClient = db): Promise<Vehicle> => {
  const { vehicle_number, type, capacity, is_ac } = vehicle;

  const query = `
    UPDATE vehicles
    SET vehicle_number = COALESCE($1, vehicle_number),
        type = COALESCE($2, type),
        capacity = COALESCE($3, capacity),
        is_ac = COALESCE($4, is_ac)
    WHERE id = $5
    RETURNING *;
  `;

  const values = [vehicle_number, type, capacity, is_ac, id];

  const result = await client.query(query, values);
  return result.rows[0];
};

/**
 * Delete vehicle
 */
export const deleteVehicle = async (id: number): Promise<void> => {
  const query = "DELETE FROM vehicles WHERE id = $1;";
  await db.query(query, [id]);
};
