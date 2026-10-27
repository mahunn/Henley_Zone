import crypto from "crypto";
import type { Order, CheckoutLead } from "@/types/commerce";

/** Hash sensitive user data using SHA-256 as required by Meta Conversions API */
export function hashSha256(value?: string | null): string | undefined {
  if (!value) return undefined;
  const normalized = value.trim().toLowerCase();
  if (!normalized) return undefined;
  return crypto.createHash("sha256").update(normalized).digest("hex");
}

/**
 * Format phone number to international E.164 digits without '+' or symbols.
 * For Bangladesh: e.g. "01712345678" -> "8801712345678".
 */
export function normalizePhoneForMeta(rawPhone?: string | null): string | undefined {
  if (!rawPhone) return undefined;
  let digits = rawPhone.replace(/\D/g, "");
  if (!digits) return undefined;

  // If local Bangladeshi number (11 digits starting with 01)
  if (digits.length === 11 && digits.startsWith("01")) {
    digits = `88${digits}`;
  } else if (digits.length === 10 && digits.startsWith("1")) {
    digits = `880${digits}`;
  }

  return digits;
}

/** Helper to parse `_fbp` and `_fbc` from a standard Cookie header string */
export function parseMetaCookies(cookieHeader?: string | null): { fbp?: string; fbc?: string } {
  if (!cookieHeader) return {};
  const cookies = cookieHeader.split(";").reduce<Record<string, string>>((acc, part) => {
    const [rawKey, ...valParts] = part.trim().split("=");
    if (rawKey) acc[rawKey] = decodeURIComponent(valParts.join("="));
    return acc;
  }, {});

  return {
    fbp: cookies["_fbp"]?.trim() || undefined,
    fbc: cookies["_fbc"]?.trim() || undefined
  };
}

export interface MetaCapiUserData {
  phone?: string;
  customerName?: string;
  email?: string;
  city?: string;
  country?: string;
  clientIp?: string;
  userAgent?: string;
  fbp?: string;
  fbc?: string;
}

export interface MetaCapiCustomData {
  value?: number;
  currency?: string;
  orderId?: string;
  contentType?: string;
  contentIds?: string[];
  contentName?: string;
  contentCategory?: string;
  contents?: Array<{ id: string; quantity: number; item_price?: number }>;
  numItems?: number;
  [key: string]: unknown;
}

export interface SendMetaEventOptions {
  eventName:
    | "PageView"
    | "ViewContent"
    | "AddToCart"
    | "InitiateCheckout"
    | "Purchase"
    | "Lead"
    | "Search";
  /** Unique ID matching browser fbq eventID for accurate deduplication */
  eventId: string;
  eventTime?: number;
  eventSourceUrl?: string;
  userData?: MetaCapiUserData;
  customData?: MetaCapiCustomData;
  testEventCode?: string;
}

export interface MetaCapiResult {
  ok: boolean;
  eventsReceived?: number;
  fbtraceId?: string;
  reason?: string;
}

/**
 * Send a server-side event to Meta Conversions API (Graph API v21.0).
 * Handles SHA-256 hashing, client context, and deduplication.
 */
