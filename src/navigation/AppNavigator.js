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

// Screens
import SplashScreen from "../screens/SplashScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import ProductDetailsScreen from "../screens/ProductDetailsScreen";
import CartScreen from "../screens/CartScreen";
import OrdersScreen from "../screens/OrdersScreen";
import ProfileScreen from "../screens/ProfileScreen";
import OrderDetailsScreen from "../screens/OrderDetailsScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Thème
const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#FF6B6B",
    background: "#FFFFFF",
  },
};

// Logo
const LogoHeader = () => (
  <View style={styles.logoContainer}>
    <Text style={styles.logoText}>
      Shop<Text style={styles.logoHighlight}>Pro</Text>
    </Text>
  </View>
);

// Header custom pour les pages internes
const CustomHeader = ({ navigation }) => {
  return (
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
};

// Header principal des Tabs
const MainHeader = () => (
  <View style={styles.mainHeaderContainer}>
    <View style={styles.mainHeaderLeft}>
      <TouchableOpacity style={styles.locationButton}>
        <Ionicons name="location-outline" size={18} color="#333" />
        <Text style={styles.locationText}>Livrer à Paris</Text>
        <Ionicons name="chevron-down" size={16} color="#666" />
      </TouchableOpacity>
    </View>

    <LogoHeader />

    <View style={styles.mainHeaderRight}>
      <Ionicons name="search-outline" size={22} color="#333" />
      <Ionicons name="chatbubble-outline" size={22} color="#333" />
    </View>
  </View>
);

// Icônes TabBar
const TabBarIcon = ({ name, focused, color, size }) => {
  const icons = {
    Home: focused ? "home" : "home-outline",
    Cart: focused ? "cart" : "cart-outline",
    Orders: focused ? "receipt" : "receipt-outline",
    Profile: focused ? "person" : "person-outline",
  };

  return <Ionicons name={icons[name]} size={size} color={color} />;
};

function MainTabs() {
  const cartItemCount = 3; // Simulation

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        header: () => <MainHeader />,
        tabBarActiveTintColor: "#FF6B6B",
        tabBarInactiveTintColor: "#8A8A8A",
        tabBarStyle: styles.tabBar,
        tabBarIcon: ({ focused, color, size }) =>
          TabBarIcon({ name: route.name, focused, color, size }),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: "Accueil" }} />

      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          title: "Panier",
          tabBarBadge: cartItemCount,
        }}
      />

      <Tab.Screen name="Orders" component={OrdersScreen} options={{ title: "Commandes" }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: "Profil" }} />
    </Tab.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        header: ({ navigation }) => <CustomHeader navigation={navigation} />,
      }}
    >
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />

      <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
      <Stack.Screen name="OrderDetailsScreen" component={OrderDetailsScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const { session, loading } = useAuth();

  if (loading) return <SplashScreen />;

  return (
    <NavigationContainer theme={MyTheme}>
      {session ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

// Styles
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
