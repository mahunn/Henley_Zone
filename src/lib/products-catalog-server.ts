import { unstable_cache } from "next/cache";
import { seedProducts } from "@/data/seed-products";
import { listProducts } from "@/lib/products-repository";
import type { Product } from "@/types/commerce";

/** Shared server cache for catalog (SSG, PDP, API). */
export const getCachedProducts = unstable_cache(
  async () => listProducts(),
  ["store-catalog-products"],
  { revalidate: 60, tags: ["products"] }
);

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const decoded = decodeURIComponent(slug).trim();
  if (!decoded) return null;
  const products = await getCachedProducts();
  return products.find((p) => p.slug === decoded) ?? null;
}

/** Fast path: bundled seeds only (build-time static params fallback). */
export function getSeedProductBySlug(slug: string): Product | null {
  const decoded = decodeURIComponent(slug).trim();
  return seedProducts.find((p) => p.slug === decoded) ?? null;
}
