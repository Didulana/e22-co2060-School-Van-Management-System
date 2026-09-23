import { pool } from "./src/config/db";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("Starting seed process...");
  const passwordHash = await bcrypt.hash("password123", 10);

  // 1. Create Parent
  const parentRes = await pool.query(
    "INSERT INTO users (name, email, password_hash, role, phone, is_approved) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (email) DO UPDATE SET role = 'parent', is_approved = true RETURNING id",
    ["Test Parent", "parent@test.com", passwordHash, "parent", "0123456789", true]
  );
  const parentId = parentRes.rows[0].id;
  console.log(`Parent: parent@test.com / password123 (ID: ${parentId})`);

  // 2. Create Driver
  const driverUserRes = await pool.query(
    "INSERT INTO users (name, email, password_hash, role, phone, is_approved) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (email) DO UPDATE SET role = 'driver', is_approved = true RETURNING id",
    ["Test Driver", "driver@test.com", passwordHash, "driver", "0987654321", true]
  );
  const driverUserId = driverUserRes.rows[0].id;
  console.log(`Driver User: driver@test.com / password123 (ID: ${driverUserId})`);

  // Check if driver entry exists
  let driverId: number;
  const existingDriver = await pool.query("SELECT id FROM drivers WHERE user_id = $1", [driverUserId]);
  
  if (existingDriver.rows.length > 0) {
    driverId = existingDriver.rows[0].id;
    await pool.query("UPDATE drivers SET license_number = $1 WHERE id = $2", ["LIC-999", driverId]);
  } else {
    const driverRes = await pool.query(
      "INSERT INTO drivers (user_id, license_number) VALUES ($1, $2) RETURNING id",
      [driverUserId, "LIC-999"]
    );
    driverId = driverRes.rows[0].id;
  }
  console.log(`Driver ID: ${driverId}`);

  // 3. Create Vehicle
  const vehicleRes = await pool.query(
    "INSERT INTO vehicles (vehicle_number, type, capacity, is_ac) VALUES ($1, $2, $3, $4) ON CONFLICT (vehicle_number) DO UPDATE SET type = $2 RETURNING id",
    ["VAN-1234", "Van", 12, true]
  );
  const vehicleId = vehicleRes.rows[0].id;

  await pool.query("UPDATE drivers SET vehicle_id = $1 WHERE id = $2", [vehicleId, driverId]);
  console.log(`Vehicle VAN-1234 assigned to Driver ID: ${driverId}`);

  // 4. Create Route
  // Clear old routes for this driver to avoid duplicates in testing
  await pool.query("DELETE FROM routes WHERE driver_id = $1", [driverId]);
  
  const routeRes = await pool.query(
    "INSERT INTO routes (route_name, driver_id, vehicle_id, schedule) VALUES ($1, $2, $3, $4) RETURNING id",
    ["Morning Route", driverId, vehicleId, "morning"]
  );
  const routeId = routeRes.rows[0].id;

  // 5. Create Stops
  const stops = [
    ["Colombo Fort", 6.9344, 79.8433, 1],
    ["Bambalapitiya", 6.8972, 79.8552, 2],
    ["Nugegoda", 6.8741, 79.8851, 3]
  ];

  for (const [name, lat, lng, order] of stops) {
    await pool.query(
      "INSERT INTO route_stops (route_id, stop_name, latitude, longitude, stop_order) VALUES ($1, $2, $3, $4, $5)",
      [routeId, name, lat, lng, order]
    );
  }
  console.log(`Route 'Morning Route' created with ID: ${routeId} and 3 stops.`);

  // 6. Create Sample Child
  const pickupStopId = (await pool.query("SELECT id FROM route_stops WHERE route_id = $1 AND stop_order = 1", [routeId])).rows[0].id;
  const dropoffStopId = (await pool.query("SELECT id FROM route_stops WHERE route_id = $1 AND stop_order = 3", [routeId])).rows[0].id;
  
  const studentRes = await pool.query(
    "INSERT INTO students (name, school, pickup_stop_id, dropoff_stop_id, pickup_lat, pickup_lng, dropoff_lat, dropoff_lng) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id",
    ["Sample Kid", "Greenfield High", pickupStopId, dropoffStopId, 6.9344, 79.8433, 6.8741, 79.8851]
  );
  const studentId = studentRes.rows[0].id;
  
  await pool.query(
    "INSERT INTO parent_students (parent_id, student_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
    [parentId, studentId]
  );
  console.log(`Sample child 'Sample Kid' created for Parent.`);
  
  console.log("\nSeeding complete! You can now log in with:");
  console.log("Parent: parent@test.com / password123");
  console.log("Driver: driver@test.com / password123 (Driver ID: " + driverId + ")");

  process.exit(0);
}

seed().catch(err => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
