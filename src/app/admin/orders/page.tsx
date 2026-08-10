"use client";

import { useEffect, useMemo, useState } from "react";
import { formatOrderItemLabel } from "@/lib/format-order-line";
import { customerTelHref, customerWhatsappUrl } from "@/lib/customer-contact";
import { formatCurrency } from "@/lib/money";
import { defaultBusiness } from "@/config/businesses";
import { Order } from "@/types/commerce";
import { useRouter } from "next/navigation";

const statusTabs: Array<{ key: Order["status"] | "all"; label: string }> = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" }
];

function statusBadgeStyle(status: string | undefined | null) {
  const s = (status || "").toLowerCase();
  if (s === "confirmed") return { background: "#DCFCE7", color: "#166534", border: "1px solid #86EFAC" };
  if (s === "pending") return { background: "#FEF3C7", color: "#92400E", border: "1px solid #FCD34D" };
  if (s === "delivered") return { background: "#E0F2FE", color: "#0369A1", border: "1px solid #BAE6FD" };
  return { background: "#FEE2E2", color: "#991B1B", border: "1px solid #FCA5A5" };
}

function safeDate(val: string | undefined | null): Date {
  if (!val) return new Date();
  const d = new Date(val);
  return Number.isNaN(d.getTime()) ? new Date() : d;
}

