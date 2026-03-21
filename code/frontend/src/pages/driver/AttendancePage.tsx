import { useEffect, useState } from "react";
import { getAttendance, AttendanceRecord } from "../../services/driverService";
import { useAuth } from "../../features/auth/AuthContext";

export default function AttendancePage() {
  const { user } = useAuth();
  const driverId = user?.id || 0;
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!driverId) return;
    getAttendance(driverId)
      .then(setRecords)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin h-8 w-8 rounded-full border-4 border-slate-200 border-t-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Attendance Records</h1>
        <p className="text-slate-500 mt-1">View boarding and drop-off history for all past journeys</p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {records.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            No journey records found. Start a journey from the dashboard to see attendance here.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="px-5 py-3 text-left font-semibold text-slate-600">Journey</th>
                <th className="px-5 py-3 text-left font-semibold text-slate-600">Route</th>
                <th className="px-5 py-3 text-left font-semibold text-slate-600">Date</th>
                <th className="px-5 py-3 text-center font-semibold text-slate-600">Boarded</th>
                <th className="px-5 py-3 text-center font-semibold text-slate-600">Dropped</th>
                <th className="px-5 py-3 text-center font-semibold text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.map((r) => {
                const statusColor =
                  r.status === "completed"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-amber-50 text-amber-700";
                return (
                  <tr key={r.journey_id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3 font-medium text-slate-800">#{r.journey_id}</td>
                    <td className="px-5 py-3 text-slate-600">{r.route_name}</td>
                    <td className="px-5 py-3 text-slate-500">
                      {new Date(r.started_at).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span className="inline-block px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 font-medium">
                        {r.boarded_count}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span className="inline-block px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 font-medium">
                        {r.dropped_count}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
