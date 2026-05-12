"use client";

import { usePathname, useRouter } from "next/navigation";

export function AdminProductsWorkspaceNav() {
  const router = useRouter();
  const pathname = usePathname() ?? "";
  const value = pathname.includes("/admin/products/manage") ? "/admin/products/manage" : "/admin/products";

  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: "flex", flexDirection: "column", gap: 6, maxWidth: 400 }}>
        <span style={{ fontWeight: 600 }}>Products workspace</span>
        <select
          className="nav-search"
          value={value}
          onChange={(e) => {
            router.push(e.target.value);
          }}
        >
          <option value="/admin/products">Add new product</option>
          <option value="/admin/products/manage">Manage catalog (edit / remove)</option>
        </select>
      </label>
    </div>
  );
}
