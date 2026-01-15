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

export default function AdminAddProductScreen({ navigation }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= ADD PRODUCT ================= */
  const addProduct = async () => {
    if (!name || !price || !stock) {
      Alert.alert("Erreur", "Nom, prix et stock sont obligatoires");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.from("products").insert([
        {
          name,
          description,
          price: Number(price),
          stock: Number(stock),
          category: category || "other",
          image_url: imageUrl || null,
          source: "admin",          // 🔥 produit admin
          external_id: null,
          is_active: true,
          sold_count: 0,
        },
      ]);

      if (error) throw error;

      Alert.alert("Succès", "Produit ajouté avec succès");
      navigation.goBack();
    } catch (e) {
      Alert.alert("Erreur", e.message);
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>➕ Ajouter un produit</Text>

      <TextInput
        placeholder="Nom du produit"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <TextInput
        placeholder="Description"
        style={[styles.input, { height: 80 }]}
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <TextInput
        placeholder="Prix (DH)"
        style={styles.input}
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />

      <TextInput
        placeholder="Stock"
        style={styles.input}
        keyboardType="numeric"
        value={stock}
        onChangeText={setStock}
      />

      <TextInput
        placeholder="Catégorie (electronics, other...)"
        style={styles.input}
        value={category}
        onChangeText={setCategory}
      />

      <TextInput
        placeholder="Image URL"
        style={styles.input}
        value={imageUrl}
        onChangeText={setImageUrl}
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={addProduct}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Ajout en cours..." : "Ajouter le produit"}
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
  input: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#EEE",
    fontSize: 14,
  },
  button: {
    backgroundColor: "#FF6B6B",
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 10,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#FFB8B8",
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 16,
  },
});
