import * as vehicleModel from "../models/vehicle.model";
import { Vehicle } from "../models/vehicle.model";

/**
 * Create vehicle
 */
export const createVehicle = async (data: Vehicle): Promise<Vehicle> => {
  const { vehicle_number, type, capacity } = data;

  if (!vehicle_number || !type || !capacity) {
    throw new Error("All fields are required");
  }

  return await vehicleModel.createVehicle(data);
};

/**
 * Get all vehicles
 */
export const getVehicles = async (): Promise<Vehicle[]> => {
  return await vehicleModel.getAllVehicles();
};

/**
 * Update vehicle
 */
export const updateVehicle = async (id: number, data: Vehicle): Promise<Vehicle> => {
  return await vehicleModel.updateVehicle(id, data);
};

/**
 * Delete vehicle
 */
export const deleteVehicle = async (id: number): Promise<void> => {
  return await vehicleModel.deleteVehicle(id);
};
