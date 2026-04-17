import { useEffect, useState } from "react";
import {
  getChildren,
  getChildStatus,
  markNotificationAsRead,
  markAbsent,
  getEmergencyContacts,
  EmergencyContact,
  Child,
  Stop,
  startMockJourney,
  boardStudent,
  dropoffStudent
} from "../../services/parentService";
import TrackingMap from "../../components/parent/TrackingMap";
import { useAuth } from "../../features/auth/AuthContext";
import { getSocket, initSocket, disconnectSocket } from "../../services/socketService";
import { Bell, Phone, UserX, RefreshCcw, Navigation, Clock, ShieldAlert, Zap, CheckCircle2, X } from "lucide-react";

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
  routeStops?: Stop[];
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
      setError("Satellite link compromised. Service currently unavailable.");
    } finally {
      setLoading(false);
    }
  };

  const loadChildData = async (studentId: number, manual = false) => {
    try {
      if (manual) setRefreshing(true);
      const statusData = await getChildStatus(studentId);
      setStatus(statusData);
      setUnreadCount((statusData.notifications || []).filter((n: NotificationItem) => !n.is_read).length);
    } catch (err: any) {
      setError("Unable to sync live signals for student manifest.");
    } finally {
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
    if (!window.confirm("Broadcast absence to driver for current cycle?")) return;
    try {
      const today = new Date().toISOString().split('T')[0];
      await markAbsent(selectedChildId, today, "Parent App Override");
      alert("Absence broadcast successful.");
    } catch (err) {
      alert("Broadcast failure. Retrying...");
    }
  };

  const handleBoard = async () => {
    if (!selectedChildId || !status?.journeyId) return;
    try {
      setRefreshing(true);
      await boardStudent(status.journeyId, selectedChildId);
      await loadChildData(selectedChildId, true);
    } catch (err) {
      alert("Boarding sync failed.");
    } finally {
      setRefreshing(false);
    }
  };

  const handleDrop = async () => {
    if (!selectedChildId || !status?.journeyId) return;
    try {
      setRefreshing(true);
      await dropoffStudent(status.journeyId, selectedChildId);
      await loadChildData(selectedChildId, true);
    } catch (err) {
      alert("Drop-off sync failed.");
    } finally {
      setRefreshing(false);
    }
  };

  const handleStartDemo = async () => {
      if (!selectedChildId) return;
      try {
          setRefreshing(true);
          await startMockJourney(selectedChildId);
          setTimeout(() => loadChildData(selectedChildId, true), 1500);
      } catch (err) {
          alert("Mock ignition failed.");
      } finally {
          setRefreshing(false);
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
    <div className="flex min-h-[400px] flex-col items-center justify-center">
        <div className="h-14 w-14 animate-spin rounded-full border-[6px] border-slate-100 border-t-emerald-500 shadow-xl" />
        <p className="mt-6 text-xs font-black uppercase tracking-[0.3em] text-slate-300">Syncing Radar</p>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700 font-sans">
      {/* Dynamic Header */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
              <h1 className="text-5xl font-black tracking-tighter text-slate-900 leading-none">Where is the van?</h1>
              <div className="mt-3 flex items-center gap-3">
                  <div className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                  <p className="text-sm font-bold text-slate-400 capitalize tracking-tight">Real-time status tracking active</p>
              </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
              <button onClick={handleMarkAbsent} disabled={!selectedChildId} className="flex items-center gap-2 rounded-2xl bg-white border border-slate-100 px-6 py-4 text-sm font-bold text-slate-600 transition-all hover:bg-red-50 hover:text-red-500 hover:border-red-100 disabled:opacity-30">
                  <UserX size={18} /> Mark as Absent
              </button>
              <button 
                  onClick={() => selectedChildId && loadChildData(selectedChildId, true)} 
                  disabled={refreshing || !selectedChildId} 
                  className="flex items-center gap-3 rounded-2xl bg-slate-900 px-8 py-4 text-sm font-bold text-white shadow-2xl shadow-slate-200 transition-all hover:bg-emerald-600 hover:shadow-emerald-200 disabled:opacity-70 active:scale-95"
              >
                  <RefreshCcw size={18} className={refreshing ? "animate-spin" : ""} />
                  {refreshing ? "Refreshing..." : "Refresh Status"}
              </button>
              <button onClick={() => setShowNotifications(!showNotifications)} className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-white border border-slate-100 shadow-soft transition hover:bg-slate-50 active:scale-90">
                  <Bell size={24} className="text-slate-600" />
                  {unreadCount > 0 && <span className="absolute -top-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-black text-white shadow-xl shadow-emerald-500/30 border-2 border-[#fdfdfc]">{unreadCount}</span>}
              </button>
          </div>
      </div>

      {error && <div className="rounded-[2rem] bg-red-50 border border-red-100 p-5 text-xs font-black text-red-600 tracking-wider flex items-center gap-3 animate-in slide-in-from-top-2"><ShieldAlert size={18}/> {error}</div>}

      {children.length === 0 ? (
          <div className="rounded-[3rem] bg-white p-24 shadow-premium border border-slate-50 text-center animate-in zoom-in-95">
              <div className="mb-8 h-20 w-20 rounded-[2rem] bg-slate-50 flex items-center justify-center text-slate-200 mx-auto shadow-inner">
                  <Navigation size={40} />
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">No children added</h2>
              <p className="mt-2 text-slate-400 font-medium max-w-sm mx-auto">You need to add a child to track their van. Please update your student profiles.</p>
          </div>
      ) : (
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_380px]">
          <div className="space-y-10">
              {/* Tab Bar */}
              <div className="flex flex-wrap gap-3">
                  {children.map((child) => (
                      <button
                          key={child.id}
                          onClick={() => setSelectedChildId(child.id)}
                          className={`rounded-2xl px-8 py-4 text-sm font-black transition-all duration-500 ${selectedChildId === child.id ? "bg-emerald-500 text-white shadow-xl shadow-emerald-500/30 scale-105" : "bg-white text-slate-400 border border-slate-100 hover:text-slate-700 hover:bg-slate-50"}`}
                      >
                          {child.name.split(' ')[0]}
                      </button>
                  ))}
              </div>

              {/* Map Terminal */}
              <div className="overflow-hidden rounded-[3rem] bg-white border border-slate-50 shadow-premium p-3 h-[600px] relative">
                  {location ? (
                      <TrackingMap 
                          latitude={Number(location.latitude)} 
                          longitude={Number(location.longitude)} 
                          lastUpdated={location.recorded_at} 
                          routeStops={status?.routeStops}
                      />
                  ) : (
                      <div className="flex h-full flex-col items-center justify-center bg-slate-50/50 rounded-[2.5rem] border border-slate-100 border-dashed">
                          <div className="relative mb-8">
                             <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-20" />
                             <div className="relative h-20 w-20 rounded-full bg-white shadow-xl flex items-center justify-center text-emerald-500 border border-emerald-100">
                                <Zap size={40} />
                             </div>
                          </div>
                          <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Trip not started</h3>
                          <p className="mt-3 text-sm text-slate-400 font-bold max-w-xs text-center leading-relaxed">The van is not on the move yet. You can try the demo trip below to see how it works.</p>
                          <button 
                              onClick={handleStartDemo}
                              className="mt-10 px-10 py-4 bg-white border border-slate-200 text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-soft"
                          >
                              Start Demo Trip
                          </button>
                      </div>
                  )}
              </div>

              {/* Status Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {[
                      { label: "Trip Status", value: status?.dropped ? "Completed" : (status?.boarded ? "On the way" : "Waiting"), icon: <Navigation size={22}/>, color: "text-emerald-600 bg-emerald-50" },
                      { label: "Updated At", value: location?.recorded_at ? new Date(location.recorded_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "---", icon: <Clock size={22}/>, color: "text-blue-600 bg-blue-50" },
                      { label: "Signal Status", value: status?.latestLocation ? "Live" : "No Signal", icon: <Zap size={22}/>, color: "text-slate-600 bg-slate-50" }
                  ].map((s, i) => (
                      <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-soft group hover:border-emerald-200 transition-all">
                          <div className={`h-14 w-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-transparent group-hover:bg-white group-hover:border-slate-100 transition-all ${s.color}`}>{s.icon}</div>
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 mb-1">{s.label}</p>
                          <p className="text-2xl font-black text-slate-900 tracking-tighter">{s.value}</p>
                      </div>
                  ))}
              </div>

              {/* Action Center */}
              {status?.journeyId && (
                  <div className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-8 group">
                      <div className="flex items-center gap-6">
                          <div className="h-20 w-20 rounded-[2rem] bg-white/10 text-emerald-400 flex items-center justify-center animate-pulse border border-white/5">
                              <Zap size={40} />
                          </div>
                          <div>
                              <h3 className="text-2xl font-black text-white tracking-tighter">Trip Progress</h3>
                              <p className="text-sm text-slate-400 font-medium">Click when your child gets on or off the van</p>
                          </div>
                      </div>
                      <div className="flex gap-4 w-full sm:w-auto">
                          {!status.boarded && (
                              <button 
                                  onClick={handleBoard}
                                  className="flex-1 sm:flex-none px-12 py-5 bg-emerald-500 text-white rounded-3xl font-black text-lg shadow-xl shadow-emerald-500/20 hover:scale-[1.05] transition-all active:scale-95"
                              >
                                  Confirm Boarding
                              </button>
                          )}
                          {status.boarded && !status.dropped && (
                              <button 
                                  onClick={handleDrop}
                                  className="flex-1 sm:flex-none px-12 py-5 bg-blue-600 text-white rounded-3xl font-black text-lg shadow-xl shadow-blue-500/20 hover:scale-[1.05] transition-all active:scale-95"
                              >
                                  Confirm Arrival
                              </button>
                          )}
                          {status.dropped && (
                              <div className="px-10 py-5 bg-white/10 text-emerald-400 rounded-3xl font-black text-lg border border-white/5 flex items-center gap-3">
                                  <CheckCircle2 size={24} /> Trip Complete
                              </div>
                          )}
                      </div>
                  </div>
              )}
          </div>

          {/* Right Rail: Alert Center */}
          <aside className={`rounded-[3rem] bg-white border border-slate-50 shadow-premium flex flex-col transition-all h-fit max-h-[850px] ${showNotifications ? "fixed inset-0 z-50 p-6 lg:static" : "hidden lg:flex"}`}>
              <div className="p-10 pb-6">
                  <div className="flex items-center justify-between mb-2">
                      <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase whitespace-nowrap">Notifications</h2>
                      {showNotifications && <button onClick={() => setShowNotifications(false)} className="lg:hidden p-3 rounded-2xl bg-slate-100"><X size={20}/></button>}
                  </div>
                  <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${unreadCount > 0 ? "bg-emerald-500" : "bg-slate-200"}`} />
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{unreadCount} New Alerts</p>
                  </div>
              </div>

              <div className="flex-1 overflow-y-auto px-6 pb-10 space-y-4 scrollbar-hide">
                  {notifications.length > 0 ? (
                      notifications.map((n) => (
                          <div key={n.id} className={`rounded-[2rem] p-6 border transition-all duration-500 ${n.is_read ? 'opacity-40 bg-slate-50 border-transparent' : 'bg-[#fdfdfc] border-emerald-50 shadow-soft hover:shadow-md'}`}>
                              <div className="flex items-center justify-between mb-4">
                                  <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full ${n.type === 'alert' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>{n.type}</span>
                                  <span className="text-[10px] font-bold text-slate-300">{new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                              <p className={`text-sm leading-relaxed ${n.is_read ? 'text-slate-400 font-medium' : 'text-slate-800 font-black'}`}>{n.message}</p>
                              {!n.is_read && (
                                  <button onClick={() => handleMarkAsRead(n.id)} className="mt-6 flex items-center gap-2 text-[9px] font-black text-emerald-600 hover:text-emerald-800 uppercase tracking-[0.15em] group">
                                      Acknowledge Cycle <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                  </button>
                              )}
                          </div>
                      ))
                  ) : (
                      <div className="py-32 text-center">
                          <div className="h-16 w-16 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-slate-200 shadow-inner">
                              <Bell size={32} />
                          </div>
                          <p className="text-[10px] font-black uppercase text-slate-300 tracking-[0.3em]">No alerts yet</p>
                      </div>
                  )}
              </div>
          </aside>
        </div>
      )}

      {/* Driver Intel */}
      {emergencyContacts.length > 0 && selectedChildId && (
          <div className="rounded-[3rem] bg-white p-12 border border-slate-50 shadow-premium">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10">
                  <div className="flex items-center gap-6">
                      <div className="h-16 w-16 rounded-[2rem] bg-red-50 text-red-500 flex items-center justify-center shadow-inner border border-red-100/50"><ShieldAlert size={32}/></div>
                      <div>
                          <h3 className="text-3xl font-black text-slate-900 tracking-tighter leading-none">Driver Details</h3>
                          <p className="text-sm text-slate-400 font-bold mt-2">Contact information for your child's drivers</p>
                      </div>
                  </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {emergencyContacts.filter(c => children.find(child => child.id === selectedChildId)?.name === c.student_name).map((contact, i) => (
                      <div key={i} className="flex items-center gap-6 p-6 rounded-3xl bg-slate-50/50 border border-slate-100 transition-all hover:bg-white hover:shadow-premium group">
                          <div className="h-16 w-16 rounded-[1.5rem] bg-white shadow-sm flex items-center justify-center text-xl font-black text-slate-900 border border-slate-100 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500">
                              {contact.driver_name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                              <p className="text-base font-black text-slate-900 truncate tracking-tight">{contact.driver_name}</p>
                              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1">{contact.route_name}</p>
                          </div>
                          <a href={`tel:${contact.driver_phone}`} className="h-14 w-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-900 shadow-sm hover:bg-slate-900 hover:text-white transition-all active:scale-90 shadow-soft">
                              <Phone size={22}/>
                          </a>
                      </div>
                  ))}
              </div>
          </div>
      )}
    </div>
  );
}

function ArrowRight({ size, className }: { size: number, className?: string }) {
    return <Navigation size={size} className={`${className} rotate-90`} />;
}