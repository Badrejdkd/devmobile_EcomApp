import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { supabase } from "../../supabase/client";

export default function AdminEditProductScreen({ route, navigation }) {
  const { product } = route.params;

  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(String(product.price));
  const [stock, setStock] = useState(String(product.stock ?? 0));
  const [imageUrl, setImageUrl] = useState(product.image_url || "");
  const [category, setCategory] = useState(product.category || "other");
  const [loading, setLoading] = useState(false);

  /* ================= UPDATE PRODUCT ================= */
  const handleUpdate = async () => {
    if (!name || !price) {
      Alert.alert("Erreur", "Nom et prix sont obligatoires");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase
        .from("products")
        .update({
          name,
          price: Number(price),
          stock: Number(stock),
          image_url: imageUrl,
          category,
        })
        .eq("id", product.id);

      if (error) throw error;

      Alert.alert("Succès", "Produit mis à jour avec succès");
      navigation.goBack();
    } catch (e) {
      Alert.alert("Erreur", e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>✏️ Modifier le produit</Text>

      <Text style={styles.label}>Nom</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Prix (DH)</Text>
      <TextInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Stock</Text>
      <TextInput
        style={styles.input}
        value={stock}
        onChangeText={setStock}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Image URL</Text>
      <TextInput
        style={styles.input}
        value={imageUrl}
        onChangeText={setImageUrl}
      />

      <Text style={styles.label}>Catégorie</Text>
      <TextInput
        style={styles.input}
        value={category}
        onChangeText={setCategory}
      />

      <TouchableOpacity
        style={[
          styles.saveButton,
          loading && { backgroundColor: "#FFB8B8" },
        ]}
        onPress={handleUpdate}
        disabled={loading}
      >
        <Text style={styles.saveText}>
          {loading ? "Enregistrement..." : "💾 Sauvegarder"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6FA",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 20,
    color: "#1E1E2E",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    color: "#555",
  },
  input: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    fontSize: 15,
    elevation: 2,
  },
  saveButton: {
    backgroundColor: "#FF6B6B",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
  },
  saveText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
