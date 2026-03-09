import { Router } from "express";
import { createNotification } from "../controllers/notificationController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

router.post("/", authenticateToken, createNotification);

export default router;