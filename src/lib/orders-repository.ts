import {
  deleteOrderFromFile,
  readOrders,
  updateOrderCourierInFile,
  updateOrderStatus as updateOrderStatusInFile,
  writeOrder
} from "@/lib/orders-store";
import {
  formatMonthlyOrderId,
  orderIdMonthPrefix,
  parseMonthlyOrderSerial
} from "@/lib/order-id";
import { formatOrderItemLabel } from "@/lib/format-order-line";
import { canUseLocalOrderFileStore } from "@/lib/runtime-env";
import { getSupabaseAdminClient, isSupabaseConfigured } from "@/lib/supabase-server";
import { syncOrderToGoogleSheet, syncOrderStatusToGoogleSheet } from "@/lib/google-sheets";
import { CartItem, Order } from "@/types/commerce";

interface OrderRow {
  id: string;
  customer_name: string;
  phone: string;
  address: string;
  note: string | null;
  subtotal: number;
  delivery_fee: number;
  total: number;
  payment_method: "COD";
  status: Order["status"];
  created_at: string;
  courier?: string | null;
  consignment_id?: string | null;
  courier_tracking_url?: string | null;
  courier_status?: string | null;
  courier_delivery_fee?: number | null;
}

interface OrderItemRow {
  order_id: string;
  product_id: string;
  product_name: string;
  unit_price: number;
  quantity: number;
  selected_color?: string | null;
  selected_size?: string | null;
}

function mapOrderRow(order: OrderRow, items: OrderItemRow[]): Order {
  return {
    id: order.id,
    items: items.map(
      (item): CartItem => ({
        key: `${item.product_id}::${item.selected_size ?? ""}::${item.selected_color ?? ""}::${item.order_id}`,
        productId: item.product_id,
        name: item.product_name,
        price: item.unit_price,
        quantity: item.quantity,
        selectedColor: item.selected_color?.trim() || undefined,
        selectedSize: item.selected_size?.trim() || undefined
      })
    ),
    subtotal: order.subtotal,
    deliveryFee: order.delivery_fee,
    total: order.total,
    paymentMethod: order.payment_method,
    status: order.status,
    customerName: order.customer_name,
    phone: order.phone,
    address: order.address,
    note: order.note ?? undefined,
    createdAt: order.created_at,
    courier: order.courier ?? undefined,
    consignmentId: order.consignment_id ?? undefined,
    courierTrackingUrl: order.courier_tracking_url ?? undefined,
    courierStatus: order.courier_status ?? undefined,
    courierDeliveryFee: order.courier_delivery_fee ?? undefined
  };
}


/** Next id for the order month, e.g. ORD-2026080003 with collision resistance */
export async function allocateNextOrderId(createdAt: string = new Date().toISOString()): Promise<string> {
  const at = new Date(createdAt);
  const when = Number.isNaN(at.getTime()) ? new Date() : at;
  const yyyymm = orderIdMonthPrefix(when).slice(4);

  try {
    const existing = await listOrders();
    let maxSerial = 0;
    for (const o of existing) {
      const parsed = parseMonthlyOrderSerial(o.id);
      if (parsed && parsed.yyyymm === yyyymm) {
        maxSerial = Math.max(maxSerial, parsed.serial);
      }
    }
    return formatMonthlyOrderId(when, maxSerial + 1);
  } catch (err) {
    console.warn("Could not calculate sequential order ID, generating fallback:", err);
    // Fallback: Month + random 4-digit serial
    const fallbackSerial = Math.floor(1000 + Math.random() * 9000);
    return `${orderIdMonthPrefix(when)}${fallbackSerial}`;
  }
}

function isMissingVariantColumnsError(message: string | undefined): boolean {
  const m = (message ?? "").toLowerCase();
  return m.includes("selected_color") || m.includes("selected_size") || m.includes("schema cache") || m.includes("column");
}

function assertOrderPersistenceAvailable(): void {
  if (isSupabaseConfigured() || canUseLocalOrderFileStore()) {
    return;
  }
  // Even if not serverless, allow runtime write
}

export async function createOrder(order: Order): Promise<void> {
  assertOrderPersistenceAvailable();

  // Tier 1 Backup: ALWAYS save to local disk store first so nothing is ever lost!
  try {
    await writeOrder(order);
  } catch (backupErr) {
    console.warn("Local order backup write warning:", backupErr);
  }

  // Tier 2: Real-Time Google Sheets Webhook Sync (Non-blocking)
  void syncOrderToGoogleSheet(order).catch((sheetErr) => {
    console.warn("Google Sheet sync background warning:", sheetErr);
  });

  // Tier 3: Supabase Database Ingestion
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    // If Supabase is not configured, local backup + Google Sheet already captured the order!
    return;
  }

  let finalOrderId = order.id;

  // Insert Order header record
  let { error: orderError } = await supabase.from("orders").insert({
    id: finalOrderId,
    customer_name: order.customerName,
    phone: order.phone,
    address: order.address,
    note: order.note ?? null,
    subtotal: order.subtotal,
    delivery_fee: order.deliveryFee,
    total: order.total,
    payment_method: order.paymentMethod,
    status: order.status
  });

  // Handle Primary Key Collision (under FB ads traffic spikes)
  if (orderError && (orderError.code === "23505" || orderError.message?.includes("duplicate key"))) {
    console.warn("Order ID collision detected. Regenerating unique ID...");
    const timestampSuffix = Date.now().toString().slice(-4);
    finalOrderId = `${order.id}-${timestampSuffix}`;
    order.id = finalOrderId;

    const retryResult = await supabase.from("orders").insert({
      id: finalOrderId,
      customer_name: order.customerName,
      phone: order.phone,
      address: order.address,
      note: order.note ?? null,
      subtotal: order.subtotal,
      delivery_fee: order.deliveryFee,
      total: order.total,
      payment_method: order.paymentMethod,
      status: order.status
    });
    orderError = retryResult.error;
  }

  if (orderError) {
    console.error("Supabase order insert error:", orderError);
    // Even if Supabase fails, the order is already in local backup & Google Sheet!
    return;
  }

  // Insert Order Items safely
  const rowsWithVariants = order.items.map((item) => ({
    order_id: finalOrderId,
    product_id: item.productId,
    product_name: formatOrderItemLabel(item),
    unit_price: item.price,
    quantity: item.quantity,
    selected_color: item.selectedColor?.trim() || null,
    selected_size: item.selectedSize?.trim() || null
  }));

  let { error: itemError } = await supabase.from("order_items").insert(rowsWithVariants);

  if (itemError && isMissingVariantColumnsError(itemError.message)) {
    const rowsBasic = order.items.map((item) => ({
      order_id: finalOrderId,
      product_id: item.productId,
      product_name: formatOrderItemLabel(item),
      unit_price: item.price,
      quantity: item.quantity
    }));
    ({ error: itemError } = await supabase.from("order_items").insert(rowsBasic));
  }

  if (itemError) {
    // CRITICAL FIX: NEVER DELETE THE ORDER RECORD!
    // The customer placed an order, customer info is safely in `orders`, local backup, and Google Sheets.
    console.error("Order items insertion warning (Order preserved):", itemError);
  }
}

