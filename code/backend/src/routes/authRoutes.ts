import { Router } from "express";
import {
  getCurrentUser,
  listDemoAccounts,
  login,
} from "../controllers/authController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

router.get("/demo-accounts", listDemoAccounts);
router.post("/login", login);
router.get("/me", authenticateToken, getCurrentUser);

export default router;
