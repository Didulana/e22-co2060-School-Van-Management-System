import { Request, Response } from "express";
import * as vehicleService from "../services/vehicle.service";

/**
 * Create vehicle
 */
export const createVehicle = async (req: Request, res: Response) => {
  try {
    const vehicle = await vehicleService.createVehicle(req.body);
    res.status(201).json(vehicle);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Get vehicles
 */
export const getVehicles = async (req: Request, res: Response) => {
  try {
    const vehicles = await vehicleService.getVehicles();
    res.json(vehicles);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Update vehicle
 */
export const updateVehicle = async (req: Request, res: Response) => {
  try {
    const vehicleId = parseInt(req.params.id as string, 10);
    const vehicle = await vehicleService.updateVehicle(vehicleId, req.body);
    res.json(vehicle);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Delete vehicle
 */
export const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const vehicleId = parseInt(req.params.id as string, 10);
    await vehicleService.deleteVehicle(vehicleId);
    res.json({ message: "Vehicle deleted" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
