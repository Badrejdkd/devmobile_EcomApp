import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useAuth } from "../context/AuthContext";
import * as ImagePicker from "expo-image-picker";

export default function ProfileScreen({ navigation }) {
  const { session, logout } = useAuth();
  const [avatarUri, setAvatarUri] = useState(null);

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    Alert.alert(
      "Déconnexion",
      "Êtes-vous sûr de vouloir vous déconnecter ?",
      [
        { text: "Annuler", style: "cancel" },
        { text: "Déconnexion", style: "destructive", onPress: logout },
      ]
    );
  };

  /* ================= IMAGE PICKER ================= */
  

  const pickImageFromGallery = async () => {
    const { status } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permission refusée", "Accès à la galerie refusé");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri);
      Alert.alert("Succès", "Photo de profil mise à jour");
    }
  };

  const takePhotoWithCamera = async () => {
    const { status } =
      await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permission refusée", "Accès à la caméra refusé");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri);
      Alert.alert("Succès", "Photo de profil mise à jour");
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      "Photo de profil",
      "Choisissez une option",
      [
        { text: "Prendre une photo", onPress: takePhotoWithCamera },
        { text: "Choisir depuis la galerie", onPress: pickImageFromGallery },
        avatarUri && {
          text: "Supprimer la photo",
          style: "destructive",
          onPress: () => setAvatarUri(null),
        },
        { text: "Annuler", style: "cancel" },
      ].filter(Boolean)
    );
  };

  /* ================= UI ================= */

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mon Profil</Text>
        <TouchableOpacity>
          <Icon name="notifications-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* PROFILE */}
        <View style={styles.profileSection}>
          <TouchableOpacity
            style={styles.avatar}
            onPress={showImageOptions}
          >
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
            ) : (
              <Icon name="person" size={40} color="#FFF" />
            )}
          </TouchableOpacity>

          <Text style={styles.userName}>
            {session?.user?.email?.split("@")[0]}
          </Text>
          <Text style={styles.userEmail}>{session?.user?.email}</Text>

          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={() =>
              Alert.alert("Info", "Modification du profil bientôt disponible")
            }
          >
            <Icon name="create-outline" size={18} color="#FF6B6B" />
            <Text style={styles.editProfileText}>Modifier le profil</Text>
          </TouchableOpacity>
        </View>

        {/* MENU */}
        <View style={styles.menu}>
          <MenuItem
            icon="receipt-outline"
            text="Mes commandes"
            onPress={() => navigation.navigate("Orders")}
          />
          <MenuItem
            icon="settings-outline"
            text="Paramètres"
            onPress={() => Alert.alert("Paramètres", "À venir")}
          />
          <MenuItem
            icon="help-circle-outline"
            text="Centre d’aide"
            onPress={() => Alert.alert("Aide", "Support à venir")}
          />
        </View>

        {/* LOGOUT */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="log-out-outline" size={22} color="#FF6B6B" />
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>ShopPro v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ================= MENU ITEM ================= */

const MenuItem = ({ icon, text, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <Icon name={icon} size={22} color="#555" />
    <Text style={styles.menuText}>{text}</Text>
    <Icon name="chevron-forward" size={18} color="#CCC" />
  </TouchableOpacity>
);

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "#FFF",
  },
  headerTitle: { fontSize: 24, fontWeight: "800" },

  profileSection: {
    alignItems: "center",
    backgroundColor: "#FFF",
    paddingVertical: 30,
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#FF6B6B",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarImage: { width: "100%", height: "100%", borderRadius: 50 },
  userName: { fontSize: 22, fontWeight: "700" },
  userEmail: { fontSize: 16, color: "#666", marginBottom: 16 },

  editProfileButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF5F5",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  editProfileText: { marginLeft: 8, color: "#FF6B6B", fontWeight: "600" },

  menu: {
    backgroundColor: "#FFF",
    marginHorizontal: 16,
    borderRadius: 16,
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  menuText: { flex: 1, marginLeft: 16, fontSize: 16 },

  logoutButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 16,
    backgroundColor: "#FFF",
    padding: 18,
    borderRadius: 16,
  },
  logoutText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#FF6B6B",
    fontWeight: "600",
  },

  footer: {
    textAlign: "center",
    color: "#999",
    marginVertical: 20,
  },
});
