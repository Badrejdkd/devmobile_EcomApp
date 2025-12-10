import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { supabase } from "../supabase/client";
import { useAuth } from "../context/AuthContext";
import { useFocusEffect } from "@react-navigation/native";

export default function OrdersScreen({ navigation }) {
  const { session } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [session])
  );

  /* ------------------- LOAD ORDERS ------------------- */
  const loadOrders = async () => {
    try {
      setLoading(true);

      const { data: orderList } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      const ids = orderList.map((o) => o.id);

      const { data: items } = await supabase
        .from("order_items")
        .select("*")
        .in("order_id", ids);

      const fullOrders = await Promise.all(
        orderList.map(async (order) => {
          const relatedItems = items.filter((i) => i.order_id === order.id);

          const resolvedItems = await Promise.all(
            relatedItems.map(async (i) => {
              const { data: supaProduct } = await supabase
                .from("products")
                .select("*")
                .eq("id", i.product_id)
                .single();

              if (supaProduct)
                return {
                  ...i,
                  product: {
                    title: supaProduct.name,
                    price: supaProduct.price,
                    image: supaProduct.image_url,
                  },
                };

              const res = await fetch(
                `https://fakestoreapi.com/products/${i.product_id}`
              );
              const apiProduct = await res.json();

              return { ...i, product: apiProduct };
            })
          );

          return { ...order, items: resolvedItems };
        })
      );

      setOrders(fullOrders);
    } catch (e) {
      console.log("Load error", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /* ------------------- FILTERS ------------------- */
  const filteredOrders = orders.filter((order) => {
    if (activeFilter === "all") return true;
    return order.status?.toLowerCase() === activeFilter;
  });

  /* ------------------- STATUS CONFIG ------------------- */
  const statusStyle = {
    delivered: { color: "#28C76F", icon: "checkmark-circle" },
    pending: { color: "#FFA500", icon: "time" },
    cancelled: { color: "#FF4D4D", icon: "close-circle" },
    processing: { color: "#42A5F5", icon: "hourglass" },
  };

  const getStatusStyle = (status) =>
    statusStyle[status?.toLowerCase()] || {
      color: "#777",
      icon: "cube-outline",
    };

  /* ------------------- RENDER ORDER CARD ------------------- */
  const renderOrder = ({ item }) => {
    const s = getStatusStyle(item.status);

    return (
      <View style={styles.card}>
        {/* HEADER */}
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.orderId}>
              Commande #{String(item.id).slice(0, 8)}
            </Text>
            <View
              style={[styles.statusBadge, { backgroundColor: s.color + "22" }]}
            >
              <Icon name={s.icon} size={14} color={s.color} />
              <Text style={[styles.statusText, { color: s.color }]}>
                {item.status.toUpperCase()}
              </Text>
            </View>
          </View>

          <View style={styles.dateBox}>
            <Text style={styles.day}>
              {new Date(item.created_at).getDate()}
            </Text>
            <Text style={styles.month}>
              {new Date(item.created_at).toLocaleString("fr", {
                month: "short",
              })}
            </Text>
          </View>
        </View>

        {/* ITEMS */}
        <View style={styles.itemsContainer}>
          {item.items.slice(0, 2).map((p, index) => (
            <View key={index} style={styles.itemRow}>
              <Image
                source={{ uri: p.product.image }}
                style={styles.productImage}
              />
              <View>
                <Text style={styles.productName} numberOfLines={1}>
                  {p.product.title}
                </Text>
                <Text style={styles.productPrice}>{p.unit_price} DH</Text>
              </View>
            </View>
          ))}

          {item.items.length > 2 && (
            <Text style={styles.moreItems}>
              +{item.items.length - 2} articles
            </Text>
          )}
        </View>

        {/* FLOATING BUTTON */}
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => navigation.navigate("OrderDetailsScreen", { order: item })}
        >
          <Text style={styles.floatingButtonText}>Voir</Text>
          <Icon name="chevron-forward" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  };

  /* ------------------- LOADING ------------------- */
  if (loading)
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );

  return (
    <SafeAreaView style={styles.container}>
      {/* TITLE */}
      <Text style={styles.title}>Mes Commandes</Text>

      {/* FILTERS FIXÉS */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersWrapper}
        contentContainerStyle={styles.filtersContent}
      >
        {[
          { id: "all", label: "Toutes" },
          { id: "pending", label: "En cours" },
          { id: "processing", label: "Traitement" },
          { id: "delivered", label: "Livrées" },
          { id: "cancelled", label: "Annulées" },
        ].map((f) => (
          <TouchableOpacity
            key={f.id}
            style={[
              styles.filterBtn,
              activeFilter === f.id && styles.filterBtnActive,
            ]}
            onPress={() => setActiveFilter(f.id)}
          >
            <Text
              style={[
                styles.filterText,
                activeFilter === f.id && styles.filterTextActive,
              ]}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* LIST */}
      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderOrder}
        contentContainerStyle={{ padding: 16 }}
      />
    </SafeAreaView>
  );
}

/* ------------------- STYLES ------------------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA" },

  title: {
    fontSize: 26,
    fontWeight: "800",
    marginLeft: 16,
    marginTop: 20,
    marginBottom: 10,
    color: "#1A1A1A",
  },

  /* FILTERS FIXÉS */
  filtersWrapper: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  filtersContent: {
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  filterBtn: {
    backgroundColor: "#F1F1F1",
    paddingHorizontal: 18,
    paddingVertical: 8,
    marginHorizontal: 6,
    borderRadius: 20,
    height: 38,
    justifyContent: "center",
  },
  filterBtnActive: { backgroundColor: "#FF6B6B" },
  filterText: { fontSize: 14, fontWeight: "600", color: "#555" },
  filterTextActive: { color: "#FFF" },

  /* CARDS */
  card: {
    backgroundColor: "#FFF",
    padding: 18,
    borderRadius: 18,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: { height: 4 },
    elevation: 4,
    position: "relative",
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  orderId: { fontSize: 16, fontWeight: "700", color: "#333" },

  statusBadge: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 6,
  },
  statusText: { marginLeft: 5, fontWeight: "700", fontSize: 11 },

  dateBox: {
    alignItems: "center",
    backgroundColor: "#FF6B6B22",
    padding: 8,
    borderRadius: 12,
  },
  day: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FF6B6B",
  },
  month: { fontSize: 12, textTransform: "uppercase", color: "#666" },

  itemsContainer: {
    borderTopWidth: 1,
    borderColor: "#EEE",
    marginTop: 12,
    paddingTop: 12,
  },

  itemRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: "#EEE",
  },
  productName: { fontSize: 14, fontWeight: "600" },
  productPrice: { fontWeight: "800", marginTop: 4 },

  moreItems: {
    textAlign: "center",
    color: "#FF6B6B",
    fontWeight: "600",
  },

  /* FLOATING BUTTON */
  floatingButton: {
    position: "absolute",
    right: 16,
    bottom: 16,
    backgroundColor: "#FF6B6B",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  floatingButtonText: {
    color: "#fff",
    fontWeight: "700",
    marginRight: 5,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
