import { useState, useEffect } from "react";
import { getAttendance, AttendanceRecord, getOnboardingStatus } from "../../services/driverService";
import { History, ShieldCheck, Users, CheckCircle2, Navigation, Clock, Search, Zap, Info } from "lucide-react";

export default function AttendancePage() {

  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    async function loadHistory() {
        setLoading(true);
        try {
            const status = await getOnboardingStatus();
            if (status.driverId) {
                const history = await getAttendance(status.driverId);
                setRecords(history);
            }
        } catch (err: any) {
            console.error("Failed to load history", err);
        } finally {
            setLoading(false);
        }
    }
    loadHistory();
  }, []);

  if (loading) {
    return (
        <div className="flex min-h-[400px] flex-col items-center justify-center">
            <div className="h-14 w-14 animate-spin rounded-full border-[6px] border-slate-100 border-t-emerald-500 shadow-xl" />
            <p className="mt-6 text-xs font-black uppercase tracking-[0.3em] text-slate-300">Loading history...</p>
        </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-700 font-sans">
      {/* Premium Header */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-5xl font-black tracking-tighter text-slate-900 leading-none uppercase">Trip History</h1>
          <div className="mt-3 flex items-center gap-3">
              <History className="text-emerald-500" size={20} />
              <p className="text-sm font-bold text-slate-400 capitalize tracking-tight">View past trips and student records</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
            <div className="bg-white rounded-2xl border border-slate-100 p-1 flex items-center shadow-sm">
                <div className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl">All Routes</div>
                <div className="px-4 py-2 text-slate-300 text-[10px] font-black uppercase tracking-widest rounded-xl hover:text-slate-600 cursor-pointer transition-all">Archived</div>
            </div>
            <button className="h-12 w-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all shadow-sm">
                <Search size={18} />
            </button>
        </div>
      </div>

      {/* Main Data View */}
      <div className="rounded-[3rem] bg-white shadow-premium border border-slate-50 overflow-hidden">
        {records.length === 0 ? (
          <div className="p-32 text-center group">
              <div className="h-24 w-24 rounded-[2.5rem] bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-200 mx-auto shadow-inner mb-8 group-hover:scale-110 transition-transform duration-500">
                  <ShieldCheck size={48} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">No trips recorded yet</h2>
              <p className="mt-3 text-slate-400 font-medium max-w-xs mx-auto">Your completed trips will appear here once you finish a journey.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-50">
                  <th className="px-10 py-6 text-left">
                      <div className="flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                          <Zap size={12} /> Trip ID
                      </div>
                  </th>
                  <th className="px-10 py-6 text-left">
                      <div className="flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                          <Navigation size={12} /> Route Name
                      </div>
                  </th>
                  <th className="px-10 py-6 text-center">
                      <div className="flex items-center justify-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                          <Users size={12} /> Boarded
                      </div>
                  </th>
                  <th className="px-10 py-6 text-center">
                      <div className="flex items-center justify-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                          <CheckCircle2 size={12} /> Dropped
                      </div>
                  </th>
                  <th className="px-10 py-6 text-right">
                      <div className="flex items-center justify-end gap-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                          <Clock size={12} /> Timestamp
                      </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {records.map((r) => (
                  <tr key={r.journey_id} className="group hover:bg-slate-50/50 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2">
                    <td className="px-10 py-8">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:shadow-soft transition-all font-black text-xs">
                                #{r.journey_id}
                            </div>
                            <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${
                                r.status === "completed" ? "bg-emerald-50 text-emerald-500" : "bg-amber-50 text-amber-500"
                            }`}>
                                {r.status}
                            </span>
                        </div>
                    </td>
                    <td className="px-10 py-8">
                        <div>
                            <p className="text-lg font-black text-slate-900 tracking-tighter leading-none">{r.route_name}</p>
                            <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-tight">Past Trip Details</p>
                        </div>
                    </td>
                    <td className="px-10 py-8 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-blue-50/50 border border-blue-100 text-blue-600 font-black text-sm group-hover:bg-white transition-all">
                            {r.boarded_count}
                        </div>
                    </td>
                    <td className="px-10 py-8 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-50/50 border border-emerald-100 text-emerald-600 font-black text-sm group-hover:bg-white transition-all">
                            {r.dropped_count}
                        </div>
                    </td>
                    <td className="px-10 py-8 text-right">
                        <div>
                            <p className="text-sm font-black text-slate-700 tracking-tighter">
                                {new Date(r.started_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tight">
                                {new Date(r.started_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Security Info */}
      <div className="flex items-center gap-4 p-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 opacity-60">
          <Info className="text-slate-400" size={20} />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
              Trips are recorded for safety and route improvement. Data syncs with the system automatically.
          </p>
      </div>
    </div>
  );
}
