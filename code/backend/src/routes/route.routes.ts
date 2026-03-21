import { Router } from "express";
import * as routeController from "../controllers/route.controller";

const router = Router();

/**
 * Create route
 */
router.post("/", routeController.createRoute);

/**
 * Get all routes
 * Optional filter: /api/routes?driver_id=1
 */
router.get("/", routeController.getRoutes);

export default router;
