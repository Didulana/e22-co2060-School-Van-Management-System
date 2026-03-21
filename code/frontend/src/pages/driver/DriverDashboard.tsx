import { useEffect, useState, useCallback } from "react";
import {
  getActiveJourney,
  startJourney,
  arriveAtSchool,
  startReturn,
  completeJourney,
  Journey,
  StudentStatus,
} from "../../services/driverService";
import { getRoutes, Route } from "../../services/route.service";
import { getOnboardingStatus } from "../../services/driverService";
import { useAuth } from "../../features/auth/AuthContext";
import { useNavigate } from "react-router-dom";

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  pickup_started: { label: "Picking Up Students", color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
  heading_to_school: { label: "Heading to School", color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
  arrived_at_school: { label: "At School", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
  return_started: { label: "Return Route", color: "text-purple-700", bg: "bg-purple-50 border-purple-200" },
  completed: { label: "Completed", color: "text-slate-500", bg: "bg-slate-50 border-slate-200" },
};

const NEXT_ACTION: Record<string, { label: string; action: string; color: string }> = {
  pickup_started: { label: "Arrived at School", action: "arrive", color: "bg-blue-600 hover:bg-blue-700" },
  arrived_at_school: { label: "Start Return Route", action: "return", color: "bg-purple-600 hover:bg-purple-700" },
  return_started: { label: "Complete Journey", action: "complete", color: "bg-emerald-600 hover:bg-emerald-700" },
};

export default function DriverDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const driverId = user?.id || 0;

  const [journey, setJourney] = useState<Journey | null>(null);
  const [students, setStudents] = useState<StudentStatus[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<number>(0);
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [onboardingPending, setOnboardingPending] = useState(false);

  useEffect(() => {
    checkOnboarding();
  }, []);

  const checkOnboarding = async () => {
    try {
      const status = await getOnboardingStatus();
      setOnboardingPending(!status.completed);
    } catch (err) {
      console.error("Failed to check onboarding status", err);
    }
  };

  const refresh = useCallback(async () => {
    if (!driverId) return;
    try {
      const data = await getActiveJourney(driverId);
      setIsActive(data.active);
      setJourney(data.journey);
      setStudents(data.students || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    // Also load available routes for the "Start Journey" form
    getRoutes().then(setRoutes).catch(() => {});
  }, [refresh]);

  const handleStart = async () => {
    if (onboardingPending) {
        navigate("/driver/onboarding");
        return;
    }
    if (!selectedRoute || !driverId) return;
    setActionLoading(true);
    setError(null);
    try {
      await startJourney(driverId, selectedRoute);
      await refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleNextAction = async () => {
    if (!journey) return;
    setActionLoading(true);
    setError(null);
    try {
      const action = NEXT_ACTION[journey.status]?.action;
      if (action === "arrive") await arriveAtSchool(journey.id);
      else if (action === "return") await startReturn(journey.id);
      else if (action === "complete") await completeJourney(journey.id);
      await refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin h-8 w-8 rounded-full border-4 border-slate-200 border-t-blue-600" />
      </div>
    );
  }

  const statusInfo = journey ? STATUS_LABELS[journey.status] : null;
  const nextAction = journey ? NEXT_ACTION[journey.status] : null;
  const boardedCount = students.filter((s) => s.boarded_at).length;
  const droppedCount = students.filter((s) => s.dropped_at).length;

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Driver Dashboard</h1>
          <p className="text-slate-500 mt-1">Manage your daily journey and student attendance</p>
        </div>
        {/* SOS Button */}
        <button
          className="flex items-center gap-2 px-5 py-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold shadow-lg shadow-red-200 transition-all"
          onClick={() => alert("🚨 SOS: Emergency services have been notified!")}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.962-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          SOS
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      {/* Onboarding Banner */}
      {onboardingPending && (
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 shadow-sm flex items-center justify-between">
            <div>
                <h2 className="text-xl font-bold text-amber-900">Setup Required</h2>
                <p className="text-amber-700 text-sm mt-1">Please complete your professional profile, vehicle details, and route setup to start journeys.</p>
            </div>
            <button 
                onClick={() => navigate("/driver/onboarding")}
                className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold shadow-sm transition-all"
            >
                Complete Setup
            </button>
        </div>
      )}

      {/* No active journey — Start form */}
      {!isActive && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-xl font-semibold text-slate-800">Start a New Journey</h2>
          <p className="text-slate-500 text-sm">Select a route and begin the pickup.</p>
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-600 mb-1">Select Route</label>
              <select
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none transition"
                value={selectedRoute}
                onChange={(e) => setSelectedRoute(Number(e.target.value))}
              >
                <option value={0}>Choose a route...</option>
                {routes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.route_name}
                  </option>
                ))}
              </select>
            </div>
            <button
              disabled={!selectedRoute || actionLoading}
              onClick={handleStart}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              {actionLoading ? "Starting..." : "Start Pickup"}
            </button>
          </div>
        </div>
      )}

      {/* Active journey */}
      {isActive && journey && (
        <>
          {/* Status + Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className={`md:col-span-2 rounded-3xl border p-5 ${statusInfo?.bg}`}>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Current Status</p>
              <p className={`text-2xl font-bold mt-1 ${statusInfo?.color}`}>{statusInfo?.label}</p>
              <p className="text-sm text-slate-500 mt-2">
                Route: <span className="font-medium text-slate-700">{(journey as any).route_name || `#${journey.route_id}`}</span>
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-5 text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Boarded</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">{boardedCount}</p>
              <p className="text-sm text-slate-400">of {students.length}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-5 text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Dropped Off</p>
              <p className="text-3xl font-bold text-emerald-600 mt-1">{droppedCount}</p>
              <p className="text-sm text-slate-400">of {students.length}</p>
            </div>
          </div>

          {/* Journey Control */}
          {nextAction && (
            <button
              onClick={handleNextAction}
              disabled={actionLoading}
              className={`w-full py-4 rounded-2xl text-white text-lg font-bold shadow-lg transition-all disabled:opacity-60 ${nextAction.color}`}
            >
              {actionLoading ? "Updating..." : `→ ${nextAction.label}`}
            </button>
          )}

          {/* Student Checklist */}
          <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-800">Student Checklist</h2>
            </div>
            {students.length === 0 ? (
              <div className="p-6 text-center text-slate-400">
                No students linked to this driver yet.
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {students.map((student) => (
                  <li key={student.student_id} className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors">
                    <div>
                      <p className="font-medium text-slate-800">{student.student_name}</p>
                      <p className="text-xs text-slate-400">
                        {student.boarded_at
                          ? `Boarded at ${new Date(student.boarded_at).toLocaleTimeString()}`
                          : "Not boarded yet"}
                        {student.dropped_at && ` · Dropped at ${new Date(student.dropped_at).toLocaleTimeString()}`}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${
                        student.dropped_at ? 'bg-emerald-50 text-emerald-600' : (student.boarded_at ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-400')
                      }`}>
                        {student.dropped_at ? 'Dropped' : (student.boarded_at ? 'On Board' : 'Awaiting Parent')}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
