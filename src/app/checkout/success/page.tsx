"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { OrderCelebration } from "@/components/checkout/order-celebration";
import { defaultBusiness } from "@/config/businesses";
import { formatOrderItemLabel } from "@/lib/format-order-line";
import { formatCurrency } from "@/lib/money";
import { Order } from "@/types/commerce";

function statusLabel(status: Order["status"]) {
  if (status === "pending") return "Pending — we will call you to confirm";
  if (status === "confirmed") return "Confirmed";
  if (status === "delivered") return "Delivered";
  return "Cancelled";
}

export default function CheckoutSuccessPage() {
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("latestOrder");
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as Order;
      setOrder(parsed);
    } catch {
      setOrder(null);
    }
  }, []);

  const currency = defaultBusiness.currency;

  return (
    <main className="container order-success-wrap">
      <OrderCelebration />

      <div className="order-success-hero">
        <div className="order-success-icon" aria-hidden>
          ✓
        </div>
        <h1 className="section-title" style={{ marginBottom: 8 }}>
          Order Placed Successfully
        </h1>
        <p className="muted" style={{ margin: 0 }}>
          Your Cash on Delivery order has been received. Please save the details below for your records.
        </p>
      </div>

      {!order ? (
        <p>
          No recent order found. <Link href="/store">Continue shopping</Link>
        </p>
      ) : (
        <section className="card order-success-receipt">
          <dl>
            <div>
              <dt>Order ID</dt>
              <dd>{order.id}</dd>
            </div>
            <div>
              <dt>Placed on</dt>
              <dd>{new Date(order.createdAt).toLocaleString()}</dd>
            </div>
            <div>
              <dt>Customer</dt>
              <dd>{order.customerName}</dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>
                <a href={`tel:${order.phone}`}>{order.phone}</a>
              </dd>
            </div>
            <div>
              <dt>Delivery address</dt>
              <dd>{order.address}</dd>
            </div>
            <div>
              <dt>Payment</dt>
              <dd>Cash on Delivery ({order.paymentMethod})</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>{statusLabel(order.status)}</dd>
            </div>
          </dl>

          <div style={{ marginTop: 16 }}>
            <strong>Items ordered</strong>
            <ul className="order-success-items">
              {order.items.map((item) => (
                <li key={item.key ?? `${item.productId}-${item.name}`}>
                  {formatOrderItemLabel(item)} · Qty {item.quantity} ·{" "}
                  {formatCurrency(item.price, currency)} each · Line{" "}
                  {formatCurrency(item.price * item.quantity, currency)}
                </li>
              ))}
            </ul>
          </div>

          <div className="order-success-totals">
            <div className="order-success-totals-row">
              <span>Subtotal</span>
              <span>{formatCurrency(order.subtotal, currency)}</span>
            </div>
            <div className="order-success-totals-row">
              <span>Delivery</span>
              <span>{formatCurrency(order.deliveryFee, currency)}</span>
            </div>
            <div className="order-success-totals-row">
              <strong>Total (COD)</strong>
              <strong>{formatCurrency(order.total, currency)}</strong>
            </div>
          </div>

          {order.note?.trim() ? (
            <p style={{ marginTop: 14, marginBottom: 0 }}>
              <strong>Your note:</strong> {order.note.trim()}
            </p>
          ) : null}

          <p className="muted" style={{ marginTop: 16, marginBottom: 0, fontSize: 14 }}>
            We will contact you at <strong>{order.phone}</strong> to confirm delivery. Keep your Order ID handy if you
            need support.
          </p>
        </section>
      )}

      <p style={{ marginTop: 20 }}>
        <Link className="btn" href="/store">
          Back to store
        </Link>
      </p>
    </main>
  );
}
