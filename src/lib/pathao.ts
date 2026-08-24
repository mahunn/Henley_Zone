/**
 * Pathao Courier Merchant API Integration
 * Supports OAuth2 password grant authentication with token caching,
 * stores query, location lookups (Cities/Zones/Areas), parcel creation, and live tracking.
 */

export interface PathaoConfig {
  baseUrl: string;
  clientId: string;
  clientSecret: string;
  username: string;
  password: string;
  grantType: string;
  storeId?: string | number;
}

export interface PathaoStore {
  store_id: number;
  store_name: string;
  store_address?: string;
  is_active?: number | boolean;
  city_id?: number;
  zone_id?: number;
  hub_id?: number;
  is_default_store?: boolean;
}

export interface PathaoCity {
  city_id: number;
  city_name: string;
}

export interface PathaoZone {
  zone_id: number;
  zone_name: string;
}

export interface PathaoArea {
  area_id: number;
  area_name: string;
  home_delivery_available?: boolean;
  pickup_available?: boolean;
}

export interface CreateParcelPayload {
  storeId?: number | string;
  merchantOrderId: string;
  recipientName: string;
  recipientPhone: string;
  recipientAddress: string;
  recipientCity: number;
  recipientZone: number;
  recipientArea?: number;
  deliveryType?: 48 | 12; // 48: Normal Delivery (default), 12: On Demand
  itemType?: 1 | 2; // 1: Document, 2: Parcel (default)
  specialInstruction?: string;
  itemQuantity?: number;
  itemWeight?: number; // In KG (default: 0.5)
  amountToCollect: number; // COD amount
  itemDescription?: string;
}

export interface CreateParcelResponse {
  success: boolean;
  consignmentId?: string;
  merchantOrderId?: string;
  orderStatus?: string;
  deliveryFee?: number;
  message?: string;
  error?: string;
}

export interface PathaoTrackingResponse {
  consignment_id: string;
  merchant_order_id?: string;
  order_status: string;
  order_status_slug?: string;
  payment_status?: string;
  invoice_id?: string | null;
  updated_at?: string;
}

// In-memory token cache to minimize OAuth roundtrips
let cachedToken: {
  token: string;
  expiresAt: number;
} | null = null;

// In-memory cache for location lists
const citiesCache: { data: PathaoCity[]; timestamp: number } | null = null;
const zonesCache = new Map<number, { data: PathaoZone[]; timestamp: number }>();
const areasCache = new Map<number, { data: PathaoArea[]; timestamp: number }>();

export function getPathaoConfig(): PathaoConfig {
  const baseUrl = (
    process.env.PATHAO_BASE_URL ||
    "https://courier-api-sandbox.pathao.com"
  ).replace(/\/+$/, "");

  const clientId = (process.env.PATHAO_CLIENT_ID || "").trim();
  const clientSecret = (process.env.PATHAO_CLIENT_SECRET || "").trim();
  const username = (process.env.PATHAO_USERNAME || "").trim();
  const password = (process.env.PATHAO_PASSWORD || "").trim();
  const grantType = (process.env.PATHAO_GRANT_TYPE || "password").trim();
  const storeId = process.env.PATHAO_STORE_ID ? String(process.env.PATHAO_STORE_ID).trim() : undefined;

  return {
    baseUrl,
    clientId,
    clientSecret,
    username,
    password,
    grantType,
    storeId
  };
}

export function isPathaoConfigured(): boolean {
  const conf = getPathaoConfig();
  return Boolean(conf.clientId && conf.clientSecret && conf.username && conf.password);
}

/**
 * Issues or returns cached OAuth2 Bearer Access Token
 */
export async function getPathaoAccessToken(forceRefresh = false): Promise<string> {
  const config = getPathaoConfig();

  if (!config.clientId || !config.clientSecret || !config.username || !config.password) {
    throw new Error("Pathao Courier credentials are not configured in environment variables.");
  }

  const now = Date.now();
  // Return cached token if valid (with 5-minute safety buffer)
  if (!forceRefresh && cachedToken && cachedToken.expiresAt > now + 300000) {
    return cachedToken.token;
  }

  const tokenUrl = `${config.baseUrl}/aladdin/api/v1/issue-token`;

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      grant_type: config.grantType || "password",
      username: config.username,
      password: config.password
    })
  });

  const data = await response.json();

  if (!response.ok || !data.access_token) {
    const errorMsg = data.message || data.error_description || data.error || `HTTP ${response.status}`;
    throw new Error(`Failed to issue Pathao access token: ${errorMsg}`);
  }

  const expiresInSec = typeof data.expires_in === "number" ? data.expires_in : 7776000;
  cachedToken = {
    token: data.access_token,
    expiresAt: now + expiresInSec * 1000
  };

  return data.access_token;
}

