import { Router } from "express";
import {
  getCurrentUser,
  listDemoAccounts,
  login,
  register,
  deleteCurrentUser,
} from "../controllers/authController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

router.get("/demo-accounts", listDemoAccounts);
router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticateToken, getCurrentUser);
router.delete("/me", authenticateToken, deleteCurrentUser);

export default router;