export async function sendMetaConversionEvent(
  options: SendMetaEventOptions
): Promise<MetaCapiResult> {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim();
  const accessToken = process.env.META_CONVERSIONS_API_ACCESS_TOKEN?.trim();
  const testEventCode =
    options.testEventCode?.trim() ||
    process.env.META_CONVERSIONS_API_TEST_EVENT_CODE?.trim() ||
    process.env.NEXT_PUBLIC_META_PIXEL_TEST_EVENT_CODE?.trim() ||
    undefined;

  if (!pixelId || !accessToken) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[Meta CAPI] Skipped: NEXT_PUBLIC_META_PIXEL_ID or META_CONVERSIONS_API_ACCESS_TOKEN not set."
      );
    }
    return { ok: false, reason: "missing_credentials" };
  }

  try {
    const rawUserData = options.userData || {};

    // Customer Name parsing (first name + optional last name)
    let fnHash: string | undefined;
    let lnHash: string | undefined;
    if (rawUserData.customerName?.trim()) {
      const parts = rawUserData.customerName.trim().split(/\s+/);
      fnHash = hashSha256(parts[0]);
      if (parts.length > 1) {
        lnHash = hashSha256(parts.slice(1).join(" "));
      }
    }

    // Phone parsing + hashing
    const normalizedPhone = normalizePhoneForMeta(rawUserData.phone);
    const phHash = hashSha256(normalizedPhone);

    // Email hashing
    const emHash = hashSha256(rawUserData.email);

    // City & Country
    const ctHash = hashSha256(rawUserData.city);
    const countryHash = hashSha256(rawUserData.country || "bd");

    // Build user_data according to Meta CAPI specification
    const userData: Record<string, unknown> = {};
    if (phHash) userData.ph = [phHash];
    if (fnHash) userData.fn = [fnHash];
    if (lnHash) userData.ln = [lnHash];
    if (emHash) userData.em = [emHash];
    if (ctHash) userData.ct = [ctHash];
    if (countryHash) userData.country = [countryHash];

    // Raw unhashed client info
    if (rawUserData.clientIp && rawUserData.clientIp !== "::1") {
      userData.client_ip_address = rawUserData.clientIp;
    }
    if (rawUserData.userAgent) {
      userData.client_user_agent = rawUserData.userAgent;
    }
    if (rawUserData.fbp) {
      userData.fbp = rawUserData.fbp;
    }
    if (rawUserData.fbc) {
      userData.fbc = rawUserData.fbc;
    }

    // Build custom_data
    const customData: Record<string, unknown> = {};
    if (options.customData) {
      if (options.customData.currency) customData.currency = options.customData.currency;
      if (typeof options.customData.value === "number") customData.value = options.customData.value;
      if (options.customData.orderId) customData.order_id = options.customData.orderId;
      if (options.customData.contentType) customData.content_type = options.customData.contentType;
      if (options.customData.contentName) customData.content_name = options.customData.contentName;
      if (options.customData.contentCategory) customData.content_category = options.customData.contentCategory;
      if (options.customData.contentIds) customData.content_ids = options.customData.contentIds;
      if (options.customData.contents) customData.contents = options.customData.contents;
      if (typeof options.customData.numItems === "number") customData.num_items = options.customData.numItems;

      // Pass any additional keys
      for (const [key, val] of Object.entries(options.customData)) {
        if (!(key in customData) && val !== undefined) {
          customData[key] = val;
        }
      }
    }

    const eventPayload: Record<string, unknown> = {
      event_name: options.eventName,
      event_time: options.eventTime || Math.floor(Date.now() / 1000),
      event_id: options.eventId,
      action_source: "website",
      event_source_url: options.eventSourceUrl || "https://henleyzone.com",
      user_data: userData
    };

    if (Object.keys(customData).length > 0) {
      eventPayload.custom_data = customData;
    }

    const requestBody: Record<string, unknown> = {
      data: [eventPayload],
      access_token: accessToken
    };

    if (testEventCode) {
      requestBody.test_event_code = testEventCode;
    }

    const url = `https://graph.facebook.com/v21.0/${pixelId}/events`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    });

    const data = (await response.json()) as {
      events_received?: number;
      fbtrace_id?: string;
      error?: { message?: string; code?: number };
    };

    if (!response.ok || data.error) {
      console.error("[Meta CAPI] Error response from Meta:", data.error || data);
      return {
        ok: false,
        reason: data.error?.message || "Meta API error",
        fbtraceId: data.fbtrace_id
      };
    }

    return {
      ok: true,
      eventsReceived: data.events_received,
      fbtraceId: data.fbtrace_id
    };
  } catch (err) {
    console.error("[Meta CAPI] Failed to dispatch event:", err);
    return {
      ok: false,
      reason: err instanceof Error ? err.message : "Unknown error"
    };
  }
}

/**
 * Dispatch a Purchase conversion event directly from an Order instance.
 */
export async function sendMetaOrderPurchase(
  order: Order,
  context?: {
    clientIp?: string;
    userAgent?: string;
    fbp?: string;
    fbc?: string;
    eventSourceUrl?: string;
    testEventCode?: string;
  }
): Promise<MetaCapiResult> {
  const contents = (order.items || []).map((item) => ({
    id: item.productId,
    quantity: item.quantity,
    item_price: item.price
  }));

  const contentIds = (order.items || []).map((item) => item.productId);
  const numItems = (order.items || []).reduce((sum, item) => sum + item.quantity, 0);

  return sendMetaConversionEvent({
    eventName: "Purchase",
    eventId: order.id, // Deduplication key matches browser fbq('track', 'Purchase', ..., { eventID: order.id })
    eventSourceUrl: context?.eventSourceUrl || "https://henleyzone.com/checkout/success",
    userData: {
      phone: order.phone,
      customerName: order.customerName,
      country: "bd",
      clientIp: context?.clientIp,
      userAgent: context?.userAgent,
      fbp: context?.fbp,
      fbc: context?.fbc
    },
    customData: {
      currency: "BDT",
      value: order.total,
      orderId: order.id,
      contentType: "product",
      contentIds,
      contents,
      numItems
    },
    testEventCode: context?.testEventCode
  });
}

/**
 * Dispatch a Lead conversion event directly from a CheckoutLead instance.
 */
export async function sendMetaCheckoutLead(
  lead: CheckoutLead,
  context?: {
    clientIp?: string;
    userAgent?: string;
    fbp?: string;
    fbc?: string;
    eventSourceUrl?: string;
    testEventCode?: string;
  }
): Promise<MetaCapiResult> {
  const contents = (lead.items || []).map((item) => ({
    id: item.productId,
    quantity: item.quantity,
    item_price: item.price
  }));

  const contentIds = (lead.items || []).map((item) => item.productId);
  const numItems = (lead.items || []).reduce((sum, item) => sum + item.quantity, 0);

  return sendMetaConversionEvent({
    eventName: "Lead",
    eventId: lead.id,
    eventSourceUrl: context?.eventSourceUrl || "https://henleyzone.com/checkout",
    userData: {
      phone: lead.phone,
      customerName: lead.customerName,
      country: "bd",
      clientIp: context?.clientIp,
      userAgent: context?.userAgent,
      fbp: context?.fbp,
      fbc: context?.fbc
    },
    customData: {
      currency: "BDT",
      value: lead.total,
      contentType: "product",
      contentIds,
      contents,
      numItems
    },
    testEventCode: context?.testEventCode
  });
}
