"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ProductDetailView } from "@/components/shop/product-detail-view";
import { getProductsCatalog } from "@/lib/product-catalog-client";
import { mapProductToPdpDetail, type PdpDetail } from "@/lib/product-detail-mapper";
import { productPagePath } from "@/lib/product-url";
import { seedProducts } from "@/data/seed-products";
import type { Product } from "@/types/commerce";

function productToRelated(p: Product) {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    category: p.category,
    image: p.imageUrl,
    price: p.price
  };
}

export function ProductDetailShell({
  slug,
  initialDetail
}: {
  slug: string;
  initialDetail: PdpDetail | null;
}) {
  const router = useRouter();
  const [catalog, setCatalog] = useState<Product[]>(() => [...seedProducts]);
  const [detail, setDetail] = useState<PdpDetail | null>(initialDetail);
  const [resolving, setResolving] = useState(!initialDetail);

  useEffect(() => {
    router.prefetch("/checkout");
    router.prefetch("/store");
  }, [router]);

  useEffect(() => {
    let cancelled = false;

    const applyCatalog = (products: Product[]) => {
      if (cancelled) return;
      setCatalog(products);
      const found = products.find((p) => p.slug === slug);
      if (found) {
        setDetail(mapProductToPdpDetail(found));
        setResolving(false);
      }
    };

    void getProductsCatalog().then(applyCatalog);

    const onUpdate = () => {
      void getProductsCatalog().then(applyCatalog);
    };
    window.addEventListener("hz:catalog-updated", onUpdate);
    return () => {
      cancelled = true;
      window.removeEventListener("hz:catalog-updated", onUpdate);
    };
  }, [slug]);

  const related = useMemo(
    () =>
      catalog
        .filter((p) => p.slug !== slug)
        .slice(0, 6)
        .map(productToRelated),
    [catalog, slug]
  );

  if (resolving && !detail) {
    return (
      <div className="container pdp-skeleton-wrap" aria-busy="true" aria-label="Loading product">
        <div className="pdp-skeleton">
          <div className="pdp-skeleton-gallery" />
          <div className="pdp-skeleton-info">
            <div className="pdp-skeleton-line wide" />
            <div className="pdp-skeleton-line" />
            <div className="pdp-skeleton-line short" />
          </div>
        </div>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="container" style={{ padding: "48px 16px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "var(--font-heading, serif)", marginBottom: 12 }}>Product not found</h2>
        <a href="/store" className="btn">
          Browse store
        </a>
      </div>
    );
  }

  return (
    <ProductDetailView
      product={detail}
      relatedProducts={related}
      productLink={(s) => productPagePath(s)}
      onBack={() => router.push("/store")}
    />
  );
}
