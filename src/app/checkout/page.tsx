"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { defaultBusiness } from "@/config/businesses";
import { DELIVERY_FEE_INSIDE_DHAKA, DELIVERY_FEE_OUTSIDE_DHAKA } from "@/config/delivery";
import { formatCurrency } from "@/lib/money";
import { Order } from "@/types/commerce";

const DELIVERY_OPTIONS = [
  {
    id: "inside",
    icon: "🏙️",
    title: "Inside Dhaka",
    fee: DELIVERY_FEE_INSIDE_DHAKA
  },
  {
    id: "outside",
    icon: "🚚",
    title: "Outside Dhaka",
    fee: DELIVERY_FEE_OUTSIDE_DHAKA
  }
] as const;

type DeliveryId = (typeof DELIVERY_OPTIONS)[number]["id"];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [delivery, setDelivery] = useState<DeliveryId>("inside");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const deliveryFee = DELIVERY_OPTIONS.find((o) => o.id === delivery)!.fee;
  const total = subtotal + (items.length > 0 ? deliveryFee : 0);
  const cleanedPhone = phone.replace(/\s+/g, "");

  const submitOrder = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!items.length) { setError("Your cart is empty."); return; }
    if (!customerName.trim() || !cleanedPhone || !address.trim()) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!/^\+?[0-9]{10,15}$/.test(cleanedPhone)) {
      setError("Please enter a valid phone number (10–15 digits).");
      return;
    }
    if (!termsAccepted) {
      setError("Please accept the terms & conditions to continue.");
      return;
    }

    const order: Order = {
      id: `ORD-${Date.now()}`,
      items,
      subtotal,
      deliveryFee,
      total,
      paymentMethod: "COD",
      status: "pending",
      customerName: customerName.trim(),
      phone: cleanedPhone,
      address: address.trim(),
      note: note.trim(),
      createdAt: new Date().toISOString()
    };

    try {
      setSubmitting(true);
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order)
      });
      if (!res.ok) { setError("Failed to place order. Please try again."); return; }
      localStorage.setItem("latestOrder", JSON.stringify(order));
      clearCart();
      router.push("/checkout/success");
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container checkout-page-wrap">

      {/* Breadcrumb */}
      <nav className="cart-breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span>›</span>
        <Link href="/cart">Cart</Link>
        <span>›</span>
        <span style={{ color: "var(--color-text-primary)", fontWeight: 500 }}>Checkout</span>
      </nav>

      <h1 className="cart-page-title">Checkout</h1>

      {items.length === 0 ? (
        <div className="cart-empty-state">
          <p style={{ color: "var(--color-text-secondary)", marginBottom: 20, fontFamily: "var(--font-body, sans-serif)" }}>
            Your cart is empty. Add some products first.
          </p>
          <Link href="/store" className="btn">Browse Products →</Link>
        </div>
      ) : (
        <form onSubmit={submitOrder}>
          <div className="checkout-layout">

            {/* ── Left: Order Review + Billing Form ── */}
            <div className="checkout-panel">

              {/* Order Items Review */}
              <div style={{ background: "#fff", border: "1.5px solid var(--color-border)", borderRadius: 14, padding: "16px 20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <h2 className="checkout-section-title" style={{ margin: 0, border: "none", padding: 0 }}>
                    Your Order
                  </h2>
                  <Link href="/cart" style={{ fontSize: 13, color: "var(--color-primary)", fontWeight: 600, fontFamily: "var(--font-body, sans-serif)" }}>
                    Edit cart
                  </Link>
                </div>
                <div className="order-review-list">
                  {items.map((item) => {
                    const initials = item.name.slice(0, 2).toUpperCase();
                    const fallbackSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='58'%3E%3Crect width='50' height='58' rx='6' fill='%23e0f2fe'/%3E%3Ctext x='25' y='34' text-anchor='middle' font-family='sans-serif' font-size='14' font-weight='700' fill='%230284c7'%3E${encodeURIComponent(initials)}%3C/text%3E%3C/svg%3E`;
                    return (
                      <div key={item.key} className="order-review-item">
                        <img
                          src={item.imageUrl ?? fallbackSvg}
                          alt={item.name}
                          className="order-review-img"
                          onError={(e) => { (e.target as HTMLImageElement).src = fallbackSvg; }}
                        />
                        <div className="order-review-info">
                          <div className="order-review-name">{item.name}</div>
                          <div className="order-review-qty">Qty: {item.quantity}</div>
                          {(item.selectedColor || item.selectedSize) && (
                            <div className="order-review-qty">
                              {item.selectedColor ? `Color: ${item.selectedColor}` : ""}
                              {item.selectedColor && item.selectedSize ? " · " : ""}
                              {item.selectedSize ? `Size: ${item.selectedSize}` : ""}
                            </div>
                          )}
                        </div>
                        <div className="order-review-price">
                          {formatCurrency(item.price * item.quantity, defaultBusiness.currency)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Billing Details Form */}
              <div style={{ background: "#fff", border: "1.5px solid var(--color-border)", borderRadius: 14, padding: "20px 20px 24px" }}>
                <h2 className="checkout-section-title">Billing Information</h2>
                <div className="billing-form">
                  <div className="form-group">
                    <label htmlFor="co-name" className="form-label">Full Name *</label>
                    <input
                      id="co-name"
                      type="text"
                      className="form-input"
                      placeholder="e.g. Fatema Akter"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                      autoComplete="name"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="co-phone" className="form-label">Phone Number *</label>
                    <input
                      id="co-phone"
                      type="tel"
                      className="form-input"
                      placeholder="e.g. 01XXXXXXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      autoComplete="tel"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="co-address" className="form-label">Full Address *</label>
                    <textarea
                      id="co-address"
                      className="form-textarea"
                      placeholder="House, Road, Area, District"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      autoComplete="street-address"
                      rows={3}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="co-note" className="form-label">Order Note <span style={{ textTransform: "none", letterSpacing: 0, fontWeight: 400 }}>(optional)</span></label>
                    <textarea
                      id="co-note"
                      className="form-textarea"
                      placeholder="Special instructions, color preference, etc."
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right: Order Summary (sticky) ── */}
            <div>
              <div className="checkout-summary-card">
                <h2 style={{ fontFamily: "var(--font-heading, serif)", fontSize: "1.15rem", fontWeight: 700, color: "var(--color-text-primary)", paddingBottom: 12, borderBottom: "1.5px solid var(--color-border)" }}>
                  Order Summary
                </h2>

                {/* Subtotal */}
                <div className="totals-row">
                  <span className="totals-label">Subtotal</span>
                  <span className="totals-value">{formatCurrency(subtotal, defaultBusiness.currency)}</span>
                </div>

                {/* Delivery Area */}
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--color-text-secondary)", marginBottom: 10, fontFamily: "var(--font-body, sans-serif)" }}>
                    Delivery Area
                  </p>
                  <div className="delivery-options">
                    {DELIVERY_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        className={`delivery-card${delivery === opt.id ? " selected" : ""}`}
                        onClick={() => setDelivery(opt.id)}
                        aria-pressed={delivery === opt.id}
                      >
                        <div className="delivery-card-icon">{opt.icon}</div>
                        <div className="delivery-card-title">{opt.title}</div>
                        <div className="delivery-card-fee">{formatCurrency(opt.fee, defaultBusiness.currency)}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Shipping fee row */}
                <div className="totals-row">
                  <span className="totals-label">Delivery</span>
                  <span className="totals-value">{formatCurrency(deliveryFee, defaultBusiness.currency)}</span>
                </div>

                <hr className="totals-divider" />

                {/* Total */}
                <div className="totals-total-row">
                  <span className="totals-total-label">Total Payable</span>
                  <span className="totals-total-value">{formatCurrency(total, defaultBusiness.currency)}</span>
                </div>

                {/* Payment method badge */}
                <div style={{
                  background: "var(--color-primary-light)",
                  border: "1px solid #bae6fd",
                  borderRadius: 8,
                  padding: "8px 12px",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 13,
                  color: "var(--color-primary-dark)",
                  fontWeight: 600,
                  fontFamily: "var(--font-body, sans-serif)"
                }}>
                  💵 Cash on Delivery (COD)
                </div>

                {/* Error */}
                {error && (
                  <div className="form-error">
                    <span>⚠</span> {error}
                  </div>
                )}

                {/* Terms */}
                <label className="terms-row">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                  />
                  <span>
                    I agree to the{" "}
                    <Link href="/terms" style={{ color: "var(--color-primary)", fontWeight: 600 }}>Terms & Conditions</Link>
                    {" "}and{" "}
                    <Link href="/return-policy" style={{ color: "var(--color-primary)", fontWeight: 600 }}>Return Policy</Link>
                  </span>
                </label>

                {/* Submit */}
                <button
                  type="submit"
                  className="btn"
                  disabled={submitting || !items.length}
                  style={{ justifyContent: "center", padding: "14px 20px", fontSize: 15, fontWeight: 700 }}
                >
                  {submitting ? "Placing Order…" : "Confirm Order →"}
                </button>
              </div>
            </div>

          </div>
        </form>
      )}
    </div>
  );
}
