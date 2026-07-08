(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/shop/countdown-timer.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CountdownTimer",
    ()=>CountdownTimer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
function getTimeLeft(target) {
    const diff = Math.max(0, target.getTime() - Date.now());
    return {
        Days: Math.floor(diff / 86_400_000),
        Hrs: Math.floor(diff % 86_400_000 / 3_600_000),
        Min: Math.floor(diff % 3_600_000 / 60_000),
        Sec: Math.floor(diff % 60_000 / 1_000)
    };
}
function CountdownTimer({ targetDate }) {
    _s();
    const [time, setTime] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "CountdownTimer.useState": ()=>getTimeLeft(targetDate)
    }["CountdownTimer.useState"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CountdownTimer.useEffect": ()=>{
            const id = setInterval({
                "CountdownTimer.useEffect.id": ()=>setTime(getTimeLeft(targetDate))
            }["CountdownTimer.useEffect.id"], 1000);
            return ({
                "CountdownTimer.useEffect": ()=>clearInterval(id)
            })["CountdownTimer.useEffect"];
        }
    }["CountdownTimer.useEffect"], [
        targetDate
    ]);
    const entries = Object.entries(time);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "countdown",
        children: entries.map(([label, val], i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: "flex",
                    alignItems: "center",
                    gap: 6
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "countdown-unit",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "countdown-num",
                                children: String(val).padStart(2, "0")
                            }, void 0, false, {
                                fileName: "[project]/src/components/shop/countdown-timer.tsx",
                                lineNumber: 37,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "countdown-label",
                                children: label
                            }, void 0, false, {
                                fileName: "[project]/src/components/shop/countdown-timer.tsx",
                                lineNumber: 38,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/shop/countdown-timer.tsx",
                        lineNumber: 36,
                        columnNumber: 11
                    }, this),
                    i < entries.length - 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "countdown-sep",
                        children: ":"
                    }, void 0, false, {
                        fileName: "[project]/src/components/shop/countdown-timer.tsx",
                        lineNumber: 41,
                        columnNumber: 13
                    }, this)
                ]
            }, label, true, {
                fileName: "[project]/src/components/shop/countdown-timer.tsx",
                lineNumber: 35,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/src/components/shop/countdown-timer.tsx",
        lineNumber: 33,
        columnNumber: 5
    }, this);
}
_s(CountdownTimer, "UF4pTUfPK7vCGWMthkf2NjBO5mk=");
_c = CountdownTimer;
var _c;
__turbopack_context__.k.register(_c, "CountdownTimer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/cart-fly-animation.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "animateFlyToCart",
    ()=>animateFlyToCart
]);
"use client";
function animateFlyToCart(imageEl) {
    if (("TURBOPACK compile-time value", "object") === "undefined" || !imageEl) return;
    const headerEl = document.querySelector(".main-header");
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const from = imageEl.getBoundingClientRect();
    if (!from.width || !from.height) return;
    const clone = imageEl.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    clone.style.position = "fixed";
    clone.style.left = `${from.left}px`;
    clone.style.top = `${from.top}px`;
    clone.style.width = `${from.width}px`;
    clone.style.height = `${from.height}px`;
    clone.style.margin = "0";
    clone.style.objectFit = "cover";
    clone.style.objectPosition = "top";
    clone.style.borderRadius = "10px";
    clone.style.pointerEvents = "none";
    clone.style.zIndex = "9999";
    clone.style.boxShadow = "0 10px 30px rgba(0,0,0,0.22)";
    clone.style.transition = "none";
    clone.style.transformOrigin = "center center";
    document.body.appendChild(clone);
    const navTop = headerEl ? headerEl.getBoundingClientRect().top + 16 : 56;
    const toY = navTop - (from.top + from.height / 2);
    const upY = Math.min(-90, toY);
    const driftX = 10;
    const durationMs = isMobile ? 2200 : 980;
    const firstStopOffset = isMobile ? 0.34 : 0.2;
    const firstStopY = isMobile ? -4 : -8;
    requestAnimationFrame(()=>{
        clone.animate([
            {
                transform: "translate(0px, 0px) scale(1)",
                opacity: 1,
                borderRadius: "10px",
                offset: 0
            },
            {
                // pop near the card first
                transform: `translate(0px, ${firstStopY}px) scale(1.12)`,
                opacity: 1,
                borderRadius: "12px",
                offset: firstStopOffset
            },
            {
                // then fly upward and fade out
                transform: `translate(${driftX}px, ${upY}px) scale(0.22)`,
                opacity: 0,
                borderRadius: "999px",
                offset: 1
            }
        ], {
            duration: durationMs,
            easing: "cubic-bezier(0.15, 0.85, 0.2, 1)",
            fill: "forwards"
        });
    });
    window.setTimeout(()=>{
        clone.remove();
    }, durationMs + 60);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/data/categories.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "categories",
    ()=>categories
]);
const categories = [
    {
        id: "Salwar Kameez",
        label: "Everyday Elegance",
        title: "Salwar Kameez",
        description: "Comfort-first designs with stylish detailing.",
        icon: "✨",
        imageUrl: "/products/kurti/salwar1/olive.jpeg",
        accent: "#0ea5e9"
    },
    {
        id: "Two Pieces",
        label: "Modern Styles",
        title: "Two Pieces",
        description: "Comfortable and trendy two piece sets for daily wear.",
        icon: "🌿",
        imageUrl: "/products/kurti/two-piece/blue.jpeg",
        accent: "#38bdf8"
    },
    {
        id: "Three Pieces",
        label: "Premium Set",
        title: "Three Pieces",
        description: "Pure cotton three piece sets with elegant print and embroidery.",
        icon: "💫",
        imageUrl: "/products/kurti/three-piece/purple.jpeg",
        accent: "#0ea5e9"
    },
    {
        id: "Frogs",
        label: "Trending Collection",
        title: "Frogs",
        description: "Stylish frogs with elegant print and embroidery finishing.",
        icon: "👗",
        imageUrl: "/products/kurti/frog1/magenda.jpeg",
        accent: "#0ea5e9"
    },
    {
        id: "Gown",
        label: "One Piece",
        title: "Gown Collection",
        description: "Ready-made cotton gown one piece with embroidery and glass work.",
        icon: "🌸",
        imageUrl: "/products/kurti/gown1/navy-blue.jpeg",
        accent: "#0284c7"
    },
    {
        id: "Plazo",
        label: "Comfort Wear",
        title: "Plazo",
        description: "Embroidered plazo — premium fabric, free fit, long sizes 38–40.",
        icon: "👖",
        imageUrl: "/products/plazo/plazo1/img1.jpeg",
        accent: "#7c3aed"
    },
    {
        id: "Tops",
        label: "Trendy Wear",
        title: "Tops",
        description: "Fashionable and comfortable tops for modern daily wear.",
        icon: "👚",
        imageUrl: "/products/tops-category.png",
        accent: "#0ea5e9"
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/(site)/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Page
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$cart$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/cart-provider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$wishlist$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/wishlist-provider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shop$2f$countdown$2d$timer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/shop/countdown-timer.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cart$2d$fly$2d$animation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/cart-fly-animation.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$seed$2d$products$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/seed-products.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$categories$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/categories.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$product$2d$catalog$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/product-catalog-client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$product$2d$url$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/product-url.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$ui$2d$bn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/config/ui-bn.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature(), _s5 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
;
;
;
const CARD_SIZE_OPTIONS = [
    "36",
    "38",
    "40",
    "42",
    "44",
    "46",
    "48"
];
function productToStoreProduct(p) {
    return {
        id: p.id,
        slug: p.slug,
        name: p.name,
        category: p.category,
        image: p.imageUrl,
        price: p.price,
        colors: p.colors,
        sizes: p.sizes
    };
}
/* ─── fmt ────────────────────────────────────────────────────── */ function fmt(price) {
    return `৳${price.toLocaleString("en-BD")}`;
}
/* ─── ProductCard ───────────────────────────────────────────── */ const BADGE_CLASS = {
    Top: "pc-badge-top",
    Best: "pc-badge-best",
    New: "pc-badge-new",
    "Flash deal": "pc-badge-flash",
    Feature: "pc-badge-feature"
};
function ProductCard({ product, onAddToCart, onBuyNow }) {
    _s();
    const { toggleWishlist, isWishlisted } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$wishlist$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWishlist"])();
    const colors = product.colors ?? [];
    const sizes = product.sizes?.length ? product.sizes : CARD_SIZE_OPTIONS;
    const [activeColorIdx, setActiveColorIdx] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [justAdded, setJustAdded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const cardImgRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [pickerOpen, setPickerOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedSize, setSelectedSize] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const pickerIdRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(`${product.id}-${Math.random().toString(36).slice(2, 8)}`);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProductCard.useEffect": ()=>{
            const onOpen = {
                "ProductCard.useEffect.onOpen": (ev)=>{
                    const detail = ev.detail;
                    if (detail?.id !== pickerIdRef.current) setPickerOpen(false);
                }
            }["ProductCard.useEffect.onOpen"];
            window.addEventListener("hz:variant-picker-open", onOpen);
            return ({
                "ProductCard.useEffect": ()=>window.removeEventListener("hz:variant-picker-open", onOpen)
            })["ProductCard.useEffect"];
        }
    }["ProductCard.useEffect"], []);
    // The displayed image follows the selected color
    const displayImage = colors.length > 0 ? colors[activeColorIdx].image : product.image;
    // The active color label
    const activeLabel = colors.length > 0 ? colors[activeColorIdx].label : null;
    const activeColorId = colors.length > 0 ? colors[activeColorIdx].id : undefined;
    const wishlisted = isWishlisted(product.id, activeColorId);
    function handleColorClick(e, idx) {
        e.preventDefault();
        e.stopPropagation();
        setActiveColorIdx(idx);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "pc",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pc-img-wrap",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        href: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$product$2d$url$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["productPagePath"])(product.slug),
                        style: {
                            textDecoration: "none",
                            display: "block"
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                            ref: cardImgRef,
                            src: displayImage,
                            alt: `${product.name}${activeLabel ? ` – ${activeLabel}` : ""}`,
                            className: "pc-img",
                            loading: "lazy",
                            decoding: "async"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(site)/page.tsx",
                            lineNumber: 114,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/(site)/page.tsx",
                        lineNumber: 113,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: `pc-wish-btn${wishlisted ? " active" : ""}`,
                        "aria-label": wishlisted ? "Remove from wishlist" : "Add to wishlist",
                        title: wishlisted ? "Remove from wishlist" : "Add to wishlist",
                        onClick: (e)=>{
                            e.preventDefault();
                            e.stopPropagation();
                            toggleWishlist({
                                productId: product.id,
                                slug: product.slug,
                                name: activeLabel ? `${product.name} (${activeLabel})` : product.name,
                                price: product.price,
                                imageUrl: displayImage,
                                category: product.category,
                                colorId: activeColorId
                            });
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            viewBox: "0 0 24 24",
                            fill: wishlisted ? "currentColor" : "none",
                            stroke: "currentColor",
                            strokeWidth: "2",
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                            }, void 0, false, {
                                fileName: "[project]/src/app/(site)/page.tsx",
                                lineNumber: 143,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/(site)/page.tsx",
                            lineNumber: 142,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/(site)/page.tsx",
                        lineNumber: 123,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "pc-badges",
                        children: [
                            product.discountPercent && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "pc-badge pc-badge-sale",
                                children: [
                                    "-",
                                    product.discountPercent,
                                    "%"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(site)/page.tsx",
                                lineNumber: 148,
                                columnNumber: 13
                            }, this),
                            product.badge && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: `pc-badge ${BADGE_CLASS[product.badge] ?? "pc-badge-new"}`,
                                children: product.badge
                            }, void 0, false, {
                                fileName: "[project]/src/app/(site)/page.tsx",
                                lineNumber: 151,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(site)/page.tsx",
                        lineNumber: 146,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(site)/page.tsx",
                lineNumber: 112,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pc-body",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "pc-cat",
                        children: product.category
                    }, void 0, false, {
                        fileName: "[project]/src/app/(site)/page.tsx",
                        lineNumber: 159,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        href: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$product$2d$url$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["productPagePath"])(product.slug),
                        className: "pc-name",
                        style: {
                            textDecoration: "none"
                        },
                        children: product.name
                    }, void 0, false, {
                        fileName: "[project]/src/app/(site)/page.tsx",
                        lineNumber: 160,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "pc-stars",
                        children: "☆☆☆☆☆"
                    }, void 0, false, {
                        fileName: "[project]/src/app/(site)/page.tsx",
                        lineNumber: 163,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "pc-price-row",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "pc-price",
                                children: fmt(product.price)
                            }, void 0, false, {
                                fileName: "[project]/src/app/(site)/page.tsx",
                                lineNumber: 165,
                                columnNumber: 11
                            }, this),
                            product.originalPrice && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "pc-original-price",
                                children: fmt(product.originalPrice)
                            }, void 0, false, {
                                fileName: "[project]/src/app/(site)/page.tsx",
                                lineNumber: 167,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(site)/page.tsx",
                        lineNumber: 164,
                        columnNumber: 9
                    }, this),
                    colors.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "pc-color-swatches",
                        title: activeLabel ?? "",
                        children: colors.map((color, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: `pc-color-dot${activeColorIdx === i ? " active" : ""}`,
                                onClick: (e)=>handleColorClick(e, i),
                                title: color.label,
                                "aria-label": color.label,
                                "aria-pressed": activeColorIdx === i,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                    src: color.image,
                                    alt: color.label
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(site)/page.tsx",
                                    lineNumber: 183,
                                    columnNumber: 17
                                }, this)
                            }, color.id, false, {
                                fileName: "[project]/src/app/(site)/page.tsx",
                                lineNumber: 175,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/app/(site)/page.tsx",
                        lineNumber: 173,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "pc-bottom-actions",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: `pc-bottom-btn hz-btn-add pc-btn-cart${justAdded ? " is-added" : ""}`,
                                onClick: (e)=>{
                                    e.preventDefault();
                                    setSelectedSize(null);
                                    window.dispatchEvent(new CustomEvent("hz:variant-picker-open", {
                                        detail: {
                                            id: pickerIdRef.current
                                        }
                                    }));
                                    setPickerOpen(true);
                                },
                                children: justAdded ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$ui$2d$bn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bn"].product.addedToCart : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$ui$2d$bn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bn"].product.addToCart
                            }, void 0, false, {
                                fileName: "[project]/src/app/(site)/page.tsx",
                                lineNumber: 191,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "pc-bottom-btn hz-btn-buy pc-btn-buy",
                                onClick: (e)=>{
                                    e.preventDefault();
                                    onBuyNow({
                                        ...product,
                                        image: displayImage
                                    });
                                },
                                children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$ui$2d$bn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bn"].product.buyNow
                            }, void 0, false, {
                                fileName: "[project]/src/app/(site)/page.tsx",
                                lineNumber: 204,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(site)/page.tsx",
                        lineNumber: 190,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(site)/page.tsx",
                lineNumber: 158,
                columnNumber: 7
            }, this),
            pickerOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "variant-picker-card-overlay",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "variant-picker-card-modal",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "variant-picker-content",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    style: {
                                        marginBottom: 8,
                                        fontFamily: "var(--font-heading, serif)"
                                    },
                                    children: "Choose options"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(site)/page.tsx",
                                    lineNumber: 221,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    style: {
                                        marginBottom: 12,
                                        color: "var(--color-text-secondary)",
                                        fontSize: 13
                                    },
                                    children: product.name
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(site)/page.tsx",
                                    lineNumber: 222,
                                    columnNumber: 15
                                }, this),
                                colors.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "selector-label",
                                            style: {
                                                marginBottom: 8
                                            },
                                            children: [
                                                "Color: ",
                                                colors[activeColorIdx]?.label
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/(site)/page.tsx",
                                            lineNumber: 225,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "pc-color-swatches variant-picker-swatches",
                                            children: colors.map((color, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: `pc-color-dot${activeColorIdx === i ? " active" : ""}`,
                                                    onClick: ()=>setActiveColorIdx(i),
                                                    title: color.label,
                                                    "aria-label": color.label,
                                                    "aria-pressed": activeColorIdx === i,
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                        src: color.image,
                                                        alt: color.label
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(site)/page.tsx",
                                                        lineNumber: 238,
                                                        columnNumber: 25
                                                    }, this)
                                                }, color.id, false, {
                                                    fileName: "[project]/src/app/(site)/page.tsx",
                                                    lineNumber: 230,
                                                    columnNumber: 23
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(site)/page.tsx",
                                            lineNumber: 228,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "selector-label",
                                    style: {
                                        marginBottom: 8
                                    },
                                    children: [
                                        "Size: ",
                                        selectedSize ?? "Select size"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(site)/page.tsx",
                                    lineNumber: 244,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "size-grid variant-picker-sizes",
                                    children: sizes.map((sz)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: `size-btn${selectedSize === sz ? " active" : ""}`,
                                            onClick: ()=>setSelectedSize(sz),
                                            "aria-pressed": selectedSize === sz,
                                            children: sz
                                        }, sz, false, {
                                            fileName: "[project]/src/app/(site)/page.tsx",
                                            lineNumber: 249,
                                            columnNumber: 19
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(site)/page.tsx",
                                    lineNumber: 247,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(site)/page.tsx",
                            lineNumber: 220,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "variant-picker-actions",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "btn btn-secondary",
                                    onClick: ()=>setPickerOpen(false),
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(site)/page.tsx",
                                    lineNumber: 261,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "btn hz-btn-add",
                                    disabled: !selectedSize,
                                    onClick: ()=>{
                                        const colorLabel = colors[activeColorIdx]?.label;
                                        onAddToCart({
                                            ...product,
                                            image: displayImage,
                                            name: product.name
                                        }, {
                                            selectedColor: colorLabel,
                                            selectedSize: selectedSize ?? undefined
                                        });
                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cart$2d$fly$2d$animation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["animateFlyToCart"])(cardImgRef.current);
                                        setJustAdded(true);
                                        window.setTimeout(()=>setJustAdded(false), 700);
                                        setPickerOpen(false);
                                    },
                                    children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$ui$2d$bn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bn"].product.confirmAdd
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(site)/page.tsx",
                                    lineNumber: 262,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(site)/page.tsx",
                            lineNumber: 260,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(site)/page.tsx",
                    lineNumber: 217,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/(site)/page.tsx",
                lineNumber: 216,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/(site)/page.tsx",
        lineNumber: 111,
        columnNumber: 5
    }, this);
}
_s(ProductCard, "8xOiNR6u5A/MnSlZ1VRsxdMWaXw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$wishlist$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWishlist"]
    ];
});
_c = ProductCard;
/* ─── CategoryScrollSection ──────────────────────────────────── */ function CategoryScrollSection() {
    _s1();
    const trackRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const scroll = (dir)=>{
        if (!trackRef.current) return;
        trackRef.current.scrollBy({
            left: dir === "left" ? -240 : 240,
            behavior: "smooth"
        });
    };
    const catItems = [
        ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$categories$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["categories"].map((c)=>({
                id: c.id,
                label: c.title,
                image: c.imageUrl
            })),
        {
            id: "KURTI",
            label: "KURTI",
            image: "https://placehold.co/120x120/e0f2fe/0284c7?text=KURTI"
        },
        {
            id: "BORKA",
            label: "BORKA",
            image: "https://placehold.co/120x120/e0f2fe/0284c7?text=BORKA"
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "cat-scroll-wrap",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                className: "cat-scroll-arrow left",
                onClick: ()=>scroll("left"),
                "aria-label": "Previous categories",
                children: "‹"
            }, void 0, false, {
                fileName: "[project]/src/app/(site)/page.tsx",
                lineNumber: 304,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "cat-scroll-track",
                ref: trackRef,
                children: catItems.map((cat)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: `/store?category=${encodeURIComponent(cat.id)}`,
                        className: "cat-item",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: cat.image,
                                alt: cat.label,
                                className: "cat-item-img",
                                loading: "lazy",
                                decoding: "async"
                            }, void 0, false, {
                                fileName: "[project]/src/app/(site)/page.tsx",
                                lineNumber: 312,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "cat-item-label",
                                children: cat.label
                            }, void 0, false, {
                                fileName: "[project]/src/app/(site)/page.tsx",
                                lineNumber: 319,
                                columnNumber: 13
                            }, this)
                        ]
                    }, cat.id, true, {
                        fileName: "[project]/src/app/(site)/page.tsx",
                        lineNumber: 307,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/app/(site)/page.tsx",
                lineNumber: 305,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                className: "cat-scroll-arrow right",
                onClick: ()=>scroll("right"),
                "aria-label": "Next categories",
                children: "›"
            }, void 0, false, {
                fileName: "[project]/src/app/(site)/page.tsx",
                lineNumber: 323,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/(site)/page.tsx",
        lineNumber: 303,
        columnNumber: 5
    }, this);
}
_s1(CategoryScrollSection, "MRPoGswyMQM28Ca9bWnGm0R+Wxw=");
_c1 = CategoryScrollSection;
/* ─── ProductRowSection ──────────────────────────────────────── */ function ProductRowSection({ title, products, viewAllHref, onAddToCart, onBuyNow }) {
    _s2();
    const trackRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const scroll = (dir)=>{
        trackRef.current?.scrollBy({
            left: dir === "left" ? -220 : 220,
            behavior: "smooth"
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "fancy-section reveal",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fancy-title-row",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "fancy-title",
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/src/app/(site)/page.tsx",
                        lineNumber: 350,
                        columnNumber: 9
                    }, this),
                    viewAllHref && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: viewAllHref,
                        className: "fancy-view-all",
                        children: "View All →"
                    }, void 0, false, {
                        fileName: "[project]/src/app/(site)/page.tsx",
                        lineNumber: 352,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(site)/page.tsx",
                lineNumber: 349,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "cat-scroll-wrap",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "cat-scroll-arrow left",
                        onClick: ()=>scroll("left"),
                        "aria-label": "Scroll left",
                        children: "‹"
                    }, void 0, false, {
                        fileName: "[project]/src/app/(site)/page.tsx",
                        lineNumber: 358,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "product-row-scroll",
                        ref: trackRef,
                        children: products.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ProductCard, {
                                product: p,
                                onAddToCart: onAddToCart,
                                onBuyNow: onBuyNow
                            }, p.id, false, {
                                fileName: "[project]/src/app/(site)/page.tsx",
                                lineNumber: 361,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/app/(site)/page.tsx",
                        lineNumber: 359,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "cat-scroll-arrow right",
                        onClick: ()=>scroll("right"),
                        "aria-label": "Scroll right",
                        children: "›"
                    }, void 0, false, {
                        fileName: "[project]/src/app/(site)/page.tsx",
                        lineNumber: 364,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(site)/page.tsx",
                lineNumber: 357,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/(site)/page.tsx",
        lineNumber: 348,
        columnNumber: 5
    }, this);
}
_s2(ProductRowSection, "MRPoGswyMQM28Ca9bWnGm0R+Wxw=");
_c2 = ProductRowSection;
/* ─── DealsProductScroll (arrows inside the deals panel) ────── */ function DealsProductScroll({ products, onAddToCart, onBuyNow }) {
    _s3();
    const trackRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const scroll = (dir)=>trackRef.current?.scrollBy({
            left: dir === "left" ? -220 : 220,
            behavior: "smooth"
        });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "cat-scroll-wrap",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                className: "cat-scroll-arrow left",
                onClick: ()=>scroll("left"),
                "aria-label": "Scroll left",
                children: "‹"
            }, void 0, false, {
                fileName: "[project]/src/app/(site)/page.tsx",
                lineNumber: 386,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "product-row-scroll",
                ref: trackRef,
                children: products.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ProductCard, {
                        product: p,
                        onAddToCart: onAddToCart,
                        onBuyNow: onBuyNow
                    }, p.id, false, {
                        fileName: "[project]/src/app/(site)/page.tsx",
                        lineNumber: 389,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/app/(site)/page.tsx",
                lineNumber: 387,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                className: "cat-scroll-arrow right",
                onClick: ()=>scroll("right"),
                "aria-label": "Scroll right",
                children: "›"
            }, void 0, false, {
                fileName: "[project]/src/app/(site)/page.tsx",
                lineNumber: 392,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/(site)/page.tsx",
        lineNumber: 385,
        columnNumber: 5
    }, this);
}
_s3(DealsProductScroll, "MRPoGswyMQM28Ca9bWnGm0R+Wxw=");
_c3 = DealsProductScroll;
/* ─── HomePage ───────────────────────────────────────────────── */ function HomePage({ catalog, onAddToCart, onBuyNow }) {
    _s4();
    // Deals countdown — 5 days from now
    const dealTarget = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
    const newArrivals = catalog.slice(0, 5);
    const featured = [
        catalog.find((p)=>p.slug === "batik-print-two-piece"),
        catalog.find((p)=>p.slug === "cotton-gown-embroidery"),
        catalog.find((p)=>p.slug === "salwar-sequence-embroidery"),
        catalog.find((p)=>p.slug === "salwar-premium-cotton"),
        catalog.find((p)=>p.slug === "embroidered-frogs")
    ].filter(Boolean);
    const [dealsProducts, setDealsProducts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "HomePage.useState": ()=>catalog.slice(0, 2)
    }["HomePage.useState"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HomePage.useEffect": ()=>{
            if (catalog.length < 2) return;
            const shuffled = [
                ...catalog
            ].sort({
                "HomePage.useEffect.shuffled": ()=>Math.random() - 0.5
            }["HomePage.useEffect.shuffled"]);
            setDealsProducts(shuffled.slice(0, 2));
        }
    }["HomePage.useEffect"], [
        catalog
    ]);
    const flashDealProducts = [
        catalog.find((p)=>p.slug === "embroidered-frogs"),
        catalog.find((p)=>p.slug === "cotton-gown-embroidery")
    ].filter(Boolean);
    const twoPiecesProducts = catalog.filter((p)=>p.category === "Two Pieces").slice(0, 8);
    const threePiecesProducts = catalog.filter((p)=>p.category === "Three Pieces").slice(0, 8);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "page-main",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "hero-banner-new",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                        src: "/banner-home.png",
                        alt: "Henley Zone collection banner",
                        className: "hero-banner-img",
                        width: 1920,
                        height: 640,
                        decoding: "async",
                        fetchPriority: "high",
                        loading: "eager",
                        onError: (e)=>{
                            e.target.style.display = "none";
                        }
                    }, void 0, false, {
                        fileName: "[project]/src/app/(site)/page.tsx",
                        lineNumber: 439,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "hero-banner-cta-desktop",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/store",
                            className: "hero-banner-shop-btn",
                            children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$ui$2d$bn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bn"].home.shopNow
                        }, void 0, false, {
                            fileName: "[project]/src/app/(site)/page.tsx",
                            lineNumber: 453,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/(site)/page.tsx",
                        lineNumber: 452,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(site)/page.tsx",
                lineNumber: 438,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "hero-banner-cta-strip",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    href: "/store",
                    className: "hero-banner-shop-btn",
                    children: "Shop Now →"
                }, void 0, false, {
                    fileName: "[project]/src/app/(site)/page.tsx",
                    lineNumber: 459,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/(site)/page.tsx",
                lineNumber: 458,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "container",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "fancy-section reveal",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "fancy-title-row",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "fancy-title",
                                    children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$ui$2d$bn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bn"].home.shopByCategory
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(site)/page.tsx",
                                    lineNumber: 468,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/(site)/page.tsx",
                                lineNumber: 467,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CategoryScrollSection, {}, void 0, false, {
                                fileName: "[project]/src/app/(site)/page.tsx",
                                lineNumber: 470,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(site)/page.tsx",
                        lineNumber: 466,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "fancy-section reveal",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "fancy-title-row",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "fancy-title",
                                    children: "Deals Of The Week"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(site)/page.tsx",
                                    lineNumber: 476,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/(site)/page.tsx",
                                lineNumber: 475,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "deals-section",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "deals-inner",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "deals-timer-col",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "deals-timer-label",
                                                    children: "Offer Ends In"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(site)/page.tsx",
                                                    lineNumber: 481,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shop$2f$countdown$2d$timer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CountdownTimer"], {
                                                    targetDate: dealTarget
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(site)/page.tsx",
                                                    lineNumber: 482,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    href: "/store",
                                                    className: "deals-view-all",
                                                    children: "View All"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(site)/page.tsx",
                                                    lineNumber: 483,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/(site)/page.tsx",
                                            lineNumber: 480,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "deals-products",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DealsProductScroll, {
                                                products: dealsProducts,
                                                onAddToCart: onAddToCart,
                                                onBuyNow: onBuyNow
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(site)/page.tsx",
                                                lineNumber: 486,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(site)/page.tsx",
                                            lineNumber: 485,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(site)/page.tsx",
                                    lineNumber: 479,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/(site)/page.tsx",
                                lineNumber: 478,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(site)/page.tsx",
                        lineNumber: 474,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ProductRowSection, {
                        title: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$ui$2d$bn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bn"].home.newArrival,
                        products: newArrivals,
                        viewAllHref: "/store?sort=newest",
                        onAddToCart: onAddToCart,
                        onBuyNow: onBuyNow
                    }, void 0, false, {
                        fileName: "[project]/src/app/(site)/page.tsx",
                        lineNumber: 493,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ProductRowSection, {
                        title: "Featured",
                        products: featured,
                        onAddToCart: onAddToCart,
                        onBuyNow: onBuyNow
                    }, void 0, false, {
                        fileName: "[project]/src/app/(site)/page.tsx",
                        lineNumber: 502,
                        columnNumber: 9
                    }, this),
                    twoPiecesProducts.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ProductRowSection, {
                        title: "Two Pieces",
                        products: twoPiecesProducts,
                        viewAllHref: "/store?category=Two+Pieces",
                        onAddToCart: onAddToCart,
                        onBuyNow: onBuyNow
                    }, void 0, false, {
                        fileName: "[project]/src/app/(site)/page.tsx",
                        lineNumber: 511,
                        columnNumber: 11
                    }, this),
                    threePiecesProducts.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ProductRowSection, {
                        title: "Three Pieces",
                        products: threePiecesProducts,
                        viewAllHref: "/store?category=Three+Pieces",
                        onAddToCart: onAddToCart,
                        onBuyNow: onBuyNow
                    }, void 0, false, {
                        fileName: "[project]/src/app/(site)/page.tsx",
                        lineNumber: 522,
                        columnNumber: 11
                    }, this),
                    flashDealProducts.length === 2 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "fancy-section reveal",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "fancy-title-row",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "fancy-title",
                                    children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$ui$2d$bn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bn"].home.flashDeal
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(site)/page.tsx",
                                    lineNumber: 535,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/(site)/page.tsx",
                                lineNumber: 534,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flash-grid",
                                children: flashDealProducts.map((fd)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$product$2d$url$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["productPagePath"])(fd.slug),
                                        className: "flash-card",
                                        style: {
                                            textDecoration: "none"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                src: fd.image,
                                                alt: fd.name,
                                                className: "flash-card-img",
                                                loading: "lazy",
                                                decoding: "async"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(site)/page.tsx",
                                                lineNumber: 545,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flash-card-body",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "flash-badge",
                                                        children: "Flash Deal"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(site)/page.tsx",
                                                        lineNumber: 553,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flash-card-name",
                                                        children: fd.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(site)/page.tsx",
                                                        lineNumber: 554,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flash-price-row",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "flash-card-price",
                                                                children: fmt(fd.price)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/(site)/page.tsx",
                                                                lineNumber: 556,
                                                                columnNumber: 23
                                                            }, this),
                                                            fd.originalPrice && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "flash-card-original",
                                                                children: fmt(fd.originalPrice)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/(site)/page.tsx",
                                                                lineNumber: 558,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/(site)/page.tsx",
                                                        lineNumber: 555,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/(site)/page.tsx",
                                                lineNumber: 552,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, fd.id, true, {
                                        fileName: "[project]/src/app/(site)/page.tsx",
                                        lineNumber: 539,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/app/(site)/page.tsx",
                                lineNumber: 537,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(site)/page.tsx",
                        lineNumber: 533,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "fancy-section reveal",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "trust-badges",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "trust-item",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "trust-icon",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                width: "20",
                                                height: "20",
                                                viewBox: "0 0 24 24",
                                                fill: "none",
                                                stroke: "currentColor",
                                                strokeWidth: "2",
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                        x: "1",
                                                        y: "4",
                                                        width: "22",
                                                        height: "16",
                                                        rx: "2"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(site)/page.tsx",
                                                        lineNumber: 574,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                        x1: "1",
                                                        y1: "10",
                                                        x2: "23",
                                                        y2: "10"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(site)/page.tsx",
                                                        lineNumber: 575,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/(site)/page.tsx",
                                                lineNumber: 573,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(site)/page.tsx",
                                            lineNumber: 572,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "trust-text-title",
                                                    children: "Cash on Delivery"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(site)/page.tsx",
                                                    lineNumber: 579,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "trust-text-sub",
                                                    children: "সারা বাংলাদেশে COD সুবিধা"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(site)/page.tsx",
                                                    lineNumber: 580,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/(site)/page.tsx",
                                            lineNumber: 578,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(site)/page.tsx",
                                    lineNumber: 571,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "trust-item",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "trust-icon",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                width: "20",
                                                height: "20",
                                                viewBox: "0 0 24 24",
                                                fill: "none",
                                                stroke: "currentColor",
                                                strokeWidth: "2",
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        d: "M3 18v-6a9 9 0 0 1 18 0v6"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(site)/page.tsx",
                                                        lineNumber: 586,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        d: "M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(site)/page.tsx",
                                                        lineNumber: 587,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/(site)/page.tsx",
                                                lineNumber: 585,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(site)/page.tsx",
                                            lineNumber: 584,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "trust-text-title",
                                                    children: "24/7 Customer Support"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(site)/page.tsx",
                                                    lineNumber: 591,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "trust-text-sub",
                                                    children: "WhatsApp ও ফোনে সাপোর্ট"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(site)/page.tsx",
                                                    lineNumber: 592,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/(site)/page.tsx",
                                            lineNumber: 590,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(site)/page.tsx",
                                    lineNumber: 583,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "trust-item",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "trust-icon",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                width: "20",
                                                height: "20",
                                                viewBox: "0 0 24 24",
                                                fill: "none",
                                                stroke: "currentColor",
                                                strokeWidth: "2",
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                                        points: "23 4 23 10 17 10"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(site)/page.tsx",
                                                        lineNumber: 598,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                                        points: "1 20 1 14 7 14"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(site)/page.tsx",
                                                        lineNumber: 599,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        d: "M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(site)/page.tsx",
                                                        lineNumber: 600,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/(site)/page.tsx",
                                                lineNumber: 597,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(site)/page.tsx",
                                            lineNumber: 596,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "trust-text-title",
                                                    children: "Easy Returns"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(site)/page.tsx",
                                                    lineNumber: 604,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "trust-text-sub",
                                                    children: "৩ দিনের মধ্যে রিটার্ন"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(site)/page.tsx",
                                                    lineNumber: 605,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/(site)/page.tsx",
                                            lineNumber: 603,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(site)/page.tsx",
                                    lineNumber: 595,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(site)/page.tsx",
                            lineNumber: 570,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/(site)/page.tsx",
                        lineNumber: 569,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(site)/page.tsx",
                lineNumber: 464,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/(site)/page.tsx",
        lineNumber: 436,
        columnNumber: 5
    }, this);
}
_s4(HomePage, "xmpXT4dl7CgB6JmW/nD0k58qPMc=");
_c4 = HomePage;
function Page() {
    _s5();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { addToCart } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$cart$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCart"])();
    const [catalog, setCatalog] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "Page.useState": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$product$2d$catalog$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSyncedProductCatalog"])() ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$seed$2d$products$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["seedProducts"]
    }["Page.useState"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Page.useEffect": ()=>{
            const hash = window.location.hash;
            if (hash.startsWith("#/product/")) {
                const slug = hash.replace("#/product/", "").split("?")[0];
                router.replace((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$product$2d$url$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["productPagePath"])(slug));
                return;
            }
            void (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$product$2d$catalog$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getProductsCatalog"])().then(setCatalog).catch({
                "Page.useEffect": ()=>{}
            }["Page.useEffect"]);
            const onCatalog = {
                "Page.useEffect.onCatalog": ()=>{
                    void (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$product$2d$catalog$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getProductsCatalog"])().then(setCatalog);
                }
            }["Page.useEffect.onCatalog"];
            window.addEventListener("hz:catalog-updated", onCatalog);
            return ({
                "Page.useEffect": ()=>window.removeEventListener("hz:catalog-updated", onCatalog)
            })["Page.useEffect"];
        }
    }["Page.useEffect"], [
        router
    ]);
    const storeCatalog = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Page.useMemo[storeCatalog]": ()=>catalog.map(productToStoreProduct)
    }["Page.useMemo[storeCatalog]"], [
        catalog
    ]);
    function handleAddToCart(p, opts) {
        addToCart({
            id: p.id,
            slug: p.slug,
            name: p.name,
            description: "",
            price: p.price,
            stock: 99,
            imageUrl: p.image,
            category: p.category
        }, opts);
    }
    function handleBuyNow(p) {
        router.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$product$2d$url$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["productPagePath"])(p.slug));
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(HomePage, {
        catalog: storeCatalog,
        onAddToCart: handleAddToCart,
        onBuyNow: handleBuyNow
    }, void 0, false, {
        fileName: "[project]/src/app/(site)/page.tsx",
        lineNumber: 663,
        columnNumber: 5
    }, this);
}
_s5(Page, "jTpZLpA4r5qoGYFBCA7Ww5STvZ0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$cart$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCart"]
    ];
});
_c5 = Page;
var _c, _c1, _c2, _c3, _c4, _c5;
__turbopack_context__.k.register(_c, "ProductCard");
__turbopack_context__.k.register(_c1, "CategoryScrollSection");
__turbopack_context__.k.register(_c2, "ProductRowSection");
__turbopack_context__.k.register(_c3, "DealsProductScroll");
__turbopack_context__.k.register(_c4, "HomePage");
__turbopack_context__.k.register(_c5, "Page");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_0cd_bxz._.js.map