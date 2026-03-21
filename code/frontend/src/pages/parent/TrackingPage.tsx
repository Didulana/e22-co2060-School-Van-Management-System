import React from "react";
import { useEffect, useState } from "react";
import {
  getParentChildren,
  getChildStatus,
  markNotificationAsRead,
} from "../../services/trackingService";
import TrackingMap from "../../components/parent/TrackingMap";

interface Child {
  student_id: number;
  name?: string; // Add name if available, otherwise fallback
}

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

// Replace with a fresh dev parent token from backend
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAxLCJlbWFpbCI6InBhcmVudDFAdGVzdC5jb20iLCJyb2xlIjoicGFyZW50IiwiaWF0IjoxNzczODMyMDYwLCJleHAiOjE3NzM4MzU2NjB9.LK8W3RbXcJ3GBB-NHVd2zgQHT28j5exyxpkuBwxcAD0";

export default function TrackingPage() {
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);

  const [status, setStatus] = useState<ChildStatus | null>(null);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadChildren = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getParentChildren(TOKEN);
      const kids = res.data || [];
      setChildren(kids);
      if (kids.length > 0) {
        setSelectedChildId(kids[0].student_id);
      } else {
        setLoading(false);
      }
    } catch (err: any) {
      console.error("Failed to load children:", err);
      setError(err.message || "Failed to load children. Check backend and token.");
      setLoading(false);
    }
  };

  const loadChildData = async (studentId: number, manual = false) => {
    try {
      if (manual) setRefreshing(true);
      else setLoading(true);

      setError("");

      const statusData = await getChildStatus(studentId, TOKEN);
      setStatus(statusData);

      const notificationsArray = statusData.notifications || [];
      setUnreadCount(notificationsArray.filter((n: NotificationItem) => !n.is_read).length);
    } catch (err: any) {
      console.error("Child tracking data error:", err);
      setError("Failed to load tracking data for the selected child.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await markNotificationAsRead(id, TOKEN);
      if (selectedChildId) {
        await loadChildData(selectedChildId, true);
      }
    } catch (err) {
      console.error("Failed to mark as read:", err);
      setError("Failed to update notification.");
    }
  };

  useEffect(() => {
    loadChildren();
  }, []);

  useEffect(() => {
    if (selectedChildId !== null) {
      // Fetch immediately on child select
      loadChildData(selectedChildId);

      // Set up recurring live polling every 10 seconds
      const pollInterval = setInterval(() => {
        loadChildData(selectedChildId, true); // true = transparent refresh without hiding the map
      }, 10000);

      // Cleanup interval if the user clicks a different child or unmounts the page
      return () => clearInterval(pollInterval);
    }
  }, [selectedChildId]);

  const location = status?.latestLocation;
  const notifications = status?.notifications || [];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 transition-colors duration-300">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header & Controls */}
        <div className="mb-6 flex flex-col gap-4 rounded-3xl bg-white px-6 py-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Track School Van</h1>
            <p className="mt-1 text-sm text-gray-500">
              Live location and important alerts for your children
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => selectedChildId && loadChildData(selectedChildId, true)}
              disabled={refreshing || !selectedChildId}
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md active:scale-95 disabled:opacity-70"
            >
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>

            <button
              onClick={() => setShowNotifications((prev) => !prev)}
              className="relative flex items-center justify-center rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition-all hover:bg-gray-50 hover:shadow-md active:scale-95"
              aria-label="Notifications"
            >
              <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-red-500 text-xs font-bold text-white shadow-sm">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 animate-fade-in-up rounded-2xl border-l-4 border-red-500 bg-red-50 p-4 shadow-sm">
            <div className="flex items-center">
              <svg className="mr-3 h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium text-red-800">{error}</span>
            </div>
          </div>
        )}

        {/* Multi-Child Selector Tabs */}
        {children.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {children.map((child) => {
              const isActive = selectedChildId === child.student_id;
              return (
                <button
                  key={child.student_id}
                  onClick={() => setSelectedChildId(child.student_id)}
                  className={`relative overflow-hidden rounded-2xl px-6 py-3 text-sm font-semibold transition-all duration-300 ${isActive
                    ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                    : "bg-white text-gray-600 shadow-sm hover:bg-gray-50 hover:text-gray-900"
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`h-2.5 w-2.5 rounded-full ${isActive ? 'bg-green-400' : 'bg-gray-300'}`} />
                    Child #{child.student_id}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {loading && !refreshing ? (
          <div className="flex h-64 items-center justify-center rounded-3xl bg-white shadow-sm">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
              <p className="font-medium text-gray-500">Loading tracking data...</p>
            </div>
          </div>
        ) : children.length === 0 ? (
          <div className="flex h-64 items-center justify-center rounded-3xl bg-white shadow-sm">
            <p className="font-medium text-gray-500">No children assigned to this account.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
            <div className="space-y-6">

              {/* Map Section */}
              <div className="overflow-hidden rounded-3xl bg-white p-2 shadow-sm ring-1 ring-gray-100">
                {location ? (
                  <div className="h-[460px] w-full overflow-hidden rounded-2xl">
                    <TrackingMap
                      latitude={Number(location.latitude)}
                      longitude={Number(location.longitude)}
                      lastUpdated={location.recorded_at}
                    />
                  </div>
                ) : (
                  <div className="flex h-[460px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 text-gray-500">
                    <svg className="mb-3 h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    <p className="font-medium">No active journey location detected.</p>
                  </div>
                )}
              </div>

              {/* Status Cards */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="flex flex-col justify-between rounded-3xl bg-white p-5 shadow-sm ring-1 ring-gray-100 transition-transform hover:-translate-y-1 hover:shadow-md">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${status?.latestLocation ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                      </svg>
                    </div>
                    <span className="text-sm font-semibold text-gray-500">Van Status</span>
                  </div>
                  <div className={`mt-4 text-xl font-bold ${status?.latestLocation ? "text-green-600" : "text-gray-900"}`}>
                    {status?.latestLocation ? "On the move" : "Idle"}
                  </div>
                </div>

                <div className="flex flex-col justify-between rounded-3xl bg-white p-5 shadow-sm ring-1 ring-gray-100 transition-transform hover:-translate-y-1 hover:shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                      </svg>
                    </div>
                    <span className="text-sm font-semibold text-gray-500">Journey Progress</span>
                  </div>
                  <div className="mt-4">
                    <div className="text-lg font-bold text-gray-900">
                      {status?.dropped ? "Dropped off" : (status?.boarded ? "Boarded" : "Waiting")}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {status?.latestDropoff?.dropped_at ? new Date(status.latestDropoff.dropped_at).toLocaleTimeString() : (status?.latestBoarding?.boarded_at ? new Date(status.latestBoarding.boarded_at).toLocaleTimeString() : "")}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-between rounded-3xl bg-white p-5 shadow-sm ring-1 ring-gray-100 transition-transform hover:-translate-y-1 hover:shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-sm font-semibold text-gray-500">Last Updated</span>
                  </div>
                  <div className="mt-4">
                    <div className="text-lg font-bold text-gray-900">
                      {location?.recorded_at ? new Date(location.recorded_at).toLocaleTimeString() : "No signal"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notifications Panel */}
            <aside
              className={`rounded-3xl bg-white shadow-sm ring-1 ring-gray-100 ${showNotifications ? "block" : "hidden lg:block"
                }`}
            >
              <div className="border-b border-gray-100 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
                    <p className="text-sm font-medium text-gray-400 mt-1">Updates for this child</p>
                  </div>
                  <div className="flex h-8 items-center rounded-full bg-blue-50 px-3 text-sm font-bold text-blue-700">
                    {unreadCount} Unread
                  </div>
                </div>
              </div>

              <div className="max-h-[580px] overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`relative overflow-hidden rounded-2xl border p-5 transition-all ${notification.is_read
                        ? "border-gray-100 bg-white"
                        : "border-blue-100 bg-blue-50/50 shadow-sm"
                        }`}
                    >
                      {!notification.is_read && (
                        <div className="absolute left-0 top-0 h-full w-1 bg-blue-500" />
                      )}
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <span className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${notification.type === 'alert' ? 'bg-red-100 text-red-700' :
                          notification.type === 'info' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                          {notification.type}
                        </span>
                        {!notification.is_read && (
                          <span className="flex h-2 w-2 rounded-full bg-blue-500"></span>
                        )}
                      </div>

                      <p className={`text-sm leading-relaxed ${notification.is_read ? 'text-gray-600' : 'text-gray-900 font-medium'}`}>
                        {notification.message}
                      </p>

                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-400">
                          {new Date(notification.created_at).toLocaleString([], {
                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                          })}
                        </span>

                        {!notification.is_read && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
                          >
                            Mark Read
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex h-40 flex-col items-center justify-center text-center">
                    <div className="mb-3 rounded-full bg-gray-50 p-3">
                      <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-gray-500">No recent notifications</p>
                  </div>
                )}
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}