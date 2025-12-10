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

const { width } = Dimensions.get("window");
const BANNER_HEIGHT = 200;
const CATEGORY_SIZE = 80;

export default function HomeScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]); // ⭐ Produits filtrés
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all"); // ⭐ catégorie active

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

  const load = async () => {
    try {
      const data = await fetchProducts();
      setProducts(data);
      setFilteredProducts(data); // ⭐ Initialise la liste filtrée
      setFeaturedProducts(data.slice(0, 4));
    } catch (error) {
      console.log("Erreur API:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  /* ⭐ CATEGORIES */
  const categories = [
    { id: "all", name: "Tout", icon: "grid-outline", color: "#000" },
    { id: "electronics", name: "Électronique", icon: "phone-portrait-outline", color: "#FF6B6B" },
    { id: "jewelery", name: "Bijoux", icon: "diamond-outline", color: "#C71585" },
    { id: "men's clothing", name: "Homme", icon: "man-outline", color: "#45B7D1" },
    { id: "women's clothing", name: "Femme", icon: "woman-outline", color: "#AA00FF" },
  ];

  /* ⭐ APPLY FILTER */
  const applyCategoryFilter = () => {
    if (activeCategory === "all") return setFilteredProducts(products);

    const filtered = products.filter((p) => p.category === activeCategory);
    setFilteredProducts(filtered);
  };

  /* ⭐ BANNIÈRES */
  const banners = [
    { id: 1, title: "Soldes Flash", subtitle: "Jusqu'à -70%", color: "#FF6B6B" },
    { id: 2, title: "Livraison Gratuite", subtitle: "Dès 30€", color: "#4ECDC4" },
    { id: 3, title: "Nouveautés", subtitle: "Découvrez maintenant", color: "#45B7D1" },
  ];

  const renderBanner = () => (
    <Animated.View style={[styles.bannerContainer, { height: headerHeight }]}>
      <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={styles.bannerScroll}>
        {banners.map((banner) => (
          <View key={banner.id} style={[styles.bannerItem, { backgroundColor: banner.color }]}>
            <View style={styles.bannerContent}>
              <Text style={styles.bannerTitle}>{banner.title}</Text>
              <Text style={styles.bannerSubtitle}>{banner.subtitle}</Text>
              <TouchableOpacity style={styles.bannerButton}>
                <Text style={styles.bannerButtonText}>Voir les offres</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.bannerDecoration}>
              <Icon name="flash-outline" size={60} color="rgba(255,255,255,0.2)" />
            </View>
          </View>
        ))}
      </ScrollView>
    </Animated.View>
  );

  /* ⭐ RENDER CATEGORIES */
  const renderCategories = () => (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Catégories</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[styles.categoryItem, activeCategory === category.id && styles.categoryActive]}
            onPress={() => setActiveCategory(category.id)}
          >
            <View style={[styles.categoryIcon, { backgroundColor: `${category.color}20` }]}>
              <Icon name={category.icon} size={28} color={category.color} />
            </View>
            <Text style={styles.categoryName}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  /* ⭐ PRODUITS */
  const renderFeatured = () => (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Produits en vedette</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.featuredContainer}>
        {featuredProducts.map((product) => (
          <TouchableOpacity
            key={product.id}
            style={styles.featuredProduct}
            onPress={() => navigation.navigate("ProductDetails", { product })}
          >
            <Image source={{ uri: product.image }} style={styles.featuredImage} />

            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-30%</Text>
            </View>

            <Text style={styles.featuredName} numberOfLines={2}>{product.title}</Text>
            <Text style={styles.featuredPrice}>€{product.price}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderHeader = () => (
    <View>
      {renderBanner()}
      {renderCategories()}
      {renderFeatured()}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
        <Text>Chargement...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Animated.FlatList
        data={filteredProducts} // ⭐ PRODUITS FILTRÉS
        numColumns={2}
        keyExtractor={(item) => String(item.id)}
        ListHeaderComponent={renderHeader}
        renderItem={({ item }) => (
          <View style={styles.productColumn}>
            <ProductCard
              product={{
                id: item.id,
                name: item.title,
                price: item.price,
                image_url: item.image,
              }}
              onPress={() => navigation.navigate("ProductDetails", { product: item })}
            />
          </View>
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#FF6B6B"]} />}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: false,
        })}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

/* --------------------------------- STYLES --------------------------------- */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },

  /* BANNERS */
  bannerContainer: { overflow: "hidden" },
  bannerScroll: { height: BANNER_HEIGHT },
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
  bannerSubtitle: { color: "#fff", opacity: 0.9, marginBottom: 10 },
  bannerButton: { backgroundColor: "#fff", paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20 },
  bannerButtonText: { color: "#FF6B6B", fontWeight: "600" },

  /* CATEGORIES */
  sectionContainer: { backgroundColor: "#fff", paddingVertical: 16 },
  sectionTitle: { fontSize: 20, fontWeight: "700", marginLeft: 16 },
  categoriesContainer: { paddingHorizontal: 16 },
  categoryItem: { alignItems: "center", marginRight: 20 },
  categoryActive: { transform: [{ scale: 1.05 }] },
  categoryIcon: {
    width: CATEGORY_SIZE,
    height: CATEGORY_SIZE,
    borderRadius: CATEGORY_SIZE / 2,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryName: { fontSize: 12, fontWeight: "600", color: "#333" },

  /* FEATURED */
  featuredContainer: { paddingHorizontal: 16 },
  featuredProduct: {
    width: 160,
    marginRight: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
  },
  featuredImage: { width: "100%", height: 120, borderRadius: 12, marginBottom: 8 },
  discountBadge: { position: "absolute", top: 6, right: 6, backgroundColor: "#FF6B6B", padding: 5, borderRadius: 50 },
  discountText: { color: "#fff", fontWeight: "bold" },

  /* PRODUCT GRID */
  productColumn: { width: "50%", padding: 6 },
});
