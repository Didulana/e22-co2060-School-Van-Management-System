import { Pool, PoolClient } from "pg";
import db from "../config/db";

export interface Stop {
  stop_name: string;
  stop_order: number;
  latitude: number;
  longitude: number;
}

export interface Route {
  id?: number;
  route_name: string;
  driver_id: number;
  vehicle_id: number;
  schedule: string;
  stops?: Stop[];
}

/**
 * Check whether driver exists
 */
export const findDriverById = async (driverId: number) => {
  const result = await db.query(
    "SELECT id, vehicle_id FROM drivers WHERE id = $1",
    [driverId]
  );
  return result.rows[0];
};

/**
 * Check whether vehicle exists
 */
export const findVehicleById = async (vehicleId: number) => {
  const result = await db.query(
    "SELECT id FROM vehicles WHERE id = $1",
    [vehicleId]
  );
  return result.rows[0];
};

/**
 * Create route and related stops inside one transaction
 */
export const createRoute = async (
  { route_name, driver_id, vehicle_id, schedule, stops }: Route,
  providedClient?: PoolClient
): Promise<Route> => {
  const isInternalTransaction = !providedClient;
  const client = providedClient || await db.connect();

  try {
    if (isInternalTransaction) {
      await (client as PoolClient).query("BEGIN");
    }

    const routeQuery = `
      INSERT INTO routes (route_name, driver_id, vehicle_id, schedule)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    const routeValues = [route_name, driver_id, vehicle_id, schedule];
    const routeResult = await client.query(routeQuery, routeValues);
    const newRoute = routeResult.rows[0];

    const insertedStops = [];

    if (stops && stops.length > 0) {
      for (let i = 0; i < stops.length; i++) {
        const stop = stops[i];

        const stopQuery = `
          INSERT INTO route_stops (route_id, stop_name, stop_order, latitude, longitude)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *;
        `;

        const stopValues = [newRoute.id, stop.stop_name, stop.stop_order, stop.latitude, stop.longitude];
        const stopResult = await client.query(stopQuery, stopValues);
        insertedStops.push(stopResult.rows[0]);
      }
    }

    if (isInternalTransaction) {
      await (client as PoolClient).query("COMMIT");
    }

    return {
      ...newRoute,
      stops: insertedStops,
    };
  } catch (error) {
    if (isInternalTransaction) {
      await (client as PoolClient).query("ROLLBACK");
    }
    throw error;
  } finally {
    if (isInternalTransaction) {
      (client as PoolClient).release();
    }
  }
};

/**
 * Get all routes with driver and vehicle details
 */
export const getAllRoutes = async (driverId?: number) => {
  let query = `
    SELECT
      r.id,
      r.route_name,
      r.schedule,
      r.driver_id,
      u.name AS driver_name,
      r.vehicle_id,
      v.vehicle_number,
      v.type AS vehicle_type
    FROM routes r
    JOIN drivers d ON r.driver_id = d.id
    JOIN users u ON d.user_id = u.id
    JOIN vehicles v ON r.vehicle_id = v.id
  `;

  const values: any[] = [];

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
      SELECT id, route_id, stop_name, stop_order, latitude, longitude
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

/**
 * Delete all routes for a driver
 */
export const deleteRoutesByDriverId = async (driverId: number, client: Pool | PoolClient = db): Promise<void> => {
  await client.query("DELETE FROM routes WHERE driver_id = $1", [driverId]);
};
