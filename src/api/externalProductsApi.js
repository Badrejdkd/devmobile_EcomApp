export const fetchProductsFromApi = async () => {
  const response = await fetch("https://fakestoreapi.com/products");

  if (!response.ok) {
    throw new Error("Erreur lors du chargement des produits API");
  }

  return await response.json();
};
