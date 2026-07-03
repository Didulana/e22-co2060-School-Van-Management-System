import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import * as SecureStore from "expo-secure-store";
import { API_BASE_URL } from "../constants/config";

const LOCATION_TASK_NAME = "background-location-task";

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error("Background location task error:", error);
    return;
  }
  if (data) {
    const { locations } = data as any;
    if (locations && locations.length > 0) {
      const location = locations[0];
      const { latitude, longitude } = location.coords;
      
      try {
        const sessionStr = await SecureStore.getItemAsync("school-van-auth-session");
        const journeyIdStr = await SecureStore.getItemAsync("school-van-active-journey-id");
        
        if (sessionStr && journeyIdStr) {
          const session = JSON.parse(sessionStr);
          const journeyId = parseInt(journeyIdStr, 10);
          
          const res = await fetch(`${API_BASE_URL}/tracking/location`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${session.token}`
            },
            body: JSON.stringify({ journeyId, lat: latitude, lng: longitude }),
          });
          
          if (!res.ok) {
            console.error("Failed to broadcast background location telemetry:", await res.text());
          }
        }
      } catch (err) {
        console.error("Failed to dispatch background location update:", err);
      }
    }
  }
});

export function useGPSBackground() {
  const startTracking = async (journeyId: number) => {
    try {
      const { status: fgStatus } = await Location.requestForegroundPermissionsAsync();
      if (fgStatus !== "granted") {
        throw new Error("Location permission denied. Foreground access required.");
      }
      
      const { status: bgStatus } = await Location.requestBackgroundPermissionsAsync();
      if (bgStatus !== "granted") {
        throw new Error("Background location permission denied. Please enable 'Always Allow' in Settings.");
      }

      await SecureStore.setItemAsync("school-van-active-journey-id", String(journeyId));

      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 10000, // 10 seconds
        distanceInterval: 10, // 10 meters
        foregroundService: {
          notificationTitle: "School Van Active",
          notificationBody: "Live journey telemetry is streaming to parents.",
          notificationColor: "#10B981",
        },
      });
    } catch (err) {
      console.error("Start background tracking error:", err);
      throw err;
    }
  };

  const stopTracking = async () => {
    try {
      const isRegistered = await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME);
      if (isRegistered) {
        await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
      }
      await SecureStore.deleteItemAsync("school-van-active-journey-id");
    } catch (err) {
      console.error("Stop background tracking error:", err);
    }
  };

  return { startTracking, stopTracking };
}
