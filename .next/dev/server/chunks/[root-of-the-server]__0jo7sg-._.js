module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[project]/src/lib/runtime-env.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/** True on Vercel and similar serverless hosts where the project dir is read-only. */ __turbopack_context__.s([
    "canUseLocalOrderFileStore",
    ()=>canUseLocalOrderFileStore,
    "isServerlessRuntime",
    ()=>isServerlessRuntime
]);
function isServerlessRuntime() {
    return Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NETLIFY);
}
function canUseLocalOrderFileStore() {
    return !isServerlessRuntime();
}
}),
"[project]/src/lib/orders-store.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "deleteOrderFromFile",
    ()=>deleteOrderFromFile,
    "readOrders",
    ()=>readOrders,
    "updateOrderStatus",
    ()=>updateOrderStatus,
    "writeOrder",
    ()=>writeOrder
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$runtime$2d$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/runtime-env.ts [app-route] (ecmascript)");
;
;
;
const dataDir = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), "data");
const ordersPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(dataDir, "orders.json");
async function ensureStore() {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$runtime$2d$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["canUseLocalOrderFileStore"])()) {
        return;
    }
    await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].mkdir(dataDir, {
        recursive: true
    });
    try {
        await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].access(ordersPath);
    } catch  {
        await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].writeFile(ordersPath, "[]", "utf8");
    }
}
async function readOrders() {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$runtime$2d$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["canUseLocalOrderFileStore"])()) {
        try {
            const raw = await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].readFile(ordersPath, "utf8");
            const parsed = JSON.parse(raw);
            return parsed.sort((a, b)=>b.createdAt.localeCompare(a.createdAt));
        } catch  {
            return [];
        }
    }
    await ensureStore();
    const raw = await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].readFile(ordersPath, "utf8");
    const parsed = JSON.parse(raw);
    return parsed.sort((a, b)=>b.createdAt.localeCompare(a.createdAt));
}
function assertLocalOrderFileWritable() {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$runtime$2d$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["canUseLocalOrderFileStore"])()) {
        throw new Error("Order storage is not configured for production. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your hosting environment (e.g. Vercel).");
    }
}
async function writeOrder(order) {
    assertLocalOrderFileWritable();
    const all = await readOrders();
    all.unshift(order);
    await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].writeFile(ordersPath, JSON.stringify(all, null, 2), "utf8");
}
async function updateOrderStatus(orderId, status) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$runtime$2d$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["canUseLocalOrderFileStore"])()) {
        return false;
    }
    const all = await readOrders();
    const index = all.findIndex((order)=>order.id === orderId);
    if (index === -1) {
        return false;
    }
    all[index] = {
        ...all[index],
        status
    };
    await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].writeFile(ordersPath, JSON.stringify(all, null, 2), "utf8");
    return true;
}
async function deleteOrderFromFile(orderId) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$runtime$2d$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["canUseLocalOrderFileStore"])()) {
        return false;
    }
    const all = await readOrders();
    const next = all.filter((order)=>order.id !== orderId);
    if (next.length === all.length) {
        return false;
    }
    await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].writeFile(ordersPath, JSON.stringify(next, null, 2), "utf8");
    return true;
}
}),
"[project]/src/lib/order-id.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/** Prefix for a calendar month, e.g. ORD-202605 */ __turbopack_context__.s([
    "formatMonthlyOrderId",
    ()=>formatMonthlyOrderId,
    "orderIdMonthPrefix",
    ()=>orderIdMonthPrefix,
    "parseMonthlyOrderSerial",
    ()=>parseMonthlyOrderSerial
]);
function orderIdMonthPrefix(date = new Date()) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    return `ORD-${y}${m}`;
}
function formatMonthlyOrderId(date, serial) {
    return `${orderIdMonthPrefix(date)}${String(serial).padStart(4, "0")}`;
}
const MONTHLY_ORDER_ID_RE = /^ORD-(\d{4})(\d{2})(\d{4})$/;
function parseMonthlyOrderSerial(id) {
    const m = id.match(MONTHLY_ORDER_ID_RE);
    if (!m) return null;
    return {
        yyyymm: `${m[1]}${m[2]}`,
        serial: Number(m[3])
    };
}
}),
"[project]/src/lib/format-order-line.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "formatOrderItemLabel",
    ()=>formatOrderItemLabel
]);
function formatOrderItemLabel(item) {
    const extras = [];
    const color = item.selectedColor?.trim();
    if (color && !item.name.toLowerCase().includes(color.toLowerCase())) {
        extras.push(color);
    }
    const size = item.selectedSize?.trim();
    if (size && !/\bsize\s*[\d]+/i.test(item.name)) {
        extras.push(`Size ${size}`);
    }
    if (extras.length === 0) return item.name;
    const base = item.name.trim();
    if (base.includes("(") && base.endsWith(")")) {
        return `${base.slice(0, -1)}, ${extras.join(", ")})`;
    }
    return `${base} (${extras.join(", ")})`;
}
}),
"[project]/src/lib/supabase-server.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getSupabaseAdminClient",
    ()=>getSupabaseAdminClient,
    "isSupabaseConfigured",
    ()=>isSupabaseConfigured
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-route] (ecmascript) <locals>");
;
;
function getSupabaseEnv() {
    const url = ("TURBOPACK compile-time value", "https://yupsextjpobenxiscwde.supabase.co");
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    return {
        url,
        serviceRoleKey
    };
}
function isSupabaseConfigured() {
    const { url, serviceRoleKey } = getSupabaseEnv();
    return Boolean(url && serviceRoleKey);
}
function getSupabaseAdminClient() {
    const { url, serviceRoleKey } = getSupabaseEnv();
    if (!url || !serviceRoleKey) {
        return null;
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(url, serviceRoleKey, {
        auth: {
            persistSession: false
        }
    });
}
}),
"[project]/src/lib/orders-repository.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "allocateNextOrderId",
    ()=>allocateNextOrderId,
    "createOrder",
    ()=>createOrder,
    "deleteOrder",
    ()=>deleteOrder,
    "listOrders",
    ()=>listOrders,
    "updateOrderStatus",
    ()=>updateOrderStatus
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$orders$2d$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/orders-store.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$order$2d$id$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/order-id.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2d$order$2d$line$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/format-order-line.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$runtime$2d$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/runtime-env.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2d$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase-server.ts [app-route] (ecmascript)");
;
;
;
;
;
function mapOrderRow(order, items) {
    return {
        id: order.id,
        items: items.map((item)=>({
                key: `${item.product_id}::${item.selected_size ?? ""}::${item.selected_color ?? ""}::${item.order_id}`,
                productId: item.product_id,
                name: item.product_name,
                price: item.unit_price,
                quantity: item.quantity,
                selectedColor: item.selected_color?.trim() || undefined,
                selectedSize: item.selected_size?.trim() || undefined
            })),
        subtotal: order.subtotal,
        deliveryFee: order.delivery_fee,
        total: order.total,
        paymentMethod: order.payment_method,
        status: order.status,
        customerName: order.customer_name,
        phone: order.phone,
        address: order.address,
        note: order.note ?? undefined,
        createdAt: order.created_at
    };
}
async function allocateNextOrderId(createdAt = new Date().toISOString()) {
    const at = new Date(createdAt);
    const when = Number.isNaN(at.getTime()) ? new Date() : at;
    const yyyymm = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$order$2d$id$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["orderIdMonthPrefix"])(when).slice(4);
    const existing = await listOrders();
    let maxSerial = 0;
    for (const o of existing){
        const parsed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$order$2d$id$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseMonthlyOrderSerial"])(o.id);
        if (parsed && parsed.yyyymm === yyyymm) {
            maxSerial = Math.max(maxSerial, parsed.serial);
        }
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$order$2d$id$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["formatMonthlyOrderId"])(when, maxSerial + 1);
}
function isMissingVariantColumnsError(message) {
    const m = (message ?? "").toLowerCase();
    return m.includes("selected_color") || m.includes("selected_size") || m.includes("schema cache");
}
function assertOrderPersistenceAvailable() {
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2d$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isSupabaseConfigured"])()) {
        return;
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$runtime$2d$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["canUseLocalOrderFileStore"])()) {
        return;
    }
    throw new Error("Order storage is not configured for production. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel (or your host) environment variables.");
}
async function createOrder(order) {
    assertOrderPersistenceAvailable();
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2d$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSupabaseAdminClient"])();
    if (!supabase) {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$orders$2d$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["writeOrder"])(order);
        return;
    }
    const { error: orderError } = await supabase.from("orders").insert({
        id: order.id,
        customer_name: order.customerName,
        phone: order.phone,
        address: order.address,
        note: order.note ?? null,
        subtotal: order.subtotal,
        delivery_fee: order.deliveryFee,
        total: order.total,
        payment_method: order.paymentMethod,
        status: order.status
    });
    if (orderError) {
        throw new Error(orderError.message || "Could not save order.");
    }
    const rowsWithVariants = order.items.map((item)=>({
            order_id: order.id,
            product_id: item.productId,
            product_name: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2d$order$2d$line$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["formatOrderItemLabel"])(item),
            unit_price: item.price,
            quantity: item.quantity,
            selected_color: item.selectedColor?.trim() || null,
            selected_size: item.selectedSize?.trim() || null
        }));
    let { error: itemError } = await supabase.from("order_items").insert(rowsWithVariants);
    if (itemError && isMissingVariantColumnsError(itemError.message)) {
        const rowsBasic = order.items.map((item)=>({
                order_id: order.id,
                product_id: item.productId,
                product_name: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2d$order$2d$line$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["formatOrderItemLabel"])(item),
                unit_price: item.price,
                quantity: item.quantity
            }));
        ({ error: itemError } = await supabase.from("order_items").insert(rowsBasic));
    }
    if (itemError) {
        await supabase.from("orders").delete().eq("id", order.id);
        throw new Error(itemError.message || "Could not save order items.");
    }
}
async function listOrders() {
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2d$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSupabaseAdminClient"])();
    if (!supabase) {
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$runtime$2d$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["canUseLocalOrderFileStore"])()) {
            return [];
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$orders$2d$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["readOrders"])();
    }
    const { data: ordersData, error: ordersError } = await supabase.from("orders").select("*").order("created_at", {
        ascending: false
    });
    if (ordersError || !ordersData) {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$runtime$2d$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["canUseLocalOrderFileStore"])()) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$orders$2d$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["readOrders"])();
        }
        throw new Error(ordersError?.message || "Could not load orders from database.");
    }
    const orderIds = ordersData.map((row)=>row.id);
    if (!orderIds.length) {
        return [];
    }
    const { data: itemsData, error: itemsError } = await supabase.from("order_items").select("*").in("order_id", orderIds);
    if (itemsError || !itemsData) {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$runtime$2d$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["canUseLocalOrderFileStore"])()) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$orders$2d$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["readOrders"])();
        }
        throw new Error(itemsError?.message || "Could not load order items from database.");
    }
    const itemsByOrderId = new Map();
    for (const item of itemsData){
        const current = itemsByOrderId.get(item.order_id) ?? [];
        current.push(item);
        itemsByOrderId.set(item.order_id, current);
    }
    return ordersData.map((row)=>mapOrderRow(row, itemsByOrderId.get(row.id) ?? []));
}
async function updateOrderStatus(orderId, status) {
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2d$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSupabaseAdminClient"])();
    if (!supabase) {
        const updated = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$orders$2d$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["updateOrderStatus"])(orderId, status);
        return {
            updated,
            reason: updated ? undefined : "Order not found in local store."
        };
    }
    const { data, error } = await supabase.from("orders").update({
        status
    }).eq("id", orderId).select("id").limit(1);
    if (error || !data || data.length === 0) {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$runtime$2d$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["canUseLocalOrderFileStore"])()) {
            const updatedInFile = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$orders$2d$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["updateOrderStatus"])(orderId, status);
            if (updatedInFile) {
                return {
                    updated: true
                };
            }
        }
        return {
            updated: false,
            reason: error?.message || "Order not found in Supabase."
        };
    }
    return {
        updated: true
    };
}
async function deleteOrder(orderId) {
    const trimmedId = orderId.trim();
    if (!trimmedId) {
        return {
            deleted: false,
            reason: "Missing order id."
        };
    }
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2d$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSupabaseAdminClient"])();
    if (!supabase) {
        const deleted = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$orders$2d$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["deleteOrderFromFile"])(trimmedId);
        return {
            deleted,
            reason: deleted ? undefined : "Order not found in local store."
        };
    }
    await supabase.from("order_items").delete().eq("order_id", trimmedId);
    const { data, error } = await supabase.from("orders").delete().eq("id", trimmedId).select("id").limit(1);
    if (error || !data?.length) {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$runtime$2d$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["canUseLocalOrderFileStore"])()) {
            const deletedInFile = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$orders$2d$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["deleteOrderFromFile"])(trimmedId);
            if (deletedInFile) {
                return {
                    deleted: true
                };
            }
        }
        return {
            deleted: false,
            reason: error?.message || "Order not found."
        };
    }
    return {
        deleted: true
    };
}
}),
"[project]/src/lib/leads-store.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "deleteLeadFromFile",
    ()=>deleteLeadFromFile,
    "readLeads",
    ()=>readLeads,
    "writeLead",
    ()=>writeLead
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$runtime$2d$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/runtime-env.ts [app-route] (ecmascript)");
;
;
;
const dataDir = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), "data");
const leadsPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(dataDir, "leads.json");
async function ensureStore() {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$runtime$2d$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["canUseLocalOrderFileStore"])()) {
        return;
    }
    await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].mkdir(dataDir, {
        recursive: true
    });
    try {
        await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].access(leadsPath);
    } catch  {
        await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].writeFile(leadsPath, "[]", "utf8");
    }
}
async function readLeads() {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$runtime$2d$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["canUseLocalOrderFileStore"])()) {
        try {
            const raw = await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].readFile(leadsPath, "utf8");
            return JSON.parse(raw);
        } catch  {
            return [];
        }
    }
    await ensureStore();
    const raw = await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].readFile(leadsPath, "utf8");
    return JSON.parse(raw);
}
async function writeLead(lead) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$runtime$2d$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["canUseLocalOrderFileStore"])()) return;
    await ensureStore();
    const all = await readLeads();
    const index = all.findIndex((l)=>l.id === lead.id);
    if (index !== -1) {
        all[index] = lead;
    } else {
        all.unshift(lead);
    }
    await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].writeFile(leadsPath, JSON.stringify(all, null, 2), "utf8");
}
async function deleteLeadFromFile(leadId) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$runtime$2d$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["canUseLocalOrderFileStore"])()) {
        return false;
    }
    await ensureStore();
    const all = await readLeads();
    const next = all.filter((l)=>l.id !== leadId);
    if (next.length === all.length) {
        return false;
    }
    await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].writeFile(leadsPath, JSON.stringify(next, null, 2), "utf8");
    return true;
}
}),
"[project]/src/lib/leads-repository.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "deleteLead",
    ()=>deleteLead,
    "listLeads",
    ()=>listLeads,
    "markLeadAsConverted",
    ()=>markLeadAsConverted,
    "saveLead",
    ()=>saveLead
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$leads$2d$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/leads-store.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2d$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase-server.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$runtime$2d$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/runtime-env.ts [app-route] (ecmascript)");
;
;
;
;
;
function mapLeadRow(row) {
    return {
        id: row.id,
        customerName: row.customer_name ?? undefined,
        phone: row.phone ?? undefined,
        address: row.address ?? undefined,
        note: row.note ?? undefined,
        items: row.items ?? [],
        subtotal: row.subtotal,
        deliveryFee: row.delivery_fee,
        total: row.total,
        deliveryArea: row.delivery_area ?? undefined,
        status: row.status,
        convertedOrderId: row.converted_order_id ?? undefined,
        createdAt: row.created_at,
        updatedAt: row.updated_at
    };
}
function assertLeadsPersistenceAvailable() {
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2d$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isSupabaseConfigured"])()) {
        return;
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$runtime$2d$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["canUseLocalOrderFileStore"])()) {
        return;
    }
    throw new Error("Leads storage is not configured.");
}
async function saveLead(lead) {
    assertLeadsPersistenceAvailable();
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2d$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSupabaseAdminClient"])();
    if (!supabase) {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$leads$2d$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["writeLead"])(lead);
        return;
    }
    const payload = {
        id: lead.id,
        customer_name: lead.customerName?.trim() || null,
        phone: lead.phone?.trim() || null,
        address: lead.address?.trim() || null,
        note: lead.note?.trim() || null,
        items: lead.items,
        subtotal: lead.subtotal,
        delivery_fee: lead.deliveryFee,
        total: lead.total,
        delivery_area: lead.deliveryArea || null,
        status: lead.status,
        converted_order_id: lead.convertedOrderId || null,
        updated_at: new Date().toISOString()
    };
    // Check if lead already exists to preserve its created_at if we want,
    // or we can let Supabase upsert handle it because created_at has a default now().
    // However, onConflict upsert in Supabase might overwrite created_at if we pass it,
    // but if we don't pass created_at, it will preserve it.
    const { error } = await supabase.from("checkout_leads").upsert(payload, {
        onConflict: "id"
    });
    if (error) {
        throw new Error(error.message || "Could not save checkout lead.");
    }
}
async function listLeads() {
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2d$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSupabaseAdminClient"])();
    if (!supabase) {
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$runtime$2d$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["canUseLocalOrderFileStore"])()) {
            return [];
        }
        const fileLeads = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$leads$2d$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["readLeads"])();
        return fileLeads.sort((a, b)=>b.updatedAt.localeCompare(a.updatedAt));
    }
    const { data, error } = await supabase.from("checkout_leads").select("*").order("updated_at", {
        ascending: false
    });
    if (error || !data) {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$runtime$2d$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["canUseLocalOrderFileStore"])()) {
            const fileLeads = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$leads$2d$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["readLeads"])();
            return fileLeads.sort((a, b)=>b.updatedAt.localeCompare(a.updatedAt));
        }
        throw new Error(error?.message || "Could not load leads from database.");
    }
    return data.map(mapLeadRow);
}
async function deleteLead(leadId) {
    const trimmedId = leadId.trim();
    if (!trimmedId) {
        return {
            deleted: false,
            reason: "Missing lead id."
        };
    }
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2d$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSupabaseAdminClient"])();
    if (!supabase) {
        const deleted = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$leads$2d$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["deleteLeadFromFile"])(trimmedId);
        return {
            deleted,
            reason: deleted ? undefined : "Lead not found in local store."
        };
    }
    const { data, error } = await supabase.from("checkout_leads").delete().eq("id", trimmedId).select("id").limit(1);
    if (error || !data?.length) {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$runtime$2d$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["canUseLocalOrderFileStore"])()) {
            const deletedInFile = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$leads$2d$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["deleteLeadFromFile"])(trimmedId);
            if (deletedInFile) {
                return {
                    deleted: true
                };
            }
        }
        return {
            deleted: false,
            reason: error?.message || "Lead not found."
        };
    }
    return {
        deleted: true
    };
}
async function markLeadAsConverted(leadId, orderId) {
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2d$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSupabaseAdminClient"])();
    if (!supabase) {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$runtime$2d$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["canUseLocalOrderFileStore"])()) {
            const leads = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$leads$2d$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["readLeads"])();
            const index = leads.findIndex((l)=>l.id === leadId);
            if (index !== -1) {
                leads[index] = {
                    ...leads[index],
                    status: "converted",
                    convertedOrderId: orderId,
                    updatedAt: new Date().toISOString()
                };
                const dataDir = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), "data");
                const leadsPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(dataDir, "leads.json");
                await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].writeFile(leadsPath, JSON.stringify(leads, null, 2), "utf8");
            }
        }
        return;
    }
    const { error } = await supabase.from("checkout_leads").update({
        status: "converted",
        converted_order_id: orderId,
        updated_at: new Date().toISOString()
    }).eq("id", leadId);
    if (error) {
        throw new Error(error.message || "Failed to mark lead as converted.");
    }
}
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/src/lib/admin-auth.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ADMIN_SESSION_COOKIE",
    ()=>ADMIN_SESSION_COOKIE,
    "createSessionValue",
    ()=>createSessionValue,
    "getAdminPassword",
    ()=>getAdminPassword,
    "getAdminSessionSecret",
    ()=>getAdminSessionSecret,
    "getAdminUsername",
    ()=>getAdminUsername,
    "isValidSessionCookie",
    ()=>isValidSessionCookie,
    "setAdminSessionCookie",
    ()=>setAdminSessionCookie
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
;
const ADMIN_SESSION_COOKIE = "admin_session";
function setAdminSessionCookie(response, sessionValue) {
    response.cookies.set({
        name: ADMIN_SESSION_COOKIE,
        value: sessionValue,
        httpOnly: true,
        sameSite: "lax",
        secure: ("TURBOPACK compile-time value", "development") === "production",
        path: "/"
    });
}
function getAdminUsername() {
    return process.env.ADMIN_DASHBOARD_USERNAME;
}
function getAdminPassword() {
    return process.env.ADMIN_DASHBOARD_PASSWORD;
}
function getAdminSessionSecret() {
    return process.env.ADMIN_SESSION_SECRET;
}
function createSessionValue() {
    const secret = getAdminSessionSecret();
    if (!secret) return "";
    const issuedAt = Date.now().toString();
    const signature = signValue(issuedAt, secret);
    return `${issuedAt}.${signature}`;
}
function isValidSessionCookie(cookieValue) {
    const secret = getAdminSessionSecret();
    if (!cookieValue || !secret) return false;
    const normalized = decodeURIComponent(cookieValue);
    const [issuedAt, providedSignature] = normalized.split(".");
    if (!issuedAt || !providedSignature) return false;
    const expectedSignature = signValue(issuedAt, secret);
    const providedBuffer = Buffer.from(providedSignature);
    const expectedBuffer = Buffer.from(expectedSignature);
    if (providedBuffer.length !== expectedBuffer.length) return false;
    try {
        return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["timingSafeEqual"])(providedBuffer, expectedBuffer);
    } catch  {
        return false;
    }
}
function signValue(value, secret) {
    return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["createHmac"])("sha256", secret).update(value).digest("hex");
}
}),
"[project]/src/lib/admin-request.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isAdminAuthorized",
    ()=>isAdminAuthorized
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$admin$2d$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/admin-auth.ts [app-route] (ecmascript)");
;
;
async function isAdminAuthorized() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    const sessionCookie = cookieStore.get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$admin$2d$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ADMIN_SESSION_COOKIE"])?.value;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$admin$2d$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isValidSessionCookie"])(sessionCookie);
}
}),
"[project]/src/lib/admin-session-response.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "withAdminSessionRefresh",
    ()=>withAdminSessionRefresh
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$admin$2d$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/admin-auth.ts [app-route] (ecmascript)");
;
;
async function withAdminSessionRefresh(response) {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    const existing = cookieStore.get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$admin$2d$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ADMIN_SESSION_COOKIE"])?.value;
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$admin$2d$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isValidSessionCookie"])(existing)) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$admin$2d$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["setAdminSessionCookie"])(response, existing);
    }
    return response;
}
}),
"[project]/src/app/api/orders/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DELETE",
    ()=>DELETE,
    "GET",
    ()=>GET,
    "PATCH",
    ()=>PATCH,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$orders$2d$repository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/orders-repository.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$leads$2d$repository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/leads-repository.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$admin$2d$request$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/admin-request.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$admin$2d$session$2d$response$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/admin-session-response.ts [app-route] (ecmascript)");
