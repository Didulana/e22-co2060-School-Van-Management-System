import { pool } from "./src/config/db";

async function seed() {
  try {
    // Insert dummy driver
    await pool.query(`
      INSERT INTO drivers (name, phone, license_number) 
      VALUES ('John Doe', '1234567890', 'LIC-12345') 
      ON CONFLICT DO NOTHING;
    `);

    // Insert dummy vehicle
    await pool.query(`
      INSERT INTO vehicles (vehicle_number, type, capacity) 
      VALUES ('VAN-9999', 'Minivan', 15) 
      ON CONFLICT DO NOTHING;
    `);

    console.log("Database seeded successfully with a test driver and vehicle.");
  } catch (err: any) {
    console.error("Error seeding database:", err.message);
  } finally {
    process.exit(0);
  }
}

seed();
