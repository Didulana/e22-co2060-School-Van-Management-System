import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import * as SecureStore from "expo-secure-store";
import { Alert } from "react-native";
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

let foregroundSubscription: Location.LocationSubscription | null = null;

export function useGPSBackground() {
  const startTracking = async (journeyId: number) => {
    try {
      // 1. Request foreground permission (works out-of-the-box on Expo Go)
      const { status: fgStatus } = await Location.requestForegroundPermissionsAsync();
      if (fgStatus !== "granted") {
        throw new Error("Location permission denied. Foreground access required.");
      }

      // 2. Request background permission & start updates (catch blocks if running inside iOS Expo Go)
      try {
        const { status: bgStatus } = await Location.requestBackgroundPermissionsAsync();
        if (bgStatus === "granted") {
          await SecureStore.setItemAsync("school-van-active-journey-id", String(journeyId));
          await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 2000, // 2 seconds
            distanceInterval: 1, // 1 meter
            foregroundService: {
              notificationTitle: "School Van Active",
              notificationBody: "Live journey telemetry is streaming to parents.",
              notificationColor: "#10B981",
            },
          });
          return; // Success
        }
      } catch (bgErr) {
        console.warn("Background tracking disabled or unsupported (iOS Expo Go sandbox constraints). Falling back to active foreground-only watch mode.");
      }

      // 3. Fallback active watcher (drives updates when app is open/foregrounded)
      await SecureStore.setItemAsync("school-van-active-journey-id", String(journeyId));
      
      if (foregroundSubscription) {
        foregroundSubscription.remove();
        foregroundSubscription = null;
      }

      foregroundSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High, // High accuracy for testing walking paths
          timeInterval: 1000, // 1 second
          distanceInterval: 0, // Force updates on every GPS tick
        },
        async (location) => {
          const { latitude, longitude } = location.coords;
          try {
            const sessionStr = await SecureStore.getItemAsync("school-van-auth-session");
            if (sessionStr) {
              const session = JSON.parse(sessionStr);
              const res = await fetch(`${API_BASE_URL}/tracking/location`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${session.token}`
                },
                body: JSON.stringify({ journeyId, lat: latitude, lng: longitude }),
              });
              if (!res.ok) {
                console.error("Foreground watchdog broadcast fail:", await res.text());
              }
            }
          } catch (postErr) {
            console.error("Foreground watchdog dispatch error:", postErr);
          }
        }
      );
      
      Alert.alert("GPS Active", "Active foreground watch enabled for this journey.");
    } catch (err: any) {
      console.error("Start location tracking error:", err);
      throw err;
    }
  };

  const stopTracking = async () => {
    try {
      if (foregroundSubscription) {
        foregroundSubscription.remove();
        foregroundSubscription = null;
      }
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
