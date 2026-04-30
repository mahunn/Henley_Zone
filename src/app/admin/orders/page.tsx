"use client";

import { useEffect, useState } from "react";
import { defaultBusiness } from "@/config/businesses";
import { formatCurrency } from "@/lib/money";
import { Order } from "@/types/commerce";
import { useRouter } from "next/navigation";

const statusTabs: Array<{ key: Order["status"] | "all"; label: string }> = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" }
];

function statusBadgeStyle(status: Order["status"]) {
  if (status === "pending") return { background: "#FEF3C7", color: "#92400E" };
  if (status === "confirmed") return { background: "#DBEAFE", color: "#1E40AF" };
  if (status === "delivered") return { background: "#DCFCE7", color: "#166534" };
  return { background: "#FEE2E2", color: "#991B1B" };
}

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<Order["status"] | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"latest" | "oldest" | "amountHigh" | "amountLow">(
    "latest"
  );
  const [copyingId, setCopyingId] = useState<string | null>(null);
  const [copiedNotice, setCopiedNotice] = useState("");

  const loadOrders = async () => {
    try {
      const res = await fetch("/api/orders", { cache: "no-store" });
      if (res.status === 401) {
        router.replace("/login?type=admin");
        return;
      }
      if (!res.ok) {
        throw new Error("failed");
      }
      const data = (await res.json()) as { orders: Order[] };
      setOrders(data.orders);
      setError("");
    } catch {
      setError("Could not load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadOrders();
  }, [router]);

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/login?type=admin");
    router.refresh();
  };

  const updateStatus = async (orderId: string, status: Order["status"]) => {
    setUpdatingOrderId(orderId);
    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status })
      });

      if (res.status === 401) {
        router.replace("/login?type=admin");
        return;
      }
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as
          | { message?: string }
          | null;
        setError(body?.message || "Failed to update order status.");
        return;
      }

      await loadOrders();
    } catch {
      setError("Failed to update order status.");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const filteredOrders = orders
    .filter((order) => (activeFilter === "all" ? true : order.status === activeFilter))
    .filter((order) => {
      const q = searchQuery.trim().toLowerCase();
      if (!q) return true;
      return (
        order.id.toLowerCase().includes(q) ||
        order.customerName.toLowerCase().includes(q) ||
        order.phone.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === "latest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === "oldest") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === "amountHigh") {
        return b.total - a.total;
      }
      return a.total - b.total;
    });

  const formatOrderForClipboard = (order: Order) => {
    const lines = [
      `Order ID: ${order.id}`,
      `Date: ${new Date(order.createdAt).toLocaleString()}`,
      `Customer: ${order.customerName}`,
      `Phone: ${order.phone}`,
      `Address: ${order.address}`,
      `Status: ${order.status}`,
      `Total: ${formatCurrency(order.total, defaultBusiness.currency)}`,
      `Items:`
    ];
    for (const item of order.items) {
      lines.push(
        `- ${item.name} x${item.quantity} (${formatCurrency(
          item.price,
          defaultBusiness.currency
        )})`
      );
    }
    if (order.note) lines.push(`Note: ${order.note}`);
    return lines.join("\n");
  };

  const copyText = async (text: string) => {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "true");
    area.style.position = "absolute";
    area.style.left = "-9999px";
    document.body.appendChild(area);
    area.select();
    document.execCommand("copy");
    area.remove();
  };

  const handleCopyOrder = async (order: Order) => {
    setCopyingId(order.id);
    try {
      await copyText(formatOrderForClipboard(order));
      setCopiedNotice(`Copied order ${order.id}`);
      window.setTimeout(() => setCopiedNotice(""), 1800);
    } catch {
      setError("Could not copy order.");
    } finally {
      setCopyingId(null);
    }
  };

  const handleCopyAll = async () => {
    if (!filteredOrders.length) return;
    setCopyingId("all");
    try {
      const allText = filteredOrders
        .map((order, idx) => {
          const block = formatOrderForClipboard(order);
          return idx === filteredOrders.length - 1 ? block : `${block}\n\n--------------------\n`;
        })
        .join("");
      await copyText(allText);
      setCopiedNotice(`Copied ${filteredOrders.length} orders`);
      window.setTimeout(() => setCopiedNotice(""), 1800);
    } catch {
      setError("Could not copy all orders.");
    } finally {
      setCopyingId(null);
    }
  };

  const countByStatus = {
    all: orders.length,
    pending: orders.filter((order) => order.status === "pending").length,
    confirmed: orders.filter((order) => order.status === "confirmed").length,
    delivered: orders.filter((order) => order.status === "delivered").length,
    cancelled: orders.filter((order) => order.status === "cancelled").length
  };

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: 24 }}>
      <div className="admin-orders-top">
        <div>
          <h1>Admin - COD Orders</h1>
          <p>All orders placed from checkout are listed here.</p>
        </div>
        <div className="admin-orders-actions">
          <button type="button" className="admin-copy-btn" onClick={handleCopyAll} disabled={copyingId === "all" || !filteredOrders.length}>
            {copyingId === "all" ? "Copying..." : "Copy All"}
          </button>
          <button type="button" className="admin-ghost-btn" onClick={logout}>
            Log out
          </button>
        </div>
      </div>

      {loading ? <p>Loading orders...</p> : null}
      {error ? <p style={{ color: "crimson" }}>{error}</p> : null}
      {copiedNotice ? <p className="admin-copy-note">{copiedNotice}</p> : null}

      {!loading && !orders.length ? <p>No orders yet.</p> : null}

      {!loading && orders.length ? (
        <>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14 }}>
            {statusTabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveFilter(tab.key)}
                style={{
                  padding: "6px 10px",
                  borderRadius: 999,
                  border: "1px solid #d1d5db",
                  background: activeFilter === tab.key ? "#111827" : "#fff",
                  color: activeFilter === tab.key ? "#fff" : "#111827"
                }}
              >
                {tab.label} ({countByStatus[tab.key]})
              </button>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              marginTop: 12,
              alignItems: "center"
            }}
          >
            <input
              type="text"
              placeholder="Search by order ID, customer, phone"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              style={{ padding: 8, minWidth: 280 }}
            />
            <select
              value={sortBy}
              onChange={(event) =>
                setSortBy(event.target.value as "latest" | "oldest" | "amountHigh" | "amountLow")
              }
              style={{ padding: 8 }}
            >
              <option value="latest">Sort: Latest first</option>
              <option value="oldest">Sort: Oldest first</option>
              <option value="amountHigh">Sort: Amount high to low</option>
              <option value="amountLow">Sort: Amount low to high</option>
            </select>
          </div>
        </>
      ) : null}

      {!loading && orders.length && filteredOrders.length === 0 ? (
        <p style={{ marginTop: 12 }}>No orders match your current filters.</p>
      ) : null}

      <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
        {filteredOrders.map((order) => (
          <article
            key={order.id}
            style={{ border: "1px solid var(--color-border)", borderRadius: 12, padding: 16, background: "var(--color-surface)" }}
          >
            <div className="admin-order-head">
              <p>
                <strong>Order:</strong> {order.id}
              </p>
              <button
                type="button"
                className="admin-copy-btn"
                onClick={() => void handleCopyOrder(order)}
                disabled={copyingId === order.id}
              >
                {copyingId === order.id ? "Copying..." : "Copy"}
              </button>
            </div>
            <p>
              <strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}
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
              <strong>Status:</strong>{" "}
              <span
                style={{
                  display: "inline-block",
                  padding: "3px 8px",
                  borderRadius: 999,
                  fontWeight: 600,
                  ...statusBadgeStyle(order.status)
                }}
              >
                {order.status}
              </span>
            </p>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <label htmlFor={`status-${order.id}`}>Update status:</label>
              <select
                id={`status-${order.id}`}
                value={order.status}
                onChange={(event) =>
                  void updateStatus(order.id, event.target.value as Order["status"])
                }
                disabled={updatingOrderId === order.id}
              >
                <option value="pending">pending</option>
                <option value="confirmed">confirmed</option>
                <option value="delivered">delivered</option>
                <option value="cancelled">cancelled</option>
              </select>
            </div>
            <p>
              <strong>Items:</strong>{" "}
              {order.items.map((item) => `${item.name} x${item.quantity}`).join(", ")}
            </p>
          </article>
        ))}
      </div>
    </main>
  );
}

