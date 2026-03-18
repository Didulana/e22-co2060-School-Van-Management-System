import { Router } from "express";
import driverRoutes from "./driver.routes";
import vehicleRoutes from "./vehicle.routes";
import routeRoutes from "./route.routes";

const router = Router();

/**
 * Register API routes
 */

router.use("/drivers", driverRoutes);
router.use("/vehicles", vehicleRoutes);
router.use("/routes", routeRoutes);

export default router;
