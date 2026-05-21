import { DeferredMetaPixel } from "@/components/analytics/deferred-meta-pixel";
import { FloatingCartButton } from "@/components/shop/whatsapp-button";
import { ProductLandingPrefetch } from "@/components/product-landing-prefetch";

/** Minimal shell for Facebook ad landings — no site header or footer. */
export default function ProductLandingLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="product-landing-layout">
      <ProductLandingPrefetch />
      <DeferredMetaPixel />
      <main className="product-landing-main">{children}</main>
      <FloatingCartButton />
    </div>
  );
}
