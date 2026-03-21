import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getChildren, Child } from "../../services/parentService";
import { UserCircle, School, ChevronRight, LayoutDashboard, Users, Navigation, MapPin } from "lucide-react";

export default function ParentDashboard() {
    const [children, setChildren] = useState<Child[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await getChildren();
                setChildren(data);
            } catch (err: any) {
                setError("Unable to load children data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) return (
        <div className="flex min-h-[400px] items-center justify-center bg-[#f8f8f6]">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-500" />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f8f8f6] p-6 lg:p-10 text-slate-900">
            <div className="mx-auto max-w-6xl">
                {/* Clean Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-800">Your Dashboard</h1>
                        <p className="mt-1 text-base text-slate-500">Monitor your children's commute status</p>
                    </div>
                    <Link to="/parent/children" className="flex items-center gap-2 rounded-2xl bg-emerald-500 px-6 py-4 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600 active:scale-95">
                        <Users size={18} />
                        Child Profiles
                    </Link>
                </div>

                {error && (
                    <div className="mb-8 rounded-2xl border-l-4 border-red-500 bg-red-50 p-4 text-sm font-medium text-red-800">
                        {error}
                    </div>
                )}

                {children.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-3xl bg-white p-16 shadow-sm border border-slate-200 text-center animate-in fade-in">
                        <div className="mb-6 h-20 w-20 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300">
                            <LayoutDashboard size={40} />
                        </div>
                        <h2 className="text-2xl font-semibold text-slate-800">No children registered</h2>
                        <p className="mt-2 text-slate-500 max-w-sm">Register your children to start tracking their school journeys and receive real-time updates.</p>
                        <Link to="/parent/children" className="mt-8 rounded-2xl bg-emerald-500 px-8 py-4 text-sm font-semibold text-white transition hover:bg-emerald-600 active:scale-95">
                            Add Your First Child
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {children.map(child => (
                            <div key={child.id} className="group overflow-hidden rounded-2xl bg-white p-6 border border-slate-100 shadow-sm transition-all hover:shadow-md">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                            <UserCircle size={28} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-800">{child.name}</h3>
                                            <div className="flex items-center gap-1.5 mt-0.5 text-xs font-semibold text-slate-400">
                                                <School size={12} />
                                                <span>{child.school || "School Not Set"}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`rounded-xl px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                                        child.current_status === 'en_route' ? 'bg-emerald-50 text-emerald-700' : 
                                        child.current_status === 'dropped_off' ? 'bg-blue-50 text-blue-700' : 
                                        'bg-slate-50 text-slate-500'
                                    }`}>
                                        {child.current_status?.replace('_', ' ') || 'Waiting'}
                                    </div>
                                </div>

                                <div className="rounded-xl bg-slate-50 p-4 border border-slate-100/50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center text-slate-300 shadow-sm">
                                                <MapPin size={16} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Default Stop</p>
                                                <p className="text-sm font-semibold text-slate-700 leading-none mt-0.5">#{child.pickup_stop_id}</p>
                                            </div>
                                        </div>
                                        <Link 
                                            to="/tracking" 
                                            className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500 text-white shadow-sm transition hover:bg-emerald-600 active:scale-95"
                                            title="Track Live"
                                        >
                                            <Navigation size={18} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Simplified Quick Navigation */}
                {!loading && children.length > 0 && (
                    <div className="mt-12 border-t border-slate-200 pt-10">
                        <h2 className="text-lg font-bold text-slate-800 mb-6 uppercase tracking-wider text-center">Quick Navigation</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Link to="/parent/history" className="flex items-center justify-between p-6 rounded-2xl bg-white border border-slate-200 shadow-sm transition hover:border-emerald-200 hover:shadow-md">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                        <LayoutDashboard size={20} />
                                    </div>
                                    <span className="font-semibold text-slate-700">Journey History</span>
                                </div>
                                <ChevronRight size={18} className="text-slate-300" />
                            </Link>
                            <Link to="/parent/children" className="flex items-center justify-between p-6 rounded-2xl bg-white border border-slate-200 shadow-sm transition hover:border-emerald-200 hover:shadow-md">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                        <Users size={20} />
                                    </div>
                                    <span className="font-semibold text-slate-700">Profile Settings</span>
                                </div>
                                <ChevronRight size={18} className="text-slate-300" />
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
