import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  Platform,
  StatusBar,
  TextInput,
} from "react-native";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
import { supabase } from "../../supabase/client";
import { importApiProductsToDb } from "../../supabase/productImport";

export default function AdminProductsScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  /* ================= LOAD PRODUCTS ================= */
  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts(data || []);
      setFilteredProducts(data || []);
    } catch (e) {
      Alert.alert("Erreur", "Impossible de charger les produits");
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  /* ================= SEARCH FILTER ================= */
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (product) =>
          product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

  /* ================= DELETE PRODUCT ================= */
  const deleteProduct = (product) => {
    Alert.alert(
      "Confirmation",
      `Supprimer "${product.name}" ?`,
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              const { error } = await supabase
                .from("products")
                .delete()
                .eq("id", product.id);

              if (error) throw error;
              
              // Mise à jour locale
              setProducts(products.filter(p => p.id !== product.id));
              Alert.alert("Succès", "Produit supprimé avec succès");
            } catch (e) {
              Alert.alert("Erreur", "Échec de la suppression");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  /* ================= IMPORT API ================= */
  const handleImport = async () => {
    Alert.alert(
      "Importer produits",
      "Voulez-vous importer les produits depuis l'API ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Importer",
          onPress: async () => {
            try {
              setImporting(true);
              const result = await importApiProductsToDb();

              Alert.alert(
                "Import terminé",
                `${result.inserted} produits importés avec succès`
              );

              loadProducts();
            } catch (e) {
              Alert.alert("Erreur d'import", e.message || "Une erreur est survenue");
            } finally {
              setImporting(false);
            }
          },
        },
      ]
    );
  };

  /* ================= PULL TO REFRESH ================= */
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadProducts();
  }, [loadProducts]);

  /* ================= RENDER PRODUCT CARD ================= */
  const renderProductCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("AdminEditProduct", { product: item })
      }
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        {/* Product Info */}
        <View style={styles.productInfo}>
          <View style={styles.productHeader}>
            <Text style={styles.productName} numberOfLines={1}>
              {item.name}
            </Text>
            <View style={styles.stockBadge}>
              <Text style={[
                styles.stockText,
                { color: item.stock > 10 ? "#10B981" : item.stock > 0 ? "#F59E0B" : "#EF4444" }
              ]}>
                {item.stock > 0 ? `${item.stock} en stock` : "Rupture"}
              </Text>
            </View>
          </View>
          
          {item.description && (
            <Text style={styles.productDescription} numberOfLines={2}>
              {item.description}
            </Text>
          )}
          
          <View style={styles.productFooter}>
            <Text style={styles.productPrice}>{item.price} DH</Text>
            <Text style={styles.productDate}>
              {new Date(item.created_at).toLocaleDateString()}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() =>
              navigation.navigate("AdminEditProduct", { product: item })
            }
          >
            <Ionicons name="create-outline" size={22} color="#3B82F6" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => deleteProduct(item)}
          >
            <Ionicons name="trash-outline" size={22} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  /* ================= LIST HEADER ================= */
  const ListHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.sectionTitle}>Gestion des produits</Text>
      <Text style={styles.sectionSubtitle}>
        {filteredProducts.length} produit{filteredProducts.length > 1 ? "s" : ""}
      </Text>
    </View>
  );

  /* ================= EMPTY STATE ================= */
  const EmptyList = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="cube-outline" size={80} color="#CBD5E1" />
      <Text style={styles.emptyTitle}>Aucun produit</Text>
      <Text style={styles.emptySubtitle}>
        Commencez par importer des produits ou en ajouter un
      </Text>
    </View>
  );

  /* ================= UI ================= */
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.mainHeader}>
          <Text style={styles.appTitle}>Administration</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate("AdminAddProduct")}
          >
            <Ionicons name="add-circle" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#94A3B8" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un produit..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#94A3B8"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>

        {/* Import Button */}
        <TouchableOpacity
          style={[
            styles.importButton,
            importing && styles.importButtonDisabled
          ]}
          onPress={handleImport}
          disabled={importing}
        >
          {importing ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="cloud-download-outline" size={20} color="#FFFFFF" />
              <Text style={styles.importButtonText}>Importer depuis API</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Products List */}
        {loading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text style={styles.loadingText}>Chargement des produits...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredProducts}
            keyExtractor={(item) => String(item.id)}
            showsVerticalScrollIndicator={false}
            renderItem={renderProductCard}
            ListHeaderComponent={ListHeader}
            ListEmptyComponent={EmptyList}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#3B82F6"]}
                tintColor="#3B82F6"
              />
            }
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

/* ================= PROFESSIONAL STYLES ================= */
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  mainHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 5,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1E293B",
    letterSpacing: -0.5,
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#1E293B",
    padding: 0,
  },
  importButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#10B981",
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 24,
    elevation: 3,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    gap: 10,
  },
  importButtonDisabled: {
    backgroundColor: "#6EE7B7",
  },
  importButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  headerContainer: {
    marginBottom: 24,
    paddingHorizontal: 5,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "500",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 12,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  productInfo: {
    flex: 1,
    marginRight: 16,
  },
  productHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  productName: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1E293B",
    flex: 1,
    marginRight: 12,
  },
  stockBadge: {
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  stockText: {
    fontSize: 12,
    fontWeight: "600",
  },
  productDescription: {
    fontSize: 14,
    color: "#64748B",
    lineHeight: 20,
    marginBottom: 12,
  },
  productFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  productPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: "#3B82F6",
  },
  productDate: {
    fontSize: 12,
    color: "#94A3B8",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  editButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DBEAFE",
  },
  deleteButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FEF2F2",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  listContent: {
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#64748B",
    fontWeight: "500",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#64748B",
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#94A3B8",
    textAlign: "center",
    lineHeight: 20,
  },
});