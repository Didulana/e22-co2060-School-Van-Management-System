import { Router } from "express";
import { getSchools, createSchool, deleteSchool } from "../controllers/schoolController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

// Public: list all schools
router.get("/", getSchools);

// Authenticated: create/delete
router.post("/", authenticateToken, createSchool);
router.delete("/:id", authenticateToken, deleteSchool);

export default router;
