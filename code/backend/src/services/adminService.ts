import db from '../config/db';

export interface AdminSummary {
  totalUsers: number;
  totalVehicles: number;
  activeRoutes: number;
}

export async function getAdminSummary(): Promise<AdminSummary> {
  try {
    const usersQuery = `SELECT COUNT(*) AS total_users FROM users`;
    const vehiclesQuery = `SELECT COUNT(*) AS total_vehicles FROM vehicles`;
    const routesQuery = `
      SELECT COUNT(*) AS active_routes
      FROM routes
      WHERE status = 'active'
    `;

    const usersResult = await db.query(usersQuery);
    const vehiclesResult = await db.query(vehiclesQuery);
    const routesResult = await db.query(routesQuery);

    return {
      totalUsers: parseInt(usersResult.rows[0].total_users, 10),
      totalVehicles: parseInt(vehiclesResult.rows[0].total_vehicles, 10),
      activeRoutes: parseInt(routesResult.rows[0].active_routes, 10)
    };

  } catch (error) {
    console.error("Error fetching admin summary:", error);
    throw error;
  }
}
