import React from "react";
import {
  NavigationContainer,
  DefaultTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";

import { useAuth } from "../context/AuthContext";

/* ================= SCREENS ================= */

// Auth
import SplashScreen from "../screens/SplashScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";

// User
import HomeScreen from "../screens/HomeScreen";
import ProductDetailsScreen from "../screens/ProductDetailsScreen";
import CartScreen from "../screens/CartScreen";
import OrdersScreen from "../screens/OrdersScreen";
import OrderDetailsScreen from "../screens/OrderDetailsScreen";
import ProfileScreen from "../screens/ProfileScreen";

// Admin
import AdminHomeScreen from "../screens/admin/AdminHomeScreen";
import AdminProductsScreen from "../screens/admin/AdminProductsScreen";
import AdminAddProductScreen from "../screens/admin/AdminAddProductScreen";
import AdminEditProductScreen from "../screens/admin/AdminEditProductScreen";
import AdminOrdersScreen from "../screens/admin/AdminOrdersScreen";

/* ================= NAVIGATORS ================= */

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

/* ================= CONFIG ================= */

const ADMIN_EMAIL = "admin@shoppro.com";

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#FF6B6B",
    background: "#FFFFFF",
  },
};

/* ================= HEADER ================= */

const LogoHeader = () => (
  <View style={styles.logoContainer}>
    <Text style={styles.logoText}>
      Shop<Text style={styles.logoHighlight}>Pro</Text>
    </Text>
  </View>
);

const CustomHeader = ({ navigation }) => (
  <View style={styles.headerContainer}>
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <Ionicons name="arrow-back" size={24} color="#333" />
    </TouchableOpacity>
    <LogoHeader />
    <View style={styles.headerRight}>
      <Ionicons name="search-outline" size={22} color="#333" />
      <Ionicons name="notifications-outline" size={22} color="#333" />
    </View>
  </View>
);

const MainHeader = () => (
  <View style={styles.mainHeaderContainer}>
    <View style={styles.mainHeaderLeft}>
      <TouchableOpacity style={styles.locationButton}>
        <Ionicons name="location-outline" size={18} color="#333" />
        <Text style={styles.locationText}>Livrer à Paris</Text>
      </TouchableOpacity>
    </View>
    <LogoHeader />
    <View style={styles.mainHeaderRight}>
      <Ionicons name="search-outline" size={22} color="#333" />
      <Ionicons name="chatbubble-outline" size={22} color="#333" />
    </View>
  </View>
);

/* ================= TAB ICON ================= */

const TabBarIcon = ({ name, focused, color, size }) => {
  const icons = {
    Home: focused ? "home" : "home-outline",
    Cart: focused ? "cart" : "cart-outline",
    Orders: focused ? "receipt" : "receipt-outline",
    Profile: focused ? "person" : "person-outline",
  };
  return <Ionicons name={icons[name]} size={size} color={color} />;
};

/* ================= USER TABS ================= */

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        header: () => <MainHeader />,
        tabBarActiveTintColor: "#FF6B6B",
        tabBarInactiveTintColor: "#8A8A8A",
        tabBarStyle: styles.tabBar,
        tabBarIcon: ({ focused, color, size }) =>
          <TabBarIcon name={route.name} focused={focused} color={color} size={size} />,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Orders" component={OrdersScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

/* ================= ADMIN STACK ================= */

function AdminStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="AdminHome" component={AdminHomeScreen} options={{ title: "Admin" }} />
      <Stack.Screen name="AdminProducts" component={AdminProductsScreen} />
      <Stack.Screen name="AdminAddProduct" component={AdminAddProductScreen} />
      <Stack.Screen name="AdminEditProduct" component={AdminEditProductScreen} />
      <Stack.Screen name="AdminOrders" component={AdminOrdersScreen} />
    </Stack.Navigator>
  );
}

/* ================= AUTH STACK ================= */

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

/* ================= USER STACK ================= */

function UserStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        header: ({ navigation }) => <CustomHeader navigation={navigation} />,
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
      <Stack.Screen name="OrderDetailsScreen" component={OrderDetailsScreen} />
    </Stack.Navigator>
  );
}

/* ================= ROOT ================= */

export default function AppNavigator() {
  const { session, loading } = useAuth();

  if (loading) return <SplashScreen />;

  if (!session) {
    return (
      <NavigationContainer theme={MyTheme}>
        <AuthStack />
      </NavigationContainer>
    );
  }

  const isAdmin = session.user.email === ADMIN_EMAIL;

  return (
    <NavigationContainer theme={MyTheme}>
      {isAdmin ? <AdminStack /> : <UserStack />}
    </NavigationContainer>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  logoContainer: { alignItems: "center" },
  logoText: { fontSize: 24, fontWeight: "bold" },
  logoHighlight: { color: "#FF6B6B" },

  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerRight: { flexDirection: "row", gap: 12 },

  mainHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? 45 : 10,
    backgroundColor: "#fff",
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
  mainHeaderLeft: { flex: 1 },
  mainHeaderRight: { flexDirection: "row", gap: 15 },

  locationButton: {
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  locationText: { fontSize: 12, fontWeight: "500" },

  tabBar: {
    backgroundColor: "#fff",
    height: Platform.OS === "ios" ? 80 : 60,
    paddingBottom: Platform.OS === "ios" ? 20 : 5,
  },
});
