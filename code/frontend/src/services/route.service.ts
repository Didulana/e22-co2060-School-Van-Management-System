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
  const response = await fetch(`${API_BASE_URL}/drivers`);

  if (!response.ok) {
    throw new Error("Failed to fetch drivers");
  }

  return await response.json();
};

export const getVehicles = async (): Promise<Vehicle[]> => {
  const response = await fetch(`${API_BASE_URL}/vehicles`);

  if (!response.ok) {
    throw new Error("Failed to fetch vehicles");
  }

  return await response.json();
};

export const getRoutes = async (): Promise<Route[]> => {
  const response = await fetch(`${API_BASE_URL}/routes`);

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
    },
    body: JSON.stringify(routeData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create route");
  }

  return data;
};
