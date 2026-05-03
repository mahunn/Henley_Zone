import type { Product } from "@/types/commerce";

let memoryCache: Product[] | null = null;
let inflight: Promise<Product[]> | null = null;

/** Synchronous read after a successful load (e.g. user visited home first, then Shop). */
export function getSyncedProductCatalog(): Product[] | null {
  return memoryCache;
}

/**
 * Single deduped fetch for the storefront catalog. Shared by header search and /store
 * so the first navigation to Shop reuses data and feels instant.
 */
export function getProductsCatalog(): Promise<Product[]> {
  if (memoryCache) return Promise.resolve(memoryCache);
  if (!inflight) {
    inflight = fetch("/api/products")
      .then((r) => {
        if (!r.ok) throw new Error("fetch failed");
        return r.json() as Promise<{ products: Product[] }>;
      })
      .then((data) => {
        memoryCache = data.products ?? [];
        inflight = null;
        return memoryCache;
      })
      .catch((e) => {
        inflight = null;
        throw e;
      });
  }
  return inflight;
}

export function invalidateProductCatalog() {
  memoryCache = null;
}
