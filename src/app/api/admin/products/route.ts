import { NextResponse } from "next/server";
import { isAdminAuthorized } from "@/lib/admin-request";
import { createProduct, type CreateProductInput } from "@/lib/products-repository";
import type { ProductColor } from "@/types/commerce";

function parseBody(body: unknown): CreateProductInput | { error: string } {
  if (!body || typeof body !== "object") return { error: "Invalid JSON body." };
  const o = body as Record<string, unknown>;

  const name = typeof o.name === "string" ? o.name : "";
  const description = typeof o.description === "string" ? o.description : "";
  const category = typeof o.category === "string" ? o.category : "";
  const imageUrl = typeof o.imageUrl === "string" ? o.imageUrl : "";
  const price = typeof o.price === "number" ? o.price : Number(o.price);
  const stock = typeof o.stock === "number" ? o.stock : Number(o.stock);
  const slug = typeof o.slug === "string" ? o.slug : undefined;

  if (!name.trim()) return { error: "Name is required." };
  if (!description.trim()) return { error: "Description is required." };
  if (!category.trim()) return { error: "Category is required." };
  if (!imageUrl.trim()) return { error: "Primary image URL is required." };
  if (!Number.isFinite(price) || price < 0) return { error: "Valid price is required." };
  if (!Number.isFinite(stock) || stock < 0) return { error: "Valid stock is required." };

  let colors: ProductColor[] = [];
  if (Array.isArray(o.colors)) {
    for (const c of o.colors) {
      if (!c || typeof c !== "object") continue;
      const row = c as Record<string, unknown>;
      const id = typeof row.id === "string" ? row.id : "";
      const label = typeof row.label === "string" ? row.label : "";
      const image = typeof row.image === "string" ? row.image : "";
      if (label && image) colors.push({ id: id || label.toLowerCase().replace(/\s+/g, "_"), label, image });
    }
  }

  let sizes: string[] = [];
  if (Array.isArray(o.sizes)) {
    sizes = o.sizes.filter((x): x is string => typeof x === "string").map((s) => s.trim()).filter(Boolean);
  }

  if (sizes.length === 0) return { error: "At least one size is required." };

  return {
    name: name.trim(),
    description: description.trim(),
    category: category.trim(),
    imageUrl: imageUrl.trim(),
    price,
    stock,
    slug,
    colors,
    sizes
  };
}

export async function POST(request: Request) {
  try {
    if (!(await isAdminAuthorized())) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    let json: unknown;
    try {
      json = await request.json();
    } catch {
      return NextResponse.json({ message: "Invalid JSON." }, { status: 400 });
    }

    const parsed = parseBody(json);
    if ("error" in parsed) {
      return NextResponse.json({ message: parsed.error }, { status: 400 });
    }

    const product = await createProduct(parsed);
    return NextResponse.json({ ok: true, product }, { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to create product.";
    const status = message.includes("Slug already") ? 409 : 500;
    return NextResponse.json({ message }, { status });
  }
}
