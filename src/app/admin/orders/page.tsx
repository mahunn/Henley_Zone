"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  generateDetailedSpreadsheetCsv,
  generatePathaoCourierCsv,
  generateSteadfastCourierCsv,
  downloadBlobFile
} from "@/lib/courier-export";
import { IconSpinner, IconTruck } from "@/components/admin/admin-icons";
import { CartItem, Order } from "@/types/commerce";
import { EditOrderModal } from "./edit-order-modal";

interface PathaoStore {
  store_id: number;
  store_name: string;
  store_address?: string;
}

interface PathaoCity {
  city_id: number;
  city_name: string;
}

interface PathaoZone {
  zone_id: number;
  zone_name: string;
}

interface PathaoArea {
  area_id: number;
  area_name: string;
}

interface PathaoStatusInfo {
  configured: boolean;
  connected: boolean;
  environment?: "sandbox" | "production";
  baseUrl?: string;
  stores?: PathaoStore[];
  defaultStoreId?: number | string | null;
  message?: string;
}

function normalizePhoneDigits(phone: string | null | undefined): string {
  if (!phone) return "";
  const digits = String(phone).replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("880")) return digits;
  if (digits.startsWith("0")) return `880${digits.slice(1)}`;
  if (digits.length === 10 && digits.startsWith("1")) return `880${digits}`;
  return digits;
}

function formatItemLabel(item: CartItem | null | undefined): string {
  if (!item) return "Product";
  const name = (typeof item.name === "string" ? item.name : "Product").trim();
  const extras: string[] = [];

  const color = typeof item.selectedColor === "string" ? item.selectedColor.trim() : "";
  if (color && !name.toLowerCase().includes(color.toLowerCase())) {
    extras.push(color);
  }

  const size = typeof item.selectedSize === "string" ? item.selectedSize.trim() : "";
  if (size && !/\bsize\s*[\d]+/i.test(name)) {
    extras.push(`Size ${size}`);
  }

  if (extras.length === 0) return name;
  return `${name} (${extras.join(", ")})`;
}

function formatTaka(amount: number | null | undefined): string {
  const num = typeof amount === "number" && !Number.isNaN(amount) ? amount : 0;
  return `৳${num.toLocaleString("en-US")}`;
}

function safeDate(val: string | undefined | null): Date {
  if (!val) return new Date();
  const d = new Date(val);
  return Number.isNaN(d.getTime()) ? new Date() : d;
}

