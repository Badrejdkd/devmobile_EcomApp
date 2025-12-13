import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { supabase } from "../../supabase/client";

export default function AdminProductsScreen({ navigation }) {
  const [products, setProducts] = useState([]);

  const loadProducts = async () => {
    const { data } = await supabase.from("products").select("*");
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
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => navigation.navigate("AdminAddProduct")}
      >
        <Text style={styles.addText}>➕ Ajouter produit</Text>
      </TouchableOpacity>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>

            <View style={styles.actions}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("AdminEditProduct", { product: item })
                }
              >
                <Text style={styles.edit}>✏️</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => deleteProduct(item.id)}>
                <Text style={styles.delete}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  addBtn: {
    backgroundColor: "#28C76F",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  addText: { color: "#FFF", fontWeight: "700", textAlign: "center" },
  card: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  name: { fontWeight: "700" },
  actions: { flexDirection: "row", gap: 15 },
  edit: { fontSize: 18 },
  delete: { fontSize: 18, color: "red" },
});
