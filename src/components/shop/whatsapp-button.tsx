"use client";

import Link from "next/link";
import { useCart } from "@/components/cart-provider";

export function FloatingCartButton() {
  const { itemCount } = useCart();

  return (
    <Link
      href="/cart"
      className="whatsapp-float"
      aria-label={`Open cart${itemCount > 0 ? ` (${itemCount})` : ""}`}
      title={`Cart${itemCount > 0 ? ` (${itemCount})` : ""}`}
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.7 12.5a2 2 0 0 0 2 1.6h9.5a2 2 0 0 0 2-1.6L23 6H6" />
      </svg>
      {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
    </Link>
  );
}
