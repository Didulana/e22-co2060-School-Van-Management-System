const express = require("express");
const router = express.Router();

const driverRoutes = require("./driver.routes");
const vehicleRoutes = require("./vehicle.routes");
const routeRoutes = require("./route.routes");

/**
 * Register API routes
 */

router.use("/drivers", driverRoutes);
router.use("/vehicles", vehicleRoutes);
router.use("/routes", routeRoutes);

module.exports = router;