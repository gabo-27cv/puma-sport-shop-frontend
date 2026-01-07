import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  // Guardar carrito
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addItem = (product, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === product.id);
      if (existing) {
        return prev.map(p =>
          p.id === product.id
            ? { ...p, qty: p.qty + qty }
            : p
        );
      }
      return [...prev, { ...product, qty }];
    });
  };

  const removeItem = (id) => {
    setCart(prev => prev.filter(p => p.id !== id));
  };

  const updateQty = (id, qty) => {
    if (qty <= 0) return;
    setCart(prev =>
      prev.map(p =>
        p.id === id ? { ...p, qty } : p
      )
    );
  };

  const clearCart = () => setCart([]);

  const total = cart.reduce(
    (sum, p) => sum + p.precio * p.qty,
    0
  );

  return (
    <CartContext.Provider value={{
      cart,
      addItem,
      removeItem,
      updateQty,
      clearCart,
      total
    }}>
      {children}
    </CartContext.Provider>
  );
};
