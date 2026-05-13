'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
  _id: string;
  title: string;
  price: number;
  image: string;
  qty: number;
  stock: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQty: () => {},
  clearCart: () => {},
  totalItems: 0,
  totalPrice: 0,
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('wearixaCart');
      if (stored) setCartItems(JSON.parse(stored));
    }
  }, []);

  const saveToStorage = (items: CartItem[]) => {
    localStorage.setItem('wearixaCart', JSON.stringify(items));
  };

  const addToCart = (item: CartItem) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i._id === item._id);
      let updated: CartItem[];
      if (existing) {
        updated = prev.map((i) =>
          i._id === item._id
            ? { ...i, qty: Math.min(i.qty + item.qty, i.stock) }
            : i
        );
      } else {
        updated = [...prev, item];
      }
      saveToStorage(updated);
      return updated;
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => {
      const updated = prev.filter((i) => i._id !== id);
      saveToStorage(updated);
      return updated;
    });
  };

  const updateQty = (id: string, qty: number) => {
    setCartItems((prev) => {
      const updated = prev.map((i) => (i._id === id ? { ...i, qty } : i));
      saveToStorage(updated);
      return updated;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('wearixaCart');
  };

  const totalItems = cartItems.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQty, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
