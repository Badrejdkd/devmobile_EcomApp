import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
  Animated,
  ScrollView,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import ProductCard from "../components/ProductCard";
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
    loadProducts();
  }, []);

  useEffect(() => {
    applyCategoryFilter();
  }, [activeCategory, products]);

  /* ===================== LOAD DB PRODUCTS ONLY ===================== */
  const loadProducts = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const normalized = (data || []).map((p) => ({
        key: String(p.id),       // clé FlatList
        id: p.id,               // BIGINT → OK
        name: p.name,
        price: p.price,
        quantity:p.quantity,
        image_url: p.image_url,
        category: p.category,
        description:p.description,
        gender: p.gender || null, // Ajout du champ gender si disponible dans votre table
      }));

      setProducts(normalized);
      setFilteredProducts(normalized);
    } catch (e) {
      console.log("Erreur chargement produits :", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadProducts();
  };

  /* ===================== CATEGORIES ===================== */
  const categories = [
    { id: "all", name: "Tout", icon: "grid-outline", color: "#000", type: "all" },
    { id: "electronics", name: "Électronique", icon: "phone-portrait-outline", color: "#FF6B6B", type: "category" },
    { id: "jewelery", name: "Bijoux", icon: "diamond-outline", color: "#C71585", type: "category" },
    { id: "men's clothing", name: "Homme", icon: "man-outline", color: "#45B7D1", type: "category" },
    { id: "women's clothing", name: "Femme", icon: "woman-outline", color: "#AA00FF", type: "category" },

  ];

  const applyCategoryFilter = () => {
    if (activeCategory === "all") {
      setFilteredProducts(products);
    } else {
      const selectedCategory = categories.find(cat => cat.id === activeCategory);
      
      if (selectedCategory.type === "category") {
        // Filtre par catégorie (electronics, jewelery, other)
        setFilteredProducts(
          products.filter((p) => p.category === activeCategory)
        );
      } else if (selectedCategory.type === "gender") {
        // Filtre par genre (homme/femme)
        setFilteredProducts(
          products.filter((p) => p.gender === activeCategory)
        );
      }
    }
  };

  /* ===================== HEADER ===================== */
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
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              onPress={() => setActiveCategory(category.id)}
              style={[
                styles.categoryItem,
                activeCategory === category.id && styles.activeCategoryItem
              ]}
            >
              <View style={[
                styles.categoryIcon, 
                { backgroundColor: `${category.color}20` },
                activeCategory === category.id && styles.activeCategoryIcon
              ]}>
                <Icon 
                  name={category.icon} 
                  size={28} 
                  color={activeCategory === category.id ? "#fff" : category.color} 
                />
              </View>
              <Text style={[
                styles.categoryName,
                activeCategory === category.id && styles.activeCategoryText
              ]}>
                {category.name}
              </Text>
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
              onPress={() =>
                navigation.navigate("ProductDetails", { product: item })
              }
            />
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="search-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>
              Aucun produit trouvé dans cette catégorie
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

/* ===================== STYLES ===================== */
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
  activeCategoryItem: { transform: [{ scale: 1.05 }] },
  categoryIcon: {
    width: CATEGORY_SIZE,
    height: CATEGORY_SIZE,
    borderRadius: CATEGORY_SIZE / 2,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  activeCategoryIcon: {
    backgroundColor: "#FF6B6B",
  },
  categoryName: { fontSize: 12, fontWeight: "600", color: "#333" },
  activeCategoryText: { color: "#FF6B6B", fontWeight: "700" },

  productColumn: { width: "50%", padding: 6 },
  
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
});