module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/src/data/seed-products.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "seedProducts",
    ()=>seedProducts
]);
const seedProducts = [
    /* ── Salwar Kameez (salwar1) — 5 colors ─────────────────── */ {
        id: "p1",
        slug: "salwar-sequence-embroidery",
        name: "Salwar Set (Sequence Embroidery)",
        description: "New arrival with premium print, sequence embroidery + tassel finishing. Size: 34-48 (salwar free size). Full COD available.",
        price: 800,
        stock: 30,
        imageUrl: "/products/kurti/salwar1/yellow.jpeg",
        category: "Salwar Kameez",
        colors: [
            {
                id: "yellow",
                label: "Yellow",
                image: "/products/kurti/salwar1/yellow.jpeg"
            },
            {
                id: "blue",
                label: "Blue",
                image: "/products/kurti/salwar1/blue.jpeg"
            },
            {
                id: "olive",
                label: "Olive",
                image: "/products/kurti/salwar1/olive.jpeg"
            },
            {
                id: "orange",
                label: "Orange",
                image: "/products/kurti/salwar1/orange.jpeg"
            },
            {
                id: "purple",
                label: "Purple",
                image: "/products/kurti/salwar1/purple.jpeg"
            }
        ]
    },
    /* ── Salwar Kameez (salwar2) — 3 colors ─────────────────── */ {
        id: "p2",
        slug: "salwar-premium-cotton",
        name: "Printed Salwar Kameez",
        description: "Premium cotton quality with strong embroidery, color guarantee print, and white salwar. Size: 36-48.",
        price: 799,
        stock: 28,
        imageUrl: "/products/kurti/salwar2/green.jpeg",
        category: "Salwar Kameez",
        colors: [
            {
                id: "green",
                label: "Green",
                image: "/products/kurti/salwar2/green.jpeg"
            },
            {
                id: "deep_green",
                label: "Deep Green",
                image: "/products/kurti/salwar2/deep_green.jpeg"
            },
            {
                id: "yellow",
                label: "Yellow",
                image: "/products/kurti/salwar2/yellow.jpeg"
            }
        ]
    },
    /* ── Frogs (frog1) — 3 colors ───────────────────────────── */ {
        id: "p3",
        slug: "embroidered-frogs",
        name: "Designer Frogs",
        description: "Color guarantee print with clean sequence embroidery on neck. Gher 80+, long 45, sizes 36-48.",
        price: 649,
        stock: 35,
        imageUrl: "/products/kurti/frog1/magenda.jpeg",
        category: "Frogs",
        colors: [
            {
                id: "magenda",
                label: "Magenta",
                image: "/products/kurti/frog1/magenda.jpeg"
            },
            {
                id: "yellow",
                label: "Yellow",
                image: "/products/kurti/frog1/yellow.jpeg"
            },
            {
                id: "brown",
                label: "Brown",
                image: "/products/kurti/frog1/brown.jpeg"
            }
        ]
    },
    /* ── Two Pieces (salwar3) — 6 colors ────────────────────── */ {
        id: "p4",
        slug: "batik-print-two-piece",
        name: "Batik Print Two Piece",
        description: "রেডিমেড টু পিস। বাটিক প্রিন্ট। কালার গ্যারান্টি। বুকে,হাতে মিরর বসানো। সাইজ ৩৬-৩৮-৪০-৪২-৪৪-৪৬-৪৮।",
        price: 900,
        stock: 40,
        imageUrl: "/products/kurti/salwar3/blue.jpeg",
        category: "Two Pieces",
        sizes: [
            "36",
            "38",
            "40",
            "42",
            "44",
            "46",
            "48"
        ],
        colors: [
            {
                id: "blue",
                label: "Blue",
                image: "/products/kurti/salwar3/blue.jpeg"
            },
            {
                id: "green",
                label: "Green",
                image: "/products/kurti/salwar3/green.jpeg"
            },
            {
                id: "orange",
                label: "Orange",
                image: "/products/kurti/salwar3/orange.jpeg"
            },
            {
                id: "pink",
                label: "Pink",
                image: "/products/kurti/salwar3/pink.jpeg"
            },
            {
                id: "purple",
                label: "Purple",
                image: "/products/kurti/salwar3/purple.jpeg"
            },
            {
                id: "yellow",
                label: "Yellow",
                image: "/products/kurti/salwar3/yellow.jpeg"
            }
        ]
    },
    /* ── Two Pieces (new catalog images from products/kurti/two-piece) ─ */ {
        id: "p6",
        slug: "premium-cotton-two-piece",
        name: "Premium Cotton Two Piece",
        description: "স্টাইল ও কোয়ালিটির পারফেক্ট কম্বিনেশন। নিজস্ব ফ্যাক্টরিতে প্রস্তুত প্রিমিয়াম কটন ফেব্রিক্স, নিখুঁত সেলাই ও দীর্ঘস্থায়ী কালার। ১০০% ক্যাশ অন ডেলিভারি সুবিধা।",
        price: 990,
        stock: 32,
        imageUrl: "/products/kurti/two-piece/blue.jpeg",
        category: "Two Pieces",
        sizes: [
            "36",
            "38",
            "40",
            "42",
            "44",
            "46",
            "48"
        ],
        colors: [
            {
                id: "blue",
                label: "Blue",
                image: "/products/kurti/two-piece/blue.jpeg"
            },
            {
                id: "pink",
                label: "Pink",
                image: "/products/kurti/two-piece/pink.jpeg"
            }
        ]
    },
    /* ── Three Pieces — catalog images from products/kurti/three-piece ─ */ {
        id: "p7",
        slug: "pure-cotton-three-piece",
        name: "Pure Cotton Three Piece",
        description: "থ্রি পিস কটন ড্রেস সেট। ১০০% পিওর কটন কাপড়, কালার গ্যারান্টি, স্কিন প্রিন্ট ও সুন্দর ম্যানুয়াল এমব্রয়ডারি। অগ্রিম ছাড়াই ক্যাশ অন ডেলিভারি।",
        price: 1290,
        stock: 36,
        imageUrl: "/products/kurti/three-piece/purple.jpeg",
        category: "Three Pieces",
        sizes: [
            "36",
            "38",
            "40",
            "42",
            "44",
            "46"
        ],
        colors: [
            {
                id: "orange",
                label: "Orange",
                image: "/products/kurti/three-piece/Orange.jpeg"
            },
            {
                id: "olive",
                label: "Olive",
                image: "/products/kurti/three-piece/olive.jpeg"
            },
            {
                id: "pink",
                label: "Pink",
                image: "/products/kurti/three-piece/pink.jpeg"
            },
            {
                id: "purple",
                label: "Purple",
                image: "/products/kurti/three-piece/purple.jpeg"
            },
            {
                id: "red",
                label: "Red",
                image: "/products/kurti/three-piece/red.jpeg"
            }
        ]
    },
    /* ── Gown (gown1) — 6 colors ────────────────────────────── */ {
        id: "p5",
        slug: "cotton-gown-embroidery",
        name: "Cotton Gown One Piece",
        description: "রেডিমেড সুতি গাউন ওয়ান পিস। এমব্রয়ডারি +গ্লাস ওয়ার্ক। ঘের ১৪০+ ইঞ্চি। রঙ উঠবে না ধোয়ার পরে। বডি সাইজ ৩৬-৪৮।",
        price: 750,
        stock: 45,
        imageUrl: "/products/kurti/gown1/navy-blue.jpeg",
        category: "Gown",
        sizes: [
            "36",
            "38",
            "40",
            "42",
            "44",
            "46",
            "48"
        ],
        colors: [
            {
                id: "brown",
                label: "Brown",
                image: "/products/kurti/gown1/brown.jpeg"
            },
            {
                id: "light-blue",
                label: "Light Blue",
                image: "/products/kurti/gown1/light-blue.jpeg"
            },
            {
                id: "lime-green",
                label: "Lime Green",
                image: "/products/kurti/gown1/lime-green.jpeg"
            },
            {
                id: "navy-blue",
                label: "Navy Blue",
                image: "/products/kurti/gown1/navy-blue.jpeg"
            },
            {
                id: "olive-green",
                label: "Olive Green",
                image: "/products/kurti/gown1/olive-green.jpeg"
            },
            {
                id: "orange",
                label: "Orange",
                image: "/products/kurti/gown1/orange.jpeg"
            }
        ]
    },
    /* ── Gown (gawn2) — 4 colors ────────────────────────────── */ {
        id: "p9",
        slug: "trending-gown-mirror-print",
        name: "Trending Gown (Mirror Work)",
        description: "🔥 ২৫% ডিস্কাউন্টে এই সিজনের মোস্ট ট্রেন্ডিং গাউন। পরলেই লুক হবে একদম স্টার-লেভেল। বুকজুড়ে স্টাইলিশ মিরর ওয়ার্ক, ট্রেন্ডি প্রিন্ট — ক্লাসি + এলিগেন্ট ভাইব। ১০০% কালার গ্যারান্টি। সাইজ ৩৬–৪৮ (পারফেক্ট ফিট গ্যারান্টি)। সারা বাংলাদেশে ফুল ক্যাশ অন ডেলিভারি। WhatsApp: 01581708578। স্টক লিমিটেড — আজই অর্ডার কনফার্ম করুন!",
        price: 700,
        stock: 40,
        imageUrl: "/products/kurti/gawn2/blue.jpeg",
        category: "Gown",
        sizes: [
            "36",
            "38",
            "40",
            "42",
            "44",
            "46",
            "48"
        ],
        colors: [
            {
                id: "black",
                label: "Black",
                image: "/products/kurti/gawn2/black.jpeg"
            },
            {
                id: "blue",
                label: "Blue",
                image: "/products/kurti/gawn2/blue.jpeg"
            },
            {
                id: "red",
                label: "Red",
                image: "/products/kurti/gawn2/red.jpeg"
            },
            {
                id: "yellow",
                label: "Yellow",
                image: "/products/kurti/gawn2/yellow.jpeg"
            }
        ]
    },
    /* ── Plazo (plazo1) — 2 designs ───────────────────────────── */ {
        id: "p8",
        slug: "embroidered-plazo-comfort-fit",
        name: "Embroidered Plazo",
        description: "🔥 এমব্রয়ডারি প্লাজো — স্টাইল আর কমফোর্টের পারফেক্ট কম্বো। প্রিমিয়াম কোয়ালিটি ফ্যাব্রিক: নরম, হালকা ও আরামদায়ক। ফ্রি সাইজ (সবার জন্য পারফেক্ট ফিট)। লং সাইজ (Long Size): ৩৮, ৩৯, ৪০। আজকের স্পেশাল অফার: ২৫% ডিস্কাউন্ট। সারা বাংলাদেশে ফুল ক্যাশ অন ডেলিভারি। WhatsApp: 01581708578। স্টক লিমিটেড!",
        price: 450,
        stock: 50,
        imageUrl: "/products/plazo/plazo1/img1.jpeg",
        category: "Plazo",
        sizes: [
            "38",
            "39",
            "40"
        ],
        colors: [
            {
                id: "design-1",
                label: "Design 1",
                image: "/products/plazo/plazo1/img1.jpeg"
            },
            {
                id: "design-2",
                label: "Design 2",
                image: "/products/plazo/plazo1/img2.jpeg"
            }
        ]
    }
];
}),
"[project]/src/components/cart-provider.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CartProvider",
    ()=>CartProvider,
    "useCart",
    ()=>useCart
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$seed$2d$products$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/seed-products.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
const CartContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(null);
function CartProvider({ children }) {
    const [items, setItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    function makeItemKey(productId, selectedColor, selectedSize) {
        return `${productId}::${selectedColor ?? "-"}::${selectedSize ?? "-"}`;
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const raw = localStorage.getItem("cartItems");
        if (!raw) return;
        try {
            const parsed = JSON.parse(raw);
            // Hydrate imageUrl for items saved before the field was added
            const hydrated = parsed.map((item)=>{
                const normalizedColor = item.selectedColor ?? undefined;
                const normalizedSize = item.selectedSize ?? undefined;
                const hydratedKey = item.key ?? makeItemKey(item.productId, normalizedColor, normalizedSize);
                if (item.imageUrl) {
                    return {
                        ...item,
                        key: hydratedKey,
                        selectedColor: normalizedColor,
                        selectedSize: normalizedSize
                    };
                }
                const seed = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$seed$2d$products$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["seedProducts"].find((p)=>p.id === item.productId);
                if (seed) {
                    return {
                        ...item,
                        key: hydratedKey,
                        selectedColor: normalizedColor,
                        selectedSize: normalizedSize,
                        imageUrl: seed.imageUrl
                    };
                }
                return {
                    ...item,
                    key: hydratedKey,
                    selectedColor: normalizedColor,
                    selectedSize: normalizedSize
                };
            });
            setItems(hydrated);
        } catch  {
            setItems([]);
        }
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        localStorage.setItem("cartItems", JSON.stringify(items));
    }, [
        items
    ]);
    const addToCart = (product, opts)=>{
        const selectedColor = opts?.selectedColor?.trim() || undefined;
        const selectedSize = opts?.selectedSize?.trim() || undefined;
        const itemKey = makeItemKey(product.id, selectedColor, selectedSize);
        setItems((prev)=>{
            const existing = prev.find((item)=>item.key === itemKey);
            if (existing) {
                return prev.map((item)=>item.key === itemKey ? {
                        ...item,
                        quantity: item.quantity + 1
                    } : item);
            }
            return [
                ...prev,
                {
                    key: itemKey,
                    productId: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: 1,
                    imageUrl: product.imageUrl,
                    selectedColor,
                    selectedSize
                }
            ];
        });
    };
    const buyNow = (product, opts)=>{
        const selectedColor = opts?.selectedColor?.trim() || undefined;
        const selectedSize = opts?.selectedSize?.trim() || undefined;
        setItems([
            {
                key: makeItemKey(product.id, selectedColor, selectedSize),
                productId: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
                imageUrl: product.imageUrl,
                selectedColor,
                selectedSize
            }
        ]);
    };
    const increaseQty = (itemKey)=>{
        setItems((prev)=>prev.map((item)=>item.key === itemKey ? {
                    ...item,
                    quantity: item.quantity + 1
                } : item));
    };
    const decreaseQty = (itemKey)=>{
        setItems((prev)=>prev.map((item)=>item.key === itemKey ? {
                    ...item,
                    quantity: item.quantity - 1
                } : item).filter((item)=>item.quantity > 0));
    };
    const removeItem = (itemKey)=>{
        setItems((prev)=>prev.filter((item)=>item.key !== itemKey));
    };
    const clearCart = ()=>setItems([]);
    const itemCount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>items.reduce((sum, item)=>sum + item.quantity, 0), [
        items
    ]);
    const subtotal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>items.reduce((sum, item)=>sum + item.price * item.quantity, 0), [
        items
    ]);
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>({
            items,
            addToCart,
            buyNow,
            increaseQty,
            decreaseQty,
            removeItem,
            clearCart,
            itemCount,
            subtotal
        }), [
        items,
        itemCount,
        subtotal
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CartContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/cart-provider.tsx",
        lineNumber: 185,
        columnNumber: 10
    }, this);
}
function useCart() {
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(CartContext);
    if (!ctx) {
        throw new Error("useCart must be used within CartProvider");
    }
    return ctx;
}
}),
"[project]/src/components/wishlist-provider.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WishlistProvider",
    ()=>WishlistProvider,
    "useWishlist",
    ()=>useWishlist,
    "wishlistKey",
    ()=>wishlistKey
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
const STORAGE_KEY = "wishlistItems";
function wishlistKey(productId, colorId) {
    return `${productId}::${colorId ?? "default"}`;
}
const WishlistContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(null);
function WishlistProvider({ children }) {
    const [items, setItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return;
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) setItems(parsed);
        } catch  {
            setItems([]);
        }
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }, [
        items
    ]);
    const isWishlisted = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((productId, colorId)=>items.some((i)=>i.key === wishlistKey(productId, colorId)), [
        items
    ]);
    const toggleWishlist = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((payload)=>{
        const key = wishlistKey(payload.productId, payload.colorId);
        setItems((prev)=>{
            const exists = prev.some((i)=>i.key === key);
            if (exists) return prev.filter((i)=>i.key !== key);
            const row = {
                key,
                productId: payload.productId,
                slug: payload.slug,
                name: payload.name,
                price: payload.price,
                imageUrl: payload.imageUrl,
                category: payload.category,
                colorId: payload.colorId
            };
            return [
                ...prev,
                row
            ];
        });
    }, []);
    const removeFromWishlist = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((key)=>{
        setItems((prev)=>prev.filter((i)=>i.key !== key));
    }, []);
    const clearWishlist = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>setItems([]), []);
    const count = items.length;
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>({
            items,
            count,
            isWishlisted,
            toggleWishlist,
            removeFromWishlist,
            clearWishlist
        }), [
        items,
        count,
        isWishlisted,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(WishlistContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/wishlist-provider.tsx",
        lineNumber: 105,
        columnNumber: 10
    }, this);
}
function useWishlist() {
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(WishlistContext);
    if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
    return ctx;
}
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/dynamic-access-async-storage.external.js [external] (next/dist/server/app-render/dynamic-access-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/dynamic-access-async-storage.external.js", () => require("next/dist/server/app-render/dynamic-access-async-storage.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__04.d_lb._.js.map