import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function AdminHomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>👑 Admin Dashboard</Text>

      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("AdminProducts")}
      >
        <Text style={styles.cardText}>📦 Gérer les produits</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("AdminOrders")}
      >
        <Text style={styles.cardText}>🧾 Commandes</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F8F9FA" },
  title: { fontSize: 24, fontWeight: "800", marginBottom: 30 },
  card: {
    backgroundColor: "#FF6B6B",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  cardText: { color: "#FFF", fontSize: 18, fontWeight: "700" },
});
