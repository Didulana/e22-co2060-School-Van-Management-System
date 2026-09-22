import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  submitOnboarding,
  getOnboardingStatus,
  getSchools,
} from "../../services/driverService";
import DraggableLocationPicker from "../../components/driver/DraggableLocationPicker";
import {
  GraduationCap,
  Truck,
  CheckCircle2,
  ChevronRight,
  Plus,
  Trash2,
  ShieldCheck,
  Zap,
  X,
  Navigation,
  Info,
  MapPin,
  Search,
  Check,
  ChevronLeft,
} from "lucide-react";

interface School {
  id: number;
  name: string;
  city?: string;
  address?: string;
}

interface StopItem {
  name: string;
  latitude: number;
  longitude: number;
}

export default function DriverOnboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Schools state
  const [availableSchools, setAvailableSchools] = useState<School[]>([]);
  const [selectedSchoolIds, setSelectedSchoolIds] = useState<number[]>([]);
  const [schoolSearch, setSchoolSearch] = useState("");

  // Form State
  const [licenseNumber, setLicenseNumber] = useState("");
  const [vehicleDetails, setVehicleDetails] = useState({
    registrationNumber: "",
    type: "Van",
    seatCount: 12,
    isAc: false,
  });

  // Route stops state: Start location, intermediate stops, End location
  const [startLocation, setStartLocation] = useState<StopItem>({ name: "", latitude: 0, longitude: 0 });
  const [endLocation, setEndLocation] = useState<StopItem>({ name: "", latitude: 0, longitude: 0 });
  const [intermediateStops, setIntermediateStops] = useState<StopItem[]>([]);

  // Location picker modal state
  const [pickerTarget, setPickerTarget] = useState<"start" | "end" | number | null>(null);

  useEffect(() => {
    loadSchoolsAndStatus();
  }, []);

  const loadSchoolsAndStatus = async () => {
    try {
      const schools = await getSchools();
      setAvailableSchools(schools);

      const statusData = await getOnboardingStatus();
      if (!statusData.completed && statusData.step) {
        setStep(statusData.step);
      }
    } catch (err) {
      console.error("Failed to load initial onboarding data:", err);
    }
  };

  const toggleSchool = (schoolId: number) => {
    if (selectedSchoolIds.includes(schoolId)) {
      setSelectedSchoolIds(selectedSchoolIds.filter((id) => id !== schoolId));
    } else {
      setSelectedSchoolIds([...selectedSchoolIds, schoolId]);
    }
  };

  const handlePickerConfirm = (name: string, lat: number, lng: number) => {
    if (pickerTarget === "start") {
      setStartLocation({ name, latitude: lat, longitude: lng });
    } else if (pickerTarget === "end") {
      setEndLocation({ name, latitude: lat, longitude: lng });
    } else if (typeof pickerTarget === "number") {
      const updated = [...intermediateStops];
      updated[pickerTarget] = { name, latitude: lat, longitude: lng };
      setIntermediateStops(updated);
    }
    setPickerTarget(null);
  };

  const handleAddIntermediateStop = () => {
    setIntermediateStops([...intermediateStops, { name: "", latitude: 0, longitude: 0 }]);
    setPickerTarget(intermediateStops.length);
  };

  const removeIntermediateStop = (index: number) => {
    setIntermediateStops(intermediateStops.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (selectedSchoolIds.length === 0) {
      alert("Please select at least one school covered by your route.");
      setStep(1);
      return;
    }

    if (!startLocation.name || startLocation.latitude === 0) {
      alert("Please configure your route's Starting Location on the map.");
      return;
    }

    if (!endLocation.name || endLocation.latitude === 0) {
      alert("Please configure your route's End Location on the map.");
      return;
    }

    // Combine into full stops sequence: start -> intermediates -> end
    const allStops = [
      startLocation,
      ...intermediateStops.filter((s) => s.name && s.latitude !== 0),
      endLocation,
    ];

    if (allStops.length < 2) {
      alert("Please configure both starting and ending locations.");
      return;
    }

    setLoading(true);
    try {
      await submitOnboarding({
        licenseNumber,
        vehicleDetails,
        schoolIds: selectedSchoolIds,
        routeStops: allStops,
      });
      alert("Van profile and route successfully saved!");
      navigate("/driver");
    } catch (err: any) {
      alert(`Error saving onboarding: ${err.message || "Please try again."}`);
    } finally {
      setLoading(false);
    }
  };

  const filteredSchools = availableSchools.filter(
    (s) =>
      s.name.toLowerCase().includes(schoolSearch.toLowerCase()) ||
      (s.city && s.city.toLowerCase().includes(schoolSearch.toLowerCase()))
  );

  return (
    <div className="flex flex-col items-center py-12 px-4 sm:px-6 w-full animate-in fade-in duration-700 font-sans">
      {/* Header */}
      <div className="w-full max-w-3xl flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div className="text-left">
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-700">Driver Portal</span>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mt-1">Route & Van Setup</h1>
          <p className="text-sm font-bold text-slate-400 mt-2">
            Configure the schools you cover, your vehicle specifications, and exact route pins.
          </p>
        </div>
        <button
          onClick={() => navigate("/driver")}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-100 text-xs font-black text-slate-500 hover:text-red-500 hover:bg-red-50 transition-all"
        >
          <X size={16} /> Cancel
        </button>
      </div>

      {/* 3-Step Indicator */}
      <div className="w-full max-w-3xl flex justify-between mb-16 relative">
        <div className="absolute top-[20px] left-0 w-full h-[2px] bg-slate-100 -z-10" />
        <div
          className="absolute top-[20px] left-0 h-[2px] bg-emerald-500 -z-10 transition-all duration-700 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
          style={{ width: `${(step - 1) * 50}%` }}
        />
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex flex-col items-center">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-base transition-all duration-500 shadow-lg ${
                step === s
                  ? "bg-slate-900 text-white scale-110 ring-8 ring-slate-100"
                  : step > s
                  ? "bg-emerald-500 text-white"
                  : "bg-white text-slate-300 border-2 border-slate-100"
              }`}
            >
              {step > s ? <CheckCircle2 size={24} /> : s}
            </div>
            <span
              className={`mt-4 text-[10px] font-black uppercase tracking-[0.2em] ${
                step >= s ? "text-slate-900" : "text-slate-300"
              }`}
            >
              {s === 1 ? "1. Covered Schools" : s === 2 ? "2. Vehicle Info" : "3. Route Map Pins"}
            </span>
          </div>
        ))}
      </div>

      {/* Main Form Card */}
      <div className="w-full max-w-3xl bg-white rounded-[2.5rem] shadow-soft border border-slate-100 overflow-hidden">
        <div className="bg-slate-50/70 px-8 py-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-white shadow-xs flex items-center justify-center text-emerald-600 border border-slate-100">
              {step === 1 ? <GraduationCap size={20} /> : step === 2 ? <Truck size={20} /> : <Navigation size={20} />}
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                {step === 1 ? "Select Covered Schools" : step === 2 ? "Vehicle & Licence Details" : "Route Location Pins"}
              </h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Step {step} of 3</p>
            </div>
          </div>
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="text-xs font-bold text-slate-400 hover:text-slate-800 transition-colors flex items-center gap-1"
            >
              <ChevronLeft size={16} /> Back
            </button>
          )}
        </div>

        <div className="p-8">
          {/* STEP 1: SCHOOLS SELECTION */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                <Info className="text-emerald-600 shrink-0" size={20} />
                <p className="text-xs font-semibold text-emerald-900 leading-relaxed">
                  Select the schools you serve on your daily route. Parents filtering by these schools will see your van as an option.
                </p>
              </div>

              {/* School search */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  value={schoolSearch}
                  onChange={(e) => setSchoolSearch(e.target.value)}
                  placeholder="Search schools by name or city..."
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-semibold focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              {/* Schools list */}
              <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                {filteredSchools.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 font-bold text-xs bg-slate-50 rounded-2xl">
                    No matching schools found.
                  </div>
                ) : (
                  filteredSchools.map((school) => {
                    const isSelected = selectedSchoolIds.includes(school.id);
                    return (
                      <div
                        key={school.id}
                        onClick={() => toggleSchool(school.id)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? "bg-emerald-50/80 border-emerald-300 text-emerald-950 shadow-xs"
                            : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center font-black ${
                              isSelected ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-400"
                            }`}
                          >
                            <GraduationCap size={18} />
                          </div>
                          <div>
                            <span className="font-bold text-sm block">{school.name}</span>
                            <span className="text-[10px] text-slate-400 font-semibold block">
                              {school.city || school.address || "Sri Lanka"}
                            </span>
                          </div>
                        </div>
                        <div
                          className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                            isSelected ? "bg-emerald-600 text-white" : "border-2 border-slate-200"
                          }`}
                        >
                          {isSelected && <Check size={14} />}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="pt-4 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">
                  {selectedSchoolIds.length} school{selectedSchoolIds.length === 1 ? "" : "s"} selected
                </span>
                <button
                  type="button"
                  disabled={selectedSchoolIds.length === 0}
                  onClick={() => setStep(2)}
                  className="px-8 py-3.5 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-emerald-600 shadow-xl shadow-slate-200 hover:shadow-emerald-200 transition-all flex items-center gap-2 disabled:opacity-40"
                >
                  Next: Vehicle Info <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: VEHICLE & LICENCE DETAILS */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Driving Licence Number</label>
                <div className="relative">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-bold focus:bg-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                    placeholder="e.g. B1234567"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">Vehicle Registration Number</label>
                  <input
                    type="text"
                    required
                    value={vehicleDetails.registrationNumber}
                    onChange={(e) =>
                      setVehicleDetails({ ...vehicleDetails, registrationNumber: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-bold uppercase focus:bg-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                    placeholder="e.g. WP-CAT-9000"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">Vehicle Type</label>
                  <select
                    value={vehicleDetails.type}
                    onChange={(e) => setVehicleDetails({ ...vehicleDetails, type: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-bold focus:bg-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                  >
                    <option value="Van">Van</option>
                    <option value="Mini Bus">Mini Bus</option>
                    <option value="Standard Bus">Standard Bus</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">Seat Capacity (Max Students)</label>
                  <input
                    type="number"
                    min={4}
                    max={60}
                    value={vehicleDetails.seatCount}
                    onChange={(e) =>
                      setVehicleDetails({ ...vehicleDetails, seatCount: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-bold focus:bg-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                  />
                  <span className="text-[10px] text-slate-400">Only students up to this limit will be boardable.</span>
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={vehicleDetails.isAc}
                      onChange={(e) => setVehicleDetails({ ...vehicleDetails, isAc: e.target.checked })}
                      className="w-5 h-5 rounded-lg border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                        Air Conditioned (A/C) <Zap size={14} className={vehicleDetails.isAc ? "text-amber-500 fill-amber-500" : "text-slate-300"} />
                      </span>
                      <span className="text-[10px] text-slate-400 block">Vehicle has active passenger air conditioning</span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-6 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={!vehicleDetails.registrationNumber.trim()}
                  onClick={() => setStep(3)}
                  className="px-8 py-3.5 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-emerald-600 shadow-xl shadow-slate-200 hover:shadow-emerald-200 transition-all flex items-center gap-2 disabled:opacity-40"
                >
                  Next: Route Stops <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: ROUTE STOPS (START, INTERMEDIATE, END WITH DRAGGABLE PIN) */}
          {step === 3 && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                <Info className="text-emerald-600 shrink-0" size={20} />
                <p className="text-xs font-semibold text-emerald-900 leading-relaxed">
                  Type a location name or click <strong>&ldquo;Set on Map&rdquo;</strong> to open the interactive map and drag your pin to the precise pickup or dropoff point (Uber-style).
                </p>
              </div>

              {/* 1. STARTING LOCATION */}
              <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
                    <span className="text-xs font-black uppercase text-slate-700 tracking-wider">
                      Starting Location
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPickerTarget("start")}
                    className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <MapPin size={12} /> {startLocation.name ? "Edit on Map" : "Set on Map"}
                  </button>
                </div>
                {startLocation.name ? (
                  <div className="bg-white p-3 rounded-2xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-sm font-black text-slate-900 block">{startLocation.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {startLocation.latitude.toFixed(5)}, {startLocation.longitude.toFixed(5)}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      Pin Placed
                    </span>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No start location set yet. Click &ldquo;Set on Map&rdquo;.</p>
                )}
              </div>

              {/* 2. INTERMEDIATE STOPS */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-black uppercase text-slate-500 tracking-wider">
                    Intermediate Stops ({intermediateStops.length})
                  </span>
                  <button
                    type="button"
                    onClick={handleAddIntermediateStop}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors flex items-center gap-1 shadow-sm"
                  >
                    <Plus size={14} /> Add Stop Pin
                  </button>
                </div>

                {intermediateStops.length === 0 ? (
                  <p className="text-xs text-slate-400 italic p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center">
                    Optional: Add intermediate passenger pickup points along your path.
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {intermediateStops.map((stop, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between gap-3 shadow-xs"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-black shrink-0">
                            {idx + 1}
                          </div>
                          <div className="min-w-0">
                            <span className="text-sm font-bold text-slate-900 block truncate">
                              {stop.name || "Untitled Stop"}
                            </span>
                            {stop.latitude !== 0 && (
                              <span className="text-[10px] text-slate-400 font-mono block">
                                {stop.latitude.toFixed(5)}, {stop.longitude.toFixed(5)}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => setPickerTarget(idx)}
                            className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors"
                          >
                            <MapPin size={12} className="inline mr-1" />
                            {stop.latitude !== 0 ? "Edit Pin" : "Set Pin"}
                          </button>
                          <button
                            type="button"
                            onClick={() => removeIntermediateStop(idx)}
                            className="p-1.5 text-slate-300 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 3. END LOCATION */}
              <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500 ring-4 ring-red-100" />
                    <span className="text-xs font-black uppercase text-slate-700 tracking-wider">
                      End Location / Final School
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPickerTarget("end")}
                    className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <MapPin size={12} /> {endLocation.name ? "Edit on Map" : "Set on Map"}
                  </button>
                </div>
                {endLocation.name ? (
                  <div className="bg-white p-3 rounded-2xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-sm font-black text-slate-900 block">{endLocation.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {endLocation.latitude.toFixed(5)}, {endLocation.longitude.toFixed(5)}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      Pin Placed
                    </span>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No end location set yet. Click &ldquo;Set on Map&rdquo;.</p>
                )}
              </div>

              {/* Final submission button */}
              <div className="pt-4 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={loading || !startLocation.name || !endLocation.name}
                  onClick={handleSubmit}
                  className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm hover:bg-emerald-700 shadow-2xl shadow-emerald-200 transition-all flex items-center gap-2 disabled:opacity-40"
                >
                  {loading ? "Saving Setup..." : "Complete Van & Route Setup"} <CheckCircle2 size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* DRAGGABLE LOCATION PICKER MODAL */}
      {pickerTarget !== null && (
        <DraggableLocationPicker
          title={
            pickerTarget === "start"
              ? "Set Starting Location"
              : pickerTarget === "end"
              ? "Set End Location / School"
              : `Set Intermediate Stop #${(pickerTarget as number) + 1}`
          }
          initialName={
            pickerTarget === "start"
              ? startLocation.name
              : pickerTarget === "end"
              ? endLocation.name
              : intermediateStops[pickerTarget as number]?.name || ""
          }
          initialLat={
            pickerTarget === "start"
              ? startLocation.latitude
              : pickerTarget === "end"
              ? endLocation.latitude
              : intermediateStops[pickerTarget as number]?.latitude || undefined
          }
          initialLng={
            pickerTarget === "start"
              ? startLocation.longitude
              : pickerTarget === "end"
              ? endLocation.longitude
              : intermediateStops[pickerTarget as number]?.longitude || undefined
          }
          onConfirm={handlePickerConfirm}
          onCancel={() => setPickerTarget(null)}
        />
      )}
    </div>
  );
}
