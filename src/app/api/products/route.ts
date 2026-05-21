import { NextResponse } from "next/server";
import { getCachedProducts } from "@/lib/products-catalog-server";

export async function GET() {
  try {
    const products = await getCachedProducts();
    return NextResponse.json(
      { products },
      {
        headers: {
          "Cache-Control": "public, s-maxage=45, stale-while-revalidate=300"
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
