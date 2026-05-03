import { NextResponse } from "next/server";
import { listProducts } from "@/lib/products-repository";

export async function GET() {
  try {
    const products = await listProducts();
    return NextResponse.json(
      { products },
      {
        headers: {
          // Short private cache: faster repeat visits; catalog is shared client-side anyway.
          "Cache-Control": "private, max-age=30, stale-while-revalidate=120"
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

