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

    let vehicle = null;
    if (driver.vehicle_id) {
      vehicle = await vehicleModel.getVehicleById(driver.vehicle_id);
    }

    const schools = driver.id ? await driverModel.getDriverSchools(driver.id) : [];
    const routes = driver.id ? await routeModel.getAllRoutes(driver.id) : [];
    const stops = routes.length > 0 && routes[0].stops ? routes[0].stops : [];

    res.json({
      completed: routes.length > 0 && schools.length > 0,
      step: 1,
      driverId: driver.id,
      driver: {
        license_number: driver.license_number,
        license_image: driver.license_image,
        license_expiry: driver.license_expiry,
      },
      vehicle: vehicle ? {
        registrationNumber: vehicle.vehicle_number,
        type: vehicle.type,
        seatCount: vehicle.capacity,
        isAc: vehicle.is_ac,
      } : null,
      selectedSchoolIds: schools.map((s: any) => s.id),
      routeStops: stops.map((st: any) => ({
        name: st.stop_name,
        latitude: parseFloat(st.latitude),
        longitude: parseFloat(st.longitude),
      })),
    });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch onboarding status", details: error.message });
  }
}

export async function submitOnboarding(req: AuthenticatedRequest, res: Response) {
  const client = await db.connect();
  try {
    await client.query("BEGIN");
    console.log(`[Onboarding] Starting submission for user ${req.user!.id}`);
    
    const userId = req.user!.id;
    const { licenseNumber, licenseImage, licenseExpiry, vehicleDetails, routeStops, schoolIds } = req.body;

    // Validate required fields
    if (!licenseNumber || typeof licenseNumber !== "string" || !licenseNumber.trim()) {
      await client.query("ROLLBACK");
      res.status(400).json({ error: "Driving licence number is required." });
      return;
    }

    if (!vehicleDetails || !vehicleDetails.registrationNumber || typeof vehicleDetails.registrationNumber !== "string" || !vehicleDetails.registrationNumber.trim()) {
      await client.query("ROLLBACK");
      res.status(400).json({ error: "Vehicle registration number is required." });
      return;
    }

    if (!routeStops || !Array.isArray(routeStops) || routeStops.length < 2) {
      await client.query("ROLLBACK");
      res.status(400).json({ error: "At least start and end route locations are required." });
      return;
    }

    // 1. Create/Update Driver
    let driver = await driverModel.getDriverByUserId(userId, client);
    if (!driver) {
      driver = await driverModel.createDriver({
        user_id: userId,
        license_number: licenseNumber.trim(),
        license_image: licenseImage || null,
        license_expiry: licenseExpiry || null
      }, client);
    } else {
      driver = await driverModel.updateDriver(driver.id!, {
        license_number: licenseNumber.trim(),
        license_image: licenseImage || undefined,
        license_expiry: licenseExpiry || undefined
      }, client);
    }
    console.log(`[Onboarding] Driver ${driver.id} ready`);

    // 1b. Set schools if provided
    if (schoolIds && Array.isArray(schoolIds) && schoolIds.length > 0) {
      await driverModel.setDriverSchools(driver.id!, schoolIds, client);
      console.log(`[Onboarding] Driver ${driver.id} linked to ${schoolIds.length} schools`);
    }

    // 2. Create/Update Vehicle
    let vehicle = await vehicleModel.getVehicleByNumber(vehicleDetails.registrationNumber.trim(), client);
    if (!vehicle) {
      vehicle = await vehicleModel.createVehicle({
        vehicle_number: vehicleDetails.registrationNumber.trim(),
        type: vehicleDetails.type || "Van",
        capacity: vehicleDetails.seatCount || 12,
        is_ac: !!vehicleDetails.isAc
      }, client);
      console.log(`[Onboarding] New vehicle ${vehicle.id} created`);
    } else {
      vehicle = await vehicleModel.updateVehicle(vehicle.id!, {
        type: vehicleDetails.type || "Van",
        capacity: vehicleDetails.seatCount || 12,
        is_ac: !!vehicleDetails.isAc
      }, client);
      console.log(`[Onboarding] Existing vehicle ${vehicle.id} updated`);
    }

    // 3. Link Vehicle to Driver
    await driverModel.updateDriver(driver.id!, { vehicle_id: vehicle.id }, client);

    // 4. In-place Route Management (avoids deleting route rows linked to journeys by FK ON DELETE RESTRICT)
    const existingRouteRes = await client.query(
      `SELECT id FROM routes WHERE driver_id = $1 ORDER BY id ASC LIMIT 1`,
      [driver.id!]
    );

    let routeId: number;
    let oldStops: any[] = [];

    if (existingRouteRes.rows.length > 0) {
      routeId = existingRouteRes.rows[0].id;
      await client.query(
        `UPDATE routes SET vehicle_id = $1, route_name = $2, schedule = $3 WHERE id = $4`,
        [vehicle.id!, "Standard Daily Route", "Morning & Afternoon Service", routeId]
      );
      const oldStopsRes = await client.query(
        `SELECT id, stop_name FROM route_stops WHERE route_id = $1`,
        [routeId]
      );
      oldStops = oldStopsRes.rows;
      // Delete old stops belonging to this route (route_stops has CASCADE and is safe to clear)
      await client.query(`DELETE FROM route_stops WHERE route_id = $1`, [routeId]);
      console.log(`[Onboarding] Existing route ${routeId} updated and stops refreshed`);
    } else {
      const newRouteRes = await client.query(
        `INSERT INTO routes (route_name, driver_id, vehicle_id, schedule)
         VALUES ($1, $2, $3, $4)
         RETURNING id`,
        ["Standard Daily Route", driver.id!, vehicle.id!, "Morning & Afternoon Service"]
      );
      routeId = newRouteRes.rows[0].id;
      console.log(`[Onboarding] New route ${routeId} created`);
    }

    // 5. Insert new route stops
    const insertedStops: any[] = [];
    for (let i = 0; i < routeStops.length; i++) {
      const stop = routeStops[i];
      const stopResult = await client.query(
        `INSERT INTO route_stops (route_id, stop_name, stop_order, latitude, longitude)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [routeId, stop.name, i + 1, stop.latitude, stop.longitude]
      );
      insertedStops.push(stopResult.rows[0]);
    }
    console.log(`[Onboarding] Inserted ${insertedStops.length} stops for route ${routeId}`);

    // Clean up any extra redundant routes for this driver without journeys
    await client.query(
      `DELETE FROM routes 
       WHERE driver_id = $1 
         AND id != $2 
         AND id NOT IN (SELECT DISTINCT route_id FROM journeys WHERE route_id IS NOT NULL)`,
      [driver.id!, routeId]
    );

    // Migrate student stop mappings from old stop IDs to new stop IDs by matching stop names
    if (insertedStops.length > 0 && oldStops.length > 0) {
      for (const oldStop of oldStops) {
        const matchingNewStop = insertedStops.find(
          (ns: any) => ns.stop_name.toLowerCase().trim() === oldStop.stop_name.toLowerCase().trim()
        );
        if (matchingNewStop) {
          // Update students table
          await client.query(
            `UPDATE students SET pickup_stop_id = $1 WHERE pickup_stop_id = $2`,
            [matchingNewStop.id, oldStop.id]
          );
          await client.query(
            `UPDATE students SET dropoff_stop_id = $1 WHERE dropoff_stop_id = $2`,
            [matchingNewStop.id, oldStop.id]
          );
          console.log(`[Onboarding] Migrated students from old stop ID ${oldStop.id} to new stop ID ${matchingNewStop.id} (${oldStop.stop_name})`);
        }
      }
    }

    await client.query("COMMIT");
    console.log(`[Onboarding] Success for user ${userId}`);
    res.status(201).json({ message: "Onboarding completed successfully" });
  } catch (error: any) {
    await client.query("ROLLBACK");
    console.error(`[Onboarding] ERROR for user ${req.user!.id}:`, error.message);

    if (error.code === "23505") {
      if (error.constraint && error.constraint.includes("license_number")) {
        res.status(400).json({ error: "This driver's license number is already registered to another driver." });
        return;
      }
      if (error.constraint && error.constraint.includes("vehicle_number")) {
        res.status(400).json({ error: "This vehicle registration number is already registered to another driver." });
        return;
      }
      res.status(400).json({ error: `Duplicate entry conflict: ${error.detail || error.message}` });
      return;
    }

    res.status(500).json({ error: "Failed to complete onboarding", details: error.message });
  } finally {
    client.release();
  }
}
