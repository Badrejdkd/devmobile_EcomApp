import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Animated,
  Share,
  Alert,
  Platform,
  StatusBar
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AppButton from '../components/AppButton';   // ⭐ Ajouté
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');
const IMAGE_HEIGHT = width * 0.8;

export default function ProductDetailsScreen({ route, navigation }) {
  const { product } = route.params;

  // ⭐ Normalisation pour éviter toutes les erreurs
  const normalizedProduct = {
    id: product.id,
    name: product.name || product.title,
    price: product.price,
    image: product.image_url || product.image,
    description: product.description || "Aucune description disponible."
  };

  const { addToCart } = useCart();
  const { session } = useAuth();

  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [liked, setLiked] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const productImages = [
    normalizedProduct.image,
    normalizedProduct.image,
    normalizedProduct.image,
  ];

  // Animation header
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100, 200],
    outputRange: [0, 0.5, 1],
    extrapolate: 'clamp',
  });

  const handleAddToCart = () => {
    if (!session) {
      return Alert.alert(
        "Connexion requise",
        "Veuillez vous connecter.",
        [
          { text: "Annuler", style: "cancel" },
          { text: "Se connecter", onPress: () => navigation.navigate("Login") }
        ]
      );
    }

    addToCart(normalizedProduct, selectedQuantity);

    Alert.alert(
      "Ajouté au panier !",
      `${normalizedProduct.name} a été ajouté.`,
      [
        { text: "Continuer" },
        { text: "Voir le panier", onPress: () => navigation.navigate("Cart") }
      ]
    );
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Découvrez ${normalizedProduct.name} - ${normalizedProduct.price} DH`,
        url: normalizedProduct.image,
      });
    } catch {
      Alert.alert("Erreur", "Impossible de partager.");
    }
  };

  const handleQuantityChange = (type) => {
    if (type === "increase" && selectedQuantity < 99)
      setSelectedQuantity(prev => prev + 1);
    if (type === "decrease" && selectedQuantity > 1)
      setSelectedQuantity(prev => prev - 1);
  };

  /* -------------------- HEADER -------------------- */
  const renderHeader = () => (
    <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
      <TouchableOpacity
        style={styles.headerButton}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-back" size={24} color="#FFF" />
      </TouchableOpacity>

      <Text style={styles.headerTitle} numberOfLines={1}>
        {normalizedProduct.name}
      </Text>

      <View style={styles.headerRight}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => setLiked(!liked)}
        >
          <Icon
            name={liked ? "heart" : "heart-outline"}
            size={24}
            color={liked ? "#FF6B6B" : "#FFF"}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.headerButton}
          onPress={handleShare}
        >
          <Icon name="share-outline" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  /* -------------------- CAROUSEL -------------------- */
  const renderImageCarousel = () => (
    <View style={styles.imageContainer}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setActiveImageIndex(index);
        }}
        scrollEventThrottle={16}
      >
        {productImages.map((image, index) => (
          <View key={index} style={styles.imageWrapper}>
            <Image source={{ uri: image }} style={styles.productImage} resizeMode="contain" />
          </View>
        ))}
      </ScrollView>

      <View style={styles.pagination}>
        {productImages.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              activeImageIndex === index && styles.paginationDotActive
            ]}
          />
        ))}
      </View>
    </View>
  );

  /* -------------------- INFO PRODUIT -------------------- */
  const renderProductInfo = () => (
    <View style={styles.infoContainer}>
      <View style={styles.titleRow}>
        <Text style={styles.productName}>{normalizedProduct.name}</Text>

        <TouchableOpacity onPress={() => setLiked(!liked)}>
          <Icon
            name={liked ? "heart" : "heart-outline"}
            size={28}
            color={liked ? "#FF6B6B" : "#666"}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.price}>{normalizedProduct.price} DH</Text>

      <Text style={styles.sectionTitle}>Quantité</Text>
      <View style={styles.quantitySelector}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => handleQuantityChange("decrease")}
        >
          <Icon name="remove" size={20} color="#666" />
        </TouchableOpacity>

        <Text style={styles.quantityText}>{selectedQuantity}</Text>

        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => handleQuantityChange("increase")}
        >
          <Icon name="add" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Description</Text>
      <Text style={styles.descriptionText}>
        {normalizedProduct.description}
      </Text>
    </View>
  );

  /* -------------------- RENDER -------------------- */
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />

      {renderHeader()}

      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        showsVerticalScrollIndicator={false}
      >
        {renderImageCarousel()}
        {renderProductInfo()}

        {/* ⭐ Ton bouton AppButton */}
        <View style={{ padding: 20 }}>
          <AppButton
  title="Ajouter au panier"
  onPress={() => {
    addToCart(normalizedProduct);

    Alert.alert(
      "Succès 🎉",
      `${normalizedProduct.name} a été ajouté au panier avec succès !`,
      [
        { text: "Continuer mes achats", style: "cancel" },
        { text: "Voir le panier", onPress: () => navigation.navigate("MainTabs", { screen: "Cart" }) }
      ]
    );
  }}
/>
        </View>

        <View style={{ height: 40 }} />
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

/* -------------------- STYLES -------------------- */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },

  header: {
    position: "absolute",
    top: Platform.OS === "ios" ? 40 : StatusBar.currentHeight,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: "rgba(0,0,0,0.4)",
    zIndex: 100,
    alignItems: "center",
  },
  headerButton: {
    width: 40,
    height: 40,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    flex: 1,
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },

  imageContainer: {
    height: IMAGE_HEIGHT,
    backgroundColor: "#F5F5F5",
  },
  imageWrapper: {
    width,
    height: IMAGE_HEIGHT,
  },
  productImage: {
    width: "100%",
    height: "100%",
  },

  pagination: {
    position: "absolute",
    bottom: 12,
    flexDirection: "row",
    alignSelf: "center",
  },
  paginationDot: {
    width: 8,
    height: 8,
    backgroundColor: "rgba(255,255,255,0.5)",
    borderRadius: 4,
    marginHorizontal: 3,
  },
  paginationDotActive: {
    width: 20,
    backgroundColor: "#FF6B6B",
  },

  infoContainer: { padding: 20 },
  titleRow: { flexDirection: "row", justifyContent: "space-between" },
  productName: { fontSize: 24, fontWeight: "700", flex: 1 },

  price: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FF6B6B",
    marginVertical: 10,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 20,
    marginBottom: 10,
  },

  quantitySelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFEFEF",
    width: 140,
    padding: 8,
    borderRadius: 12,
  },
  quantityButton: {
    width: 40,
    height: 40,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: "600",
    width: 40,
    textAlign: "center",
  },

  descriptionText: {
    color: "#666",
    fontSize: 15,
    lineHeight: 22,
  },
});
