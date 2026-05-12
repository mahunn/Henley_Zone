import { randomUUID } from "node:crypto";
import { seedProducts } from "@/data/seed-products";
import type { Product, ProductColor } from "@/types/commerce";
import { getSupabaseAdminClient } from "@/lib/supabase-server";
import { normalizeProductSlug, slugifyName } from "@/lib/slug";

interface ProductRow {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
  category: string;
  colors_json?: unknown;
  sizes_json?: unknown;
}

function parseColorsJson(raw: unknown): ProductColor[] | undefined {
  if (!raw || !Array.isArray(raw) || raw.length === 0) return undefined;
  const out: ProductColor[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;
    const id = typeof o.id === "string" ? o.id : "";
    const label = typeof o.label === "string" ? o.label : "";
    const image = typeof o.image === "string" ? o.image : "";
    if (id && label && image) out.push({ id, label, image });
  }
  return out.length ? out : undefined;
}

function parseSizesJson(raw: unknown): string[] | undefined {
  if (!raw || !Array.isArray(raw) || raw.length === 0) return undefined;
  const out = raw.filter((x): x is string => typeof x === "string" && x.trim().length > 0).map((s) => s.trim());
  return out.length ? out : undefined;
}

/** Old placeholder catalog rows (Supabase); hidden so only Henley seed + real admin products show. */
const LEGACY_DEMO_PRODUCT_NAMES = new Set(
  ["classic polo shirt", "slim fit chino", "summer linen shirt"]
);

const LEGACY_DEMO_PRODUCT_SLUGS = new Set([
  "classic-polo-shirt",
  "slim-fit-chino",
  "summer-linen-shirt"
]);

function isLegacyWesternDemoProduct(p: Product): boolean {
  const name = p.name.trim().toLowerCase();
  if (LEGACY_DEMO_PRODUCT_NAMES.has(name)) return true;
  return LEGACY_DEMO_PRODUCT_SLUGS.has(normalizeProductSlug(p.slug));
}

/** Suppressions are optional until migration runs; never fail catalog load on this query. */
async function fetchSuppressedProductIds(
  supabase: NonNullable<ReturnType<typeof getSupabaseAdminClient>>
): Promise<Set<string>> {
  const { data, error } = await supabase.from("catalog_suppressions").select("product_id");
  if (error) {
    return new Set();
  }
  const ids = (data ?? [])
    .map((r: { product_id?: string }) => (typeof r.product_id === "string" ? r.product_id.trim() : ""))
    .filter(Boolean);
  return new Set(ids);
}

export function toProduct(row: ProductRow): Product {
  const colors = parseColorsJson(row.colors_json);
  const sizes = parseSizesJson(row.sizes_json);
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    price: row.price,
    stock: row.stock,
    imageUrl: row.image_url,
    category: row.category,
    colors,
    sizes
  };
}

export async function listProducts(): Promise<Product[]> {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return seedProducts;
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) {
    return seedProducts;
  }

  const dbProducts = (data as ProductRow[])
    .map(toProduct)
    .filter((p) => !isLegacyWesternDemoProduct(p));

  const suppressed = await fetchSuppressedProductIds(supabase);

  const seedIds = new Set(seedProducts.map((p) => p.id));
  const dbById = new Map(dbProducts.map((p) => [p.id, p]));
  const mergedSeeds = seedProducts
    .filter((s) => !suppressed.has(s.id))
    .map((s) => dbById.get(s.id) ?? s);
  const extraDbProducts = dbProducts.filter((p) => !seedIds.has(p.id) && !suppressed.has(p.id));

  return [...mergedSeeds, ...extraDbProducts];
}

export interface CreateProductInput {
  name: string;
  slug?: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  category: string;
  colors: ProductColor[];
  sizes: string[];
}

export interface UpdateProductInput {
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  category: string;
  colors: ProductColor[];
  sizes: string[];
}

export async function deleteProductById(productId: string): Promise<void> {
  const id = productId.trim();
  if (!id) throw new Error("Product id is required.");

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const seedIds = new Set(seedProducts.map((p) => p.id));

  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) {
    throw new Error(error.message || "Delete failed");
  }

  if (seedIds.has(id)) {
    const { error: supErr } = await supabase
      .from("catalog_suppressions")
      .upsert({ product_id: id }, { onConflict: "product_id" });
    if (supErr) {
      throw new Error(
        supErr.message ||
          "Could not hide built-in product. In Supabase, run the migration that creates table catalog_suppressions."
      );
    }
  }
}

export async function updateProductById(productId: string, input: UpdateProductInput): Promise<Product> {
  const id = productId.trim();
  if (!id) throw new Error("Product id is required.");

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const colorsClean = input.colors
    .map((c) => ({
      id: c.id.trim() || slugifyName(c.label),
      label: c.label.trim(),
      image: c.image.trim()
    }))
    .filter((c) => c.label && c.image);
  const sizesClean = input.sizes.map((s) => s.trim()).filter(Boolean);

  const seedMatch = seedProducts.find((p) => p.id === id);
  const { data: existingRow, error: fetchErr } = await supabase
    .from("products")
    .select("slug")
    .eq("id", id)
    .maybeSingle();

  if (fetchErr) throw new Error(fetchErr.message || "Could not load product.");

  const rawSlug =
    (existingRow as { slug?: string } | null)?.slug?.trim() ||
    seedMatch?.slug ||
    slugifyName(input.name);
  const slug = normalizeProductSlug(rawSlug) || slugifyName(input.name);

  const row = {
    id,
    slug,
    name: input.name.trim(),
    description: input.description.trim(),
    price: Math.round(input.price),
    stock: Math.max(0, Math.round(input.stock)),
    image_url: input.imageUrl.trim(),
    category: input.category.trim(),
    colors_json: colorsClean,
    sizes_json: sizesClean
  };

  const { data, error } = await supabase.from("products").upsert(row, { onConflict: "id" }).select("*").single();

  if (error) throw new Error(error.message || "Update failed");

  await supabase.from("catalog_suppressions").delete().eq("product_id", id);

  return toProduct(data as ProductRow);
}

export async function createProduct(input: CreateProductInput): Promise<Product> {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    throw new Error("Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  }

  const id = randomUUID();
  const fromSlugField = input.slug?.trim() ? normalizeProductSlug(input.slug) : "";
  const slug = fromSlugField.length >= 2 ? fromSlugField : slugifyName(input.name);

  const colorsClean = input.colors
    .map((c) => ({
      id: c.id.trim() || slugifyName(c.label),
      label: c.label.trim(),
      image: c.image.trim()
    }))
    .filter((c) => c.label && c.image);

  const sizesClean = input.sizes.map((s) => s.trim()).filter(Boolean);

  const row = {
    id,
    slug,
    name: input.name.trim(),
    description: input.description.trim(),
    price: Math.round(input.price),
    stock: Math.max(0, Math.round(input.stock)),
    image_url: input.imageUrl.trim(),
    category: input.category.trim(),
    colors_json: colorsClean,
    sizes_json: sizesClean
  };

  const { data, error } = await supabase.from("products").insert(row).select("*").single();

  if (error) {
    const msg = error.message?.toLowerCase().includes("unique") ? "Slug already exists. Change the slug or name." : error.message;
    throw new Error(msg || "Insert failed");
  }

  return toProduct(data as ProductRow);
}
