export interface ProductColor {
  id: string;
  label: string;
  image: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  category: string;
  colors?: ProductColor[];
  /** Display / checkout size options (e.g. 36, 38, M, L). */
  sizes?: string[];
}

export interface CartItem {
  key: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  selectedColor?: string;
  selectedSize?: string;
}

/** One saved wishlist row (variant = color option when applicable) */
export interface WishlistItem {
  key: string;
  productId: string;
  slug: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  colorId?: string;
}

export interface CheckoutFormData {
  customerName: string;
  phone: string;
  address: string;
  note?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: "COD";
  status: "pending" | "confirmed" | "delivered" | "cancelled";
  customerName: string;
  phone: string;
  address: string;
  note?: string;
  createdAt: string;
}

