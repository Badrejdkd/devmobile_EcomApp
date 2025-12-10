import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]); // { product, quantity }

  const addToCart = (product, quantity = 1) => {
    if (!product || !product.id) {
      console.error('Produit invalide:', product);
      return;
    }

    setItems((prev) => {
      const existing = prev.find((i) => 
        i.product && i.product.id === product.id
      );

      if (existing) {
        return prev.map((i) =>
          i.product && i.product.id === product.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }

      return [...prev, { 
        product: {
          id: product.id,
          name: product.name || product.title || 'Produit sans nom',
          price: product.price || 0,
          image_url: product.image_url || product.image || null,
        }, 
        quantity: quantity 
      }];
    });
  };

  const removeFromCart = (productId) => {
    setItems((prev) => 
      prev.filter((i) => i.product && i.product.id !== productId)
    );
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }

    setItems(prev =>
      prev.map(item =>
        item.product && item.product.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearCart = () => setItems([]);

  // Calcul du total avec vérification de sécurité
  const total = items.reduce(
    (sum, i) => sum + ((i.product?.price || 0) * (i.quantity || 1)),
    0
  );

  return (
    <CartContext.Provider
      value={{ 
        items, 
        addToCart, 
        removeFromCart, 
        clearCart, 
        total,
        updateQuantity // Ajout de cette fonction
      }}
    >
      {children}
    </CartContext.Provider>
  );
};