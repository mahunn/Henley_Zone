import {
  readOrders,
  updateOrderStatus as updateOrderStatusInFile,
  writeOrder
} from "@/lib/orders-store";
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
}

function mapOrderRow(order: OrderRow, items: OrderItemRow[]): Order {
  return {
    id: order.id,
    items: items.map(
      (item): CartItem => ({
        key: `${item.product_id}::legacy::${item.order_id}`,
        productId: item.product_id,
        name: item.product_name,
        price: item.unit_price,
        quantity: item.quantity
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
    await writeOrder(order);
    return;
  }

  const rows = order.items.map((item) => ({
    order_id: order.id,
    product_id: item.productId,
    product_name: item.name,
    unit_price: item.price,
    quantity: item.quantity
  }));

  const { error: itemError } = await supabase.from("order_items").insert(rows);
  if (itemError) {
    await writeOrder(order);
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

