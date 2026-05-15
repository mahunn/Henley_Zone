import { NextResponse } from "next/server";
import {
  allocateNextOrderId,
  createOrder,
  deleteOrder,
  listOrders,
  updateOrderStatus
} from "@/lib/orders-repository";
import { Order } from "@/types/commerce";
import { isAdminAuthorized } from "@/lib/admin-request";
import { withAdminSessionRefresh } from "@/lib/admin-session-response";

export async function GET() {
  try {
    if (!(await isAdminAuthorized())) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const orders = await listOrders();
    return withAdminSessionRefresh(NextResponse.json({ orders }));
  } catch {
    return NextResponse.json(
      { message: "Failed to read orders." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Order;

    if (!body?.items?.length || !body.customerName?.trim() || !body.phone?.trim() || !body.address?.trim()) {
      return NextResponse.json(
        { message: "Invalid order payload." },
        { status: 400 }
      );
    }

    const createdAt = body.createdAt || new Date().toISOString();
    const order: Order = {
      ...body,
      id: body.id?.trim() ? body.id.trim() : await allocateNextOrderId(createdAt),
      createdAt,
      customerName: body.customerName.trim(),
      phone: body.phone.trim(),
      address: body.address.trim(),
      note: body.note?.trim() || undefined
    };

    await createOrder(order);
    return NextResponse.json({ ok: true, orderId: order.id, order }, { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to create order.";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    if (!(await isAdminAuthorized())) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const body = (await request.json()) as {
      orderId?: string;
      status?: Order["status"];
    };

    const validStatuses: Order["status"][] = [
      "pending",
      "confirmed",
      "delivered",
      "cancelled"
    ];

    if (!body.orderId || !body.status || !validStatuses.includes(body.status)) {
      return NextResponse.json(
        { message: "Invalid update payload." },
        { status: 400 }
      );
    }

    const result = await updateOrderStatus(body.orderId, body.status);
    if (!result.updated) {
      return NextResponse.json(
        { message: result.reason || "Order not found." },
        { status: 400 }
      );
    }

    return withAdminSessionRefresh(NextResponse.json({ ok: true }));
  } catch {
    return NextResponse.json(
      { message: "Failed to update order status." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    if (!(await isAdminAuthorized())) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const body = (await request.json()) as { orderIds?: string[] };
    const orderIds = (body.orderIds ?? [])
      .map((id) => id.trim())
      .filter(Boolean);

    if (!orderIds.length) {
      return NextResponse.json(
        { message: "No order ids provided." },
        { status: 400 }
      );
    }

    const deleted: string[] = [];
    const failed: { id: string; reason: string }[] = [];

    for (const orderId of orderIds) {
      const result = await deleteOrder(orderId);
      if (result.deleted) {
        deleted.push(orderId);
      } else {
        failed.push({ id: orderId, reason: result.reason || "Delete failed." });
      }
    }

    if (!deleted.length) {
      return NextResponse.json(
        { message: failed[0]?.reason || "Could not delete orders.", failed },
        { status: 400 }
      );
    }

    return withAdminSessionRefresh(
      NextResponse.json({ ok: true, deleted, failed })
    );
  } catch {
    return NextResponse.json(
      { message: "Failed to delete orders." },
      { status: 500 }
    );
  }
}

