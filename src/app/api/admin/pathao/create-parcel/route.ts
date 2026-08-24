import { NextResponse } from "next/server";
import { isAdminAuthorized } from "@/lib/admin-request";
import { withAdminSessionRefresh } from "@/lib/admin-session-response";
import { createPathaoParcel, isPathaoConfigured } from "@/lib/pathao";
import { updateOrderCourier } from "@/lib/orders-repository";

export async function POST(request: Request) {
  try {
    if (!(await isAdminAuthorized())) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    if (!isPathaoConfigured()) {
      return NextResponse.json(
        { message: "Pathao Courier is not configured." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      orderId,
      storeId,
      recipientName,
      recipientPhone,
      recipientAddress,
      recipientCity,
      recipientZone,
      recipientArea,
      itemQuantity,
      itemWeight,
      amountToCollect,
      specialInstruction,
      itemDescription
    } = body || {};

    if (!orderId || !recipientName || !recipientPhone || !recipientAddress || !recipientCity || !recipientZone) {
      return NextResponse.json(
        { message: "Missing required parcel fields (orderId, customer name, phone, address, city, zone)." },
        { status: 400 }
      );
    }

    const result = await createPathaoParcel({
      storeId,
      merchantOrderId: orderId,
      recipientName,
      recipientPhone,
      recipientAddress,
      recipientCity: Number(recipientCity),
      recipientZone: Number(recipientZone),
      recipientArea: recipientArea ? Number(recipientArea) : undefined,
      itemQuantity: itemQuantity ? Number(itemQuantity) : 1,
      itemWeight: itemWeight ? Number(itemWeight) : 0.5,
      amountToCollect: Number(amountToCollect ?? 0),
      specialInstruction,
      itemDescription
    });

    if (!result.success || !result.consignmentId) {
      return NextResponse.json(
        { message: result.error || "Failed to create parcel on Pathao." },
        { status: 400 }
      );
    }

    // Save consignment details into order
    await updateOrderCourier(orderId, {
      courier: "pathao",
      consignmentId: result.consignmentId,
      courierStatus: result.orderStatus || "Pending",
      courierDeliveryFee: result.deliveryFee,
      courierTrackingUrl: `https://pathao.com/courier/tracking/?consignment_id=${encodeURIComponent(result.consignmentId)}`
    });

    return withAdminSessionRefresh(
      NextResponse.json({
        ok: true,
        consignmentId: result.consignmentId,
        orderStatus: result.orderStatus,
        deliveryFee: result.deliveryFee,
        message: result.message || "Parcel successfully booked on Pathao!"
      })
    );
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Internal server error creating parcel.";
    console.error("POST /api/admin/pathao/create-parcel error:", err);
    return NextResponse.json({ message: errorMsg }, { status: 500 });
  }
}
