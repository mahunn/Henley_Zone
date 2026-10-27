"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq_initialized?: boolean;
  }
}

type Props = {
  /** From server `layout` — avoids Turbopack/client bundles missing `.env.local` for `process.env`. */
  pixelId?: string;
  testEventCode?: string;
  strategy?: "afterInteractive" | "lazyOnload" | "beforeInteractive" | "worker";
};

/**
 * Meta Pixel — inline script via `dangerouslySetInnerHTML` (reliable with Next 15 + Turbopack).
 * `pixelId` must be supplied from the server layout after reading `NEXT_PUBLIC_META_PIXEL_ID`.
 */
export function MetaFacebookPixel({ pixelId, strategy = "afterInteractive" }: Props) {
  const pathname = usePathname();
  const skipNextRoutePageView = useRef(true);

  const initSnippet = useMemo(() => {
    if (!pixelId) return "";
    return `
if (!window._fbq_initialized) {
  window._fbq_initialized = true;
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', ${JSON.stringify(pixelId)});
  fbq('track', 'PageView');
}
`.trim();
  }, [pixelId]);

  // Capture `fbclid` from URL query to maintain first-party `_fbc` cookie for Meta CAPI
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const fbclid = searchParams.get("fbclid");
      if (fbclid && !document.cookie.includes("_fbc=")) {
        const creationTime = Date.now();
        document.cookie = `_fbc=fb.1.${creationTime}.${fbclid}; path=/; max-age=7776000; SameSite=Lax`;
      }
    } catch {
      // Ignore
    }
  }, []);

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
      strategy={strategy}
      dangerouslySetInnerHTML={{ __html: initSnippet }}
    />
  );
}
