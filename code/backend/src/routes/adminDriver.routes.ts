import { Router } from "express";
import * as driverController from "../controllers/driver.controller";

const router = Router();

router.post("/", driverController.createDriver);
router.get("/", driverController.getDrivers);
router.put("/:id", driverController.updateDriver);
router.delete("/:id", driverController.deleteDriver);

export default router;
