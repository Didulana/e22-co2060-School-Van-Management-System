import express from 'express';
import { getAdminSummary, getUsers, updateUserStatus, getStudents, getPendingDrivers, getDriverProfile } from '../controllers/adminController';

const router = express.Router();

// GET /api/admin/summary
router.get('/summary', getAdminSummary);

// User & Role Management
router.get('/users', getUsers);
router.put('/users/:id/status', updateUserStatus);

// Student Management
router.get('/students', getStudents);

// Driver Application Management
router.get('/pending-drivers', getPendingDrivers);
router.get('/drivers/pending', getPendingDrivers);
router.get('/drivers/:id/profile', getDriverProfile);

export default router;
