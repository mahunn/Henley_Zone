import type { Metadata } from "next";
import { Suspense } from "react";
import { Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";
import { defaultBusiness } from "@/config/businesses";
import { CartProvider } from "@/components/cart-provider";
import { WishlistProvider } from "@/components/wishlist-provider";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { FloatingCartButton } from "@/components/shop/whatsapp-button";
import { CatalogPrefetch } from "@/components/catalog-prefetch";
import { MetaFacebookPixel } from "@/components/analytics/meta-facebook-pixel";
import { getMetaPixelEnv } from "@/lib/meta-pixel-config";

const notoBengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  variable: "--font-bn",
  weight: ["400", "500", "600", "700"],
  display: "swap"
});

export const metadata: Metadata = {
  title: defaultBusiness.name,
  description: defaultBusiness.tagline
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { pixelId: metaPixelId, testEventCode: metaPixelTest } = getMetaPixelEnv();

  return (
    <html lang="bn" className={notoBengali.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <CartProvider>
          <WishlistProvider>
            <CatalogPrefetch />
            <Suspense fallback={null}>
              <SiteHeader />
            </Suspense>
            <MetaFacebookPixel pixelId={metaPixelId} testEventCode={metaPixelTest} />
            {children}
            <SiteFooter />
            <FloatingCartButton />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
