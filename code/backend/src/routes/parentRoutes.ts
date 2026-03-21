import { Router } from "express";
import { authenticateToken } from "../middleware/authMiddleware";
import {
  getParentChildren,
  getChildStatus,
} from "../controllers/parentController";

const router = Router();

router.get("/children", authenticateToken, getParentChildren);
router.get("/children/:studentId/status", authenticateToken, getChildStatus);

export default router;