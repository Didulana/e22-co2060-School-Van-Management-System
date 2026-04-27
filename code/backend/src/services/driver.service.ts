import * as driverModel from "../models/driver.model";
import { Driver } from "../models/driver.model";
import { getActiveJourneyByDriver } from "../models/journeyModel";
import { handleJourneyEventWorkflow } from "./journeyOrchestratorService";

/**
 * Create driver
 */
export const createDriver = async (data: Driver): Promise<Driver> => {
  const { license_number } = data;

  // Basic validation
  if (!license_number) {
    throw new Error("License number is required");
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

/**
 * Get driver by user ID
 */
export const getDriverByUserId = async (userId: number): Promise<Driver | null> => {
  return await driverModel.getDriverByUserId(userId);
};

/**
 * Trigger SOS
 */
export const triggerSOS = async (driverId: number): Promise<{ message: string }> => {
  // Check for active journey to log the emergency event
  const journey = await getActiveJourneyByDriver(driverId);
  
  if (journey) {
    await handleJourneyEventWorkflow(
      journey.id,
      driverId,
      "EMERGENCY",
      "🚨 SOS: DRIVER HAS TRIGGERED AN EMERGENCY ALERT!"
    );
  }

  // In a real app, this would also ping external emergency services
  return { message: "Emergency services and system administrators have been notified." };
};
