import { NextResponse } from "next/server";
import { isAdminAuthorized } from "@/lib/admin-request";
import { withAdminSessionRefresh } from "@/lib/admin-session-response";
import { getPathaoConfig, testPathaoConnection, isPathaoConfigured } from "@/lib/pathao";

export async function GET() {
  try {
    if (!(await isAdminAuthorized())) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    if (!isPathaoConfigured()) {
      return withAdminSessionRefresh(
        NextResponse.json({
          configured: false,
          connected: false,
          message: "Pathao API credentials are missing. Please configure PATHAO_CLIENT_ID, PATHAO_CLIENT_SECRET, etc."
        })
      );
    }

    const testResult = await testPathaoConnection();
    const config = getPathaoConfig();

    return withAdminSessionRefresh(
      NextResponse.json({
        configured: true,
        ...testResult,
        defaultStoreId: config.storeId || (testResult.stores[0]?.store_id ?? null)
      })
    );
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to test Pathao connection.";
    return NextResponse.json({ message: errorMsg }, { status: 500 });
  }
}
