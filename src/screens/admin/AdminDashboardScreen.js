import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

export default function AdminDashboardScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>👑 Admin Dashboard</Text>

      <TouchableOpacity style={styles.card}>
        <Icon name="cube-outline" size={24} color="#FF6B6B" />
        <Text style={styles.cardText}>Gérer les produits</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card}>
        <Icon name="receipt-outline" size={24} color="#FF6B6B" />
        <Text style={styles.cardText}>Voir les commandes</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card}>
        <Icon name="people-outline" size={24} color="#FF6B6B" />
        <Text style={styles.cardText}>Gérer les utilisateurs</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 30,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#FFF",
    padding: 18,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    elevation: 3,
  },
  cardText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 12,
  },
});
