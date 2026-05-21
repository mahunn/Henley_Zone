import type { Metadata, Viewport } from "next";
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
import { DeferredMetaPixel } from "@/components/analytics/deferred-meta-pixel";

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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" className={notoBengali.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <CartProvider>
          <WishlistProvider>
            <CatalogPrefetch />
            <Suspense fallback={null}>
              <SiteHeader />
            </Suspense>
            <DeferredMetaPixel />
            {children}
            <SiteFooter />
            <FloatingCartButton />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
