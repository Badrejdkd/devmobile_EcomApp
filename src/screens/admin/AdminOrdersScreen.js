import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { supabase } from "../../supabase/client";

export default function AdminOrdersScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD ORDERS ================= */
  const loadOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (e) {
      console.log("Erreur chargement commandes :", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  /* ================= UI ================= */
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF6B6B" />
        <Text>Chargement des commandes...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={orders}
      keyExtractor={(item) => String(item.id)}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.orderId}>
            Commande #{String(item.id)}
          </Text>

          <Text style={styles.text}>
            Total : <Text style={styles.bold}>{item.total_amount} DH</Text>
          </Text>

          <Text style={styles.text}>
            Statut :{" "}
            <Text
              style={[
                styles.status,
                item.status === "pending"
                  ? styles.pending
                  : styles.confirmed,
              ]}
            >
              {item.status}
            </Text>
          </Text>

          <Text style={styles.date}>
            {new Date(item.created_at).toLocaleString()}
          </Text>
        </View>
      )}
    />
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  list: {
    padding: 16,
    backgroundColor: "#F4F6FA",
  },
  card: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    elevation: 3,
  },
  orderId: {
    fontWeight: "800",
    fontSize: 16,
    marginBottom: 6,
  },
  text: {
    fontSize: 14,
    marginBottom: 4,
  },
  bold: {
    fontWeight: "700",
  },
  status: {
    fontWeight: "700",
    textTransform: "uppercase",
  },
  pending: {
    color: "#FF9800",
  },
  confirmed: {
    color: "#4CAF50",
  },
  date: {
    fontSize: 12,
    color: "#777",
    marginTop: 6,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