;
;
;
;
;
async function GET() {
    try {
        if (!await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$admin$2d$request$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isAdminAuthorized"])()) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: "Unauthorized."
            }, {
                status: 401
            });
        }
        const orders = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$orders$2d$repository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["listOrders"])();
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$admin$2d$session$2d$response$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["withAdminSessionRefresh"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            orders
        }));
    } catch  {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "Failed to read orders."
        }, {
            status: 500
        });
    }
}
async function POST(request) {
    try {
        const body = await request.json();
        if (!body?.items?.length || !body.customerName?.trim() || !body.phone?.trim() || !body.address?.trim()) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: "Invalid order payload."
            }, {
                status: 400
            });
        }
        const createdAt = body.createdAt || new Date().toISOString();
        const order = {
            ...body,
            id: body.id?.trim() ? body.id.trim() : await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$orders$2d$repository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["allocateNextOrderId"])(createdAt),
            createdAt,
            customerName: body.customerName.trim(),
            phone: body.phone.trim(),
            address: body.address.trim(),
            note: body.note?.trim() || undefined
        };
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$orders$2d$repository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createOrder"])(order);
        if (body.leadId) {
            try {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$leads$2d$repository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["markLeadAsConverted"])(body.leadId, order.id);
            } catch (err) {
                console.error("Failed to mark lead as converted:", err);
            }
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: true,
            orderId: order.id,
            order
        }, {
            status: 201
        });
    } catch (e) {
        const message = e instanceof Error ? e.message : "Failed to create order.";
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message
        }, {
            status: 500
        });
    }
}
async function PATCH(request) {
    try {
        if (!await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$admin$2d$request$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isAdminAuthorized"])()) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: "Unauthorized."
            }, {
                status: 401
            });
        }
        const body = await request.json();
        const validStatuses = [
            "pending",
            "confirmed",
            "delivered",
            "cancelled"
        ];
        if (!body.orderId || !body.status || !validStatuses.includes(body.status)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: "Invalid update payload."
            }, {
                status: 400
            });
        }
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$orders$2d$repository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["updateOrderStatus"])(body.orderId, body.status);
        if (!result.updated) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: result.reason || "Order not found."
            }, {
                status: 400
            });
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$admin$2d$session$2d$response$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["withAdminSessionRefresh"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: true
        }));
    } catch  {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "Failed to update order status."
        }, {
            status: 500
        });
    }
}
async function DELETE(request) {
    try {
        if (!await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$admin$2d$request$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isAdminAuthorized"])()) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: "Unauthorized."
            }, {
                status: 401
            });
        }
        const body = await request.json();
        const orderIds = (body.orderIds ?? []).map((id)=>id.trim()).filter(Boolean);
        if (!orderIds.length) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: "No order ids provided."
            }, {
                status: 400
            });
        }
        const deleted = [];
        const failed = [];
        for (const orderId of orderIds){
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$orders$2d$repository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["deleteOrder"])(orderId);
            if (result.deleted) {
                deleted.push(orderId);
            } else {
                failed.push({
                    id: orderId,
                    reason: result.reason || "Delete failed."
                });
            }
        }
        if (!deleted.length) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: failed[0]?.reason || "Could not delete orders.",
                failed
            }, {
                status: 400
            });
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$admin$2d$session$2d$response$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["withAdminSessionRefresh"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: true,
            deleted,
            failed
        }));
    } catch  {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "Failed to delete orders."
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0jo7sg-._.js.map