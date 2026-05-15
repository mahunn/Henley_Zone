"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Link href="/admin/products" className="btn">
          Add products
        </Link>
        <Link href="/admin/products/manage" className="btn btn-secondary">
          Manage catalog
        </Link>
        <Link href="/admin/orders" className="btn">
          Orders
        </Link>
        <button type="button" className="btn btn-secondary" onClick={logout}>
          Log out
        </button>
      </div>
    </main>
  );
}
