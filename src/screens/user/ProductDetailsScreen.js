import React, { useState, useRef } from "react";
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
  StatusBar,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import AppButton from "../../components/AppButton";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

const { width } = Dimensions.get("window");
const IMAGE_HEIGHT = width * 0.8;

export default function ProductDetailsScreen({ route, navigation }) {
  const { product } = route.params;

  // 🔒 Normalisation produit
  const normalizedProduct = {
    id: product.id,
    name: product.name || product.title,
    price: product.price,
    image: product.image_url || product.image,
    description: product.description || "Aucune description disponible.",
  };

  const { addToCart } = useCart();
  const { session } = useAuth();

  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [liked, setLiked] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  const handleQuantityChange = (type) => {
    if (type === "increase" && selectedQuantity < 99)
      setSelectedQuantity((q) => q + 1);
    if (type === "decrease" && selectedQuantity > 1)
      setSelectedQuantity((q) => q - 1);
  };

  const handleAddToCart = () => {
    if (!session) {
      return Alert.alert(
        "Connexion requise",
        "Veuillez vous connecter.",
        [
          { text: "Annuler", style: "cancel" },
          { text: "Se connecter", onPress: () => navigation.navigate("Login") },
        ]
      );
    }

    // ⭐ ENVOI DE LA QUANTITÉ
    addToCart(normalizedProduct, selectedQuantity);

    Alert.alert(
      "Succès 🎉",
      `${normalizedProduct.name} ajouté (x${selectedQuantity})`,
      [
        { text: "Continuer mes achats", style: "cancel" },
        {
          text: "Voir le panier",
          onPress: () =>
            navigation.navigate("MainTabs", { screen: "Cart" }),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <Image
          source={{ uri: normalizedProduct.image }}
          style={styles.image}
          resizeMode="contain"
        />

        <View style={styles.info}>
          <Text style={styles.name}>{normalizedProduct.name}</Text>
          <Text style={styles.price}>{normalizedProduct.price} DH</Text>

          {/* Quantité */}
          <Text style={styles.sectionTitle}>Quantité</Text>
          <View style={styles.qtyRow}>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => handleQuantityChange("decrease")}
            >
              <Icon name="remove" size={20} />
            </TouchableOpacity>

            <Text style={styles.qtyText}>{selectedQuantity}</Text>

            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => handleQuantityChange("increase")}
            >
              <Icon name="add" size={20} />
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.desc}>{normalizedProduct.description}</Text>

          <AppButton title="Ajouter au panier" onPress={handleAddToCart} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  image: { width: "100%", height: IMAGE_HEIGHT, backgroundColor: "#F5F5F5" },
  info: { padding: 20 },
  name: { fontSize: 24, fontWeight: "700" },
  price: {
    fontSize: 26,
    fontWeight: "800",
    color: "#FF6B6B",
    marginVertical: 10,
  },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginTop: 20 },
  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  qtyBtn: {
    width: 40,
    height: 40,
    backgroundColor: "#EEE",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  qtyText: { fontSize: 18, fontWeight: "600", marginHorizontal: 20 },
  desc: { color: "#666", marginTop: 10, lineHeight: 22 },
});
