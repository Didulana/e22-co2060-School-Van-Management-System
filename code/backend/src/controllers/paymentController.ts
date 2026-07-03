import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { pool } from "../config/db";
import { PaymentSettings } from "../types/payment";

const VALID_PAYMENT_MODES = new Set(["fixed", "dynamic"]);
const RECEIPT_PAYABLE_STATUSES = new Set(["pending", "overdue", "rejected"]);

function asNumber(value: unknown): number {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
}

function isValidDayOfMonth(value: unknown): boolean {
  return Number.isInteger(Number(value)) && Number(value) >= 1 && Number(value) <= 28;
}

function calculateDistanceKm(
  pickupLat: unknown,
  pickupLng: unknown,
  dropoffLat: unknown,
  dropoffLng: unknown
): number {
  const lat1 = Number(pickupLat);
  const lon1 = Number(pickupLng);
  const lat2 = Number(dropoffLat);
  const lon2 = Number(dropoffLng);

  if (![lat1, lon1, lat2, lon2].every(Number.isFinite)) {
    return 0;
  }

  const toRad = (degrees: number) => degrees * Math.PI / 180;
  const earthRadiusKm = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) ** 2;

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function getDriverIdForUser(userId: number) {
  const driverRes = await pool.query("SELECT id FROM drivers WHERE user_id = $1", [userId]);
  return driverRes.rows[0]?.id || null;
}

export const getPaymentSettings = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const driverId = await getDriverIdForUser(req.user!.id);
    if (!driverId) return res.status(404).json({ error: "Driver not found" });

    const result = await pool.query("SELECT * FROM payment_settings WHERE driver_id = $1", [driverId]);
    if (result.rows.length === 0) {
      // Return defaults
      return res.json({
        mode: 'fixed',
        fixed_amount: 0,
        base_charge: 0,
        charge_per_km: 0,
        due_date_day: 5
      });
    }
    res.json(result.rows[0]);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to get settings" });
  }
};

export const updatePaymentSettings = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { mode, fixed_amount, base_charge, charge_per_km, due_date_day } = req.body;

    if (!VALID_PAYMENT_MODES.has(mode)) {
      return res.status(400).json({ error: "Invalid payment mode" });
    }

    if (!isValidDayOfMonth(due_date_day)) {
      return res.status(400).json({ error: "Due date day must be between 1 and 28" });
    }

    const fixedAmount = asNumber(fixed_amount);
    const baseCharge = asNumber(base_charge);
    const chargePerKm = asNumber(charge_per_km);

    if (fixedAmount < 0 || baseCharge < 0 || chargePerKm < 0) {
      return res.status(400).json({ error: "Payment amounts cannot be negative" });
    }
    
    const driverId = await getDriverIdForUser(req.user!.id);
    if (!driverId) return res.status(404).json({ error: "Driver not found" });

    const existing = await pool.query("SELECT id FROM payment_settings WHERE driver_id = $1", [driverId]);

    if (existing.rows.length > 0) {
      await pool.query(
        `UPDATE payment_settings SET mode = $1, fixed_amount = $2, base_charge = $3, charge_per_km = $4, due_date_day = $5, updated_at = NOW() WHERE driver_id = $6`,
        [mode, fixedAmount, baseCharge, chargePerKm, Number(due_date_day), driverId]
      );
    } else {
      await pool.query(
        `INSERT INTO payment_settings (driver_id, mode, fixed_amount, base_charge, charge_per_km, due_date_day) VALUES ($1, $2, $3, $4, $5, $6)`,
        [driverId, mode, fixedAmount, baseCharge, chargePerKm, Number(due_date_day)]
      );
    }
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to update settings" });
  }
};

