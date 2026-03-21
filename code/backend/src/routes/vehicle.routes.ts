import { Router } from "express";
import * as vehicleController from "../controllers/vehicle.controller";

const router = Router();

/**
 * Create vehicle
 */
router.post("/", vehicleController.createVehicle);

/**
 * Get vehicles
 */
router.get("/", vehicleController.getVehicles);

/**
 * Update vehicle
 */
router.put("/:id", vehicleController.updateVehicle);

/**
 * Delete vehicle
 */
router.delete("/:id", vehicleController.deleteVehicle);

export default router;
