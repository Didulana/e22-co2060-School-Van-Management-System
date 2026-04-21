import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getChildren, Child, getParentNotifications } from "../../services/parentService";
import { UserCircle, School, ChevronRight, LayoutDashboard, Users, Navigation, MapPin, Clock, ShieldCheck, Phone, Bell } from "lucide-react";

export default function ParentDashboard() {
    const [children, setChildren] = useState<Child[]>([]);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadData = async () => {
            try {
                const [data, notifs] = await Promise.all([
                    getChildren(),
                    getParentNotifications()
                ]);
                setChildren(data);
                setNotifications(notifs);
            } catch (err: any) {
                setError("Remote sync failed. Retrying connection...");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) return (
        <div className="flex min-h-[400px] items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-100 border-t-emerald-500" />
        </div>
    );

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            {/* Premium Header */}
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <h1 className="text-5xl font-black tracking-tighter text-slate-900 leading-none">Home Dashboard</h1>
                    <p className="mt-4 text-lg font-medium text-slate-400 capitalize flex items-center gap-2">
                        <ShieldCheck className="text-emerald-500" size={20} />
                        Tracking your children
                    </p>
                </div>
                <Link to="/parent/children" className="group flex items-center gap-3 rounded-[2rem] bg-slate-900 px-8 py-4 text-sm font-bold text-white shadow-2xl shadow-slate-200 transition-all hover:bg-emerald-600 hover:shadow-emerald-200 active:scale-95">
                    <Users size={18} />
                    Child Details
                    <ChevronRight size={16} className="translate-x-0 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            {error && (
                <div className="rounded-[2rem] border border-red-100 bg-red-50/50 p-6 text-sm font-bold text-red-600 animate-pulse">
                    ⚠️ {error}
                </div>
            )}

            {notifications.length > 0 && (
                <div className="bg-slate-900 text-white p-8 rounded-[3rem] shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-700">
                        <Bell size={120} />
                    </div>
                    <div className="flex items-start sm:items-center gap-6 relative z-10 w-full">
                        <div className="h-16 w-16 shrink-0 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-400 border border-white/10 mt-1 sm:mt-0 shadow-inner">
                            <Bell size={28} />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-xl font-black tracking-tighter text-white">Latest Announcement</h2>
                            <p className="mt-2 text-base font-medium text-slate-300 leading-relaxed">
                                {notifications[0].message}
                            </p>
                            <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-emerald-500/80 font-black">
                                {new Date(notifications[0].created_at).toLocaleDateString()} at {new Date(notifications[0].created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {children.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-[3rem] bg-white p-24 shadow-premium border border-slate-50 text-center">
                    <div className="mb-8 h-24 w-24 rounded-[2rem] bg-slate-50 flex items-center justify-center text-slate-200 border border-slate-100 shadow-inner">
                        <LayoutDashboard size={48} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Add a child to start</h2>
                    <p className="mt-3 text-slate-400 font-medium max-w-sm mx-auto">Add your child's information to see where the van is and get arrival updates.</p>
                    <Link to="/parent/children" className="mt-10 rounded-2xl bg-emerald-500 px-10 py-5 text-base font-black text-white shadow-xl shadow-emerald-200 transition-all hover:bg-emerald-600 active:scale-95">
                        Add First Child
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
                    {children.map(child => (
                        <div key={child.id} className="premium-card group relative p-8 rounded-[3rem]">
                            {/* Status Badge */}
                            <div className="absolute top-8 right-8">
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] shadow-sm ${
                                    child.current_status === 'en_route' ? 'bg-emerald-500 text-white animate-pulse' : 
                                    child.current_status === 'dropped_off' ? 'bg-blue-600 text-white' : 
                                    'bg-slate-100 text-slate-400'
                                }`}>
                                    {child.current_status === 'en_route' ? 'In the Van' : 
                                    child.current_status === 'dropped_off' ? 'Arrived' : 
                                    'At Home / School'}
                                </span>
                            </div>

                            <div className="flex flex-col h-full">
                                <div className="flex items-center gap-6 mb-10">
                                    <div className="h-20 w-20 rounded-[2rem] bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors duration-500">
                                        <UserCircle size={44} />
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-black text-slate-900 tracking-tighter leading-none">{child.name}</h3>
                                        <div className="flex items-center gap-2 mt-2 text-sm font-bold text-slate-400">
                                            <School size={16} className="text-emerald-500/50" />
                                            <span>{child.school || "St. Peters College"}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-auto space-y-4">
                                    {/* Logistics Strip */}
                                    <div className="flex items-center justify-between p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100 group-hover:bg-white group-hover:shadow-sm transition-all duration-500">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-emerald-500 border border-slate-100">
                                                <MapPin size={20} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Pickup Location</p>
                                                <p className="text-base font-black text-slate-800 tracking-tight leading-none mt-1 truncate max-w-[120px]">
                                                    {child.pickup_stop_name || `Stop #${child.pickup_stop_id}`}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <Link 
                                            to="/tracking" 
                                            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white border border-slate-100 text-slate-900 shadow-sm transition hover:bg-slate-900 hover:text-white hover:border-slate-900 active:scale-90"
                                            title="View Radar"
                                        >
                                            <Navigation size={22} />
                                        </Link>
                                    </div>

                                    {/* Arrival Predictor Overlay */}
                                    <div className="flex items-center gap-3 px-6 py-3 bg-emerald-50/50 rounded-2xl border border-emerald-100/30">
                                        <Clock size={14} className="text-emerald-500" />
                                        <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                                            Next Pickup: <span className="text-emerald-900 font-black">6:45 AM</span> • Driver ID: <span className="font-black">#{child.driver_id || "N/A"}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Premium Quick Actions */}
            {!loading && children.length > 0 && (
                <div className="pt-12">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-[1px] flex-1 bg-slate-100"></div>
                        <h2 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] whitespace-nowrap">Useful Links</h2>
                        <div className="h-[1px] flex-1 bg-slate-100"></div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <QuickLink to="/parent/history" icon={<History size={20}/>} label="Trip History" sub="See past trips" />
                        <QuickLink to="/parent/children" icon={<Users size={20}/>} label="Child Details" sub="Update your child's info" />
                        <QuickLink to="tel:+94112233445" icon={<Phone size={20}/>} label="Help Line" sub="Contact support" external />
                    </div>
                </div>
            )}
        </div>
    );
}

function History({ size }: { size: number }) { return <Navigation size={size} />; } // Local Alias for lucide History

function QuickLink({ to, icon, label, sub, external = false }: { to: string; icon: any; label: string; sub: string; external?: boolean }) {
    const content = (
        <>
            <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-white/10 group-hover:text-emerald-400 transition-colors shadow-inner">
                {icon}
            </div>
            <div className="flex-1">
                <p className="text-lg font-black text-slate-900 leading-none group-hover:text-white transition-colors tracking-tighter">{label}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 group-hover:text-slate-500">{sub}</p>
            </div>
            <ChevronRight size={20} className="text-slate-200 group-hover:text-emerald-500 transition-colors" />
        </>
    );

    const className = "flex items-center gap-5 p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-soft transition-all hover:bg-slate-900 group";

    if (external) {
        return (
            <a href={to} className={className}>
                {content}
            </a>
        );
    }

    return (
        <Link to={to} className={className}>
            {content}
        </Link>
    );
}
