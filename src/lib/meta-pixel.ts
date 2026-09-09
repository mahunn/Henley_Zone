/**
 * Safe client-side Meta (Facebook) Pixel helper for standard eCommerce events.
 * Safely queues/retries if called before fbevents.js is initialized.
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
  [key: string]: unknown;
}

export function trackMetaEvent(
  eventName:
    | "PageView"
    | "ViewContent"
    | "AddToCart"
    | "InitiateCheckout"
    | "Purchase"
    | "Lead"
    | "Search",
  params?: MetaContentParams
) {
  if (typeof window === "undefined") return;

  const fire = () => {
    try {
      if (window.fbq) {
        if (params) {
          window.fbq("track", eventName, params);
        } else {
          window.fbq("track", eventName);
        }
        return true;
      }
    } catch (err) {
      console.debug("[Meta Pixel] Dispatch error:", err);
    }
    return false;
  };

  // If fbq is already ready, fire immediately
  if (fire()) return;

  // Otherwise, poll until fbq is initialized by the script snippet
  let attempts = 0;
  const maxAttempts = 50; // 50 * 100ms = 5 seconds
  const timer = setInterval(() => {
    attempts++;
    if (fire() || attempts >= maxAttempts) {
      clearInterval(timer);
    }
  }, 100);
}

/** Track viewing a product detail page */
export function trackViewContent(opts: {
  id: string;
  name: string;
  price: number;
  category?: string;
  currency?: string;
}) {
  trackMetaEvent("ViewContent", {
    content_ids: [opts.id],
    content_name: opts.name,
    content_category: opts.category,
    content_type: "product",
    value: opts.price,
    currency: opts.currency || "BDT"
  });
}

/** Track adding a product to the cart */
export function trackAddToCart(opts: {
  id: string;
  name: string;
  price: number;
  quantity?: number;
  currency?: string;
}) {
  trackMetaEvent("AddToCart", {
    content_ids: [opts.id],
    content_name: opts.name,
    content_type: "product",
    value: opts.price * (opts.quantity || 1),
    currency: opts.currency || "BDT",
    num_items: opts.quantity || 1
  });
}

/** Track opening the checkout page */
export function trackInitiateCheckout(opts: {
  value: number;
  num_items: number;
  content_ids: string[];
  currency?: string;
}) {
  trackMetaEvent("InitiateCheckout", {
    content_ids: opts.content_ids,
    content_type: "product",
    value: opts.value,
    currency: opts.currency || "BDT",
    num_items: opts.num_items
  });
}

/** Track a completed order / purchase */
export function trackPurchase(opts: {
  orderId: string;
  value: number;
  content_ids: string[];
  num_items?: number;
  currency?: string;
}) {
  trackMetaEvent("Purchase", {
    content_ids: opts.content_ids,
    content_type: "product",
    value: opts.value,
    currency: opts.currency || "BDT",
    num_items: opts.num_items,
    order_id: opts.orderId
  });
}
