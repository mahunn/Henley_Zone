"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { OrderCelebration } from "@/components/checkout/order-celebration";
import { defaultBusiness } from "@/config/businesses";
import { bn } from "@/config/ui-bn";
import { formatOrderItemLabel } from "@/lib/format-order-line";
import { formatCurrency } from "@/lib/money";
import { Order } from "@/types/commerce";

function statusLabel(status: Order["status"]) {
  if (status === "pending") return bn.success.statusPending;
  if (status === "confirmed") return bn.success.statusConfirmed;
  if (status === "delivered") return bn.success.statusDelivered;
  return bn.success.statusCancelled;
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
          {bn.success.title}
        </h1>
        <p className="muted" style={{ margin: 0 }}>
          {bn.success.subtitle}
        </p>
      </div>

      {!order ? (
        <p>
          {bn.success.noOrder}{" "}
          <Link href="/store">{bn.success.continueShop}</Link>
        </p>
      ) : (
        <section className="card order-success-receipt">
          <dl>
            <div>
              <dt>{bn.success.orderId}</dt>
              <dd>{order.id}</dd>
            </div>
            <div>
              <dt>{bn.success.placedOn}</dt>
              <dd>{new Date(order.createdAt).toLocaleString("bn-BD")}</dd>
            </div>
            <div>
              <dt>{bn.success.customer}</dt>
              <dd>{order.customerName}</dd>
            </div>
            <div>
              <dt>{bn.success.phone}</dt>
              <dd>
                <a href={`tel:${order.phone}`}>{order.phone}</a>
              </dd>
            </div>
            <div>
              <dt>{bn.success.address}</dt>
              <dd>{order.address}</dd>
            </div>
            <div>
              <dt>{bn.success.payment}</dt>
              <dd>{bn.success.paymentValue}</dd>
            </div>
            <div>
              <dt>{bn.success.status}</dt>
              <dd>{statusLabel(order.status)}</dd>
            </div>
          </dl>

          <div style={{ marginTop: 16 }}>
            <strong>{bn.success.itemsOrdered}</strong>
            <ul className="order-success-items">
              {order.items.map((item) => (
                <li key={item.key ?? `${item.productId}-${item.name}`}>
                  {formatOrderItemLabel(item)} · {bn.checkout.qty} {item.quantity} ·{" "}
                  {formatCurrency(item.price, currency)} {bn.success.each} · {bn.success.line}{" "}
                  {formatCurrency(item.price * item.quantity, currency)}
                </li>
              ))}
            </ul>
          </div>

          <div className="order-success-totals">
            <div className="order-success-totals-row">
              <span>{bn.success.subtotal}</span>
              <span>{formatCurrency(order.subtotal, currency)}</span>
            </div>
            <div className="order-success-totals-row">
              <span>{bn.success.delivery}</span>
              <span>{formatCurrency(order.deliveryFee, currency)}</span>
            </div>
            <div className="order-success-totals-row">
              <strong>{bn.success.totalCod}</strong>
              <strong>{formatCurrency(order.total, currency)}</strong>
            </div>
          </div>

          {order.note?.trim() ? (
            <p style={{ marginTop: 14, marginBottom: 0 }}>
              <strong>{bn.success.yourNote}</strong> {order.note.trim()}
            </p>
          ) : null}

          <p className="muted" style={{ marginTop: 16, marginBottom: 0, fontSize: 14 }}>
            {bn.success.footerNoteBefore}{" "}
            <strong>{order.phone}</strong> {bn.success.footerNoteAfter}
          </p>
        </section>
      )}

      <p style={{ marginTop: 20 }}>
        <Link className="btn" href="/store">
          {bn.success.backStore}
        </Link>
      </p>
    </main>
  );
}
