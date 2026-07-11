"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim();
const testEventCode = process.env.NEXT_PUBLIC_META_PIXEL_TEST_EVENT_CODE?.trim();
const validPixelId = pixelId && /^\d{10,20}$/.test(pixelId) ? pixelId : undefined;

const MetaFacebookPixel = dynamic(
  () => import("@/components/analytics/meta-facebook-pixel").then((m) => m.MetaFacebookPixel),
  { ssr: false, loading: () => null }
);

/** Loads Meta Pixel after idle on product pages so ad landings paint faster. */
export function DeferredMetaPixel() {
  const pathname = usePathname() ?? "";
  const isProductPage = pathname.startsWith("/product/") || pathname.startsWith("/p/");

  if (!validPixelId) return null;

  if (isProductPage) {
    return <MetaFacebookPixel pixelId={validPixelId} testEventCode={testEventCode} strategy="lazyOnload" />;
  }

  return <MetaFacebookPixel pixelId={validPixelId} testEventCode={testEventCode} strategy="afterInteractive" />;
}
