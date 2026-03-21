import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
    getPredefinedStops, 
    submitOnboarding, 
    PredefinedStop 
} from "../../services/driverService";
import { 
    UserCircle, 
    Truck, 
    MapPin, 
    CheckCircle2, 
    ChevronRight, 
    Plus, 
    Trash2,
    Search
} from "lucide-react";

export default function DriverOnboarding() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [stops, setStops] = useState<PredefinedStop[]>([]);
    const [loading, setLoading] = useState(false);

    // Form State
    const [licenseNumber, setLicenseNumber] = useState("");
    const [vehicleDetails, setVehicleDetails] = useState({
        registrationNumber: "",
        type: "Van",
        seatCount: 12,
        isAc: false
    });
    const [routeStops, setRouteStops] = useState<PredefinedStop[]>([]);

    useEffect(() => {
        loadStops();
    }, []);

    const loadStops = async () => {
        try {
            const data = await getPredefinedStops();
            setStops(data);
        } catch (err) {
            console.error("Failed to load stops", err);
        }
    };

    const handleAddStop = () => {
        setRouteStops([...routeStops, stops[0]]);
    };

    const handleStopChange = (index: number, stopId: number) => {
        const selectedStop = stops.find(s => s.id === stopId);
        if (selectedStop) {
            const newStops = [...routeStops];
            newStops[index] = selectedStop;
            setRouteStops(newStops);
        }
    };

    const removeStop = (index: number) => {
        setRouteStops(routeStops.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (routeStops.length < 2) {
            alert("Please add at least 2 stops to define a route.");
            return;
        }
        setLoading(true);
        try {
            await submitOnboarding({
                licenseNumber,
                vehicleDetails,
                routeStops
            });
            alert("Onboarding completed successfully!");
            navigate("/driver");
        } catch (err) {
            alert("Failed to complete onboarding. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center py-8 px-4 w-full">
            {/* Header */}
            <div className="w-full max-w-2xl flex justify-between items-start mb-10">
                <div className="text-left">
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Driver Onboarding</h1>
                    <p className="mt-2 text-slate-500 font-medium">Complete these steps to start your journeys.</p>
                </div>
                <button 
                    onClick={() => navigate("/driver")}
                    className="px-4 py-2 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
                >
                    Cancel
                </button>
            </div>

            {/* Stepper */}
            <div className="w-full max-w-2xl flex justify-between mb-12 relative">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -z-10 -translate-y-1/2" />
                {[1, 2, 3].map((s) => (
                    <div key={s} className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all shadow-sm ${
                            step >= s ? "bg-emerald-500 text-white scale-110" : "bg-white text-slate-400 border border-slate-200"
                        }`}>
                            {step > s ? <CheckCircle2 size={20} /> : s}
                        </div>
                        <span className={`mt-2 text-xs font-bold uppercase tracking-widest ${step >= s ? "text-emerald-600" : "text-slate-400"}`}>
                            {s === 1 ? "Professional" : s === 2 ? "Vehicle" : "Route"}
                        </span>
                    </div>
                ))}
            </div>

            {/* Form Container */}
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-10">
                {step === 1 && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                                <UserCircle size={24} />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">Professional Details</h2>
                        </div>
                        
                        <label className="block text-sm font-bold text-slate-700 mb-2">Driving License Number</label>
                        <input 
                            type="text" 
                            value={licenseNumber}
                            onChange={(e) => setLicenseNumber(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all mb-8"
                            placeholder="Enter your license number"
                        />
                        
                        <button 
                            onClick={() => setStep(2)}
                            disabled={!licenseNumber}
                            className="w-full py-4 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            Next Step <ChevronRight size={20} />
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                                <Truck size={24} />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">Vehicle Details</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Registration Number</label>
                                <input 
                                    type="text" 
                                    value={vehicleDetails.registrationNumber}
                                    onChange={(e) => setVehicleDetails({...vehicleDetails, registrationNumber: e.target.value})}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                                    placeholder="Ex: WP-CAT-1234"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Vehicle Type</label>
                                <select 
                                    value={vehicleDetails.type}
                                    onChange={(e) => setVehicleDetails({...vehicleDetails, type: e.target.value})}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                                >
                                    <option>Van</option>
                                    <option>Mini Bus</option>
                                    <option>Bus</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Seat Count</label>
                                <input 
                                    type="number" 
                                    value={vehicleDetails.seatCount}
                                    onChange={(e) => setVehicleDetails({...vehicleDetails, seatCount: parseInt(e.target.value)})}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                                />
                            </div>
                            <div className="flex items-end pb-3">
                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                    <input 
                                        type="checkbox" 
                                        checked={vehicleDetails.isAc}
                                        onChange={(e) => setVehicleDetails({...vehicleDetails, isAc: e.target.checked})}
                                        className="w-5 h-5 rounded text-emerald-500 border-slate-300 focus:ring-emerald-500"
                                    />
                                    <span className="text-sm font-bold text-slate-700">Air Conditioned</span>
                                </label>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button 
                                onClick={() => setStep(1)}
                                className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all"
                            >
                                Back
                            </button>
                            <button 
                                onClick={() => setStep(3)}
                                disabled={!vehicleDetails.registrationNumber}
                                className="flex-[2] py-4 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                Next Step <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                                <MapPin size={24} />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">Route Creation</h2>
                        </div>

                        <p className="text-sm text-slate-500 mb-6 font-medium bg-slate-50 p-4 rounded-xl border border-slate-100">
                            Add the main cities or towns you pass through on your regular route in order.
                        </p>

                        <div className="space-y-4 mb-8">
                            {routeStops.map((stop, index) => (
                                <div key={index} className="flex items-center gap-4 animate-in zoom-in-95 duration-200">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-xs font-bold border border-slate-200 shrink-0">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1 relative">
                                        <select 
                                            value={stop.id}
                                            onChange={(e) => handleStopChange(index, parseInt(e.target.value))}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none appearance-none bg-white font-medium"
                                        >
                                            {stops.map(s => (
                                                <option key={s.id} value={s.id}>{s.name}</option>
                                            ))}
                                        </select>
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                            <Search size={16} />
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => removeStop(index)}
                                        className="p-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            ))}
                            
                            <button 
                                onClick={handleAddStop}
                                className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:border-emerald-300 hover:text-emerald-500 hover:bg-emerald-50/30 transition-all flex items-center justify-center gap-2 font-bold"
                            >
                                <Plus size={20} /> Add Stop
                            </button>
                        </div>

                        <div className="flex gap-4">
                            <button 
                                onClick={() => setStep(2)}
                                className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all"
                            >
                                Back
                            </button>
                            <button 
                                onClick={handleSubmit}
                                disabled={loading || routeStops.length < 2}
                                className="flex-[2] py-4 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {loading ? "Completing..." : "Complete Setup"} <CheckCircle2 size={20} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
