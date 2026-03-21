import { useEffect, useState } from "react";
import {
  getChildren,
  getChildStatus,
  markNotificationAsRead,
  markAbsent,
  getEmergencyContacts,
  EmergencyContact,
  Child
} from "../../services/parentService";
import TrackingMap from "../../components/parent/TrackingMap";
import { useAuth } from "../../features/auth/AuthContext";
import { getSocket, initSocket, disconnectSocket } from "../../services/socketService";
import { Bell, Phone, UserX, RefreshCcw, MapPin, Navigation, Clock, ShieldAlert, ArrowUpCircle } from "lucide-react";

interface Location {
  latitude: number;
  longitude: number;
  recorded_at: string;
}

interface NotificationItem {
  id: number;
  journey_id: number;
  type: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface ChildStatus {
  parentId: number;
  studentId: number;
  journeyId: number | null;
  boarded: boolean;
  dropped: boolean;
  latestBoarding: { boarded_at: string } | null;
  latestDropoff: { dropped_at: string } | null;
  latestLocation: Location | null;
  notifications: NotificationItem[];
}

export default function TrackingPage() {
  const { session } = useAuth();
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);
  const [status, setStatus] = useState<ChildStatus | null>(null);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadChildrenData = async () => {
    try {
      setLoading(true);
      setError("");
      const [kids, contacts] = await Promise.all([
        getChildren(),
        getEmergencyContacts()
      ]);
      setChildren(kids);
      setEmergencyContacts(contacts);
      if (kids.length > 0) {
        setSelectedChildId(kids[0].id);
      }
    } catch (err: any) {
      setError("Initialization error: Live tracking services unavailable.");
    } finally {
      if (children.length === 0) setLoading(false);
    }
  };