/**
 * Fetch list of merchant pickup stores
 */
export async function getPathaoStores(): Promise<PathaoStore[]> {
  const config = getPathaoConfig();
  const token = await getPathaoAccessToken();

  const response = await fetch(`${config.baseUrl}/aladdin/api/v1/stores`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json"
    }
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || `Failed to fetch stores: HTTP ${response.status}`);
  }

  const rawList = result.data?.data || result.data || [];
  return Array.isArray(rawList) ? rawList : [];
}

/**
 * Fetch all cities (Districts) in Bangladesh (Country ID: 1)
 */
export async function getPathaoCities(): Promise<PathaoCity[]> {
  const config = getPathaoConfig();
  const token = await getPathaoAccessToken();

  const response = await fetch(`${config.baseUrl}/aladdin/api/v1/countries/1/city-list`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json"
    }
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || `Failed to fetch cities: HTTP ${response.status}`);
  }

  const list = result.data?.data || result.data || [];
  return Array.isArray(list) ? list : [];
}

/**
 * Fetch all zones within a given city
 */
export async function getPathaoZones(cityId: number): Promise<PathaoZone[]> {
  if (!cityId) return [];

  const now = Date.now();
  const cached = zonesCache.get(cityId);
  if (cached && cached.timestamp > now - 3600000) {
    return cached.data;
  }

  const config = getPathaoConfig();
  const token = await getPathaoAccessToken();

  const response = await fetch(`${config.baseUrl}/aladdin/api/v1/cities/${cityId}/zone-list`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json"
    }
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || `Failed to fetch zones: HTTP ${response.status}`);
  }

  const list = result.data?.data || result.data || [];
  const normalized = Array.isArray(list) ? list : [];
  zonesCache.set(cityId, { data: normalized, timestamp: now });
  return normalized;
}

/**
 * Fetch all sub-areas within a given zone
 */
export async function getPathaoAreas(zoneId: number): Promise<PathaoArea[]> {
  if (!zoneId) return [];

  const now = Date.now();
  const cached = areasCache.get(zoneId);
  if (cached && cached.timestamp > now - 3600000) {
    return cached.data;
  }

  const config = getPathaoConfig();
  const token = await getPathaoAccessToken();

  const response = await fetch(`${config.baseUrl}/aladdin/api/v1/zones/${zoneId}/area-list`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json"
    }
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || `Failed to fetch areas: HTTP ${response.status}`);
  }

  const list = result.data?.data || result.data || [];
  const normalized = Array.isArray(list) ? list : [];
  areasCache.set(zoneId, { data: normalized, timestamp: now });
  return normalized;
}

/**
 * Helper to normalize Bangladeshi phone number to 11-digit format: 01XXXXXXXXX
 */
export function normalizePathaoPhone(phone: string): string {
  const digits = String(phone || "").replace(/\D/g, "");
  if (digits.startsWith("880") && digits.length === 13) {
    return digits.slice(2);
  }
  if (digits.length === 10 && digits.startsWith("1")) {
    return `0${digits}`;
  }
  return digits;
}

/**
 * Create a parcel order in Pathao Courier
 */
