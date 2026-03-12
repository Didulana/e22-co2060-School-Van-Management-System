const vehicleService = require("../services/vehicle.service");

/**
 * Create vehicle
 */
const createVehicle = async (req, res) => {
  try {
    const vehicle = await vehicleService.createVehicle(req.body);
    res.status(201).json(vehicle);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Get vehicles
 */
const getVehicles = async (req, res) => {
  try {
    const vehicles = await vehicleService.getVehicles();
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Update vehicle
 */
const updateVehicle = async (req, res) => {
  try {
    const vehicle = await vehicleService.updateVehicle(req.params.id, req.body);
    res.json(vehicle);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Delete vehicle
 */
const deleteVehicle = async (req, res) => {
  try {
    await vehicleService.deleteVehicle(req.params.id);
    res.json({ message: "Vehicle deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createVehicle,
  getVehicles,
  updateVehicle,
  deleteVehicle,
};