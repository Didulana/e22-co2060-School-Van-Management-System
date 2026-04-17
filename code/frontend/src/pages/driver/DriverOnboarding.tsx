import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
    submitOnboarding, 
    getOnboardingStatus
} from "../../services/driverService";
import LocationSearchInput from "../../components/LocationSearchInput";
import { 
    UserCircle, 
    Truck, 
    CheckCircle2, 
    ChevronRight, 
    Plus, 
    Trash2,
    ShieldCheck,
    Zap,
    X,
    Navigation,
    Info
} from "lucide-react";

export default function DriverOnboarding() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Form State
    const [licenseNumber, setLicenseNumber] = useState("");
    const [vehicleDetails, setVehicleDetails] = useState({
        registrationNumber: "",
        type: "Van",
        seatCount: 12,
        isAc: false
    });
    const [routeStops, setRouteStops] = useState<{name: string, latitude: number, longitude: number}[]>([]);

    useEffect(() => {
        loadStatus();
    }, []);

    const loadStatus = async () => {
        try {
            const statusData = await getOnboardingStatus();
            if (!statusData.completed && statusData.step) {
                setStep(statusData.step);
            }
        } catch (err) {
            console.error("Link failure: Setup status unreachable.");
        }
    };

    const handleAddStop = () => {
        setRouteStops([...routeStops, { name: "", latitude: 0, longitude: 0 }]);
    };

    const handleStopChange = (index: number, name: string, latitude: number, longitude: number) => {
        const newStops = [...routeStops];
        newStops[index] = { name, latitude, longitude };
        setRouteStops(newStops);
    };

    const removeStop = (index: number) => {
        setRouteStops(routeStops.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (routeStops.length < 2) {
            alert("Please select at least 2 stops for your route.");
            return;
        }

        const isIncomplete = routeStops.some(s => !s.name || s.latitude === 0);
        if (isIncomplete) {
            alert("Please make sure all stops have names and locations.");
            return;
        }

        setLoading(true);
        try {
            await submitOnboarding({
                licenseNumber,
                vehicleDetails,
                routeStops
            });
            alert("Van and route information saved! You are ready to start.");
            navigate("/driver");
        } catch (err: any) {
            alert(`Uplink Error: ${err.message || "Please re-initialize session."}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center py-12 px-6 w-full animate-in fade-in duration-700 font-sans">
            {/* Mission Header */}
            <div className="w-full max-w-3xl flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
                <div className="text-left">
                    <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">Set up Your Van</h1>
                    <div className="mt-4 flex items-center gap-3">
                        <ShieldCheck className="text-emerald-500" size={20} />
                        <p className="text-lg font-bold text-slate-400 capitalize">Enter your van and route details to get started.</p>
                    </div>
                </div>
                <button 
                    onClick={() => navigate("/driver")}
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-50 text-sm font-black text-slate-400 uppercase tracking-widest hover:text-red-500 hover:bg-red-50 transition-all"
                >
                    <X size={18} />
                    Cancel
                </button>
            </div>

            {/* Premium Stepper */}
            <div className="w-full max-w-3xl flex justify-between mb-20 relative">
                <div className="absolute top-[20px] left-0 w-full h-[2px] bg-slate-100 -z-10" />
                <div 
                    className="absolute top-[20px] left-0 h-[2px] bg-emerald-500 -z-10 transition-all duration-700 shadow-[0_0_10px_rgba(16,185,129,0.5)]" 
                    style={{ width: `${(step - 1) * 50}%` }}
                />
                {[1, 2, 3].map((s) => (
                    <div key={s} className="flex flex-col items-center">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-base transition-all duration-500 shadow-xl ${
                            step === s ? "bg-slate-900 text-white scale-125 ring-8 ring-slate-100" : 
                            step > s ? "bg-emerald-500 text-white" : "bg-white text-slate-300 border-2 border-slate-50"
                        }`}>
                            {step > s ? <CheckCircle2 size={24} /> : s}
                        </div>
                        <span className={`mt-6 text-[10px] font-black uppercase tracking-[0.2em] ${step >= s ? "text-slate-900" : "text-slate-300"}`}>
                            {s === 1 ? "Your Info" : s === 2 ? "Van Info" : "Route Stops"}
                        </span>
                    </div>
                ))}
            </div>

            {/* Terminal Container */}
            <div className="w-full max-w-3xl bg-white rounded-[3rem] shadow-premium border border-slate-50 overflow-hidden">
                <div className="bg-slate-50/50 px-12 py-8 border-b border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-emerald-500 border border-slate-100/50">
                            {step === 1 ? <UserCircle size={24} /> : step === 2 ? <Truck size={24} /> : <Navigation size={24} />}
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">
                                {step === 1 ? "Personal Details" : step === 2 ? "Van Details" : "Route Stops"}
                            </h2>
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-0.5">Step {step} of 3</p>
                        </div>
                    </div>
                    {step > 1 && (
                        <button onClick={() => setStep(step - 1)} className="text-sm font-black text-slate-300 uppercase tracking-widest hover:text-slate-900 transition-colors">Go Back</button>
                    )}
                </div>

                <div className="p-12">
                    {step === 1 && (
                        <div className="animate-in fade-in slide-in-from-right-10 duration-500 space-y-10">
                             <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-300 ml-4 uppercase tracking-[0.2em]">Driving License Number</label>
                                <div className="relative">
                                    <ShieldCheck className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                                    <input 
                                        type="text" 
                                        value={licenseNumber}
                                        onChange={(e) => setLicenseNumber(e.target.value)}
                                        className="w-full bg-slate-50/50 pl-16 pr-8 py-5 rounded-[2rem] border border-slate-100 text-slate-900 font-extrabold tracking-tight focus:bg-white focus:border-emerald-500 focus:ring-[12px] focus:ring-emerald-500/5 transition-all outline-none text-lg"
                                        placeholder="Enter your license number"
                                    />
                                </div>
                            </div>
                            
                            <button 
                                onClick={() => setStep(2)}
                                disabled={!licenseNumber}
                                className="group w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black text-lg shadow-2xl shadow-slate-200 hover:bg-emerald-600 hover:shadow-emerald-200 transition-all flex items-center justify-center gap-3 disabled:opacity-30 active:scale-95"
                            >
                                Next Step <ChevronRight size={22} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="animate-in fade-in slide-in-from-right-10 duration-500 space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-300 ml-4 uppercase tracking-[0.2em]">Van Plate Number</label>
                                    <input 
                                        type="text" 
                                        value={vehicleDetails.registrationNumber}
                                        onChange={(e) => setVehicleDetails({...vehicleDetails, registrationNumber: e.target.value})}
                                        className="w-full bg-slate-50/50 px-8 py-5 rounded-[2rem] border border-slate-100 text-slate-900 font-extrabold tracking-tight focus:bg-white focus:border-emerald-500 focus:ring-[12px] focus:ring-emerald-500/5 transition-all outline-none text-lg"
                                        placeholder="Example: WP-CAT-9000"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-300 ml-4 uppercase tracking-[0.2em]">Vehicle Type</label>
                                    <select 
                                        value={vehicleDetails.type}
                                        onChange={(e) => setVehicleDetails({...vehicleDetails, type: e.target.value})}
                                        className="w-full bg-slate-50/50 px-8 py-5 rounded-[2rem] border border-slate-100 text-slate-900 font-extrabold tracking-tight focus:bg-white focus:border-emerald-500 focus:ring-[12px] focus:ring-emerald-500/5 transition-all outline-none text-lg appearance-none"
                                    >
                                        <option>Van</option>
                                        <option>Mini Bus</option>
                                        <option>Standard Bus</option>
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-300 ml-4 uppercase tracking-[0.2em]">Number of Seats</label>
                                    <input 
                                        type="number" 
                                        value={vehicleDetails.seatCount}
                                        onChange={(e) => setVehicleDetails({...vehicleDetails, seatCount: parseInt(e.target.value)})}
                                        className="w-full bg-slate-50/50 px-8 py-5 rounded-[2rem] border border-slate-100 text-slate-900 font-extrabold tracking-tight focus:bg-white focus:border-emerald-500 focus:ring-[12px] focus:ring-emerald-500/5 transition-all outline-none text-lg"
                                    />
                                </div>
                                <div className="flex items-end pb-4">
                                    <label className="relative flex items-center gap-4 cursor-pointer group">
                                        <input 
                                            type="checkbox" 
                                            checked={vehicleDetails.isAc}
                                            onChange={(e) => setVehicleDetails({...vehicleDetails, isAc: e.target.checked})}
                                            className="w-8 h-8 rounded-xl bg-slate-50 border-slate-100 text-emerald-500 focus:ring-emerald-500 transition-all border-2"
                                        />
                                        <span className="text-base font-black text-slate-700 tracking-tight uppercase">Air Conditioned (A/C)</span>
                                        <Zap className={`transition-all ${vehicleDetails.isAc ? "text-blue-500 animate-pulse" : "text-slate-200"}`} size={20} />
                                    </label>
                                </div>
                            </div>

                            <button 
                                onClick={() => setStep(3)}
                                disabled={!vehicleDetails.registrationNumber}
                                className="group w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black text-lg shadow-2xl shadow-slate-200 hover:bg-emerald-600 hover:shadow-emerald-200 transition-all flex items-center justify-center gap-3 disabled:opacity-30 active:scale-95"
                            >
                                Set Route Stops <ChevronRight size={22} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="animate-in fade-in slide-in-from-right-10 duration-500 space-y-10">
                            <div className="flex items-center gap-4 p-6 bg-emerald-50/50 rounded-3xl border border-emerald-100">
                                <Info className="text-emerald-500" size={24} />
                                <p className="text-sm font-bold text-emerald-800 tracking-tight leading-relaxed">
                                    Please add the stops where you pick up and drop off children. You can search for locations by name.
                                </p>
                            </div>

                            <div className="space-y-6">
                                {routeStops.map((stop, index) => (
                                    <div key={index} className="group flex items-start gap-4 animate-in slide-in-from-top-4 duration-300">
                                        <div className="mt-4 w-10 h-10 rounded-2xl bg-white shadow-sm text-slate-300 flex items-center justify-center text-xs font-black border border-slate-50 group-hover:bg-slate-900 group-hover:text-white transition-all shrink-0">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1">
                                            <LocationSearchInput 
                                                placeholder={index === 0 ? "Starting location..." : "Next stop..."}
                                                initialValue={stop.name}
                                                onSelect={(name, lat, lon) => handleStopChange(index, name, lat, lon)}
                                            />
                                        </div>
                                        <button 
                                            onClick={() => removeStop(index)}
                                            className="mt-4 p-3 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                                        >
                                            <Trash2 size={22} />
                                        </button>
                                    </div>
                                ))}
                                
                                <button 
                                    onClick={handleAddStop}
                                    className="w-full py-6 border-2 border-dashed border-slate-100 rounded-[2.5rem] text-slate-300 hover:border-emerald-300 hover:text-emerald-500 hover:bg-emerald-50/20 transition-all flex items-center justify-center gap-4 font-black tracking-widest uppercase text-xs group"
                                >
                                    <Plus size={24} className="group-hover:rotate-90 transition-transform duration-500" /> 
                                    Add another stop
                                </button>
                            </div>

                            <button 
                                onClick={handleSubmit}
                                disabled={loading || routeStops.length < 2}
                                className="w-full py-6 bg-emerald-500 text-white rounded-[2rem] font-black text-xl shadow-2xl shadow-emerald-500/20 hover:bg-emerald-600 transition-all flex items-center justify-center gap-4 disabled:opacity-30 active:scale-95"
                            >
                                {loading ? "Saving..." : "Save and Finish"} <CheckCircle2 size={24} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Safety Footer */}
            <div className="mt-12 text-center opacity-40">
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">KidsRoute - Safe School Transfers</p>
            </div>
        </div>
    );
}
