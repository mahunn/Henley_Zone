"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

type Props = {
  /** From server `layout` — avoids Turbopack/client bundles missing `.env.local` for `process.env`. */
  pixelId?: string;
  testEventCode?: string;
};

/**
 * Meta Pixel — inline script via `dangerouslySetInnerHTML` (reliable with Next 15 + Turbopack).
 * `pixelId` must be supplied from the server layout after reading `NEXT_PUBLIC_META_PIXEL_ID`.
 */
export function MetaFacebookPixel({ pixelId, testEventCode }: Props) {
  const pathname = usePathname();
  const skipNextRoutePageView = useRef(true);

  const initSnippet = useMemo(() => {
    if (!pixelId) return "";
    return `
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
${testEventCode ? `fbq('set', 'test_event_code', ${JSON.stringify(testEventCode)});` : ""}
fbq('init', ${JSON.stringify(pixelId)});
fbq('track', 'PageView');
`.trim();
  }, [pixelId, testEventCode]);

  useEffect(() => {
    if (!pixelId || typeof window === "undefined" || !window.fbq) return;
    if (skipNextRoutePageView.current) {
      skipNextRoutePageView.current = false;
      return;
    }
    window.fbq("track", "PageView");
  }, [pathname, pixelId]);

  if (!pixelId || !initSnippet) return null;

  return (
    <Script
      id="meta-fb-pixel"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: initSnippet }}
    />
  );
}
