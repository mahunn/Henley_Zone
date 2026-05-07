"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { CartItem, Product } from "@/types/commerce";
import { seedProducts } from "@/data/seed-products";

interface CartContextValue {
  items: CartItem[];
  addToCart: (
    product: Product,
    opts?: { selectedColor?: string; selectedSize?: string }
  ) => void;
  buyNow: (
    product: Product,
    opts?: { selectedColor?: string; selectedSize?: string }
  ) => void;
  increaseQty: (itemKey: string) => void;
  decreaseQty: (itemKey: string) => void;
  removeItem: (itemKey: string) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  function makeItemKey(productId: string, selectedColor?: string, selectedSize?: string) {
    return `${productId}::${selectedColor ?? "-"}::${selectedSize ?? "-"}`;
  }

  useEffect(() => {
    const raw = localStorage.getItem("cartItems");
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as CartItem[];
      // Hydrate imageUrl for items saved before the field was added
      const hydrated = parsed.map((item) => {
        const normalizedColor = item.selectedColor ?? undefined;
        const normalizedSize = item.selectedSize ?? undefined;
        const hydratedKey =
          item.key ?? makeItemKey(item.productId, normalizedColor, normalizedSize);
        if (item.imageUrl) {
          return {
            ...item,
            key: hydratedKey,
            selectedColor: normalizedColor,
            selectedSize: normalizedSize
          };
        }
        const seed = seedProducts.find((p) => p.id === item.productId);
        if (seed) {
          return {
            ...item,
            key: hydratedKey,
            selectedColor: normalizedColor,
            selectedSize: normalizedSize,
            imageUrl: seed.imageUrl
          };
        }
        return {
          ...item,
          key: hydratedKey,
          selectedColor: normalizedColor,
          selectedSize: normalizedSize
        };
      });
      setItems(hydrated);
    } catch {
      setItems([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(items));
  }, [items]);

  const addToCart = (
    product: Product,
    opts?: { selectedColor?: string; selectedSize?: string }
  ) => {
    const selectedColor = opts?.selectedColor?.trim() || undefined;
    const selectedSize = opts?.selectedSize?.trim() || undefined;
    const itemKey = makeItemKey(product.id, selectedColor, selectedSize);
    setItems((prev) => {
      const existing = prev.find((item) => item.key === itemKey);
      if (existing) {
        return prev.map((item) =>
          item.key === itemKey
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          key: itemKey,
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          imageUrl: product.imageUrl,
          selectedColor,
          selectedSize
        }
      ];
    });
  };

  const buyNow = (
    product: Product,
    opts?: { selectedColor?: string; selectedSize?: string }
  ) => {
    const selectedColor = opts?.selectedColor?.trim() || undefined;
    const selectedSize = opts?.selectedSize?.trim() || undefined;
    setItems([
      {
        key: makeItemKey(product.id, selectedColor, selectedSize),
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        imageUrl: product.imageUrl,
        selectedColor,
        selectedSize
      }
    ]);
  };

  const increaseQty = (itemKey: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.key === itemKey
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQty = (itemKey: string) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item.key === itemKey
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (itemKey: string) => {
    setItems((prev) => prev.filter((item) => item.key !== itemKey));
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

