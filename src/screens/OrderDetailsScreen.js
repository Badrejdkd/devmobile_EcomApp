import React from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

export default function OrderDetailsScreen({ route }) {
  const { order } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        Commande #{String(order.id).slice(0, 8)}
      </Text>

      <Text style={styles.sectionTitle}>Articles commandés</Text>
      {order.items.map((item, index) => (
        <View key={index} style={styles.itemRow}>
          <Image
            source={{ uri: item.product.image }}
            style={styles.productImage}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.productName}>{item.product.title}</Text>
            <Text style={styles.productPrice}>{item.unit_price} DH</Text>
            <Text style={styles.productQty}>Quantité : {item.quantity}</Text>
          </View>
        </View>
      ))}

      <Text style={styles.sectionTitle}>Résumé</Text>

      <View style={styles.row}>
        <Text>Sous-total</Text>
        <Text>{order.subtotal?.toFixed(2) || order.total_amount} DH</Text>
      </View>

      {order.discount ? (
        <View style={styles.row}>
          <Text>Réduction</Text>
          <Text>-{order.discount.toFixed(2)} DH</Text>
        </View>
      ) : null}

      <View style={styles.row}>
        <Text>Livraison</Text>
        <Text>{order.delivery_fee || 0} DH</Text>
      </View>

      <View style={styles.totalRow}>
        <Text style={styles.totalText}>Total payé</Text>
        <Text style={styles.totalAmount}>
          {order.total_amount.toFixed(2)} DH
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FFF",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 10,
  },
  itemRow: {
    flexDirection: "row",
    backgroundColor: "#F8F8F8",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
  },
  productPrice: {
    color: "#FF6B6B",
    fontWeight: "700",
  },
  productQty: {
    color: "#666",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  totalRow: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  totalText: {
    fontSize: 18,
    fontWeight: "700",
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FF6B6B",
  },
});
