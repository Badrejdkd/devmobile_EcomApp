import { supabase } from "./client";
import { fetchProductsFromApi } from "../api/externalProductsApi";

export const importApiProductsToDb = async () => {
  const apiProducts = await fetchProductsFromApi();

  // Mapper API → DB
  const mapped = apiProducts.map((p) => ({
    name: p.title,
    price: p.price,
    image_url: p.image,
    category: p.category,
    description: p.description,
    source: "api",
  }));

  // Éviter les doublons
  const { data: existing } = await supabase
    .from("products")
    .select("name");

  const existingNames = existing?.map((p) => p.name) || [];

  const newProducts = mapped.filter(
    (p) => !existingNames.includes(p.name)
  );

  if (newProducts.length === 0) {
    return { inserted: 0 };
  }

  const { error } = await supabase
    .from("products")
    .insert(newProducts);

  if (error) throw error;

  return { inserted: newProducts.length };
};
