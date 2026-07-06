import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getChildren, Child, getParentNotifications } from "../../services/parentService";
import Van3DIcon from "../../components/Van3DIcon";
import { useAuth } from "../../features/auth/AuthContext";
import { getParentPayments } from "../../services/paymentApi";
import { Payment } from "../../types/payment";
import {
    Bell,
    ChevronRight,
    Clock,
    History as HistoryIcon,
    LayoutDashboard,
    MapPin,
    Navigation,
    Phone,
    School,
    ShieldCheck,
    UserCircle,
    Users,
    CreditCard,
    ArrowRight,
} from "lucide-react";

export default function ParentDashboard() {
    const { session } = useAuth();
    const [children, setChildren] = useState<Child[]>([]);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadData = async () => {
            try {
                const [data, notifs, paymentData] = await Promise.all([
                    getChildren(),
                    getParentNotifications(),
                    session ? getParentPayments(session.token).catch(() => []) : Promise.resolve([])
                ]);
                setChildren(data);
                setNotifications(notifs);
                setPayments(paymentData);
            } catch (err: any) {
                setError("Remote sync failed. Retrying connection...");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [session]);

    if (loading) return (
        <div className="flex min-h-[400px] items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-100 border-t-emerald-500" />
        </div>
    );

    const activeChildren = children.filter(child => child.current_status === "en_route").length;
    const latestNotification = notifications[0];
    const unreadNotifications = notifications.filter(item => !item.is_read).length;
    const activePayment = payments.find(p => p.status !== 'paid') || payments[0];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <section className="liquid-glass grid gap-8 rounded-[2rem] p-6 lg:grid-cols-[1fr_360px] lg:p-8">
                <div className="relative z-10 flex flex-col justify-between gap-8">
                    <div>
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/55 px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-emerald-700 shadow-soft">
                            <ShieldCheck size={14} />
                            Parent command center
                        </div>
                        <h1 className="font-display max-w-3xl text-4xl font-black leading-tight text-slate-950 lg:text-6xl">Home Dashboard</h1>
                        <p className="mt-4 max-w-2xl text-base font-medium leading-7 text-slate-500">
                            A clearer overview of children, van status, latest alerts, and the next action you are most likely to need.
                        </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                        <Metric label="Children" value={children.length.toString()} tone="emerald" />
                        <Metric label="On the road" value={activeChildren.toString()} tone="amber" />
                        <Metric label="New alerts" value={unreadNotifications.toString()} tone="slate" />
                    </div>
                </div>

                <div className="relative z-10 rounded-[1.75rem] border border-white/80 bg-white/60 p-6 shadow-soft">
                    <div className="mb-4 flex items-start justify-between">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Track van indicator</p>
                            <h2 className="font-display mt-2 text-2xl font-black text-slate-950">Ready to track</h2>
                        </div>
                        <span className="flex h-3 w-3 rounded-full bg-emerald-500 shadow-[0_0_18px_rgba(16,185,129,0.9)]" />
                    </div>
                    <div className="flex justify-center py-4">
                        <Van3DIcon />
                    </div>
                    <Link to="/tracking" className="mt-3 flex items-center justify-center gap-3 rounded-2xl bg-emerald-600 px-5 py-4 text-sm font-black text-white shadow-xl shadow-emerald-200 transition hover:bg-emerald-700">
                        <Navigation size={18} />
                        Open live tracking
                        <ChevronRight size={16} />
                    </Link>
                </div>
            </section>

            {error && (
                <div className="rounded-3xl border border-red-100 bg-red-50/80 p-5 text-sm font-bold text-red-600">
                    {error}
                </div>
            )}

            {latestNotification && (
                <section className="grid gap-4 lg:grid-cols-[1fr_280px]">
                    <div className="rounded-[1.75rem] border border-emerald-100 bg-emerald-50/90 p-6 text-slate-900 shadow-soft">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-white text-emerald-600">
                                <Bell size={26} />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-700">Latest announcement</p>
                                <p className="mt-2 text-base font-semibold leading-7 text-slate-700">{latestNotification.message}</p>
                            </div>
                            <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                                {new Date(latestNotification.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </p>
                        </div>
                    </div>
                    <Link to="/parent/history" className="group flex items-center justify-between rounded-[1.75rem] border border-white/80 bg-white/80 p-6 shadow-soft transition hover:bg-white">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Review trips</p>
                            <p className="font-display mt-2 text-xl font-black text-slate-950">History</p>
                        </div>
                        <HistoryIcon className="text-slate-400 transition group-hover:text-emerald-500" size={28} />
                    </Link>
                </section>
            )}

            {/* Payment Card Section */}
            {children.length > 0 && (
                <section>
                    {activePayment ? (
                        <div className="rounded-[1.75rem] border border-white/80 bg-white/85 p-6 shadow-soft text-slate-900">
                            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                                        <CreditCard size={24} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Current Monthly Due</p>
                                        <p className="font-display mt-1 text-2xl font-black text-slate-950">
                                            LKR {Number(activePayment.amount_due).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                                
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Due Date</p>
                                    <p className="text-sm font-bold text-slate-700 mt-1">
                                        {new Date(activePayment.due_date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Status</p>
                                    <span className={`inline-block mt-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                        activePayment.status === 'paid' ? 'bg-emerald-100 text-emerald-800' :
                                        activePayment.status === 'receipt_submitted' ? 'bg-blue-100 text-blue-800' :
                                        activePayment.status === 'overdue' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                                    }`}>
                                        {activePayment.status === 'receipt_submitted' ? 'Reviewing' : activePayment.status}
                                    </span>
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    <Link to="/parent/payments" className="bg-slate-100 text-slate-700 px-5 py-3 rounded-2xl text-xs font-black hover:bg-slate-200 transition shadow-sm">
                                        View Details
                                    </Link>
                                    {activePayment.status !== 'paid' && activePayment.status !== 'receipt_submitted' && (
                                        <Link to="/parent/payments" className="bg-emerald-600 text-white px-5 py-3 rounded-2xl text-xs font-black hover:bg-emerald-700 transition shadow-md shadow-emerald-100">
                                            Upload Receipt
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-[1.75rem] border border-white/80 bg-white/80 p-6 shadow-soft text-slate-900 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                                    <CreditCard size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Fee Management</p>
                                    <p className="mt-1 text-sm font-semibold text-slate-500">No outstanding dues generated for this month.</p>
                                </div>
                            </div>
                            <Link to="/parent/payments" className="flex items-center gap-2 text-xs font-black text-emerald-700 hover:underline">
                                Fee Dashboard <ArrowRight size={16} />
                            </Link>
                        </div>
                    )}
                </section>
            )}

            {children.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-[2rem] border border-white/80 bg-white/80 p-16 text-center shadow-premium">
                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-[1.5rem] border border-slate-100 bg-slate-50 text-slate-300 shadow-inner">
                        <LayoutDashboard size={42} />
                    </div>
                    <h2 className="font-display text-3xl font-black text-slate-950">Add a child to start</h2>
                    <p className="mx-auto mt-3 max-w-sm text-slate-500">Add your child's information to see van location, pickup status, and arrival updates.</p>
                    <Link to="/parent/children" className="mt-8 rounded-2xl bg-emerald-500 px-8 py-4 text-sm font-black text-white shadow-xl shadow-emerald-200 transition hover:bg-emerald-600">
                        Add First Child
                    </Link>
                </div>
            ) : (
                <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                    {children.map(child => (
                        <ChildCard key={child.id} child={child} />
                    ))}
                </section>
            )}

            {children.length > 0 && (
                <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <QuickLink to="/parent/payments" icon={<CreditCard size={20}/>} label="Fee Management" sub="Track & pay monthly dues" />
                    <QuickLink to="/parent/history" icon={<HistoryIcon size={20}/>} label="Trip History" sub="Past boarding and drop-offs" />
                    <QuickLink to="/parent/children" icon={<Users size={20}/>} label="Child Details" sub="Manage student profiles" />
                    <QuickLink to="tel:+94112233445" icon={<Phone size={20}/>} label="Help Line" sub="Contact support" external />
                </section>
            )}
        </div>
    );
}

function Metric({ label, value, tone }: { label: string; value: string; tone: "emerald" | "amber" | "slate" }) {
    const toneClass = {
        emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
        amber: "bg-amber-50 text-amber-700 border-amber-100",
        slate: "bg-slate-50 text-slate-700 border-slate-100",
    }[tone];

    return (
        <div className={`rounded-2xl border px-4 py-3 ${toneClass}`}>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] opacity-70">{label}</p>
            <p className="font-display mt-1 text-3xl font-black">{value}</p>
        </div>
    );
}

function ChildCard({ child }: { child: Child }) {
    const statusLabel = child.current_status === "en_route" ? "In the Van" : child.current_status === "dropped_off" ? "Arrived" : "At Home / School";
    const statusClass = child.current_status === "en_route" ? "bg-emerald-500 text-white" : child.current_status === "dropped_off" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500";

    return (
        <article className="premium-card group rounded-[2rem] p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 items-center gap-5">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 text-slate-300 transition group-hover:bg-emerald-50 group-hover:text-emerald-500">
                        <UserCircle size={38} />
                    </div>
                    <div className="min-w-0">
                        <h3 className="font-display truncate text-2xl font-black text-slate-950">{child.name}</h3>
                        <div className="mt-2 flex items-center gap-2 text-sm font-bold text-slate-400">
                            <School size={16} className="text-emerald-500" />
                            <span className="truncate">{child.school || "St. Peters College"}</span>
                        </div>
                    </div>
                </div>
                <span className={`w-fit rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-[0.15em] ${statusClass}`}>
                    {statusLabel}
                </span>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-[minmax(0,1fr)_auto]">
                <div className="min-w-0 rounded-2xl border border-slate-100 bg-slate-50/80 p-5">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Pickup Location</p>
                    <div className="mt-3 flex min-w-0 items-start gap-3">
                        <MapPin size={20} className="shrink-0 text-emerald-500" />
                        <p className="min-w-0 break-words text-base font-black leading-6 text-slate-900">{child.pickup_stop_name || `Stop #${child.pickup_stop_id}`}</p>
                    </div>
                </div>
                <Link to="/tracking" className="flex min-h-20 shrink-0 items-center justify-center gap-3 rounded-2xl bg-white px-6 py-4 text-sm font-black text-emerald-700 shadow-soft ring-1 ring-emerald-100 transition hover:bg-emerald-50 hover:text-emerald-800">
                    <Navigation size={18} />
                    Track
                </Link>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl border border-emerald-100/70 bg-emerald-50/70 px-5 py-3">
                <Clock size={15} className="text-emerald-600" />
                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                    Next Pickup: <span className="font-black text-emerald-950">6:45 AM</span> • Driver ID: <span className="font-black">#{child.driver_id || "N/A"}</span>
                </p>
            </div>
        </article>
    );
}

function QuickLink({ to, icon, label, sub, external = false }: { to: string; icon: any; label: string; sub: string; external?: boolean }) {
    const content = (
        <>
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-50 text-slate-500 transition group-hover:bg-emerald-50 group-hover:text-emerald-600">
                {icon}
            </div>
            <div className="min-w-0 flex-1">
                <p className="font-display truncate text-lg font-black text-slate-950">{label}</p>
                <p className="mt-1 truncate text-xs font-bold text-slate-400">{sub}</p>
            </div>
            <ChevronRight size={18} className="text-slate-300 transition group-hover:text-emerald-500" />
        </>
    );

    const className = "group flex items-center gap-4 rounded-[1.5rem] border border-white/80 bg-white/80 p-5 shadow-soft transition hover:bg-white";

    if (external) {
        return <a href={to} className={className}>{content}</a>;
    }

    return <Link to={to} className={className}>{content}</Link>;
}
