import { useEffect, useState } from "react";
import { readStoredSession } from "../../features/auth/storage";
import { API_BASE_URL } from "../../config/api";
import { Users, Truck, Navigation, User, Phone, CheckCircle, GraduationCap, MapPin } from "lucide-react";

interface AdminSummary {
  totalUsers: number;
  totalVehicles: number;
  activeRoutes: number;
}

interface Driver {
  id: number;
  name: string;
  phone: string;
  vehicle: string;
}

interface Student {
  id: number;
  name: string;
  grade: string;
  route: string;
}

export default function AdminDashboard() {
  const [summary, setSummary] = useState<AdminSummary>({
    totalUsers: 0,
    totalVehicles: 0,
    activeRoutes: 0,
  });

  const [drivers] = useState<Driver[]>([
    { id: 1, name: "Kasun Silva", phone: "0771234567", vehicle: "NB-1234" },
    { id: 2, name: "Nimal Perera", phone: "0779876543", vehicle: "NC-4567" },
  ]);

  const [students] = useState<Student[]>([
    { id: 1, name: "Ayesha Fernando", grade: "Grade 5", route: "Route A" },
    { id: 2, name: "Dilan Peris", grade: "Grade 3", route: "Route B" },
  ]);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const session = readStoredSession();
        const response = await fetch(`${API_BASE_URL}/admin/summary`, {
          headers: session?.token ? { Authorization: `Bearer ${session.token}` } : {},
        });
        if (!response.ok) {
          throw new Error("Failed to fetch admin summary");
        }

        const data = await response.json();
        setSummary(data);
      } catch (error) {
        console.error("Error loading admin summary:", error);
      }
    };

    fetchSummary();
  }, []);

  return (
    <div className="space-y-8 max-w-[1420px] mx-auto animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700">Management Panel</span>
        <h1 className="font-display text-3xl md:text-4xl font-black text-slate-950 tracking-tight">Admin Dashboard</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Users */}
        <div className="glass-card rounded-[1.75rem] p-6 flex items-center gap-5 hover:-translate-y-1 transition-transform duration-300 shadow-soft border border-white/60">
          <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
            <Users size={28} />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Users</span>
            <span className="text-3xl font-black text-slate-900 mt-1 block">{summary.totalUsers}</span>
          </div>
        </div>

        {/* Total Vehicles */}
        <div className="glass-card rounded-[1.75rem] p-6 flex items-center gap-5 hover:-translate-y-1 transition-transform duration-300 shadow-soft border border-white/60">
          <div className="h-14 w-14 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
            <Truck size={28} />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Vehicles</span>
            <span className="text-3xl font-black text-slate-900 mt-1 block">{summary.totalVehicles}</span>
          </div>
        </div>

        {/* Active Routes */}
        <div className="glass-card rounded-[1.75rem] p-6 flex items-center gap-5 hover:-translate-y-1 transition-transform duration-300 shadow-soft border border-white/60">
          <div className="h-14 w-14 rounded-2xl bg-sky-500/10 text-sky-600 flex items-center justify-center shrink-0">
            <Navigation size={28} />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Active Routes</span>
            <span className="text-3xl font-black text-slate-900 mt-1 block">{summary.activeRoutes}</span>
          </div>
        </div>
      </div>

      {/* Lists Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Drivers List */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-2">
            <Truck size={20} className="text-emerald-600" />
            <h2 className="font-display text-xl font-black text-slate-900">Drivers</h2>
          </div>
          
          <div className="overflow-x-auto w-full glass-card rounded-[1.75rem] border border-white/60 shadow-soft">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="p-4 font-black uppercase tracking-wider text-[10px] text-slate-400 w-16">ID</th>
                  <th className="p-4 font-black uppercase tracking-wider text-[10px] text-slate-400">Name</th>
                  <th className="p-4 font-black uppercase tracking-wider text-[10px] text-slate-400">Phone</th>
                  <th className="p-4 font-black uppercase tracking-wider text-[10px] text-slate-400">Vehicle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/50">
                {drivers.map((driver) => (
                  <tr key={driver.id} className="hover:bg-white/40 transition-colors">
                    <td className="p-4 font-bold text-slate-400">#{driver.id}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center text-xs shrink-0">
                          <User size={14} />
                        </div>
                        <span className="font-semibold text-slate-900">{driver.name}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-slate-500 font-semibold">
                        <Phone size={14} className="text-slate-300" />
                        <span>{driver.phone}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-950 text-white text-xs font-black uppercase tracking-wider">
                        <CheckCircle size={10} className="text-emerald-400" />
                        {driver.vehicle}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Students List */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-2">
            <GraduationCap size={20} className="text-amber-500" />
            <h2 className="font-display text-xl font-black text-slate-900">Students</h2>
          </div>
          
          <div className="overflow-x-auto w-full glass-card rounded-[1.75rem] border border-white/60 shadow-soft">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="p-4 font-black uppercase tracking-wider text-[10px] text-slate-400 w-16">ID</th>
                  <th className="p-4 font-black uppercase tracking-wider text-[10px] text-slate-400">Name</th>
                  <th className="p-4 font-black uppercase tracking-wider text-[10px] text-slate-400">Grade</th>
                  <th className="p-4 font-black uppercase tracking-wider text-[10px] text-slate-400">Route</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/50">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-white/40 transition-colors">
                    <td className="p-4 font-bold text-slate-400">#{student.id}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 font-bold flex items-center justify-center text-xs shrink-0">
                          <User size={14} />
                        </div>
                        <span className="font-semibold text-slate-900">{student.name}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-slate-500">{student.grade}</span>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold">
                        <MapPin size={10} className="text-emerald-500 shrink-0" />
                        {student.route}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
