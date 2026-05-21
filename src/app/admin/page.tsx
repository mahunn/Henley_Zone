"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  IconClipboardList,
  IconLogout,
  IconPackage,
  IconPlus
} from "@/components/admin/admin-icons";

export default function AdminPanelPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      try {
        const res = await fetch("/api/admin/session", { method: "GET", cache: "no-store", credentials: "include" });
        if (res.status === 401) {
          router.replace("/login?type=admin");
          return;
        }
      } finally {
        setLoading(false);
      }
    };
    void verifySession();
  }, [router]);

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST", credentials: "include" });
    router.push("/login?type=admin");
    router.refresh();
  };

  if (loading) {
    return (
      <main style={{ maxWidth: 760, margin: "0 auto", padding: "40px 24px" }}>
        Checking admin session...
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "40px 24px" }}>
      <h1 style={{ marginBottom: 8 }}>Admin Panel</h1>
      <p style={{ marginBottom: 24, color: "var(--color-text-secondary)" }}>
        Welcome. Manage operations from here.
      </p>
      <nav className="admin-nav-grid" aria-label="Admin navigation">
        <a href="/admin/products" className="admin-nav-tile">
          <span className="admin-nav-tile__icon">
            <IconPlus size={22} />
          </span>
          Add products
        </a>
        <a href="/admin/products/manage" className="admin-nav-tile">
          <span className="admin-nav-tile__icon">
            <IconPackage size={22} />
          </span>
          Manage catalog
        </a>
        <a href="/admin/orders" className="admin-nav-tile">
          <span className="admin-nav-tile__icon">
            <IconClipboardList size={22} />
          </span>
          Orders
        </a>
        <button
          type="button"
          className="admin-nav-tile admin-nav-tile--logout"
          onClick={logout}
          style={{ cursor: "pointer", border: "1px solid #e2e8f0" }}
        >
          <span className="admin-nav-tile__icon">
            <IconLogout size={22} />
          </span>
          Log out
        </button>
      </nav>
    </main>
  );
}
