import { Router } from "express";
import {
  getPaymentSettings,
  updatePaymentSettings,
  generateMonthlyPayments,
  getDriverPayments,
  verifyPayment,
  getParentPayments,
  uploadPaymentReceipt
} from "../controllers/paymentController";
import { authenticateToken, requireRole } from "../middleware/authMiddleware";

const router = Router();

// Driver routes
router.get("/driver/settings", authenticateToken, requireRole("driver"), getPaymentSettings);
router.put("/driver/settings", authenticateToken, requireRole("driver"), updatePaymentSettings);
router.post("/driver/generate", authenticateToken, requireRole("driver"), generateMonthlyPayments);
router.get("/driver/students", authenticateToken, requireRole("driver"), getDriverPayments);
router.put("/driver/verify/:id", authenticateToken, requireRole("driver"), verifyPayment);

// Parent routes
router.get("/parent/dues", authenticateToken, requireRole("parent"), getParentPayments);
router.post("/parent/upload/:id", authenticateToken, requireRole("parent"), uploadPaymentReceipt);

export default router;
