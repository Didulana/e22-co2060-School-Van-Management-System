import { Router } from "express";
import { authenticateToken, requireRole } from "../middleware/authMiddleware";
import * as parentController from "../controllers/parentController";

const router = Router();

// All routes here require parent role
router.use(authenticateToken);
router.use(requireRole("parent"));

router.get("/children", parentController.getChildren);
router.post("/children", parentController.registerChild);
router.put("/children/:id", parentController.updateChild);
router.post("/children/:id/absent", parentController.markAbsent);
router.get("/journey-history", parentController.getHistory);
router.get("/emergency-contacts", parentController.getEmergencyContacts);
router.get("/available-routes", parentController.getAvailableRoutes);

export default router;