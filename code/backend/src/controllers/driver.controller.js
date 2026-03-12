const driverService = require("../services/driver.service");

/**
 * Create driver
 */
const createDriver = async (req, res) => {
  try {
    const driver = await driverService.createDriver(req.body);
    res.status(201).json(driver);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Get all drivers
 */
const getDrivers = async (req, res) => {
  try {
    const drivers = await driverService.getDrivers();
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Update driver
 */
const updateDriver = async (req, res) => {
  try {
    const driver = await driverService.updateDriver(req.params.id, req.body);
    res.json(driver);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Delete driver
 */
const deleteDriver = async (req, res) => {
  try {
    await driverService.deleteDriver(req.params.id);
    res.json({ message: "Driver deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Assign vehicle
 */
const assignVehicle = async (req, res) => {
  try {
    const driver = await driverService.assignVehicle(
      req.params.id,
      req.body.vehicle_id
    );

    res.json(driver);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createDriver,
  getDrivers,
  updateDriver,
  deleteDriver,
  assignVehicle,
};