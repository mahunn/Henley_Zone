import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";
import { listProducts } from "@/lib/products-repository";

const getCachedProducts = unstable_cache(
  async () => listProducts(),
  ["store-catalog-products"],
  { revalidate: 45 }
);

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
