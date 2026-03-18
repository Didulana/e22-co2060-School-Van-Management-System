const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for drivers
let drivers = [];
let nextId = 1; // auto-increment id

// Test route
app.get("/", (req, res) => {
  res.send("School Transport Management Backend Running");
});

// Create driver
app.post("/api/drivers", (req, res) => {
  const { name, phone, license_number } = req.body;

  if (!name || !phone || !license_number) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const driver = { id: nextId++, name, phone, license_number };
  drivers.push(driver);

  console.log("Driver created:", driver);
  res.json({ message: "Driver created successfully", driver });
});

// Get all drivers
app.get("/api/drivers", (req, res) => {
  res.json(drivers);
});

// Get single driver by id
app.get("/api/drivers/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const driver = drivers.find(d => d.id === id);

  if (!driver) return res.status(404).json({ message: "Driver not found" });
  res.json(driver);
});

// Update driver by id
app.put("/api/drivers/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { name, phone, license_number } = req.body;

  const driver = drivers.find(d => d.id === id);
  if (!driver) return res.status(404).json({ message: "Driver not found" });

  if (name) driver.name = name;
  if (phone) driver.phone = phone;
  if (license_number) driver.license_number = license_number;

  console.log("Driver updated:", driver);
  res.json({ message: "Driver updated successfully", driver });
});

// Delete driver by id
app.delete("/api/drivers/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = drivers.findIndex(d => d.id === id);
  if (index === -1) return res.status(404).json({ message: "Driver not found" });

  const deleted = drivers.splice(index, 1);
  console.log("Driver deleted:", deleted[0]);
  res.json({ message: "Driver deleted successfully", driver: deleted[0] });
});



// In-memory storage for vehicles
let vehicles = [];
let nextVehicleId = 1;

// Create vehicle
app.post("/api/vehicles", (req, res) => {
  const { vehicle_number, type, capacity } = req.body;

  if (!vehicle_number || !type || !capacity) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const vehicle = { id: nextVehicleId++, vehicle_number, type, capacity };
  vehicles.push(vehicle);

  console.log("Vehicle created:", vehicle);
  res.json({ message: "Vehicle created successfully", vehicle });
});

// Get all vehicles
app.get("/api/vehicles", (req, res) => {
  res.json(vehicles);
});

// Get single vehicle by id
app.get("/api/vehicles/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const vehicle = vehicles.find(v => v.id === id);

  if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
  res.json(vehicle);
});

// Update vehicle by id
app.put("/api/vehicles/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { vehicle_number, type, capacity } = req.body;

  const vehicle = vehicles.find(v => v.id === id);
  if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

  if (vehicle_number) vehicle.vehicle_number = vehicle_number;
  if (type) vehicle.type = type;
  if (capacity) vehicle.capacity = capacity;

  console.log("Vehicle updated:", vehicle);
  res.json({ message: "Vehicle updated successfully", vehicle });
});

// Delete vehicle by id
app.delete("/api/vehicles/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = vehicles.findIndex(v => v.id === id);
  if (index === -1) return res.status(404).json({ message: "Vehicle not found" });

  const deleted = vehicles.splice(index, 1);
  console.log("Vehicle deleted:", deleted[0]);
  res.json({ message: "Vehicle deleted successfully", vehicle: deleted[0] });
});

app.put("/api/drivers/:id/assign-vehicle", (req, res) => {
  const driverId = parseInt(req.params.id);
  const { vehicle_id } = req.body;

  // Find driver
  const driver = drivers.find(d => d.id === driverId);
  if (!driver) {
    return res.status(404).json({ message: "Driver not found" });
  }

  // Find vehicle
  const vehicle = vehicles.find(v => v.id === vehicle_id);
  if (!vehicle) {
    return res.status(404).json({ message: "Vehicle not found" });
  }

  // Check if vehicle already assigned to another driver
  const vehicleAlreadyAssigned = drivers.find(
    d => d.vehicle_id === vehicle_id && d.id !== driverId
  );

  if (vehicleAlreadyAssigned) {
    return res.status(400).json({
      message: "Vehicle already assigned to another driver"
    });
  }

  // Assign vehicle
  driver.vehicle_id = vehicle_id;

  console.log(`Driver ${driver.id} assigned to vehicle ${vehicle_id}`);

  res.json({
    message: "Vehicle assigned to driver successfully",
    driver
  });
});

// In-memory storage for routes
let routes = [];
let nextRouteId = 1;

// Create route
app.post("/api/routes", (req, res) => {
  const { route_name, driver_id, vehicle_id, schedule, stops } = req.body;

  // Basic validation
  if (!route_name || !driver_id || !vehicle_id || !schedule || !stops) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!Array.isArray(stops) || stops.length === 0) {
    return res.status(400).json({ message: "At least one stop is required" });
  }

  if (schedule !== "morning" && schedule !== "evening") {
    return res.status(400).json({ message: "Schedule must be morning or evening" });
  }

  // Check driver exists
  const driver = drivers.find((d) => d.id === parseInt(driver_id));
  if (!driver) {
    return res.status(404).json({ message: "Driver not found" });
  }

  // Check vehicle exists
  const vehicle = vehicles.find((v) => v.id === parseInt(vehicle_id));
  if (!vehicle) {
    return res.status(404).json({ message: "Vehicle not found" });
  }

  // Check that driver is assigned to this vehicle
  if (driver.vehicle_id !== parseInt(vehicle_id)) {
    return res.status(400).json({
      message: "This driver is not assigned to the selected vehicle",
    });
  }

// Validate stops
for (let i = 0; i < stops.length; i++) {
  if (!stops[i].stop_name || stops[i].stop_order === undefined || stops[i].stop_order === null) {
    return res.status(400).json({
      message: `Stop name and stop order are required for stop ${i + 1}`,
    });
  }
}

// Check duplicate stop_order values
const stopOrders = stops.map((stop) => Number(stop.stop_order));
const uniqueStopOrders = new Set(stopOrders);

if (stopOrders.length !== uniqueStopOrders.size) {
  return res.status(400).json({
    message: "Each stop must have a unique stop order",
  });
}

  const route = {
    id: nextRouteId++,
    route_name,
    driver_id: parseInt(driver_id),
    vehicle_id: parseInt(vehicle_id),
    schedule,
    stops,
  };

  routes.push(route);

  console.log("Route created:", route);
  res.status(201).json({ message: "Route created successfully", route });
});

// Get all routes
app.get("/api/routes", (req, res) => {
  const result = routes.map((route) => {
    const driver = drivers.find((d) => d.id === route.driver_id);
    const vehicle = vehicles.find((v) => v.id === route.vehicle_id);

    return {
      ...route,
      driver_name: driver ? driver.name : null,
      vehicle_number: vehicle ? vehicle.vehicle_number : null,
    };
  });

  res.json(result);
});

// Get single route by id
app.get("/api/routes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const route = routes.find((r) => r.id === id);

  if (!route) {
    return res.status(404).json({ message: "Route not found" });
  }

  const driver = drivers.find((d) => d.id === route.driver_id);
  const vehicle = vehicles.find((v) => v.id === route.vehicle_id);

  res.json({
    ...route,
    driver_name: driver ? driver.name : null,
    vehicle_number: vehicle ? vehicle.vehicle_number : null,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});