"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminSummary = getAdminSummary;
const db_1 = __importDefault(require("../config/db"));
async function getAdminSummary() {
    try {
        const usersQuery = `SELECT COUNT(*) AS total_users FROM users`;
        const vehiclesQuery = `SELECT COUNT(*) AS total_vehicles FROM vehicles`;
        const routesQuery = `
      SELECT COUNT(*) AS active_routes
      FROM routes
      WHERE status = 'active'
    `;
        const usersResult = await db_1.default.query(usersQuery);
        const vehiclesResult = await db_1.default.query(vehiclesQuery);
        const routesResult = await db_1.default.query(routesQuery);
        return {
            totalUsers: parseInt(usersResult.rows[0].total_users, 10),
            totalVehicles: parseInt(vehiclesResult.rows[0].total_vehicles, 10),
            activeRoutes: parseInt(routesResult.rows[0].active_routes, 10)
        };
    }
    catch (error) {
        console.error("Error fetching admin summary:", error);
        throw error;
    }
}
