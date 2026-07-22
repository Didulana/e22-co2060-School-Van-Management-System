import { useEffect, useState, FormEvent } from "react";
import {
  getDrivers,
  getVehicles,
  getRoutes,
  createRoute,
  Driver,
  Vehicle,
  Route,
  Stop,
} from "../services/route.service";

export default function RoutesPage() {
  const [routeName, setRouteName] = useState("");
  const [schedule, setSchedule] = useState("morning");
  const [driverId, setDriverId] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [stops, setStops] = useState<Stop[]>([{ stop_name: "", stop_order: 1 }]);

  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setError("");

      const driversData = await getDrivers();
      const vehiclesData = await getVehicles();
      const routesData = await getRoutes();

      setDrivers(driversData);
      setVehicles(vehiclesData);
      setRoutes(routesData);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleStopChange = (index: number, value: string) => {
    const updatedStops = [...stops];
    updatedStops[index].stop_name = value;
    setStops(updatedStops);
  };

  const addStop = () => {
    const nextOrder = stops.length + 1;
    setStops([...stops, { stop_name: "", stop_order: nextOrder }]);
  };

  const removeStop = (index: number) => {
    const updatedStops = stops.filter((_, i) => i !== index);
    
    // re-calculate order
    const orderedStops = updatedStops.map((s, i) => ({ ...s, stop_order: i + 1 }));
    setStops(orderedStops.length > 0 ? orderedStops : [{ stop_name: "", stop_order: 1 }]);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!routeName.trim()) {
      setError("Route name is required");
      return;
    }

    if (!driverId) {
      setError("Please select a driver");
      return;
    }

    if (!vehicleId) {
      setError("Please select a vehicle");
      return;
    }

    if (stops.some((stop) => !stop.stop_name.trim())) {
      setError("All stops must have names");
      return;
    }

    const routeData: Route = {
      route_name: routeName,
      driver_id: Number(driverId),
      vehicle_id: Number(vehicleId),
      schedule,
      stops: stops.map((stop, index) => ({
        stop_name: stop.stop_name,
        stop_order: index + 1,
      })),
    };

    try {
      await createRoute(routeData);
      setSuccess("Route created successfully");
      setRouteName("");
      setSchedule("morning");
      setDriverId("");
      setVehicleId("");
      setStops([{ stop_name: "", stop_order: 1 }]);
      loadData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <h1>Route Management</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <form onSubmit={handleSubmit} style={{ marginBottom: "30px" }}>
        <div style={{ marginBottom: "10px" }}>
          <label>Route Name: </label>
          <input
            type="text"
            value={routeName}
            onChange={(e) => setRouteName(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Schedule: </label>
          <select value={schedule} onChange={(e) => setSchedule(e.target.value)}>
            <option value="morning">Morning</option>
            <option value="evening">Evening</option>
          </select>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Driver: </label>
          <select value={driverId} onChange={(e) => setDriverId(e.target.value)}>
            <option value="">Select Driver</option>
            {drivers.map((driver) => (
              <option key={driver.id} value={driver.id}>
                {driver.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Vehicle: </label>
          <select value={vehicleId} onChange={(e) => setVehicleId(e.target.value)}>
            <option value="">Select Vehicle</option>
            {vehicles.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.vehicle_number} - {vehicle.type}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Stops:</label>
          {stops.map((stop, index) => (
            <div key={index} style={{ marginTop: "8px" }}>
              <input
                type="text"
                placeholder={`Stop ${index + 1}`}
                value={stop.stop_name}
                onChange={(e) => handleStopChange(index, e.target.value)}
              />
              <button type="button" onClick={() => removeStop(index)} style={{ marginLeft: "8px" }}>
                Remove
              </button>
            </div>
          ))}
          <div style={{ marginTop: "10px" }}>
            <button type="button" onClick={addStop}>
              Add Stop
            </button>
          </div>
        </div>

        <button type="submit">Create Route</button>
      </form>

      <h2>Created Routes</h2>

      {routes.length === 0 ? (
        <p>No routes found.</p>
      ) : (
        routes.map((route) => (
          <div
            key={route.id}
            style={{
              border: "1px solid #ccc",
              padding: "12px",
              marginBottom: "12px",
            }}
          >
            <p><strong>Route Name:</strong> {route.route_name}</p>
            <p><strong>Schedule:</strong> {route.schedule}</p>
            <p><strong>Driver:</strong> {route.driver_name}</p>
            <p><strong>Vehicle:</strong> {route.vehicle_number}</p>

            <p><strong>Stops:</strong></p>
            <ol>
              {route.stops?.map((stop, index) => (
                <li key={index}>{stop.stop_name}</li>
              ))}
            </ol>
          </div>
        ))
      )}
    </div>
  );
}
