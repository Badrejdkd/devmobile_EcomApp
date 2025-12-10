export const fetchProducts = async () => {
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    return await response.json();
  } catch (error) {
    console.log("API Error:", error);
    throw error;
  }
};

export const fetchProductById = async (id) => {
  try {
    const response = await fetch(`https://fakestoreapi.com/products/${id}`);
    return await response.json();
  } catch (error) {
    throw error;
  }
};