export const getDriverPayments = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const driverId = await getDriverIdForUser(req.user!.id);
    if (!driverId) return res.status(404).json({ error: "Driver not found" });

    const result = await pool.query(`
      SELECT p.*, s.name as student_name, u.name as parent_name,
        COALESCE(
          6371 * 2 * atan2(
            sqrt(
              pow(sin(radians((s.dropoff_lat::numeric - s.pickup_lat::numeric) / 2)), 2) +
              cos(radians(s.pickup_lat::numeric)) * cos(radians(s.dropoff_lat::numeric)) *
              pow(sin(radians((s.dropoff_lng::numeric - s.pickup_lng::numeric) / 2)), 2)
            ),
            sqrt(1 - (
              pow(sin(radians((s.dropoff_lat::numeric - s.pickup_lat::numeric) / 2)), 2) +
              cos(radians(s.pickup_lat::numeric)) * cos(radians(s.dropoff_lat::numeric)) *
              pow(sin(radians((s.dropoff_lng::numeric - s.pickup_lng::numeric) / 2)), 2)
            ))
          ),
          0
        ) as distance
      FROM payments p
      JOIN students s ON p.student_id = s.id
      JOIN parent_students p_s ON s.id = p_s.student_id
      JOIN users u ON p_s.parent_id = u.id
      WHERE p.driver_id = $1
      ORDER BY p.month DESC, s.name ASC
    `, [driverId]);

    res.json(result.rows);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to get payments" });
  }
};

export const generateMonthlyPayments = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const driverId = await getDriverIdForUser(req.user!.id);
    if (!driverId) return res.status(404).json({ error: "Driver not found" });

    const settingsRes = await pool.query("SELECT * FROM payment_settings WHERE driver_id = $1", [driverId]);
    if (settingsRes.rows.length === 0) return res.status(400).json({ error: "Payment settings not configured" });
    const settings = settingsRes.rows[0] as PaymentSettings;

    const studentsRes = await pool.query(`
      SELECT DISTINCT s.id, s.pickup_lat, s.pickup_lng, s.dropoff_lat, s.dropoff_lng
      FROM students s
      JOIN parent_students ps ON s.id = ps.student_id
      JOIN route_stops rs ON s.pickup_stop_id = rs.id OR s.dropoff_stop_id = rs.id
      JOIN routes r ON rs.route_id = r.id
      WHERE r.driver_id = $1
    `, [driverId]);

    const monthStr = new Date().toISOString().slice(0, 7); // YYYY-MM
    let generated = 0;

    for (const student of studentsRes.rows) {
      const exist = await pool.query(
        `SELECT id FROM payments WHERE student_id = $1 AND driver_id = $2 AND month = $3`,
        [student.id, driverId, monthStr]
      );
      if (exist.rows.length === 0) {
        let amountDue = asNumber(settings.fixed_amount);
        
        if (settings.mode === 'dynamic') {
          const distance = calculateDistanceKm(
            student.pickup_lat,
            student.pickup_lng,
            student.dropoff_lat,
            student.dropoff_lng
          );
          amountDue = asNumber(settings.base_charge) + (distance * asNumber(settings.charge_per_km));
        }

        const dueDate = new Date();
        dueDate.setDate(settings.due_date_day);
        if (dueDate < new Date()) {
          dueDate.setMonth(dueDate.getMonth() + 1);
        }

        await pool.query(`
          INSERT INTO payments (student_id, driver_id, month, amount_due, due_date, status)
          VALUES ($1, $2, $3, $4, $5, 'pending')
        `, [student.id, driverId, monthStr, amountDue, dueDate]);
        generated++;

        // Notify parent
        const parentRes = await pool.query(`SELECT parent_id FROM parent_students WHERE student_id = $1`, [student.id]);
        if (parentRes.rows.length > 0) {
          const res = await pool.query("SELECT name, nickname FROM students WHERE id = $1", [student.id]);
          const studentData = res.rows[0];
          const displayName = studentData?.nickname || studentData?.name || `Student ${student.id}`;

          await pool.query(`
            INSERT INTO notifications (user_id, type, message, journey_id)
            VALUES ($1, 'payment_generated', $2, 0)
          `, [parentRes.rows[0].parent_id, `Payment generated for ${displayName} for ${monthStr}. Amount Due: LKR ${amountDue.toFixed(2)}`]);
        }
      }
    }

    res.json({ message: `Generated ${generated} payments for ${monthStr}` });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to generate payments" });
  }
};

