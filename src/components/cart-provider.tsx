"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { CartItem, Product } from "@/types/commerce";
import { seedProducts } from "@/data/seed-products";

interface CartContextValue {
  items: CartItem[];
  addToCart: (product: Product) => void;
  buyNow: (product: Product) => void;
  increaseQty: (productId: string) => void;
  decreaseQty: (productId: string) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem("cartItems");
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as CartItem[];
      // Hydrate imageUrl for items saved before the field was added
      const hydrated = parsed.map((item) => {
        if (item.imageUrl) return item;
        const seed = seedProducts.find((p) => p.id === item.productId);
        return seed ? { ...item, imageUrl: seed.imageUrl } : item;
      });
      setItems(hydrated);
    } catch {
      setItems([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          imageUrl: product.imageUrl
        }
      ];
    });
  };

  const buyNow = (product: Product) => {
    setItems([
      {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        imageUrl: product.imageUrl
      }
    ]);
  };

  const increaseQty = (productId: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQty = (productId: string) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  const clearCart = () => setItems([]);

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      addToCart,
      buyNow,
      increaseQty,
      decreaseQty,
      removeItem,
      clearCart,
      itemCount,
      subtotal
    }),
    [items, itemCount, subtotal]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}

