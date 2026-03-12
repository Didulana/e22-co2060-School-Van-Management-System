const driverModel = require("../models/driver.model");

/**
 * Create driver
 */
const createDriver = async (data) => {
  const { name, phone, license_number } = data;

  // Basic validation
  if (!name || !phone || !license_number) {
    throw new Error("All fields are required");
  }

  return await driverModel.createDriver(data);
};

/**
 * Get all drivers
 */
const getDrivers = async () => {
  return await driverModel.getAllDrivers();
};

/**
 * Update driver
 */
const updateDriver = async (id, data) => {
  return await driverModel.updateDriver(id, data);
};

/**
 * Delete driver
 */
const deleteDriver = async (id) => {
  return await driverModel.deleteDriver(id);
};

/**
 * Assign vehicle to driver
 */
const assignVehicle = async (driverId, vehicleId) => {
  if (!vehicleId) {
    throw new Error("Vehicle ID is required");
  }

  return await driverModel.assignVehicle(driverId, vehicleId);
};

module.exports = {
  createDriver,
  getDrivers,
  updateDriver,
  deleteDriver,
  assignVehicle,
};