module.exports = [
"[project]/src/lib/product-catalog-client.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "deferCatalogRefresh",
    ()=>deferCatalogRefresh,
    "getProductsCatalog",
    ()=>getProductsCatalog,
    "getSyncedProductCatalog",
    ()=>getSyncedProductCatalog,
    "invalidateProductCatalog",
    ()=>invalidateProductCatalog
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$seed$2d$products$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/seed-products.ts [app-ssr] (ecmascript)");
;
let memoryCache = null;
let inflight = null;
function getSyncedProductCatalog() {
    return memoryCache;
}
function refreshCatalogFromApi() {
    return fetch("/api/products").then((r)=>{
        if (!r.ok) throw new Error("fetch failed");
        return r.json();
    }).then((data)=>{
        if (data.products && Array.isArray(data.products)) {
            memoryCache = data.products;
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
        }
        return memoryCache ?? [
            ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$seed$2d$products$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["seedProducts"]
        ];
    });
}
function getProductsCatalog() {
    if (memoryCache) return Promise.resolve(memoryCache);
    memoryCache = [
        ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$seed$2d$products$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["seedProducts"]
    ];
    if (!inflight) {
        inflight = refreshCatalogFromApi().catch(()=>memoryCache ?? [
                ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$seed$2d$products$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["seedProducts"]
            ]).finally(()=>{
            inflight = null;
        });
    }
    return Promise.resolve(memoryCache);
}
function invalidateProductCatalog() {
    memoryCache = null;
    inflight = null;
}
function deferCatalogRefresh() {
    if (memoryCache && memoryCache !== __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$seed$2d$products$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["seedProducts"]) {
        return Promise.resolve(memoryCache);
    }
    memoryCache = [
        ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$seed$2d$products$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["seedProducts"]
    ];
    return new Promise((resolve)=>{
        const run = ()=>{
            void getProductsCatalog().then(resolve);
        };
        if (("TURBOPACK compile-time value", "undefined") !== "undefined" && "requestIdleCallback" in window) //TURBOPACK unreachable
        ;
        else {
            setTimeout(run, 800);
        }
    });
}
}),
"[project]/src/config/businesses.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "businessTelHref",
    ()=>businessTelHref,
    "businessWhatsappChatUrl",
    ()=>businessWhatsappChatUrl,
    "businesses",
    ()=>businesses,
    "defaultBusiness",
    ()=>defaultBusiness
]);
function businessWhatsappChatUrl(b) {
    return `https://wa.me/${b.whatsappInternationalDigits}`;
}
function businessTelHref(b) {
    return `tel:${b.whatsappInternationalDigits}`;
}
const businesses = [
    {
        slug: "clothing-store",
        name: "Henley Clothing",
        type: "clothing",
        tagline: "Quality styles with cash on delivery checkout.",
        whatsappNumber: "01581708578",
        whatsappInternationalDigits: "8801581708578",
        codEnabled: true,
        currency: "BDT"
    },
    {
        slug: "business-two",
        name: "Business Two",
        type: "retail",
        tagline: "Second business website powered by the same core.",
        whatsappNumber: "01581708578",
        whatsappInternationalDigits: "8801581708578",
        codEnabled: true,
        currency: "BDT"
    },
    {
        slug: "business-three",
        name: "Business Three",
        type: "service",
        tagline: "Third business website with reusable platform.",
        whatsappNumber: "01581708578",
        whatsappInternationalDigits: "8801581708578",
        codEnabled: true,
        currency: "BDT"
    }
];
const defaultBusiness = businesses[0];
}),
"[project]/src/lib/product-search.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "filterProductsBySearch",
    ()=>filterProductsBySearch,
    "productMatchesSearch",
    ()=>productMatchesSearch
]);
function normalize(input) {
    return input.toLowerCase().replace(/[^a-z0-9]/g, "");
}
function hasAlias(query, aliases) {
    return aliases.some((alias)=>query.includes(alias));
}
function productMatchesSearch(product, rawQuery) {
    const query = normalize(rawQuery);
    if (!query) return true;
    const productText = normalize(`${product.name} ${product.category}`);
    const category = normalize(product.category);
    // "two piece / 2 piece" should show: salwar + frog + gown
    const twoPieceAliases = [
        "2piece",
        "twopiece",
        "twopices",
        "twopeice",
        "tupiece",
        "towpiece",
        "tupece",
        "2pice"
    ];
    // "frog" should show: frog + gown
    const frogAliases = [
        "frog",
        "frogs",
        "frg",
        "frgs",
        "frok",
        "froog"
    ];
    // "gown" should show: frog + gown
    const gownAliases = [
        "gown",
        "gaun",
        "gwon",
        "gon",
        "gwn"
    ];
    const salwarAliases = [
        "salwar",
        "salowar",
        "slwar",
        "salwr"
    ];
    const plazoAliases = [
        "plazo",
        "plazoo",
        "pajama",
        "pajamas",
        "palazzo"
    ];
    if (hasAlias(query, twoPieceAliases)) {
        return category.includes("salwar") || category.includes("twopieces") || category.includes("frogs") || category.includes("gown");
    }
    if (hasAlias(query, frogAliases) || hasAlias(query, gownAliases)) {
        return category.includes("frogs") || category.includes("gown");
    }
    if (hasAlias(query, salwarAliases)) {
        return category.includes("salwar");
    }
    if (hasAlias(query, plazoAliases)) {
        return category.includes("plazo");
    }
    return productText.includes(query);
}
function filterProductsBySearch(products, query) {
    return products.filter((product)=>productMatchesSearch(product, query));
}
}),
"[project]/src/components/layout/header-login-link.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "HeaderLoginLink",
    ()=>HeaderLoginLink
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
;
function HeaderLoginLink({ icon }) {
    const [href, setHref] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("/login");
    const [label, setLabel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("লগইন");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let cancelled = false;
        void fetch("/api/admin/session", {
            method: "GET",
            cache: "no-store",
            credentials: "include"
        }).then((res)=>{
            if (cancelled || !res.ok) return;
            setHref("/admin");
            setLabel("অ্যাডমিন");
        }).catch(()=>{});
        return ()=>{
            cancelled = true;
        };
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
        href: href,
        style: {
            display: "flex",
            alignItems: "center",
            gap: 4
        },
        children: [
            icon,
            label
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/layout/header-login-link.tsx",
        lineNumber: 29,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/lib/product-url.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/** Canonical fast product page (use in ads, Buy Now, and internal links). */ __turbopack_context__.s([
    "productPagePath",
    ()=>productPagePath
]);
function productPagePath(slug) {
    return `/product/${encodeURIComponent(slug)}`;
}
}),
"[project]/src/config/ui-bn.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Customer-facing UI copy (Bangla-first, simple English where common on BD shops).
 */ __turbopack_context__.s([
    "bn",
    ()=>bn,
    "categoryLabelBn",
    ()=>categoryLabelBn
]);
const bn = {
    brand: {
        codBanner: "সারা বাংলাদেশে ক্যাশ অন ডেলিভারি",
        codShort: "ক্যাশ অন ডেলিভারি · সারা বাংলাদেশে"
    },
    nav: {
        home: "হোম",
        shop: "শপ",
        contact: "যোগাযোগ",
        login: "লগইন",
        admin: "অ্যাডমিন",
        searchPlaceholder: "পণ্য খুঁজুন...",
        search: "খুঁজুন",
        wishlist: "পছন্দের তালিকা",
        cart: "কার্ট",
        noSearchResults: "কোনো পণ্য পাওয়া যায়নি"
    },
    categories: {
        all: "সব",
        "Salwar Kameez": "সালোয়ার কামিজ",
        "Two Pieces": "টু পিস",
        "Three Pieces": "থ্রি পিস",
        Frogs: "ফ্রগ",
        Gown: "গাউন",
        Plazo: "প্লাজো",
        Tops: "টপস"
    },
    product: {
        addToCart: "Add to Cart",
        addedToCart: "Added ✓",
        buyNow: "Buy Now",
        orderNow: "Buy Now",
        chooseOptions: "সাইজ ও রঙ বেছে নিন",
        color: "রঙ",
        size: "সাইজ",
        selectSize: "সাইজ বেছে নিন",
        quantity: "পরিমাণ",
        inStock: "স্টকে আছে",
        items: "টি",
        cancel: "বাতিল",
        confirmAdd: "Add to Cart",
        selectColorSize: "আগে রঙ ও সাইজ বেছে নিন।",
        related: "আরও পণ্য",
        descriptions: "বিবরণ",
        specifications: "বিস্তারিত",
        reviews: "রিভিউ",
        brand: "ব্র্যান্ড",
        notFound: "পণ্যটি পাওয়া যায়নি",
        browseStore: "শপে যান",
        loading: "পণ্য লোড হচ্ছে...",
        colorsAria: "রঙ বেছে নিন",
        sizesAria: "সাইজ বেছে নিন",
        viewFullImage: "পূর্ণ ছবি দেখুন",
        closeImage: "বন্ধ করুন"
    },
    scroll: {
        previous: "আগের অপশন",
        next: "পরের অপশন"
    },
    store: {
        title: "পোশাকের শপ",
        subtitle: "ক্যাশ অন ডেলিভারি · সারা বাংলাদেশে ডেলিভারি",
        loadError: "পণ্য লোড করা যায়নি। পেজ রিফ্রেশ করুন।"
    },
    home: {
        shopNow: "এখনই কিনুন →",
        shopByCategory: "ক্যাটাগরি অনুযায়ী",
        dealsOfWeek: "সপ্তাহের অফার",
        newArrival: "নতুন আগমন",
        flashDeal: "ফ্ল্যাশ ডিল",
        twoPieces: "টু পিস কালেকশন",
        threePieces: "থ্রি পিস কালেকশন"
    },
    cart: {
        title: "আপনার কার্ট",
        item: "টি পণ্য",
        items: "টি পণ্য",
        emptyTitle: "কার্ট খালি",
        emptyText: "এখনো কোনো পণ্য যোগ করেননি।",
        browse: "পণ্য দেখুন →",
        continueShopping: "← আরও কিনুন",
        clearCart: "কার্ট খালি করুন",
        clearConfirm: "কার্টের সব পণ্য মুছে ফেলবেন?",
        unit: "দাম",
        subtotal: "মোট পণ্য",
        delivery: "ডেলিভারি খরচ",
        deliveryNote: "চেকআউটে ঢাকা ভিতর/বাহির বেছে নেবেন",
        total: "মোট",
        summary: "অর্ডার সারাংশ",
        checkout: "অর্ডার সম্পন্ন করুন →",
        promo: "কুপন কোড",
        promoPlaceholder: "কুপন কোড লিখুন",
        apply: "প্রয়োগ"
    },
    checkout: {
        title: "অর্ডার করুন",
        breadcrumbHome: "হোম",
        breadcrumbCart: "কার্ট",
        breadcrumbCheckout: "অর্ডার",
        empty: "কার্ট খালি। আগে পণ্য যোগ করুন।",
        browse: "পণ্য দেখুন →",
        yourOrder: "আপনার অর্ডার",
        editCart: "কার্ট ঠিক করুন",
        qty: "পরিমাণ",
        billing: "আপনার তথ্য",
        fullName: "পুরো নাম *",
        namePlaceholder: "যেমন: ফাতেমা আক্তার",
        phone: "মোবাইল নম্বর *",
        phonePlaceholder: "যেমন: 01XXXXXXXXX",
        address: "সম্পূর্ণ ঠিকানা *",
        addressPlaceholder: "বাড়ি, রোড, এলাকা, জেলা",
        note: "বিশেষ নির্দেশনা",
        noteOptional: "(ঐচ্ছিক)",
        notePlaceholder: "রঙ, সাইজ বা ডেলিভারি নোট",
        summary: "বিল সারাংশ",
        subtotal: "পণ্যের মূল্য",
        deliveryArea: "ডেলিভারি এলাকা",
        insideDhaka: "ঢাকার ভিতরে",
        outsideDhaka: "ঢাকার বাহিরে",
        deliveryFee: "ডেলিভারি",
        totalPayable: "মোট পরিশোধ",
        cod: "ক্যাশ অন ডেলিভারি (পণ্য হাতে পেয়ে টাকা দিন)",
        terms: "আমি",
        termsLink: "শর্তাবলী",
        and: "ও",
        returnLink: "রিটার্ন নীতি",
        termsEnd: "মেনে নিচ্ছি",
        placing: "অর্ডার হচ্ছে…",
        confirm: "অর্ডার কনফার্ম করুন →",
        errors: {
            emptyCart: "কার্ট খালি।",
            required: "সব * চিহ্নিত ঘর পূরণ করুন।",
            phone: "সঠিক মোবাইল নম্বর দিন (১০–১৫ সংখ্যা)।",
            terms: "চালিয়ে যেতে শর্তাবলীতে সম্মতি দিন।",
            failed: "অর্ডার হয়নি। আবার চেষ্টা করুন।",
            network: "ইন্টারনেট সমস্যা। আবার চেষ্টা করুন।",
            noOrderId: "অর্ডার হয়েছে কিন্তু অর্ডার নম্বর পাওয়া যায়নি। সাপোর্টে কল করুন।"
        }
    },
    success: {
        title: "অর্ডার সফল হয়েছে",
        subtitle: "আপনার ক্যাশ অন ডেলিভারি অর্ডার গ্রহণ করা হয়েছে। নিচের তথ্য সংরক্ষণ করে রাখুন।",
        noOrder: "সাম্প্রতিক কোনো অর্ডার নেই।",
        continueShop: "আবার কিনুন",
        backStore: "শপে ফিরে যান",
        orderId: "অর্ডার নম্বর",
        placedOn: "অর্ডারের সময়",
        customer: "নাম",
        phone: "মোবাইল",
        address: "ডেলিভারি ঠিকানা",
        payment: "পেমেন্ট",
        paymentValue: "ক্যাশ অন ডেলিভারি",
        status: "স্ট্যাটাস",
        statusPending: "অপেক্ষমান — কনফার্ম করতে কল করব",
        statusConfirmed: "কনফার্ম হয়েছে",
        statusDelivered: "ডেলিভারি হয়েছে",
        statusCancelled: "বাতিল",
        itemsOrdered: "অর্ডারকৃত পণ্য",
        each: "প্রতিটি",
        line: "মোট",
        subtotal: "পণ্যের মূল্য",
        delivery: "ডেলিভারি",
        totalCod: "মোট (ক্যাশ অন ডেলিভারি)",
        yourNote: "আপনার নোট",
        footerNoteBefore: "ডেলিভারি কনফার্ম করতে",
        footerNoteAfter: "নম্বরে কল করব। অর্ডার নম্বর সংরক্ষণ করুন।"
    },
    footer: {
        categories: "ক্যাটাগরি",
        allProducts: "সব পণ্য",
        information: "তথ্য",
        contact: "যোগাযোগ",
        shipping: "ডেলিভারি নীতি",
        returns: "রিটার্ন নীতি",
        privacy: "গোপনীয়তা",
        terms: "শর্তাবলী",
        newsletter: "নিউজলেটার",
        newsletterText: "নতুন পণ্য ও অফার পেতে ইমেইল দিন।",
        emailPlaceholder: "আপনার ইমেইল",
        subscribe: "সাবস্ক্রাইব",
        rights: "সর্বস্বত্ব সংরক্ষিত",
        location: "ঢাকা, বাংলাদেশ"
    },
    wishlist: {
        title: "পছন্দের তালিকা",
        empty: "এখনো কোনো পণ্য সেভ করেননি।",
        browse: "পণ্য দেখুন →"
    }
};
function categoryLabelBn(category) {
    const map = bn.categories;
    return map[category] ?? category;
}
}),
"[project]/src/components/layout/site-header.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SiteHeader",
    ()=>SiteHeader
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$product$2d$catalog$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/product-catalog-client.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$cart$2d$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/cart-provider.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$wishlist$2d$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/wishlist-provider.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$businesses$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/config/businesses.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$product$2d$search$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/product-search.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$header$2d$login$2d$link$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/layout/header-login-link.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$product$2d$url$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/product-url.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$ui$2d$bn$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/config/ui-bn.ts [app-ssr] (ecmascript)");
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
;
function SearchIcon() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: "17",
        height: "17",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2.2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "11",
                cy: "11",
                r: "8"
            }, void 0, false, {
                fileName: "[project]/src/components/layout/site-header.tsx",
                lineNumber: 20,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "21",
                y1: "21",
                x2: "16.65",
                y2: "16.65"
            }, void 0, false, {
                fileName: "[project]/src/components/layout/site-header.tsx",
                lineNumber: 21,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/layout/site-header.tsx",
        lineNumber: 19,
        columnNumber: 5
    }, this);
}
function CartIcon() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: "18",
        height: "18",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "9",
                cy: "21",
                r: "1"
            }, void 0, false, {
                fileName: "[project]/src/components/layout/site-header.tsx",
                lineNumber: 29,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "20",
                cy: "21",
                r: "1"
            }, void 0, false, {
                fileName: "[project]/src/components/layout/site-header.tsx",
                lineNumber: 30,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"
            }, void 0, false, {
                fileName: "[project]/src/components/layout/site-header.tsx",
                lineNumber: 31,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/layout/site-header.tsx",
        lineNumber: 28,
        columnNumber: 5
    }, this);
}
function HeartIcon() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: "18",
        height: "18",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        }, void 0, false, {
            fileName: "[project]/src/components/layout/site-header.tsx",
            lineNumber: 39,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/layout/site-header.tsx",
        lineNumber: 38,
        columnNumber: 5
    }, this);
}
function UserIcon() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: "15",
        height: "15",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
            }, void 0, false, {
                fileName: "[project]/src/components/layout/site-header.tsx",
                lineNumber: 47,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "7",
                r: "4"
            }, void 0, false, {
                fileName: "[project]/src/components/layout/site-header.tsx",
                lineNumber: 48,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/layout/site-header.tsx",
        lineNumber: 46,
        columnNumber: 5
    }, this);
}
function SiteHeader() {
    const { itemCount } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$cart$2d$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCart"])();
    const { count: wishlistCount } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$wishlist$2d$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useWishlist"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [logoSrc, setLogoSrc] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("/logo.png");
    const [currentHash, setCurrentHash] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [isHeaderVisible, setIsHeaderVisible] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const lastScrollYRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    // Search state
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [isSearchFocused, setIsSearchFocused] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [products, setProducts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$product$2d$catalog$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSyncedProductCatalog"])() ?? []);
    const searchWrapRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const isProductPage = (pathname ?? "").startsWith("/product/");
    // Shared catalog fetch (deduped with /store and CatalogPrefetch)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const load = isProductPage ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$product$2d$catalog$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deferCatalogRefresh"] : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$product$2d$catalog$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getProductsCatalog"];
        void load().then((list)=>setProducts(list)).catch(()=>{});
    }, [
        isProductPage
    ]);
    // Close dropdown when clicking outside
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        function handleClickOutside(e) {
            if (searchWrapRef.current && !searchWrapRef.current.contains(e.target)) {
                setIsSearchFocused(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return ()=>document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const readHash = ()=>setCurrentHash(window.location.hash || "");
        readHash();
        window.addEventListener("hashchange", readHash);
        return ()=>window.removeEventListener("hashchange", readHash);
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setMounted(true);
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
        const mobileMq = undefined;
        const onScroll = undefined;
    }, []);
    const handleSearchSubmit = (e)=>{
        e.preventDefault();
        if (searchQuery.trim()) {
            setIsSearchFocused(false);
            router.push(`/store?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };
    const searchResults = searchQuery.trim() ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$product$2d$search$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["filterProductsBySearch"])(products, searchQuery).slice(0, 5) : [];
    const activeCategory = searchParams.get("category");
    const onStorePage = pathname === "/store";
    const onHomePage = pathname === "/" && !currentHash.startsWith("#/product/");
    const navClass = (isActive)=>`nav-link${isActive ? " active" : ""}`;
    const scrollToTopAfterNav = ()=>{
        // Ensure top scroll after route/hash navigation
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
        setTimeout(()=>{
            window.scrollTo({
                top: 0,
                behavior: "auto"
            });
        }, 30);
    };
    /** Next.js Link often does not clear client-side hash on `/`; force hash home for hash-routed PDP. */ const clickHomeOrLogo = (e)=>{
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
        const h = undefined;
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `main-header ${isHeaderVisible ? "header-scroll-up" : "header-scroll-down"}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "topbar",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "topbar-inner container",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            style: {
                                opacity: 0.9,
                                fontSize: "12.5px"
                            },
                            children: [
                                "📍 ",
                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$ui$2d$bn$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["bn"].brand.codBanner,
                                " · ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$businesses$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["businessTelHref"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$businesses$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["defaultBusiness"]),
                                    style: {
                                        color: "inherit",
                                        textDecoration: "underline"
                                    },
                                    children: [
                                        "📞 ",
                                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$businesses$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["defaultBusiness"].whatsappNumber
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/layout/site-header.tsx",
                                    lineNumber: 180,
                                    columnNumber: 13
                                }, this),
                                " · ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$businesses$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["businessWhatsappChatUrl"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$businesses$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["defaultBusiness"]),
                                    target: "_blank",
                                    rel: "noopener noreferrer",
                                    style: {
                                        color: "inherit",
                                        textDecoration: "underline"
                                    },
                                    children: "WhatsApp"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/site-header.tsx",
                                    lineNumber: 184,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/layout/site-header.tsx",
                            lineNumber: 177,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "topbar-right",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$header$2d$login$2d$link$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HeaderLoginLink"], {
                                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(UserIcon, {}, void 0, false, {
                                    fileName: "[project]/src/components/layout/site-header.tsx",
                                    lineNumber: 194,
                                    columnNumber: 36
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/site-header.tsx",
                                lineNumber: 194,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/layout/site-header.tsx",
                            lineNumber: 193,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/layout/site-header.tsx",
                    lineNumber: 176,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/layout/site-header.tsx",
                lineNumber: 175,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "site-header",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "site-header-nav",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: "/#/",
                                className: "logo-frame",
                                "aria-label": `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$businesses$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["defaultBusiness"].name} home`,
                                onClick: clickHomeOrLogo,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                    src: logoSrc,
                                    alt: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$businesses$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["defaultBusiness"].name} logo`,
                                    onError: ()=>setLogoSrc("/logo-placeholder.svg"),
                                    className: "logo-image"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/site-header.tsx",
                                    lineNumber: 208,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/site-header.tsx",
                                lineNumber: 202,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "nav-search-wrap",
                                ref: searchWrapRef,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                        onSubmit: handleSearchSubmit,
                                        style: {
                                            display: "flex",
                                            width: "100%"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "search",
                                                placeholder: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$ui$2d$bn$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["bn"].nav.searchPlaceholder,
                                                className: "nav-search",
                                                "aria-label": "Search products",
                                                value: searchQuery,
                                                onChange: (e)=>setSearchQuery(e.target.value),
                                                onFocus: ()=>setIsSearchFocused(true)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/layout/site-header.tsx",
                                                lineNumber: 218,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "submit",
                                                className: "nav-search-btn",
                                                "aria-label": __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$ui$2d$bn$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["bn"].nav.search,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SearchIcon, {}, void 0, false, {
                                                    fileName: "[project]/src/components/layout/site-header.tsx",
                                                    lineNumber: 228,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/layout/site-header.tsx",
                                                lineNumber: 227,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/layout/site-header.tsx",
                                        lineNumber: 217,
                                        columnNumber: 13
                                    }, this),
                                    isSearchFocused && searchQuery.trim() && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "nav-search-dropdown",
                                        children: searchResults.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "search-dropdown-list",
                                                    children: searchResults.map((p)=>{
                                                        const initials = p.name.slice(0, 2).toUpperCase();
                                                        const fallbackSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='48'%3E%3Crect width='40' height='48' rx='6' fill='%23e0f2fe'/%3E%3Ctext x='20' y='29' text-anchor='middle' font-family='sans-serif' font-size='12' font-weight='700' fill='%230284c7'%3E${encodeURIComponent(initials)}%3C/text%3E%3C/svg%3E`;
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                            href: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$product$2d$url$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["productPagePath"])(p.slug),
                                                            className: "search-dropdown-item",
                                                            onClick: ()=>{
                                                                setIsSearchFocused(false);
                                                                setSearchQuery("");
                                                            },
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                    src: p.imageUrl ?? fallbackSvg,
                                                                    alt: p.name,
                                                                    className: "search-dropdown-img",
                                                                    onError: (e)=>{
                                                                        e.target.src = fallbackSvg;
                                                                    }
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/layout/site-header.tsx",
                                                                    lineNumber: 251,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "search-dropdown-info",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "search-dropdown-name",
                                                                            children: p.name
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/layout/site-header.tsx",
                                                                            lineNumber: 258,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "search-dropdown-cat",
                                                                            children: p.category
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/layout/site-header.tsx",
                                                                            lineNumber: 259,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/layout/site-header.tsx",
                                                                    lineNumber: 257,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, p.id, true, {
                                                            fileName: "[project]/src/components/layout/site-header.tsx",
                                                            lineNumber: 242,
                                                            columnNumber: 27
                                                        }, this);
                                                    })
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/layout/site-header.tsx",
                                                    lineNumber: 237,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: "search-dropdown-footer",
                                                    onClick: (e)=>{
                                                        e.preventDefault();
                                                        setIsSearchFocused(false);
                                                        router.push(`/store?search=${encodeURIComponent(searchQuery.trim())}`);
                                                    },
                                                    children: [
                                                        'View all results for "',
                                                        searchQuery,
                                                        '" →'
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/layout/site-header.tsx",
                                                    lineNumber: 265,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "search-dropdown-empty",
                                            children: [
                                                'No products found for "',
                                                searchQuery,
                                                '"'
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/layout/site-header.tsx",
                                            lineNumber: 277,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/layout/site-header.tsx",
                                        lineNumber: 234,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/layout/site-header.tsx",
                                lineNumber: 216,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "header-icons",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        className: `icon-nav-btn${pathname === "/wishlist" ? " active" : ""}`,
                                        href: "/wishlist",
                                        "aria-label": `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$ui$2d$bn$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["bn"].nav.wishlist}${mounted && wishlistCount > 0 ? ` (${wishlistCount})` : ""}`,
                                        title: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$ui$2d$bn$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["bn"].nav.wishlist,
                                        onClick: scrollToTopAfterNav,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(HeartIcon, {}, void 0, false, {
                                                fileName: "[project]/src/components/layout/site-header.tsx",
                                                lineNumber: 293,
                                                columnNumber: 15
                                            }, this),
                                            mounted && wishlistCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "cart-badge",
                                                children: wishlistCount
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/layout/site-header.tsx",
                                                lineNumber: 295,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/layout/site-header.tsx",
                                        lineNumber: 286,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        className: "icon-nav-btn",
                                        "data-cart-icon": "true",
                                        href: "/cart",
                                        "aria-label": __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$ui$2d$bn$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["bn"].nav.cart,
                                        title: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$ui$2d$bn$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["bn"].nav.cart} (${mounted ? itemCount : 0})`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CartIcon, {}, void 0, false, {
                                                fileName: "[project]/src/components/layout/site-header.tsx",
                                                lineNumber: 299,
                                                columnNumber: 15
                                            }, this),
                                            mounted && itemCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "cart-badge",
                                                children: itemCount
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/layout/site-header.tsx",
                                                lineNumber: 301,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/layout/site-header.tsx",
                                        lineNumber: 298,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/layout/site-header.tsx",
                                lineNumber: 285,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/layout/site-header.tsx",
                        lineNumber: 201,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                        className: "header-nav-links",
                        "aria-label": "Main navigation",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "header-nav-links-inner",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/#/",
                                    className: navClass(onHomePage),
                                    onClick: clickHomeOrLogo,
                                    children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$ui$2d$bn$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["bn"].nav.home
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/site-header.tsx",
                                    lineNumber: 310,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/store",
                                    className: navClass(onStorePage && !activeCategory),
                                    onClick: scrollToTopAfterNav,
                                    children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$ui$2d$bn$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["bn"].nav.shop
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/site-header.tsx",
                                    lineNumber: 313,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/store?category=Salwar+Kameez",
                                    className: navClass(onStorePage && activeCategory === "Salwar Kameez"),
                                    onClick: scrollToTopAfterNav,
                                    children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$ui$2d$bn$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["bn"].categories["Salwar Kameez"]
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/site-header.tsx",
                                    lineNumber: 316,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/store?category=Two+Pieces",
                                    className: navClass(onStorePage && activeCategory === "Two Pieces"),
                                    onClick: scrollToTopAfterNav,
                                    children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$ui$2d$bn$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["bn"].categories["Two Pieces"]
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/site-header.tsx",
                                    lineNumber: 323,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/store?category=Three+Pieces",
                                    className: navClass(onStorePage && activeCategory === "Three Pieces"),
                                    onClick: scrollToTopAfterNav,
                                    children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$ui$2d$bn$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["bn"].categories["Three Pieces"]
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/site-header.tsx",
                                    lineNumber: 330,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/store?category=Frogs",
                                    className: navClass(onStorePage && activeCategory === "Frogs"),
                                    onClick: scrollToTopAfterNav,
                                    children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$ui$2d$bn$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["bn"].categories.Frogs
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/site-header.tsx",
                                    lineNumber: 337,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/store?category=Gown",
                                    className: navClass(onStorePage && activeCategory === "Gown"),
                                    onClick: scrollToTopAfterNav,
                                    children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$ui$2d$bn$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["bn"].categories.Gown
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/site-header.tsx",
                                    lineNumber: 344,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/store?category=Plazo",
                                    className: navClass(onStorePage && activeCategory === "Plazo"),
                                    onClick: scrollToTopAfterNav,
                                    children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$ui$2d$bn$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["bn"].categories.Plazo
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/site-header.tsx",
                                    lineNumber: 351,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/store?category=Tops",
                                    className: navClass(onStorePage && activeCategory === "Tops"),
                                    onClick: scrollToTopAfterNav,
                                    children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$ui$2d$bn$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["bn"].categories.Tops
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/site-header.tsx",
                                    lineNumber: 358,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/contact",
                                    className: navClass(pathname === "/contact"),
                                    onClick: scrollToTopAfterNav,
                                    children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$ui$2d$bn$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["bn"].nav.contact
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/site-header.tsx",
                                    lineNumber: 365,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/layout/site-header.tsx",
                            lineNumber: 309,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/site-header.tsx",
                        lineNumber: 308,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/layout/site-header.tsx",
                lineNumber: 200,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/layout/site-header.tsx",
        lineNumber: 173,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/layout/footer-developer-credit.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FooterDeveloperCredit",
    ()=>FooterDeveloperCredit
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
;
const MAHIN_PROFILE_REMOTE = "https://mahinahmad.com/profile.jpg";
const PORTRAIT_FALLBACK = "/credits/mahin-ahmad-profile.svg";
function FooterDeveloperCredit() {
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])() ?? "";
    const [src, setSrc] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(MAHIN_PROFILE_REMOTE);
    if (pathname.startsWith("/admin")) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "footer-dev-inline",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "footer-dev-label",
                children: "Developed by"
            }, void 0, false, {
                fileName: "[project]/src/components/layout/footer-developer-credit.tsx",
                lineNumber: 19,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                href: "https://mahinahmad.com",
                target: "_blank",
                rel: "noopener noreferrer",
                className: "footer-dev-link-row",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "footer-dev-copy",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "footer-dev-name-sm",
                                children: "Mahin Ahmad"
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/footer-developer-credit.tsx",
                                lineNumber: 27,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "footer-dev-domain",
                                children: "mahinahmad.com"
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/footer-developer-credit.tsx",
                                lineNumber: 28,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/layout/footer-developer-credit.tsx",
                        lineNumber: 26,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                        src: src,
                        alt: "Mahin Ahmad",
                        width: 40,
                        height: 40,
                        className: "footer-dev-photo",
                        loading: "lazy",
                        decoding: "async",
                        onError: ()=>{
                            setSrc((current)=>current === PORTRAIT_FALLBACK ? current : PORTRAIT_FALLBACK);
                        }
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/footer-developer-credit.tsx",
                        lineNumber: 30,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/layout/footer-developer-credit.tsx",
                lineNumber: 20,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/layout/footer-developer-credit.tsx",
        lineNumber: 18,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/shop/whatsapp-button.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FloatingCartButton",
    ()=>FloatingCartButton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$cart$2d$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/cart-provider.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
function FloatingCartButton() {
    const { itemCount } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$cart$2d$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCart"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
        href: "/cart",
        className: "whatsapp-float",
        "aria-label": `Open cart${itemCount > 0 ? ` (${itemCount})` : ""}`,
        title: `Cart${itemCount > 0 ? ` (${itemCount})` : ""}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                width: "28",
                height: "28",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                xmlns: "http://www.w3.org/2000/svg",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "9",
                        cy: "21",
                        r: "1"
                    }, void 0, false, {
                        fileName: "[project]/src/components/shop/whatsapp-button.tsx",
                        lineNumber: 27,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "20",
                        cy: "21",
                        r: "1"
                    }, void 0, false, {
                        fileName: "[project]/src/components/shop/whatsapp-button.tsx",
                        lineNumber: 28,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M1 1h4l2.7 12.5a2 2 0 0 0 2 1.6h9.5a2 2 0 0 0 2-1.6L23 6H6"
                    }, void 0, false, {
                        fileName: "[project]/src/components/shop/whatsapp-button.tsx",
                        lineNumber: 29,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/shop/whatsapp-button.tsx",
                lineNumber: 16,
                columnNumber: 7
            }, this),
            itemCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "cart-badge",
                children: itemCount
            }, void 0, false, {
                fileName: "[project]/src/components/shop/whatsapp-button.tsx",
                lineNumber: 31,
                columnNumber: 25
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/shop/whatsapp-button.tsx",
        lineNumber: 10,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/catalog-prefetch.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CatalogPrefetch",
    ()=>CatalogPrefetch
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$product$2d$catalog$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/product-catalog-client.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
function CatalogPrefetch() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])() ?? "";
    const isProductPage = pathname.startsWith("/product/");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (isProductPage) {
            void (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$product$2d$catalog$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deferCatalogRefresh"])().catch(()=>{});
        } else {
            void (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$product$2d$catalog$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getProductsCatalog"])().catch(()=>{});
            router.prefetch("/store");
        }
        router.prefetch("/checkout");
    }, [
        router,
        isProductPage
    ]);
    return null;
}
}),
"[project]/src/components/analytics/deferred-meta-pixel.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DeferredMetaPixel",
    ()=>DeferredMetaPixel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/shared/lib/app-dynamic.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
