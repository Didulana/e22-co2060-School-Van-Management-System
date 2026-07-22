import { pool } from "../config/db";
import { generatePaymentsForDriver } from "../controllers/paymentController";

/**
 * Checks all driver payment settings and automatically generates payments 
 * if today matches their configured auto_generate_day.
 */
export async function checkAndAutoGeneratePayments() {
  try {
    const today = new Date();
    const currentDay = today.getDate(); // 1 - 31

    // We only support auto generation days 1 - 28 as standard
    if (currentDay > 28) return;

    console.log(`[PaymentScheduler] Running check for auto-generate day: ${currentDay}`);

    const settingsRes = await pool.query(
      "SELECT driver_id FROM payment_settings WHERE auto_generate_day = $1",
      [currentDay]
    );

    if (settingsRes.rows.length === 0) {
      console.log(`[PaymentScheduler] No drivers configured for auto-generation on day ${currentDay}.`);
      return;
    }

    console.log(`[PaymentScheduler] Found ${settingsRes.rows.length} driver(s) scheduled for today. Starting generation...`);

    for (const row of settingsRes.rows) {
      try {
        const count = await generatePaymentsForDriver(row.driver_id);
        console.log(`[PaymentScheduler] Successfully generated ${count} payment(s) for driver ID ${row.driver_id}`);
      } catch (err: any) {
        console.error(`[PaymentScheduler] Error generating payments for driver ID ${row.driver_id}:`, err.message);
      }
    }
  } catch (error: any) {
    console.error("[PaymentScheduler] Failed running scheduler checks:", error.message);
  }
}

/**
 * Initializes the background scheduler task
 */
export function initPaymentScheduler() {
  // Check immediately on startup
  checkAndAutoGeneratePayments();

  // Run checks every 12 hours
  setInterval(() => {
    checkAndAutoGeneratePayments();
  }, 12 * 60 * 60 * 1000);
}
