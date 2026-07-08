import { seedProducts } from "@/data/seed-products";
import type { Product } from "@/types/commerce";

let memoryCache: Product[] | null = null;
let isLoadedFromApi = false;
let inflight: Promise<Product[]> | null = null;

/** Synchronous read after a successful load (e.g. user visited home first, then Shop). */
export function getSyncedProductCatalog(): Product[] | null {
  return isLoadedFromApi ? memoryCache : null;
}

function refreshCatalogFromApi(): Promise<Product[]> {
  return fetch("/api/products")
    .then((r) => {
      if (!r.ok) throw new Error("fetch failed");
      return r.json() as Promise<{ products: Product[] }>;
    })
    .then((data) => {
      if (data.products && Array.isArray(data.products)) {
        memoryCache = data.products;
        isLoadedFromApi = true;
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
  if (isLoadedFromApi && memoryCache) return Promise.resolve(memoryCache);

  if (!memoryCache) {
    memoryCache = [...seedProducts];
  }

  if (!inflight) {
    inflight = refreshCatalogFromApi()
      .then((products) => {
        isLoadedFromApi = true;
        return products;
      })
      .catch(() => memoryCache ?? [...seedProducts])
      .finally(() => {
        inflight = null;
      });
  }

  return Promise.resolve(memoryCache);
}

export function invalidateProductCatalog() {
  memoryCache = null;
  isLoadedFromApi = false;
  inflight = null;
}

/** Defer Supabase sync until after first paint (product pages with server data). */
export function deferCatalogRefresh(): Promise<Product[]> {
  if (isLoadedFromApi && memoryCache) {
    return Promise.resolve(memoryCache);
  }

  if (!memoryCache) {
    memoryCache = [...seedProducts];
  }

  return new Promise((resolve) => {
    const run = () => {
      void getProductsCatalog().then(resolve);
    };
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      window.requestIdleCallback(run, { timeout: 2500 });
    } else {
      setTimeout(run, 800);
    }
  });
}

