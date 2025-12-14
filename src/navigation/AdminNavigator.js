import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet } from "react-native";

// Screens Admin
import AdminHomeScreen from "../screens/admin/AdminHomeScreen";
import AdminProductsScreen from "../screens/admin/AdminProductsScreen";
import AdminOrdersScreen from "../screens/admin/AdminOrdersScreen";
import AdminUsersScreen from "../screens/admin/AdminUsersScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

/* ---------------- HEADER ADMIN ---------------- */

const AdminHeader = () => (
  <View style={styles.header}>
    <Ionicons name="shield-checkmark" size={22} color="#fff" />
    <Text style={styles.headerTitle}>Admin Panel</Text>
  </View>
);

/* ---------------- TAB ADMIN ---------------- */

function AdminTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        header: () => <AdminHeader />,

        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: "#FF6B6B",
        tabBarInactiveTintColor: "#9E9E9E",

        tabBarIcon: ({ color, size, focused }) => {
          const icons = {
            AdminHome: focused ? "speedometer" : "speedometer-outline",
            AdminProducts: focused ? "cube" : "cube-outline",
            AdminOrders: focused ? "receipt" : "receipt-outline",
            AdminUsers: focused ? "people" : "people-outline",
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      })}
    >
      <Tab.Screen
        name="AdminHome"
        component={AdminHomeScreen}
        options={{ title: "Dashboard" }}
      />
      <Tab.Screen
        name="AdminProducts"
        component={AdminProductsScreen}
        options={{ title: "Produits" }}
      />
      <Tab.Screen
        name="AdminOrders"
        component={AdminOrdersScreen}
        options={{ title: "Commandes" }}
      />
      <Tab.Screen
        name="AdminUsers"
        component={AdminUsersScreen}
        options={{ title: "Utilisateurs" }}
      />
    </Tab.Navigator>
  );
}

/* ---------------- STACK ADMIN ---------------- */

export default function AdminNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AdminTabs"
        component={AdminTabs}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: "#1E1E2E",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 10,
  },
  tabBar: {
    height: 65,
    paddingBottom: 8,
    paddingTop: 6,
    borderTopWidth: 0,
    backgroundColor: "#FFFFFF",
    elevation: 10,
  },
});