  const loadChildData = async (studentId: number, manual = false) => {
    try {
      if (manual) setRefreshing(true);
      else setLoading(true);

      const statusData = await getChildStatus(studentId);
      setStatus(statusData);
      setUnreadCount((statusData.notifications || []).filter((n: NotificationItem) => !n.is_read).length);
    } catch (err: any) {
      setError("Unable to sync live signals for this child.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await markNotificationAsRead(id);
      if (selectedChildId) await loadChildData(selectedChildId, true);
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const handleMarkAbsent = async () => {
    if (!selectedChildId) return;
    if (!window.confirm("Notify driver of today's absence?")) return;
    try {
      const today = new Date().toISOString().split('T')[0];
      await markAbsent(selectedChildId, today, "Marked via Parent App");
      alert("Absence reported successfully.");
    } catch (err) {
      alert("System error reporting absence.");
    }
  };

  useEffect(() => {
    if (session?.token) {
      loadChildrenData();
      initSocket();
    }
    return () => disconnectSocket();
  }, [session?.token]);

  useEffect(() => {
    if (selectedChildId !== null && status?.journeyId) {
      const socket = getSocket();
      const room = `journey:${status.journeyId}`;
      socket.emit("join-room", room);
      
      socket.on("location_broadcast", (data) => {
        if (data.journeyId === status.journeyId) {
          setStatus(prev => prev ? {
            ...prev,
            latestLocation: {
              latitude: data.lat,
              longitude: data.lng,
              recorded_at: data.timestamp
            }
          } : null);
        }
      });

      socket.on("journey:status_change", () => selectedChildId && loadChildData(selectedChildId, true));
      socket.on("student:boarded", (data) => {
        if (Number(data.studentId) === selectedChildId) loadChildData(selectedChildId, true);
      });

      return () => {
        socket.off("location_broadcast");
        socket.off("journey:status_change");
        socket.off("student:boarded");
      };
    }
  }, [selectedChildId, status?.journeyId]);

  useEffect(() => {
    if (selectedChildId !== null) loadChildData(selectedChildId);
  }, [selectedChildId]);

  const location = status?.latestLocation;
  const notifications = status?.notifications || [];

  if (loading && children.length === 0) return (
    <div className="flex min-h-[400px] items-center justify-center bg-[#f8f8f6]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-500" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8f8f6] p-6 lg:p-10 text-slate-900">
      <div className="mx-auto max-w-6xl">
        {/* Minimalist Header */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-800">Live Tracking</h1>
                <p className="mt-1 text-base text-slate-500">Real-time surveillance for child safety</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <button onClick={handleMarkAbsent} disabled={!selectedChildId} className="flex items-center gap-2 rounded-xl bg-orange-50 px-5 py-3 text-sm font-semibold text-orange-700 transition hover:bg-orange-100 disabled:opacity-50">
                    <UserX size={16} /> Mark Absent
                </button>
                <button onClick={() => selectedChildId && loadChildData(selectedChildId, true)} disabled={refreshing || !selectedChildId} className="flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-70">
                    <RefreshCcw size={16} className={refreshing ? "animate-spin" : ""} /> Refresh
                </button>
                <button onClick={() => setShowNotifications(!showNotifications)} className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-white border border-slate-200 shadow-sm transition hover:bg-slate-50">
                    <Bell size={20} className="text-slate-600" />
                    {unreadCount > 0 && <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white shadow-sm">{unreadCount}</span>}
                </button>
            </div>
        </div>

        {error && <div className="mb-8 rounded-xl bg-red-50 border-l-4 border-red-500 p-4 text-sm font-medium text-red-800 animate-in fade-in">{error}</div>}

        {children.length === 0 ? (
            <div className="rounded-3xl bg-white p-20 shadow-sm border border-slate-200 text-center animate-in fade-in">
                <div className="mb-6 h-16 w-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 mx-auto">
                    <Navigation size={32} />
                </div>
                <h2 className="text-xl font-semibold text-slate-800">No active tracking</h2>
                <p className="mt-1 text-slate-500">Register children in the profiles section to enable live location.</p>
            </div>
        ) : (
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
            <div className="space-y-8">
                {/* Minimalist Tabs */}
                <div className="flex flex-wrap gap-2 px-1">
                    {children.map((child) => (
                        <button
                            key={child.id}
                            onClick={() => setSelectedChildId(child.id)}
                            className={`rounded-xl px-6 py-3 text-sm font-bold transition-all ${selectedChildId === child.id ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20" : "bg-white text-slate-400 border border-slate-200 hover:text-slate-600"}`}
                        >
                            {child.name}
                        </button>
                    ))}
                </div>

                {/* Map Grid */}
                <div className="overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm p-2 group transition-all hover:shadow-md">
                    {location ? (
                        <div className="h-[500px] w-full overflow-hidden rounded-xl bg-slate-100">
                            <TrackingMap latitude={Number(location.latitude)} longitude={Number(location.longitude)} lastUpdated={location.recorded_at} />
                        </div>
                    ) : (
                        <div className="flex h-[500px] flex-col items-center justify-center rounded-xl bg-slate-50 border border-slate-100 border-dashed">
                            <MapPin size={48} className="text-slate-200 mb-4" />
                            <h3 className="text-lg font-bold text-slate-800 leading-none">Awaiting Signal</h3>
                            <p className="mt-2 text-sm text-slate-400 font-medium">Van signal will appear when journey begins.</p>
                        </div>
                    )}
                </div>

                {/* Status Squares */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        { label: "Commute", value: status?.dropped ? "Completed" : (status?.boarded ? "Onboarded" : "Scheduled"), icon: <ArrowUpCircle size={20}/>, color: "text-emerald-600 bg-emerald-50" },
                        { label: "Signals", value: location?.recorded_at ? new Date(location.recorded_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "N/A", icon: <Clock size={20}/>, color: "text-blue-600 bg-blue-50" },
                        { label: "Van Mode", value: status?.latestLocation ? "Driving" : "Stopped", icon: <Navigation size={20}/>, color: "text-slate-600 bg-slate-100" }
                    ].map((s, i) => (
                        <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition hover:border-slate-300">
                            <div className={`h-10 w-10 rounded-xl flex items-center justify-center mb-4 ${s.color}`}>{s.icon}</div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">{s.label}</p>
                            <p className="text-xl font-bold text-slate-800">{s.value}</p>
                        </div>
                    ))}
                </div>

                {/* Direct Contacts */}
                {emergencyContacts.length > 0 && (
                    <div className="rounded-2xl bg-white p-8 border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-12 w-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shadow-inner"><ShieldAlert size={28}/></div>
                            <h3 className="text-xl font-bold text-slate-800">Assigned Drivers</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {emergencyContacts.filter(c => children.find(child => child.id === selectedChildId)?.name === c.student_name).map((contact, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 transition hover:bg-white hover:shadow-md">
                                    <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-900 font-bold">{contact.driver_name.charAt(0)}</div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-slate-800 truncate">{contact.driver_name}</p>
                                        <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest leading-none mt-1">{contact.route_name}</p>
                                    </div>
                                    <a href={`tel:${contact.driver_phone}`} className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-800 shadow-sm hover:bg-emerald-500 hover:text-white transition-all"><Phone size={18}/></a>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Notification Rail */}
            <aside className={`rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col transition-all h-fit ${showNotifications ? "fixed inset-0 z-50 p-6 lg:static" : "hidden lg:flex"}`}>
                <div className="p-6 border-b border-slate-50">
                    <div className="flex items-center justify-between mb-1">
                        <h2 className="text-lg font-bold text-slate-800">Alert Center</h2>
                        {showNotifications && <button onClick={() => setShowNotifications(false)} className="lg:hidden p-2 rounded-lg bg-slate-100"><UserX size={16}/></button>}
                    </div>
                    <p className="text-xs font-semibold text-slate-400">{unreadCount} Pending updates</p>
                </div>
                <div className="p-4 space-y-3 max-h-[700px] overflow-y-auto custom-scrollbar">
                    {notifications.length > 0 ? (
                        notifications.map((n) => (
                            <div key={n.id} className={`rounded-xl p-4 border transition-all ${n.is_read ? 'opacity-60 bg-slate-50 border-transparent' : 'bg-white border-emerald-50 shadow-sm'}`}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded ${n.type === 'alert' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>{n.type}</span>
                                    <span className="text-[10px] font-semibold text-slate-300">{new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <p className={`text-sm leading-snug ${n.is_read ? 'text-slate-400' : 'text-slate-800 font-medium'}`}>{n.message}</p>
                                {!n.is_read && (
                                    <button onClick={() => handleMarkAsRead(n.id)} className="mt-3 text-[10px] font-bold text-emerald-600 hover:emerald-800 uppercase tracking-widest">Acknowledge</button>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="py-20 text-center opacity-30"><Bell size={32} className="mx-auto mb-2"/><p className="text-[10px] font-bold uppercase uppercase text-slate-400">System quiet</p></div>
                    )}
                </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}