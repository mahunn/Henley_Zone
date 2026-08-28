"use client";

import React, { useState, useEffect } from "react";
import { CartItem, Order } from "@/types/commerce";
import { IconSpinner } from "@/components/admin/admin-icons";
import { normalizePhoneNumber } from "@/lib/phone-normalizer";

interface EditOrderModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: (updatedOrder: Order) => void;
  onDelete?: (orderId: string) => void;
}

export function EditOrderModal({
  order,
  isOpen,
  onClose,
  onSaved,
  onDelete
}: EditOrderModalProps) {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<Order["status"]>("pending");
  const [paymentMethod, setPaymentMethod] = useState<Order["paymentMethod"]>("COD");
  
  // Courier fields
  const [courier, setCourier] = useState("pathao");
  const [consignmentId, setConsignmentId] = useState("");
  const [courierStatus, setCourierStatus] = useState("Pending");
  const [courierDeliveryFee, setCourierDeliveryFee] = useState<number | string>("");

  // Items
  const [items, setItems] = useState<CartItem[]>([]);
  const [deliveryFee, setDeliveryFee] = useState<number>(130);
  const [manualSubtotal, setManualSubtotal] = useState<number | null>(null);
  const [manualTotal, setManualTotal] = useState<number | null>(null);
  const [autoCalculate, setAutoCalculate] = useState(true);

  // UI state
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  // Populate form when modal opens with order
  useEffect(() => {
    if (order) {
      setCustomerName(order.customerName || "");
      setPhone(order.phone || "");
      setAddress(order.address || "");
      setNote(order.note || "");
      setStatus(order.status || "pending");
      setPaymentMethod(order.paymentMethod || "COD");
      
      setCourier(order.courier || "pathao");
      setConsignmentId(order.consignmentId || "");
      setCourierStatus(order.courierStatus || "Pending");
      setCourierDeliveryFee(order.courierDeliveryFee ?? "");

      setItems(order.items ? JSON.parse(JSON.stringify(order.items)) : []);
      setDeliveryFee(order.deliveryFee ?? 130);
      setManualSubtotal(order.subtotal ?? 0);
      setManualTotal(order.total ?? 0);
      setAutoCalculate(true);
      setError("");
    }
  }, [order, isOpen]);

  if (!isOpen || !order) return null;

  // Real-time calculations
  const calculatedSubtotal = items.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );
  const effectiveSubtotal = autoCalculate ? calculatedSubtotal : (manualSubtotal ?? 0);
  const effectiveTotal = autoCalculate ? effectiveSubtotal + (Number(deliveryFee) || 0) : (manualTotal ?? 0);

  // Item modifications
  const handleItemChange = (index: number, field: keyof CartItem, value: any) => {
    setItems((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleItemQtyChange = (index: number, delta: number) => {
    setItems((prev) => {
      const copy = [...prev];
      const newQty = Math.max(1, (copy[index].quantity || 1) + delta);
      copy[index] = { ...copy[index], quantity: newQty };
      return copy;
    });
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddItem = () => {
    const newItem: CartItem = {
      key: `custom_${Date.now()}`,
      productId: "custom",
      name: "New Product",
      price: 550,
      quantity: 1,
      selectedColor: "",
      selectedSize: "42"
    };
    setItems((prev) => [...prev, newItem]);
  };

  // Submit Handler
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!customerName.trim()) {
      setError("Customer name is required.");
      return;
    }
    if (!phone.trim()) {
      setError("Customer phone number is required.");
      return;
    }
    if (!address.trim()) {
      setError("Delivery address is required.");
      return;
    }
    if (items.length === 0) {
      setError("Order must contain at least 1 item.");
      return;
    }

    const cleanedPhone = normalizePhoneNumber(phone);
    const updatedOrder: Order = {
      ...order,
      customerName: customerName.trim(),
      phone: cleanedPhone,
      address: address.trim(),
      note: note.trim() || undefined,
      status,
      paymentMethod,
      courier: courier.trim() || "pathao",
      consignmentId: consignmentId.trim() || undefined,
      courierStatus: courierStatus.trim() || undefined,
      courierDeliveryFee: courierDeliveryFee !== "" ? Number(courierDeliveryFee) : undefined,
      items,
      subtotal: effectiveSubtotal,
      deliveryFee: Number(deliveryFee) || 0,
      total: effectiveTotal
    };

    try {
      setSaving(true);
      const res = await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updatedOrder)
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.message || "Failed to save order modifications.");
        return;
      }

      onSaved(data.order || updatedOrder);
      onClose();
    } catch (err) {
      console.error("Order save error:", err);
      setError("Network error while saving order.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete Order #${order.id}? This cannot be undone.`)) {
      return;
    }

    try {
      setDeleting(true);
      const res = await fetch("/api/orders", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ orderIds: [order.id] })
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Failed to delete order.");
        return;
      }

      if (onDelete) {
        onDelete(order.id);
      }
      onClose();
    } catch {
      setError("Failed to delete order.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.65)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: 16,
        overflowY: "auto"
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !saving) {
          onClose();
        }
      }}
    >
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 14,
          maxWidth: 720,
          width: "100%",
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          overflow: "hidden"
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid #E2E8F0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#F8FAFC"
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 700, color: "#0F172A" }}>
              ✏️ Edit Order #{order.id}
            </h2>
            <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>
              Modify customer details, items, quantities, pricing, and courier consignment.
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            style={{
              background: "transparent",
              border: "none",
              fontSize: 22,
              cursor: "pointer",
              color: "#64748B",
              lineHeight: 1
            }}
          >
            ✕
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSave} style={{ overflowY: "auto", padding: 20, flex: 1 }}>
          {error && (
            <div
              style={{
                padding: "10px 14px",
                background: "#FEF2F2",
                border: "1px solid #FECACA",
                borderRadius: 8,
                color: "#B91C1C",
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 16
              }}
            >
              ⚠ {error}
            </div>
          )}

          {/* Section: Customer Information */}
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", color: "#475569", marginBottom: 10, letterSpacing: 0.5 }}>
              👤 Customer Details
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                  Customer Name *
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    border: "1px solid #CBD5E1",
                    borderRadius: 6,
                    fontSize: 13
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="01XXXXXXXXX"
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    border: "1px solid #CBD5E1",
                    borderRadius: 6,
                    fontSize: 13
                  }}
                />
              </div>
            </div>

            <div style={{ marginTop: 10 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                Delivery Address *
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                rows={2}
                placeholder="House, Road, Area, Thana, District"
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  border: "1px solid #CBD5E1",
                  borderRadius: 6,
                  fontSize: 13
                }}
              />
            </div>

            <div style={{ marginTop: 10 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                Admin / Customer Note
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Special delivery instructions or order remarks"
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  border: "1px solid #CBD5E1",
                  borderRadius: 6,
                  fontSize: 13
                }}
              />
            </div>
          </div>

          {/* Section: Status & Payment */}
          <div style={{ marginBottom: 20, padding: 14, background: "#F8FAFC", borderRadius: 10, border: "1px solid #E2E8F0" }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", color: "#475569", marginBottom: 10, letterSpacing: 0.5 }}>
              ⚙️ Order Status & Payment
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                  Order Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Order["status"])}
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    border: "1px solid #CBD5E1",
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: 700
                  }}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">In Progress (Confirmed)</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as Order["paymentMethod"])}
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    border: "1px solid #CBD5E1",
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: 600
                  }}
                >
                  <option value="COD">Cash On Delivery (COD)</option>
                  <option value="bKash" disabled={false}>bKash</option>
                  <option value="Nagad" disabled={false}>Nagad</option>
                  <option value="Card" disabled={false}>Credit / Debit Card</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section: Items / Variant Editor */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <h3 style={{ margin: 0, fontSize: 13, fontWeight: 700, textTransform: "uppercase", color: "#475569", letterSpacing: 0.5 }}>
                🛍️ Order Items ({items.length})
              </h3>
              <button
                type="button"
                onClick={handleAddItem}
                style={{
                  padding: "4px 10px",
                  background: "#E0F2FE",
                  color: "#0284C7",
                  border: "1px solid #BAE6FD",
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer"
                }}
              >
                + Add Item
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {items.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: 12,
                    background: "#FFFFFF",
                    border: "1.5px solid #E2E8F0",
                    borderRadius: 8,
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr auto",
                    gap: 8,
                    alignItems: "center"
                  }}
                >
                  <div>
                    <label style={{ display: "block", fontSize: 10, color: "#64748B", fontWeight: 600 }}>Product Name</label>
                    <input
                      type="text"
                      value={item.name || ""}
                      onChange={(e) => handleItemChange(idx, "name", e.target.value)}
                      style={{ width: "100%", padding: "4px 8px", border: "1px solid #CBD5E1", borderRadius: 4, fontSize: 12, fontWeight: 600 }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: 10, color: "#64748B", fontWeight: 600 }}>Color</label>
                    <input
                      type="text"
                      value={item.selectedColor || ""}
                      placeholder="e.g. Maroon"
                      onChange={(e) => handleItemChange(idx, "selectedColor", e.target.value)}
                      style={{ width: "100%", padding: "4px 8px", border: "1px solid #CBD5E1", borderRadius: 4, fontSize: 12 }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: 10, color: "#64748B", fontWeight: 600 }}>Size</label>
                    <input
                      type="text"
                      value={item.selectedSize || ""}
                      placeholder="e.g. 42"
                      onChange={(e) => handleItemChange(idx, "selectedSize", e.target.value)}
                      style={{ width: "100%", padding: "4px 8px", border: "1px solid #CBD5E1", borderRadius: 4, fontSize: 12 }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: 10, color: "#64748B", fontWeight: 600 }}>Unit Price (৳)</label>
                    <input
                      type="number"
                      value={item.price ?? 0}
                      onChange={(e) => handleItemChange(idx, "price", Number(e.target.value))}
                      style={{ width: "100%", padding: "4px 8px", border: "1px solid #CBD5E1", borderRadius: 4, fontSize: 12, fontWeight: 700 }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: 10, color: "#64748B", fontWeight: 600 }}>Quantity</label>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <button
                        type="button"
                        onClick={() => handleItemQtyChange(idx, -1)}
                        style={{ width: 22, height: 22, border: "1px solid #CBD5E1", background: "#F1F5F9", borderRadius: 4, cursor: "pointer", fontWeight: 700 }}
                      >
                        −
                      </button>
                      <span style={{ fontSize: 12, fontWeight: 700, minWidth: 16, textAlign: "center" }}>
                        {item.quantity || 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleItemQtyChange(idx, 1)}
                        style={{ width: 22, height: 22, border: "1px solid #CBD5E1", background: "#F1F5F9", borderRadius: 4, cursor: "pointer", fontWeight: 700 }}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      title="Remove Item"
                      style={{
                        padding: "6px 8px",
                        background: "#FEE2E2",
                        color: "#DC2626",
                        border: "none",
                        borderRadius: 6,
                        cursor: "pointer",
                        fontSize: 13
                      }}
                    >
                      🗑
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Pricing & Total Breakdown */}
          <div style={{ marginBottom: 20, padding: 14, background: "#F1F5F9", borderRadius: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <h3 style={{ margin: 0, fontSize: 13, fontWeight: 700, textTransform: "uppercase", color: "#334155" }}>
                💰 Order Financials
              </h3>
              <label style={{ fontSize: 11, fontWeight: 600, color: "#475569", display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={autoCalculate}
                  onChange={(e) => setAutoCalculate(e.target.checked)}
                />
                Auto-calculate totals
              </label>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4 }}>
                  Subtotal (৳)
                </label>
                <input
                  type="number"
                  value={effectiveSubtotal}
                  disabled={autoCalculate}
                  onChange={(e) => setManualSubtotal(Number(e.target.value))}
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    border: "1px solid #CBD5E1",
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: 700,
                    background: autoCalculate ? "#E2E8F0" : "#FFFFFF"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4 }}>
                  Delivery Fee (৳)
                </label>
                <input
                  type="number"
                  value={deliveryFee}
                  onChange={(e) => setDeliveryFee(Number(e.target.value))}
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    border: "1px solid #CBD5E1",
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: 700
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#0F172A", marginBottom: 4 }}>
                  Total Payable (৳)
                </label>
                <input
                  type="number"
                  value={effectiveTotal}
                  disabled={autoCalculate}
                  onChange={(e) => setManualTotal(Number(e.target.value))}
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    border: "2px solid #0284C7",
                    borderRadius: 6,
                    fontSize: 14,
                    fontWeight: 800,
                    color: "#0369A1",
                    background: autoCalculate ? "#E0F2FE" : "#FFFFFF"
                  }}
                />
              </div>
            </div>
          </div>

          {/* Section: Courier & Consignment */}
          <div style={{ marginBottom: 10, padding: 14, background: "#F8FAFC", borderRadius: 10, border: "1px solid #E2E8F0" }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", color: "#475569", marginBottom: 10, letterSpacing: 0.5 }}>
              🚚 Courier & Consignment Info
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                  Courier Service
                </label>
                <select
                  value={courier}
                  onChange={(e) => setCourier(e.target.value)}
                  style={{ width: "100%", padding: "8px 10px", border: "1px solid #CBD5E1", borderRadius: 6, fontSize: 13 }}
                >
                  <option value="pathao">Pathao Courier</option>
                  <option value="steadfast">Steadfast Courier</option>
                  <option value="redx">RedX</option>
                  <option value="paperfly">Paperfly</option>
                  <option value="manual">Manual / Own Delivery</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                  Consignment ID
                </label>
                <input
                  type="text"
                  value={consignmentId}
                  placeholder="e.g. DS12345678"
                  onChange={(e) => setConsignmentId(e.target.value)}
                  style={{ width: "100%", padding: "8px 10px", border: "1px solid #CBD5E1", borderRadius: 6, fontSize: 13, fontWeight: 600 }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                  Courier Status
                </label>
                <input
                  type="text"
                  value={courierStatus}
                  placeholder="Pending / In Transit / Delivered"
                  onChange={(e) => setCourierStatus(e.target.value)}
                  style={{ width: "100%", padding: "8px 10px", border: "1px solid #CBD5E1", borderRadius: 6, fontSize: 13 }}
                />
              </div>
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div
          style={{
            padding: "14px 20px",
            borderTop: "1px solid #E2E8F0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#F8FAFC"
          }}
        >
          <button
            type="button"
            onClick={handleDelete}
            disabled={saving || deleting}
            style={{
              padding: "8px 14px",
              background: "#FEE2E2",
              color: "#DC2626",
              border: "1px solid #FECACA",
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            {deleting ? "Deleting..." : "🗑 Delete Order"}
          </button>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              style={{
                padding: "8px 16px",
                background: "#FFFFFF",
                color: "#475569",
                border: "1px solid #CBD5E1",
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving || deleting}
              style={{
                padding: "8px 20px",
                background: "#0284C7",
                color: "#FFFFFF",
                border: "none",
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 6
              }}
            >
              {saving && <IconSpinner size={16} />}
              {saving ? "Saving..." : "💾 Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
