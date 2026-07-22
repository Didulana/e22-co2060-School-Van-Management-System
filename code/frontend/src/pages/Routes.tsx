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
import { Navigation, Plus, Trash2, Clock, User, Truck, AlertCircle, CheckCircle2 } from "lucide-react";

export default function RoutesPage() {
  const [routeName, setRouteName] = useState("");
  const [schedule, setSchedule] = useState("morning");
  const [driverId, setDriverId] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [stops, setStops] = useState<Stop[]>([{ stop_name: "", stop_order: 1, latitude: 0, longitude: 0 }]);

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
    setStops([...stops, { stop_name: "", stop_order: nextOrder, latitude: 0, longitude: 0 }]);
  };

  const removeStop = (index: number) => {
    const updatedStops = stops.filter((_, i) => i !== index);
    
    // re-calculate order
    const orderedStops = updatedStops.map((s, i) => ({ ...s, stop_order: i + 1 }));
    setStops(orderedStops.length > 0 ? orderedStops : [{ stop_name: "", stop_order: 1, latitude: 0, longitude: 0 }]);
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
        latitude: stop.latitude || 0,
        longitude: stop.longitude || 0,
      })),
    };

    try {
      await createRoute(routeData);
      setSuccess("Route created successfully");
      setRouteName("");
      setSchedule("morning");
      setDriverId("");
      setVehicleId("");
      setStops([{ stop_name: "", stop_order: 1, latitude: 0, longitude: 0 }]);
      loadData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const inputStyles = "w-full px-4 py-3 rounded-2xl border border-slate-100 bg-slate-50 text-slate-800 font-bold focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all outline-none text-sm";
  const labelStyles = "block text-xs font-black uppercase tracking-wider text-slate-400 mb-2 px-1";

  return (
    <div className="space-y-8 max-w-[1420px] mx-auto animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700">Operations Control</span>
        <h1 className="font-display text-3xl md:text-4xl font-black text-slate-950 tracking-tight">Route Management</h1>
      </div>

      {/* Status Alerts */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 border border-red-100 text-sm font-bold text-red-600 animate-in fade-in">
          <AlertCircle size={18} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-sm font-bold text-emerald-700 animate-in fade-in">
          <CheckCircle2 size={18} className="shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Main Grid: Form Left, Active Routes Right */}
      <div className="grid grid-cols-1 xl:grid-cols-[480px_1fr] gap-8 items-start">
        {/* Creation Form */}
        <form onSubmit={handleSubmit} className="glass-card rounded-[1.75rem] p-6 border border-white/60 shadow-soft space-y-6">
          <h2 className="font-display text-lg font-black text-slate-950 flex items-center gap-2">
            <Plus size={20} className="text-emerald-600" />
            Create New Route
          </h2>

          <div className="space-y-4">
            {/* Route Name */}
            <div>
              <label className={labelStyles}>Route Name</label>
              <input
                type="text"
                className={inputStyles}
                placeholder="e.g. Route Morning Alpha"
                value={routeName}
                onChange={(e) => setRouteName(e.target.value)}
              />
            </div>

            {/* Grid for Schedule & Driver */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelStyles}>Schedule</label>
                <select 
                  className={inputStyles} 
                  value={schedule} 
                  onChange={(e) => setSchedule(e.target.value)}
                >
                  <option value="morning">Morning</option>
                  <option value="evening">Evening</option>
                </select>
              </div>

              <div>
                <label className={labelStyles}>Driver</label>
                <select 
                  className={inputStyles} 
                  value={driverId} 
                  onChange={(e) => setDriverId(e.target.value)}
                >
                  <option value="">Select Driver</option>
                  {drivers.map((driver) => (
                    <option key={driver.id} value={driver.id}>
                      {driver.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Vehicle Selection */}
            <div>
              <label className={labelStyles}>Vehicle</label>
              <select 
                className={inputStyles} 
                value={vehicleId} 
                onChange={(e) => setVehicleId(e.target.value)}
              >
                <option value="">Select Vehicle</option>
                {vehicles.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.vehicle_number} ({vehicle.type})
                  </option>
                ))}
              </select>
            </div>

            {/* Stops Builder */}
            <div className="space-y-3 pt-2">
              <label className={labelStyles}>Stops Route Order</label>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {stops.map((stop, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <span className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-800 text-[10px] font-black flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <input
                      type="text"
                      className={`${inputStyles} py-2.5`}
                      placeholder={`Stop Location Name`}
                      value={stop.stop_name}
                      onChange={(e) => handleStopChange(index, e.target.value)}
                    />
                    <button 
                      type="button" 
                      onClick={() => removeStop(index)}
                      className="p-2.5 rounded-xl border border-slate-100 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      title="Remove Stop"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
              <button 
                type="button" 
                onClick={addStop}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-dashed border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/20 text-xs font-black text-slate-500 hover:text-emerald-700 transition-all"
              >
                <Plus size={14} /> Add Stop Location
              </button>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black text-sm shadow-xl shadow-emerald-100 hover:bg-emerald-700 hover:shadow-emerald-200 transition-all flex items-center justify-center gap-2"
          >
            <Navigation size={16} /> Generate Route
          </button>
        </form>

        {/* Created Routes List */}
        <div className="space-y-4">
          <h2 className="font-display text-xl font-black text-slate-900 px-2 flex items-center gap-2">
            <Navigation size={20} className="text-emerald-600" />
            Active Scheduled Routes
          </h2>

          {routes.length === 0 ? (
            <div className="glass-card rounded-[1.75rem] p-12 text-center border border-white/60">
              <Navigation className="mx-auto mb-4 text-slate-300 animate-pulse" size={48} />
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No routes registered yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {routes.map((route) => (
                <div
                  key={route.id}
                  className="glass-card rounded-[1.75rem] p-6 border border-white/60 shadow-soft hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Card Title & Status */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div>
                        <h3 className="font-display text-lg font-black text-slate-950 leading-tight">{route.route_name}</h3>
                        <span className="inline-flex items-center gap-1 mt-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                          <Clock size={10} />
                          {route.schedule}
                        </span>
                      </div>
                      <div className="h-10 w-10 rounded-xl bg-slate-950 text-white flex items-center justify-center shadow-md">
                        <Navigation size={18} />
                      </div>
                    </div>

                    {/* Driver & Vehicle Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5 border-t border-b border-slate-100/50 py-3">
                      <div className="flex items-center gap-2 text-slate-600">
                        <User size={16} className="text-slate-300 shrink-0" />
                        <div className="min-w-0">
                          <span className="text-[9px] font-bold text-slate-400 block uppercase leading-none">Driver</span>
                          <span className="text-xs font-semibold block truncate mt-0.5">{route.driver_name || "Unassigned"}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Truck size={16} className="text-slate-300 shrink-0" />
                        <div className="min-w-0">
                          <span className="text-[9px] font-bold text-slate-400 block uppercase leading-none">Vehicle</span>
                          <span className="text-xs font-semibold block truncate mt-0.5">{route.vehicle_number || "Unassigned"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Stops List */}
                    <div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Route Stops</span>
                      {route.stops && route.stops.length > 0 ? (
                        <div className="relative pl-4 space-y-3 before:content-[''] before:absolute before:left-[5px] before:top-1.5 before:bottom-1.5 before:w-0.5 before:bg-slate-100">
                          {route.stops.map((stop, index) => (
                            <div key={index} className="relative flex items-center gap-2.5">
                              <span className={`absolute -left-[14.5px] w-2.5 h-2.5 rounded-full border-2 border-white ring-1 shadow-sm shrink-0 ${index === 0 ? "bg-emerald-500 ring-emerald-500" : index === route.stops!.length - 1 ? "bg-amber-500 ring-amber-500" : "bg-slate-300 ring-slate-300"}`} />
                              <span className="text-xs font-bold text-slate-700">{stop.stop_name}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs font-bold text-slate-400 italic px-1">No stop points added</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
