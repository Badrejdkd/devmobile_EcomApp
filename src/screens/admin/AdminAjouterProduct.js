import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { supabase } from "../../supabase/client";
import { Ionicons } from "@expo/vector-icons";

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
      Alert.alert("Champs requis", "Nom, prix et stock sont obligatoires");
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
          source: "admin",
          external_id: null,
          is_active: true,
          sold_count: 0,
        },
      ]);

      if (error) throw error;

      Alert.alert("✅ Succès", "Produit ajouté avec succès", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      Alert.alert("❌ Erreur", e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#4A5568" />
          </TouchableOpacity>
          <Text style={styles.title}>Nouveau Produit</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.formContainer}>
          {/* Input Sections */}
          <View style={styles.inputSection}>
            <Text style={styles.sectionLabel}>Informations de base</Text>
            
            <View style={styles.inputWrapper}>
              <Ionicons name="pricetag-outline" size={20} color="#718096" style={styles.inputIcon} />
              <TextInput
                placeholder="Nom du produit *"
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholderTextColor="#A0AEC0"
              />
            </View>

            <View style={[styles.inputWrapper, { height: 100 }]}>
              <Ionicons name="document-text-outline" size={20} color="#718096" style={styles.inputIcon} />
              <TextInput
                placeholder="Description"
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                placeholderTextColor="#A0AEC0"
              />
            </View>
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.sectionLabel}>Détails du produit</Text>
            
            <View style={styles.row}>
              <View style={[styles.inputWrapper, { flex: 1, marginRight: 10 }]}>
                <Ionicons name="cash-outline" size={20} color="#718096" style={styles.inputIcon} />
                <TextInput
                  placeholder="Prix (DH) *"
                  style={styles.input}
                  keyboardType="numeric"
                  value={price}
                  onChangeText={setPrice}
                  placeholderTextColor="#A0AEC0"
                />
                <Text style={styles.currency}>DH</Text>
              </View>

              <View style={[styles.inputWrapper, { flex: 1 }]}>
                <Ionicons name="cube-outline" size={20} color="#718096" style={styles.inputIcon} />
                <TextInput
                  placeholder="Stock *"
                  style={styles.input}
                  keyboardType="numeric"
                  value={stock}
                  onChangeText={setStock}
                  placeholderTextColor="#A0AEC0"
                />
              </View>
            </View>

            <View style={styles.inputWrapper}>
              <Ionicons name="grid-outline" size={20} color="#718096" style={styles.inputIcon} />
              <TextInput
                placeholder="Catégorie (ex: electronics, fashion...)"
                style={styles.input}
                value={category}
                onChangeText={setCategory}
                placeholderTextColor="#A0AEC0"
              />
            </View>
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.sectionLabel}>Image du produit</Text>
            
            <View style={styles.inputWrapper}>
              <Ionicons name="image-outline" size={20} color="#718096" style={styles.inputIcon} />
              <TextInput
                placeholder="URL de l'image (optionnel)"
                style={styles.input}
                value={imageUrl}
                onChangeText={setImageUrl}
                placeholderTextColor="#A0AEC0"
              />
            </View>
            
            {imageUrl ? (
              <View style={styles.imagePreview}>
                <Ionicons name="checkmark-circle" size={20} color="#38A169" />
                <Text style={styles.previewText}>URL image valide</Text>
              </View>
            ) : null}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={addProduct}
            disabled={loading}
            activeOpacity={0.9}
          >
            <Ionicons 
              name={loading ? "time-outline" : "add-circle-outline"} 
              size={22} 
              color="#FFF" 
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>
              {loading ? "Ajout en cours..." : "Ajouter le produit"}
            </Text>
          </TouchableOpacity>

          {/* Info Text */}
          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={18} color="#4A5568" />
            <Text style={styles.infoText}>
              Les champs marqués d'un * sont obligatoires
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 20,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F7FAFC",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2D3748",
    letterSpacing: -0.5,
  },
  formContainer: {
    padding: 20,
  },
  inputSection: {
    marginBottom: 24,
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#EDF2F7",
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D3748",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EDF2F7",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    marginBottom: 12,
    paddingHorizontal: 14,
    height: 52,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#2D3748",
    height: "100%",
  },
  textArea: {
    height: 80,
    paddingTop: 14,
  },
  currency: {
    fontSize: 14,
    fontWeight: "600",
    color: "#718096",
    marginLeft: 8,
  },
  row: {
    flexDirection: "row",
    marginBottom: 12,
  },
  imagePreview: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FFF4",
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#C6F6D5",
  },
  previewText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#276749",
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#4C6FFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 10,
    shadowColor: "#4C6FFF",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: "#A0B4FF",
    shadowOpacity: 0,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 0.3,
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    padding: 14,
    backgroundColor: "#EDF2F7",
    borderRadius: 10,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 13,
    color: "#4A5568",
    fontStyle: "italic",
  },
});