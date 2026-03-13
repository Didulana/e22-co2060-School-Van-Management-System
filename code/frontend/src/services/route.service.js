const API_BASE_URL = "http://localhost:5000/api";

export const getDrivers = async () => {
  const response = await fetch(`${API_BASE_URL}/drivers`);

  if (!response.ok) {
    throw new Error("Failed to fetch drivers");
  }

  return await response.json();
};

export const getVehicles = async () => {
  const response = await fetch(`${API_BASE_URL}/vehicles`);

  if (!response.ok) {
    throw new Error("Failed to fetch vehicles");
  }

  return await response.json();
};

export const getRoutes = async () => {
  const response = await fetch(`${API_BASE_URL}/routes`);

  if (!response.ok) {
    throw new Error("Failed to fetch routes");
  }

  return await response.json();
};

export const createRoute = async (routeData) => {
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