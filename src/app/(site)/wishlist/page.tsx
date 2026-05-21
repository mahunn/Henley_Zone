"use client";

import Link from "next/link";
import { useWishlist } from "@/components/wishlist-provider";
import { formatCurrency } from "@/lib/money";
import { defaultBusiness } from "@/config/businesses";

export default function WishlistPage() {
  const { items, removeFromWishlist } = useWishlist();

  return (
    <div className="container cart-page-wrap">
      <nav className="cart-breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span>›</span>
        <span style={{ color: "var(--color-text-primary)", fontWeight: 500 }}>Wishlist</span>
      </nav>

      <h1 className="cart-page-title">
        Wishlist
        {items.length > 0 && (
          <span className="cart-page-count">
            ({items.length} {items.length === 1 ? "item" : "items"})
          </span>
        )}
      </h1>

      {items.length === 0 ? (
        <div className="cart-empty-state">
          <svg
            width="56"
            height="56"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ margin: "0 auto 16px" }}
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <h2
            style={{
              fontFamily: "var(--font-heading, serif)",
              fontSize: "1.25rem",
              marginBottom: 8,
              color: "var(--color-text-primary)"
            }}
          >
            Your wishlist is empty
          </h2>
          <p style={{ color: "var(--color-text-secondary)", fontSize: 14, marginBottom: 24, fontFamily: "var(--font-body, sans-serif)" }}>
            Tap the heart on any product to save it here.
          </p>
          <Link href="/store" className="btn">
            Continue shopping →
          </Link>
        </div>
      ) : (
        <div className="cart-items-panel" style={{ maxWidth: 720 }}>
          {items.map((item) => (
            <div key={item.key} className="cart-item" style={{ gridTemplateColumns: "84px 1fr auto", alignItems: "center" }}>
              <a href={`/product/${item.slug}`}>
                <img src={item.imageUrl} alt="" className="cart-item-img" />
              </a>
              <div style={{ minWidth: 0 }}>
                <a href={`/product/${item.slug}`} className="cart-item-name" style={{ textDecoration: "none", display: "block" }}>
                  {item.name}
                </a>
                <div className="cart-item-unit-price" style={{ marginBottom: 6 }}>
                  {item.category}
                </div>
                <span className="cart-item-subtotal">{formatCurrency(item.price, defaultBusiness.currency)}</span>
              </div>
              <button type="button" className="btn-outline" style={{ fontSize: 12, padding: "6px 12px" }} onClick={() => removeFromWishlist(item.key)}>
                Remove
              </button>
            </div>
          ))}
          <p style={{ marginTop: 24 }}>
            <Link href="/store" className="btn">
              Continue shopping →
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
