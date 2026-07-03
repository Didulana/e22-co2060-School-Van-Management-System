import React, { useState, useEffect } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert, 
  ScrollView,
  SafeAreaView
} from "react-native";
import { useRouter, Link } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { 
  Truck as TruckIcon, 
  ShieldAlert as ShieldAlertIcon, 
  LogOut as LogOutIcon, 
  CreditCard as CreditCardIcon, 
  ChevronRight as ChevronRightIcon, 
  Activity as ActivityIcon, 
  Users as UsersIcon, 
  Settings as SettingsIcon 
} from "lucide-react-native";

const Truck = TruckIcon as any;
const ShieldAlert = ShieldAlertIcon as any;
const LogOut = LogOutIcon as any;
const CreditCard = CreditCardIcon as any;
const ChevronRight = ChevronRightIcon as any;
const Activity = ActivityIcon as any;
import { API_BASE_URL } from "../../constants/config";
import { useGPSBackground } from "../../hooks/useGPSBackground";

const Users = UsersIcon as any;
const Settings = SettingsIcon as any;

export default function DriverDashboard() {
  const router = useRouter();
  const { startTracking, stopTracking } = useGPSBackground();
  const [driverName, setDriverName] = useState("Driver");
  const [driverId, setDriverId] = useState<number | null>(null);
  const [token, setToken] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [activeJourneyId, setActiveJourneyId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initDashboard() {
      try {
        const sessionStr = await SecureStore.getItemAsync("school-van-auth-session");
        if (sessionStr) {
          const session = JSON.parse(sessionStr);
          setDriverName(session.user?.name || "Driver");
          setDriverId(session.user?.id);
          setToken(session.token);

          // Sync active journey state from backend
          const res = await fetch(`${API_BASE_URL}/driver/journey/active?driver_id=${session.user?.id}`, {
            headers: { Authorization: `Bearer ${session.token}` }
          });
          if (res.ok) {
            const data = await res.json();
            if (data.active && data.journey) {
              setIsActive(true);
              setActiveJourneyId(data.journey.id);
            }
          }
        }
      } catch (err) {
        console.error("Initialization failure", err);
      } finally {
        setIsLoading(false);
      }
    }
    initDashboard();
  }, []);

  const handleLogout = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await stopTracking();
          await SecureStore.deleteItemAsync("school-van-auth-session");
          router.replace("/login");
        }
      }
    ]);
  };

  const toggleJourney = async () => {
    if (!driverId || !token) {
      Alert.alert("Error", "No active credentials session found.");
      return;
    }

    setIsLoading(true);
    try {
      if (isActive) {
        // Complete current trip
        const stopRes = await fetch(`${API_BASE_URL}/driver/journey/${activeJourneyId}/complete`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (!stopRes.ok) {
          const err = await stopRes.json().catch(() => ({}));
          throw new Error(err.error || "Failed to complete active journey.");
        }

        await stopTracking();
        setIsActive(false);
        setActiveJourneyId(null);
        Alert.alert("Trip Completed", "Good job! Trip logs finalized.");
      } else {
        // Fetch assigned routes
        let routeId = 1;
        const routesRes = await fetch(`${API_BASE_URL}/routes?driver_id=${driverId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const routes = await routesRes.json().catch(() => []);
        
        if (routes && routes.length > 0) {
          routeId = routes[0].id;
        } else {
          // Fallback: try fetching all routes in system
          const allRoutesRes = await fetch(`${API_BASE_URL}/routes`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const allRoutes = await allRoutesRes.json().catch(() => []);
          if (allRoutes && allRoutes.length > 0) {
            routeId = allRoutes[0].id;
            Alert.alert("Notice", `No routes assigned to your profile. Using fallback route: "${allRoutes[0].route_name || allRoutes[0].name}" for testing.`);
          } else {
            routeId = 1;
            Alert.alert("Testing Mode", "No routes found in database. Initializing with dummy Route ID #1.");
          }
        }

        // Start next trip
        const startRes = await fetch(`${API_BASE_URL}/driver/journey/start`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}` 
          },
          body: JSON.stringify({ driver_id: driverId, route_id: routeId }),
        });
        const journey = await startRes.json();
        if (!startRes.ok) throw new Error(journey.error || "Ignition failure: Unable to initiate route.");

        await startTracking(journey.id);
        setIsActive(true);
        setActiveJourneyId(journey.id);
        Alert.alert("Trip Started", "GPS telemetry active. Safe driving!");
      }
    } catch (err: any) {
      Alert.alert("Action Failed", err.message || "Journey lifecycle sync error.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSOS = async () => {
    if (!token) return;
    
    Alert.alert("Emergency Broadcast", "Transmit immediate SOS distress payload to parents and administrators?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Send Alert",
        style: "destructive",
        onPress: async () => {
          try {
            const res = await fetch(`${API_BASE_URL}/driver/sos`, {
              method: "POST",
              headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
              Alert.alert("SOS Sent", "Emergency beacon has been broadcasted.");
            } else {
              const err = await res.json().catch(() => ({}));
              throw new Error(err.error || "SOS transmission failed.");
            }
          } catch (err: any) {
            Alert.alert("SOS Failed", err.message || "Failed to contact gateway.");
          }
        }
      }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcome}>Welcome back,</Text>
            <Text style={styles.name}>{driverName}</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>

        {/* SOS Panel */}
        <TouchableOpacity style={styles.sosCard} onPress={handleSOS}>
          <ShieldAlert size={28} color="#FFFFFF" />
          <View style={styles.sosTextContainer}>
            <Text style={styles.sosTitle}>EMERGENCY BROADCAST</Text>
            <Text style={styles.sosSubtitle}>Send immediate SOS distress logs</Text>
          </View>
          <ChevronRight size={20} color="#FFFFFF" opacity={0.6} />
        </TouchableOpacity>

        {/* Live Trip Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transit Console</Text>
          <View style={styles.consoleCard}>
            <View style={styles.consoleHeader}>
              <View style={styles.statusIndicator}>
                <View style={[styles.statusDot, isActive && styles.statusDotActive]} />
                <Text style={styles.statusLabel}>{isActive ? "Live Journey Active" : "Offline / Inactive"}</Text>
              </View>
              <Activity size={18} color={isActive ? "#10B981" : "#64748B"} />
            </View>

            <TouchableOpacity 
              style={[styles.actionBtn, isActive ? styles.actionBtnActive : styles.actionBtnInactive]}
              onPress={toggleJourney}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.actionBtnText}>{isActive ? "Finish Current Trip" : "Start Next Trip"}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Payments Control Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payments Management</Text>
          <View style={styles.paymentsGrid}>
            <Link href="/driver/payments" asChild>
              <TouchableOpacity style={styles.paymentCard}>
                <View style={[styles.iconContainer, { backgroundColor: "#ECFDF5", borderColor: "#A7F3D0" }]}>
                  <CreditCard size={22} color="#10B981" />
                </View>
                <View style={styles.paymentTextContainer}>
                  <Text style={styles.paymentCardTitle}>Student Dues</Text>
                  <Text style={styles.paymentCardDesc}>Generate & verify monthly fees</Text>
                </View>
                <ChevronRight size={18} color="#94A3B8" />
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollContainer: {
    padding: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
    marginTop: 12,
  },
  welcome: {
    fontSize: 14,
    fontWeight: "700",
    color: "#64748B",
  },
  name: {
    fontSize: 28,
    fontWeight: "900",
    color: "#0F172A",
    letterSpacing: -0.5,
    marginTop: 2,
  },
  logoutButton: {
    height: 48,
    width: 48,
    borderRadius: 16,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
  },
  sosCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EF4444",
    borderRadius: 24,
    padding: 20,
    marginBottom: 28,
    shadowColor: "#EF4444",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  sosTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  sosTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  sosSubtitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FEE2E2",
    marginTop: 2,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#64748B",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 14,
  },
  consoleCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
  },
  consoleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  statusIndicator: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: "#64748B",
    marginRight: 8,
  },
  statusDotActive: {
    backgroundColor: "#10B981",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#334155",
  },
  actionBtn: {
    height: 54,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  actionBtnInactive: {
    backgroundColor: "#10B981",
  },
  actionBtnActive: {
    backgroundColor: "#0F172A",
  },
  actionBtnText: {
    fontSize: 15,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  paymentsGrid: {
    gap: 12,
  },
  paymentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  iconContainer: {
    height: 48,
    width: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  paymentTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  paymentCardTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
  },
  paymentCardDesc: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
    marginTop: 2,
  },
});
