import { useEffect, useState } from "react";
import { 
    getChildren, 
    registerChild, 
    updateChild, 
    getAvailableRoutes, 
    Child, 
    Route 
} from "../../services/parentService";
import { UserPlus, UserCircle, Plus, ChevronRight, Edit3, MapPin } from "lucide-react";
import StopSelectorMap from "../../components/parent/StopSelectorMap";

export default function ChildManagement() {
    const [children, setChildren] = useState<Child[]>([]);
    const [availableRoutes, setAvailableRoutes] = useState<Route[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingChild, setEditingChild] = useState<Child | null>(null);
    const [showForm, setShowForm] = useState(false);
    
    const [formData, setFormData] = useState({ 
        name: "", 
        school: "", 
        route_id: "", 
        pickup_stop_id: "", 
        dropoff_stop_id: "",
        pickup_lat: 0,
        pickup_lng: 0,
        dropoff_lat: 0,
        dropoff_lng: 0
    });

    const loadData = async () => {
        try {
            setLoading(true);
            const [kids, routes] = await Promise.all([
                getChildren(),
                getAvailableRoutes()
            ]);
            setChildren(kids);
            setAvailableRoutes(routes);
        } catch (err) {
            console.error("Failed to load children or routes");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const selectedRoute = availableRoutes.find(r => r.id.toString() === formData.route_id);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                name: formData.name,
                school: formData.school,
                pickup_stop_id: parseInt(formData.pickup_stop_id),
                dropoff_stop_id: parseInt(formData.dropoff_stop_id),
                pickup_lat: formData.pickup_lat,
                pickup_lng: formData.pickup_lng,
                dropoff_lat: formData.dropoff_lat,
                dropoff_lng: formData.dropoff_lng
            };
            if (editingChild) {
                await updateChild(editingChild.id, payload);
            } else {
                await registerChild(payload);
            }
            setShowForm(false);
            setEditingChild(null);
            setFormData({ name: "", school: "", route_id: "", pickup_stop_id: "", dropoff_stop_id: "", pickup_lat: 0, pickup_lng: 0, dropoff_lat: 0, dropoff_lng: 0 });
            loadData();
        } catch (err) {
            alert("Failed to save child profile");
        }
    };

    const handleEdit = (child: Child) => {
        const route = availableRoutes.find(r => 
            r.stops.find(s => s.id === child.pickup_stop_id) || 
            r.stops.find(s => s.id === child.dropoff_stop_id)
        );

        setEditingChild(child);
        setFormData({
            name: child.name,
            school: child.school || "",
            route_id: route?.id.toString() || "",
            pickup_stop_id: child.pickup_stop_id?.toString() || "",
            dropoff_stop_id: child.dropoff_stop_id?.toString() || "",
            pickup_lat: child.pickup_lat || 0,
            pickup_lng: child.pickup_lng || 0,
            dropoff_lat: child.dropoff_lat || 0,
            dropoff_lng: child.dropoff_lng || 0
        });
        setShowForm(true);
    };

    if (loading) return (
        <div className="flex min-h-[400px] items-center justify-center bg-[#f8f8f6]">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-500" />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f8f8f6] p-6 lg:p-10 text-slate-900">
            <div className="mx-auto max-w-6xl">
                {/* Minimalist Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-10">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-800">Child Management</h1>
                        <p className="mt-1 text-base text-slate-500">Configure child profiles and transport points</p>
                    </div>
                    {!showForm && (
                        <button 
                            onClick={() => { setEditingChild(null); setShowForm(true); }}
                            className="flex items-center gap-2 rounded-2xl bg-emerald-500 px-6 py-4 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600 active:scale-95"
                        >
                            <Plus size={18} />
                            Add New Child
                        </button>
                    )}
                </div>

                {showForm && (
                    <div className="mb-10 overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-200 animate-in fade-in zoom-in-95 duration-300">
                        <div className="flex items-center gap-3 border-b border-slate-100 px-8 py-6 bg-slate-50/50">
                            <div className="rounded-xl bg-white p-2.5 shadow-sm text-emerald-600">
                                <UserPlus size={22} />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">{editingChild ? "Update Profile" : "New Registration"}</h2>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-8">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 ml-1">Full Name</label>
                                    <input 
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({...formData, name: e.target.value})}
                                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 font-medium focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all outline-none"
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 ml-1">School</label>
                                    <input 
                                        value={formData.school}
                                        onChange={e => setFormData({...formData, school: e.target.value})}
                                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 font-medium focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all outline-none"
                                        placeholder="Greenfield High"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 ml-1">Transport Route</label>
                                    <select 
                                        required
                                        value={formData.route_id}
                                        onChange={e => setFormData({...formData, route_id: e.target.value, pickup_stop_id: "", dropoff_stop_id: ""})}
                                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 font-medium focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all outline-none"
                                    >
                                        <option value="">Select a route...</option>
                                        {availableRoutes.map(route => (
                                            <option key={route.id} value={route.id}>{route.name} ({route.driver_name})</option>
                                        ))}
                                    </select>
                                </div>

                                {selectedRoute && (
                                    <div className="md:col-span-2 space-y-8 mt-4 animate-in fade-in slide-in-from-top-4">
                                        <div className="p-1 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                                            <StopSelectorMap 
                                                label="Set Pickup Location"
                                                stops={selectedRoute.stops}
                                                initialLat={formData.pickup_lat}
                                                initialLng={formData.pickup_lng}
                                                onPointSelect={(lat, lng, stopId) => setFormData(prev => ({ 
                                                    ...prev, 
                                                    pickup_lat: lat, 
                                                    pickup_lng: lng,
                                                    pickup_stop_id: stopId.toString()
                                                }))}
                                            />
                                        </div>

                                        <div className="p-1 bg-blue-50/50 rounded-2xl border border-blue-100">
                                            <StopSelectorMap 
                                                label="Set Drop-off Location"
                                                stops={selectedRoute.stops}
                                                initialLat={formData.dropoff_lat}
                                                initialLng={formData.dropoff_lng}
                                                onPointSelect={(lat, lng, stopId) => setFormData(prev => ({ 
                                                    ...prev, 
                                                    dropoff_lat: lat, 
                                                    dropoff_lng: lng,
                                                    dropoff_stop_id: stopId.toString()
                                                }))}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mt-8 flex items-center justify-end gap-6 border-t border-slate-100 pt-8">
                                <button type="button" onClick={() => setShowForm(false)} className="text-sm font-semibold text-slate-400 hover:text-slate-600 transition-colors">Cancel</button>
                                <button type="submit" className="rounded-2xl bg-emerald-500 px-10 py-4 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600 active:scale-95">
                                    {editingChild ? "Save Changes" : "Confirm Enrollment"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {children.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-3xl bg-white p-20 shadow-sm border border-slate-200 text-center animate-in fade-in">
                        <div className="mb-6 h-20 w-20 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 mx-auto">
                            <UserCircle size={48} />
                        </div>
                        <h2 className="text-2xl font-semibold text-slate-800">Your profile list is empty</h2>
                        <p className="mt-1 text-slate-500 max-w-sm">Enroll your children to manage their transport routes and live tracking access.</p>
                        <button 
                            onClick={() => { setEditingChild(null); setShowForm(true); }}
                            className="mt-8 rounded-2xl bg-emerald-500 px-8 py-4 text-sm font-semibold text-white transition hover:bg-emerald-600 active:scale-95"
                        >
                            Enroll First Child
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {children.map(child => {
                            const childRoute = availableRoutes.find(r => 
                                r.stops.find(s => s.id === child.pickup_stop_id)
                            );
                            const pickupStop = childRoute?.stops.find(s => s.id === child.pickup_stop_id);
                            const dropoffStop = childRoute?.stops.find(s => s.id === child.dropoff_stop_id);

                            return (
                                <div key={child.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                                <UserCircle size={24} />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-800 leading-none">{child.name}</h3>
                                                <p className="text-xs font-semibold text-slate-400 mt-1">{child.school || "School Not Provided"}</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => handleEdit(child)}
                                            className="p-2 text-slate-300 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all"
                                        >
                                            <Edit3 size={16} />
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/50 border border-slate-100/50">
                                            <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                            <div className="flex-1">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">Pickup</p>
                                                <p className="text-sm font-semibold text-slate-700 mt-0.5">{pickupStop?.name || "N/A"}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/50 border border-slate-100/50">
                                            <div className="h-2 w-2 rounded-full bg-blue-500" />
                                            <div className="flex-1">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">Drop-off</p>
                                                <p className="text-sm font-semibold text-slate-700 mt-0.5">{dropoffStop?.name || "N/A"}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-5 border-t border-slate-50 flex items-center justify-between">
                                        <div className="flex items-center gap-1 text-xs font-bold text-slate-400">
                                            <MapPin size={12} />
                                            <span>{childRoute?.name || "Unassigned"}</span>
                                        </div>
                                        <ChevronRight size={16} className="text-slate-200" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
