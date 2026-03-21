import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import * as driverModel from "../models/driver.model";
import * as vehicleModel from "../models/vehicle.model";
import * as routeModel from "../models/route.model";
import db from "../config/db";

export async function getPredefinedStops(req: AuthenticatedRequest, res: Response) {
  try {
    const result = await db.query("SELECT * FROM predefined_stops ORDER BY name ASC");
    res.json(result.rows);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch predefined stops", details: error.message });
  }
}

export async function getOnboardingStatus(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user!.id;
    const driver = await driverModel.getDriverByUserId(userId);
    
    if (!driver) {
      return res.json({ completed: false, step: 1 });
    }

    if (!driver.vehicle_id) {
      return res.json({ completed: false, step: 2, driverId: driver.id });
    }

    const routes = await routeModel.getAllRoutes(driver.id);
    if (routes.length === 0) {
      return res.json({ completed: false, step: 3, driverId: driver.id, vehicleId: driver.vehicle_id });
    }

    res.json({ completed: true, driverId: driver.id });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch onboarding status", details: error.message });
  }
}

export async function submitOnboarding(req: AuthenticatedRequest, res: Response) {
  const client = await db.connect();
  try {
    await client.query("BEGIN");
    const userId = req.user!.id;
    const { licenseNumber, vehicleDetails, routeStops } = req.body;

    // 1. Create/Update Driver
    let driver = await driverModel.getDriverByUserId(userId);
    if (!driver) {
      driver = await driverModel.createDriver({ user_id: userId, license_number: licenseNumber });
    } else {
      driver = await driverModel.updateDriver(driver.id!, { license_number: licenseNumber });
    }

    // 2. Create Vehicle
    const vehicle = await vehicleModel.createVehicle({
      vehicle_number: vehicleDetails.registrationNumber,
      type: vehicleDetails.type,
      capacity: vehicleDetails.seatCount,
      is_ac: vehicleDetails.isAc
    });

    // 3. Link Vehicle to Driver
    await driverModel.updateDriver(driver.id!, { vehicle_id: vehicle.id });

    // 4. Create Route
    await routeModel.createRoute({
      route_name: `Route for Driver ${driver.id}`,
      driver_id: driver.id!,
      vehicle_id: vehicle.id!,
      schedule: "Morning: 6:30 AM, Afternoon: 1:30 PM",
      stops: routeStops.map((stop: any, index: number) => ({
        stop_name: stop.name,
        stop_order: index + 1,
        latitude: stop.latitude,
        longitude: stop.longitude
      }))
    });

    await client.query("COMMIT");
    res.status(201).json({ message: "Onboarding completed successfully" });
  } catch (error: any) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: "Failed to complete onboarding", details: error.message });
  } finally {
    client.release();
  }
}
