import { promises as fs } from "fs";
import path from "path";
import { Order } from "@/types/commerce";

const dataDir = path.join(process.cwd(), "data");
const ordersPath = path.join(dataDir, "orders.json");

async function ensureStore(): Promise<void> {
  try {
    await fs.mkdir(dataDir, { recursive: true });
    try {
      await fs.access(ordersPath);
    } catch {
      await fs.writeFile(ordersPath, "[]", "utf8");
    }
  } catch (err) {
    console.warn("Could not ensure local order store directory:", err);
  }
}

export async function readOrders(): Promise<Order[]> {
  try {
    await ensureStore();
    const raw = await fs.readFile(ordersPath, "utf8");
    const parsed = JSON.parse(raw) as Order[];
    return parsed.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
  } catch (err) {
    console.warn("Failed to read local orders store:", err);
    return [];
  }
}

export async function writeOrder(order: Order): Promise<void> {
  try {
    await ensureStore();
    const all = await readOrders();
    // Prevent duplicate entries in local store
    const existingIndex = all.findIndex((o) => o.id === order.id);
    if (existingIndex !== -1) {
      all[existingIndex] = order;
    } else {
      all.unshift(order);
    }
    await fs.writeFile(ordersPath, JSON.stringify(all, null, 2), "utf8");
  } catch (err) {
    console.error("Local order write error:", err);
  }
}

export async function updateOrderStatus(
  orderId: string,
  status: Order["status"]
): Promise<boolean> {
  try {
    const all = await readOrders();
    const index = all.findIndex((order) => order.id === orderId);
    if (index === -1) {
      return false;
    }

    all[index] = { ...all[index], status };
    await fs.writeFile(ordersPath, JSON.stringify(all, null, 2), "utf8");
    return true;
  } catch (err) {
    console.error("Local order status update error:", err);
    return false;
  }
}

export async function updateOrderCourierInFile(
  orderId: string,
  courierData: {
    courier: string;
    consignmentId: string;
    courierStatus?: string;
    courierDeliveryFee?: number;
    courierTrackingUrl?: string;
  }
): Promise<boolean> {
  try {
    const all = await readOrders();
    const index = all.findIndex((order) => order.id === orderId);
    if (index === -1) {
      return false;
    }

    all[index] = {
      ...all[index],
      courier: courierData.courier,
      consignmentId: courierData.consignmentId,
      courierStatus: courierData.courierStatus || all[index].courierStatus || "Pending",
      courierDeliveryFee: courierData.courierDeliveryFee ?? all[index].courierDeliveryFee,
      courierTrackingUrl: courierData.courierTrackingUrl || all[index].courierTrackingUrl
    };
    await fs.writeFile(ordersPath, JSON.stringify(all, null, 2), "utf8");
    return true;
  } catch (err) {
    console.error("Local order courier update error:", err);
    return false;
  }
}

export async function deleteOrderFromFile(orderId: string): Promise<boolean> {
  try {
    const all = await readOrders();
    const next = all.filter((order) => order.id !== orderId);
    if (next.length === all.length) {
      return false;
    }
    await fs.writeFile(ordersPath, JSON.stringify(next, null, 2), "utf8");
    return true;
  } catch (err) {
    console.error("Local order deletion error:", err);
    return false;
  }
}
