import { pool } from "./src/config/db";

async function cleanup() {
  try {
    console.log("Dropping drivers table to apply new schema...");
    await pool.query("DROP TABLE IF EXISTS drivers CASCADE");
    console.log("Cleanup complete.");
    process.exit(0);
  } catch (err) {
    console.error("Cleanup failed:", err);
    process.exit(1);
  }
}

cleanup();
