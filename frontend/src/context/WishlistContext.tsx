'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WishlistItem {
  _id: string;
  title: string;
  price: number;
  image: string;
  brand: string;
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  toggleWishlist: (item: WishlistItem) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('wearixaWishlist');
    if (stored) setWishlistItems(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('wearixaWishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addToWishlist = (item: WishlistItem) => {
    if (!wishlistItems.find((i) => i._id === item._id)) {
      setWishlistItems([...wishlistItems, item]);
    }
  };

  const removeFromWishlist = (id: string) => {
    setWishlistItems(wishlistItems.filter((i) => i._id !== id));
  };

  const isInWishlist = (id: string) => wishlistItems.some((i) => i._id === id);

  const toggleWishlist = (item: WishlistItem) => {
    if (isInWishlist(item._id)) {
      removeFromWishlist(item._id);
    } else {
      addToWishlist(item);
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
};
