import React, { useState } from "react";
import { 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View, 
  ActivityIndicator, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from "react-native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";

import { API_BASE_URL } from "../constants/config";

export default function LoginScreen() {
  const router = useRouter();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Login/Signup States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<"driver" | "parent">("parent");
  
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
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
    inputBg: isDarkMode ? "rgba(30, 30, 35, 0.8)" : "rgba(242, 242, 247, 0.8)"
  };

  const handleSubmit = async () => {
    if (isLoginMode) {
      if (!email || !password) {
        Alert.alert("Error", "Please fill in all fields");
        return;
      }
      setIsLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim(), password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Authentication failed");
        
        await SecureStore.setItemAsync("school-van-auth-session", JSON.stringify(data));
        if (data.user?.role === "driver") {
          router.replace("/driver");
        } else if (data.user?.role === "parent") {
          router.replace("/parent");
        } else {
          Alert.alert("Forbidden", "Admin panel not supported in this client.");
          await SecureStore.deleteItemAsync("school-van-auth-session");
        }
      } catch (err: any) {
        Alert.alert("Login Failed", err.message || "Unable to sync with remote gateway.");
      } finally {
        setIsLoading(false);
      }
    } else {
      if (!name || !email || !password || !phone) {
        Alert.alert("Error", "Please fill in all fields");
        return;
      }
      setIsLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password,
            phone: phone.trim(),
            role
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Registration failed");

        Alert.alert("Success", "Account created successfully!");
        await SecureStore.setItemAsync("school-van-auth-session", JSON.stringify(data));
        
        if (data.user?.role === "driver") {
          router.replace("/driver");
        } else if (data.user?.role === "parent") {
          router.replace("/parent");
        }
      } catch (err: any) {
        Alert.alert("Registration Failed", err.message || "Unable to complete sign-up.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={[styles.title, { color: themeColors.textPrimary }]}>School Van</Text>
          <Text style={styles.subtitle}>Transit Control System</Text>
        </View>

        <View style={[styles.card, { backgroundColor: themeColors.cardBg, borderColor: themeColors.border }]}>
          <Text style={[styles.cardTitle, { color: themeColors.textPrimary }]}>{isLoginMode ? "Sign In" : "Create Account"}</Text>

          {!isLoginMode && (
            <>
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: themeColors.textSecondary }]}>Full Name</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: themeColors.inputBg, color: themeColors.textPrimary, borderColor: themeColors.border }]}
                  placeholder="e.g. John Doe"
                  placeholderTextColor="#94A3B8"
                  value={name}
                  onChangeText={setName}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: themeColors.textSecondary }]}>Phone Number</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: themeColors.inputBg, color: themeColors.textPrimary, borderColor: themeColors.border }]}
                  placeholder="e.g. +94771234567"
                  placeholderTextColor="#94A3B8"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: themeColors.textSecondary }]}>Register As</Text>
                <View style={styles.roleContainer}>
                  <TouchableOpacity
                    style={[styles.roleBtn, { backgroundColor: themeColors.inputBg, borderColor: themeColors.border }, role === "parent" && styles.roleBtnActive]}
                    onPress={() => setRole("parent")}
                  >
                    <Text style={[styles.roleBtnText, role === "parent" && styles.roleBtnTextActive]}>Parent</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.roleBtn, { backgroundColor: themeColors.inputBg, borderColor: themeColors.border }, role === "driver" && styles.roleBtnActive]}
                    onPress={() => setRole("driver")}
                  >
                    <Text style={[styles.roleBtnText, role === "driver" && styles.roleBtnTextActive]}>Driver</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: themeColors.textSecondary }]}>Email Address</Text>
            <TextInput
              style={[styles.input, { backgroundColor: themeColors.inputBg, color: themeColors.textPrimary, borderColor: themeColors.border }]}
              placeholder="e.g. user@schoolvan.local"
              placeholderTextColor="#94A3B8"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: themeColors.textSecondary }]}>Password</Text>
            <TextInput
              style={[styles.input, { backgroundColor: themeColors.inputBg, color: themeColors.textPrimary, borderColor: themeColors.border }]}
              placeholder="••••••••"
              placeholderTextColor="#94A3B8"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <TouchableOpacity 
            style={[styles.button, isLoading && styles.buttonDisabled]} 
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>{isLoginMode ? "Authenticate" : "Sign Up"}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.toggleBtn}
            onPress={() => setIsLoginMode(!isLoginMode)}
            disabled={isLoading}
          >
            <Text style={styles.toggleText}>
              {isLoginMode ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 38,
    fontWeight: "900",
    color: "#0F172A",
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#10B981",
    textTransform: "uppercase",
    letterSpacing: 2,
    marginTop: 6,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 28,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#0F172A",
    marginBottom: 24,
    letterSpacing: -0.5,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: "800",
    color: "#64748B",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  input: {
    height: 52,
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 15,
    fontWeight: "600",
    color: "#0F172A",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  button: {
    height: 56,
    backgroundColor: "#10B981",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 2,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  roleContainer: {
    flexDirection: "row",
    gap: 12,
  },
  roleBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
  },
  roleBtnActive: {
    backgroundColor: "#EFF6FF",
    borderColor: "#3B82F6",
  },
  roleBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#64748B",
  },
  roleBtnTextActive: {
    color: "#2563EB",
  },
  toggleBtn: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    paddingVertical: 8,
  },
  toggleText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#3B82F6",
  },
});
