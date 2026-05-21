import type { Metadata, Viewport } from "next";
import { Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";
import { defaultBusiness } from "@/config/businesses";
import { CartProvider } from "@/components/cart-provider";
import { WishlistProvider } from "@/components/wishlist-provider";

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

/** Root: fonts + cart state only. Chrome is added per route group. */
export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" className={notoBengali.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <CartProvider>
          <WishlistProvider>{children}</WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
