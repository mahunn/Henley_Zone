"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getProductsCatalog } from "@/lib/product-catalog-client";

/** Starts the shared catalog fetch and prefetches the store route as soon as the shell mounts. */
export function CatalogPrefetch() {
  const router = useRouter();
  useEffect(() => {
    void getProductsCatalog().catch(() => {});
    router.prefetch("/store");
  }, [router]);
  return null;
}
