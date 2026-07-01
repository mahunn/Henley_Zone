"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { defaultBusiness } from "@/config/businesses";
import { formatOrderItemLabel } from "@/lib/format-order-line";
import { AdminIconButton, AdminIconToolbar } from "@/components/admin/admin-icon-button";
import {
  IconLogout,
  IconPhone,
  IconSpinner,
  IconTrash,
  IconUndo,
  IconWhatsapp,
  IconUsers
} from "@/components/admin/admin-icons";
import { customerTelHref, customerWhatsappUrl } from "@/lib/customer-contact";
import { formatCurrency } from "@/lib/money";
import { CheckoutLead } from "@/types/commerce";

function statusBadgeStyle(status: CheckoutLead["status"]) {
  if (status === "converted") {
    return { background: "#DCFCE7", color: "#166534", label: "Converted" };
  }
  return { background: "#FFEDD5", color: "#9A3412", label: "Abandoned" };
}

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

function groupLeadsByLocalDay(
  sortedLeads: CheckoutLead[],
  sortBy: string
): { key: string; heading: string; leads: CheckoutLead[] }[] {
  const map = new Map<string, CheckoutLead[]>();
  for (const l of sortedLeads) {
    const key = localDateKey(l.updatedAt);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(l);
  }
  const keys = [...map.keys()].sort((a, b) => {
    if (sortBy === "oldest") return a.localeCompare(b);
    return b.localeCompare(a);
  });
  return keys.map((key) => ({
    key,
    heading: formatDayHeading(key),
    leads: map.get(key)!
  }));
}

