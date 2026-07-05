import React, { useState, useEffect } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert, 
  Linking,
  SafeAreaView
} from "react-native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { 
  ArrowLeft as ArrowLeftIcon, 
  Phone as PhoneIcon, 
  User as UserIcon,
  ShieldAlert as ShieldAlertIcon
} from "lucide-react-native";

const ArrowLeft = ArrowLeftIcon as any;
const Phone = PhoneIcon as any;
const User = UserIcon as any;
const ShieldAlert = ShieldAlertIcon as any;

import { API_BASE_URL } from "../../constants/config";

interface Contact {
  driver_name: string;
  driver_phone: string;
  route_name: string;
  student_name: string;
}

export default function EmergencyContacts() {
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    async function loadTheme() {
      const val = await SecureStore.getItemAsync("ui-dark-mode");
      if (val === "true") setIsDarkMode(true);
    }
    loadTheme();
  }, []);

  const themeColors = {
    background: isDarkMode ? "#0F172A" : "#F8FAFC",
    cardBg: isDarkMode ? "#1E293B" : "#FFFFFF",
    textPrimary: isDarkMode ? "#F8FAFC" : "#0F172A",
    textSecondary: isDarkMode ? "#94A3B8" : "#64748B",
    border: isDarkMode ? "#334155" : "#E2E8F0",
    headerBg: isDarkMode ? "#1E293B" : "#FFFFFF"
  };

  const loadContacts = async () => {
    setIsLoading(true);
    try {
      const sessionStr = await SecureStore.getItemAsync("school-van-auth-session");
      if (!sessionStr) throw new Error("No active credentials session found");
      const session = JSON.parse(sessionStr);

      const res = await fetch(`${API_BASE_URL}/parent/emergency-contacts`, {
        headers: { Authorization: `Bearer ${session.token}` },
      });
      const data = await res.json().catch(() => []);
      if (res.ok) {
        setContacts(data);
      } else {
        throw new Error(data.error || "Failed to load emergency contacts");
      }
    } catch (err: any) {
      Alert.alert("Sync Failure", err.message || "Failed to load directory.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const handleCall = (phone: string) => {
    if (!phone) return;
    Linking.openURL(`tel:${phone}`).catch(() => {
      Alert.alert("Call Error", "Unable to trigger system dialer for phone: " + phone);
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* Header Panel */}
      <View style={[styles.header, { backgroundColor: themeColors.headerBg, borderColor: themeColors.border }]}>
        <TouchableOpacity style={[styles.backBtn, { backgroundColor: isDarkMode ? "#334155" : "#F1F5F9" }]} onPress={() => router.back()}>
          <ArrowLeft size={20} color={themeColors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: themeColors.textPrimary }]}>Emergency Contacts</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Main List */}
      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#10B981" />
        </View>
      ) : contacts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <ShieldAlert size={48} color="#94A3B8" />
          <Text style={styles.emptyTitle}>No Drivers Found</Text>
          <Text style={styles.emptyText}>You do not have any active van routes assigned to your students.</Text>
        </View>
      ) : (
        <FlatList
          data={contacts}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={[styles.card, { backgroundColor: themeColors.cardBg, borderColor: themeColors.border }]}>
              <View style={styles.cardInfo}>
                <View style={[styles.avatar, { backgroundColor: isDarkMode ? "#334155" : "#EFF6FF" }]}>
                  <User size={20} color="#3B82F6" />
                </View>
                <View style={styles.meta}>
                  <Text style={[styles.driverName, { color: themeColors.textPrimary }]}>{item.driver_name}</Text>
                  <Text style={[styles.studentLabel, { color: themeColors.textSecondary }]}>Child: {item.student_name}</Text>
                  <Text style={[styles.routeLabel, { color: themeColors.textSecondary }]}>Route: {item.route_name || "Standard Route"}</Text>
                </View>
              </View>

              <TouchableOpacity 
                style={styles.callBtn}
                onPress={() => handleCall(item.driver_phone)}
              >
                <Phone size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.callBtnText}>Call Driver</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 18,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderColor: "#E2E8F0",
  },
  backBtn: {
    height: 40,
    width: 40,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#0F172A",
  },
  headerSpacer: {
    width: 40,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 36,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#475569",
    marginTop: 16,
  },
  emptyText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#94A3B8",
    textAlign: "center",
    marginTop: 6,
  },
  list: {
    padding: 24,
    gap: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
  },
  cardInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    height: 48,
    width: 48,
    borderRadius: 16,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },
  meta: {
    marginLeft: 16,
    flex: 1,
  },
  driverName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
  },
  studentLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
    marginTop: 2,
  },
  routeLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#94A3B8",
    marginTop: 2,
  },
  callBtn: {
    height: 46,
    borderRadius: 14,
    backgroundColor: "#2563EB",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  callBtnText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#FFFFFF",
  },
});
