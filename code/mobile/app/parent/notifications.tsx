import React, { useState, useEffect } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert,
  SafeAreaView
} from "react-native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { 
  ArrowLeft as ArrowLeftIcon, 
  Bell as BellIcon, 
  ShieldAlert as ShieldAlertIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon
} from "lucide-react-native";

const ArrowLeft = ArrowLeftIcon as any;
const Bell = BellIcon as any;
const ShieldAlert = ShieldAlertIcon as any;
const CheckCircle = CheckCircleIcon as any;
const Info = InfoIcon as any;

import { API_BASE_URL } from "../../constants/config";

interface NotificationLog {
  id: number;
  journey_id: number | null;
  student_id: number | null;
  type: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function NotificationsLog() {
  const router = useRouter();
  const [logs, setLogs] = useState<NotificationLog[]>([]);
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

  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      const sessionStr = await SecureStore.getItemAsync("school-van-auth-session");
      if (!sessionStr) throw new Error("No active credentials session found");
      const session = JSON.parse(sessionStr);

      const res = await fetch(`${API_BASE_URL}/parent/notifications`, {
        headers: { Authorization: `Bearer ${session.token}` },
      });
      const data = await res.json().catch(() => []);
      if (res.ok) {
        setLogs(data);
      } else {
        throw new Error(data.error || "Failed to load notifications");
      }
    } catch (err: any) {
      Alert.alert("Sync Failure", err.message || "Failed to load notification logs.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const getLogIcon = (type: string) => {
    switch (type) {
      case "sos":
        return <ShieldAlert size={18} color="#EF4444" />;
      case "student_boarded":
      case "student_dropped":
        return <CheckCircle size={18} color="#10B981" />;
      default:
        return <Info size={18} color="#3B82F6" />;
    }
  };

  const getCardStyle = (type: string) => {
    if (type === "sos") {
      return [styles.card, styles.sosCard];
    }
    return styles.card;
  };

  const formatTimestamp = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
    } catch {
      return dateStr;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* Header Panel */}
      <View style={[styles.header, { backgroundColor: themeColors.headerBg, borderColor: themeColors.border }]}>
        <TouchableOpacity style={[styles.backBtn, { backgroundColor: isDarkMode ? "#334155" : "#F1F5F9" }]} onPress={() => router.back()}>
          <ArrowLeft size={20} color={themeColors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: themeColors.textPrimary }]}>Alert logs</Text>
        <TouchableOpacity style={[styles.backBtn, { backgroundColor: isDarkMode ? "#334155" : "#F1F5F9" }]} onPress={loadNotifications} disabled={isLoading}>
          <Bell size={18} color={themeColors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Main List */}
      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#10B981" />
        </View>
      ) : logs.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Bell size={48} color="#94A3B8" />
          <Text style={styles.emptyTitle}>Log is Empty</Text>
          <Text style={styles.emptyText}>You haven't received any transit notifications yet.</Text>
        </View>
      ) : (
        <FlatList
          data={logs}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={[
              getCardStyle(item.type), 
              item.type !== "sos" && { backgroundColor: themeColors.cardBg, borderColor: themeColors.border }
            ]}>
              <View style={styles.cardHeader}>
                <View style={[styles.iconWrapper, { backgroundColor: isDarkMode ? "#334155" : "#F1F5F9" }]}>
                  {getLogIcon(item.type)}
                </View>
                <Text style={styles.timestamp}>{formatTimestamp(item.created_at)}</Text>
              </View>
              <Text style={[
                styles.message, 
                item.type !== "sos" && { color: themeColors.textPrimary },
                item.type === "sos" && styles.sosMessage
              ]}>
                {item.message}
              </Text>
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
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
  },
  sosCard: {
    backgroundColor: "#FEE2E2",
    borderColor: "#FCA5A5",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  iconWrapper: {
    height: 32,
    width: 32,
    borderRadius: 10,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  timestamp: {
    fontSize: 11,
    fontWeight: "600",
    color: "#94A3B8",
  },
  message: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
    lineHeight: 20,
  },
  sosMessage: {
    color: "#991B1B",
    fontWeight: "800",
  },
});
