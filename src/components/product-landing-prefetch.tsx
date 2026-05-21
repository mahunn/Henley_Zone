"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { deferCatalogRefresh } from "@/lib/product-catalog-client";

/** Warms checkout only — product page already has server data. */
export function ProductLandingPrefetch() {
  const router = useRouter();

  useEffect(() => {
    void deferCatalogRefresh().catch(() => {});
    router.prefetch("/checkout");
  }, [router]);

  return null;
}
