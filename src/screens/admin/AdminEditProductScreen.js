import React, { useState } from "react";
import { View, TextInput, Button } from "react-native";
import { supabase } from "../../supabase/client";

export default function AdminEditProductScreen({ route, navigation }) {
  const { product } = route.params;
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(String(product.price));

  const updateProduct = async () => {
    await supabase
      .from("products")
      .update({ name, price: Number(price) })
      .eq("id", product.id);

    navigation.goBack();
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput value={name} onChangeText={setName} />
      <TextInput value={price} onChangeText={setPrice} keyboardType="numeric" />
      <Button title="Modifier" onPress={updateProduct} />
    </View>
  );
}
