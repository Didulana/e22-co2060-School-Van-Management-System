import React, { useState, useEffect } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert,
  SafeAreaView,
  Modal,
  TextInput
} from "react-native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { 
  ArrowLeft as ArrowLeftIcon, 
  RefreshCw as RefreshCwIcon, 
  FileText as FileTextIcon, 
  Check as CheckIcon, 
  X as XIcon, 
  ShieldAlert as ShieldAlertIcon 
} from "lucide-react-native";

const ArrowLeft = ArrowLeftIcon as any;
const RefreshCw = RefreshCwIcon as any;
const FileText = FileTextIcon as any;
const Check = CheckIcon as any;
const X = XIcon as any;
const ShieldAlert = ShieldAlertIcon as any;

import { API_BASE_URL } from "../../constants/config";

interface Payment {
  id: number;
  student_name?: string;
  student_id: number;
  month: string;
  amount_due: string;
  status: string;
  receipt_ref?: string;
  receipt_url?: string;
}

export default function DriverPayments() {
  const router = useRouter();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    async function loadTheme() {
      const val = await SecureStore.getItemAsync("ui-dark-mode");
      if (val === "true") setIsDarkMode(true);
    }
    loadTheme();
  }, []);

  const themeColors = {
    background: isDarkMode ? "#000000" : "#F5F7FA",
    cardBg: isDarkMode ? "rgba(22, 22, 26, 0.85)" : "rgba(255, 255, 255, 0.85)",
    textPrimary: isDarkMode ? "#FFFFFF" : "#1C1C1E",
    textSecondary: isDarkMode ? "#8E8E93" : "#6E6E73",
    border: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.06)",
    headerBg: isDarkMode ? "rgba(10, 10, 12, 0.9)" : "rgba(255, 255, 255, 0.9)",
    inputBg: isDarkMode ? "rgba(30, 30, 35, 0.8)" : "rgba(242, 242, 247, 0.8)"
  };

  const themedStyles = {
    ...globalStyles,
    container: StyleSheet.flatten([globalStyles.container, { backgroundColor: themeColors.background }]),
    header: StyleSheet.flatten([globalStyles.header, { backgroundColor: themeColors.headerBg, borderColor: themeColors.border }]),
    paymentCard: StyleSheet.flatten([globalStyles.paymentCard, { backgroundColor: themeColors.cardBg, borderColor: themeColors.border }]),
    textInput: StyleSheet.flatten([globalStyles.textInput, { backgroundColor: themeColors.inputBg, color: themeColors.textPrimary, borderColor: themeColors.border }]),
    modalContent: StyleSheet.flatten([globalStyles.modalContent, { backgroundColor: themeColors.cardBg }]),
    headerTitle: StyleSheet.flatten([globalStyles.headerTitle, { color: themeColors.textPrimary }])
  };

  const styles = themedStyles;

  const loadPayments = async () => {
    setIsLoading(true);
    try {
      const sessionStr = await SecureStore.getItemAsync("school-van-auth-session");
      if (!sessionStr) throw new Error("No active session");
      const session = JSON.parse(sessionStr);

      const res = await fetch(`${API_BASE_URL}/payments/driver/students`, {
        headers: { Authorization: `Bearer ${session.token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch");

      setPayments(data);
    } catch (err: any) {
      Alert.alert("Sync Failure", err.message || "Failed to fetch student dues database.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const handleGenerate = async () => {
    Alert.alert("Generate Dues", "Would you like to calculate and generate payment records for all assigned students for the current month?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Generate",
        onPress: async () => {
          setIsGenerating(true);
          try {
            const sessionStr = await SecureStore.getItemAsync("school-van-auth-session");
            if (!sessionStr) throw new Error("No active session");
            const session = JSON.parse(sessionStr);

            const res = await fetch(`${API_BASE_URL}/payments/driver/generate`, {
              method: "POST",
              headers: { Authorization: `Bearer ${session.token}` },
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to generate");

            Alert.alert("Success", "Generated monthly dues calculation complete!");
            loadPayments();
          } catch (err: any) {
            Alert.alert("Generation Failed", err.message || "Failed to generate dues.");
          } finally {
            setIsGenerating(false);
          }
        }
      }
    ]);
  };

  const handleVerify = async (status: "paid" | "rejected") => {
    if (!selectedPayment) return;
    if (status === "rejected" && !rejectReason.trim()) {
      Alert.alert("Error", "Please input a rejection reason");
      return;
    }

    setIsSubmitting(true);
    try {
      const sessionStr = await SecureStore.getItemAsync("school-van-auth-session");
      if (!sessionStr) throw new Error("No active session");
      const session = JSON.parse(sessionStr);

      const res = await fetch(`${API_BASE_URL}/payments/driver/verify/${selectedPayment.id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}` 
        },
        body: JSON.stringify({ status, reject_reason: rejectReason }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Verification failed");

      Alert.alert("Success", `Payment record successfully ${status}`);
      setSelectedPayment(null);
      setRejectReason("");
      loadPayments();
    } catch (err: any) {
      Alert.alert("Action Failed", err.message || "Verification sync error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": return { text: "#047857", bg: "#D1FAE5" };
      case "receipt_submitted": return { text: "#1D4ED8", bg: "#DBEAFE" };
      case "rejected": return { text: "#B91C1C", bg: "#FEE2E2" };
      case "overdue": return { text: "#C2410C", bg: "#FFEDD5" };
      default: return { text: "#B45309", bg: "#FEF3C7" };
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* Header Layout */}
      <View style={[styles.header, { backgroundColor: themeColors.headerBg, borderColor: themeColors.border }]}>
        <TouchableOpacity style={[styles.backBtn, { backgroundColor: isDarkMode ? "#334155" : "#F1F5F9" }]} onPress={() => router.back()}>
          <ArrowLeft size={20} color={themeColors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: themeColors.textPrimary }]}>Student Dues</Text>
        <TouchableOpacity style={[styles.refreshBtn, { backgroundColor: isDarkMode ? "#334155" : "#F1F5F9" }]} onPress={loadPayments} disabled={isLoading}>
          <RefreshCw size={18} color={themeColors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Control Area */}
      <View style={styles.controlPanel}>
        <TouchableOpacity 
          style={[styles.generateBtn, isGenerating && styles.btnDisabled]} 
          onPress={handleGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.generateBtnText}>Calculate & Generate Dues</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Student List */}
      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#10B981" />
        </View>
      ) : (
        <FlatList
          data={payments}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const colors = getStatusColor(item.status);
            return (
              <View style={[styles.paymentCard, { backgroundColor: themeColors.cardBg, borderColor: themeColors.border }]}>
                <View style={styles.cardInfo}>
                  <Text style={[styles.studentName, { color: themeColors.textPrimary }]}>{item.student_name || `Student #${item.student_id}`}</Text>
                  <Text style={[styles.monthLabel, { color: themeColors.textSecondary }]}>Month: {item.month} • Due: LKR {Number(item.amount_due).toFixed(2)}</Text>
                </View>
                <View style={styles.cardActions}>
                  <View style={[styles.badge, { backgroundColor: colors.bg }]}>
                    <Text style={[styles.badgeText, { color: colors.text }]}>
                      {item.status === "receipt_submitted" ? "Review" : item.status}
                    </Text>
                  </View>
                  {item.status === "receipt_submitted" && (
                    <TouchableOpacity 
                      style={styles.verifyBtn} 
                      onPress={() => setSelectedPayment(item)}
                    >
                      <FileText size={16} color="#FFFFFF" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <ShieldAlert size={48} color="#94A3B8" />
              <Text style={styles.emptyText}>No payment records found.</Text>
            </View>
          }
        />
      )}

      {/* Review Receipt Modal */}
      <Modal
        visible={selectedPayment !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedPayment(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: themeColors.cardBg }]}>
            <Text style={[styles.modalTitle, { color: themeColors.textPrimary }]}>Review Payment</Text>
            {selectedPayment && (
              <>
                <Text style={[styles.modalDesc, { color: themeColors.textSecondary }]}>
                  Verifying payment from student:{"\n"}
                  <Text style={{ fontWeight: "800", color: themeColors.textPrimary }}>{selectedPayment.student_name}</Text>{"\n"}
                  Amount: LKR {Number(selectedPayment.amount_due).toFixed(2)}
                </Text>
                <Text style={styles.modalMeta}>Reference Code: {selectedPayment.receipt_ref || "N/A"}</Text>

                <TextInput
                  style={[styles.textInput, { backgroundColor: themeColors.inputBg, color: themeColors.textPrimary, borderColor: themeColors.border }]}
                  placeholder="Rejection remarks (required only if rejecting)"
                  value={rejectReason}
                  onChangeText={setRejectReason}
                  placeholderTextColor="#94A3B8"
                />

                <View style={styles.modalActions}>
                  <TouchableOpacity 
                    style={[styles.modalBtn, styles.declineBtn]}
                    onPress={() => handleVerify("rejected")}
                    disabled={isSubmitting}
                  >
                    <X size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
                    <Text style={styles.btnText}>Reject</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.modalBtn, styles.approveBtn]}
                    onPress={() => handleVerify("paid")}
                    disabled={isSubmitting}
                  >
                    <Check size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
                    <Text style={styles.btnText}>Approve</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity 
                  style={styles.closeBtn} 
                  onPress={() => setSelectedPayment(null)}
                  disabled={isSubmitting}
                >
                  <Text style={styles.closeBtnText}>Dismiss</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    height: 64,
    borderBottomWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
  },
  backBtn: {
    height: 40,
    width: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#0F172A",
  },
  refreshBtn: {
    height: 40,
    width: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  controlPanel: {
    padding: 20,
  },
  generateBtn: {
    height: 52,
    backgroundColor: "#0F172A",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  btnDisabled: {
    opacity: 0.5,
  },
  generateBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  paymentCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  cardInfo: {
    flex: 1,
    marginRight: 12,
  },
  studentName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
  },
  monthLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
    marginTop: 4,
  },
  cardActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  verifyBtn: {
    height: 36,
    width: 36,
    borderRadius: 10,
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#64748B",
    marginTop: 12,
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
    marginBottom: 16,
  },
  modalDesc: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
    lineHeight: 22,
    marginBottom: 8,
  },
  modalMeta: {
    fontSize: 12,
    fontWeight: "800",
    color: "#10B981",
    marginBottom: 20,
    textTransform: "uppercase",
    letterSpacing: 0.5,
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
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  modalBtn: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  approveBtn: {
    backgroundColor: "#10B981",
  },
  declineBtn: {
    backgroundColor: "#EF4444",
  },
  btnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
  },
  closeBtn: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  closeBtnText: {
    color: "#64748B",
    fontSize: 14,
    fontWeight: "800",
  },
});
