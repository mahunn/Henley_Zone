import { NextResponse } from "next/server";
import { getCachedProducts } from "@/lib/products-catalog-server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const products = await getCachedProducts();
    return NextResponse.json(
      { products },
      {
        headers: {
          "Cache-Control": "public, max-age=0, s-maxage=45, stale-while-revalidate=300"
        }
      }
    );
  } catch {
    return NextResponse.json(
      { message: "Failed to load products." },
      { status: 500 }
    );
  }
}
