import { getAuthToken } from "./driverService";

export const API_BASE_URL = "http://localhost:5001/api";

export interface Driver {
  id: number;
  name: string;
  phone: string;
  license_number: string;
  vehicle_id?: number | null;
}

export interface Vehicle {
  id: number;
  vehicle_number: string;
  type: string;
  capacity: number;
}

export interface Stop {
  stop_name: string;
  stop_order: number;
  latitude: number;
  longitude: number;
}

export interface Route {
  id?: number;
  route_name: string;
  schedule: string;
  driver_id: number;
  driver_name?: string;
  vehicle_id: number;
  vehicle_number?: string;
  stops: Stop[];
}

export const getDrivers = async (): Promise<Driver[]> => {
  const response = await fetch(`${API_BASE_URL}/drivers`, {
    headers: { "Authorization": `Bearer ${getAuthToken()}` }
  });

  if (!response.ok) {
    throw new Error("Failed to fetch drivers");
  }

  return await response.json();
};

export const getVehicles = async (): Promise<Vehicle[]> => {
  const response = await fetch(`${API_BASE_URL}/vehicles`, {
    headers: { "Authorization": `Bearer ${getAuthToken()}` }
  });

  if (!response.ok) {
    throw new Error("Failed to fetch vehicles");
  }

  return await response.json();
};

export const getRoutes = async (driverId?: number): Promise<Route[]> => {
  const url = driverId 
    ? `${API_BASE_URL}/routes?driver_id=${driverId}` 
    : `${API_BASE_URL}/routes`;
  
  const response = await fetch(url, {
    headers: { "Authorization": `Bearer ${getAuthToken()}` }
  });

  if (!response.ok) {
    throw new Error("Failed to fetch routes");
  }

  return await response.json();
};

export const createRoute = async (routeData: Route): Promise<Route> => {
  const response = await fetch(`${API_BASE_URL}/routes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getAuthToken()}`
    },
    body: JSON.stringify(routeData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create route");
  }

  return data;
};
