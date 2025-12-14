import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../supabase/client";

export default function AdminHomeScreen({ navigation }) {
  const [productsCount, setProductsCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // 🔹 COUNT PRODUCTS
      const { count: pCount } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true });

      // 🔹 COUNT ORDERS
      const { count: oCount } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true });

      setProductsCount(pCount || 0);
      setOrdersCount(oCount || 0);
    } catch (e) {
      console.log("Admin stats error:", e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>👑 Admin Dashboard</Text>
        <Text style={styles.subtitle}>
          Gestion complète de la plateforme
        </Text>
      </View>

      {/* STATS */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Ionicons name="cube-outline" size={28} color="#FF6B6B" />
          <Text style={styles.statNumber}>{productsCount}</Text>
          <Text style={styles.statLabel}>Produits</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="receipt-outline" size={28} color="#4CAF50" />
          <Text style={styles.statNumber}>{ordersCount}</Text>
          <Text style={styles.statLabel}>Commandes</Text>
        </View>
      </View>

      {/* ACTIONS */}
      <Text style={styles.sectionTitle}>Actions rapides</Text>

      <TouchableOpacity
        style={styles.actionCard}
        onPress={() => navigation.navigate("AdminProducts")}
      >
        <Ionicons name="cube" size={30} color="#FFF" />
        <View style={styles.actionText}>
          <Text style={styles.actionTitle}>Produits</Text>
          <Text style={styles.actionSubtitle}>
            Ajouter, modifier ou supprimer
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.actionCard, { backgroundColor: "#4CAF50" }]}
        onPress={() => navigation.navigate("AdminOrders")}
      >
        <Ionicons name="receipt" size={30} color="#FFF" />
        <View style={styles.actionText}>
          <Text style={styles.actionTitle}>Commandes</Text>
          <Text style={styles.actionSubtitle}>
            Valider et suivre les commandes
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.actionCard, { backgroundColor: "#1E88E5" }]}
        onPress={() => navigation.navigate("AdminUsers")}
      >
        <Ionicons name="people" size={30} color="#FFF" />
        <View style={styles.actionText}>
          <Text style={styles.actionTitle}>Utilisateurs</Text>
          <Text style={styles.actionSubtitle}>
            Gérer les comptes clients
          </Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6FA",
    padding: 20,
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F4F6FA",
  },

  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1E1E2E",
  },
  subtitle: {
    fontSize: 14,
    color: "#777",
    marginTop: 6,
  },

  /* STATS */
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  statCard: {
    width: "48%",
    backgroundColor: "#FFF",
    borderRadius: 18,
    paddingVertical: 22,
    alignItems: "center",
    elevation: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "800",
    marginTop: 10,
    color: "#1E1E2E",
  },
  statLabel: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
  },

  /* ACTIONS */
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
    color: "#1E1E2E",
  },

  actionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF6B6B",
    padding: 20,
    borderRadius: 18,
    marginBottom: 16,
    elevation: 4,
  },
  actionText: {
    marginLeft: 16,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFF",
  },
  actionSubtitle: {
    fontSize: 13,
    color: "#FFECEC",
    marginTop: 2,
  },
});
