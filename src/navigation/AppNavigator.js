import React, { memo } from "react";
import {
  NavigationContainer,
  DefaultTheme,
  useNavigation,
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
import SplashScreen from "../screens/user/chargement";
import LoginScreen from "../screens/user/Login";
import RegisterScreen from "../screens/user/Register";

// User
import HomeScreen from "../screens/user/Home";
import ProductDetailsScreen from "../screens/user/ProductDetails";
import CartScreen from "../screens/user/panier";
import OrdersScreen from "../screens/user/commande";
import OrderDetailsScreen from "../screens/user/commandeDetails";
import ProfileScreen from "../screens/user/Profile";
import ContactScreen from "../screens/user/Contact";
import IndexScreen from "../screens/user/Index";

// Admin
import AdminHomeScreen from "../screens/admin/AdminHome";
import AdminProductsScreen from "../screens/admin/AdminProducts";
import AdminAddProductScreen from "../screens/admin/AdminAjouterProduct";
import AdminEditProductScreen from "../screens/admin/AdminmodifierProduct";
import AdminOrdersScreen from "../screens/admin/AdminCommande";
import AdminUsersScreen from "../screens/admin/AdminUsers";

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

const LogoHeader = memo(() => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.logoContainer}
    >
      <Text style={styles.logoText}>
        Shop<Text style={styles.logoHighlight}>Addiction</Text>
      </Text>
    </TouchableOpacity>
  );
});

const CustomHeader = memo(({ navigation }) => (
  <View style={styles.headerContainer}>
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <Ionicons name="arrow-back" size={24} color="#333" />
    </TouchableOpacity>

    <LogoHeader />

    <View style={styles.headerRight}>
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => navigation.navigate("Contact")}
      >
        <Ionicons name="chatbubble-outline" size={22} color="#333" />
      </TouchableOpacity>
    </View>
  </View>
));

const MainHeader = memo(() => {
  const navigation = useNavigation(); // ✅ accès navigation

  return (
    <View style={styles.mainHeaderContainer}>
      <LogoHeader />

      <View style={styles.mainHeaderRight}>


        {/* ✅ CHAT → CONTACT */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate("Contact")}
        >
          <Ionicons name="chatbubble-outline" size={22} color="#333" />
        </TouchableOpacity>
      </View>
    </View>
  );
});

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
        tabBarIcon: ({ focused, color, size }) => (
          <TabBarIcon
            name={route.name}
            focused={focused}
            color={color}
            size={size}
          />
        ),
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
      <Stack.Screen
        name="AdminHome"
        component={AdminHomeScreen}
        options={{ title: "Admin – ShopAddiction", headerBackVisible: false }}
      />
      <Stack.Screen name="AdminProducts" component={AdminProductsScreen} />
      <Stack.Screen name="AdminAddProduct" component={AdminAddProductScreen} />
      <Stack.Screen name="AdminEditProduct" component={AdminEditProductScreen} />
      <Stack.Screen name="AdminOrders" component={AdminOrdersScreen} />
      <Stack.Screen name="AdminUsersScreen" component={AdminUsersScreen} />
    </Stack.Navigator>
  );
}

/* ================= AUTH STACK ================= */

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Index" component={IndexScreen} />
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
        header: ({ navigation }) => (
          <CustomHeader navigation={navigation} />
        ),
      }}
    >
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
      />

      <Stack.Screen
        name="OrderDetailsScreen"
        component={OrderDetailsScreen}
      />

      <Stack.Screen
        name="Contact"
        component={ContactScreen}
      />
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

  const isAdmin = session?.user?.email === ADMIN_EMAIL;

  return (
    <NavigationContainer theme={MyTheme}>
      {isAdmin ? <AdminStack /> : <UserStack />}
    </NavigationContainer>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  logoContainer: { flex: 1,  },
  logoText: { fontSize: 26, fontWeight: "800" },
  logoHighlight: { color: "#FF6B6B" },

  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "ios" ? 45 : 15,
    paddingBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
  },
  headerRight: { flexDirection: "row", gap: 15 },

  mainHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "ios" ? 45 : 15,
    paddingBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
  },
  mainHeaderRight: { flexDirection: "row", gap: 15 },

  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },

  tabBar: {
    height: Platform.OS === "ios" ? 85 : 65,
    paddingBottom: Platform.OS === "ios" ? 25 : 10,
  },
});
