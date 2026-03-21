import { Router } from "express";
import {
  createNotification,
  getNotifications,
  markAsRead,
  getUnreadCount
} from "../controllers/notificationController";
import { authenticateToken } from "../middleware/authMiddleware";


const router = Router();
router.post("/", authenticateToken, createNotification);
router.get("/", authenticateToken, getNotifications);
router.patch("/:id/read", authenticateToken, markAsRead);
router.get("/unread-count", authenticateToken, getUnreadCount);

export default router;