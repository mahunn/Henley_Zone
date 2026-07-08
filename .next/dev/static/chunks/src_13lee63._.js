(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/config/businesses.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/format-order-line.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/src/lib/customer-contact.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/** Digits only for wa.me / tel (E.164-style, no +). Handles common BD formats. */ __turbopack_context__.s([
    "customerTelHref",
    ()=>customerTelHref,
    "customerWhatsappUrl",
    ()=>customerWhatsappUrl,
    "normalizePhoneDigits",
    ()=>normalizePhoneDigits
]);
function normalizePhoneDigits(phone) {
    const digits = phone.replace(/\D/g, "");
    if (!digits) return "";
    if (digits.startsWith("880")) return digits;
    if (digits.startsWith("0")) return `880${digits.slice(1)}`;
    if (digits.length === 10 && digits.startsWith("1")) return `880${digits}`;
    return digits;
}
function customerTelHref(phone) {
    const digits = normalizePhoneDigits(phone);
    return digits ? `tel:+${digits}` : "";
}
function customerWhatsappUrl(phone, message) {
    const digits = normalizePhoneDigits(phone);
    if (!digits) return "";
    const base = `https://wa.me/${digits}`;
    if (!message?.trim()) return base;
    return `${base}?text=${encodeURIComponent(message.trim())}`;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/money.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "formatCurrency",
    ()=>formatCurrency
]);
function formatCurrency(amount, currency = "BDT") {
    return new Intl.NumberFormat("en-BD", {
        style: "currency",
        currency,
        maximumFractionDigits: 0
    }).format(amount);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/format-order-summary.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "formatOrderForClipboard",
    ()=>formatOrderForClipboard,
    "formatOrderSummaryLines",
    ()=>formatOrderSummaryLines
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$businesses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/config/businesses.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2d$order$2d$line$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/format-order-line.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$money$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/money.ts [app-client] (ecmascript)");
;
;
;
function formatOrderForClipboard(order) {
    return formatOrderSummaryLines(order).join("\n");
}
function formatOrderSummaryLines(order) {
    const currency = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$businesses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defaultBusiness"].currency;
    const lines = [
        `Order ID: ${order.id}`,
        `Date: ${new Date(order.createdAt).toLocaleString()}`,
        `Customer: ${order.customerName}`,
        `Phone: ${order.phone}`,
        `Address: ${order.address}`,
        `Payment: ${order.paymentMethod}`,
        `Status: ${order.status}`,
        `Subtotal: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$money$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(order.subtotal, currency)}`,
        `Delivery: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$money$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(order.deliveryFee, currency)}`,
        `Total: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$money$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(order.total, currency)}`,
        "Items:"
    ];
    for (const item of order.items){
        const label = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2d$order$2d$line$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatOrderItemLabel"])(item);
        const lineTotal = item.price * item.quantity;
        lines.push(`- ${label} x${item.quantity} @ ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$money$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(item.price, currency)} = ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$money$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(lineTotal, currency)}`);
    }
    if (order.note?.trim()) {
        lines.push(`Note: ${order.note.trim()}`);
    }
    return lines;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/admin/orders/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AdminOrdersPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$businesses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/config/businesses.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2d$order$2d$line$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/format-order-line.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$admin$2d$icon$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/admin/admin-icon-button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$admin$2d$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/admin/admin-icons.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$customer$2d$contact$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/customer-contact.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2d$order$2d$summary$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/format-order-summary.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$money$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/money.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
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
;
const statusTabs = [
    {
        key: "all",
        label: "All"
    },
    {
        key: "pending",
        label: "Pending"
    },
    {
        key: "confirmed",
        label: "Confirmed"
    },
    {
        key: "delivered",
        label: "Delivered"
    },
    {
        key: "cancelled",
        label: "Cancelled"
    }
];
function statusBadgeStyle(status) {
    if (status === "pending") return {
        background: "#FEF3C7",
        color: "#92400E"
    };
    if (status === "confirmed") return {
        background: "#DBEAFE",
        color: "#1E40AF"
    };
    if (status === "delivered") return {
        background: "#DCFCE7",
        color: "#166534"
    };
    return {
        background: "#FEE2E2",
        color: "#991B1B"
    };
}
/** Local calendar date YYYY-MM-DD for grouping */ function localDateKey(iso) {
    const d = new Date(iso);
    const y = d.getFullYear();
    const mo = d.getMonth() + 1;
    const day = d.getDate();
    return `${y}-${String(mo).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}
function formatDayHeading(ymd) {
    const [y, m, day] = ymd.split("-").map(Number);
    const dt = new Date(y, m - 1, day);
    return dt.toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    });
}
function formatMonthOption(ym) {
    const [y, m] = ym.split("-").map(Number);
    const dt = new Date(y, m - 1, 1);
    return dt.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long"
    });
}
function orderMatchesPeriod(order, period) {
    if (period === "all") return true;
    const t = new Date(order.createdAt).getTime();
    if (Number.isNaN(t)) return true;
    if (period === "today") {
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        const end = new Date();
        end.setHours(23, 59, 59, 999);
        return t >= start.getTime() && t <= end.getTime();
    }
    if (period === "7d") return t >= Date.now() - 7 * 86400000;
    if (period === "30d") return t >= Date.now() - 30 * 86400000;
    if (period.startsWith("month:")) {
        const rest = period.slice(6);
        const parts = rest.split("-");
        const y = Number(parts[0]);
        const mo = Number(parts[1]);
        if (!y || !mo) return true;
        const start = new Date(y, mo - 1, 1);
        start.setHours(0, 0, 0, 0);
        const end = new Date(y, mo, 0, 23, 59, 59, 999);
        return t >= start.getTime() && t <= end.getTime();
    }
    return true;
}
function groupOrdersByLocalDay(sortedOrders, sortBy) {
    const map = new Map();
    for (const o of sortedOrders){
        const key = localDateKey(o.createdAt);
        if (!map.has(key)) map.set(key, []);
        map.get(key).push(o);
    }
    const keys = [
        ...map.keys()
    ].sort((a, b)=>{
        if (sortBy === "oldest") return a.localeCompare(b);
        return b.localeCompare(a);
    });
    return keys.map((key)=>({
            key,
            heading: formatDayHeading(key),
            orders: map.get(key)
        }));
}
function AdminOrdersPage() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [orders, setOrders] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [updatingOrderId, setUpdatingOrderId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [activeFilter, setActiveFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("all");
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [sortBy, setSortBy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("latest");
    /** Time window: all | today | 7d | 30d | month:YYYY-MM (default: last 7 days) */ const [period, setPeriod] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("7d");
    const [copyingId, setCopyingId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [copiedNotice, setCopiedNotice] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [pendingDeleteIds, setPendingDeleteIds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [applyingDeletes, setApplyingDeletes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const loadOrders = async ()=>{
        try {
            const res = await fetch("/api/orders", {
                cache: "no-store",
                credentials: "include"
            });
            if (res.status === 401) {
                router.replace("/login?type=admin");
                return;
            }
            if (!res.ok) {
                throw new Error("failed");
            }
            const data = await res.json();
            setOrders(data.orders);
            setError("");
        } catch  {
            setError("Could not load orders.");
        } finally{
            setLoading(false);
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AdminOrdersPage.useEffect": ()=>{
            void loadOrders();
        }
    }["AdminOrdersPage.useEffect"], [
        router
    ]);
    const logout = async ()=>{
        await fetch("/api/admin/logout", {
            method: "POST",
            credentials: "include"
        });
        router.push("/login?type=admin");
        router.refresh();
    };
    const updateStatus = async (orderId, status)=>{
        setUpdatingOrderId(orderId);
        try {
            const res = await fetch("/api/orders", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    orderId,
                    status
                })
            });
            if (res.status === 401) {
                router.replace("/login?type=admin");
                return;
            }
            if (!res.ok) {
                const body = await res.json().catch(()=>null);
                setError(body?.message || "Failed to update order status.");
                return;
            }
            await loadOrders();
        } catch  {
            setError("Failed to update order status.");
        } finally{
            setUpdatingOrderId(null);
        }
    };
    const monthOptions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AdminOrdersPage.useMemo[monthOptions]": ()=>{
            const set = new Set();
            for (const o of orders){
                const d = new Date(o.createdAt);
                if (Number.isNaN(d.getTime())) continue;
                set.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
            }
            return [
                ...set
            ].sort({
                "AdminOrdersPage.useMemo[monthOptions]": (a, b)=>b.localeCompare(a)
            }["AdminOrdersPage.useMemo[monthOptions]"]);
        }
    }["AdminOrdersPage.useMemo[monthOptions]"], [
        orders
    ]);
    const filteredOrders = orders.filter((order)=>orderMatchesPeriod(order, period)).filter((order)=>activeFilter === "all" ? true : order.status === activeFilter).filter((order)=>{
        const q = searchQuery.trim().toLowerCase();
        if (!q) return true;
        return order.id.toLowerCase().includes(q) || order.customerName.toLowerCase().includes(q) || order.phone.toLowerCase().includes(q);
    }).sort((a, b)=>{
        if (sortBy === "latest") {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === "oldest") {
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        if (sortBy === "amountHigh") {
            return b.total - a.total;
        }
        return a.total - b.total;
    });
    const ordersByDay = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AdminOrdersPage.useMemo[ordersByDay]": ()=>groupOrdersByLocalDay(filteredOrders, sortBy)
    }["AdminOrdersPage.useMemo[ordersByDay]"], [
        filteredOrders,
        sortBy
    ]);
    const togglePendingDelete = (orderId)=>{
        setPendingDeleteIds((prev)=>prev.includes(orderId) ? prev.filter((id)=>id !== orderId) : [
                ...prev,
                orderId
            ]);
        setError("");
    };
    const clearPendingDeletes = ()=>{
        setPendingDeleteIds([]);
        setError("");
    };
    const applyPendingDeletes = async ()=>{
        if (!pendingDeleteIds.length) return;
        if (!window.confirm(`Permanently delete ${pendingDeleteIds.length} order(s)? This cannot be undone.`)) {
            return;
        }
        setApplyingDeletes(true);
        setError("");
        const ids = [
            ...pendingDeleteIds
        ];
        try {
            const res = await fetch("/api/orders", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    orderIds: ids
                })
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.message || "Could not delete orders.");
                if (data.deleted?.length) {
                    setOrders((prev)=>prev.filter((o)=>!data.deleted.includes(o.id)));
                    setPendingDeleteIds(ids.filter((id)=>!data.deleted.includes(id)));
                }
                return;
            }
            const deletedSet = new Set(data.deleted ?? ids);
            setOrders((prev)=>prev.filter((o)=>!deletedSet.has(o.id)));
            setPendingDeleteIds([]);
        } catch  {
            setError("Could not delete orders.");
        } finally{
            setApplyingDeletes(false);
        }
    };
    const copyText = async (text)=>{
        if (navigator?.clipboard?.writeText) {
            await navigator.clipboard.writeText(text);
            return;
        }
        const area = document.createElement("textarea");
        area.value = text;
        area.setAttribute("readonly", "true");
        area.style.position = "absolute";
        area.style.left = "-9999px";
        document.body.appendChild(area);
        area.select();
        document.execCommand("copy");
        area.remove();
    };
    const handleCopyOrder = async (order)=>{
        setCopyingId(order.id);
        try {
            await copyText((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2d$order$2d$summary$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatOrderForClipboard"])(order));
            setCopiedNotice(`Copied order ${order.id}`);
            window.setTimeout(()=>setCopiedNotice(""), 1800);
        } catch  {
            setError("Could not copy order.");
        } finally{
            setCopyingId(null);
        }
    };
    const handleCopyAll = async ()=>{
        if (!filteredOrders.length) return;
        setCopyingId("all");
        try {
            const allText = filteredOrders.map((order, idx)=>{
                const block = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2d$order$2d$summary$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatOrderForClipboard"])(order);
                return idx === filteredOrders.length - 1 ? block : `${block}\n\n--------------------\n`;
            }).join("");
            await copyText(allText);
            setCopiedNotice(`Copied ${filteredOrders.length} orders`);
            window.setTimeout(()=>setCopiedNotice(""), 1800);
        } catch  {
            setError("Could not copy all orders.");
        } finally{
            setCopyingId(null);
        }
    };
    const countByStatus = {
        all: orders.length,
        pending: orders.filter((order)=>order.status === "pending").length,
        confirmed: orders.filter((order)=>order.status === "confirmed").length,
        delivered: orders.filter((order)=>order.status === "delivered").length,
        cancelled: orders.filter((order)=>order.status === "cancelled").length
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        style: {
            maxWidth: 960,
            margin: "0 auto",
            padding: 24
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "admin-orders-top",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                children: "Admin - COD Orders"
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/orders/page.tsx",
                                lineNumber: 350,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: [
                                    "By default only the ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: "last 7 days"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/admin/orders/page.tsx",
                                        lineNumber: 352,
                                        columnNumber: 33
                                    }, this),
                                    " of orders are shown. Change ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: "Time period"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/admin/orders/page.tsx",
                                        lineNumber: 352,
                                        columnNumber: 90
                                    }, this),
                                    " for today, 30 days, all time, or a specific month. Orders are grouped by calendar day (newest days first)."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/admin/orders/page.tsx",
                                lineNumber: 351,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/admin/orders/page.tsx",
                        lineNumber: 349,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$admin$2d$icon$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AdminIconToolbar"], {
                        className: "admin-orders-actions",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$admin$2d$icon$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AdminIconButton"], {
                                variant: "primary",
                                label: copyingId === "all" ? "Copying all orders" : "Copy all filtered orders",
                                onClick: handleCopyAll,
                                disabled: copyingId === "all" || !filteredOrders.length,
                                children: copyingId === "all" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$admin$2d$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IconSpinner"], {}, void 0, false, {
                                    fileName: "[project]/src/app/admin/orders/page.tsx",
                                    lineNumber: 362,
                                    columnNumber: 36
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$admin$2d$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IconCopyAll"], {}, void 0, false, {
                                    fileName: "[project]/src/app/admin/orders/page.tsx",
                                    lineNumber: 362,
                                    columnNumber: 54
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/orders/page.tsx",
                                lineNumber: 356,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$admin$2d$icon$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AdminIconButton"], {
                                variant: "ghost",
                                label: "Log out",
                                onClick: logout,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$admin$2d$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IconLogout"], {}, void 0, false, {
                                    fileName: "[project]/src/app/admin/orders/page.tsx",
                                    lineNumber: 365,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/orders/page.tsx",
                                lineNumber: 364,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/admin/orders/page.tsx",
                        lineNumber: 355,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/admin/orders/page.tsx",
                lineNumber: 348,
                columnNumber: 7
            }, this),
            loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: "Loading orders..."
            }, void 0, false, {
                fileName: "[project]/src/app/admin/orders/page.tsx",
                lineNumber: 370,
                columnNumber: 18
            }, this) : null,
            error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                style: {
                    color: "crimson"
                },
                children: error
            }, void 0, false, {
                fileName: "[project]/src/app/admin/orders/page.tsx",
                lineNumber: 371,
                columnNumber: 16
            }, this) : null,
            copiedNotice ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "admin-copy-note",
                children: copiedNotice
            }, void 0, false, {
                fileName: "[project]/src/app/admin/orders/page.tsx",
                lineNumber: 372,
                columnNumber: 23
            }, this) : null,
            !loading && !orders.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: "No orders yet."
            }, void 0, false, {
                fileName: "[project]/src/app/admin/orders/page.tsx",
                lineNumber: 374,
                columnNumber: 37
            }, this) : null,
            !loading && orders.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            gap: 8,
                            flexWrap: "wrap",
                            marginTop: 14
                        },
                        children: statusTabs.map((tab)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>setActiveFilter(tab.key),
                                style: {
                                    padding: "6px 10px",
                                    borderRadius: 999,
                                    border: "1px solid #d1d5db",
                                    background: activeFilter === tab.key ? "#111827" : "#fff",
                                    color: activeFilter === tab.key ? "#fff" : "#111827"
                                },
                                children: [
                                    tab.label,
                                    " (",
                                    countByStatus[tab.key],
                                    ")"
                                ]
                            }, tab.key, true, {
                                fileName: "[project]/src/app/admin/orders/page.tsx",
                                lineNumber: 380,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/app/admin/orders/page.tsx",
                        lineNumber: 378,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            gap: 10,
                            flexWrap: "wrap",
                            marginTop: 12,
                            alignItems: "center"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                style: {
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 4,
                                    fontSize: 13
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontWeight: 600,
                                            color: "#374151"
                                        },
                                        children: "Time period"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/admin/orders/page.tsx",
                                        lineNumber: 407,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: period,
                                        onChange: (e)=>setPeriod(e.target.value),
                                        "aria-label": "Filter orders by date range",
                                        style: {
                                            padding: "8px 10px",
                                            minWidth: 220,
                                            borderRadius: 8,
                                            border: "1px solid #d1d5db"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("optgroup", {
                                                label: "Date range",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "7d",
                                                        children: "Last 7 days"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/admin/orders/page.tsx",
                                                        lineNumber: 415,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "today",
                                                        children: "Today only"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/admin/orders/page.tsx",
                                                        lineNumber: 416,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "30d",
                                                        children: "Last 30 days"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/admin/orders/page.tsx",
                                                        lineNumber: 417,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "all",
                                                        children: "All time"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/admin/orders/page.tsx",
                                                        lineNumber: 418,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/admin/orders/page.tsx",
                                                lineNumber: 414,
                                                columnNumber: 17
                                            }, this),
                                            monthOptions.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("optgroup", {
                                                label: "Single calendar month",
                                                children: monthOptions.map((ym)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: `month:${ym}`,
                                                        children: formatMonthOption(ym)
                                                    }, ym, false, {
                                                        fileName: "[project]/src/app/admin/orders/page.tsx",
                                                        lineNumber: 423,
                                                        columnNumber: 23
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/admin/orders/page.tsx",
                                                lineNumber: 421,
                                                columnNumber: 19
                                            }, this) : null
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/admin/orders/page.tsx",
                                        lineNumber: 408,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/admin/orders/page.tsx",
                                lineNumber: 406,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                placeholder: "Search by order ID, customer, phone",
                                value: searchQuery,
                                onChange: (event)=>setSearchQuery(event.target.value),
                                style: {
                                    padding: 8,
                                    minWidth: 280,
                                    borderRadius: 8,
                                    border: "1px solid #d1d5db"
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/orders/page.tsx",
                                lineNumber: 431,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                style: {
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 4,
                                    fontSize: 13
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontWeight: 600,
                                            color: "#374151"
                                        },
                                        children: "Order by"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/admin/orders/page.tsx",
                                        lineNumber: 439,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: sortBy,
                                        onChange: (event)=>setSortBy(event.target.value),
                                        style: {
                                            padding: "8px 10px",
                                            minWidth: 200,
                                            borderRadius: 8,
                                            border: "1px solid #d1d5db"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "latest",
                                                children: "Date: newest first"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/admin/orders/page.tsx",
                                                lineNumber: 447,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "oldest",
                                                children: "Date: oldest first"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/admin/orders/page.tsx",
                                                lineNumber: 448,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "amountHigh",
                                                children: "Amount: high to low"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/admin/orders/page.tsx",
                                                lineNumber: 449,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "amountLow",
                                                children: "Amount: low to high"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/admin/orders/page.tsx",
                                                lineNumber: 450,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/admin/orders/page.tsx",
                                        lineNumber: 440,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/admin/orders/page.tsx",
                                lineNumber: 438,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/admin/orders/page.tsx",
                        lineNumber: 397,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true) : null,
            !loading && orders.length > 0 && filteredOrders.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                style: {
                    marginTop: 12,
                    color: "#64748b"
                },
                children: [
                    "No orders match your current filters.",
                    period !== "all" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            " ",
                            "Try setting ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                children: "Time period"
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/orders/page.tsx",
                                lineNumber: 463,
                                columnNumber: 27
                            }, this),
                            " to ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                children: "All time"
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/orders/page.tsx",
                                lineNumber: 463,
                                columnNumber: 59
                            }, this),
                            " or a different month."
                        ]
                    }, void 0, true) : null
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/admin/orders/page.tsx",
                lineNumber: 458,
                columnNumber: 9
            }, this) : null,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    marginTop: 16
                },
                children: ordersByDay.map((group)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        style: {
                            marginBottom: 28
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                style: {
                                    margin: "0 0 12px",
                                    padding: "10px 14px",
                                    fontSize: "1.05rem",
                                    fontWeight: 700,
                                    color: "#0f172a",
                                    background: "linear-gradient(90deg, #e0f2fe 0%, #f8fafc 100%)",
                                    borderRadius: 10,
                                    border: "1px solid #bae6fd"
                                },
                                children: [
                                    group.heading,
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontWeight: 500,
                                            fontSize: 13,
                                            color: "#64748b",
                                            marginLeft: 8
                                        },
                                        children: [
                                            "(",
                                            group.orders.length,
                                            " ",
                                            group.orders.length === 1 ? "order" : "orders",
                                            ")"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/admin/orders/page.tsx",
                                        lineNumber: 485,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/admin/orders/page.tsx",
                                lineNumber: 472,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "grid",
                                    gap: 12
                                },
                                children: group.orders.map((order)=>{
                                    const markedForDelete = pendingDeleteIds.includes(order.id);
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                        style: {
                                            border: markedForDelete ? "1px solid #fca5a5" : "1px solid var(--color-border)",
                                            borderRadius: 12,
                                            padding: 16,
                                            background: markedForDelete ? "#fef2f2" : "var(--color-surface)",
                                            opacity: markedForDelete ? 0.94 : 1
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "admin-order-head",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        style: {
                                                            textDecoration: markedForDelete ? "line-through" : undefined
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                children: "Order:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/admin/orders/page.tsx",
                                                                lineNumber: 505,
                                                                columnNumber: 23
                                                            }, this),
                                                            " ",
                                                            order.id,
                                                            markedForDelete ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    marginLeft: 8,
                                                                    fontSize: 12,
                                                                    color: "#b91c1c",
                                                                    fontWeight: 600
                                                                },
                                                                children: "marked for deletion"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/admin/orders/page.tsx",
                                                                lineNumber: 507,
                                                                columnNumber: 25
                                                            }, this) : null
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/admin/orders/page.tsx",
                                                        lineNumber: 504,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$admin$2d$icon$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AdminIconToolbar"], {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$admin$2d$icon$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AdminIconButton"], {
                                                                variant: "primary",
                                                                label: copyingId === order.id ? "Copying order" : `Copy order ${order.id}`,
                                                                onClick: ()=>void handleCopyOrder(order),
                                                                disabled: copyingId === order.id || markedForDelete,
                                                                children: copyingId === order.id ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$admin$2d$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IconSpinner"], {}, void 0, false, {
                                                                    fileName: "[project]/src/app/admin/orders/page.tsx",
                                                                    lineNumber: 519,
                                                                    columnNumber: 51
                                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$admin$2d$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IconCopy"], {}, void 0, false, {
                                                                    fileName: "[project]/src/app/admin/orders/page.tsx",
                                                                    lineNumber: 519,
                                                                    columnNumber: 69
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/admin/orders/page.tsx",
                                                                lineNumber: 513,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$admin$2d$icon$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AdminIconButton"], {
                                                                variant: markedForDelete ? "warning" : "danger",
                                                                label: markedForDelete ? "Undo removal mark" : "Mark order for removal",
                                                                onClick: ()=>togglePendingDelete(order.id),
                                                                disabled: applyingDeletes || updatingOrderId === order.id,
                                                                children: markedForDelete ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$admin$2d$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IconUndo"], {}, void 0, false, {
                                                                    fileName: "[project]/src/app/admin/orders/page.tsx",
                                                                    lineNumber: 527,
                                                                    columnNumber: 44
                                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$admin$2d$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IconTrash"], {}, void 0, false, {
                                                                    fileName: "[project]/src/app/admin/orders/page.tsx",
                                                                    lineNumber: 527,
                                                                    columnNumber: 59
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/admin/orders/page.tsx",
                                                                lineNumber: 521,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/admin/orders/page.tsx",
                                                        lineNumber: 512,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/admin/orders/page.tsx",
                                                lineNumber: 503,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: "Time:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/admin/orders/page.tsx",
                                                        lineNumber: 532,
                                                        columnNumber: 21
                                                    }, this),
                                                    " ",
                                                    new Date(order.createdAt).toLocaleString()
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/admin/orders/page.tsx",
                                                lineNumber: 531,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: "Customer:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/admin/orders/page.tsx",
                                                        lineNumber: 535,
                                                        columnNumber: 21
                                                    }, this),
                                                    " ",
                                                    order.customerName
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/admin/orders/page.tsx",
                                                lineNumber: 534,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: "Phone:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/admin/orders/page.tsx",
                                                        lineNumber: 538,
                                                        columnNumber: 21
                                                    }, this),
                                                    " ",
                                                    order.phone
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/admin/orders/page.tsx",
                                                lineNumber: 537,
                                                columnNumber: 19
                                            }, this),
                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$customer$2d$contact$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["customerTelHref"])(order.phone) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$admin$2d$icon$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AdminIconToolbar"], {
                                                className: "admin-order-contact",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$admin$2d$icon$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AdminIconButton"], {
                                                        href: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$customer$2d$contact$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["customerTelHref"])(order.phone),
                                                        variant: "call",
                                                        label: `Call ${order.customerName}`,
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$admin$2d$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IconPhone"], {}, void 0, false, {
                                                            fileName: "[project]/src/app/admin/orders/page.tsx",
                                                            lineNumber: 547,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/admin/orders/page.tsx",
                                                        lineNumber: 542,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$admin$2d$icon$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AdminIconButton"], {
                                                        href: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$customer$2d$contact$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["customerWhatsappUrl"])(order.phone, `Hi ${order.customerName}, regarding your order ${order.id}.`),
                                                        variant: "whatsapp",
                                                        label: `WhatsApp ${order.customerName}`,
                                                        external: true,
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$admin$2d$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IconWhatsapp"], {}, void 0, false, {
                                                            fileName: "[project]/src/app/admin/orders/page.tsx",
                                                            lineNumber: 558,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/admin/orders/page.tsx",
                                                        lineNumber: 549,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/admin/orders/page.tsx",
                                                lineNumber: 541,
                                                columnNumber: 21
                                            }, this) : null,
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: "Address:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/admin/orders/page.tsx",
                                                        lineNumber: 563,
                                                        columnNumber: 21
                                                    }, this),
                                                    " ",
                                                    order.address
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/admin/orders/page.tsx",
                                                lineNumber: 562,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: "Total:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/admin/orders/page.tsx",
                                                        lineNumber: 566,
                                                        columnNumber: 21
                                                    }, this),
                                                    " ",
                                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$money$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(order.total, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$businesses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defaultBusiness"].currency)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/admin/orders/page.tsx",
                                                lineNumber: 565,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: "Status:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/admin/orders/page.tsx",
                                                        lineNumber: 570,
                                                        columnNumber: 21
                                                    }, this),
                                                    " ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            display: "inline-block",
                                                            padding: "3px 8px",
                                                            borderRadius: 999,
                                                            fontWeight: 600,
                                                            ...statusBadgeStyle(order.status)
                                                        },
                                                        children: order.status
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/admin/orders/page.tsx",
                                                        lineNumber: 571,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/admin/orders/page.tsx",
                                                lineNumber: 569,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: "flex",
                                                    gap: 8,
                                                    alignItems: "center"
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        htmlFor: `status-${order.id}`,
                                                        children: "Update status:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/admin/orders/page.tsx",
                                                        lineNumber: 584,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                        id: `status-${order.id}`,
                                                        value: order.status,
                                                        onChange: (event)=>void updateStatus(order.id, event.target.value),
                                                        disabled: updatingOrderId === order.id || markedForDelete,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "pending",
                                                                children: "pending"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/admin/orders/page.tsx",
                                                                lineNumber: 593,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "confirmed",
                                                                children: "confirmed"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/admin/orders/page.tsx",
                                                                lineNumber: 594,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "delivered",
                                                                children: "delivered"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/admin/orders/page.tsx",
                                                                lineNumber: 595,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "cancelled",
                                                                children: "cancelled"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/admin/orders/page.tsx",
                                                                lineNumber: 596,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/admin/orders/page.tsx",
                                                        lineNumber: 585,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/admin/orders/page.tsx",
                                                lineNumber: 583,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    marginTop: 4
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: "Items:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/admin/orders/page.tsx",
                                                        lineNumber: 600,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                        style: {
                                                            margin: "8px 0 0",
                                                            paddingLeft: 20,
                                                            lineHeight: 1.55
                                                        },
                                                        children: order.items.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                children: [
                                                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2d$order$2d$line$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatOrderItemLabel"])(item),
                                                                    " · Qty ",
                                                                    item.quantity,
                                                                    " ·",
                                                                    " ",
                                                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$money$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(item.price * item.quantity, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$businesses$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defaultBusiness"].currency)
                                                                ]
                                                            }, item.key ?? `${item.productId}-${item.name}`, true, {
                                                                fileName: "[project]/src/app/admin/orders/page.tsx",
                                                                lineNumber: 603,
                                                                columnNumber: 25
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/admin/orders/page.tsx",
                                                        lineNumber: 601,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/admin/orders/page.tsx",
                                                lineNumber: 599,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, order.id, true, {
                                        fileName: "[project]/src/app/admin/orders/page.tsx",
                                        lineNumber: 493,
                                        columnNumber: 17
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/orders/page.tsx",
                                lineNumber: 489,
                                columnNumber: 13
                            }, this)
                        ]
                    }, group.key, true, {
                        fileName: "[project]/src/app/admin/orders/page.tsx",
                        lineNumber: 471,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/app/admin/orders/page.tsx",
                lineNumber: 469,
                columnNumber: 7
            }, this),
            pendingDeleteIds.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: "sticky",
                    bottom: 0,
                    marginTop: 24,
                    padding: "14px 16px",
                    borderRadius: 10,
                    border: "1px solid #fca5a5",
                    background: "#fff",
                    boxShadow: "0 -8px 24px rgba(0,0,0,0.08)",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 12,
                    alignItems: "center",
                    justifyContent: "space-between"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        style: {
                            margin: 0,
                            flex: "1 1 200px",
                            color: "#7f1d1d",
                            fontSize: 14
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                children: pendingDeleteIds.length
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/orders/page.tsx",
                                lineNumber: 637,
                                columnNumber: 13
                            }, this),
                            " order(s) marked for removal. Nothing is deleted until you save."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/admin/orders/page.tsx",
                        lineNumber: 636,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$admin$2d$icon$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AdminIconToolbar"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$admin$2d$icon$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AdminIconButton"], {
                                variant: "ghost",
                                label: "Clear removal marks",
                                onClick: clearPendingDeletes,
                                disabled: applyingDeletes,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$admin$2d$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IconUndo"], {}, void 0, false, {
                                    fileName: "[project]/src/app/admin/orders/page.tsx",
                                    lineNumber: 646,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/orders/page.tsx",
                                lineNumber: 640,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$admin$2d$icon$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AdminIconButton"], {
                                variant: "danger",
                                label: applyingDeletes ? "Deleting orders" : "Save deletions permanently",
                                onClick: ()=>void applyPendingDeletes(),
                                disabled: applyingDeletes,
                                children: applyingDeletes ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$admin$2d$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IconSpinner"], {}, void 0, false, {
                                    fileName: "[project]/src/app/admin/orders/page.tsx",
                                    lineNumber: 654,
                                    columnNumber: 34
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$admin$2d$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IconTrash"], {}, void 0, false, {
                                    fileName: "[project]/src/app/admin/orders/page.tsx",
                                    lineNumber: 654,
                                    columnNumber: 52
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/admin/orders/page.tsx",
                                lineNumber: 648,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/admin/orders/page.tsx",
                        lineNumber: 639,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/admin/orders/page.tsx",
                lineNumber: 619,
                columnNumber: 9
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/admin/orders/page.tsx",
        lineNumber: 347,
        columnNumber: 5
    }, this);
}
_s(AdminOrdersPage, "1cT1jy/oTMdc8Qn4a/WZAwhSwBY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = AdminOrdersPage;
var _c;
__turbopack_context__.k.register(_c, "AdminOrdersPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_13lee63._.js.map