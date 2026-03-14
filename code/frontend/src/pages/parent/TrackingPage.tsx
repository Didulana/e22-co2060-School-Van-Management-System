import React, { useEffect, useState } from "react";

import {
  getJourneyStatus,
  getJourneyTimeline,
  getNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
} from "../../services/trackingService";

interface JourneyStatus {
  journeyId: number;
  latestLocation: {
    latitude: number;
    longitude: number;
    recorded_at: string;
  } | null;
  boardedCount: number;
  droppedCount: number;
  notifications: number;
}

interface TimelineItem {
  type: string;
  event_type: string | null;
  message: string;
  time: string;
}

interface NotificationItem {
  id: number;
  journey_id: number;
  type: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

const JOURNEY_ID = 1;

// Replace this with a real token from:
// curl -X POST http://localhost:5001/api/dev-auth/test-parent-token
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAxLCJlbWFpbCI6InBhcmVudDFAdGVzdC5jb20iLCJyb2xlIjoicGFyZW50IiwiaWF0IjoxNzczNDc2NTkwLCJleHAiOjE3NzM0ODAxOTB9.Yfnd2ZzrsHbngZly_A1I3OkRb3zSq9JByxIRywxPRF4";

export default function TrackingPage() {
  const [status, setStatus] = useState<JourneyStatus | null>(null);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [statusData, timelineData, notificationData, unreadData] =
        await Promise.all([
          getJourneyStatus(JOURNEY_ID, TOKEN),
          getJourneyTimeline(JOURNEY_ID, TOKEN),
          getNotifications(JOURNEY_ID, TOKEN),
          getUnreadNotificationCount(JOURNEY_ID, TOKEN),
        ]);

      setStatus(statusData ?? null);
      setTimeline(Array.isArray(timelineData?.timeline) ? timelineData.timeline : []);
      setNotifications(Array.isArray(notificationData?.data) ? notificationData.data : []);
      setUnreadCount(Number(unreadData?.unreadCount ?? 0));
    } catch (err) {
      console.error("TrackingPage loadData error:", err);
      setError("Failed to load tracking data. Check backend, token, and browser console.");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await markNotificationAsRead(id, TOKEN);
      await loadData();
    } catch (err) {
      console.error("Mark as read error:", err);
      setError("Failed to mark notification as read.");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div style={{ padding: "24px", color: "black", background: "white", minHeight: "100vh" }}>
      <h1>Parent Tracking Page</h1>

      {loading && <p>Loading tracking data...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <>
          <section style={{ border: "1px solid #ccc", padding: "16px", marginBottom: "16px" }}>
            <h2>Journey Status</h2>
            {status ? (
              <>
                <p><strong>Journey ID:</strong> {status.journeyId}</p>
                <p><strong>Boarded Students:</strong> {status.boardedCount}</p>
                <p><strong>Dropped Students:</strong> {status.droppedCount}</p>
                <p><strong>Total Notifications:</strong> {status.notifications}</p>

                {status.latestLocation ? (
                  <>
                    <p><strong>Latitude:</strong> {status.latestLocation.latitude}</p>
                    <p><strong>Longitude:</strong> {status.latestLocation.longitude}</p>
                    <p>
                      <strong>Last Updated:</strong>{" "}
                      {new Date(status.latestLocation.recorded_at).toLocaleString()}
                    </p>
                  </>
                ) : (
                  <p>No location available</p>
                )}
              </>
            ) : (
              <p>No journey status available</p>
            )}
          </section>

          <section style={{ border: "1px solid #ccc", padding: "16px", marginBottom: "16px" }}>
            <h2>Journey Timeline</h2>
            {timeline.length > 0 ? (
              <ul>
                {timeline.map((item, index) => (
                  <li key={index} style={{ marginBottom: "12px" }}>
                    <p><strong>Type:</strong> {item.type}</p>
                    {item.event_type && <p><strong>Event:</strong> {item.event_type}</p>}
                    <p><strong>Message:</strong> {item.message}</p>
                    <p><strong>Time:</strong> {new Date(item.time).toLocaleString()}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No timeline data available</p>
            )}
          </section>

          <section style={{ border: "1px solid #ccc", padding: "16px" }}>
            <h2>Notifications</h2>
            <p><strong>Unread:</strong> {unreadCount}</p>

            {notifications.length > 0 ? (
              <ul>
                {notifications.map((notification) => (
                  <li
                    key={notification.id}
                    style={{
                      marginBottom: "12px",
                      padding: "12px",
                      border: "1px solid #ddd",
                      background: notification.is_read ? "#f5f5f5" : "#fff8dc",
                    }}
                  >
                    <p><strong>Type:</strong> {notification.type}</p>
                    <p><strong>Message:</strong> {notification.message}</p>
                    <p>
                      <strong>Created At:</strong>{" "}
                      {new Date(notification.created_at).toLocaleString()}
                    </p>
                    <p><strong>Status:</strong> {notification.is_read ? "Read" : "Unread"}</p>

                    {!notification.is_read && (
                      <button onClick={() => handleMarkAsRead(notification.id)}>
                        Mark as Read
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No notifications available</p>
            )}
          </section>
        </>
      )}
    </div>
  );
}