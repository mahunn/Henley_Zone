import { promises as fs } from "fs";
import path from "path";
import { canUseLocalOrderFileStore } from "@/lib/runtime-env";
import { Order } from "@/types/commerce";

const dataDir = path.join(process.cwd(), "data");
const ordersPath = path.join(dataDir, "orders.json");

async function ensureStore() {
  if (!canUseLocalOrderFileStore()) {
    return;
  }
  await fs.mkdir(dataDir, { recursive: true });
  try {
    await fs.access(ordersPath);
  } catch {
    await fs.writeFile(ordersPath, "[]", "utf8");
  }
}

export async function readOrders(): Promise<Order[]> {
  if (!canUseLocalOrderFileStore()) {
    try {
      const raw = await fs.readFile(ordersPath, "utf8");
      const parsed = JSON.parse(raw) as Order[];
      return parsed.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    } catch {
      return [];
    }
  }

  await ensureStore();
  const raw = await fs.readFile(ordersPath, "utf8");
  const parsed = JSON.parse(raw) as Order[];
  return parsed.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

function assertLocalOrderFileWritable() {
  if (!canUseLocalOrderFileStore()) {
    throw new Error(
      "Order storage is not configured for production. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your hosting environment (e.g. Vercel)."
    );
  }
}

export async function writeOrder(order: Order): Promise<void> {
  assertLocalOrderFileWritable();
  const all = await readOrders();
  all.unshift(order);
  await fs.writeFile(ordersPath, JSON.stringify(all, null, 2), "utf8");
}

export async function updateOrderStatus(
  orderId: string,
  status: Order["status"]
): Promise<boolean> {
  if (!canUseLocalOrderFileStore()) {
    return false;
  }
  const all = await readOrders();
  const index = all.findIndex((order) => order.id === orderId);
  if (index === -1) {
    return false;
  }

  all[index] = { ...all[index], status };
  await fs.writeFile(ordersPath, JSON.stringify(all, null, 2), "utf8");
  return true;
}

export async function deleteOrderFromFile(orderId: string): Promise<boolean> {
  if (!canUseLocalOrderFileStore()) {
    return false;
  }
  const all = await readOrders();
  const next = all.filter((order) => order.id !== orderId);
  if (next.length === all.length) {
    return false;
  }
  await fs.writeFile(ordersPath, JSON.stringify(next, null, 2), "utf8");
  return true;
}

