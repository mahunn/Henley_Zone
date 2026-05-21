"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { deferCatalogRefresh, getProductsCatalog } from "@/lib/product-catalog-client";

/** Warms catalog + checkout on non-product routes; product pages already have server data. */
export function CatalogPrefetch() {
  const router = useRouter();
  const pathname = usePathname() ?? "";
  const isProductPage = pathname.startsWith("/product/");

  useEffect(() => {
    if (isProductPage) {
      void deferCatalogRefresh().catch(() => {});
    } else {
      void getProductsCatalog().catch(() => {});
      router.prefetch("/store");
    }
    router.prefetch("/checkout");
  }, [router, isProductPage]);
  return null;
}
