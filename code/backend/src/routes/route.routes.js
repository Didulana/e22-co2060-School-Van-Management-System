const express = require("express");
const router = express.Router();

const routeController = require("../controllers/route.controller");

/**
 * Create route
 */
router.post("/", routeController.createRoute);

/**
 * Get all routes
 * Optional filter: /api/routes?driver_id=1
 */
router.get("/", routeController.getRoutes);

module.exports = router;