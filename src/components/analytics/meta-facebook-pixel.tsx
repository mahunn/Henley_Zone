"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";

function readEnvTrim(key: string): string | undefined {
  const v = process.env[key];
  if (v == null || typeof v !== "string") return undefined;
  const t = v.trim();
  return t.length ? t : undefined;
}

/** Meta Pixel IDs are numeric strings (often 15–16 digits). */
function isLikelyMetaPixelId(id: string): boolean {
  return /^\d{10,20}$/.test(id);
}

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * Meta Pixel (Facebook) — browser events only.
 * Vercel: set NEXT_PUBLIC_META_PIXEL_ID and redeploy (public vars are baked in at build time).
 * Optional NEXT_PUBLIC_META_PIXEL_TEST_EVENT_CODE while the agency verifies; remove afterward.
 */
export function MetaFacebookPixel() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstPaint = useRef(true);

  const pixelId = useMemo(() => {
    const raw = readEnvTrim("NEXT_PUBLIC_META_PIXEL_ID");
    if (!raw || !isLikelyMetaPixelId(raw)) return undefined;
    return raw;
  }, []);

  const testEventCode = useMemo(() => {
    const raw = readEnvTrim("NEXT_PUBLIC_META_PIXEL_TEST_EVENT_CODE");
    if (!raw) return undefined;
    return raw;
  }, []);

  useEffect(() => {
    if (!pixelId || typeof window === "undefined" || !window.fbq) return;
    if (isFirstPaint.current) {
      isFirstPaint.current = false;
      return;
    }
    window.fbq("track", "PageView");
  }, [pathname, searchParams, pixelId]);

  if (!pixelId) return null;

  const initSnippet = `
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
`;

  return (
    <>
      <Script id="meta-fb-pixel" strategy="afterInteractive">
        {initSnippet}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${encodeURIComponent(pixelId)}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
