import { Router } from "express";
import * as driverController from "../controllers/driver.controller";

const router = Router();

/**
 * Create driver
 */
router.post("/", driverController.createDriver);

/**
 * Get all drivers
 */
router.get("/", driverController.getDrivers);

/**
 * Update driver
 */
router.put("/:id", driverController.updateDriver);

/**
 * Delete driver
 */
router.delete("/:id", driverController.deleteDriver);

/**
 * Assign vehicle to driver
 */
router.put("/:id/assign-vehicle", driverController.assignVehicle);

export default router;
