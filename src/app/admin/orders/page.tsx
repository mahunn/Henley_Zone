"use client";

import { useEffect, useMemo, useState } from "react";
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

/** Local calendar date YYYY-MM-DD for grouping */
function localDateKey(iso: string): string {
  const d = new Date(iso);
  const y = d.getFullYear();
  const mo = d.getMonth() + 1;
  const day = d.getDate();
  return `${y}-${String(mo).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function formatDayHeading(ymd: string): string {
  const [y, m, day] = ymd.split("-").map(Number);
  const dt = new Date(y, m - 1, day);
  return dt.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

function formatMonthOption(ym: string): string {
  const [y, m] = ym.split("-").map(Number);
  const dt = new Date(y, m - 1, 1);
  return dt.toLocaleDateString(undefined, { year: "numeric", month: "long" });
}

function orderMatchesPeriod(order: Order, period: string): boolean {
  if (period === "all") return true;
  const t = new Date(order.createdAt).getTime();
  if (Number.isNaN(t)) return true;

  if (period === "today") {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    return t >= start.getTime() && t <= end.getTime();
  }
  if (period === "7d") return t >= Date.now() - 7 * 86400000;
  if (period === "30d") return t >= Date.now() - 30 * 86400000;
  if (period.startsWith("month:")) {
    const rest = period.slice(6);
    const parts = rest.split("-");
    const y = Number(parts[0]);
    const mo = Number(parts[1]);
    if (!y || !mo) return true;
    const start = new Date(y, mo - 1, 1);
    start.setHours(0, 0, 0, 0);
    const end = new Date(y, mo, 0, 23, 59, 59, 999);
    return t >= start.getTime() && t <= end.getTime();
  }
  return true;
}

function groupOrdersByLocalDay(
  sortedOrders: Order[],
  sortBy: "latest" | "oldest" | "amountHigh" | "amountLow"
): { key: string; heading: string; orders: Order[] }[] {
  const map = new Map<string, Order[]>();
  for (const o of sortedOrders) {
    const key = localDateKey(o.createdAt);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(o);
  }
  const keys = [...map.keys()].sort((a, b) => {
    if (sortBy === "oldest") return a.localeCompare(b);
    return b.localeCompare(a);
  });
  return keys.map((key) => ({
    key,
    heading: formatDayHeading(key),
    orders: map.get(key)!
  }));
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
  /** Time window: all | today | 7d | 30d | month:YYYY-MM (default: last 7 days) */
  const [period, setPeriod] = useState<string>("7d");
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

  const monthOptions = useMemo(() => {
    const set = new Set<string>();
    for (const o of orders) {
      const d = new Date(o.createdAt);
      if (Number.isNaN(d.getTime())) continue;
      set.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
    }
    return [...set].sort((a, b) => b.localeCompare(a));
  }, [orders]);

  const filteredOrders = orders
    .filter((order) => orderMatchesPeriod(order, period))
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

  const ordersByDay = useMemo(
    () => groupOrdersByLocalDay(filteredOrders, sortBy),
    [filteredOrders, sortBy]
  );

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
          <p>
            By default only the <strong>last 7 days</strong> of orders are shown. Change <strong>Time period</strong> for today, 30 days, all time, or a specific month. Orders are grouped by calendar day (newest days first).
          </p>
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
            <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 13 }}>
              <span style={{ fontWeight: 600, color: "#374151" }}>Time period</span>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                aria-label="Filter orders by date range"
                style={{ padding: "8px 10px", minWidth: 220, borderRadius: 8, border: "1px solid #d1d5db" }}
              >
                <optgroup label="Date range">
                  <option value="7d">Last 7 days</option>
                  <option value="today">Today only</option>
                  <option value="30d">Last 30 days</option>
                  <option value="all">All time</option>
                </optgroup>
                {monthOptions.length > 0 ? (
                  <optgroup label="Single calendar month">
                    {monthOptions.map((ym) => (
                      <option key={ym} value={`month:${ym}`}>
                        {formatMonthOption(ym)}
                      </option>
                    ))}
                  </optgroup>
                ) : null}
              </select>
            </label>
            <input
              type="text"
              placeholder="Search by order ID, customer, phone"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              style={{ padding: 8, minWidth: 280, borderRadius: 8, border: "1px solid #d1d5db" }}
            />
            <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 13 }}>
              <span style={{ fontWeight: 600, color: "#374151" }}>Order by</span>
              <select
                value={sortBy}
                onChange={(event) =>
                  setSortBy(event.target.value as "latest" | "oldest" | "amountHigh" | "amountLow")
                }
                style={{ padding: "8px 10px", minWidth: 200, borderRadius: 8, border: "1px solid #d1d5db" }}
              >
                <option value="latest">Date: newest first</option>
                <option value="oldest">Date: oldest first</option>
                <option value="amountHigh">Amount: high to low</option>
                <option value="amountLow">Amount: low to high</option>
              </select>
            </label>
          </div>
        </>
      ) : null}

      {!loading && orders.length > 0 && filteredOrders.length === 0 ? (
        <p style={{ marginTop: 12, color: "#64748b" }}>
          No orders match your current filters.
          {period !== "all" ? (
            <>
              {" "}
              Try setting <strong>Time period</strong> to <strong>All time</strong> or a different month.
            </>
          ) : null}
        </p>
      ) : null}

      <div style={{ marginTop: 16 }}>
        {ordersByDay.map((group) => (
          <section key={group.key} style={{ marginBottom: 28 }}>
            <h2
              style={{
                margin: "0 0 12px",
                padding: "10px 14px",
                fontSize: "1.05rem",
                fontWeight: 700,
                color: "#0f172a",
                background: "linear-gradient(90deg, #e0f2fe 0%, #f8fafc 100%)",
                borderRadius: 10,
                border: "1px solid #bae6fd"
              }}
            >
              {group.heading}
              <span style={{ fontWeight: 500, fontSize: 13, color: "#64748b", marginLeft: 8 }}>
                ({group.orders.length} {group.orders.length === 1 ? "order" : "orders"})
              </span>
            </h2>
            <div style={{ display: "grid", gap: 12 }}>
              {group.orders.map((order) => (
                <article
                  key={order.id}
                  style={{
                    border: "1px solid var(--color-border)",
                    borderRadius: 12,
                    padding: 16,
                    background: "var(--color-surface)"
                  }}
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
                    <strong>Time:</strong> {new Date(order.createdAt).toLocaleString()}
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
          </section>
        ))}
      </div>
    </main>
  );
}

