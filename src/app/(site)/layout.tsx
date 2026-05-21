import { Suspense } from "react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { FloatingCartButton } from "@/components/shop/whatsapp-button";
import { CatalogPrefetch } from "@/components/catalog-prefetch";
import { DeferredMetaPixel } from "@/components/analytics/deferred-meta-pixel";

export default function SiteLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <CatalogPrefetch />
      <Suspense fallback={null}>
        <SiteHeader />
      </Suspense>
      <DeferredMetaPixel />
      {children}
      <SiteFooter />
      <FloatingCartButton />
    </>
  );
}
