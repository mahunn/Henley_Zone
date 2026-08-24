import { NextResponse } from "next/server";
import { isAdminAuthorized } from "@/lib/admin-request";
import { withAdminSessionRefresh } from "@/lib/admin-session-response";
import { trackPathaoParcel, isPathaoConfigured } from "@/lib/pathao";
import { updateOrderCourier } from "@/lib/orders-repository";

export async function GET(request: Request) {
  try {
    if (!(await isAdminAuthorized())) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    if (!isPathaoConfigured()) {
      return NextResponse.json({ message: "Pathao is not configured." }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const consignmentId = searchParams.get("consignment_id");
    const orderId = searchParams.get("order_id");

    if (!consignmentId) {
      return NextResponse.json({ message: "consignment_id is required." }, { status: 400 });
    }

    const trackingData = await trackPathaoParcel(consignmentId);

    if (!trackingData) {
      return NextResponse.json(
        { message: "Could not retrieve tracking details for this consignment." },
        { status: 404 }
      );
    }

    if (orderId && trackingData.order_status) {
      await updateOrderCourier(orderId, {
        courier: "pathao",
        consignmentId: consignmentId,
        courierStatus: trackingData.order_status
      });
    }

    return withAdminSessionRefresh(
      NextResponse.json({
        ok: true,
        data: trackingData
      })
    );
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to track parcel.";
    return NextResponse.json({ message: errorMsg }, { status: 500 });
  }
}
