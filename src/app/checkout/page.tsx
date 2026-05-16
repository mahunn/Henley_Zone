"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { defaultBusiness } from "@/config/businesses";
import { DELIVERY_FEE_INSIDE_DHAKA, DELIVERY_FEE_OUTSIDE_DHAKA } from "@/config/delivery";
import { formatCurrency } from "@/lib/money";
import { Order } from "@/types/commerce";
import { bn } from "@/config/ui-bn";

const DELIVERY_OPTIONS = [
  {
    id: "inside",
    icon: "🏙️",
    title: bn.checkout.insideDhaka,
    fee: DELIVERY_FEE_INSIDE_DHAKA
  },
  {
    id: "outside",
    icon: "🚚",
    title: bn.checkout.outsideDhaka,
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

    if (!items.length) { setError(bn.checkout.errors.emptyCart); return; }
    if (!customerName.trim() || !cleanedPhone || !address.trim()) {
      setError(bn.checkout.errors.required);
      return;
    }
    if (!/^\+?[0-9]{10,15}$/.test(cleanedPhone)) {
      setError(bn.checkout.errors.phone);
      return;
    }
    if (!termsAccepted) {
      setError(bn.checkout.errors.terms);
      return;
    }

    const orderPayload: Omit<Order, "id"> = {
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
        body: JSON.stringify(orderPayload)
      });
      const data = (await res.json()) as { order?: Order; message?: string };
      if (!res.ok) {
        setError(data.message || bn.checkout.errors.failed);
        return;
      }
      const order = data.order ?? ({ ...orderPayload, id: "" } as Order);
      if (!order.id) {
        setError(bn.checkout.errors.noOrderId);
        return;
      }
      localStorage.setItem("latestOrder", JSON.stringify(order));
      clearCart();
      router.push("/checkout/success");
    } catch {
      setError(bn.checkout.errors.network);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container checkout-page-wrap">

      {/* Breadcrumb */}
      <nav className="cart-breadcrumb" aria-label="Breadcrumb">
        <Link href="/">{bn.checkout.breadcrumbHome}</Link>
        <span>›</span>
        <Link href="/cart">{bn.checkout.breadcrumbCart}</Link>
        <span>›</span>
        <span style={{ color: "var(--color-text-primary)", fontWeight: 500 }}>{bn.checkout.breadcrumbCheckout}</span>
      </nav>

      <h1 className="cart-page-title">{bn.checkout.title}</h1>

      {items.length === 0 ? (
        <div className="cart-empty-state">
          <p style={{ color: "var(--color-text-secondary)", marginBottom: 20 }}>
            {bn.checkout.empty}
          </p>
          <Link href="/store" className="btn">{bn.checkout.browse}</Link>
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
                    {bn.checkout.yourOrder}
                  </h2>
                  <Link href="/cart" style={{ fontSize: 13, color: "var(--color-primary)", fontWeight: 600 }}>
                    {bn.checkout.editCart}
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
                          <div className="order-review-qty">{bn.checkout.qty}: {item.quantity}</div>
                          {(item.selectedColor || item.selectedSize) && (
                            <div className="order-review-qty">
                              {item.selectedColor ? `${bn.product.color}: ${item.selectedColor}` : ""}
                              {item.selectedColor && item.selectedSize ? " · " : ""}
                              {item.selectedSize ? `${bn.product.size}: ${item.selectedSize}` : ""}
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
                <h2 className="checkout-section-title">{bn.checkout.billing}</h2>
                <div className="billing-form">
                  <div className="form-group">
                    <label htmlFor="co-name" className="form-label">{bn.checkout.fullName}</label>
                    <input
                      id="co-name"
                      type="text"
                      className="form-input"
                      placeholder={bn.checkout.namePlaceholder}
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                      autoComplete="name"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="co-phone" className="form-label">{bn.checkout.phone}</label>
                    <input
                      id="co-phone"
                      type="tel"
                      className="form-input"
                      placeholder={bn.checkout.phonePlaceholder}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      autoComplete="tel"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="co-address" className="form-label">{bn.checkout.address}</label>
                    <textarea
                      id="co-address"
                      className="form-textarea"
                      placeholder={bn.checkout.addressPlaceholder}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      autoComplete="street-address"
                      rows={3}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="co-note" className="form-label">
                      {bn.checkout.note}{" "}
                      <span style={{ textTransform: "none", letterSpacing: 0, fontWeight: 400 }}>{bn.checkout.noteOptional}</span>
                    </label>
                    <textarea
                      id="co-note"
                      className="form-textarea"
                      placeholder={bn.checkout.notePlaceholder}
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
                  {bn.checkout.summary}
                </h2>

                <div className="totals-row">
                  <span className="totals-label">{bn.checkout.subtotal}</span>
                  <span className="totals-value">{formatCurrency(subtotal, defaultBusiness.currency)}</span>
                </div>

                {/* Delivery Area */}
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--color-text-secondary)", marginBottom: 10, fontFamily: "var(--font-body, sans-serif)" }}>
                    {bn.checkout.deliveryArea}
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
                  <span className="totals-label">{bn.checkout.deliveryFee}</span>
                  <span className="totals-value">{formatCurrency(deliveryFee, defaultBusiness.currency)}</span>
                </div>

                <hr className="totals-divider" />

                {/* Total */}
                <div className="totals-total-row">
                  <span className="totals-total-label">{bn.checkout.totalPayable}</span>
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
                  💵 {bn.checkout.cod}
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
                    {bn.checkout.terms}{" "}
                    <Link href="/terms" style={{ color: "var(--color-primary)", fontWeight: 600 }}>{bn.checkout.termsLink}</Link>
                    {" "}{bn.checkout.and}{" "}
                    <Link href="/return-policy" style={{ color: "var(--color-primary)", fontWeight: 600 }}>{bn.checkout.returnLink}</Link>{" "}
                    {bn.checkout.termsEnd}
                  </span>
                </label>

                {/* Submit */}
                <button
                  type="submit"
                  className="btn"
                  disabled={submitting || !items.length}
                  style={{ justifyContent: "center", padding: "14px 20px", fontSize: 15, fontWeight: 700 }}
                >
                  {submitting ? bn.checkout.placing : bn.checkout.confirm}
                </button>
              </div>
            </div>

          </div>
        </form>
      )}
    </div>
  );
}
