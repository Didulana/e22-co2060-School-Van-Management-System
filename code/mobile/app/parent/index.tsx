import React, { useState, useEffect } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert,
  SafeAreaView,
  ScrollView,
  Modal,
  TextInput
} from "react-native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { 
  LogOut as LogOutIcon, 
  CreditCard as CreditCardIcon, 
  RefreshCw as RefreshCwIcon, 
  Navigation as NavigationIcon, 
  MapPin as MapPinIcon, 
  CheckSquare as CheckSquareIcon, 
  ShieldAlert as ShieldAlertIcon 
} from "lucide-react-native";

const LogOut = LogOutIcon as any;
const CreditCard = CreditCardIcon as any;
const RefreshCw = RefreshCwIcon as any;
const Navigation = NavigationIcon as any;
const MapPin = MapPinIcon as any;
const CheckSquare = CheckSquareIcon as any;
const ShieldAlert = ShieldAlertIcon as any;
import MapView, { Marker } from "react-native-maps";

import { API_BASE_URL } from "../../constants/config";

interface Payment {
  id: number;
  student_id: number;
  month: string;
  amount_due: string;
  due_date: string;
  status: string;
}

export default function ParentDashboard() {
  const router = useRouter();
  const [parentName, setParentName] = useState("Parent");
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadPayment, setUploadPayment] = useState<Payment | null>(null);
  const [receiptRef, setReceiptRef] = useState("");
  const [receiptUrl, setReceiptUrl] = useState("");

  const loadData = async () => {
    setIsLoading(true);
    try {
      const sessionStr = await SecureStore.getItemAsync("school-van-auth-session");
      if (!sessionStr) throw new Error("No active session");
      const session = JSON.parse(sessionStr);
      setParentName(session.user?.name || "Parent");

      const res = await fetch(`${API_BASE_URL}/payments/parent/dues`, {
        headers: { Authorization: `Bearer ${session.token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch");

      setPayments(data);
    } catch (err: any) {
      Alert.alert("Sync Failure", err.message || "Failed to sync dashboard dues.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLogout = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await SecureStore.deleteItemAsync("school-van-auth-session");
          router.replace("/login");
        }
      }
    ]);
  };

  const handleSubmitReceipt = async () => {
    if (!uploadPayment) return;
    if (!receiptRef.trim() || !receiptUrl.trim()) {
      Alert.alert("Error", "Please fill in all transaction reference fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const sessionStr = await SecureStore.getItemAsync("school-van-auth-session");
      if (!sessionStr) throw new Error("No active session");
      const session = JSON.parse(sessionStr);

      const res = await fetch(`${API_BASE_URL}/payments/parent/upload/${uploadPayment.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`
        },
        body: JSON.stringify({ receipt_ref: receiptRef, receipt_url: receiptUrl }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      Alert.alert("Success", "Receipt successfully submitted for review!");
      setUploadPayment(null);
      setReceiptRef("");
      setReceiptUrl("");
      loadData();
    } catch (err: any) {
      Alert.alert("Submission Failed", err.message || "Receipt upload sync failure.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const activePayment = payments.find(p => p.status !== "paid") || payments[0];

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "paid": return "Paid";
      case "receipt_submitted": return "Reviewing";
      case "overdue": return "Overdue";
      default: return "Pending";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "#10B981";
      case "receipt_submitted": return "#3B82F6";
      case "overdue": return "#EF4444";
      default: return "#F59E0B";
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header Layout */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcome}>Parent Panel,</Text>
            <Text style={styles.name}>{parentName}</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>

        {/* Live GPS Map (Native Map Integration) */}
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: 6.9271, // Colombo defaults
              longitude: 79.8612,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
          >
            <Marker 
              coordinate={{ latitude: 6.9271, longitude: 79.8612 }}
              title="School Van"
              description="Live van tracker telemetry"
            />
          </MapView>
          <View style={styles.mapOverlay}>
            <Navigation size={14} color="#10B981" />
            <Text style={styles.mapOverlayText}>Active Tracking Stream</Text>
          </View>
        </View>

        {/* Payment Dues Card (Matches Web App Card Layout!) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Outstanding Dues</Text>
          {isLoading ? (
            <ActivityIndicator color="#10B981" size="small" />
          ) : activePayment ? (
            <View style={styles.dueCard}>
              <View style={styles.dueHeader}>
                <View style={styles.dueIconWrapper}>
                  <CreditCard size={20} color="#10B981" />
                </View>
                <View style={styles.dueTitleWrapper}>
                  <Text style={styles.dueCardTitle}>Current Monthly Due</Text>
                  <Text style={styles.dueCardAmount}>LKR {Number(activePayment.amount_due).toFixed(2)}</Text>
                </View>
                <View style={[styles.dueBadge, { backgroundColor: getStatusColor(activePayment.status) + "20" }]}>
                  <Text style={[styles.dueBadgeText, { color: getStatusColor(activePayment.status) }]}>
                    {getStatusLabel(activePayment.status)}
                  </Text>
                </View>
              </View>

              <View style={styles.dueDetails}>
                <View style={styles.dueDetailRow}>
                  <Text style={styles.dueDetailLabel}>Due Date:</Text>
                  <Text style={styles.dueDetailValue}>{new Date(activePayment.due_date).toLocaleDateString()}</Text>
                </View>
                <View style={styles.dueDetailRow}>
                  <Text style={styles.dueDetailLabel}>Billing Period:</Text>
                  <Text style={styles.dueDetailValue}>{activePayment.month}</Text>
                </View>
              </View>

              {activePayment.status !== "paid" && activePayment.status !== "receipt_submitted" && (
                <TouchableOpacity 
                  style={styles.actionBtn}
                  onPress={() => setUploadPayment(activePayment)}
                >
                  <Text style={styles.actionBtnText}>Upload Receipt</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View style={styles.noDuesCard}>
              <CheckSquare size={24} color="#10B981" />
              <Text style={styles.noDuesText}>Your balance is completely settled. No dues generated!</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Upload Receipt Modal */}
      <Modal
        visible={uploadPayment !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setUploadPayment(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Submit Receipt</Text>
            <Text style={styles.modalDesc}>
              Please input your deposit receipt details for reference:
            </Text>

            <TextInput
              style={styles.textInput}
              placeholder="Transaction Reference Code (e.g. TXN90288)"
              value={receiptRef}
              onChangeText={setReceiptRef}
              placeholderTextColor="#94A3B8"
            />

            <TextInput
              style={styles.textInput}
              placeholder="Receipt Image URL (e.g. https://storage/receipt.jpg)"
              value={receiptUrl}
              onChangeText={setReceiptUrl}
              placeholderTextColor="#94A3B8"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TouchableOpacity 
              style={[styles.submitBtn, isSubmitting && styles.btnDisabled]}
              onPress={handleSubmitReceipt}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.submitBtnText}>Submit Payment Log</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.closeBtn} 
              onPress={() => setUploadPayment(null)}
              disabled={isSubmitting}
            >
              <Text style={styles.closeBtnText}>Dismiss</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    marginBottom: 24,
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
  mapContainer: {
    height: 240,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 28,
    backgroundColor: "#E2E8F0",
  },
  map: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  mapOverlay: {
    position: "absolute",
    top: 16,
    left: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  mapOverlayText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#1E293B",
    marginLeft: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
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
  dueCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
  },
  dueHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  dueIconWrapper: {
    height: 44,
    width: 44,
    borderRadius: 12,
    backgroundColor: "#ECFDF5",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  dueTitleWrapper: {
    flex: 1,
    marginLeft: 12,
  },
  dueCardTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748B",
  },
  dueCardAmount: {
    fontSize: 22,
    fontWeight: "900",
    color: "#0F172A",
    marginTop: 2,
  },
  dueBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  dueBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  dueDetails: {
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  dueDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  dueDetailLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
  },
  dueDetailValue: {
    fontSize: 13,
    fontWeight: "800",
    color: "#334155",
  },
  actionBtn: {
    height: 52,
    backgroundColor: "#10B981",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  actionBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },
  noDuesCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFDF5",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  noDuesText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    color: "#047857",
    marginLeft: 12,
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.4)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 28,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#0F172A",
    marginBottom: 8,
  },
  modalDesc: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748B",
    marginBottom: 20,
  },
  textInput: {
    height: 52,
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 16,
    fontSize: 14,
    color: "#0F172A",
    marginBottom: 16,
  },
  submitBtn: {
    height: 54,
    backgroundColor: "#10B981",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  submitBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },
  btnDisabled: {
    opacity: 0.5,
  },
  closeBtn: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    marginTop: 8,
  },
  closeBtnText: {
    color: "#64748B",
    fontSize: 14,
    fontWeight: "800",
  },
});
