const db = require("../../config/db");

/**
 * Create a new driver
 */
const createDriver = async (driver) => {
  const { name, phone, license_number } = driver;

  const query = `
    INSERT INTO drivers (name, phone, license_number)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;

  const values = [name, phone, license_number];

  const result = await db.query(query, values);
  return result.rows[0];
};

/**
 * Get all drivers
 */
const getAllDrivers = async () => {
  const result = await db.query("SELECT * FROM drivers ORDER BY id;");
  return result.rows;
};

/**
 * Update driver
 */
const updateDriver = async (id, driver) => {
  const { name, phone, license_number } = driver;

  const query = `
    UPDATE drivers
    SET name = $1,
        phone = $2,
        license_number = $3
    WHERE id = $4
    RETURNING *;
  `;

  const values = [name, phone, license_number, id];

  const result = await db.query(query, values);
  return result.rows[0];
};

/**
 * Delete driver
 */
const deleteDriver = async (id) => {
  const query = "DELETE FROM drivers WHERE id = $1;";
  await db.query(query, [id]);
};

/**
 * Assign vehicle to driver
 */
const assignVehicle = async (driverId, vehicleId) => {
  const query = `
    UPDATE drivers
    SET vehicle_id = $1
    WHERE id = $2
    RETURNING *;
  `;

  const result = await db.query(query, [vehicleId, driverId]);
  return result.rows[0];
};

module.exports = {
  createDriver,
  getAllDrivers,
  updateDriver,
  deleteDriver,
  assignVehicle,
};