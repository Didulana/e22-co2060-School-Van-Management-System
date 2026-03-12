const express = require("express");
const router = express.Router();

const vehicleController = require("../controllers/vehicle.controller");

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

module.exports = router;