export const verifyPayment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, reject_reason } = req.body;
    
    if (!['paid', 'rejected'].includes(status)) return res.status(400).json({ error: "Invalid status" });

    const driverId = await getDriverIdForUser(req.user!.id);
    if (!driverId) return res.status(404).json({ error: "Driver not found" });

    const paymentRes = await pool.query("SELECT * FROM payments WHERE id = $1 AND driver_id = $2", [id, driverId]);
    if (paymentRes.rows.length === 0) return res.status(404).json({ error: "Payment not found" });
    const payment = paymentRes.rows[0];

    if (payment.status !== "receipt_submitted") {
      return res.status(400).json({ error: "Only submitted receipts can be verified" });
    }

    if (status === "rejected" && !String(reject_reason || "").trim()) {
      return res.status(400).json({ error: "Reject reason is required" });
    }

    const amountPaid = status === 'paid' ? payment.amount_due : payment.amount_paid;

    await pool.query(
      `UPDATE payments SET status = $1, reject_reason = $2, amount_paid = $3, approved_at = NOW() WHERE id = $4`,
      [status, reject_reason || null, amountPaid, id]
    );

    // Notify parent
    const parentRes = await pool.query(`SELECT parent_id FROM parent_students WHERE student_id = $1`, [payment.student_id]);
    if (parentRes.rows.length > 0) {
      const res = await pool.query("SELECT name, nickname FROM students WHERE id = $1", [payment.student_id]);
      const studentData = res.rows[0];
      const displayName = studentData?.nickname || studentData?.name || `Student ${payment.student_id}`;

      const msg = status === 'paid' ? `Payment for ${displayName} (${payment.month}) approved.` : `Payment for ${displayName} (${payment.month}) rejected: ${reject_reason}`;
      await pool.query(`
        INSERT INTO notifications (user_id, type, message, journey_id)
        VALUES ($1, 'payment_update', $2, 0)
      `, [parentRes.rows[0].parent_id, msg]);
    }

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to verify payment" });
  }
};

// --- Parent Methods ---

export const getParentPayments = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const parentId = req.user!.id;
    
    const result = await pool.query(`
      SELECT p.*, s.name as student_name
      FROM payments p
      JOIN students s ON p.student_id = s.id
      JOIN parent_students ps ON s.id = ps.student_id
      WHERE ps.parent_id = $1
      ORDER BY p.due_date DESC
    `, [parentId]);
    
    res.json(result.rows);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to get payments" });
  }
};

export const uploadPaymentReceipt = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { receipt_url, receipt_ref } = req.body;
    const parentId = req.user!.id;

    const receiptUrl = String(receipt_url || "").trim();
    const receiptRef = String(receipt_ref || "").trim();

    try {
      new URL(receiptUrl);
    } catch {
      return res.status(400).json({ error: "A valid receipt URL is required" });
    }

    if (!receiptRef) {
      return res.status(400).json({ error: "Receipt reference is required" });
    }

    const paymentRes = await pool.query(`
      SELECT p.* FROM payments p
      JOIN parent_students ps ON p.student_id = ps.student_id
      WHERE p.id = $1 AND ps.parent_id = $2
    `, [id, parentId]);

    if (paymentRes.rows.length === 0) return res.status(404).json({ error: "Payment not found" });
    if (!RECEIPT_PAYABLE_STATUSES.has(paymentRes.rows[0].status)) {
      return res.status(400).json({ error: "Receipt cannot be uploaded for this payment status" });
    }

    await pool.query(
      `UPDATE payments SET receipt_url = $1, receipt_ref = $2, status = 'receipt_submitted' WHERE id = $3`,
      [receiptUrl, receiptRef, id]
    );

    // Notify driver
    const driverUserIdRes = await pool.query(`SELECT user_id FROM drivers WHERE id = $1`, [paymentRes.rows[0].driver_id]);
    if (driverUserIdRes.rows.length > 0) {
      await pool.query(`
        INSERT INTO notifications (user_id, type, message, journey_id)
        VALUES ($1, 'receipt_uploaded', $2, 0)
      `, [driverUserIdRes.rows[0].user_id, `Receipt uploaded for payment ${paymentRes.rows[0].month}`]);
    }

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to upload receipt" });
  }
};
