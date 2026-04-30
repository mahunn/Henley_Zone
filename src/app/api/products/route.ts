import { NextResponse } from "next/server";
import { listProducts } from "@/lib/products-repository";

export async function GET() {
  try {
    const products = await listProducts();
    return NextResponse.json({ products });
  } catch {
    return NextResponse.json(
      { message: "Failed to load products." },
      { status: 500 }
    );
  }
}

