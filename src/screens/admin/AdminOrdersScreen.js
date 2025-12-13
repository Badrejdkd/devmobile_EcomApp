import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { supabase } from "../../supabase/client";

export default function AdminOrdersScreen() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => setOrders(data || []));
  }, []);

  return (
    <FlatList
      data={orders}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={{ padding: 15, borderBottomWidth: 1 }}>
          <Text>Commande #{item.id.slice(0, 8)}</Text>
          <Text>Total: {item.total_amount} DH</Text>
          <Text>Status: {item.status}</Text>
        </View>
      )}
    />
  );
}
