const db = require("../../config/db");

/**
 * Check whether driver exists
 */
const findDriverById = async (driverId) => {
  const result = await db.query(
    "SELECT id, vehicle_id FROM drivers WHERE id = $1",
    [driverId]
  );
  return result.rows[0];
};

/**
 * Check whether vehicle exists
 */
const findVehicleById = async (vehicleId) => {
  const result = await db.query(
    "SELECT id FROM vehicles WHERE id = $1",
    [vehicleId]
  );
  return result.rows[0];
};

/**
 * Create route and related stops inside one transaction
 */
const createRoute = async ({ route_name, driver_id, vehicle_id, schedule, stops }) => {
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const routeQuery = `
      INSERT INTO routes (route_name, driver_id, vehicle_id, schedule)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    const routeValues = [route_name, driver_id, vehicle_id, schedule];
    const routeResult = await client.query(routeQuery, routeValues);
    const newRoute = routeResult.rows[0];

    const insertedStops = [];

    for (let i = 0; i < stops.length; i++) {
      const stop = stops[i];

      const stopQuery = `
        INSERT INTO route_stops (route_id, stop_name, stop_order)
        VALUES ($1, $2, $3)
        RETURNING *;
      `;

      const stopValues = [newRoute.id, stop.stop_name, stop.stop_order];
      const stopResult = await client.query(stopQuery, stopValues);
      insertedStops.push(stopResult.rows[0]);
    }

    await client.query("COMMIT");

    return {
      ...newRoute,
      stops: insertedStops,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Get all routes with driver and vehicle details
 */
const getAllRoutes = async (driverId) => {
  let query = `
    SELECT
      r.id,
      r.route_name,
      r.schedule,
      r.driver_id,
      d.name AS driver_name,
      r.vehicle_id,
      v.vehicle_number,
      v.type AS vehicle_type
    FROM routes r
    JOIN drivers d ON r.driver_id = d.id
    JOIN vehicles v ON r.vehicle_id = v.id
  `;

  const values = [];

  if (driverId) {
    query += ` WHERE r.driver_id = $1 `;
    values.push(driverId);
  }

  query += ` ORDER BY r.id; `;

  const routeResult = await db.query(query, values);

  const routes = routeResult.rows;

  for (const route of routes) {
    const stopsResult = await db.query(
      `
      SELECT id, route_id, stop_name, stop_order
      FROM route_stops
      WHERE route_id = $1
      ORDER BY stop_order;
      `,
      [route.id]
    );

    route.stops = stopsResult.rows;
  }

  return routes;
};

module.exports = {
  findDriverById,
  findVehicleById,
  createRoute,
  getAllRoutes,
};