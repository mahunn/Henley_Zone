import {
  deleteOrderFromFile,
  readOrders,
  updateOrderStatus as updateOrderStatusInFile,
  writeOrder
} from "@/lib/orders-store";
import {
  formatMonthlyOrderId,
  orderIdMonthPrefix,
  parseMonthlyOrderSerial
} from "@/lib/order-id";
import { formatOrderItemLabel } from "@/lib/format-order-line";
import { getSupabaseAdminClient } from "@/lib/supabase-server";
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
    createdAt: order.created_at
  };
}

/** Next id for the order month, e.g. ORD-2026050003 */
export async function allocateNextOrderId(createdAt: string = new Date().toISOString()): Promise<string> {
  const at = new Date(createdAt);
  const when = Number.isNaN(at.getTime()) ? new Date() : at;
  const yyyymm = orderIdMonthPrefix(when).slice(4);

  const existing = await listOrders();
  let maxSerial = 0;
  for (const o of existing) {
    const parsed = parseMonthlyOrderSerial(o.id);
    if (parsed && parsed.yyyymm === yyyymm) {
      maxSerial = Math.max(maxSerial, parsed.serial);
    }
  }
  return formatMonthlyOrderId(when, maxSerial + 1);
}

function isMissingVariantColumnsError(message: string | undefined): boolean {
  const m = (message ?? "").toLowerCase();
  return m.includes("selected_color") || m.includes("selected_size") || m.includes("schema cache");
}

export async function createOrder(order: Order): Promise<void> {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    await writeOrder(order);
    return;
  }

  const { error: orderError } = await supabase.from("orders").insert({
    id: order.id,
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

  if (orderError) {
    throw new Error(orderError.message || "Could not save order.");
  }

  const rowsWithVariants = order.items.map((item) => ({
    order_id: order.id,
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
      order_id: order.id,
      product_id: item.productId,
      product_name: formatOrderItemLabel(item),
      unit_price: item.price,
      quantity: item.quantity
    }));
    ({ error: itemError } = await supabase.from("order_items").insert(rowsBasic));
  }

  if (itemError) {
    await supabase.from("orders").delete().eq("id", order.id);
    throw new Error(itemError.message || "Could not save order items.");
  }

  await writeOrder(order);
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
    return readOrders();
  }

  const itemsByOrderId = new Map<string, OrderItemRow[]>();
  for (const item of itemsData as OrderItemRow[]) {
    const current = itemsByOrderId.get(item.order_id) ?? [];
    current.push(item);
    itemsByOrderId.set(item.order_id, current);
  }

  return (ordersData as OrderRow[]).map((row) =>
    mapOrderRow(row, itemsByOrderId.get(row.id) ?? [])
  );
}

export async function updateOrderStatus(
  orderId: string,
  status: Order["status"]
): Promise<{ updated: boolean; reason?: string }> {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    const updated = await updateOrderStatusInFile(orderId, status);
    return {
      updated,
      reason: updated ? undefined : "Order not found in local store."
    };
  }

  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId)
    .select("id")
    .limit(1);

  if (error || !data || data.length === 0) {
    const updatedInFile = await updateOrderStatusInFile(orderId, status);
    if (updatedInFile) {
      return { updated: true };
    }

    return {
      updated: false,
      reason: error?.message || "Order not found in Supabase."
    };
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

  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    const deleted = await deleteOrderFromFile(trimmedId);
    return {
      deleted,
      reason: deleted ? undefined : "Order not found in local store."
    };
  }

  await supabase.from("order_items").delete().eq("order_id", trimmedId);

  const { data, error } = await supabase
    .from("orders")
    .delete()
    .eq("id", trimmedId)
    .select("id")
    .limit(1);

  if (error || !data?.length) {
    const deletedInFile = await deleteOrderFromFile(trimmedId);
    if (deletedInFile) {
      return { deleted: true };
    }
    return {
      deleted: false,
      reason: error?.message || "Order not found."
    };
  }

  await deleteOrderFromFile(trimmedId);
  return { deleted: true };
}