export default function AdminOrdersPage() {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [error, setError] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  // Status Filter Tab
  const [activeTab, setActiveTab] = useState<string>("all");

  // Advanced Filters
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
  const [filterUserName, setFilterUserName] = useState("");
  const [filterUserPhone, setFilterUserPhone] = useState("");
  const [filterOrderId, setFilterOrderId] = useState("");
  const [filterPaymentStatus, setFilterPaymentStatus] = useState("all");
  const [filterPathaoStatus, setFilterPathaoStatus] = useState("all");

  // Multi-Select Checkboxes
  const [selectedOrderIds, setSelectedOrderIds] = useState<Set<string>>(new Set());

  // Pathao API State
  const [pathaoStatus, setPathaoStatus] = useState<PathaoStatusInfo | null>(null);
  const [testingPathao, setTestingPathao] = useState(false);
  const [cities, setCities] = useState<PathaoCity[]>([]);
  const [zones, setZones] = useState<PathaoZone[]>([]);
  const [areas, setAreas] = useState<PathaoArea[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(false);

  // Modals & Bulk Execution States
  const [dispatchModalOrder, setDispatchModalOrder] = useState<Order | null>(null);
  const [bulkDispatchModal, setBulkDispatchModal] = useState(false);
  const [bulkProgress, setBulkProgress] = useState<{ current: number; total: number; message: string } | null>(null);
  const [trackModalConsignment, setTrackModalConsignment] = useState<{ consignmentId: string; orderId?: string } | null>(null);
  const [liveTrackingInfo, setLiveTrackingInfo] = useState<Record<string, unknown> | null>(null);
  const [loadingTrack, setLoadingTrack] = useState(false);

  // Single Dispatch Form
  const [selectedStoreId, setSelectedStoreId] = useState<string | number>("");
  const [selectedCityId, setSelectedCityId] = useState<number>(1); // Default: Dhaka
  const [selectedZoneId, setSelectedZoneId] = useState<number>(0);
  const [selectedAreaId, setSelectedAreaId] = useState<number>(0);
  const [dispatchWeight, setDispatchWeight] = useState<number>(0.5);
  const [dispatchCodAmount, setDispatchCodAmount] = useState<number>(0);
  const [dispatchInstruction, setDispatchInstruction] = useState<string>("");
  const [dispatchDescription, setDispatchDescription] = useState<string>("");
  const [dispatching, setDispatching] = useState(false);
  const [dispatchError, setDispatchError] = useState("");
  const [dispatchSuccess, setDispatchSuccess] = useState("");

  // Edit Order Modal State
  const [editOrder, setEditOrder] = useState<Order | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);

  const showToast = useCallback((text: string, type: "success" | "error" | "info" = "success") => {
    setToastMessage({ type, text });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  }, []);

  const openEditModal = (order: Order) => {
    setEditOrder(order);
    setIsEditModalOpen(true);
  };

  const handleOrderSaved = (updatedOrder: Order) => {
    setOrders((prev) => {
      const existing = prev.find((o) => o.id === updatedOrder.id);
      if (existing) {
        return prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o));
      }
      return [updatedOrder, ...prev];
    });
    showToast(`Order #${updatedOrder.id} updated successfully!`);
    void loadOrders();
  };

  const handleOrderDeleted = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    showToast(`Order #${orderId} deleted.`);
  };

  const handleCreateNewOrder = () => {
    const newOrderTemplate: Order = {
      id: `ORD-${Date.now().toString().slice(-6)}`,
      customerName: "",
      phone: "",
      address: "",
      items: [
        {
          key: `item_${Date.now()}`,
          productId: "custom",
          name: "Henley Zone Apparel",
          price: 550,
          quantity: 1,
          selectedColor: "Maroon",
          selectedSize: "42"
        }
      ],
      subtotal: 550,
      deliveryFee: 130,
      total: 680,
      paymentMethod: "COD",
      status: "pending",
      createdAt: new Date().toISOString()
    };
    setEditOrder(newOrderTemplate);
    setIsEditModalOpen(true);
  };

  const verify = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/session", { method: "GET", cache: "no-store", credentials: "include" });
      if (res.status === 401) {
        if (typeof window !== "undefined") {
          window.location.href = "/login?type=admin";
        }
        return;
      }
      setAuthorized(res.ok);
    } catch {
      setAuthorized(false);
    }
  }, []);

  useEffect(() => {
    void verify();
  }, [verify]);

  const loadOrders = useCallback(async () => {
    setLoadingOrders(true);
    try {
      const res = await fetch("/api/orders", { cache: "no-store", credentials: "include" });
      if (res.status === 401) {
        if (typeof window !== "undefined") {
          window.location.href = "/login?type=admin";
        }
        return;
      }
      if (!res.ok) throw new Error("failed");
      const data = (await res.json()) as { orders?: Order[] };
      setOrders(Array.isArray(data.orders) ? data.orders : []);
      setError("");
    } catch {
      setError("Could not load orders.");
    } finally {
      setLoadingOrders(false);
    }
  }, []);

  const checkPathaoConnection = useCallback(async () => {
    try {
      setTestingPathao(true);
      const res = await fetch("/api/admin/pathao", { method: "GET", cache: "no-store", credentials: "include" });
      if (res.ok) {
        const data = (await res.json()) as PathaoStatusInfo;
        setPathaoStatus(data);
        if (data.defaultStoreId) {
          setSelectedStoreId(data.defaultStoreId);
        }
      }
    } catch (e) {
      console.warn("Could not check Pathao connection:", e);
    } finally {
      setTestingPathao(false);
    }
  }, []);

  useEffect(() => {
    if (authorized) {
      void loadOrders();
      void checkPathaoConnection();
    }
  }, [authorized, loadOrders, checkPathaoConnection]);

  // Load cities once authorized
  useEffect(() => {
    if (!authorized) return;
    async function fetchCities() {
      try {
        const res = await fetch("/api/admin/pathao/locations?type=cities", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.cities)) {
            setCities(data.cities);
          }
        }
      } catch (e) {
        console.warn("Could not fetch Pathao cities:", e);
      }
    }
    void fetchCities();
  }, [authorized]);

  // Load zones when selectedCityId changes
  useEffect(() => {
    if (!selectedCityId) {
      setZones([]);
      return;
    }
    async function fetchZones() {
      setLoadingLocations(true);
      try {
        const res = await fetch(`/api/admin/pathao/locations?type=zones&city_id=${selectedCityId}`, { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          const list: PathaoZone[] = Array.isArray(data.zones) ? data.zones : [];
          setZones(list);
          if (list.length > 0) {
            setSelectedZoneId(list[0].zone_id);
          } else {
            setSelectedZoneId(0);
          }
        }
      } catch (e) {
        console.warn("Could not fetch Pathao zones:", e);
      } finally {
        setLoadingLocations(false);
      }
    }
    void fetchZones();
  }, [selectedCityId]);

  // Load areas when selectedZoneId changes
  useEffect(() => {
    if (!selectedZoneId) {
      setAreas([]);
      return;
    }
    async function fetchAreas() {
      try {
        const res = await fetch(`/api/admin/pathao/locations?type=areas&zone_id=${selectedZoneId}`, { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setAreas(Array.isArray(data.areas) ? data.areas : []);
          setSelectedAreaId(0);
        }
      } catch (e) {
        console.warn("Could not fetch Pathao areas:", e);
      }
    }
    void fetchAreas();
  }, [selectedZoneId]);

  // Filtered Orders Logic
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // 1. Tab Status
      if (activeTab === "pending" && (order.status || "").toLowerCase() !== "pending") return false;
      if (activeTab === "in_progress" && !["confirmed", "processing", "in progress"].includes((order.status || "").toLowerCase())) return false;
      if (activeTab === "delivered" && (order.status || "").toLowerCase() !== "delivered") return false;
      if (activeTab === "cancelled" && !["cancelled", "canceled"].includes((order.status || "").toLowerCase())) return false;

      // 2. Start / End Date
      if (filterStartDate) {
        const orderDate = safeDate(order.createdAt).toISOString().slice(0, 10);
        if (orderDate < filterStartDate) return false;
      }
      if (filterEndDate) {
        const orderDate = safeDate(order.createdAt).toISOString().slice(0, 10);
        if (orderDate > filterEndDate) return false;
      }

      // 3. User Name
      if (filterUserName.trim()) {
        const q = filterUserName.trim().toLowerCase();
        if (!(order.customerName || "").toLowerCase().includes(q)) return false;
      }

      // 4. User Phone
      if (filterUserPhone.trim()) {
        const q = filterUserPhone.trim().toLowerCase();
        if (!(order.phone || "").toLowerCase().includes(q)) return false;
      }

      // 5. Order ID
      if (filterOrderId.trim()) {
        const q = filterOrderId.trim().toLowerCase();
        if (!(order.id || "").toLowerCase().includes(q) && !(order.consignmentId || "").toLowerCase().includes(q)) return false;
      }

      // 6. Pathao Status
      if (filterPathaoStatus !== "all") {
        if (filterPathaoStatus === "not_sent" && order.consignmentId) return false;
        if (filterPathaoStatus === "sent" && !order.consignmentId) return false;
      }

      return true;
    });
  }, [orders, activeTab, filterStartDate, filterEndDate, filterUserName, filterUserPhone, filterOrderId, filterPathaoStatus]);

  // Selection Checkbox Helpers
  const isAllSelected = useMemo(() => {
    if (filteredOrders.length === 0) return false;
    return filteredOrders.every((o) => selectedOrderIds.has(o.id));
  }, [filteredOrders, selectedOrderIds]);

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedOrderIds(new Set());
    } else {
      setSelectedOrderIds(new Set(filteredOrders.map((o) => o.id)));
    }
  };

  const toggleSelectOrder = (id: string) => {
    const next = new Set(selectedOrderIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedOrderIds(next);
  };

  // Status Counts
  const counts = {
    all: orders.length,
    pending: orders.filter((o) => (o.status || "").toLowerCase() === "pending").length,
    in_progress: orders.filter((o) => ["confirmed", "processing", "in progress"].includes((o.status || "").toLowerCase())).length,
    delivered: orders.filter((o) => (o.status || "").toLowerCase() === "delivered").length,
    cancelled: orders.filter((o) => ["cancelled", "canceled"].includes((o.status || "").toLowerCase())).length
  };

  // Update Status Single
  const updateStatus = async (orderId: string, status: string) => {
    setUpdatingOrderId(orderId);
    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ orderId, status })
      });
      if (res.ok) {
        await loadOrders();
        showToast(`Order status updated to ${status.toUpperCase()}`);
      } else {
        showToast("Failed to update status", "error");
      }
    } catch {
      showToast("Network error updating status", "error");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Delete Selected Orders
  const handleDeleteSelected = async () => {
    const ids = Array.from(selectedOrderIds);
    if (ids.length === 0) {
      showToast("No orders selected for deletion.", "info");
      return;
    }
    if (!window.confirm(`Are you sure you want to permanently delete ${ids.length} selected order(s)?`)) {
      return;
    }

    try {
      const res = await fetch("/api/orders", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ orderIds: ids })
      });
      if (res.ok) {
        showToast(`Successfully deleted ${ids.length} order(s).`);
        setSelectedOrderIds(new Set());
        await loadOrders();
      } else {
        showToast("Failed to delete orders", "error");
      }
    } catch {
      showToast("Error deleting orders", "error");
    }
  };

  // Print Invoices / Packing Slips for Selected Orders
  const handlePrintSelected = () => {
    const selectedOrders = orders.filter((o) => selectedOrderIds.has(o.id));
    if (selectedOrders.length === 0) {
      showToast("Please select at least one order to print.", "info");
      return;
    }

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow popups to print invoices.");
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Henley Zone - Packing Slips</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; color: #1e293b; background: #fff; }
          .slip { border: 2px dashed #94a3b8; padding: 20px; border-radius: 8px; margin-bottom: 30px; page-break-after: always; max-width: 600px; margin-left: auto; margin-right: auto; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #0f172a; padding-bottom: 10px; margin-bottom: 12px; }
          .title { font-size: 18px; font-weight: bold; color: #0f172a; }
          .meta { font-size: 13px; color: #475569; }
          .customer { background: #f8fafc; padding: 12px; border-radius: 6px; margin-bottom: 14px; font-size: 13px; }
          .items-table { width: 100%; border-collapse: collapse; margin-bottom: 14px; font-size: 13px; }
          .items-table th { background: #f1f5f9; text-align: left; padding: 6px 8px; border: 1px solid #cbd5e1; }
          .items-table td { padding: 6px 8px; border: 1px solid #cbd5e1; }
          .total-box { text-align: right; font-size: 16px; font-weight: bold; color: #0f172a; margin-top: 10px; }
          .footer { margin-top: 15px; font-size: 11px; text-align: center; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 8px; }
          @media print {
            body { padding: 0; }
            .slip { border: 1px solid #000; }
          }
        </style>
      </head>
      <body>
        ${selectedOrders
          .map(
            (order) => `
          <div class="slip">
            <div class="header">
              <div>
                <div class="title">HENLEY ZONE</div>
                <div class="meta">Invoice / Delivery Slip</div>
              </div>
              <div style="text-align: right;">
                <div style="font-weight: bold;">Order: ${order.id}</div>
                <div class="meta">${safeDate(order.createdAt).toLocaleDateString("en-GB")}</div>
                ${order.consignmentId ? `<div style="color: #ea580c; font-weight: bold;">Pathao ID: ${order.consignmentId}</div>` : ""}
              </div>
            </div>

            <div class="customer">
              <div><strong>Recipient:</strong> ${order.customerName}</div>
              <div><strong>Phone:</strong> ${order.phone}</div>
              <div><strong>Address:</strong> ${order.address}</div>
              ${order.note ? `<div><strong>Note:</strong> ${order.note}</div>` : ""}
            </div>

            <table class="items-table">
              <thead>
                <tr>
                  <th>Product & Variant</th>
                  <th style="width: 60px; text-align: center;">Qty</th>
                  <th style="width: 90px; text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${(order.items || [])
                  .map(
                    (it) => `
                  <tr>
                    <td>${formatItemLabel(it)}</td>
                    <td style="text-align: center;">${it.quantity || 1}</td>
                    <td style="text-align: right;">৳${((it.price || 0) * (it.quantity || 1)).toLocaleString()}</td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>

            <div class="total-box">
              <div>Total Payable (COD): ৳${(order.total || 0).toLocaleString()}</div>
            </div>

            <div class="footer">
              Thank you for shopping with Henley Zone. Hotline / WhatsApp Support: +880 1785-585595
            </div>
          </div>
        `
          )
          .join("")}
        <script>
          window.onload = function() { window.print(); };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  // Open Single Dispatch Modal
  const openDispatchModal = (order: Order) => {
    setDispatchModalOrder(order);
    setDispatchCodAmount(order.total || 0);
    setDispatchWeight(0.5);
    setDispatchInstruction(order.note || "");
    setDispatchError("");
    setDispatchSuccess("");

    const itemsSummary = (order.items || [])
      .map((item) => `${formatItemLabel(item)} x${item.quantity || 1}`)
      .join(", ");
    setDispatchDescription(itemsSummary || "Henley Zone Apparel");

    // Smart Guess City
    const addr = (order.address || "").toLowerCase();
    const matchedCity = cities.find((c) => addr.includes(c.city_name.toLowerCase().trim()));
    if (matchedCity) {
      setSelectedCityId(matchedCity.city_id);
    } else {
      setSelectedCityId(1); // Dhaka default
    }
  };

  // Confirm Single Dispatch
  const handleConfirmSingleDispatch = async () => {
    if (!dispatchModalOrder) return;
    if (!selectedCityId || !selectedZoneId) {
      setDispatchError("Please select a City and Zone for Pathao Courier.");
      return;
    }

    setDispatching(true);
    setDispatchError("");
    setDispatchSuccess("");

    try {
      const res = await fetch("/api/admin/pathao/create-parcel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          orderId: dispatchModalOrder.id,
          storeId: selectedStoreId || pathaoStatus?.defaultStoreId,
          recipientName: dispatchModalOrder.customerName,
          recipientPhone: dispatchModalOrder.phone,
          recipientAddress: dispatchModalOrder.address,
          recipientCity: selectedCityId,
          recipientZone: selectedZoneId,
          recipientArea: selectedAreaId || undefined,
          itemQuantity: (dispatchModalOrder.items || []).reduce((acc, it) => acc + (it.quantity || 1), 0) || 1,
          itemWeight: dispatchWeight || 0.5,
          amountToCollect: dispatchCodAmount,
          specialInstruction: dispatchInstruction,
          itemDescription: dispatchDescription
        })
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        setDispatchError(data.message || "Failed to book parcel on Pathao.");
        return;
      }

      setDispatchSuccess(`Success! Consignment ID: ${data.consignmentId}`);
      showToast(`Booked Pathao Parcel: ${data.consignmentId}`);

      // Optimistically update table state immediately
      setOrders((prev) =>
        prev.map((o) =>
          o.id === dispatchModalOrder.id
            ? {
                ...o,
                consignmentId: data.consignmentId,
                courier: "pathao",
                courierStatus: data.orderStatus || "Pending",
                courierDeliveryFee: data.deliveryFee,
                courierTrackingUrl: `https://pathao.com/courier/tracking/?consignment_id=${encodeURIComponent(data.consignmentId)}`
              }
            : o
        )
      );

      await loadOrders();

      setTimeout(() => {
        setDispatchModalOrder(null);
      }, 1200);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Error connecting to Pathao API";
      setDispatchError(msg);
    } finally {
      setDispatching(false);
    }
  };

  // Bulk Dispatch Selected Orders to Pathao
  const handleBulkSendToPathao = async () => {
    const selectedList = orders.filter((o) => selectedOrderIds.has(o.id) && !o.consignmentId);
    if (selectedList.length === 0) {
      showToast("No unbooked orders selected. Please select orders that haven't been sent to Pathao yet.", "info");
      return;
    }

    if (!selectedZoneId && zones.length > 0) {
      setSelectedZoneId(zones[0].zone_id);
    }

    setBulkDispatchModal(true);
  };

  const executeBulkDispatch = async () => {
    const selectedList = orders.filter((o) => selectedOrderIds.has(o.id) && !o.consignmentId);
    if (selectedList.length === 0) return;

    setDispatching(true);
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < selectedList.length; i++) {
      const ord = selectedList[i];
      setBulkProgress({
        current: i + 1,
        total: selectedList.length,
        message: `Dispatching Order ${ord.id} (${i + 1}/${selectedList.length})...`
      });

      try {
        const itemsSummary = (ord.items || [])
          .map((item) => `${formatItemLabel(item)} x${item.quantity || 1}`)
          .join(", ");

        const res = await fetch("/api/admin/pathao/create-parcel", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            orderId: ord.id,
            storeId: selectedStoreId || pathaoStatus?.defaultStoreId,
            recipientName: ord.customerName,
            recipientPhone: ord.phone,
            recipientAddress: ord.address,
            recipientCity: selectedCityId || 1,
            recipientZone: selectedZoneId || 298,
            itemQuantity: (ord.items || []).reduce((acc, it) => acc + (it.quantity || 1), 0) || 1,
            itemWeight: 0.5,
            amountToCollect: ord.total || 0,
            itemDescription: itemsSummary || "Henley Zone Clothing"
          })
        });

        if (res.ok) {
          successCount++;
        } else {
          failCount++;
        }
      } catch {
        failCount++;
      }
    }

    setDispatching(false);
    setBulkProgress(null);
    setBulkDispatchModal(false);
    showToast(`Bulk Dispatch Finished: ${successCount} successful, ${failCount} failed.`);
    await loadOrders();
  };

  // Bulk Query Live Pathao Status for Selected Orders
  const handleBulkGetPathaoStatus = async () => {
    const bookedList = orders.filter((o) => selectedOrderIds.has(o.id) && o.consignmentId);
    if (bookedList.length === 0) {
      showToast("Please select orders with Pathao Consignment IDs to refresh status.", "info");
      return;
    }

    setLoadingTrack(true);
    let updatedCount = 0;

    for (const ord of bookedList) {
      try {
        const res = await fetch(
          `/api/admin/pathao/track?consignment_id=${encodeURIComponent(ord.consignmentId!)}&order_id=${encodeURIComponent(ord.id)}`,
          { credentials: "include" }
        );
        if (res.ok) {
          updatedCount++;
        }
      } catch {
        // continue
      }
    }

    setLoadingTrack(false);
    showToast(`Updated live Pathao status for ${updatedCount} orders.`);
    await loadOrders();
  };

  // Open Live Track Modal
  const openLiveTrack = async (consignmentId: string, orderId?: string) => {
    setTrackModalConsignment({ consignmentId, orderId });
    setLiveTrackingInfo(null);
    setLoadingTrack(true);

    try {
      const res = await fetch(
        `/api/admin/pathao/track?consignment_id=${encodeURIComponent(consignmentId)}&order_id=${encodeURIComponent(orderId || "")}`,
        { credentials: "include" }
      );
      if (res.ok) {
        const data = await res.json();
        setLiveTrackingInfo(data.data || null);
        void loadOrders();
      }
    } catch (e) {
      console.warn("Tracking fetch error:", e);
    } finally {
      setLoadingTrack(false);
    }
  };

  // Reset Filters
  const handleResetFilters = () => {
    setFilterStartDate("");
    setFilterEndDate("");
    setFilterUserName("");
    setFilterUserPhone("");
    setFilterOrderId("");
    setFilterPaymentStatus("all");
    setFilterPathaoStatus("all");
    setActiveTab("all");
  };

  if (authorized === null) {
    return (
      <main style={{ maxWidth: 720, margin: "60px auto", padding: "24px", textAlign: "center", fontFamily: "sans-serif", color: "#64748B" }}>
        Checking admin session…
      </main>
    );
  }

  if (!authorized) {
    return null;
  }

  return (
    <main style={{ maxWidth: 1440, margin: "0 auto", padding: "16px 20px", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            zIndex: 99999,
            padding: "12px 18px",
            borderRadius: 8,
            color: "#fff",
            background: toastMessage.type === "error" ? "#DC2626" : toastMessage.type === "info" ? "#0284C7" : "#16A34A",
            boxShadow: "0 10px 15px -3px rgba(0,0,0,0.2)",
            fontSize: 13,
            fontWeight: 600,
            animation: "fadeIn 0.2s ease-in-out"
          }}
        >
          {toastMessage.text}
        </div>
      )}

      {/* Top Header Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <a href="/admin" style={{ textDecoration: "none", color: "#64748B", fontSize: 13, fontWeight: 600 }}>
            ← Admin Home
          </a>
          <h1 style={{ margin: 0, fontSize: "1.4rem", fontWeight: 700, color: "#0F172A" }}>
            Orders Management
          </h1>
          <span style={{ fontSize: 12, background: "#F1F5F9", color: "#475569", padding: "3px 8px", borderRadius: 12, fontWeight: 600 }}>
            {orders.length} Total
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Pathao Status Pill */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 10px",
              borderRadius: 20,
              background: pathaoStatus?.connected ? "#F0FDF4" : "#FEF2F2",
              border: `1px solid ${pathaoStatus?.connected ? "#86EFAC" : "#FECACA"}`,
              fontSize: 11,
              fontWeight: 600,
              color: pathaoStatus?.connected ? "#15803D" : "#991B1B"
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: pathaoStatus?.connected ? "#22C55E" : "#EF4444",
                display: "inline-block"
              }}
            />
            <span>
              Pathao: {pathaoStatus?.connected ? (pathaoStatus.environment === "sandbox" ? "Sandbox" : "Live API") : "Offline"}
            </span>
            <button
              type="button"
              onClick={checkPathaoConnection}
              disabled={testingPathao}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "0 2px",
                fontSize: 10,
                textDecoration: "underline",
                color: "#0369A1"
              }}
            >
              {testingPathao ? "..." : "Refresh"}
            </button>
          </div>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "6px 12px",
              background: "#0284C7",
              color: "#fff",
              borderRadius: 6,
              textDecoration: "none",
              fontSize: 12,
              fontWeight: 600
            }}
          >
            View Website ↗
          </a>

          <button
            type="button"
            onClick={async () => {
              await fetch("/api/admin/logout", { method: "POST", credentials: "include" });
              if (typeof window !== "undefined") {
                window.location.href = "/login?type=admin";
              }
            }}
            style={{
              padding: "6px 10px",
              background: "#F1F5F9",
              border: "1px solid #CBD5E1",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 12
            }}
          >
            Log out
          </button>
        </div>
      </div>

      {/* ── TOP ACTION BAR (Exact Buttons from Screenshot) ── */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 8,
          background: "#FFFFFF",
          padding: "10px 14px",
          borderRadius: 8,
          border: "1px solid #E2E8F0",
          marginBottom: 16,
          boxShadow: "0 1px 2px rgba(0,0,0,0.03)"
        }}
      >
        {/* + Create Order (Blue) */}
        <button
          type="button"
          onClick={handleCreateNewOrder}
          style={{
            padding: "7px 12px",
            background: "#0284C7",
            color: "#FFFFFF",
            border: "none",
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer"
          }}
        >
          + Create Order
        </button>

        {/* CSV Export (Light Blue) */}
        <button
          type="button"
          onClick={() => {
            const blob = generateDetailedSpreadsheetCsv(filteredOrders);
            downloadBlobFile(blob, `orders-${new Date().toISOString().slice(0, 10)}.csv`);
          }}
          style={{
            padding: "7px 12px",
            background: "#38BDF8",
            color: "#0F172A",
            border: "none",
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer"
          }}
        >
          CSV Export
        </button>

        {/* Pending Orders Tab (Orange) */}
        <button
          type="button"
          onClick={() => setActiveTab(activeTab === "pending" ? "all" : "pending")}
          style={{
            padding: "7px 14px",
            background: activeTab === "pending" ? "#C2410C" : "#F97316",
            color: "#FFFFFF",
            border: activeTab === "pending" ? "2px solid #7C2D12" : "none",
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer"
          }}
        >
          Pending Orders ({counts.pending})
        </button>

        {/* In Progress Tab (Blue) */}
        <button
          type="button"
          onClick={() => setActiveTab(activeTab === "in_progress" ? "all" : "in_progress")}
          style={{
            padding: "7px 14px",
            background: activeTab === "in_progress" ? "#1D4ED8" : "#3B82F6",
            color: "#FFFFFF",
            border: activeTab === "in_progress" ? "2px solid #1E3A8A" : "none",
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer"
          }}
        >
          In Progress ({counts.in_progress})
        </button>

        {/* Delivered Tab (Green) */}
        <button
          type="button"
          onClick={() => setActiveTab(activeTab === "delivered" ? "all" : "delivered")}
          style={{
            padding: "7px 14px",
            background: activeTab === "delivered" ? "#15803D" : "#22C55E",
            color: "#FFFFFF",
            border: activeTab === "delivered" ? "2px solid #14532D" : "none",
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer"
          }}
        >
          Delivered ({counts.delivered})
        </button>

        {/* Canceled Tab (Red) */}
        <button
          type="button"
          onClick={() => setActiveTab(activeTab === "cancelled" ? "all" : "cancelled")}
          style={{
            padding: "7px 14px",
            background: activeTab === "cancelled" ? "#B91C1C" : "#EF4444",
            color: "#FFFFFF",
            border: activeTab === "cancelled" ? "2px solid #7F1D1D" : "none",
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer"
          }}
        >
          Canceled ({counts.cancelled})
        </button>

        {/* Delete (Red Button) */}
        <button
          type="button"
          onClick={handleDeleteSelected}
          style={{
            padding: "7px 12px",
            background: "#DC2626",
            color: "#FFFFFF",
            border: "none",
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
            opacity: selectedOrderIds.size > 0 ? 1 : 0.6
          }}
          title="Delete Selected Orders"
        >
          Delete {selectedOrderIds.size > 0 ? `(${selectedOrderIds.size})` : ""}
        </button>

        {/* Print (Green Button) */}
        <button
          type="button"
          onClick={handlePrintSelected}
          style={{
            padding: "7px 12px",
            background: "#16A34A",
            color: "#FFFFFF",
            border: "none",
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer"
          }}
          title="Print Packing Slips & Invoices for Selected Orders"
        >
          🖨 print {selectedOrderIds.size > 0 ? `(${selectedOrderIds.size})` : ""}
        </button>

        {/* Send to Pathao (Blue Button) */}
        <button
          type="button"
          onClick={handleBulkSendToPathao}
          style={{
            padding: "7px 14px",
            background: "#0284C7",
            color: "#FFFFFF",
            border: "none",
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 4
          }}
          title="Send Selected Orders to Pathao Courier"
        >
          <IconTruck size={14} /> Send to Pathao {selectedOrderIds.size > 0 ? `(${selectedOrderIds.size})` : ""}
        </button>

        {/* Get Pathao Status (Blue Button) */}
        <button
          type="button"
          onClick={handleBulkGetPathaoStatus}
          disabled={loadingTrack}
          style={{
            padding: "7px 14px",
            background: "#0369A1",
            color: "#FFFFFF",
            border: "none",
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 4
          }}
          title="Refresh Live Pathao Tracking for Selected Orders"
        >
          {loadingTrack ? <IconSpinner size={14} /> : null} Get Pathao Status
        </button>
      </div>

      {/* ── ADVANCED FILTER ROW (Exact Inputs from Screenshot) ── */}
      <div
        style={{
          background: "#FFFFFF",
          padding: "14px 16px",
          borderRadius: 8,
          border: "1px solid #E2E8F0",
          marginBottom: 20,
          boxShadow: "0 1px 2px rgba(0,0,0,0.03)"
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 12, marginBottom: 12 }}>
          {/* Start Date */}
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748B", marginBottom: 3 }}>
              Start Date
            </label>
            <input
              type="date"
              value={filterStartDate}
              onChange={(e) => setFilterStartDate(e.target.value)}
              style={{ width: "100%", padding: "6px 8px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 12 }}
            />
          </div>

          {/* End Date */}
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748B", marginBottom: 3 }}>
              End Date
            </label>
            <input
              type="date"
              value={filterEndDate}
              onChange={(e) => setFilterEndDate(e.target.value)}
              style={{ width: "100%", padding: "6px 8px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 12 }}
            />
          </div>

          {/* User Name */}
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748B", marginBottom: 3 }}>
              User Name
            </label>
            <input
              type="text"
              placeholder="Enter User Name"
              value={filterUserName}
              onChange={(e) => setFilterUserName(e.target.value)}
              style={{ width: "100%", padding: "6px 8px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 12 }}
            />
          </div>

          {/* User Phone */}
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748B", marginBottom: 3 }}>
              User Phone
            </label>
            <input
              type="text"
              placeholder="Enter Phone Number"
              value={filterUserPhone}
              onChange={(e) => setFilterUserPhone(e.target.value)}
              style={{ width: "100%", padding: "6px 8px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 12 }}
            />
          </div>

          {/* Order ID */}
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748B", marginBottom: 3 }}>
              Order ID / Consignment
            </label>
            <input
              type="text"
              placeholder="Enter Order ID"
              value={filterOrderId}
              onChange={(e) => setFilterOrderId(e.target.value)}
              style={{ width: "100%", padding: "6px 8px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 12 }}
            />
          </div>

          {/* Payment Status */}
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748B", marginBottom: 3 }}>
              Payment Status
            </label>
            <select
              value={filterPaymentStatus}
              onChange={(e) => setFilterPaymentStatus(e.target.value)}
              style={{ width: "100%", padding: "6px 8px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 12 }}
            >
              <option value="all">All Payment Status</option>
              <option value="unpaid">Unpaid (COD)</option>
              <option value="paid">Paid</option>
            </select>
          </div>

          {/* Pathao Status Filter */}
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748B", marginBottom: 3 }}>
              Pathao Status
            </label>
            <select
              value={filterPathaoStatus}
              onChange={(e) => setFilterPathaoStatus(e.target.value)}
              style={{ width: "100%", padding: "6px 8px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 12 }}
            >
              <option value="all">All Pathao Orders</option>
              <option value="not_sent">Not Sent to Pathao</option>
              <option value="sent">Dispatched to Pathao</option>
            </select>
          </div>
        </div>

        {/* Filter Action Buttons */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button
            type="button"
            style={{
              padding: "6px 14px",
              background: "#16A34A",
              color: "#FFFFFF",
              border: "none",
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            🔍 Filter ({filteredOrders.length} Results)
          </button>
          <button
            type="button"
            onClick={handleResetFilters}
            style={{
              padding: "6px 14px",
              background: "#0284C7",
              color: "#FFFFFF",
              border: "none",
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            🔄 Reset
          </button>
        </div>
      </div>

      {loadingOrders ? <p style={{ color: "#64748B", fontSize: 13 }}>Loading orders...</p> : null}
      {error ? <p style={{ color: "crimson", fontSize: 13 }}>{error}</p> : null}

      {/* ── ORDERS TABLE (Exact Columns Matching Screenshot) ── */}
      <div style={{ background: "#FFFFFF", borderRadius: 8, border: "1px solid #E2E8F0", overflowX: "auto", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, textAlign: "left" }}>
          <thead>
            <tr style={{ background: "#F8FAFC", color: "#475569", borderBottom: "1px solid #E2E8F0" }}>
              {/* Checkbox Header */}
              <th style={{ padding: "10px 12px", width: 36, textAlign: "center", borderRight: "1px solid #E2E8F0" }}>
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={toggleSelectAll}
                  style={{ cursor: "pointer", width: 15, height: 15 }}
                  title="Select All"
                />
              </th>
              <th style={{ padding: "10px 12px", borderRight: "1px solid #E2E8F0", whiteSpace: "nowrap" }}>Order ID</th>
              <th style={{ padding: "10px 12px", borderRight: "1px solid #E2E8F0", whiteSpace: "nowrap" }}>Order Date</th>
              <th style={{ padding: "10px 12px", borderRight: "1px solid #E2E8F0", minWidth: 150 }}>User Info</th>
              <th style={{ padding: "10px 12px", borderRight: "1px solid #E2E8F0", whiteSpace: "nowrap" }}>Phone</th>
              <th style={{ padding: "10px 12px", borderRight: "1px solid #E2E8F0", minWidth: 180 }}>Items & Address</th>
              <th style={{ padding: "10px 12px", borderRight: "1px solid #E2E8F0", whiteSpace: "nowrap" }}>Total Amount</th>
              <th style={{ padding: "10px 12px", borderRight: "1px solid #E2E8F0", whiteSpace: "nowrap" }}>Payment Method</th>
              <th style={{ padding: "10px 12px", borderRight: "1px solid #E2E8F0", whiteSpace: "nowrap" }}>Payment Status</th>
              <th style={{ padding: "10px 12px", borderRight: "1px solid #E2E8F0", whiteSpace: "nowrap" }}>Order Status</th>
              <th style={{ padding: "10px 12px", borderRight: "1px solid #E2E8F0", minWidth: 140 }}>Pathao Status</th>
              <th style={{ padding: "10px 12px", textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={12} style={{ padding: 36, textAlign: "center", color: "#64748B" }}>
                  No orders match your filter criteria.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order, idx) => {
                const phoneDigits = normalizePhoneDigits(order.phone);
                const isSelected = selectedOrderIds.has(order.id);
                const orderDate = safeDate(order.createdAt);
                const dateString = orderDate.toLocaleDateString("en-GB");
                const timeString = orderDate.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
                const items = Array.isArray(order.items) ? order.items : [];

                return (
                  <tr
                    key={order.id || idx}
                    style={{
                      background: isSelected ? "#F0F9FF" : idx % 2 === 0 ? "#FFFFFF" : "#F8FAFC",
                      borderBottom: "1px solid #E2E8F0"
                    }}
                  >
                    {/* Checkbox */}
                    <td style={{ padding: "10px 12px", textAlign: "center", borderRight: "1px solid #E2E8F0" }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectOrder(order.id)}
                        style={{ cursor: "pointer", width: 15, height: 15 }}
                      />
                    </td>

                    {/* Order ID */}
                    <td style={{ padding: "10px 12px", borderRight: "1px solid #E2E8F0", verticalAlign: "top" }}>
                      <div style={{ fontWeight: 700, color: "#0F172A" }}>{order.id}</div>
                    </td>

                    {/* Order Date */}
                    <td style={{ padding: "10px 12px", borderRight: "1px solid #E2E8F0", verticalAlign: "top", whiteSpace: "nowrap" }}>
                      <div style={{ fontWeight: 600 }}>{dateString}</div>
                      <div style={{ color: "#64748B", fontSize: 11 }}>{timeString}</div>
                    </td>

                    {/* User Info */}
                    <td style={{ padding: "10px 12px", borderRight: "1px solid #E2E8F0", verticalAlign: "top" }}>
                      <div style={{ fontWeight: 700, color: "#0F172A" }}>{order.customerName || "Customer"}</div>
                      <div style={{ fontSize: 11, color: "#64748B" }}>No email</div>
                    </td>

                    {/* Phone with Call & WhatsApp Icon */}
                    <td style={{ padding: "10px 12px", borderRight: "1px solid #E2E8F0", verticalAlign: "top", whiteSpace: "nowrap" }}>
                      <div style={{ fontWeight: 600 }}>{order.phone || "N/A"}</div>
                      {phoneDigits && (
                        <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                          <a
                            href={`tel:+${phoneDigits}`}
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
                            📞
                          </a>
                          <a
                            href={`https://wa.me/${phoneDigits}?text=${encodeURIComponent(`Hi ${order.customerName || ""}, regarding your order ${order.id || ""}.`)}`}
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

                    {/* Items & Address */}
                    <td style={{ padding: "10px 12px", borderRight: "1px solid #E2E8F0", verticalAlign: "top" }}>
                      <div style={{ fontSize: 11, color: "#334155", marginBottom: 4 }}>
                        <strong>Address:</strong> {order.address || "N/A"}
                      </div>
                      {items.length > 0 && (
                        <div style={{ fontSize: 11, color: "#64748B" }}>
                          {items.map((it, i) => (
                            <span key={i}>
                              {formatItemLabel(it)} (x{it.quantity || 1}){i < items.length - 1 ? ", " : ""}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>

                    {/* Total Amount with COD Badge */}
                    <td style={{ padding: "10px 12px", borderRight: "1px solid #E2E8F0", verticalAlign: "top", whiteSpace: "nowrap" }}>
                      <div style={{ fontWeight: 700, color: "#0F172A", fontSize: 13 }}>
                        {formatTaka(order.total)}
                      </div>
                      <span
                        style={{
                          display: "inline-block",
                          marginTop: 3,
                          fontSize: 10,
                          fontWeight: 700,
                          padding: "2px 6px",
                          borderRadius: 4,
                          background: "#0284C7",
                          color: "#FFFFFF"
                        }}
                      >
                        Cash On Delivery
                      </span>
                    </td>

                    {/* Payment Method */}
                    <td style={{ padding: "10px 12px", borderRight: "1px solid #E2E8F0", verticalAlign: "top", whiteSpace: "nowrap" }}>
                      COD
                    </td>

                    {/* Payment Status */}
                    <td style={{ padding: "10px 12px", borderRight: "1px solid #E2E8F0", verticalAlign: "top", whiteSpace: "nowrap" }}>
                      <span
                        style={{
                          display: "inline-block",
                          fontSize: 11,
                          fontWeight: 700,
                          padding: "3px 8px",
                          borderRadius: 4,
                          background: "#EF4444",
                          color: "#FFFFFF"
                        }}
                      >
                        Unpaid
                      </span>
                    </td>

                    {/* Order Status Dropdown */}
                    <td style={{ padding: "10px 12px", borderRight: "1px solid #E2E8F0", verticalAlign: "top" }}>
                      <select
                        value={(order.status || "pending").toLowerCase()}
                        onChange={(e) => void updateStatus(order.id, e.target.value)}
                        disabled={updatingOrderId === order.id}
                        style={{
                          padding: "3px 6px",
                          borderRadius: 4,
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: "pointer",
                          background: (order.status || "").toLowerCase() === "confirmed" ? "#DCFCE7" : (order.status || "").toLowerCase() === "delivered" ? "#E0F2FE" : (order.status || "").toLowerCase() === "cancelled" ? "#FEE2E2" : "#FEF3C7",
                          color: (order.status || "").toLowerCase() === "confirmed" ? "#166534" : (order.status || "").toLowerCase() === "delivered" ? "#0369A1" : (order.status || "").toLowerCase() === "cancelled" ? "#991B1B" : "#92400E",
                          border: "1px solid #CBD5E1"
                        }}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">In Progress</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Canceled</option>
                      </select>
                    </td>

                    {/* Pathao Status (Exact Blue Pill from Screenshot) */}
                    <td style={{ padding: "10px 12px", borderRight: "1px solid #E2E8F0", verticalAlign: "top" }}>
                      {order.consignmentId ? (
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}>
                            <span
                              style={{
                                display: "inline-block",
                                fontSize: 11,
                                fontWeight: 700,
                                padding: "2px 8px",
                                borderRadius: 12,
                                background: "#0284C7",
                                color: "#FFFFFF"
                              }}
                            >
                              ● {order.courierStatus || "Pending"}
                            </span>
                          </div>
                          <div style={{ fontSize: 10, color: "#64748B" }}>
                            ID: <strong>{order.consignmentId}</strong>
                          </div>
                          <button
                            type="button"
                            onClick={() => openLiveTrack(order.consignmentId!, order.id)}
                            style={{
                              marginTop: 4,
                              fontSize: 10,
                              padding: "2px 6px",
                              background: "#F1F5F9",
                              border: "1px solid #CBD5E1",
                              borderRadius: 4,
                              cursor: "pointer",
                              color: "#0284C7",
                              fontWeight: 600
                            }}
                          >
                            🔍 Live Track
                          </button>
                        </div>
                      ) : (
                        <div>
                          <span
                            style={{
                              display: "inline-block",
                              fontSize: 11,
                              fontWeight: 700,
                              padding: "2px 8px",
                              borderRadius: 12,
                              background: "#38BDF8",
                              color: "#0F172A",
                              marginBottom: 4
                            }}
                          >
                            ● Not Sent
                          </span>
                          <div>
                            <button
                              type="button"
                              onClick={() => openDispatchModal(order)}
                              style={{
                                padding: "3px 8px",
                                background: "#0284C7",
                                color: "#FFFFFF",
                                border: "none",
                                borderRadius: 4,
                                fontSize: 10,
                                fontWeight: 700,
                                cursor: "pointer"
                              }}
                            >
                              Send to Pathao
                            </button>
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: "10px 12px", verticalAlign: "top", textAlign: "center" }}>
                      <div style={{ display: "flex", gap: 4, justifyContent: "center" }}>
                        <button
                          type="button"
                          onClick={() => openEditModal(order)}
                          style={{
                            padding: "3px 8px",
                            background: "#E0F2FE",
                            color: "#0369A1",
                            border: "1px solid #BAE6FD",
                            borderRadius: 4,
                            fontSize: 11,
                            cursor: "pointer",
                            fontWeight: 700
                          }}
                          title="Edit Customer, Items, Price & Courier"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedOrderIds(new Set([order.id]));
                            setTimeout(handlePrintSelected, 50);
                          }}
                          style={{
                            padding: "3px 6px",
                            background: "#F1F5F9",
                            border: "1px solid #CBD5E1",
                            borderRadius: 4,
                            fontSize: 11,
                            cursor: "pointer",
                            fontWeight: 600
                          }}
                          title="Print Invoice"
                        >
                          🖨
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── SINGLE DISPATCH MODAL ── */}
      {dispatchModalOrder && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: 16
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget && !dispatching) {
              setDispatchModalOrder(null);
            }
          }}
        >
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: 12,
              maxWidth: 540,
              width: "100%",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
              padding: 24,
              maxHeight: "90vh",
              overflowY: "auto"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ padding: 6, background: "#E0F2FE", color: "#0284C7", borderRadius: 8 }}>
                  <IconTruck size={20} />
                </div>
                <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 700, color: "#0F172A" }}>
                  Send Order to Pathao Courier
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setDispatchModalOrder(null)}
                disabled={dispatching}
                style={{ background: "transparent", border: "none", fontSize: 20, cursor: "pointer", color: "#64748B" }}
              >
                ✕
              </button>
            </div>

            {dispatchError && (
              <div style={{ padding: "8px 12px", background: "#FEE2E2", color: "#991B1B", borderRadius: 6, fontSize: 13, marginBottom: 12 }}>
                {dispatchError}
              </div>
            )}

            {dispatchSuccess && (
              <div style={{ padding: "8px 12px", background: "#DCFCE7", color: "#166534", borderRadius: 6, fontSize: 13, marginBottom: 12 }}>
                {dispatchSuccess}
              </div>
            )}

            <div style={{ background: "#F8FAFC", padding: 12, borderRadius: 8, marginBottom: 16, border: "1px solid #E2E8F0", fontSize: 12 }}>
              <div><strong>Order ID:</strong> {dispatchModalOrder.id}</div>
              <div><strong>Recipient:</strong> {dispatchModalOrder.customerName} ({dispatchModalOrder.phone})</div>
              <div><strong>Address:</strong> {dispatchModalOrder.address}</div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              <div style={{ gridColumn: "span 2" }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                  Pickup Store
                </label>
                <select
                  value={selectedStoreId}
                  onChange={(e) => setSelectedStoreId(e.target.value)}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 13 }}
                >
                  {(pathaoStatus?.stores || []).map((store) => (
                    <option key={store.store_id} value={store.store_id}>
                      {store.store_name} ({store.store_address || "Default"})
                    </option>
                  ))}
                  {(!pathaoStatus?.stores || pathaoStatus.stores.length === 0) && (
                    <option value="150694">Default Sandbox Store (#150694)</option>
                  )}
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                  City (District) *
                </label>
                <select
                  value={selectedCityId}
                  onChange={(e) => setSelectedCityId(Number(e.target.value))}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 13 }}
                >
                  {cities.map((c) => (
                    <option key={c.city_id} value={c.city_id}>
                      {c.city_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                  Zone / Thana * {loadingLocations && "(Loading...)"}
                </label>
                <select
                  value={selectedZoneId}
                  onChange={(e) => setSelectedZoneId(Number(e.target.value))}
                  disabled={loadingLocations || zones.length === 0}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 13 }}
                >
                  {zones.map((z) => (
                    <option key={z.zone_id} value={z.zone_id}>
                      {z.zone_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                  COD Amount to Collect (৳) *
                </label>
                <input
                  type="number"
                  value={dispatchCodAmount}
                  onChange={(e) => setDispatchCodAmount(Number(e.target.value))}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 13 }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                  Weight (KG)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={dispatchWeight}
                  onChange={(e) => setDispatchWeight(Number(e.target.value))}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 13 }}
                />
              </div>

              <div style={{ gridColumn: "span 2" }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                  Special Instructions
                </label>
                <input
                  type="text"
                  value={dispatchInstruction}
                  placeholder="e.g. Call before delivery, handle with care"
                  onChange={(e) => setDispatchInstruction(e.target.value)}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 13 }}
                />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 }}>
              <button
                type="button"
                onClick={() => setDispatchModalOrder(null)}
                disabled={dispatching}
                style={{ padding: "8px 16px", borderRadius: 6, border: "1px solid #CBD5E1", background: "#F8FAFC", cursor: "pointer", fontSize: 13, fontWeight: 600 }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSingleDispatch}
                disabled={dispatching}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 18px",
                  borderRadius: 6,
                  border: "none",
                  background: "#0284C7",
                  color: "#FFFFFF",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 700
                }}
              >
                {dispatching ? <IconSpinner size={16} /> : <IconTruck size={16} />} Confirm & Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── BULK DISPATCH MODAL ── */}
      {bulkDispatchModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: 16
          }}
        >
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: 12,
              maxWidth: 480,
              width: "100%",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
              padding: 24
            }}
          >
            <h3 style={{ margin: "0 0 12px", fontSize: "1.2rem", fontWeight: 700, color: "#0F172A" }}>
              🚚 Bulk Send to Pathao
            </h3>
            <p style={{ fontSize: 13, color: "#64748B", marginBottom: 16 }}>
              You are about to dispatch <strong>{Array.from(selectedOrderIds).length} order(s)</strong> directly to Pathao Courier.
            </p>

            {bulkProgress ? (
              <div style={{ padding: "16px 0", textAlign: "center" }}>
                <IconSpinner size={24} />
                <div style={{ marginTop: 8, fontSize: 13, fontWeight: 600, color: "#0284C7" }}>
                  {bulkProgress.message}
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 }}>
                <button
                  type="button"
                  onClick={() => setBulkDispatchModal(false)}
                  disabled={dispatching}
                  style={{ padding: "8px 14px", borderRadius: 6, border: "1px solid #CBD5E1", background: "#F8FAFC", cursor: "pointer", fontSize: 13, fontWeight: 600 }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={executeBulkDispatch}
                  disabled={dispatching}
                  style={{
                    padding: "8px 18px",
                    borderRadius: 6,
                    border: "none",
                    background: "#0284C7",
                    color: "#FFFFFF",
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: 700
                  }}
                >
                  Start Bulk Dispatch
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── LIVE TRACKING MODAL ── */}
      {trackModalConsignment && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: 16
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setTrackModalConsignment(null);
            }
          }}
        >
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: 12,
              maxWidth: 480,
              width: "100%",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
              padding: 24
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ padding: 6, background: "#E0F2FE", color: "#0284C7", borderRadius: 8 }}>
                  <IconTruck size={20} />
                </div>
                <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 700, color: "#0F172A" }}>
                  Live Pathao Status
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setTrackModalConsignment(null)}
                style={{ background: "transparent", border: "none", fontSize: 20, cursor: "pointer", color: "#64748B" }}
              >
                ✕
              </button>
            </div>

            <div style={{ background: "#F8FAFC", padding: 12, borderRadius: 8, marginBottom: 16, border: "1px solid #E2E8F0" }}>
              <div style={{ fontSize: 13, marginBottom: 4 }}>
                <strong>Consignment ID:</strong> {trackModalConsignment.consignmentId}
              </div>
              {trackModalConsignment.orderId && (
                <div style={{ fontSize: 13 }}>
                  <strong>Order ID:</strong> {trackModalConsignment.orderId}
                </div>
              )}
            </div>

            {loadingTrack ? (
              <div style={{ textAlign: "center", padding: "20px 0", color: "#64748B", fontSize: 13 }}>
                <IconSpinner size={24} />
                <div style={{ marginTop: 8 }}>Fetching live tracking from Pathao...</div>
              </div>
            ) : liveTrackingInfo ? (
              <div style={{ fontSize: 13, lineHeight: 1.6 }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #E2E8F0" }}>
                  <span style={{ color: "#64748B" }}>Order Status:</span>
                  <span style={{ fontWeight: 700, color: "#0284C7" }}>
                    {String(liveTrackingInfo.order_status || "Pending")}
                  </span>
                </div>
                {liveTrackingInfo.payment_status ? (
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #E2E8F0" }}>
                    <span style={{ color: "#64748B" }}>Payment Collection:</span>
                    <span style={{ fontWeight: 600 }}>{String(liveTrackingInfo.payment_status)}</span>
                  </div>
                ) : null}
                {liveTrackingInfo.updated_at ? (
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #E2E8F0" }}>
                    <span style={{ color: "#64748B" }}>Last Updated:</span>
                    <span>{String(liveTrackingInfo.updated_at)}</span>
                  </div>
                ) : null}
              </div>
            ) : (
              <div style={{ color: "#991B1B", fontSize: 13, textAlign: "center", padding: "12px 0" }}>
                Could not retrieve tracking details. Consignment might still be syncing.
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 20 }}>
              <a
                href={`https://pathao.com/courier/tracking/?consignment_id=${encodeURIComponent(trackModalConsignment.consignmentId)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: "8px 14px",
                  borderRadius: 6,
                  background: "#0284C7",
                  color: "#FFFFFF",
                  textDecoration: "none",
                  fontSize: 12,
                  fontWeight: 700
                }}
              >
                Open on Pathao ↗
              </a>
              <button
                type="button"
                onClick={() => setTrackModalConsignment(null)}
                style={{ padding: "8px 14px", borderRadius: 6, border: "1px solid #CBD5E1", background: "#F8FAFC", cursor: "pointer", fontSize: 12, fontWeight: 600 }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── EDIT ORDER MODAL ── */}
      <EditOrderModal
        order={editOrder}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditOrder(null);
        }}
        onSaved={handleOrderSaved}
        onDelete={handleOrderDeleted}
      />
    </main>
  );
}
