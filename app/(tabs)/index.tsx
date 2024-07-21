import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { isAuthenticated, removeToken } from "@/utils/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function DashboardScreen() {
  const navigation: any = useNavigation();
  const colorScheme = useColorScheme();
  const [username, setUsername] = useState<string|null>('');

  useEffect(() => {
    const checkAuth = async () => {
      const auth = await isAuthenticated();
      if (!auth) {
        navigation.navigate("login");
      }
      const name = await AsyncStorage.getItem('username');
      setUsername(name)
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    const logout: any = await removeToken();
    navigation.navigate("login");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Selamat Datang,</Text>
        <Text style={styles.userName}>{username}</Text>
      </View>
      <View style={styles.dashboardHeader}>
        <Text style={styles.dashboardTitle}>Dashboard</Text>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => handleLogout()}
        >
          <TabBarIcon
            name={"log-out-outline"}
            color={colorScheme === "dark" ? "#000000" : "#000000"}
            size={20}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.dashboard}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("pembayaran")}
        >
          <View style={styles.buttonContent}>
            <TabBarIcon
              name={"cash"}
              color={colorScheme === "dark" ? "#ffffff" : "#ffffff"}
            />
            <Text style={styles.buttonText}>Pembayaran Living Cost</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("informasi")}
        >
          <View style={styles.buttonContent}>
            <TabBarIcon
              name={"book"}
              color={colorScheme === "dark" ? "#ffffff" : "#ffffff"}
            />
            <Text style={styles.buttonText}>
              Informasi Pembayaran Living Cost
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 28,
  },
  header: {
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 16,
    color: "#333333",
  },
  userName: {
    fontSize: 16,
    color: "#333333",
  },
  dashboardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  dashboardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  dashboard: {
    flex: 1,
    justifyContent: "flex-start",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#085288",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    // width: 360,
    height: 150,
  },
  buttonContent: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    top: 24,
  },
  buttonText: {
    marginTop: 10,
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
  },
  logoutButton: {
    backgroundColor: "#FFFF00",
    padding: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
});
