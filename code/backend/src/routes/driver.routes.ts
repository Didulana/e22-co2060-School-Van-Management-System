import { Router } from "express";
import * as driverController from "../controllers/driver.controller";
import { getPredefinedStops, getOnboardingStatus, submitOnboarding } from "../controllers/onboardingController";

const router = Router();

router.get("/onboarding/status", getOnboardingStatus);
router.get("/onboarding/stops", getPredefinedStops);
router.post("/onboarding/submit", submitOnboarding);

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
 * Trigger SOS / Emergency alert
 */
router.post("/sos", driverController.triggerSOS);

export default router;
