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
  TextInput,
  Switch,
  Linking
} from "react-native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { 
  LogOut as LogOutIcon, 
  CreditCard as CreditCardIcon, 
  RefreshCw as RefreshCwIcon, 
  Navigation as NavigationIcon, 
  CheckSquare as CheckSquareIcon, 
  ShieldAlert as ShieldAlertIcon,
  Phone as PhoneIcon,
  Bell as BellIcon,
  User as UserIcon,
  Users as UsersIcon,
  Plus as PlusIcon,
  Check as CheckIcon,
  Settings as SettingsIcon,
  Calendar as CalendarIcon,
  MapPin as MapPinIcon // Ensure MapPin is imported since it's used in the new UI
} from "lucide-react-native";

const LogOut = LogOutIcon as any;
const CreditCard = CreditCardIcon as any;
const RefreshCw = RefreshCwIcon as any;
const Navigation = NavigationIcon as any;
const CheckSquare = CheckSquareIcon as any;
const ShieldAlert = ShieldAlertIcon as any;
const Phone = PhoneIcon as any;
const Bell = BellIcon as any;
const User = UserIcon as any;
const Users = UsersIcon as any;
const Plus = PlusIcon as any;
const Check = CheckIcon as any;
const Settings = SettingsIcon as any;
const Calendar = CalendarIcon as any;
const MapPin = MapPinIcon as any;

import MapView, { Marker } from "react-native-maps";
import io from "socket.io-client";
import { API_BASE_URL } from "../../constants/config";

interface Child {
  id: number;
  name: string;
  school: string;
  pickup_stop_name?: string;
  dropoff_stop_name?: string;
  absent_today?: boolean;
  last_known_location?: {
      latitude: number;
      longitude: number;
      recorded_at: string;
      city_name?: string;
      is_connection_dropped?: boolean;
  } | null;
  last_passed_city?: string | null;
}

interface Payment {
  id: number;
  amount_due: string;
  status: string;
  due_date: string;
  month: string;
  receipt_ref?: string;
  receipt_url?: string;
  student_name?: string;
}

interface AlertLog {
  id: number;
  type: string;
  message: string;
  created_at: string;
}

interface RouteStop {
  id: number;
  name: string;
}

interface AvailableRoute {
  id: number;
  name: string;
  driver_name: string;
  stops: RouteStop[];
}

