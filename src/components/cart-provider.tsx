"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { CartItem, Product } from "@/types/commerce";
import { seedProducts } from "@/data/seed-products";
import { trackAddToCart, trackMetaEvent } from "@/lib/meta-pixel";

interface CartContextValue {
  items: CartItem[];
  addToCart: (
    product: Product,
    opts?: { selectedColor?: string; selectedSize?: string }
  ) => void;
  addCartItems: (newItems: CartItem[]) => void;
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

  const addCartItems = (newItems: CartItem[]) => {
    if (!newItems || newItems.length === 0) return;
    setItems((prev) => {
      const updated = [...prev];
      for (const newItem of newItems) {
        const itemKey =
          newItem.key ||
          makeItemKey(
            newItem.productId,
            newItem.selectedColor,
            newItem.selectedSize
          );
        const existingIndex = updated.findIndex((item) => item.key === itemKey);
        if (existingIndex !== -1) {
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + (newItem.quantity || 1)
          };
        } else {
          updated.push({
            ...newItem,
            key: itemKey
          });
        }
      }
      return updated;
    });
  };

  const buyNow = (
    product: Product,
    opts?: { selectedColor?: string; selectedSize?: string }
  ) => {
    const selectedColor = opts?.selectedColor?.trim() || undefined;
    const selectedSize = opts?.selectedSize?.trim() || undefined;
    const itemKey = makeItemKey(product.id, selectedColor, selectedSize);

    setItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.key === itemKey);
      if (existingIndex !== -1) {
        return prev;
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
      addCartItems,
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


