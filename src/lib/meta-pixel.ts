/**
 * Client-side Meta (Facebook) Pixel & Conversions API (CAPI) helper.
 * Fires both browser Pixel (fbq) and server CAPI (/api/meta/capi) with matching eventID
 * for 100% accurate tracking and Meta Event Deduplication.
 */

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export interface MetaContentParams {
  content_ids?: string[];
  content_name?: string;
  content_category?: string;
  content_type?: string;
  value?: number;
  currency?: string;
  num_items?: number;
  order_id?: string;
  [key: string]: unknown;
}

/** Helper to extract cookie value by name from document.cookie */
function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

/**
 * Dispatch an event to both browser Pixel (fbq) and Server Conversions API (/api/meta/capi).
 * If eventId is provided, both channels share the exact same ID so Meta deduplicates them.
 */
export function trackMetaEvent(
  eventName:
    | "PageView"
    | "ViewContent"
    | "AddToCart"
    | "InitiateCheckout"
    | "Purchase"
    | "Lead"
    | "Search",
  params?: MetaContentParams,
  eventId?: string
) {
  if (typeof window === "undefined") return;

  const resolvedEventId =
    eventId || `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  // 1. Browser Pixel tracking (with eventID deduplication)
  const fireFbq = () => {
    try {
      if (window.fbq) {
        if (params) {
          window.fbq("track", eventName, params, { eventID: resolvedEventId });
        } else {
          window.fbq("track", eventName, {}, { eventID: resolvedEventId });
        }
        return true;
      }
    } catch (err) {
      console.debug("[Meta Pixel] Dispatch error:", err);
    }
    return false;
  };

  if (!fireFbq()) {
    let attempts = 0;
    const maxAttempts = 50; // 5 seconds polling
    const timer = setInterval(() => {
      attempts++;
      if (fireFbq() || attempts >= maxAttempts) {
        clearInterval(timer);
      }
    }, 100);
  }

  // 2. Server CAPI relay via internal /api/meta/capi route (bypasses ad-blockers)
  try {
    const fbp = getCookie("_fbp");
    const fbc = getCookie("_fbc");

    fetch("/api/meta/capi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        eventName,
        eventId: resolvedEventId,
        params,
        eventSourceUrl: window.location.href,
        fbp,
        fbc
      })
    }).catch(() => {
      // Silently ignore network failures for background tracking
    });
  } catch {
    // Non-blocking
  }
}

/** Track viewing a product detail page */
export function trackViewContent(opts: {
  id: string;
  name: string;
  price: number;
  category?: string;
  currency?: string;
  eventId?: string;
}) {
  const eventId = opts.eventId || `vc_${opts.id}_${Date.now()}`;
  trackMetaEvent(
    "ViewContent",
    {
      content_ids: [opts.id],
      content_name: opts.name,
      content_category: opts.category,
      content_type: "product",
      value: opts.price,
      currency: opts.currency || "BDT"
    },
    eventId
  );
}

/** Track adding a product to the cart */
export function trackAddToCart(opts: {
  id: string;
  name: string;
  price: number;
  quantity?: number;
  currency?: string;
  eventId?: string;
}) {
  const eventId = opts.eventId || `atc_${opts.id}_${Date.now()}`;
  trackMetaEvent(
    "AddToCart",
    {
      content_ids: [opts.id],
      content_name: opts.name,
      content_type: "product",
      value: opts.price * (opts.quantity || 1),
      currency: opts.currency || "BDT",
      num_items: opts.quantity || 1
    },
    eventId
  );
}

/** Track opening / entering the checkout page */
export function trackInitiateCheckout(opts: {
  value: number;
  num_items: number;
  content_ids: string[];
  currency?: string;
  eventId?: string;
}) {
  const eventId = opts.eventId || `ic_${Date.now()}`;
  trackMetaEvent(
    "InitiateCheckout",
    {
      content_ids: opts.content_ids,
      content_type: "product",
      value: opts.value,
      currency: opts.currency || "BDT",
      num_items: opts.num_items
    },
    eventId
  );
}

/** Track a completed order / purchase */
export function trackPurchase(opts: {
  orderId: string;
  value: number;
  content_ids: string[];
  num_items?: number;
  currency?: string;
}) {
  trackMetaEvent(
    "Purchase",
    {
      content_ids: opts.content_ids,
      content_type: "product",
      value: opts.value,
      currency: opts.currency || "BDT",
      num_items: opts.num_items,
      order_id: opts.orderId
    },
    opts.orderId // Exact orderId ensures 100% deduplication with server-side CAPI
  );
}
