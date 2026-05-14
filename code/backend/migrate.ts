import { pool } from "./src/config/db";
import fs from "fs";
import path from "path";

async function migrate() {
  const files = [
    "users.sql",
    "students.sql",
    "drivers.sql",
    "vehicles.sql",
    "predefined_stops.sql",
    "routes.sql",
    "journeys.sql",
    "route_stops.sql",
    "journey_events.sql",
    "notifications.sql",
    "student_boarding.sql",
    "journey_locations.sql",
    "student_dropoff.sql",
    "parent_students.sql",
    "student_absences.sql"
  ];

  for (const file of files) {
    const fullPath = path.join(__dirname, "src/sql", file);
    if (!fs.existsSync(fullPath)) {
      console.warn(`File not found: ${file}`);
      continue;
    }
    console.log(`Running ${file}...`);
    const sql = fs.readFileSync(fullPath, "utf8");
    try {
      await pool.query(sql);
      console.log(`Success: ${file}`);
    } catch (err: any) {
      console.error(`Error in ${file}:`, err.message);
    }
  }
  console.log("Migration complete.");
  process.exit(0);
}

migrate();