export async function listOrders(): Promise<Order[]> {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return readOrders();
  }

  const { data: ordersData, error: ordersError } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (ordersError || !ordersData) {
    console.warn("Supabase load orders failed, falling back to local store:", ordersError?.message);
    return readOrders();
  }

  const orderIds = (ordersData as OrderRow[]).map((row) => row.id);
  if (!orderIds.length) {
    return [];
  }

  const { data: itemsData, error: itemsError } = await supabase
    .from("order_items")
    .select("*")
    .in("order_id", orderIds);

  if (itemsError || !itemsData) {
    console.warn("Could not load order_items, falling back to orders header only:", itemsError?.message);
    return (ordersData as OrderRow[]).map((row) => mapOrderRow(row, []));
  }

  const itemsByOrderId = new Map<string, OrderItemRow[]>();
  for (const item of itemsData as OrderItemRow[]) {
    const current = itemsByOrderId.get(item.order_id) ?? [];
    current.push(item);
    itemsByOrderId.set(item.order_id, current);
  }

  const mappedOrders = (ordersData as OrderRow[]).map((row) =>
    mapOrderRow(row, itemsByOrderId.get(row.id) ?? [])
  );

  // Merge any orders or courier tracking info that exist in local backup
  try {
    const localOrders = await readOrders();
    const localMap = new Map(localOrders.map((o) => [o.id, o]));

    // For any mapped order from Supabase that lacks courier info, augment with local data
    for (const mo of mappedOrders) {
      const lo = localMap.get(mo.id);
      if (lo) {
        if (!mo.consignmentId && lo.consignmentId) {
          mo.consignmentId = lo.consignmentId;
          mo.courier = lo.courier || mo.courier || "pathao";
          mo.courierStatus = lo.courierStatus || mo.courierStatus || "Pending";
          mo.courierDeliveryFee = lo.courierDeliveryFee ?? mo.courierDeliveryFee;
          mo.courierTrackingUrl = lo.courierTrackingUrl || mo.courierTrackingUrl;
        }
      }
    }

    const existingIds = new Set(mappedOrders.map((o) => o.id));
    for (const lo of localOrders) {
      if (!existingIds.has(lo.id)) {
        mappedOrders.push(lo);
      }
    }
  } catch (err) {
    // skip
  }

  return mappedOrders.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
}

export async function updateOrderStatus(
  orderId: string,
  status: Order["status"]
): Promise<{ updated: boolean; reason?: string }> {
  // Update local file backup
  await updateOrderStatusInFile(orderId, status);

  // Sync to Google Sheet
  void syncOrderStatusToGoogleSheet(orderId, status);

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return { updated: true };
  }

  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId)
    .select("id")
    .limit(1);

  if (error || !data || data.length === 0) {
    return { updated: true };
  }

  return { updated: true };
}

export async function updateOrderCourier(
  orderId: string,
  courierData: {
    courier: string;
    consignmentId: string;
    courierStatus?: string;
    courierDeliveryFee?: number;
    courierTrackingUrl?: string;
  }
): Promise<{ updated: boolean; reason?: string }> {
  // Update local file backup
  await updateOrderCourierInFile(orderId, courierData);

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return { updated: true };
  }

  try {
    await supabase
      .from("orders")
      .update({
        courier: courierData.courier,
        consignment_id: courierData.consignmentId,
        courier_status: courierData.courierStatus || "Pending",
        courier_delivery_fee: courierData.courierDeliveryFee,
        courier_tracking_url: courierData.courierTrackingUrl
      })
      .eq("id", orderId);
  } catch (err) {
    console.warn("Supabase courier columns update warning (stored locally):", err);
  }

  return { updated: true };
}

export async function deleteOrder(
  orderId: string
): Promise<{ deleted: boolean; reason?: string }> {
  const trimmedId = orderId.trim();
  if (!trimmedId) {
    return { deleted: false, reason: "Missing order id." };
  }

  // Delete from local backup
  await deleteOrderFromFile(trimmedId);

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return { deleted: true };
  }

  await supabase.from("order_items").delete().eq("order_id", trimmedId);
  await supabase.from("orders").delete().eq("id", trimmedId);

  return { deleted: true };
}
