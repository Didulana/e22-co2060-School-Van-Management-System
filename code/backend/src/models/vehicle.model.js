const db = require("../../config/db");

/**
 * Create vehicle
 */
const createVehicle = async (vehicle) => {
  const { vehicle_number, type, capacity } = vehicle;

  const query = `
    INSERT INTO vehicles (vehicle_number, type, capacity)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;

  const values = [vehicle_number, type, capacity];

  const result = await db.query(query, values);
  return result.rows[0];
};

/**
 * Get all vehicles
 */
const getAllVehicles = async () => {
  const result = await db.query("SELECT * FROM vehicles ORDER BY id;");
  return result.rows;
};

/**
 * Update vehicle
 */
const updateVehicle = async (id, vehicle) => {
  const { vehicle_number, type, capacity } = vehicle;

  const query = `
    UPDATE vehicles
    SET vehicle_number = $1,
        type = $2,
        capacity = $3
    WHERE id = $4
    RETURNING *;
  `;

  const values = [vehicle_number, type, capacity, id];

  const result = await db.query(query, values);
  return result.rows[0];
};

/**
 * Delete vehicle
 */
const deleteVehicle = async (id) => {
  const query = "DELETE FROM vehicles WHERE id = $1;";
  await db.query(query, [id]);
};

module.exports = {
  createVehicle,
  getAllVehicles,
  updateVehicle,
  deleteVehicle,
};