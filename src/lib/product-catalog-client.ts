import { seedProducts } from "@/data/seed-products";
import type { Product } from "@/types/commerce";

let memoryCache: Product[] | null = null;
let inflight: Promise<Product[]> | null = null;

/** Synchronous read after a successful load (e.g. user visited home first, then Shop). */
export function getSyncedProductCatalog(): Product[] | null {
  return memoryCache;
}

function refreshCatalogFromApi(): Promise<Product[]> {
  return fetch("/api/products", { cache: "no-store" })
    .then((r) => {
      if (!r.ok) throw new Error("fetch failed");
      return r.json() as Promise<{ products: Product[] }>;
    })
    .then((data) => {
      if (data.products?.length) {
        memoryCache = data.products;
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("hz:catalog-updated"));
        }
      }
      return memoryCache ?? [...seedProducts];
    });
}

/**
 * Returns catalog immediately from bundled seeds, then refreshes from the API in the background.
 * Shared by header search, store, and product pages so ad traffic never blocks on Supabase.
 */
export function getProductsCatalog(): Promise<Product[]> {
  if (memoryCache) return Promise.resolve(memoryCache);

  memoryCache = [...seedProducts];

  if (!inflight) {
    inflight = refreshCatalogFromApi()
      .catch(() => memoryCache ?? [...seedProducts])
      .finally(() => {
        inflight = null;
      });
  }

  return Promise.resolve(memoryCache);
}

export function invalidateProductCatalog() {
  memoryCache = null;
  inflight = null;
}
