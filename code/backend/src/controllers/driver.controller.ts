import { Request, Response } from "express";
import * as driverService from "../services/driver.service";

/**
 * Create driver
 */
export const createDriver = async (req: Request, res: Response) => {
  try {
    const driver = await driverService.createDriver(req.body);
    res.status(201).json(driver);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Get all drivers
 */
export const getDrivers = async (req: Request, res: Response) => {
  try {
    const drivers = await driverService.getDrivers();
    res.json(drivers);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Update driver
 */
export const updateDriver = async (req: Request, res: Response) => {
  try {
    const driverId = parseInt(req.params.id as string, 10);
    const driver = await driverService.updateDriver(driverId, req.body);
    res.json(driver);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Delete driver
 */
export const deleteDriver = async (req: Request, res: Response) => {
  try {
    const driverId = parseInt(req.params.id as string, 10);
    await driverService.deleteDriver(driverId);
    res.json({ message: "Driver deleted" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Assign vehicle
 */
export const assignVehicle = async (req: Request, res: Response) => {
  try {
    const driverId = parseInt(req.params.id as string, 10);
    const vehicleId = parseInt(req.body.vehicle_id, 10);
    const driver = await driverService.assignVehicle(driverId, vehicleId);

    res.json(driver);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
