import * as routeModel from "../models/route.model";
import { Route } from "../models/route.model";

/**
 * Create a new route
 */
export const createRoute = async (data: Route): Promise<Route> => {
  const { route_name, driver_id, vehicle_id, schedule, stops } = data;

  if (!route_name || !route_name.trim()) {
    throw new Error("Route name is required");
  }

  if (!driver_id) {
    throw new Error("Driver ID is required");
  }

  if (!vehicle_id) {
    throw new Error("Vehicle ID is required");
  }

  if (!schedule) {
    throw new Error("Schedule is required");
  }

  if (schedule.length > 100) {
    throw new Error("Schedule description is too long (max 100 characters)");
  }

  if (!Array.isArray(stops) || stops.length === 0) {
    throw new Error("At least one stop is required");
  }

  for (let i = 0; i < stops.length; i++) {
    const stop = stops[i];

    if (!stop.stop_name || !stop.stop_name.trim()) {
      throw new Error(`Stop name is required for stop ${i + 1}`);
    }

    if (
      stop.stop_order === undefined ||
      stop.stop_order === null ||
      Number.isNaN(Number(stop.stop_order))
    ) {
      throw new Error(`Stop order is required for stop ${i + 1}`);
    }
  }

  const driver = await routeModel.findDriverById(driver_id);
  if (!driver) {
    throw new Error("Selected driver does not exist");
  }

  const vehicle = await routeModel.findVehicleById(vehicle_id);
  if (!vehicle) {
    throw new Error("Selected vehicle does not exist");
  }

  if (Number(driver.vehicle_id) !== Number(vehicle_id)) {
    throw new Error("This driver is not assigned to the selected vehicle");
  }

  const normalizedStops = stops.map((stop) => ({
    stop_name: stop.stop_name.trim(),
    stop_order: Number(stop.stop_order),
    latitude: Number(stop.latitude),
    longitude: Number(stop.longitude),
  }));

  const uniqueOrders = new Set(normalizedStops.map((stop) => stop.stop_order));
  if (uniqueOrders.size !== normalizedStops.length) {
    throw new Error("Each stop must have a unique stop order");
  }

  normalizedStops.sort((a, b) => a.stop_order - b.stop_order);

  return await routeModel.createRoute({
    route_name: route_name.trim(),
    driver_id: Number(driver_id),
    vehicle_id: Number(vehicle_id),
    schedule: schedule.toLowerCase(),
    stops: normalizedStops,
  });
};

/**
 * Get all routes
 * Optional filter by driver
 */
export const getRoutes = async (driverId?: number | string) => {
  if (driverId && Number.isNaN(Number(driverId))) {
    throw new Error("Driver ID must be a number");
  }

  return await routeModel.getAllRoutes(driverId ? Number(driverId) : undefined);
};
