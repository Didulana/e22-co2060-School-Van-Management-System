import { Router } from "express";
import { studentBoarded } from "../controllers/studentBoardingController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

router.post("/", authenticateToken, studentBoarded);

export default router;