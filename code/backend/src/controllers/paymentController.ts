import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { pool } from "../config/db";
import { PaymentSettings } from "../types/payment";

export const getPaymentSettings = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const driverRes = await pool.query("SELECT id FROM drivers WHERE user_id = $1", [req.user!.id]);
    if (driverRes.rows.length === 0) return res.status(404).json({ error: "Driver not found" });
    const driverId = driverRes.rows[0].id;

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
    
    const driverRes = await pool.query("SELECT id FROM drivers WHERE user_id = $1", [req.user!.id]);
    if (driverRes.rows.length === 0) return res.status(404).json({ error: "Driver not found" });
    const driverId = driverRes.rows[0].id;

    const existing = await pool.query("SELECT id FROM payment_settings WHERE driver_id = $1", [driverId]);

    if (existing.rows.length > 0) {
      await pool.query(
        `UPDATE payment_settings SET mode = $1, fixed_amount = $2, base_charge = $3, charge_per_km = $4, due_date_day = $5, updated_at = NOW() WHERE driver_id = $6`,
        [mode, fixed_amount, base_charge, charge_per_km, due_date_day, driverId]
      );
    } else {
      await pool.query(
        `INSERT INTO payment_settings (driver_id, mode, fixed_amount, base_charge, charge_per_km, due_date_day) VALUES ($1, $2, $3, $4, $5, $6)`,
        [driverId, mode, fixed_amount, base_charge, charge_per_km, due_date_day]
      );
    }
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to update settings" });
  }
};

export const getDriverPayments = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const driverRes = await pool.query("SELECT id FROM drivers WHERE user_id = $1", [req.user!.id]);
    if (driverRes.rows.length === 0) return res.status(404).json({ error: "Driver not found" });
    const driverId = driverRes.rows[0].id;

    const result = await pool.query(`
      SELECT p.*, s.name as student_name, u.name as parent_name,
        COALESCE(
          (6371 * acos(cos(radians(s.pickup_lat)) * cos(radians(ps.latitude)) * cos(radians(ps.longitude) - radians(s.pickup_lng)) + sin(radians(s.pickup_lat)) * sin(radians(ps.latitude)))),
        0) as distance
      FROM payments p
      JOIN students s ON p.student_id = s.id
      JOIN parent_students p_s ON s.id = p_s.student_id
      JOIN users u ON p_s.parent_id = u.id
      LEFT JOIN routes r ON r.driver_id = $1
      LEFT JOIN route_stops rs ON rs.route_id = r.id AND rs.id = s.dropoff_stop_id
      LEFT JOIN predefined_stops ps ON ps.id = rs.id -- fallback
      WHERE p.driver_id = $1
      ORDER BY p.month DESC, s.name ASC
    `, [driverId]);

    // Note: Accurate distance would be better calculated, but returning a mocked/approximate value here for dynamic display.
    res.json(result.rows);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to get payments" });
  }
};

export const generateMonthlyPayments = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const driverRes = await pool.query("SELECT id FROM drivers WHERE user_id = $1", [req.user!.id]);
    if (driverRes.rows.length === 0) return res.status(404).json({ error: "Driver not found" });
    const driverId = driverRes.rows[0].id;

    const settingsRes = await pool.query("SELECT * FROM payment_settings WHERE driver_id = $1", [driverId]);
    if (settingsRes.rows.length === 0) return res.status(400).json({ error: "Payment settings not configured" });
    const settings = settingsRes.rows[0] as PaymentSettings;

    // Get all students for this driver (assigned via routes/journeys)
    const studentsRes = await pool.query(`
      SELECT DISTINCT s.id, s.pickup_lat, s.pickup_lng, s.dropoff_lat, s.dropoff_lng
      FROM students s
      JOIN parent_students ps ON s.id = ps.student_id
      JOIN routes r ON r.driver_id = $1
    `, [driverId]);
    // Simplified logic: assume driver has access to students in their routes

    const monthStr = new Date().toISOString().slice(0, 7); // YYYY-MM
    let generated = 0;

    for (const student of studentsRes.rows) {
      const exist = await pool.query(`SELECT id FROM payments WHERE student_id = $1 AND month = $2`, [student.id, monthStr]);
      if (exist.rows.length === 0) {
        let amountDue = settings.fixed_amount;
        
        if (settings.mode === 'dynamic') {
          // Haversine approx (dummy for now if lat/lng are 0)
          const lat1 = student.pickup_lat || 0;
          const lat2 = student.dropoff_lat || 0;
          const distance = Math.abs(lat1 - lat2) * 111; // crude approx
          amountDue = Number(settings.base_charge) + (distance * Number(settings.charge_per_km));
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
          await pool.query(`
            INSERT INTO notifications (user_id, type, message, journey_id)
            VALUES ($1, 'payment_generated', $2, 0)
          `, [parentRes.rows[0].parent_id, `Payment generated for ${monthStr}. Amount Due: LKR ${amountDue.toFixed(2)}`]);
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

    const paymentRes = await pool.query("SELECT * FROM payments WHERE id = $1", [id]);
    if (paymentRes.rows.length === 0) return res.status(404).json({ error: "Payment not found" });
    const payment = paymentRes.rows[0];

    const amountPaid = status === 'paid' ? payment.amount_due : payment.amount_paid;

    await pool.query(
      `UPDATE payments SET status = $1, reject_reason = $2, amount_paid = $3, approved_at = NOW() WHERE id = $4`,
      [status, reject_reason || null, amountPaid, id]
    );

    // Notify parent
    const parentRes = await pool.query(`SELECT parent_id FROM parent_students WHERE student_id = $1`, [payment.student_id]);
    if (parentRes.rows.length > 0) {
      const msg = status === 'paid' ? `Payment for ${payment.month} approved.` : `Payment for ${payment.month} rejected: ${reject_reason}`;
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

    const paymentRes = await pool.query(`
      SELECT p.* FROM payments p
      JOIN parent_students ps ON p.student_id = ps.student_id
      WHERE p.id = $1 AND ps.parent_id = $2
    `, [id, parentId]);

    if (paymentRes.rows.length === 0) return res.status(404).json({ error: "Payment not found" });

    await pool.query(
      `UPDATE payments SET receipt_url = $1, receipt_ref = $2, status = 'receipt_submitted' WHERE id = $3`,
      [receipt_url, receipt_ref, id]
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
