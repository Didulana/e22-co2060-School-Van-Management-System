const express = require("express");
const router = express.Router();

const driverController = require("../controllers/driver.controller");

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

module.exports = router;