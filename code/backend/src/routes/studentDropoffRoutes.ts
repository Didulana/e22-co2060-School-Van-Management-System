import { Router } from "express";
import { studentDropped } from "../controllers/studentDropoffController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

router.post("/", authenticateToken, studentDropped);

export default router;