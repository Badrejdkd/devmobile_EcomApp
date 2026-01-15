import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { supabase } from "../../supabase/client";
import Icon from "react-native-vector-icons/Ionicons";

export default function AdminUsersScreen() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD USERS ================= */
  const loadUsers = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, email, is_admin, created_at")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setUsers(data || []);
    } catch (e) {
      Alert.alert("Erreur", "Impossible de charger les utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  /* ================= TOGGLE ADMIN ================= */
  const toggleAdmin = async (user) => {
    Alert.alert(
      "Modifier rôle",
      user.is_admin
        ? "Retirer le rôle admin ?"
        : "Donner le rôle admin ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Confirmer",
          onPress: async () => {
            try {
              const { error } = await supabase
                .from("profiles")
                .update({ is_admin: !user.is_admin })
                .eq("id", user.id);

              if (error) throw error;

              loadUsers();
            } catch (e) {
              Alert.alert("Erreur", "Action impossible");
            }
          },
        },
      ]
    );
  };

  /* ================= UI ================= */
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View>
              <Text style={styles.name}>
                {item.full_name || "Utilisateur"}
              </Text>
              <Text style={styles.email}>{item.email}</Text>
              <Text style={styles.role}>
                Rôle :{" "}
                <Text style={{ fontWeight: "700" }}>
                  {item.is_admin ? "Admin" : "Client"}
                </Text>
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.roleBtn,
                { backgroundColor: item.is_admin ? "#FF6B6B" : "#4CAF50" },
              ]}
              onPress={() => toggleAdmin(item)}
            >
              <Icon
                name={item.is_admin ? "shield-off-outline" : "shield-checkmark-outline"}
                size={20}
                color="#FFF"
              />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6FA",
    padding: 16,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    elevation: 3,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  email: {
    fontSize: 13,
    color: "#666",
  },
  role: {
    marginTop: 6,
    fontSize: 13,
    color: "#333",
  },
  roleBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
  },
});
