import { supabase } from "./client";

/* ================== GET ALL PRODUCTS ================== */
export const getProducts = async () => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erreur getProducts:", error.message);
    throw error;
  }

  return data;
};

/* ================== GET PRODUCT BY ID ================== */
export const getProductById = async (id) => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Erreur getProductById:", error.message);
    throw error;
  }

  return data;
};

/* ================== ADMIN CRUD ================== */

// ➕ Ajouter produit
export const addProduct = async (product) => {
  const { error } = await supabase.from("products").insert(product);
  if (error) throw error;
};

// ✏️ Modifier produit
export const updateProduct = async (id, updates) => {
  const { error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", id);

  if (error) throw error;
};

// ❌ Supprimer produit
export const deleteProduct = async (id) => {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
};
