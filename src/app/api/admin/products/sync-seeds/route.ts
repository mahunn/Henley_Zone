import { NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import { isAdminAuthorized } from "@/lib/admin-request";
import { withAdminSessionRefresh } from "@/lib/admin-session-response";
import { syncSeedProductsToSupabase } from "@/lib/products-repository";

export async function POST() {
  try {
    if (!(await isAdminAuthorized())) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const result = await syncSeedProductsToSupabase();

    if (!result.success) {
      return NextResponse.json({ message: result.message }, { status: 500 });
    }

    // Invalidate next.js cache tags for products catalog
    try {
      revalidateTag("products", "default");
      revalidatePath("/api/products");
    } catch (e) {
      console.warn("Revalidation failed:", e);
    }

    return withAdminSessionRefresh(
      NextResponse.json({
        ok: true,
        message: result.message,
        syncedCount: result.syncedCount
      })
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Sync failed.";
    return NextResponse.json({ message: msg }, { status: 500 });
  }
}
