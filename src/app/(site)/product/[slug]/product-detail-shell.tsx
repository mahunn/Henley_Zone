"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ProductDetailView } from "@/components/shop/product-detail-view";
import type { RelatedProductItem } from "@/components/shop/related-products-section";
import { deferCatalogRefresh, getProductsCatalog } from "@/lib/product-catalog-client";
import { mapProductToPdpDetail, type PdpDetail } from "@/lib/product-detail-mapper";
import { productPagePath } from "@/lib/product-url";
import { bn } from "@/config/ui-bn";
import { seedProducts } from "@/data/seed-products";
import type { Product } from "@/types/commerce";

function productToRelated(p: Product): RelatedProductItem {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    category: p.category,
    image: p.imageUrl,
    price: p.price
  };
}

const RelatedProductsLazy = dynamic(
  () =>
    import("@/components/shop/related-products-section").then((m) => m.RelatedProductsSection),
  { ssr: false, loading: () => null }
);

export function ProductDetailShell({
  slug,
  initialDetail,
  initialRelated = [],
  skipCatalogUntilIdle = false
}: {
  slug: string;
  initialDetail: PdpDetail | null;
  initialRelated?: RelatedProductItem[];
  /** When server already sent product HTML, defer API catalog sync until browser is idle */
  skipCatalogUntilIdle?: boolean;
}) {
  const router = useRouter();
  const [catalog, setCatalog] = useState<Product[]>(() => [...seedProducts]);
  const [detail, setDetail] = useState<PdpDetail | null>(initialDetail);
  const [related, setRelated] = useState<RelatedProductItem[]>(initialRelated);
  const [resolving, setResolving] = useState(!initialDetail);

  useEffect(() => {
    router.prefetch("/checkout");
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
      } else if (!initialDetail) {
        setResolving(false);
      }
      setRelated(
        products
          .filter((p) => p.slug !== slug)
          .slice(0, 6)
          .map(productToRelated)
      );
    };

    if (skipCatalogUntilIdle) {
      deferCatalogRefresh().then(applyCatalog);
      const onUpdate = () => {
        void getProductsCatalog().then(applyCatalog);
      };
      window.addEventListener("hz:catalog-updated", onUpdate);
      return () => {
        cancelled = true;
        window.removeEventListener("hz:catalog-updated", onUpdate);
      };
    }

    void getProductsCatalog().then(applyCatalog);
    const onUpdate = () => {
      void getProductsCatalog().then(applyCatalog);
    };
    window.addEventListener("hz:catalog-updated", onUpdate);
    return () => {
      cancelled = true;
      window.removeEventListener("hz:catalog-updated", onUpdate);
    };
  }, [slug, initialDetail, skipCatalogUntilIdle]);

  const relatedFallback = useMemo(
    () =>
      catalog
        .filter((p) => p.slug !== slug)
        .slice(0, 6)
        .map(productToRelated),
    [catalog, slug]
  );

  const relatedToShow = related.length ? related : relatedFallback;

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
        <h2 style={{ marginBottom: 12 }}>{bn.product.notFound}</h2>
        <a href="/store" className="btn">
          {bn.product.browseStore}
        </a>
      </div>
    );
  }

  return (
    <>
      <ProductDetailView
        product={detail}
        productLink={(s) => productPagePath(s)}
        onBack={() => router.push("/store")}
        renderRelated={false}
      />
      <div className="container">
        <RelatedProductsLazy
          title={bn.product.related}
          relatedProducts={relatedToShow}
          productLink={(s) => productPagePath(s)}
        />
      </div>
    </>
  );
}
