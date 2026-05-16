"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getProductsCatalog } from "@/lib/product-catalog-client";

/** Warms catalog + key routes as soon as the shell mounts (Facebook ad traffic). */
export function CatalogPrefetch() {
  const router = useRouter();
  useEffect(() => {
    void getProductsCatalog().catch(() => {});
    router.prefetch("/store");
    router.prefetch("/checkout");
  }, [router]);
  return null;
}
