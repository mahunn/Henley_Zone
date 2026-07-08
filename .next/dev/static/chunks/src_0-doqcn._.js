(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/lib/product-catalog-client.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$seed$2d$products$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/seed-products.ts [app-client] (ecmascript)");
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
            if ("TURBOPACK compile-time truthy", 1) {
                window.dispatchEvent(new CustomEvent("hz:catalog-updated"));
            }
        }
        return memoryCache ?? [
            ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$seed$2d$products$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["seedProducts"]
        ];
    });
}
function getProductsCatalog() {
    if (memoryCache) return Promise.resolve(memoryCache);
    memoryCache = [
        ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$seed$2d$products$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["seedProducts"]
    ];
    if (!inflight) {
        inflight = refreshCatalogFromApi().catch(()=>memoryCache ?? [
                ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$seed$2d$products$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["seedProducts"]
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
    if (memoryCache && memoryCache !== __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$seed$2d$products$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["seedProducts"]) {
        return Promise.resolve(memoryCache);
    }
    memoryCache = [
        ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$seed$2d$products$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["seedProducts"]
    ];
    return new Promise((resolve)=>{
        const run = ()=>{
            void getProductsCatalog().then(resolve);
        };
        if (("TURBOPACK compile-time value", "object") !== "undefined" && "requestIdleCallback" in window) {
            window.requestIdleCallback(run, {
                timeout: 2500
            });
        } else {
            setTimeout(run, 800);
        }
    });
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/admin/admin-products-workspace-nav.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AdminProductsWorkspaceNav",
    ()=>AdminProductsWorkspaceNav
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
function AdminProductsWorkspaceNav() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])() ?? "";
    const value = pathname.includes("/admin/products/manage") ? "/admin/products/manage" : "/admin/products";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            marginBottom: 20
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
            style: {
                display: "flex",
                flexDirection: "column",
                gap: 6,
                maxWidth: 400
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    style: {
                        fontWeight: 600
                    },
                    children: "Products workspace"
                }, void 0, false, {
                    fileName: "[project]/src/components/admin/admin-products-workspace-nav.tsx",
                    lineNumber: 13,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                    className: "nav-search",
                    value: value,
                    onChange: (e)=>{
                        router.push(e.target.value);
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                            value: "/admin/products",
                            children: "Add new product"
                        }, void 0, false, {
                            fileName: "[project]/src/components/admin/admin-products-workspace-nav.tsx",
                            lineNumber: 21,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                            value: "/admin/products/manage",
                            children: "Manage catalog (edit / remove)"
                        }, void 0, false, {
                            fileName: "[project]/src/components/admin/admin-products-workspace-nav.tsx",
                            lineNumber: 22,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/admin/admin-products-workspace-nav.tsx",
                    lineNumber: 14,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/admin/admin-products-workspace-nav.tsx",
            lineNumber: 12,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/admin/admin-products-workspace-nav.tsx",
        lineNumber: 11,
        columnNumber: 5
    }, this);
}
_s(AdminProductsWorkspaceNav, "HcKSRNA6OHO0YXStsqr+Rueb9bE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = AdminProductsWorkspaceNav;
var _c;
__turbopack_context__.k.register(_c, "AdminProductsWorkspaceNav");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/admin/admin-icon-button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AdminIconButton",
    ()=>AdminIconButton,
    "AdminIconLink",
    ()=>AdminIconLink,
    "AdminIconToolbar",
    ()=>AdminIconToolbar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
"use client";
;
;
function variantClass(variant) {
    return `admin-icon-btn admin-icon-btn--${variant}`;
}
function sizeClass(size) {
    return size === "lg" ? "admin-icon-btn--lg" : "";
}
function AdminIconButton({ label, variant = "ghost", children, className = "", size = "md", disabled, href, external, type = "button", ...rest }) {
    const classes = [
        variantClass(variant),
        sizeClass(size),
        className
    ].filter(Boolean).join(" ");
    if (href) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
            href: href,
            className: classes,
            title: label,
            "aria-label": label,
            target: external ? "_blank" : undefined,
            rel: external ? "noopener noreferrer" : undefined,
            "aria-disabled": disabled || undefined,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "admin-icon-btn__glyph",
                children: children
            }, void 0, false, {
                fileName: "[project]/src/components/admin/admin-icon-button.tsx",
                lineNumber: 67,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/admin/admin-icon-button.tsx",
            lineNumber: 58,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: type,
        className: classes,
        title: label,
        "aria-label": label,
        disabled: disabled,
        ...rest,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "admin-icon-btn__glyph",
            children: children
        }, void 0, false, {
            fileName: "[project]/src/components/admin/admin-icon-button.tsx",
            lineNumber: 81,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/admin/admin-icon-button.tsx",
        lineNumber: 73,
        columnNumber: 5
    }, this);
}
_c = AdminIconButton;
function AdminIconLink({ label, variant = "ghost", children, className = "", size = "md", href }) {
    const classes = [
        variantClass(variant),
        sizeClass(size),
        className
    ].filter(Boolean).join(" ");
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        href: href,
        className: classes,
        title: label,
        "aria-label": label,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "admin-icon-btn__glyph",
            children: children
        }, void 0, false, {
            fileName: "[project]/src/components/admin/admin-icon-button.tsx",
            lineNumber: 98,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/admin/admin-icon-button.tsx",
        lineNumber: 97,
        columnNumber: 5
    }, this);
}
_c1 = AdminIconLink;
function AdminIconToolbar({ children, className = "" }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `admin-icon-toolbar ${className}`.trim(),
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/admin/admin-icon-button.tsx",
        lineNumber: 105,
        columnNumber: 10
    }, this);
}
_c2 = AdminIconToolbar;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "AdminIconButton");
__turbopack_context__.k.register(_c1, "AdminIconLink");
__turbopack_context__.k.register(_c2, "AdminIconToolbar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/admin/admin-icons.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "IconCheck",
    ()=>IconCheck,
    "IconClipboardList",
    ()=>IconClipboardList,
    "IconCopy",
    ()=>IconCopy,
    "IconCopyAll",
    ()=>IconCopyAll,
    "IconEdit",
    ()=>IconEdit,
    "IconHome",
    ()=>IconHome,
    "IconLogout",
    ()=>IconLogout,
    "IconPackage",
    ()=>IconPackage,
    "IconPhone",
    ()=>IconPhone,
    "IconPlus",
    ()=>IconPlus,
    "IconSave",
    ()=>IconSave,
    "IconSpinner",
    ()=>IconSpinner,
    "IconTrash",
    ()=>IconTrash,
    "IconUndo",
    ()=>IconUndo,
    "IconUpload",
    ()=>IconUpload,
    "IconUsers",
    ()=>IconUsers,
    "IconWhatsapp",
    ()=>IconWhatsapp,
    "IconX",
    ()=>IconX
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
const defaults = {
    size: 20
};
function IconCopy({ size = defaults.size }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        "aria-hidden": true,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: "9",
                y: "9",
                width: "13",
                height: "13",
                rx: "2"
            }, void 0, false, {
                fileName: "[project]/src/components/admin/admin-icons.tsx",
                lineNumber: 8,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
            }, void 0, false, {
                fileName: "[project]/src/components/admin/admin-icons.tsx",
                lineNumber: 9,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/admin/admin-icons.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
_c = IconCopy;
function IconCopyAll({ size = defaults.size }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        "aria-hidden": true,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: "8",
                y: "8",
                width: "12",
                height: "12",
                rx: "2"
            }, void 0, false, {
                fileName: "[project]/src/components/admin/admin-icons.tsx",
                lineNumber: 17,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M4 16c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2"
            }, void 0, false, {
                fileName: "[project]/src/components/admin/admin-icons.tsx",
                lineNumber: 18,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: "12",
                y: "12",
                width: "12",
                height: "12",
                rx: "2"
            }, void 0, false, {
                fileName: "[project]/src/components/admin/admin-icons.tsx",
                lineNumber: 19,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/admin/admin-icons.tsx",
        lineNumber: 16,
        columnNumber: 5
    }, this);
}
_c1 = IconCopyAll;
function IconLogout({ size = defaults.size }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        "aria-hidden": true,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
            }, void 0, false, {
                fileName: "[project]/src/components/admin/admin-icons.tsx",
                lineNumber: 27,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                points: "16 17 21 12 16 7"
            }, void 0, false, {
                fileName: "[project]/src/components/admin/admin-icons.tsx",
                lineNumber: 28,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "21",
                y1: "12",
                x2: "9",
                y2: "12"
            }, void 0, false, {
                fileName: "[project]/src/components/admin/admin-icons.tsx",
                lineNumber: 29,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/admin/admin-icons.tsx",
        lineNumber: 26,
        columnNumber: 5
    }, this);
}
_c2 = IconLogout;
function IconTrash({ size = defaults.size }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        "aria-hidden": true,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                points: "3 6 5 6 21 6"
            }, void 0, false, {
                fileName: "[project]/src/components/admin/admin-icons.tsx",
                lineNumber: 37,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
            }, void 0, false, {
                fileName: "[project]/src/components/admin/admin-icons.tsx",
                lineNumber: 38,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "10",
                y1: "11",
                x2: "10",
                y2: "17"
            }, void 0, false, {
                fileName: "[project]/src/components/admin/admin-icons.tsx",
                lineNumber: 39,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "14",
                y1: "11",
                x2: "14",
                y2: "17"
            }, void 0, false, {
                fileName: "[project]/src/components/admin/admin-icons.tsx",
                lineNumber: 40,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/admin/admin-icons.tsx",
        lineNumber: 36,
        columnNumber: 5
    }, this);
}
_c3 = IconTrash;
function IconUndo({ size = defaults.size }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        "aria-hidden": true,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M3 7v6h6"
            }, void 0, false, {
                fileName: "[project]/src/components/admin/admin-icons.tsx",
                lineNumber: 48,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6.69 3.01L3 13"
            }, void 0, false, {
                fileName: "[project]/src/components/admin/admin-icons.tsx",
                lineNumber: 49,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/admin/admin-icons.tsx",
        lineNumber: 47,
        columnNumber: 5
    }, this);
}
_c4 = IconUndo;
function IconPhone({ size = defaults.size }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        "aria-hidden": true,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"
        }, void 0, false, {
            fileName: "[project]/src/components/admin/admin-icons.tsx",
            lineNumber: 57,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/admin/admin-icons.tsx",
        lineNumber: 56,
        columnNumber: 5
    }, this);
}
_c5 = IconPhone;
function IconWhatsapp({ size = defaults.size }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "currentColor",
        "aria-hidden": true,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"
        }, void 0, false, {
            fileName: "[project]/src/components/admin/admin-icons.tsx",
            lineNumber: 65,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/admin/admin-icons.tsx",
        lineNumber: 64,
        columnNumber: 5
    }, this);
}
_c6 = IconWhatsapp;
function IconEdit({ size = defaults.size }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        "aria-hidden": true,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
            }, void 0, false, {
                fileName: "[project]/src/components/admin/admin-icons.tsx",
                lineNumber: 73,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
            }, void 0, false, {
                fileName: "[project]/src/components/admin/admin-icons.tsx",
                lineNumber: 74,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/admin/admin-icons.tsx",
        lineNumber: 72,
        columnNumber: 5
    }, this);
}
_c7 = IconEdit;
function IconSave({ size = defaults.size }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        "aria-hidden": true,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"
            }, void 0, false, {
                fileName: "[project]/src/components/admin/admin-icons.tsx",
                lineNumber: 82,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                points: "17 21 17 13 7 13 7 21"
            }, void 0, false, {
                fileName: "[project]/src/components/admin/admin-icons.tsx",
                lineNumber: 83,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                points: "7 3 7 8 15 8"
            }, void 0, false, {
                fileName: "[project]/src/components/admin/admin-icons.tsx",
                lineNumber: 84,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/admin/admin-icons.tsx",
        lineNumber: 81,
        columnNumber: 5
    }, this);
}
_c8 = IconSave;
function IconCheck({ size = defaults.size }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2.5",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        "aria-hidden": true,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
            points: "20 6 9 17 4 12"
        }, void 0, false, {
            fileName: "[project]/src/components/admin/admin-icons.tsx",
            lineNumber: 92,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/admin/admin-icons.tsx",
        lineNumber: 91,
        columnNumber: 5
    }, this);
}
_c9 = IconCheck;
function IconX({ size = defaults.size }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        "aria-hidden": true,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "18",
                y1: "6",
                x2: "6",
                y2: "18"
            }, void 0, false, {
                fileName: "[project]/src/components/admin/admin-icons.tsx",
                lineNumber: 100,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "6",
                y1: "6",
                x2: "18",
                y2: "18"
            }, void 0, false, {
                fileName: "[project]/src/components/admin/admin-icons.tsx",
                lineNumber: 101,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/admin/admin-icons.tsx",
        lineNumber: 99,
        columnNumber: 5
    }, this);
}
_c10 = IconX;
function IconPlus({ size = defaults.size }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        "aria-hidden": true,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "12",
                y1: "5",
                x2: "12",
                y2: "19"
            }, void 0, false, {
                fileName: "[project]/src/components/admin/admin-icons.tsx",
                lineNumber: 109,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "5",
                y1: "12",
                x2: "19",
                y2: "12"
            }, void 0, false, {
                fileName: "[project]/src/components/admin/admin-icons.tsx",
                lineNumber: 110,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/admin/admin-icons.tsx",
        lineNumber: 108,
        columnNumber: 5
    }, this);
}
_c11 = IconPlus;
function IconPackage({ size = defaults.size }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        "aria-hidden": true,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "16.5",
                y1: "9.4",
                x2: "7.5",
                y2: "4.21"
            }, void 0, false, {
                fileName: "[project]/src/components/admin/admin-icons.tsx",
                lineNumber: 118,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
            }, void 0, false, {
                fileName: "[project]/src/components/admin/admin-icons.tsx",
                lineNumber: 119,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                points: "3.27 6.96 12 12.01 20.73 6.96"
            }, void 0, false, {
                fileName: "[project]/src/components/admin/admin-icons.tsx",
                lineNumber: 120,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "12",
                y1: "22.08",
                x2: "12",
                y2: "12"
            }, void 0, false, {
                fileName: "[project]/src/components/admin/admin-icons.tsx",
                lineNumber: 121,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/admin/admin-icons.tsx",
        lineNumber: 117,
        columnNumber: 5
    }, this);
}
_c12 = IconPackage;
function IconClipboardList({ size = defaults.size }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        "aria-hidden": true,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"
            }, void 0, false, {
                fileName: "[project]/src/components/admin/admin-icons.tsx",
                lineNumber: 129,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: "8",
                y: "2",
                width: "8",
                height: "4",
                rx: "1"
            }, void 0, false, {
                fileName: "[project]/src/components/admin/admin-icons.tsx",
                lineNumber: 130,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "9",
                y1: "12",
                x2: "15",
                y2: "12"
            }, void 0, false, {
                fileName: "[project]/src/components/admin/admin-icons.tsx",
                lineNumber: 131,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "9",
                y1: "16",
                x2: "13",
                y2: "16"
            }, void 0, false, {
                fileName: "[project]/src/components/admin/admin-icons.tsx",
                lineNumber: 132,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/admin/admin-icons.tsx",
        lineNumber: 128,
        columnNumber: 5
    }, this);
}
_c13 = IconClipboardList;
function IconHome({ size = defaults.size }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        "aria-hidden": true,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
            }, void 0, false, {
                fileName: "[project]/src/components/admin/admin-icons.tsx",
                lineNumber: 140,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                points: "9 22 9 12 15 12 15 22"
            }, void 0, false, {
                fileName: "[project]/src/components/admin/admin-icons.tsx",
                lineNumber: 141,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/admin/admin-icons.tsx",
        lineNumber: 139,
        columnNumber: 5
    }, this);
}
_c14 = IconHome;
function IconUpload({ size = defaults.size }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        "aria-hidden": true,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
            }, void 0, false, {
                fileName: "[project]/src/components/admin/admin-icons.tsx",
                lineNumber: 149,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                points: "17 8 12 3 7 8"
            }, void 0, false, {
                fileName: "[project]/src/components/admin/admin-icons.tsx",
                lineNumber: 150,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "12",
                y1: "3",
                x2: "12",
                y2: "15"
            }, void 0, false, {
                fileName: "[project]/src/components/admin/admin-icons.tsx",
                lineNumber: 151,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/admin/admin-icons.tsx",
        lineNumber: 148,
        columnNumber: 5
    }, this);
}
_c15 = IconUpload;
function IconSpinner({ size = defaults.size }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        className: "admin-icon-spin",
        "aria-hidden": true,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M12 2v4"
            }, void 0, false, {
                fileName: "[project]/src/components/admin/admin-icons.tsx",
                lineNumber: 168,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M12 18v4",
                opacity: "0.3"
            }, void 0, false, {
                fileName: "[project]/src/components/admin/admin-icons.tsx",
                lineNumber: 169,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M4.93 4.93l2.83 2.83",
                opacity: "0.5"
            }, void 0, false, {
                fileName: "[project]/src/components/admin/admin-icons.tsx",
                lineNumber: 170,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M16.24 16.24l2.83 2.83",
                opacity: "0.7"
            }, void 0, false, {
                fileName: "[project]/src/components/admin/admin-icons.tsx",
                lineNumber: 171,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M2 12h4",
                opacity: "0.9"
            }, void 0, false, {
                fileName: "[project]/src/components/admin/admin-icons.tsx",
                lineNumber: 172,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M18 12h4"
            }, void 0, false, {
                fileName: "[project]/src/components/admin/admin-icons.tsx",
                lineNumber: 173,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/admin/admin-icons.tsx",
        lineNumber: 158,
        columnNumber: 5
    }, this);
}
_c16 = IconSpinner;
function IconUsers({ size = defaults.size }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        "aria-hidden": true,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
            }, void 0, false, {
                fileName: "[project]/src/components/admin/admin-icons.tsx",
                lineNumber: 181,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "9",
                cy: "7",
                r: "4"
            }, void 0, false, {
                fileName: "[project]/src/components/admin/admin-icons.tsx",
                lineNumber: 182,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M23 21v-2a4 4 0 0 0-3-3.87"
            }, void 0, false, {
                fileName: "[project]/src/components/admin/admin-icons.tsx",
                lineNumber: 183,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M16 3.13a4 4 0 0 1 0 7.75"
            }, void 0, false, {
                fileName: "[project]/src/components/admin/admin-icons.tsx",
                lineNumber: 184,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/admin/admin-icons.tsx",
        lineNumber: 180,
        columnNumber: 5
    }, this);
}
_c17 = IconUsers;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10, _c11, _c12, _c13, _c14, _c15, _c16, _c17;
__turbopack_context__.k.register(_c, "IconCopy");
__turbopack_context__.k.register(_c1, "IconCopyAll");
__turbopack_context__.k.register(_c2, "IconLogout");
__turbopack_context__.k.register(_c3, "IconTrash");
__turbopack_context__.k.register(_c4, "IconUndo");
__turbopack_context__.k.register(_c5, "IconPhone");
__turbopack_context__.k.register(_c6, "IconWhatsapp");
__turbopack_context__.k.register(_c7, "IconEdit");
__turbopack_context__.k.register(_c8, "IconSave");
__turbopack_context__.k.register(_c9, "IconCheck");
__turbopack_context__.k.register(_c10, "IconX");
__turbopack_context__.k.register(_c11, "IconPlus");
__turbopack_context__.k.register(_c12, "IconPackage");
__turbopack_context__.k.register(_c13, "IconClipboardList");
__turbopack_context__.k.register(_c14, "IconHome");
__turbopack_context__.k.register(_c15, "IconUpload");
__turbopack_context__.k.register(_c16, "IconSpinner");
__turbopack_context__.k.register(_c17, "IconUsers");
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
"[project]/src/config/ui-bn.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/admin/products/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AdminProductsPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$product$2d$catalog$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/product-catalog-client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$admin$2d$products$2d$workspace$2d$nav$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/admin/admin-products-workspace-nav.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$admin$2d$icon$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/admin/admin-icon-button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$admin$2d$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/admin/admin-icons.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$categories$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/categories.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$ui$2d$bn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/config/ui-bn.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
const AVAILABLE_SIZES = [
    "32",
    "34",
    "36",
    "38",
    "40",
    "42",
    "44",
    "46",
    "48"
];
function AdminProductsPage() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [authorized, setAuthorized] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [existingCategories, setExistingCategories] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [allProducts, setAllProducts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loadErr, setLoadErr] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [name, setName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [description, setDescription] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [price, setPrice] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [stock, setStock] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("20");
    const [imageUrl, setImageUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [category, setCategory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [selectedSizes, setSelectedSizes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [colorImages, setColorImages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [submitting, setSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [uploadingPrimary, setUploadingPrimary] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [uploadingColorImages, setUploadingColorImages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    async function uploadImageFile(file) {
        if (!file) throw new Error("No file selected.");
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/admin/upload", {
            method: "POST",
            body: fd
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Upload failed");
        if (!data.url) throw new Error("No URL returned");
        return data.url;
    }
    const verify = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AdminProductsPage.useCallback[verify]": async ()=>{
            try {
                const res = await fetch("/api/admin/session", {
                    method: "GET",
                    cache: "no-store",
                    credentials: "include"
                });
                if (res.status === 401) {
                    router.replace("/login?type=admin");
                    return;
                }
                setAuthorized(res.ok);
            } catch  {
                setAuthorized(false);
            }
        }
    }["AdminProductsPage.useCallback[verify]"], [
        router
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AdminProductsPage.useEffect": ()=>{
            void verify();
        }
    }["AdminProductsPage.useEffect"], [
        verify
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AdminProductsPage.useEffect": ()=>{
            async function loadProductsAndCats() {
                try {
                    const res = await fetch("/api/products", {
                        cache: "no-store"
                    });
                    if (!res.ok) return;
                    const data = await res.json();
                    const products = data.products ?? [];
                    setAllProducts(products);
                    const cats = Array.from(new Set([
                        ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$categories$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["categories"].map({
                            "AdminProductsPage.useEffect.loadProductsAndCats.cats": (c)=>c.id
                        }["AdminProductsPage.useEffect.loadProductsAndCats.cats"]),
                        ...products.map({
                            "AdminProductsPage.useEffect.loadProductsAndCats.cats": (p)=>p.category
                        }["AdminProductsPage.useEffect.loadProductsAndCats.cats"])
                    ])).sort();
                    setExistingCategories(cats);
                    setLoadErr("");
                } catch  {
                    setLoadErr("Could not load categories.");
                }
            }
            if (authorized) void loadProductsAndCats();
        }
    }["AdminProductsPage.useEffect"], [
        authorized
    ]);
    async function reloadProductsAndCats() {
        const res = await fetch("/api/products", {
            cache: "no-store"
        });
        if (!res.ok) return;
        const data = await res.json();
        const products = data.products ?? [];
        setAllProducts(products);
        setExistingCategories(Array.from(new Set([
            ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$categories$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["categories"].map((c)=>c.id),
            ...products.map((p)=>p.category)
        ])).sort());
    }
    function toggleSize(size) {
        setSelectedSizes((prev)=>prev.includes(size) ? prev.filter((s)=>s !== size) : [
                ...prev,
                size
            ]);
    }
    function makeColorLabelFromFileName(fileName) {
        const base = fileName.replace(/\.[^/.]+$/, "");
        const cleaned = base.replace(/[-_]+/g, " ").trim();
        if (!cleaned) return "Color";
        return cleaned.split(/\s+/).map((w)=>w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
    }
    function updateColorImageRow(i, patch) {
        setColorImages((prev)=>prev.map((row, idx)=>idx === i ? {
                    ...row,
                    ...patch
                } : row));
    }
    function removeColorImageRow(i) {
        setColorImages((prev)=>prev.filter((_, idx)=>idx !== i));
    }
    async function onSubmit(e) {
        e.preventDefault();
        setMessage("");
        setError("");
        if (!category.trim()) {
            setError("Select one of the existing categories.");
            return;
        }
        const priceNum = Number(price);
        const stockNum = Number(stock);
        if (!Number.isFinite(priceNum) || priceNum < 0) {
            setError("Enter a valid price.");
            return;
        }
        if (!Number.isFinite(stockNum) || stockNum < 0) {
            setError("Enter a valid stock quantity.");
            return;
        }
        if (!imageUrl.trim()) {
            setError("Upload a primary image from your device.");
            return;
        }
        const sizes = selectedSizes;
        if (sizes.length === 0) {
            setError("Select at least one available size.");
            return;
        }
        const colorPayload = colorImages.map((row)=>({
                id: row.label.trim().toLowerCase().replace(/\s+/g, "_"),
                label: row.label.trim(),
                image: row.image.trim()
            })).filter((row)=>row.label && row.image);
        setSubmitting(true);
        try {
            const res = await fetch("/api/admin/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: name.trim(),
                    description: description.trim(),
                    price: priceNum,
                    stock: stockNum,
                    imageUrl: imageUrl.trim(),
                    category: category.trim(),
                    colors: colorPayload,
                    sizes
                })
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.message || "Save failed.");
                return;
            }
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$product$2d$catalog$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["invalidateProductCatalog"])();
            setMessage(`Product “${data.product?.name ?? name}” was created.`);
            setName("");
            setDescription("");
            setPrice("");
            setStock("20");
            setImageUrl("");
            setCategory("");
            setSelectedSizes([]);
            setColorImages([]);
            await reloadProductsAndCats();
        } catch  {
            setError("Network error while saving.");
        } finally{
            setSubmitting(false);
        }
    }
    if (authorized === null) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
            style: {
                maxWidth: 720,
                margin: "0 auto",
                padding: "40px 24px"
            },
            children: "Checking admin session…"
        }, void 0, false, {
            fileName: "[project]/src/app/admin/products/page.tsx",
            lineNumber: 205,
            columnNumber: 7
        }, this);
    }
    if (!authorized) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        style: {
            maxWidth: 720,
            margin: "0 auto",
            padding: "40px 24px"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                style: {
                    marginBottom: 16
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$admin$2d$icon$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AdminIconLink"], {
                    href: "/admin",
                    variant: "ghost",
                    label: "Admin home",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$admin$2d$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IconHome"], {}, void 0, false, {
                        fileName: "[project]/src/app/admin/products/page.tsx",
                        lineNumber: 219,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/admin/products/page.tsx",
                    lineNumber: 218,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/admin/products/page.tsx",
                lineNumber: 217,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$admin$2d$products$2d$workspace$2d$nav$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AdminProductsWorkspaceNav"], {}, void 0, false, {
                fileName: "[project]/src/app/admin/products/page.tsx",
                lineNumber: 223,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                style: {
                    marginBottom: 8,
                    fontFamily: "var(--font-heading, serif)"
                },
                children: "Add product"
            }, void 0, false, {
                fileName: "[project]/src/app/admin/products/page.tsx",
                lineNumber: 225,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                style: {
                    marginBottom: 24,
                    color: "var(--color-text-secondary)",
                    lineHeight: 1.55
                },
                children: [
                    "Add products under existing sections only (Two Pieces, Three Pieces, Salwar Kameez, etc). Upload images directly from device, paste full Bangla details, and keep the form simple for daily use. To edit or remove products, switch to ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                        children: "Manage catalog"
                    }, void 0, false, {
                        fileName: "[project]/src/app/admin/products/page.tsx",
                        lineNumber: 227,
                        columnNumber: 240
                    }, this),
                    " above."
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/admin/products/page.tsx",
                lineNumber: 226,
                columnNumber: 7
            }, this),
            loadErr && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "form-error",
                style: {
                    marginBottom: 16
                },
                children: loadErr
            }, void 0, false, {
                fileName: "[project]/src/app/admin/products/page.tsx",
                lineNumber: 230,
                columnNumber: 19
            }, this),
            message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                style: {
                    marginBottom: 16,
                    padding: "12px 14px",
                    background: "#ecfccb",
                    borderRadius: 8,
                    color: "#365314"
                },
                children: message
            }, void 0, false, {
                fileName: "[project]/src/app/admin/products/page.tsx",
                lineNumber: 232,
                columnNumber: 9
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "form-error",
                style: {
                    marginBottom: 16
                },
                children: error
            }, void 0, false, {
                fileName: "[project]/src/app/admin/products/page.tsx",
                lineNumber: 236,
                columnNumber: 17
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                onSubmit: onSubmit,
                style: {
                    display: "flex",
                    flexDirection: "column",
                    gap: 18
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        style: {
                            display: "flex",
                            flexDirection: "column",
                            gap: 6
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontWeight: 600
                                },
                                children: "Product name"
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/products/page.tsx",
                                lineNumber: 240,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                className: "nav-search",
                                required: true,
                                value: name,
                                onChange: (e)=>setName(e.target.value),
                                placeholder: "e.g. Printed Salwar Kameez"
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/products/page.tsx",
                                lineNumber: 241,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/admin/products/page.tsx",
                        lineNumber: 239,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        style: {
                            margin: 0,
                            fontSize: 13,
                            color: "var(--color-text-secondary)"
                        },
                        children: "Product link is created automatically from product name (no slug setup needed)."
                    }, void 0, false, {
                        fileName: "[project]/src/app/admin/products/page.tsx",
                        lineNumber: 249,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        style: {
                            display: "flex",
                            flexDirection: "column",
                            gap: 6
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontWeight: 600
                                },
                                children: "Description"
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/products/page.tsx",
                                lineNumber: 254,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                className: "nav-search",
                                required: true,
                                rows: 5,
                                value: description,
                                onChange: (e)=>setDescription(e.target.value),
                                placeholder: "Full description. You can use line breaks; they appear as bullet points on the product page.",
                                style: {
                                    minHeight: 120,
                                    resize: "vertical"
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/products/page.tsx",
                                lineNumber: 255,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/admin/products/page.tsx",
                        lineNumber: 253,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: 12
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                style: {
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 6
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontWeight: 600
                                        },
                                        children: "Price (৳)"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/admin/products/page.tsx",
                                        lineNumber: 268,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        className: "nav-search",
                                        required: true,
                                        inputMode: "decimal",
                                        value: price,
                                        onChange: (e)=>setPrice(e.target.value),
                                        placeholder: "899"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/admin/products/page.tsx",
                                        lineNumber: 269,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/admin/products/page.tsx",
                                lineNumber: 267,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                style: {
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 6
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontWeight: 600
                                        },
                                        children: "Stock"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/admin/products/page.tsx",
                                        lineNumber: 279,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        className: "nav-search",
                                        required: true,
                                        inputMode: "numeric",
                                        value: stock,
                                        onChange: (e)=>setStock(e.target.value)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/admin/products/page.tsx",
                                        lineNumber: 280,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/admin/products/page.tsx",
                                lineNumber: 278,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/admin/products/page.tsx",
                        lineNumber: 266,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            flexDirection: "column",
                            gap: 8
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontWeight: 600
                                },
                                children: "Primary image"
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/products/page.tsx",
                                lineNumber: 291,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                style: {
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 10,
                                    flexWrap: "wrap",
                                    cursor: uploadingPrimary ? "wait" : "pointer"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "file",
                                        accept: "image/jpeg,image/png,image/webp,image/gif",
                                        disabled: uploadingPrimary,
                                        style: {
                                            maxWidth: "100%"
                                        },
                                        onChange: async (e)=>{
                                            const file = e.target.files?.[0];
                                            e.target.value = "";
                                            if (!file) return;
                                            setError("");
                                            setUploadingPrimary(true);
                                            try {
                                                const url = await uploadImageFile(file);
                                                setImageUrl(url);
                                            } catch (err) {
                                                setError(err instanceof Error ? err.message : "Upload failed.");
                                            } finally{
                                                setUploadingPrimary(false);
                                            }
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/admin/products/page.tsx",
                                        lineNumber: 301,
                                        columnNumber: 13
                                    }, this),
                                    uploadingPrimary && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: 13,
                                            color: "var(--color-text-secondary)"
                                        },
                                        children: "Uploading…"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/admin/products/page.tsx",
                                        lineNumber: 323,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/admin/products/page.tsx",
                                lineNumber: 292,
                                columnNumber: 11
                            }, this),
                            imageUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: imageUrl,
                                alt: "Primary preview",
                                style: {
                                    maxWidth: 200,
                                    maxHeight: 200,
                                    borderRadius: 8,
                                    objectFit: "cover",
                                    border: "1px solid var(--color-border)"
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/products/page.tsx",
                                lineNumber: 327,
                                columnNumber: 13
                            }, this) : null
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/admin/products/page.tsx",
                        lineNumber: 290,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("fieldset", {
                        style: {
                            border: "1px solid var(--color-border)",
                            borderRadius: 10,
                            padding: "14px 16px"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("legend", {
                                style: {
                                    fontWeight: 600,
                                    padding: "0 6px"
                                },
                                children: "Category"
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/products/page.tsx",
                                lineNumber: 336,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                className: "nav-search",
                                value: category,
                                onChange: (e)=>setCategory(e.target.value),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "",
                                        children: "Select existing category…"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/admin/products/page.tsx",
                                        lineNumber: 342,
                                        columnNumber: 13
                                    }, this),
                                    existingCategories.map((c)=>{
                                        const label = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$ui$2d$bn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["categoryLabelBn"])(c);
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: c,
                                            children: c === label ? c : `${c} (${label})`
                                        }, c, false, {
                                            fileName: "[project]/src/app/admin/products/page.tsx",
                                            lineNumber: 346,
                                            columnNumber: 17
                                        }, this);
                                    })
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/admin/products/page.tsx",
                                lineNumber: 337,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/admin/products/page.tsx",
                        lineNumber: 335,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        style: {
                            display: "flex",
                            flexDirection: "column",
                            gap: 6
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontWeight: 600
                                },
                                children: "Available sizes"
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/products/page.tsx",
                                lineNumber: 355,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: 8
                                },
                                children: AVAILABLE_SIZES.map((sz)=>{
                                    const active = selectedSizes.includes(sz);
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>toggleSize(sz),
                                        style: {
                                            minWidth: 52,
                                            minHeight: 40,
                                            borderRadius: 10,
                                            border: active ? "1px solid var(--color-primary)" : "1px solid var(--color-border)",
                                            background: active ? "rgba(14,165,233,0.12)" : "#fff",
                                            color: active ? "var(--color-primary-dark)" : "var(--color-text-primary)",
                                            fontWeight: 700,
                                            cursor: "pointer"
                                        },
                                        "aria-pressed": active,
                                        children: sz
                                    }, sz, false, {
                                        fileName: "[project]/src/app/admin/products/page.tsx",
                                        lineNumber: 360,
                                        columnNumber: 17
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/products/page.tsx",
                                lineNumber: 356,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/admin/products/page.tsx",
                        lineNumber: 354,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("fieldset", {
                        style: {
                            border: "1px solid var(--color-border)",
                            borderRadius: 10,
                            padding: "14px 16px"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("legend", {
                                style: {
                                    fontWeight: 600,
                                    padding: "0 6px"
                                },
                                children: "Color images (optional)"
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/products/page.tsx",
                                lineNumber: 384,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    margin: "0 0 10px",
                                    fontSize: 13,
                                    color: "var(--color-text-secondary)"
                                },
                                children: "Upload multiple color images in one go. Color name is auto-filled from file name and you can edit it."
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/products/page.tsx",
                                lineNumber: 385,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                style: {
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 8,
                                    flexWrap: "wrap",
                                    cursor: uploadingColorImages ? "wait" : "pointer"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "file",
                                        multiple: true,
                                        accept: "image/jpeg,image/png,image/webp,image/gif",
                                        disabled: uploadingColorImages,
                                        onChange: async (e)=>{
                                            const files = Array.from(e.target.files ?? []);
                                            e.target.value = "";
                                            if (files.length === 0) return;
                                            setError("");
                                            setUploadingColorImages(true);
                                            try {
                                                const uploaded = [];
                                                for (const file of files){
                                                    const url = await uploadImageFile(file);
                                                    uploaded.push({
                                                        label: makeColorLabelFromFileName(file.name),
                                                        image: url
                                                    });
                                                }
                                                setColorImages((prev)=>[
                                                        ...prev,
                                                        ...uploaded
                                                    ]);
                                            } catch (err) {
                                                setError(err instanceof Error ? err.message : "Color image upload failed.");
                                            } finally{
                                                setUploadingColorImages(false);
                                            }
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/admin/products/page.tsx",
                                        lineNumber: 389,
                                        columnNumber: 13
                                    }, this),
                                    uploadingColorImages && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: 13,
                                            color: "var(--color-text-secondary)"
                                        },
                                        children: "Uploading color images…"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/admin/products/page.tsx",
                                        lineNumber: 418,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/admin/products/page.tsx",
                                lineNumber: 388,
                                columnNumber: 11
                            }, this),
                            colorImages.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 10,
                                    marginTop: 12
                                },
                                children: colorImages.map((row, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: "grid",
                                            gridTemplateColumns: "56px 1fr auto",
                                            gap: 10,
                                            alignItems: "center"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                src: row.image,
                                                alt: row.label,
                                                style: {
                                                    width: 56,
                                                    height: 56,
                                                    objectFit: "cover",
                                                    borderRadius: 8,
                                                    border: "1px solid var(--color-border)"
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/admin/products/page.tsx",
                                                lineNumber: 434,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                className: "nav-search",
                                                value: row.label,
                                                onChange: (e)=>updateColorImageRow(i, {
                                                        label: e.target.value
                                                    }),
                                                placeholder: "Color name"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/admin/products/page.tsx",
                                                lineNumber: 439,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$admin$2d$icon$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AdminIconButton"], {
                                                type: "button",
                                                variant: "danger",
                                                label: `Remove color ${row.label}`,
                                                onClick: ()=>removeColorImageRow(i),
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$admin$2d$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IconTrash"], {}, void 0, false, {
                                                    fileName: "[project]/src/app/admin/products/page.tsx",
                                                    lineNumber: 451,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/admin/products/page.tsx",
                                                lineNumber: 445,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, `${row.image}-${i}`, true, {
                                        fileName: "[project]/src/app/admin/products/page.tsx",
                                        lineNumber: 425,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/products/page.tsx",
                                lineNumber: 423,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/admin/products/page.tsx",
                        lineNumber: 383,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$admin$2d$icon$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AdminIconButton"], {
                        type: "submit",
                        variant: "success",
                        size: "lg",
                        label: submitting ? "Creating product" : "Create product",
                        disabled: submitting,
                        children: submitting ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$admin$2d$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IconSpinner"], {
                            size: 22
                        }, void 0, false, {
                            fileName: "[project]/src/app/admin/products/page.tsx",
                            lineNumber: 460,
                            columnNumber: 25
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$admin$2d$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IconCheck"], {
                            size: 22
                        }, void 0, false, {
                            fileName: "[project]/src/app/admin/products/page.tsx",
                            lineNumber: 460,
                            columnNumber: 53
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/admin/products/page.tsx",
                        lineNumber: 459,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/admin/products/page.tsx",
                lineNumber: 238,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/admin/products/page.tsx",
        lineNumber: 216,
        columnNumber: 5
    }, this);
}
_s(AdminProductsPage, "ya5341WpvBTMlGn0oITjJ34RtOI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = AdminProductsPage;
var _c;
__turbopack_context__.k.register(_c, "AdminProductsPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_0-doqcn._.js.map