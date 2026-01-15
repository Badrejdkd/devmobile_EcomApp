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
import { supabase } from "../../supabase/client";
import { useAuth } from "../../context/AuthContext";
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

      // Récupérer les commandes avec le nouveau statut
      const { data: orderList, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.log("Error loading orders:", error);
        return;
      }

      // Si pas de commandes
      if (!orderList || orderList.length === 0) {
        setOrders([]);
        return;
      }

      const ids = orderList.map((o) => o.id);

      // Récupérer les items des commandes
      const { data: items } = await supabase
        .from("order_items")
        .select("*")
        .in("order_id", ids);

      // Construire les commandes complètes
      const fullOrders = await Promise.all(
        orderList.map(async (order) => {
          const relatedItems = items?.filter((i) => i.order_id === order.id) || [];

          const resolvedItems = await Promise.all(
            relatedItems.map(async (i) => {
              try {
                // Essayer d'abord depuis votre base Supabase
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

                // Fallback vers FakeStore API si nécessaire
                const res = await fetch(
                  `https://fakestoreapi.com/products/${i.product_id}`
                );
                const apiProduct = await res.json();

                return { ...i, product: apiProduct };
              } catch (e) {
                console.log("Error loading product:", e);
                return {
                  ...i,
                  product: {
                    title: "Produit non disponible",
                    price: 0,
                    image: "https://via.placeholder.com/150",
                  },
                };
              }
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

  /* ------------------- ON REFRESH ------------------- */
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadOrders();
  }, []);

  /* ------------------- FILTERS ------------------- */
  const filteredOrders = orders.filter((order) => {
    if (activeFilter === "all") return true;
    return order.status?.toLowerCase() === activeFilter;
  });

  /* ------------------- STATUS CONFIG (3 statuts seulement) ------------------- */
  const statusStyle = {
    pending: { 
      color: "#FFA500", 
      icon: "time-outline",
      label: "EN ATTENTE",
      description: "Commande en attente de confirmation"
    },
    confirmed: { 
      color: "#42A5F5", 
      icon: "checkmark-circle-outline",
      label: "CONFIRMÉE",
      description: "Commande confirmée"
    },
    cancelled: { 
      color: "#FF4D4D", 
      icon: "close-circle-outline",
      label: "ANNULÉE",
      description: "Commande annulée"
    },
  };

  const getStatusStyle = (status) =>
    statusStyle[status?.toLowerCase()] || {
      color: "#777",
      icon: "cube-outline",
      label: "INCONNU",
      description: "Statut inconnu"
    };

  /* ------------------- RENDER ORDER CARD ------------------- */
  const renderOrder = ({ item }) => {
    const s = getStatusStyle(item.status);
    const totalAmount = item.items?.reduce((sum, item) => 
      sum + (item.unit_price * item.quantity), 0
    ) || 0;

    return (
      <View style={styles.card}>
        {/* HEADER */}
        <View style={styles.cardHeader}>
          <View style={styles.orderInfo}>
            <Text style={styles.orderId}>
              Commande #{String(item.id).slice(0, 8)}
            </Text>
            
            {/* STATUT AVEC PLUS D'INFOS */}
            <View style={styles.statusContainer}>
              <View
                style={[styles.statusBadge, { backgroundColor: s.color + "22" }]}
              >
                <Icon name={s.icon} size={16} color={s.color} />
                <Text style={[styles.statusText, { color: s.color }]}>
                  {s.label}
                </Text>
              </View>
              <Text style={styles.statusDescription}>{s.description}</Text>
            </View>
          </View>

          {/* DATE BOX */}
          <View style={styles.dateBox}>
            <Text style={styles.day}>
              {new Date(item.created_at).getDate()}
            </Text>
            <Text style={styles.month}>
              {new Date(item.created_at).toLocaleString("fr", {
                month: "short",
              })}
            </Text>
            <Text style={styles.year}>
              {new Date(item.created_at).getFullYear()}
            </Text>
          </View>
        </View>

        {/* ITEMS ET TOTAL */}
        <View style={styles.itemsContainer}>
          {item.items?.slice(0, 2).map((p, index) => (
            <View key={index} style={styles.itemRow}>
          
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={1}>
                  {p.product.title}
                </Text>
                <View style={styles.productDetails}>
                  <Text style={styles.productQuantity}>{p.quantity} x</Text>
                  <Text style={styles.productPrice}>{p.unit_price} DH</Text>
                </View>
              </View>
            </View>
          ))}

          {item.items?.length > 2 && (
            <Text style={styles.moreItems}>
              +{item.items.length - 2} articles supplémentaires
            </Text>
          )}

          {/* TOTAL */}
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>{totalAmount.toFixed(2)} DH</Text>
          </View>
        </View>

        {/* BOUTON D'ACTION */}
        <TouchableOpacity
          style={styles.detailsButton}
          onPress={() => navigation.navigate("OrderDetailsScreen", { order: item })}
        >
          <Text style={styles.detailsButtonText}>Voir les détails</Text>
          <Icon name="chevron-forward" size={18} color="#FF6B6B" />
        </TouchableOpacity>
      </View>
    );
  };

  /* ------------------- RENDER EMPTY STATE ------------------- */
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Icon name="cart-outline" size={80} color="#DDD" />
      <Text style={styles.emptyTitle}>Aucune commande</Text>
      <Text style={styles.emptyText}>
        {activeFilter === "all" 
          ? "Vous n'avez pas encore passé de commande"
          : `Vous n'avez pas de commandes ${getStatusStyle(activeFilter).label.toLowerCase()}`
        }
      </Text>
      <TouchableOpacity 
        style={styles.shopButton}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.shopButtonText}>Découvrir nos produits</Text>
      </TouchableOpacity>
    </View>
  );

  /* ------------------- LOADING ------------------- */
  if (loading)
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
        <Text style={styles.loadingText}>Chargement de vos commandes...</Text>
      </View>
    );

  return (
    <SafeAreaView style={styles.container}>
      {/* TITLE */}
      <View style={styles.header}>
        <Text style={styles.title}>Mes Commandes</Text>
        <TouchableOpacity onPress={loadOrders} disabled={loading}>
          <Icon name="refresh-outline" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      {/* FILTERS */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersWrapper}
        contentContainerStyle={styles.filtersContent}
      >
        {[
          { id: "all", label: "Toutes" },
          { id: "pending", label: "En attente" },
          { id: "confirmed", label: "Confirmées" },
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
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#FF6B6B"]}
            tintColor="#FF6B6B"
          />
        }
      />
    </SafeAreaView>
  );
}

/* ------------------- STYLES ------------------- */
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#F5F7FA" 
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
  },

  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1A1A1A",
  },

  /* FILTERS */
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
  filterBtnActive: { 
    backgroundColor: "#FF6B6B",
    shadowColor: "#FF6B6B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  filterText: { 
    fontSize: 14, 
    fontWeight: "600", 
    color: "#555" 
  },
  filterTextActive: { 
    color: "#FFF" 
  },

  /* LIST CONTENT */
  listContent: {
    padding: 16,
    flexGrow: 1,
  },

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
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  orderInfo: {
    flex: 1,
    marginRight: 12,
  },

  orderId: { 
    fontSize: 18, 
    fontWeight: "700", 
    color: "#333",
    marginBottom: 8,
  },

  statusContainer: {
    marginBottom: 4,
  },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  statusText: { 
    marginLeft: 6, 
    fontWeight: "700", 
    fontSize: 12,
    letterSpacing: 0.5,
  },
  statusDescription: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },

  dateBox: {
    alignItems: "center",
    backgroundColor: "#FF6B6B11",
    padding: 10,
    borderRadius: 12,
    minWidth: 60,
  },
  day: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FF6B6B",
  },
  month: { 
    fontSize: 12, 
    textTransform: "uppercase", 
    color: "#666",
    marginTop: 2,
  },
  year: {
    fontSize: 10,
    color: "#999",
    marginTop: 2,
  },

  itemsContainer: {
    borderTopWidth: 1,
    borderColor: "#EEE",
    paddingTop: 16,
    marginBottom: 16,
  },

  itemRow: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "center",
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: "#EEE",
  },
  productInfo: {
    flex: 1,
  },
  productName: { 
    fontSize: 14, 
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  productDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  productQuantity: {
    fontSize: 13,
    color: "#666",
    marginRight: 8,
  },
  productPrice: { 
    fontSize: 15, 
    fontWeight: "700",
    color: "#FF6B6B",
  },

  moreItems: {
    textAlign: "center",
    color: "#FF6B6B",
    fontWeight: "600",
    fontSize: 13,
    paddingVertical: 8,
    backgroundColor: "#FF6B6B11",
    borderRadius: 8,
    marginBottom: 12,
  },

  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#EEE",
    paddingTop: 12,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FF6B6B",
  },

  detailsButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderWidth: 1.5,
    borderColor: "#FF6B6B",
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  detailsButtonText: {
    color: "#FF6B6B",
    fontWeight: "700",
    fontSize: 14,
    marginRight: 8,
  },

  /* EMPTY STATE */
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#666",
    marginTop: 20,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: "#999",
    textAlign: "center",
    paddingHorizontal: 40,
    marginBottom: 24,
    lineHeight: 22,
  },
  shopButton: {
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 25,
  },
  shopButtonText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 15,
  },

  /* LOADING */
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
});