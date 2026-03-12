// backend/src/services/adminService.js

// Import database connection (PostgreSQL pool)
const db = require('../config/db');

/**
 * Fetch summary statistics for admin dashboard
 * Returns:
 *  - total users
 *  - total vehicles
 *  - active routes
 */
async function getAdminSummary() {
  try {
    // Query 1: total users
    const usersQuery = `SELECT COUNT(*) AS total_users FROM users`;

    // Query 2: total vehicles
    const vehiclesQuery = `SELECT COUNT(*) AS total_vehicles FROM vehicles`;

    // Query 3: active routes
    const routesQuery = `
      SELECT COUNT(*) AS active_routes
      FROM routes
      WHERE status = 'active'
    `;

    // Execute queries
    const usersResult = await db.query(usersQuery);
    const vehiclesResult = await db.query(vehiclesQuery);
    const routesResult = await db.query(routesQuery);

    // Return combined result
    return {
      totalUsers: parseInt(usersResult.rows[0].total_users),
      totalVehicles: parseInt(vehiclesResult.rows[0].total_vehicles),
      activeRoutes: parseInt(routesResult.rows[0].active_routes)
    };

  } catch (error) {
    console.error("Error fetching admin summary:", error);
    throw error;
  }
}

module.exports = {
  getAdminSummary
};

