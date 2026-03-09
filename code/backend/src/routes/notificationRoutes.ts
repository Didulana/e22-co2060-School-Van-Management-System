import { Router } from "express";
import {
  createNotification,
  getNotifications
} from "../controllers/notificationController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

router.post("/", authenticateToken, createNotification);
router.get("/", authenticateToken, getNotifications);

export default router;