function localDateKey(iso: string | undefined | null): string {
  const d = safeDate(iso);
  const y = d.getFullYear();
  const mo = d.getMonth() + 1;
  const day = d.getDate();
  return `${y}-${String(mo).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function formatDayHeading(ymd: string): string {
  try {
    const parts = ymd.split("-").map(Number);
    if (parts.length === 3 && !parts.some(Number.isNaN)) {
      const dt = new Date(parts[0], parts[1] - 1, parts[2]);
      if (!Number.isNaN(dt.getTime())) {
        return dt.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric"
        });
      }
    }
  } catch {
    // fallback
  }
  return "Recent Orders";
}

function groupOrdersByDay(orders: Order[]): { key: string; heading: string; orders: Order[] }[] {
  const map = new Map<string, Order[]>();
  for (const o of orders) {
    const key = localDateKey(o.createdAt);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(o);
  }
  const sortedKeys = [...map.keys()].sort((a, b) => b.localeCompare(a));
  return sortedKeys.map((key) => ({
    key,
    heading: formatDayHeading(key),
    orders: map.get(key) || []
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
  const [selectedMonth, setSelectedMonth] = useState<string>("all");

  const loadOrders = async () => {
    try {
      const res = await fetch("/api/orders", { cache: "no-store", credentials: "include" });
      if (res.status === 401) {
        router.replace("/login?type=admin");
        return;
      }
      if (!res.ok) throw new Error("failed");
      const data = (await res.json()) as { orders: Order[] };
      setOrders(Array.isArray(data.orders) ? data.orders : []);
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

  const updateStatus = async (orderId: string, status: Order["status"]) => {
    setUpdatingOrderId(orderId);
    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ orderId, status })
      });

      if (!res.ok) {
        setError("Failed to update status.");
        return;
      }

      await loadOrders();
    } catch {
      setError("Failed to update status.");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const availableMonths = useMemo(() => {
    const map = new Map<string, string>();
    for (const o of orders) {
      if (!o.createdAt) continue;
      const d = safeDate(o.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const label = d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
      map.set(key, label);
    }
    return [...map.entries()].sort((a, b) => b[0].localeCompare(a[0]));
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders
      .filter((order) => {
        if (selectedMonth === "all") return true;
        const d = safeDate(order.createdAt);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        return key === selectedMonth;
      })
      .filter((order) => {
        if (activeFilter === "all") return true;
        return (order.status || "").toLowerCase() === activeFilter.toLowerCase();
      })
      .filter((order) => {
        const q = (searchQuery || "").trim().toLowerCase();
        if (!q) return true;
        return (
          (order.id || "").toLowerCase().includes(q) ||
          (order.customerName || "").toLowerCase().includes(q) ||
          (order.phone || "").toLowerCase().includes(q) ||
          (order.address || "").toLowerCase().includes(q)
        );
      });
  }, [orders, selectedMonth, activeFilter, searchQuery]);

  const dayGroups = useMemo(() => groupOrdersByDay(filteredOrders), [filteredOrders]);

  const countByStatus = {
    all: orders.length,
    pending: orders.filter((order) => (order.status || "").toLowerCase() === "pending").length,
    confirmed: orders.filter((order) => (order.status || "").toLowerCase() === "confirmed").length,
    delivered: orders.filter((order) => (order.status || "").toLowerCase() === "delivered").length,
    cancelled: orders.filter((order) => (order.status || "").toLowerCase() === "cancelled").length
  };

  return (
    <main style={{ maxWidth: 1240, margin: "0 auto", padding: "24px 16px", fontFamily: "sans-serif" }}>
      {/* Top Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "1.4rem", color: "#0F172A" }}>Admin Orders</h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748B" }}>
            Orders are grouped by day and month, syncing automatically to your Google Sheet.
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <a
            href="https://docs.google.com/spreadsheets"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "7px 14px",
              background: "#166534",
              color: "#fff",
              borderRadius: 6,
              textDecoration: "none",
              fontSize: 13,
              fontWeight: 600
            }}
          >
            📊 Open Google Sheet
          </a>
          <button
            type="button"
            onClick={async () => {
              await fetch("/api/admin/logout", { method: "POST", credentials: "include" });
              router.push("/login?type=admin");
            }}
            style={{
              padding: "7px 12px",
              background: "#F1F5F9",
              border: "1px solid #CBD5E1",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 13
            }}
          >
            Log out
          </button>
        </div>
      </div>

      {/* Filter Tabs, Month Filter & Search */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 20 }}>
        {/* Status Tabs */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {statusTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveFilter(tab.key)}
              style={{
                padding: "6px 12px",
                borderRadius: 999,
                border: "1px solid #CBD5E1",
                fontSize: 12,
                fontWeight: 600,
                background: activeFilter === tab.key ? "#0F172A" : "#FFFFFF",
                color: activeFilter === tab.key ? "#FFFFFF" : "#334155",
                cursor: "pointer"
              }}
            >
              {tab.label} ({countByStatus[tab.key]})
            </button>
          ))}
        </div>

        {/* Month Selector & Search */}
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            style={{
              padding: "7px 12px",
              borderRadius: 6,
              border: "1px solid #CBD5E1",
              fontSize: 13,
              fontWeight: 600,
              background: "#F8FAFC",
              color: "#0F172A"
            }}
          >
            <option value="all">📅 All Months</option>
            {availableMonths.map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Search name, phone, address, ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: "7px 12px",
              borderRadius: 6,
              border: "1px solid #CBD5E1",
              fontSize: 13,
              minWidth: 220
            }}
          />
        </div>
      </div>

      {loading ? <p>Loading orders...</p> : null}
      {error ? <p style={{ color: "crimson", fontSize: 13 }}>{error}</p> : null}

      {/* Day-wise Grouped Orders Sections */}
      {!loading && dayGroups.length === 0 ? (
        <div style={{ padding: 32, textAlign: "center", background: "#fff", borderRadius: 8, border: "1px solid #E2E8F0", color: "#64748B" }}>
          No orders found matching your selection.
        </div>
      ) : (
        dayGroups.map((group) => (
          <section key={group.key} style={{ marginBottom: 24 }}>
            {/* Green Day Section Header */}
            <div
              style={{
                background: "#15803D",
                color: "#FFFFFF",
                padding: "8px 14px",
                borderRadius: "8px 8px 0 0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontWeight: 700,
                fontSize: 14
              }}
            >
              <span>📅 {group.heading}</span>
              <span style={{ fontSize: 12, background: "rgba(255,255,255,0.2)", padding: "2px 8px", borderRadius: 999 }}>
                {group.orders.length} {group.orders.length === 1 ? "Order" : "Orders"}
              </span>
            </div>

            {/* Orders Table for this Day */}
            <div style={{ overflowX: "auto", background: "#FFFFFF", borderRadius: "0 0 8px 8px", border: "1px solid #E2E8F0", borderTop: "none" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, textAlign: "left" }}>
                <thead>
                  <tr style={{ background: "#F1F5F9", color: "#475569", borderBottom: "1px solid #E2E8F0" }}>
                    <th style={{ padding: "8px 12px", borderRight: "1px solid #E2E8F0" }}>Order ID & Time</th>
                    <th style={{ padding: "8px 12px", borderRight: "1px solid #E2E8F0" }}>Customer</th>
                    <th style={{ padding: "8px 12px", borderRight: "1px solid #E2E8F0" }}>Phone</th>
                    <th style={{ padding: "8px 12px", borderRight: "1px solid #E2E8F0", minWidth: 180 }}>Address</th>
                    <th style={{ padding: "8px 12px", borderRight: "1px solid #E2E8F0", minWidth: 220 }}>Products & Sizes</th>
                    <th style={{ padding: "8px 12px", borderRight: "1px solid #E2E8F0" }}>Total</th>
                    <th style={{ padding: "8px 12px" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {group.orders.map((order, idx) => {
                    const currentStatus = (order.status || "pending").toLowerCase();
                    const badge = statusBadgeStyle(currentStatus);
                    const timeString = safeDate(order.createdAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: true });
                    const items = Array.isArray(order.items) ? order.items : [];

                    return (
                      <tr
                        key={order.id || idx}
                        style={{
                          background: idx % 2 === 0 ? "#F8FAFC" : "#FFFFFF",
                          borderBottom: "1px solid #E2E8F0"
                        }}
                      >
                        <td style={{ padding: "10px 12px", verticalAlign: "top", borderRight: "1px solid #E2E8F0" }}>
                          <div style={{ fontWeight: 700, color: "#0F172A" }}>{order.id || "N/A"}</div>
                          <div style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>
                            {timeString}
                          </div>
                        </td>

                        <td style={{ padding: "10px 12px", verticalAlign: "top", borderRight: "1px solid #E2E8F0" }}>
                          <div style={{ fontWeight: 600 }}>{order.customerName || "Customer"}</div>
                          {order.note && (
                            <div style={{ fontSize: 11, color: "#D97706", marginTop: 2 }}>Note: {order.note}</div>
                          )}
                        </td>

                        <td style={{ padding: "10px 12px", verticalAlign: "top", borderRight: "1px solid #E2E8F0", whiteSpace: "nowrap" }}>
                          <div style={{ fontWeight: 600 }}>{order.phone || "N/A"}</div>
                          {order.phone && customerTelHref(order.phone) && (
                            <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                              <a
                                href={customerTelHref(order.phone)}
                                style={{
                                  fontSize: 11,
                                  padding: "2px 6px",
                                  background: "#0284C7",
                                  color: "#fff",
                                  borderRadius: 4,
                                  textDecoration: "none",
                                  fontWeight: 600
                                }}
                              >
                                📞 Call
                              </a>
                              <a
                                href={customerWhatsappUrl(order.phone, `Hi ${order.customerName || ""}, regarding your order ${order.id || ""}.`)}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  fontSize: 11,
                                  padding: "2px 6px",
                                  background: "#16A34A",
                                  color: "#fff",
                                  borderRadius: 4,
                                  textDecoration: "none",
                                  fontWeight: 600
                                }}
                              >
                                💬 WA
                              </a>
                            </div>
                          )}
                        </td>

                        <td style={{ padding: "10px 12px", verticalAlign: "top", borderRight: "1px solid #E2E8F0", fontSize: 12 }}>
                          {order.address || "N/A"}
                        </td>

                        <td style={{ padding: "10px 12px", verticalAlign: "top", borderRight: "1px solid #E2E8F0" }}>
                          {items.length === 0 ? (
                            <span style={{ color: "#94A3B8" }}>No items listed</span>
                          ) : (
                            <ul style={{ margin: 0, paddingLeft: 14, fontSize: 12, lineHeight: 1.45 }}>
                              {items.map((item, i) => (
                                <li key={i}>
                                  <strong>{formatOrderItemLabel(item)}</strong> ({item.quantity || 1}টি)
                                </li>
                              ))}
                            </ul>
                          )}
                        </td>

                        <td style={{ padding: "10px 12px", verticalAlign: "top", borderRight: "1px solid #E2E8F0", whiteSpace: "nowrap" }}>
                          <div style={{ fontWeight: 700, color: "#0F172A" }}>
                            {formatCurrency(order.total || 0, defaultBusiness.currency)}
                          </div>
                        </td>

                        <td style={{ padding: "10px 12px", verticalAlign: "top" }}>
                          <select
                            value={currentStatus}
                            onChange={(e) => void updateStatus(order.id, e.target.value as Order["status"])}
                            disabled={updatingOrderId === order.id}
                            style={{
                              padding: "4px 8px",
                              borderRadius: 6,
                              fontSize: 12,
                              fontWeight: 700,
                              cursor: "pointer",
                              ...badge
                            }}
                          >
                            <option value="pending">PENDING</option>
                            <option value="confirmed">CONFIRMED</option>
                            <option value="delivered">DELIVERED</option>
                            <option value="cancelled">CANCELLED</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        ))
      )}
    </main>
  );
}