export default function ParentDashboard() {
  const router = useRouter();
  
  // Navigation Tabs state
  const [activeTab, setActiveTab] = useState<"home" | "children" | "payments" | "notifications" | "profile">("home");

  // Core Parent Session
  const [parentName, setParentName] = useState("Parent");
  const [parentEmail, setParentEmail] = useState("");
  const [token, setToken] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [parentAddress, setParentAddress] = useState("123, Galle Road, Colombo");
  const [emergencyName, setEmergencyName] = useState("Amali Perera");
  const [emergencyPhone, setEmergencyPhone] = useState("+94 77 123 4567");

  // Sub-view options for profile: "view" | "edit" | "settings"
  const [profileSubView, setProfileSubView] = useState<"view" | "edit" | "settings">("view");

  // UI settings state togglers
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
  const [trackingFrequency, setTrackingFrequency] = useState("high");

  const [socket, setSocket] = useState<any>(null);

  // States: Home (Live Tracking & Map)
  const [vanLocation, setVanLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [childStatus, setChildStatus] = useState<any>(null);
  const [sosAlert, setSosAlert] = useState<string | null>(null);
  const [emergencyContacts, setEmergencyContacts] = useState<any[]>([]);

  // States: Tab 2 (Children & Registration)
  const [children, setChildren] = useState<Child[]>([]);
  const [isLoadingChildren, setIsLoadingChildren] = useState(false);
  const [showAddChildModal, setShowAddChildModal] = useState(false);
  const [newChildName, setNewChildName] = useState("");
  const [newChildSchool, setNewChildSchool] = useState("");
  const [availableRoutes, setAvailableRoutes] = useState<AvailableRoute[]>([]);
  const [selectedRouteId, setSelectedRouteId] = useState<number | null>(null);
  const [selectedPickupStopId, setSelectedPickupStopId] = useState<number | null>(null);
  const [selectedDropoffStopId, setSelectedDropoffStopId] = useState<number | null>(null);
  const [isSubmittingChild, setIsSubmittingChild] = useState(false);

  // States: Tab 3 (Payments Accounts)
  const [activePayment, setActivePayment] = useState<Payment | null>(null);
  const [pastPayments, setPastPayments] = useState<Payment[]>([]);
  const [isLoadingPayments, setIsLoadingPayments] = useState(false);
  const [uploadPayment, setUploadPayment] = useState<Payment | null>(null);
  const [receiptRef, setReceiptRef] = useState("");
  const [receiptUrl, setReceiptUrl] = useState("");
  const [isSubmittingReceipt, setIsSubmittingReceipt] = useState(false);

  // States: Tab 4 (Alert Logs & Notifications Feed)
  const [alertLogs, setAlertLogs] = useState<AlertLog[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);
  const [travelHistory, setTravelHistory] = useState<any[]>([]);

  // States: Tab 5 (Settings)
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

  const themeColors = {
    background: isDarkMode ? "#000000" : "#F5F7FA",
    cardBg: isDarkMode ? "rgba(22, 22, 26, 0.85)" : "rgba(255, 255, 255, 0.85)",
    textPrimary: isDarkMode ? "#FFFFFF" : "#1C1C1E",
    textSecondary: isDarkMode ? "#8E8E93" : "#6E6E73",
    border: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.06)",
    inputBg: isDarkMode ? "rgba(30, 30, 35, 0.8)" : "rgba(242, 242, 247, 0.8)",
    headerBg: isDarkMode ? "rgba(10, 10, 12, 0.9)" : "rgba(255, 255, 255, 0.9)"
  };

  const themedStyles = {
    ...globalStyles,
    container: StyleSheet.flatten([globalStyles.container, { backgroundColor: themeColors.background }]),
    header: StyleSheet.flatten([globalStyles.header, { backgroundColor: themeColors.headerBg, borderColor: themeColors.border }]),
    card: StyleSheet.flatten([globalStyles.card, { backgroundColor: themeColors.cardBg, borderColor: themeColors.border }]),
    actionGridCard: StyleSheet.flatten([globalStyles.actionGridCard, { backgroundColor: themeColors.cardBg, borderColor: themeColors.border }]),
    dueCard: StyleSheet.flatten([globalStyles.dueCard, { backgroundColor: themeColors.cardBg, borderColor: themeColors.border }]),
    paymentCard: StyleSheet.flatten([globalStyles.paymentCard, { backgroundColor: themeColors.cardBg, borderColor: themeColors.border }]),
    textInput: StyleSheet.flatten([globalStyles.textInput, { backgroundColor: themeColors.inputBg, color: themeColors.textPrimary, borderColor: themeColors.border }]),
    welcome: StyleSheet.flatten([globalStyles.welcome, { color: themeColors.textSecondary }]),
    name: StyleSheet.flatten([globalStyles.name, { color: themeColors.textPrimary }]),
    sectionTitle: StyleSheet.flatten([globalStyles.sectionTitle, { color: themeColors.textPrimary }]),
    tabBar: StyleSheet.flatten([globalStyles.tabBar, { backgroundColor: themeColors.headerBg, borderColor: themeColors.border }])
  };

  const styles = themedStyles;

  // Initialize and load auth credentials
  useEffect(() => {
    async function initDashboard() {
      try {
        const sessionStr = await SecureStore.getItemAsync("school-van-auth-session");
        if (!sessionStr) {
          router.replace("/login");
          return;
        }

        const session = JSON.parse(sessionStr);
        setToken(session.token);
        setParentName(session.user?.name || "Parent");
        setParentEmail(session.user?.email || "");
        setParentPhone(session.user?.phone || "");

        const savedDarkMode = await SecureStore.getItemAsync("ui-dark-mode");
        if (savedDarkMode) setIsDarkMode(savedDarkMode === "true");

        const savedPhone = await SecureStore.getItemAsync("parent-profile-phone");
        if (savedPhone) setParentPhone(savedPhone);
        const savedAddress = await SecureStore.getItemAsync("parent-profile-address");
        if (savedAddress) setParentAddress(savedAddress);
        const savedEmergName = await SecureStore.getItemAsync("parent-profile-emerg-name");
        if (savedEmergName) setEmergencyName(savedEmergName);
        const savedEmergPhone = await SecureStore.getItemAsync("parent-profile-emerg-phone");
        if (savedEmergPhone) setEmergencyPhone(savedEmergencyPhone); // Note: Original code has a typo `savedEmergencyPhone` not declared

        // WebSocket Setup
        const socketCon = io(API_BASE_URL.replace("/api", ""), {
          auth: { token: session.token }
        });
        setSocket(socketCon);

        // Fetch children & emergency contacts in parallel
        const [childrenRes, contactsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/parent/children`, {
            headers: { Authorization: `Bearer ${session.token}` }
          }),
          fetch(`${API_BASE_URL}/parent/emergency-contacts`, {
            headers: { Authorization: `Bearer ${session.token}` }
          })
        ]);

        const childrenData = await childrenRes.json().catch(() => []);
        const contactsData = await contactsRes.json().catch(() => []);

        if (contactsRes.ok) {
          setEmergencyContacts(contactsData);
        }

        if (childrenRes.ok && childrenData.length > 0) {
          setChildren(childrenData);
          
          // Connect to first child's route journey room
          const firstChild = childrenData[0];
          const journeyRes = await fetch(`${API_BASE_URL}/parent/child/${firstChild.id}/status`, {
            headers: { Authorization: `Bearer ${session.token}` }
          });
          const journeyData = await journeyRes.json().catch(() => ({}));
          if (journeyRes.ok && journeyData.journeyId) {
            setChildStatus(journeyData);
            socketCon.emit("join_journey", journeyData.journeyId);
            socketCon.emit("tracking:subscribe-journey", { journeyId: journeyData.journeyId });
          }
        }
      } catch (err) {
        console.error("Dashboard init error:", err);
      }
    }
    initDashboard();
  }, []);

  // Socket triggers
  useEffect(() => {
    if (!socket) return;

    const handleLocation = (coords: any) => {
      setVanLocation({
        latitude: Number(coords.lat),
        longitude: Number(coords.lng)
      });
    };

    socket.on("location_update", handleLocation);
    socket.on("location_broadcast", handleLocation);
    socket.on("tracking:location-broadcast", handleLocation);

    const handleSos = (alert: any) => {
      setSosAlert(alert.message || "SOS alert flagged by driver! Keep updated.");
    };

    socket.on("sos_alert", handleSos);
    socket.on("sos:alert", handleSos);

    socket.on("sos_cleared", () => {
      setSosAlert(null);
    });

    socket.on("student:boarded", (data: any) => {
      setChildStatus((prev: any) => prev ? { ...prev, boarded: true } : prev);
      Alert.alert("Boarding Update", `${data.studentName || "Your child"} has successfully boarded the van!`);
    });

    socket.on("student:dropped", (data: any) => {
      setChildStatus((prev: any) => prev ? { ...prev, boarded: false, dropped: true } : prev);
      Alert.alert("Dropoff Update", `${data.studentName || "Your child"} has arrived safely at school/home!`);
    });

    return () => {
      socket.off("location_update", handleLocation);
      socket.off("location_broadcast", handleLocation);
      socket.off("tracking:location-broadcast", handleLocation);
      socket.off("sos_alert", handleSos);
      socket.off("sos:alert", handleSos);
      socket.off("sos_cleared");
      socket.off("student:boarded");
      socket.off("student:dropped");
    };
  }, [socket]);

  // Sync tab details
  useEffect(() => {
    if (token) {
      if (activeTab === "children") {
        loadChildren();
        loadAvailableRoutes();
      } else if (activeTab === "payments") {
        loadPayments();
      } else if (activeTab === "notifications") {
        loadNotifications();
        loadTravelHistory();
      }
    }
  }, [activeTab, token]);

  // TABS 2: CHILDREN WORKFLOWS
  const loadChildren = async () => {
    setIsLoadingChildren(true);
    try {
      const res = await fetch(`${API_BASE_URL}/parent/children`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json().catch(() => []);
      if (res.ok) setChildren(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingChildren(false);
    }
  };

  const loadAvailableRoutes = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/parent/available-routes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json().catch(() => []);
      if (res.ok) {
        // format routes data
        const formatted = Object.values(data).map((r: any) => ({
          id: r.id,
          name: r.name,
          driver_name: r.driver_name,
          stops: r.stops.map((s: any) => ({ id: s.id, name: s.name }))
        }));
        setAvailableRoutes(formatted);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRegisterChild = async () => {
    if (!newChildName || !newChildSchool || !selectedPickupStopId || !selectedDropoffStopId) {
      Alert.alert("Error", "Please input student and stop selections details");
      return;
    }
    setIsSubmittingChild(true);
    try {
      const res = await fetch(`${API_BASE_URL}/parent/children`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newChildName,
          school: newChildSchool,
          pickup_stop_id: selectedPickupStopId,
          dropoff_stop_id: selectedDropoffStopId,
          pickup_lat: 6.9271, // fallbacks
          pickup_lng: 79.8612,
          dropoff_lat: 6.9371,
          dropoff_lng: 79.8712
        })
      });
      if (res.ok) {
        Alert.alert("Success", "Child profile registered successfully!");
        setShowAddChildModal(false);
        setNewChildName("");
        setNewChildSchool("");
        setSelectedRouteId(null);
        setSelectedPickupStopId(null);
        setSelectedDropoffStopId(null);
        loadChildren();
      } else {
        const err = await res.json();
        Alert.alert("Failed", err.error || "Unable to register child profile.");
      }
    } catch (e: any) {
      Alert.alert("Error", e.message || "Failed child register request.");
    } finally {
      setIsSubmittingChild(false);
    }
  };

  const handleToggleAbsent = async (childId: number, currentAbsent: boolean) => {
    try {
      const res = await fetch(`${API_BASE_URL}/parent/children/${childId}/absent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          date: new Date().toISOString().split("T")[0],
          reason: currentAbsent ? "Attending" : "Sick leave/Absent today"
        })
      });
      if (res.ok) {
        Alert.alert("Status Updated", currentAbsent ? "Child marked as Present." : "Child marked as Absent today.");
        loadChildren();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // TABS 3: PAYMENTS WORKFLOWS
  const loadPayments = async () => {
    setIsLoadingPayments(true);
    try {
      const res = await fetch(`${API_BASE_URL}/payments/parent/dues`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json().catch(() => []);
      if (res.ok) {
        if (data.length > 0) {
          const active = data.find((p: any) => p.status !== "paid");
          setActivePayment(active || data[0]);
          setPastPayments(data.filter((p: any) => p.status === "paid"));
        } else {
          setActivePayment(null);
          setPastPayments([]);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingPayments(false);
    }
  };

  const handleSubmitReceipt = async () => {
    if (!uploadPayment || !receiptRef.trim() || !receiptUrl.trim()) {
      Alert.alert("Error", "Please input a transaction code and reference URL");
      return;
    }
    setIsSubmittingReceipt(true);
    try {
      const res = await fetch(`${API_BASE_URL}/payments/parent/upload/${uploadPayment.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          receipt_ref: receiptRef.trim(),
          receipt_url: receiptUrl.trim()
        })
      });
      if (res.ok) {
        Alert.alert("Success", "Receipt successfully logged for driver review!");
        setUploadPayment(null);
        setReceiptRef("");
        setReceiptUrl("");
        loadPayments();
      }
    } catch {
      Alert.alert("API Sync Failed", "Receipt upload request blocked.");
    } finally {
      setIsSubmittingReceipt(false);
    }
  };

  // TABS 4: ALERTS FEED & HISTORY
  const loadNotifications = async () => {
    setIsLoadingLogs(true);
    try {
      const res = await fetch(`${API_BASE_URL}/parent/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json().catch(() => []);
      if (res.ok) setAlertLogs(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  const loadTravelHistory = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/parent/journey-history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json().catch(() => []);
      if (res.ok) setTravelHistory(data);
    } catch (e) {
      console.error(e);
    }
  };

  // PROFILE UPDATES & LOGOUT
  const handleUpdatePassword = async () => {
    if (!oldPassword || !newPassword) {
      Alert.alert("Error", "Please input password credentials");
      return;
    }
    setIsSubmittingPassword(true);
    setTimeout(() => {
      Alert.alert("Success", "Profile password updated successfully!");
      setOldPassword("");
      setNewPassword("");
      setIsSubmittingPassword(false);
    }, 1000);
  };

  const handleSaveParentProfile = async () => {
    try {
      await SecureStore.setItemAsync("parent-profile-phone", parentPhone);
      await SecureStore.setItemAsync("parent-profile-address", parentAddress);
      await SecureStore.setItemAsync("parent-profile-emerg-name", emergencyName);
      await SecureStore.setItemAsync("parent-profile-emerg-phone", emergencyPhone);
      Alert.alert("Success", "Profile details saved successfully!");
      setProfileSubView("view");
    } catch {
      Alert.alert("Failed", "Unable to save profile details.");
    }
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Confirm Delete",
      "Are you absolutely sure you want to permanently delete your account? This action is irreversible.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete Account", 
          style: "destructive",
          onPress: async () => {
            try {
              const res = await fetch(`${API_BASE_URL}/auth/me`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
              });
              if (res.ok) {
                Alert.alert("Deleted", "Your account has been successfully deleted.");
                handleLogout();
              } else {
                Alert.alert("Error", "Failed to delete account from server.");
              }
            } catch (err) {
              Alert.alert("Error", "Network connection failure.");
            }
          }
        }
      ]
    );
  };

  const handleToggleDarkMode = async (value: boolean) => {
    setIsDarkMode(value);
    await SecureStore.setItemAsync("ui-dark-mode", value ? "true" : "false");
  };

  const handleLogout = async () => {
    if (socket) socket.disconnect();
    await SecureStore.deleteItemAsync("school-van-auth-session");
    await SecureStore.deleteItemAsync("school-van-active-journey-id");
    router.replace("/login");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "#10B981";
      case "receipt_submitted": return "#3B82F6";
      case "rejected": return "#EF4444";
      default: return "#F59E0B";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "paid": return "Settled";
      case "receipt_submitted": return "Verification Pending";
      case "rejected": return "Receipt Rejected";
      default: return "Pending Dues";
    }
  };

  const getStopsForSelectedRoute = () => {
    if (!selectedRouteId) return [];
    const route = availableRoutes.find(r => r.id === selectedRouteId);
    return route ? route.stops : [];
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* SOS Emergency Overlay Modal */}
      <Modal
        visible={!!sosAlert}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSosAlert(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.sosModalContainer}>
            <View style={styles.sosModalHeader}>
              <View style={styles.sosModalHeaderIconWrapper}>
                <ShieldAlert size={28} color="#FFFFFF" />
              </View>
              <View>
                <Text style={styles.sosModalHeaderSub}>Emergency Alert</Text>
                <Text style={styles.sosModalHeaderTitle}>SOS Triggered</Text>
              </View>
            </View>
            <View style={styles.sosModalBody}>
              <Text style={styles.sosModalMessage}>{sosAlert}</Text>
              <Text style={styles.sosModalSubText}>
                Please check on your child immediately. Live tracking is active.
              </Text>
            </View>
            <View style={styles.sosModalFooter}>
              {emergencyContacts && emergencyContacts.length > 0 ? (
                <TouchableOpacity
                  style={[styles.sosModalBtn, styles.sosModalCallBtn]}
                  onPress={() => {
                    const phoneNum = emergencyContacts[0]?.driver_phone || emergencyPhone;
                    Linking.openURL(`tel:${phoneNum}`).catch(() => {});
                  }}
                >
                  <Phone size={18} color="#FFFFFF" />
                  <Text style={styles.sosModalBtnText}>Call Driver</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.sosModalBtn, styles.sosModalCallBtn]}
                  onPress={() => {
                    Linking.openURL(`tel:${emergencyPhone}`).catch(() => {});
                  }}
                >
                  <Phone size={18} color="#FFFFFF" />
                  <Text style={styles.sosModalBtnText}>Call Emergency</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.sosModalBtn, styles.sosModalAckBtn]}
                onPress={() => setSosAlert(null)}
              >
                <Text style={[styles.sosModalBtnText, { color: "#475569" }]}>Acknowledge</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* 1. Header Area */}
      <View style={[styles.header, { backgroundColor: themeColors.headerBg, borderColor: themeColors.border }]}>
        <View>
          <Text style={[styles.welcome, { color: themeColors.textSecondary }]}>Parent Dashboard</Text>
          <Text style={[styles.name, { color: themeColors.textPrimary }]}>{parentName}</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>

      {/* 2. Scroll Panel Switcher */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        {/* TABS 1: Live GPS Map Tracking */}
        {activeTab === "home" && (
          <View style={styles.tabContent}>
            
            {/* SOS Emergency warning block */}
            {sosAlert && (
              <View style={[styles.card, { backgroundColor: "#FEF2F2", borderColor: "#EF4444", borderWidth: 1 }]}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                  <ShieldAlert size={28} color="#EF4444" />
                  <Text style={{ fontWeight: "900", color: "#991B1B", fontSize: 16 }}>SOS EMERGENCY WARNING</Text>
                </View>
                <Text style={{ marginTop: 8, fontSize: 13, color: "#991B1B", lineHeight: 20 }}>{sosAlert}</Text>
              </View>
            )}

            {/* Quick Actions Panel */}
            <View style={styles.actionGrid}>
              <TouchableOpacity style={styles.actionGridCard} onPress={() => router.push("/parent/contacts")}>
                <View style={[styles.actionGridIconWrapper, { backgroundColor: "#EFF6FF" }]}>
                  <Phone size={20} color="#2563EB" />
                </View>
                <Text style={styles.actionGridText}>Emergency Directory</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionGridCard} onPress={() => setActiveTab("notifications")}>
                <View style={[styles.actionGridIconWrapper, { backgroundColor: "#FEF3C7" }]}>
                  <Bell size={20} color="#D97706" />
                </View>
                <Text style={styles.actionGridText}>Alert Logs Feed</Text>
              </TouchableOpacity>
            </View>

            {/* Transit Status Board */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Today's Transit Status Board</Text>
              {children.length === 0 ? (
                <View style={styles.card}>
                  <Text style={{ color: "#64748B", textAlign: "center", fontSize: 13 }}>No student profiles added yet.</Text>
                </View>
              ) : (
                children.map(child => {
                  let statusText = "Waiting for Pickup";
                  let statusBg = "#FEF3C7";
                  let statusColor = "#D97706";

                  if (child.absent_today) {
                    statusText = "Absent Today";
                    statusBg = "#FEE2E2";
                    statusColor = "#EF4444";
                  } else if (childStatus && childStatus.studentId === child.id) {
                    if (childStatus.boarded) {
                      statusText = "Boarded & In Transit";
                      statusBg = "#D1FAE5";
                      statusColor = "#059669";
                    } else if (childStatus.dropped) {
                      statusText = "Arrived Safely";
                      statusBg = "#DBEAFE";
                      statusColor = "#2563EB";
                    }
                  }

                  const lastCity = (child as any).last_passed_city || (child as any).last_known_location?.city_name || (childStatus?.studentId === child.id ? childStatus?.last_passed_city : null);
                  const isConnDropped = (child as any).last_known_location?.is_connection_dropped || (childStatus?.studentId === child.id ? childStatus?.is_connection_dropped : false);

                  return (
                    <View key={child.id} style={[styles.card, { flexDirection: "column", paddingVertical: 12, marginBottom: 8 }]}>
                      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <View>
                          <Text style={{ fontSize: 14, fontWeight: "800", color: "#0F172A" }}>{child.name}</Text>
                          <Text style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>{child.school}</Text>
                        </View>
                        <View style={{ backgroundColor: statusBg, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 }}>
                          <Text style={{ fontSize: 11, fontWeight: "800", color: statusColor }}>{statusText}</Text>
                        </View>
                      </View>

                      {/* Last Known Location Banner Item */}
                      {lastCity && (
                        <View style={{ marginTop: 10, backgroundColor: isConnDropped ? "#FEF3C7" : "#F8FAFC", borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                          <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <MapPin size={13} color={isConnDropped ? "#D97706" : "#10B981"} style={{ marginRight: 6 }} />
                            <Text style={{ fontSize: 11, fontWeight: "700", color: "#334155" }}>
                              Last Known Location: <Text style={{ color: "#059669", fontWeight: "800" }}>{lastCity}</Text>
                            </Text>
                          </View>
                          {isConnDropped && (
                            <Text style={{ fontSize: 9, fontWeight: "800", color: "#B45309", backgroundColor: "#FDE68A", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 }}>
                              Signal Lost
                            </Text>
                          )}
                        </View>
                      )}
                    </View>
                  );
