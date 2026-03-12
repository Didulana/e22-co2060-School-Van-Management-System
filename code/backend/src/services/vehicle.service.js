const vehicleModel = require("../models/vehicle.model");

/**
 * Create vehicle
 */
const createVehicle = async (data) => {
  const { vehicle_number, type, capacity } = data;

  if (!vehicle_number || !type || !capacity) {
    throw new Error("All fields are required");
  }

  return await vehicleModel.createVehicle(data);
};

/**
 * Get all vehicles
 */
const getVehicles = async () => {
  return await vehicleModel.getAllVehicles();
};

/**
 * Update vehicle
 */
const updateVehicle = async (id, data) => {
  return await vehicleModel.updateVehicle(id, data);
};

/**
 * Delete vehicle
 */
const deleteVehicle = async (id) => {
  return await vehicleModel.deleteVehicle(id);
};

module.exports = {
  createVehicle,
  getVehicles,
  updateVehicle,
  deleteVehicle,
};