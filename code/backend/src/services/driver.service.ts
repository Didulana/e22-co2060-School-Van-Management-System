import * as driverModel from "../models/driver.model";
import { Driver } from "../models/driver.model";

/**
 * Create driver
 */
export const createDriver = async (data: Driver): Promise<Driver> => {
  const { name, phone, license_number } = data;

  // Basic validation
  if (!name || !phone || !license_number) {
    throw new Error("All fields are required");
  }

  return await driverModel.createDriver(data);
};

/**
 * Get all drivers
 */
export const getDrivers = async (): Promise<Driver[]> => {
  return await driverModel.getAllDrivers();
};

/**
 * Update driver
 */
export const updateDriver = async (id: number, data: Driver): Promise<Driver> => {
  return await driverModel.updateDriver(id, data);
};

/**
 * Delete driver
 */
export const deleteDriver = async (id: number): Promise<void> => {
  return await driverModel.deleteDriver(id);
};

/**
 * Assign vehicle to driver
 */
export const assignVehicle = async (driverId: number, vehicleId: number): Promise<Driver> => {
  if (!vehicleId) {
    throw new Error("Vehicle ID is required");
  }

  return await driverModel.assignVehicle(driverId, vehicleId);
};
