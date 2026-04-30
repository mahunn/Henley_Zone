"use client";

import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { WishlistItem } from "@/types/commerce";

const STORAGE_KEY = "wishlistItems";

export function wishlistKey(productId: string, colorId?: string) {
  return `${productId}::${colorId ?? "default"}`;
}

interface WishlistContextValue {
  items: WishlistItem[];
  count: number;
  isWishlisted: (productId: string, colorId?: string) => boolean;
  toggleWishlist: (item: {
    productId: string;
    slug: string;
    name: string;
    price: number;
    imageUrl: string;
    category: string;
    colorId?: string;
  }) => void;
  removeFromWishlist: (key: string) => void;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as WishlistItem[];
      if (Array.isArray(parsed)) setItems(parsed);
    } catch {
      setItems([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const isWishlisted = useCallback(
    (productId: string, colorId?: string) =>
      items.some((i) => i.key === wishlistKey(productId, colorId)),
    [items]
  );

  const toggleWishlist = useCallback(
    (payload: {
      productId: string;
      slug: string;
      name: string;
      price: number;
      imageUrl: string;
      category: string;
      colorId?: string;
    }) => {
      const key = wishlistKey(payload.productId, payload.colorId);
      setItems((prev) => {
        const exists = prev.some((i) => i.key === key);
        if (exists) return prev.filter((i) => i.key !== key);
        const row: WishlistItem = {
          key,
          productId: payload.productId,
          slug: payload.slug,
          name: payload.name,
          price: payload.price,
          imageUrl: payload.imageUrl,
          category: payload.category,
          colorId: payload.colorId
        };
        return [...prev, row];
      });
    },
    []
  );

  const removeFromWishlist = useCallback((key: string) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const clearWishlist = useCallback(() => setItems([]), []);

  const count = items.length;

  const value = useMemo(
    () => ({
      items,
      count,
      isWishlisted,
      toggleWishlist,
      removeFromWishlist,
      clearWishlist
    }),
    [items, count, isWishlisted, toggleWishlist, removeFromWishlist, clearWishlist]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
