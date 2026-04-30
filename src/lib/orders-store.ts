import { promises as fs } from "fs";
import path from "path";
import { Order } from "@/types/commerce";

const dataDir = path.join(process.cwd(), "data");
const ordersPath = path.join(dataDir, "orders.json");

async function ensureStore() {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    await fs.access(ordersPath);
  } catch {
    await fs.writeFile(ordersPath, "[]", "utf8");
  }
}

export async function readOrders(): Promise<Order[]> {
  await ensureStore();
  const raw = await fs.readFile(ordersPath, "utf8");
  const parsed = JSON.parse(raw) as Order[];
  return parsed.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function writeOrder(order: Order): Promise<void> {
  const all = await readOrders();
  all.unshift(order);
  await fs.writeFile(ordersPath, JSON.stringify(all, null, 2), "utf8");
}

export async function updateOrderStatus(
  orderId: string,
  status: Order["status"]
): Promise<boolean> {
  const all = await readOrders();
  const index = all.findIndex((order) => order.id === orderId);
  if (index === -1) {
    return false;
  }

  all[index] = { ...all[index], status };
  await fs.writeFile(ordersPath, JSON.stringify(all, null, 2), "utf8");
  return true;
}

