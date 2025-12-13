import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";
import { supabase } from "../../supabase/client";

export default function AdminAddProductScreen({ navigation }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const addProduct = async () => {
    await supabase.from("products").insert([
      { name, price: Number(price) }
    ]);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Nom" style={styles.input} onChangeText={setName} />
      <TextInput
        placeholder="Prix"
        style={styles.input}
        keyboardType="numeric"
        onChangeText={setPrice}
      />
      <Button title="Ajouter" onPress={addProduct} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
  },
});
