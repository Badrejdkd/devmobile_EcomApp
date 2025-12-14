import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { supabase } from "../../supabase/client";
import { importApiProductsToDb } from "../../supabase/productImportService";

export default function AdminProductsScreen({ navigation }) {
  const [products, setProducts] = useState([]);

  const loadProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    setProducts(data || []);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const deleteProduct = async (id) => {
    await supabase.from("products").delete().eq("id", id);
    loadProducts();
  };

  return (
    <View style={styles.container}>
      
      {/* IMPORT API */}
      <TouchableOpacity
        style={[styles.addBtn, { backgroundColor: "#1E88E5" }]}
        onPress={async () => {
          try {
            const result = await importApiProductsToDb();
            Alert.alert(
              "Import terminé",
              `${result.inserted} produits importés`
            );
            loadProducts();
          } catch (e) {
            Alert.alert("Erreur", e.message);
          }
        }}
      >
        <Text style={styles.addText}>⬇️ Importer produits API</Text>
      </TouchableOpacity>

      <FlatList
        data={products}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text>{item.price} DH</Text>

            <TouchableOpacity onPress={() => deleteProduct(item.id)}>
              <Text style={styles.delete}>🗑️</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  addBtn: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  addText: {
    color: "#FFF",
    fontWeight: "700",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  name: { fontWeight: "700", fontSize: 16 },
  delete: { color: "red", marginTop: 10 },
});
