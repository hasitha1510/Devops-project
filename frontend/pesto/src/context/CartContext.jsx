import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("pestoCart");
    return saved ? JSON.parse(saved) : [];
  });

  function saveCart(newCart) {
    setCart(newCart);
    localStorage.setItem("pestoCart", JSON.stringify(newCart));
  }

  function addToCart(item) {
    const existing = cart.find(i => i.name === item.name);
    let newCart;
    if (existing) {
      newCart = cart.map(i =>
        i.name === item.name ? { ...i, qty: i.qty + 1 } : i
      );
    } else {
      newCart = [...cart, { ...item, qty: 1 }];
    }
    saveCart(newCart);
  }

  function updateQty(name, change) {
    const newCart = cart
      .map(i => i.name === name ? { ...i, qty: i.qty + change } : i)
      .filter(i => i.qty > 0);
    saveCart(newCart);
  }

  function removeItem(name) {
    saveCart(cart.filter(i => i.name !== name));
  }

  function clearCart() {
    saveCart([]);
  }

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQty, removeItem, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}