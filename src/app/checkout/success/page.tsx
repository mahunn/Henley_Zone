"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { defaultBusiness } from "@/config/businesses";
import { formatCurrency } from "@/lib/money";
import { Order } from "@/types/commerce";

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

  return (
    <main className="container">
      <h1 className="section-title">Order Placed Successfully</h1>
      <p className="muted">Your Cash on Delivery order has been received.</p>

      {!order ? (
        <p>
          No recent order found. <Link href="/store">Continue shopping</Link>
        </p>
      ) : (
        <section className="card">
          <p>
            <strong>Order ID:</strong> {order.id}
          </p>
          <p>
            <strong>Customer:</strong> {order.customerName}
          </p>
          <p>
            <strong>Phone:</strong> {order.phone}
          </p>
          <p>
            <strong>Address:</strong> {order.address}
          </p>
          <p>
            <strong>Total:</strong>{" "}
            {formatCurrency(order.total, defaultBusiness.currency)}
          </p>
          <p>
            <strong>Status:</strong> {order.status}
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