export async function createPathaoParcel(
  params: CreateParcelPayload
): Promise<CreateParcelResponse> {
  const config = getPathaoConfig();
  const token = await getPathaoAccessToken();

  let targetStoreId = params.storeId || config.storeId;
  if (!targetStoreId) {
    // If no store ID specified, fetch merchant stores and pick the first active/default one
    const stores = await getPathaoStores();
    if (stores.length > 0) {
      targetStoreId = stores[0].store_id;
    } else {
      throw new Error("No Pathao pickup store found. Please create a store in your Pathao Merchant Dashboard.");
    }
  }

  const phone = normalizePathaoPhone(params.recipientPhone);
  if (!phone || phone.length !== 11) {
    throw new Error(`Invalid recipient phone number '${params.recipientPhone}'. Must be an 11-digit BD number.`);
  }

  if (!params.recipientName?.trim()) {
    throw new Error("Recipient name is required.");
  }

  if (!params.recipientAddress?.trim() || params.recipientAddress.trim().length < 10) {
    throw new Error("Recipient address must be at least 10 characters long.");
  }

  if (!params.recipientCity || !params.recipientZone) {
    throw new Error("Recipient City and Zone are required for Pathao delivery dispatch.");
  }

  const payload: Record<string, unknown> = {
    store_id: Number(targetStoreId),
    merchant_order_id: params.merchantOrderId,
    recipient_name: params.recipientName.trim(),
    recipient_phone: phone,
    recipient_address: params.recipientAddress.trim(),
    recipient_city: Number(params.recipientCity),
    recipient_zone: Number(params.recipientZone),
    delivery_type: params.deliveryType || 48,
    item_type: params.itemType || 2,
    special_instruction: params.specialInstruction || "",
    item_quantity: Math.max(1, params.itemQuantity || 1),
    item_weight: params.itemWeight || 0.5,
    amount_to_collect: Math.max(0, Math.round(params.amountToCollect || 0)),
    item_description: params.itemDescription || "Clothing / Apparel"
  };

  if (params.recipientArea) {
    payload.recipient_area = Number(params.recipientArea);
  }

  const response = await fetch(`${config.baseUrl}/aladdin/api/v1/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(payload)
  });

  const result = await response.json();

  if (!response.ok || result.error || result.type === "error") {
    let errorDetail = result.message || "Failed to create order on Pathao";
    if (result.errors) {
      const errKeys = Object.keys(result.errors);
      if (errKeys.length > 0) {
        errorDetail += `: ${errKeys.map((k) => `${k}: ${result.errors[k]}`).join(", ")}`;
      }
    }
    return {
      success: false,
      error: errorDetail
    };
  }

  const orderData = result.data || {};
  return {
    success: true,
    consignmentId: orderData.consignment_id,
    merchantOrderId: orderData.merchant_order_id || params.merchantOrderId,
    orderStatus: orderData.order_status || "Pending",
    deliveryFee: orderData.delivery_fee,
    message: result.message || "Order created successfully"
  };
}

/**
 * Track an order / consignment in Pathao Courier
 */
export async function trackPathaoParcel(
  consignmentId: string
): Promise<PathaoTrackingResponse | null> {
  if (!consignmentId?.trim()) return null;

  const config = getPathaoConfig();
  const token = await getPathaoAccessToken();

  const response = await fetch(
    `${config.baseUrl}/aladdin/api/v1/orders/${encodeURIComponent(consignmentId.trim())}/info`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json"
      }
    }
  );

  const result = await response.json();

  if (!response.ok || !result.data) {
    return null;
  }

  return result.data as PathaoTrackingResponse;
}

/**
 * Diagnostics & Connection Test
 */
export async function testPathaoConnection(): Promise<{
  connected: boolean;
  environment: "sandbox" | "production";
  baseUrl: string;
  stores: PathaoStore[];
  message?: string;
}> {
  const config = getPathaoConfig();
  const isSandbox = config.baseUrl.includes("sandbox");

  try {
    const token = await getPathaoAccessToken(true);
    if (!token) {
      return {
        connected: false,
        environment: isSandbox ? "sandbox" : "production",
        baseUrl: config.baseUrl,
        stores: [],
        message: "Failed to obtain access token."
      };
    }

    const stores = await getPathaoStores();

    return {
      connected: true,
      environment: isSandbox ? "sandbox" : "production",
      baseUrl: config.baseUrl,
      stores,
      message: `Successfully connected to Pathao ${isSandbox ? "Sandbox" : "Production"} API. Found ${stores.length} store(s).`
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return {
      connected: false,
      environment: isSandbox ? "sandbox" : "production",
      baseUrl: config.baseUrl,
      stores: [],
      message: errorMsg
    };
  }
}