;
"use client";
;
;
;
const pixelId = ("TURBOPACK compile-time value", "2043534303237926")?.trim();
const testEventCode = ("TURBOPACK compile-time value", "TEST30054")?.trim();
const validPixelId = pixelId && /^\d{10,20}$/.test(pixelId) ? pixelId : undefined;
const MetaFacebookPixel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(async ()=>{}, {
    loadableGenerated: {
        modules: [
            "[project]/src/components/analytics/meta-facebook-pixel.tsx [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false,
    loading: ()=>null
});
function DeferredMetaPixel() {
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])() ?? "";
    const isProductPage = pathname.startsWith("/product/");
    if (!validPixelId) return null;
    if (isProductPage) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(MetaFacebookPixel, {
            pixelId: validPixelId,
            testEventCode: testEventCode,
            strategy: "lazyOnload"
        }, void 0, false, {
            fileName: "[project]/src/components/analytics/deferred-meta-pixel.tsx",
            lineNumber: 23,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(MetaFacebookPixel, {
        pixelId: validPixelId,
        testEventCode: testEventCode,
        strategy: "afterInteractive"
    }, void 0, false, {
        fileName: "[project]/src/components/analytics/deferred-meta-pixel.tsx",
        lineNumber: 26,
        columnNumber: 10
    }, this);
}
}),
];

//# sourceMappingURL=src_13a0k9_._.js.map