"use client";

import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { formatCurrency } from "@/lib/money";
import { defaultBusiness } from "@/config/businesses";
import { DELIVERY_FEE_INSIDE_DHAKA, DELIVERY_FEE_OUTSIDE_DHAKA } from "@/config/delivery";

function TrashIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

export default function CartPage() {
  const { items, increaseQty, decreaseQty, removeItem, subtotal, clearCart } = useCart();
  const totalMin = subtotal + (items.length > 0 ? DELIVERY_FEE_INSIDE_DHAKA : 0);
  const totalMax = subtotal + (items.length > 0 ? DELIVERY_FEE_OUTSIDE_DHAKA : 0);

  return (
    <div className="container cart-page-wrap">

      {/* Breadcrumb */}
      <nav className="cart-breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span>›</span>
        <span style={{ color: "var(--color-text-primary)", fontWeight: 500 }}>Cart</span>
      </nav>

      <h1 className="cart-page-title">
        Shopping Cart
        {items.length > 0 && (
          <span className="cart-page-count">
            ({items.length} {items.length === 1 ? "item" : "items"})
          </span>
        )}
      </h1>

      {/* ── Empty State ── */}
      {items.length === 0 ? (
        <div className="cart-empty-state">
          <svg
            width="60"
            height="60"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ margin: "0 auto 18px" }}
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          <h2 style={{ fontFamily: "var(--font-heading, serif)", fontSize: "1.3rem", marginBottom: 8, color: "var(--color-text-primary)" }}>
            Your cart is empty
          </h2>
          <p style={{ color: "var(--color-text-secondary)", fontSize: 14, marginBottom: 28, fontFamily: "var(--font-body, sans-serif)" }}>
            Looks like you haven&apos;t added anything yet.
          </p>
          <Link href="/store" className="btn">Browse Products →</Link>
        </div>
      ) : (
        <div className="cart-layout">

          {/* ── Left: Items + Actions + Coupon ── */}
          <div>
            <div className="cart-items-panel">
              {items.map((item) => {
                // Inline SVG — works offline, no external request needed
                const initials = item.name.slice(0, 2).toUpperCase();
                const fallbackSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='84' height='100'%3E%3Crect width='84' height='100' rx='8' fill='%23e0f2fe'/%3E%3Ctext x='42' y='57' text-anchor='middle' font-family='sans-serif' font-size='18' font-weight='700' fill='%230284c7'%3E${encodeURIComponent(initials)}%3C/text%3E%3C/svg%3E`;

                return (
                  <div key={item.key} className="cart-item">
                    {/* Thumbnail */}
                    <img
                      src={item.imageUrl ?? fallbackSvg}
                      alt={item.name}
                      className="cart-item-img"
                      onError={(e) => { (e.target as HTMLImageElement).src = fallbackSvg; }}
                    />

                    {/* Info */}
                    <div>
                      <div className="cart-item-name">{item.name}</div>
                      {(item.selectedColor || item.selectedSize) && (
                        <div className="cart-item-unit-price" style={{ marginBottom: 4 }}>
                          {item.selectedColor ? `Color: ${item.selectedColor}` : ""}
                          {item.selectedColor && item.selectedSize ? " · " : ""}
                          {item.selectedSize ? `Size: ${item.selectedSize}` : ""}
                        </div>
                      )}
                      <div className="cart-item-unit-price">
                        Unit: {formatCurrency(item.price, defaultBusiness.currency)}
                      </div>

                      <div className="cart-item-footer">
                        {/* Quantity stepper */}
                        <div className="qty-stepper">
                          <button
                            className="qty-btn"
                            onClick={() => decreaseQty(item.key)}
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <div className="qty-display">{item.quantity}</div>
                          <button
                            className="qty-btn"
                            onClick={() => increaseQty(item.key)}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        {/* Line total + remove */}
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <span className="cart-item-subtotal">
                            {formatCurrency(item.price * item.quantity, defaultBusiness.currency)}
                          </span>
                          <button
                            className="cart-remove-btn"
                            onClick={() => removeItem(item.key)}
                            aria-label={`Remove ${item.name}`}
                            title="Remove item"
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Cart actions */}
            <div className="cart-actions-row">
              <Link href="/store" className="btn btn-secondary" style={{ fontSize: 13.5 }}>
                ← Continue Shopping
              </Link>
              <button
                onClick={() => {
                  if (window.confirm("Are you sure you want to clear all items from cart?")) {
                    clearCart();
                  }
                }}
                style={{
                  background: "none",
                  border: "1.5px solid #fecaca",
                  color: "#dc2626",
                  padding: "9px 16px",
                  borderRadius: 8,
                  fontSize: 13.5,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "var(--font-body, sans-serif)",
                  transition: "background 0.18s"
                }}
              >
                Clear Cart
              </button>
            </div>

            {/* Coupon */}
            <div className="coupon-wrap">
              <p className="coupon-label">Promo Code</p>
              <div className="coupon-row">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  className="coupon-input"
                  aria-label="Promo code"
                />
                <button className="coupon-btn">Apply</button>
              </div>
            </div>
          </div>

          {/* ── Right: Totals ── */}
          <div>
            <div className="cart-totals-card">
              <h2 className="cart-totals-title">Order Summary</h2>
              <hr className="totals-divider" />

              <div className="totals-row">
                <span className="totals-label">Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span className="totals-value">{formatCurrency(subtotal, defaultBusiness.currency)}</span>
              </div>
              <div className="totals-row">
                <span className="totals-label">Delivery</span>
                <span className="totals-value">
                  {formatCurrency(DELIVERY_FEE_INSIDE_DHAKA, defaultBusiness.currency)} /{" "}
                  {formatCurrency(DELIVERY_FEE_OUTSIDE_DHAKA, defaultBusiness.currency)}
                </span>
              </div>
              <p
                style={{
                  fontSize: 12,
                  color: "var(--color-text-secondary)",
                  margin: "-4px 0 8px",
                  fontFamily: "var(--font-body, sans-serif)"
                }}
              >
                Inside Dhaka / outside Dhaka — you choose at checkout.
              </p>

              <hr className="totals-divider" />

              <div className="totals-total-row">
                <span className="totals-total-label">Total</span>
                <span className="totals-total-value">
                  {items.length === 0
                    ? formatCurrency(subtotal, defaultBusiness.currency)
                    : `${formatCurrency(totalMin, defaultBusiness.currency)} – ${formatCurrency(
                        totalMax,
                        defaultBusiness.currency
                      )}`}
                </span>
              </div>

              <Link
                href="/checkout"
                className="btn"
                style={{ textAlign: "center", justifyContent: "center", padding: "13px 20px", fontSize: 15, fontWeight: 700 }}
              >
                Proceed to Checkout →
              </Link>

              <p style={{
                fontSize: 12,
                color: "var(--color-text-secondary)",
                textAlign: "center",
                fontFamily: "var(--font-body, sans-serif)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Cash on Delivery · সারা বাংলাদেশে
              </p>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