export default function AdminLeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<CheckoutLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingLeadId, setUpdatingLeadId] = useState<string | null>(null);
  
  // Filters
  const [activeFilter, setActiveFilter] = useState<CheckoutLead["status"] | "all">("abandoned");
  const [contactableOnly, setContactableOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"latest" | "oldest" | "amountHigh" | "amountLow">("latest");
  
  const [pendingDeleteIds, setPendingDeleteIds] = useState<string[]>([]);
  const [applyingDeletes, setApplyingDeletes] = useState(false);

  const loadLeads = async () => {
    try {
      const res = await fetch("/api/checkout/lead", { cache: "no-store", credentials: "include" });
      if (res.status === 401) {
        router.replace("/login?type=admin");
        return;
      }
      if (!res.ok) {
        throw new Error("failed");
      }
      const data = (await res.json()) as { leads: CheckoutLead[] };
      setLeads(data.leads);
      setError("");
    } catch {
      setError("Could not load checkout leads.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadLeads();
  }, [router]);

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST", credentials: "include" });
    router.push("/login?type=admin");
    router.refresh();
  };

  const toggleConvertStatus = async (leadId: string, currentStatus: CheckoutLead["status"]) => {
    setUpdatingLeadId(leadId);
    try {
      const nextStatus = currentStatus === "abandoned" ? "converted" : "abandoned";
      const res = await fetch("/api/checkout/lead", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          leadId,
          status: nextStatus,
          orderId: nextStatus === "converted" ? "MANUAL" : undefined
        })
      });

      if (res.status === 401) {
        router.replace("/login?type=admin");
        return;
      }
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { message?: string } | null;
        setError(body?.message || "Failed to update lead status.");
        return;
      }

      await loadLeads();
    } catch {
      setError("Failed to update lead status.");
    } finally {
      setUpdatingLeadId(null);
    }
  };

  const togglePendingDelete = (leadId: string) => {
    setPendingDeleteIds((prev) =>
      prev.includes(leadId) ? prev.filter((id) => id !== leadId) : [...prev, leadId]
    );
    setError("");
  };

  const clearPendingDeletes = () => {
    setPendingDeleteIds([]);
    setError("");
  };

  const applyPendingDeletes = async () => {
    if (!pendingDeleteIds.length) return;
    if (!window.confirm(`Permanently delete ${pendingDeleteIds.length} lead(s)?`)) {
      return;
    }

    setApplyingDeletes(true);
    setError("");
    const ids = [...pendingDeleteIds];

    try {
      const res = await fetch("/api/checkout/lead", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ leadIds: ids })
      });
      const data = (await res.json()) as { message?: string; deleted?: string[] };

      if (!res.ok) {
        setError(data.message || "Could not delete leads.");
        if (data.deleted?.length) {
          setLeads((prev) => prev.filter((l) => !data.deleted!.includes(l.id)));
          setPendingDeleteIds(ids.filter((id) => !data.deleted!.includes(id)));
        }
        return;
      }

      const deletedSet = new Set(data.deleted ?? ids);
      setLeads((prev) => prev.filter((l) => !deletedSet.has(l.id)));
      setPendingDeleteIds([]);
    } catch {
      setError("Could not delete leads.");
    } finally {
      setApplyingDeletes(false);
    }
  };

  // Stats calculation
  const stats = useMemo(() => {
    const totalCount = leads.length;
    const convertedCount = leads.filter((l) => l.status === "converted").length;
    const abandonedCount = totalCount - convertedCount;
    const rate = totalCount > 0 ? Math.round((convertedCount / totalCount) * 100) : 0;
    return { totalCount, convertedCount, abandonedCount, rate };
  }, [leads]);

  // Filter & Search & Sort logic
  const filteredLeads = useMemo(() => {
    return leads
      .filter((lead) => (activeFilter === "all" ? true : lead.status === activeFilter))
      .filter((lead) => (contactableOnly ? !!lead.phone : true))
      .filter((lead) => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return true;
        
        const hasCustomerMatch = lead.customerName?.toLowerCase().includes(q);
        const hasPhoneMatch = lead.phone?.toLowerCase().includes(q);
        const hasAddressMatch = lead.address?.toLowerCase().includes(q);
        const hasItemMatch = lead.items.some((item) => item.name.toLowerCase().includes(q));

        return hasCustomerMatch || hasPhoneMatch || hasAddressMatch || hasItemMatch;
      })
      .sort((a, b) => {
        if (sortBy === "latest") {
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        }
        if (sortBy === "oldest") {
          return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        }
        if (sortBy === "amountHigh") {
          return b.total - a.total;
        }
        return a.total - b.total;
      });
  }, [leads, activeFilter, contactableOnly, searchQuery, sortBy]);

  const leadsByDay = useMemo(
    () => groupLeadsByLocalDay(filteredLeads, sortBy),
    [filteredLeads, sortBy]
  );

  const getWhatsAppHref = (lead: CheckoutLead) => {
    const name = lead.customerName?.trim() || "কাস্টমার";
    const itemsLabel = lead.items.map((item) => item.name).join(", ");
    
    // Friendly Benglish message for conversion follow-up
    const message = `আসসালামু আলাইকুম ${name}, Henley Zone থেকে যোগাযোগ করছি। আপনি আমাদের ওয়েবসাইট থেকে ${itemsLabel} অর্ডার করতে চেয়েছিলেন কিন্তু কোনো কারণে সম্পন্ন করতে পারেননি। আমরা কি অর্ডারটি কনফার্ম করতে সাহায্য করতে পারি?`;
    
    return customerWhatsappUrl(lead.phone || "", message);
  };

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: 24 }}>
      <div className="admin-orders-top" style={{ marginBottom: 24 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ color: "var(--color-primary-dark)", display: "inline-flex" }}>
              <IconUsers size={28} />
            </span>
            <h1 style={{ margin: 0 }}>Checkout Leads & Abandoned Carts</h1>
          </div>
          <p style={{ color: "var(--color-text-secondary)", marginTop: 6, fontSize: 14 }}>
            Track and recover customers who initiated checkout but didn't finish their purchase.
          </p>
        </div>
        <AdminIconToolbar>
          <a href="/admin" className="btn" style={{ padding: "8px 16px", textDecoration: "none", fontSize: 13, background: "#f1f5f9", color: "#334155", border: "1px solid #cbd5e1" }}>
            ← Admin Home
          </a>
          <a href="/admin/orders" className="btn" style={{ padding: "8px 16px", textDecoration: "none", fontSize: 13 }}>
            Manage Orders
          </a>
          <AdminIconButton variant="ghost" label="Log out" onClick={logout}>
            <IconLogout />
          </AdminIconButton>
        </AdminIconToolbar>
      </div>

      {/* Stats Summary Bar */}
      <section 
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 16,
          marginBottom: 24
        }}
        aria-label="Leads statistics summary"
      >
        <div style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: 14, padding: "18px 20px", display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Total Leads</span>
          <span style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--color-text-primary)" }}>{stats.totalCount}</span>
        </div>
        <div style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: 14, padding: "18px 20px", display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Abandoned Carts</span>
          <span style={{ fontSize: "1.8rem", fontWeight: 800, color: "#EA580C" }}>{stats.abandonedCount}</span>
        </div>
        <div style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: 14, padding: "18px 20px", display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Converted Leads</span>
          <span style={{ fontSize: "1.8rem", fontWeight: 800, color: "#16A34A" }}>{stats.convertedCount}</span>
        </div>
        <div style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: 14, padding: "18px 20px", display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Recovery Rate</span>
          <span style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--color-primary-dark)" }}>{stats.rate}%</span>
        </div>
      </section>

      {error ? <p style={{ color: "crimson", marginBottom: 16 }}>{error}</p> : null}

      {/* Filters and Controls */}
      <section 
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: 14,
          padding: 16,
          marginBottom: 20
        }}
        aria-label="Filter checkout leads"
      >
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => setActiveFilter("all")}
            style={{
              padding: "6px 14px",
              borderRadius: 999,
              border: "1px solid #d1d5db",
              fontSize: 13,
              fontWeight: 600,
              background: activeFilter === "all" ? "#111827" : "#fff",
              color: activeFilter === "all" ? "#fff" : "#111827",
              cursor: "pointer"
            }}
          >
            All Leads ({stats.totalCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("abandoned")}
            style={{
              padding: "6px 14px",
              borderRadius: 999,
              border: "1px solid #d1d5db",
              fontSize: 13,
              fontWeight: 600,
              background: activeFilter === "abandoned" ? "#111827" : "#fff",
              color: activeFilter === "abandoned" ? "#fff" : "#111827",
              cursor: "pointer"
            }}
          >
            Abandoned ({stats.abandonedCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("converted")}
            style={{
              padding: "6px 14px",
              borderRadius: 999,
              border: "1px solid #d1d5db",
              fontSize: 13,
              fontWeight: 600,
              background: activeFilter === "converted" ? "#111827" : "#fff",
              color: activeFilter === "converted" ? "#fff" : "#111827",
              cursor: "pointer"
            }}
          >
            Converted ({stats.convertedCount})
          </button>
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 14, alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="checkbox"
              id="chk-contactable"
              checked={contactableOnly}
              onChange={(e) => setContactableOnly(e.target.checked)}
              style={{ width: 16, height: 16, cursor: "pointer" }}
            />
            <label htmlFor="chk-contactable" style={{ fontSize: 13, fontWeight: 600, color: "#374151", cursor: "pointer" }}>
              Contactable Only (has phone)
            </label>
          </div>

          <div style={{ flexGrow: 1, minWidth: 260 }}>
            <input
              type="text"
              placeholder="Search by customer name, phone, address, product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
            />
          </div>

          <div>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, color: "#374151" }}>
              Sort:
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13, fontWeight: 500 }}
              >
                <option value="latest">Latest updated</option>
                <option value="oldest">Oldest updated</option>
                <option value="amountHigh">Cart: High to Low</option>
                <option value="amountLow">Cart: Low to High</option>
              </select>
            </label>
          </div>
        </div>
      </section>

      {/* Leads List */}
      {loading ? (
        <p>Loading checkout leads...</p>
      ) : filteredLeads.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 20px", background: "var(--color-surface)", borderRadius: 14, border: "1px solid var(--color-border)" }}>
          <p style={{ color: "var(--color-text-secondary)", margin: 0 }}>No checkout leads match your filters.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 24 }}>
          {leadsByDay.map((group) => (
            <section key={group.key}>
              <h2
                style={{
                  margin: "0 0 14px",
                  padding: "10px 14px",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  color: "#0f172a",
                  background: "linear-gradient(90deg, #f1f5f9 0%, #f8fafc 100%)",
                  borderRadius: 8,
                  border: "1px solid #e2e8f0"
                }}
              >
                {group.heading}
                <span style={{ fontWeight: 500, fontSize: 12, color: "#64748b", marginLeft: 8 }}>
                  ({group.leads.length} {group.leads.length === 1 ? "lead" : "leads"})
                </span>
              </h2>

              <div style={{ display: "grid", gap: 12 }}>
                {group.leads.map((lead) => {
                  const markedForDelete = pendingDeleteIds.includes(lead.id);
                  const badge = statusBadgeStyle(lead.status);
                  
                  return (
                    <article
                      key={lead.id}
                      style={{
                        border: markedForDelete ? "1px solid #fca5a5" : "1px solid var(--color-border)",
                        borderRadius: 12,
                        padding: 16,
                        background: markedForDelete ? "#fef2f2" : "var(--color-surface)",
                        opacity: markedForDelete ? 0.94 : 1,
                        boxShadow: "0 1px 3px rgba(0,0,0,0.02)"
                      }}
                    >
                      <div className="admin-order-head" style={{ marginBottom: 12 }}>
                        <div>
                          <span
                            style={{
                              display: "inline-block",
                              padding: "3px 8px",
                              borderRadius: 6,
                              fontSize: 11,
                              fontWeight: 700,
                              textTransform: "uppercase",
                              background: badge.background,
                              color: badge.color,
                              marginRight: 8
                            }}
                          >
                            {badge.label}
                          </span>
                          <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>
                            ID: {lead.id}
                          </span>
                        </div>
                        <AdminIconToolbar>
                          {lead.status === "abandoned" ? (
                            <button
                              type="button"
                              className="btn btn--sm"
                              onClick={() => void toggleConvertStatus(lead.id, lead.status)}
                              disabled={updatingLeadId === lead.id || markedForDelete}
                              style={{ padding: "4px 10px", fontSize: 11, background: "#dcfce7", color: "#166534", border: "1px solid #bbf7d0", borderRadius: 6, fontWeight: 700, cursor: "pointer" }}
                            >
                              {updatingLeadId === lead.id ? "Updating..." : "Mark Converted"}
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="btn btn--sm"
                              onClick={() => void toggleConvertStatus(lead.id, lead.status)}
                              disabled={updatingLeadId === lead.id || markedForDelete}
                              style={{ padding: "4px 10px", fontSize: 11, background: "#fee2e2", color: "#991b1b", border: "1px solid #fecaca", borderRadius: 6, fontWeight: 700, cursor: "pointer" }}
                            >
                              {updatingLeadId === lead.id ? "Updating..." : "Mark Abandoned"}
                            </button>
                          )}
                          <AdminIconButton
                            variant={markedForDelete ? "warning" : "danger"}
                            label={markedForDelete ? "Undo delete mark" : "Mark lead for deletion"}
                            onClick={() => togglePendingDelete(lead.id)}
                            disabled={applyingDeletes || updatingLeadId === lead.id}
                          >
                            {markedForDelete ? <IconUndo /> : <IconTrash />}
                          </AdminIconButton>
                        </AdminIconToolbar>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
                        {/* Customer Information Column */}
                        <div>
                          <p style={{ margin: "0 0 6px" }}>
                            <strong>Customer Name:</strong> {lead.customerName || <span style={{ color: "#94a3b8", fontStyle: "italic" }}>Not provided</span>}
                          </p>
                          <p style={{ margin: "0 0 6px" }}>
                            <strong>Phone:</strong> {lead.phone || <span style={{ color: "#94a3b8", fontStyle: "italic" }}>Not provided</span>}
                          </p>
                          
                          {/* Call / WhatsApp actions if phone exists */}
                          {lead.phone && (
                            <AdminIconToolbar className="admin-order-contact">
                              {customerTelHref(lead.phone) && (
                                <AdminIconButton
                                  href={customerTelHref(lead.phone)}
                                  variant="call"
                                  label={`Call ${lead.customerName || "Customer"}`}
                                >
                                  <IconPhone />
                                </AdminIconButton>
                              )}
                              {getWhatsAppHref(lead) && (
                                <AdminIconButton
                                  href={getWhatsAppHref(lead)}
                                  variant="whatsapp"
                                  label={`WhatsApp ${lead.customerName || "Customer"}`}
                                  external
                                >
                                  <IconWhatsapp />
                                </AdminIconButton>
                              )}
                            </AdminIconToolbar>
                          )}

                          <p style={{ margin: "0 0 6px" }}>
                            <strong>Address:</strong> {lead.address || <span style={{ color: "#94a3b8", fontStyle: "italic" }}>Not provided</span>}
                          </p>
                          <p style={{ margin: "0 0 6px" }}>
                            <strong>Note:</strong> {lead.note || <span style={{ color: "#94a3b8", fontStyle: "italic" }}>None</span>}
                          </p>
                          {lead.deliveryArea && (
                            <p style={{ margin: "0 0 6px" }}>
                              <strong>Delivery Area:</strong> {lead.deliveryArea === "inside" ? "Dhaka City" : "Outside Dhaka"}
                            </p>
                          )}
                          <p style={{ margin: "0", fontSize: 12, color: "var(--color-text-secondary)" }}>
                            Last update: {new Date(lead.updatedAt).toLocaleString()}
                          </p>
                          {lead.convertedOrderId && (
                            <p style={{ margin: "4px 0 0", fontSize: 12, color: "#16a34a", fontWeight: 600 }}>
                              Associated Order ID: {lead.convertedOrderId}
                            </p>
                          )}
                        </div>

                        {/* Cart Items Column */}
                        <div style={{ background: "#f8fafc", borderRadius: 8, padding: 12, border: "1px solid #e2e8f0" }}>
                          <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-text-secondary)" }}>
                            Abandoned Products ({lead.items.length})
                          </span>
                          <ul style={{ margin: "8px 0 0", paddingLeft: 16, fontSize: 13, lineHeight: 1.5 }}>
                            {lead.items.map((item) => (
                              <li key={item.key || item.productId}>
                                <strong>{formatOrderItemLabel(item)}</strong> · Qty {item.quantity} · {formatCurrency(item.price * item.quantity, defaultBusiness.currency)}
                              </li>
                            ))}
                          </ul>
                          <div style={{ marginTop: 12, paddingTop: 8, borderTop: "1px dashed #cbd5e1", display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                            <span>Total Value:</span>
                            <strong>{formatCurrency(lead.total, defaultBusiness.currency)}</strong>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* Bulk Delete Bar */}
      {pendingDeleteIds.length > 0 ? (
        <div
          style={{
            position: "sticky",
            bottom: 0,
            marginTop: 24,
            padding: "14px 16px",
            borderRadius: 10,
            border: "1px solid #fca5a5",
            background: "#fff",
            boxShadow: "0 -8px 24px rgba(0,0,0,0.08)",
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 10
          }}
        >
          <p style={{ margin: 0, flex: "1 1 200px", color: "#7f1d1d", fontSize: 14 }}>
            <strong>{pendingDeleteIds.length}</strong> lead(s) marked for removal.
          </p>
          <AdminIconToolbar>
            <AdminIconButton
              variant="ghost"
              label="Clear marks"
              onClick={clearPendingDeletes}
              disabled={applyingDeletes}
            >
              <IconUndo />
            </AdminIconButton>
            <AdminIconButton
              variant="danger"
              label={applyingDeletes ? "Deleting leads" : "Save deletions"}
              onClick={() => void applyPendingDeletes()}
              disabled={applyingDeletes}
            >
              {applyingDeletes ? <IconSpinner /> : <IconTrash />}
            </AdminIconButton>
          </AdminIconToolbar>
        </div>
      ) : null}
    </main>
  );
}
