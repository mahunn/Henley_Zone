import { NextResponse } from "next/server";
import {
  createOrder,
  listOrders,
  updateOrderStatus
} from "@/lib/orders-repository";
import { Order } from "@/types/commerce";
import { isAdminAuthorized } from "@/lib/admin-request";

export async function GET() {
  try {
    if (!(await isAdminAuthorized())) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const orders = await listOrders();
    return NextResponse.json({ orders });
  } catch {
    return NextResponse.json(
      { message: "Failed to read orders." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const order = (await request.json()) as Order;

    if (!order?.id || !order?.items?.length || !order.customerName) {
      return NextResponse.json(
        { message: "Invalid order payload." },
        { status: 400 }
      );
    }

    await createOrder(order);
    return NextResponse.json({ ok: true, orderId: order.id }, { status: 201 });
  } catch {
    return NextResponse.json(
      { message: "Failed to create order." },
      { status: 500 }
    );
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

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { message: "Failed to update order status." },
      { status: 500 }
    );
  }
}

