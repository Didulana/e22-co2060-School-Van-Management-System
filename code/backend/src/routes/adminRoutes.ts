import express from 'express';
import { getAdminSummary } from '../controllers/adminController';

const router = express.Router();

// GET /api/admin/summary
router.get('/summary', getAdminSummary);

export default router;
