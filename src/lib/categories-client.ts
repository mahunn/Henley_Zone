import type { CategoryItem } from "@/types/category";
import { DEFAULT_CATEGORIES } from "@/types/category";

let clientCategoriesCache: CategoryItem[] | null = null;
let fetchPromise: Promise<CategoryItem[]> | null = null;

export function getSyncedCategories(): CategoryItem[] | null {
  return clientCategoriesCache;
}

export async function getCategoriesCatalog(includeAll = false): Promise<CategoryItem[]> {
  if (typeof window === "undefined") {
    return DEFAULT_CATEGORIES;
  }

  const endpoint = includeAll ? "/api/categories?all=1" : "/api/categories";

  if (!includeAll && clientCategoriesCache) {
    return clientCategoriesCache;
  }

  if (fetchPromise && !includeAll) {
    return fetchPromise;
  }

  fetchPromise = fetch(endpoint, { cache: "no-store" })
    .then((res) => {
      if (!res.ok) throw new Error("Failed to load categories.");
      return res.json() as Promise<{ categories: CategoryItem[] }>;
    })
    .then((data) => {
      const list = data.categories ?? DEFAULT_CATEGORIES;
      if (!includeAll) {
        clientCategoriesCache = list;
      }
      return list;
    })
    .catch(() => {
      return DEFAULT_CATEGORIES;
    })
    .finally(() => {
      fetchPromise = null;
    });

  return fetchPromise;
}

export function invalidateCategoriesCatalog() {
  clientCategoriesCache = null;
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("hz:categories-updated"));
  }
}
