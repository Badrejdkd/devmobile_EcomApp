import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { supabase } from "../../supabase/client";

export default function AdminOrdersScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

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

  /* ================= UPDATE STATUS ================= */
  const updateStatus = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);

      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (error) throw error;

      Alert.alert("Succès", "Statut de la commande mis à jour");
      loadOrders();
    } catch (e) {
      Alert.alert("Erreur", "Impossible de modifier le statut");
      console.log(e);
    } finally {
      setUpdatingId(null);
    }
  };

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
                  : item.status === "confirmed"
                  ? styles.confirmed
                  : styles.cancelled,
              ]}
            >
              {item.status}
            </Text>
          </Text>

          <Text style={styles.date}>
            {new Date(item.created_at).toLocaleString()}
          </Text>

          {/* ACTIONS ADMIN */}
          {item.status === "pending" && (
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.btn, styles.confirmBtn]}
                disabled={updatingId === item.id}
                onPress={() =>
                  updateStatus(item.id, "confirmed")
                }
              >
                <Text style={styles.btnText}>Confirmer</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btn, styles.cancelBtn]}
                disabled={updatingId === item.id}
                onPress={() =>
                  updateStatus(item.id, "cancelled")
                }
              >
                <Text style={styles.btnText}>Annuler</Text>
              </TouchableOpacity>
            </View>
          )}
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
  cancelled: {
    color: "#F44336",
  },
  date: {
    fontSize: 12,
    color: "#777",
    marginTop: 6,
  },
  actions: {
    flexDirection: "row",
    marginTop: 12,
  },
  btn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 4,
  },
  confirmBtn: {
    backgroundColor: "#4CAF50",
  },
  cancelBtn: {
    backgroundColor: "#F44336",
  },
  btnText: {
    color: "#FFF",
    fontWeight: "700",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
