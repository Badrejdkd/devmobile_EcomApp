import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  RefreshControl,
  Animated,
  ScrollView,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import ProductCard from "../components/ProductCard";
import { fetchProducts } from "../api/productsApi";
import { supabase } from "../supabase/client";

const { width } = Dimensions.get("window");
const BANNER_HEIGHT = 200;
const CATEGORY_SIZE = 80;

export default function HomeScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");

  const scrollY = useRef(new Animated.Value(0)).current;

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [BANNER_HEIGHT, 0],
    extrapolate: "clamp",
  });

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    applyCategoryFilter();
  }, [activeCategory, products]);

  /* ===================== LOAD API + DB ===================== */
  const load = async () => {
    try {
      setLoading(true);

      /* 🔹 API PRODUCTS (NON COMMANDABLES) */
      const apiProducts = await fetchProducts();
      const apiNormalized = apiProducts.map((p) => ({
        key: `api-${p.id}`,        // ⚠️ clé React seulement
        source: "api",
        name: p.title,
        price: p.price,
        image_url: p.image,
        category: p.category,
      }));

      /* 🔹 DB PRODUCTS (COMMANDABLES) */
      const { data: dbProducts, error } = await supabase
        .from("products")
        .select("*");

      if (error) throw error;

      const dbNormalized = (dbProducts || []).map((p) => ({
        key: `db-${p.id}`,         // ⚠️ clé React
        id: p.id,                 // ✅ BIGINT
        source: "db",
        name: p.name,
        price: p.price,
        image_url: p.image_url,
        category: p.category || "other",
      }));

      const allProducts = [...dbNormalized, ...apiNormalized];

      setProducts(allProducts);
      setFilteredProducts(allProducts);
    } catch (err) {
      console.log("Erreur chargement produits :", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  /* ===================== CATEGORIES ===================== */
  const categories = [
    { id: "all", name: "Tout", icon: "grid-outline", color: "#000" },
    { id: "electronics", name: "Électronique", icon: "phone-portrait-outline", color: "#FF6B6B" },
    { id: "jewelery", name: "Bijoux", icon: "diamond-outline", color: "#C71585" },
    { id: "men's clothing", name: "Homme", icon: "man-outline", color: "#45B7D1" },
    { id: "women's clothing", name: "Femme", icon: "woman-outline", color: "#AA00FF" },
    { id: "other", name: "Autres", icon: "pricetag-outline", color: "#777" },
  ];

  const applyCategoryFilter = () => {
    if (activeCategory === "all") {
      setFilteredProducts(products);
      return;
    }
    setFilteredProducts(products.filter(p => p.category === activeCategory));
  };

  /* ===================== UI ===================== */
  const renderHeader = () => (
    <View>
      <Animated.View style={[styles.bannerContainer, { height: headerHeight }]}>
        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
          {["#FF6B6B", "#4ECDC4", "#45B7D1"].map((c, i) => (
            <View key={i} style={[styles.bannerItem, { backgroundColor: c }]}>
              <Text style={styles.bannerTitle}>Promo</Text>
              <Icon name="flash-outline" size={60} color="rgba(255,255,255,0.2)" />
            </View>
          ))}
        </ScrollView>
      </Animated.View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Catégories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesContainer}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              onPress={() => setActiveCategory(category.id)}
              style={styles.categoryItem}
            >
              <View style={[styles.categoryIcon, { backgroundColor: `${category.color}20` }]}>
                <Icon name={category.icon} size={28} color={category.color} />
              </View>
              <Text style={styles.categoryName}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Animated.FlatList
        data={filteredProducts}
        numColumns={2}
        keyExtractor={(item) => item.key}
        ListHeaderComponent={renderHeader}
        renderItem={({ item }) => (
          <View style={styles.productColumn}>
            <ProductCard
              product={item}
              disabled={item.source === "api"}   // 🔒 API non commandable
              onPress={() =>
                item.source === "db" &&
                navigation.navigate("ProductDetails", { product: item })
              }
            />
          </View>
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

/* ===================== STYLES (IDENTIQUES) ===================== */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  bannerContainer: { overflow: "hidden" },
  bannerItem: {
    width: width - 32,
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  bannerTitle: { fontSize: 24, color: "#fff", fontWeight: "800" },
  sectionContainer: { backgroundColor: "#fff", paddingVertical: 16 },
  sectionTitle: { fontSize: 20, fontWeight: "700", marginLeft: 16 },
  categoriesContainer: { paddingHorizontal: 16 },
  categoryItem: { alignItems: "center", marginRight: 20 },
  categoryIcon: {
    width: CATEGORY_SIZE,
    height: CATEGORY_SIZE,
    borderRadius: CATEGORY_SIZE / 2,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryName: { fontSize: 12, fontWeight: "600", color: "#333" },
  productColumn: { width: "50%", padding: 6 },
});
