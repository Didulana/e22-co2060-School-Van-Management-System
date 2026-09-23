import { useEffect, useState } from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";

export default function Index() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const sessionStr = await SecureStore.getItemAsync("school-van-auth-session");
        if (sessionStr) {
          const session = JSON.parse(sessionStr);
          if (session.user?.role === "driver") {
            router.replace("/driver");
            return;
          } else if (session.user?.role === "parent") {
            router.replace("/parent");
            return;
          }
        }
      } catch (e) {
        console.error("Failed to read auth session", e);
      }
      router.replace("/login");
    }

    checkAuth();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#10B981" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },
});
