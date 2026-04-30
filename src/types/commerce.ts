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
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
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

