"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Product, ProductColor } from "@/types/commerce";
import { invalidateProductCatalog } from "@/lib/product-catalog-client";
import { AdminProductsWorkspaceNav } from "@/components/admin/admin-products-workspace-nav";

const AVAILABLE_SIZES = ["32", "34", "36", "38", "40", "42", "44", "46", "48"];
type ColorImageRow = { label: string; image: string };
type EditFormState = {
  id: string;
  name: string;
  description: string;
  price: string;
  stock: string;
  imageUrl: string;
  category: string;
  selectedSizes: string[];
  colorImages: ColorImageRow[];
};

export default function AdminManageProductsPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loadErr, setLoadErr] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<EditFormState | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [pendingDeleteIds, setPendingDeleteIds] = useState<string[]>([]);
  const [applyingDeletes, setApplyingDeletes] = useState(false);

  async function uploadImageFile(file: File | undefined | null): Promise<string> {
    if (!file) throw new Error("No file selected.");
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = (await res.json()) as { url?: string; message?: string };
    if (!res.ok) throw new Error(data.message || "Upload failed");
    if (!data.url) throw new Error("No URL returned");
    return data.url;
  }

  const verify = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/session", { method: "GET", cache: "no-store", credentials: "include" });
      if (res.status === 401) {
        router.replace("/login?type=admin");
        return;
      }
      setAuthorized(res.ok);
    } catch {
      setAuthorized(false);
    }
  }, [router]);

  useEffect(() => {
    void verify();
  }, [verify]);

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch("/api/products", { cache: "no-store" });
        if (!res.ok) {
          let msg = `Could not load products (HTTP ${res.status}).`;
          try {
            const j = (await res.json()) as { message?: string };
            if (j.message) msg = j.message;
          } catch {
            /* ignore */
          }
          setLoadErr(msg);
          setAllProducts([]);
          return;
        }
        const data = (await res.json()) as { products: Product[] };
        setAllProducts(data.products ?? []);
        setLoadErr("");
      } catch {
        setLoadErr("Could not load products.");
        setAllProducts([]);
      }
    }
    if (authorized) void loadProducts();
  }, [authorized]);

  async function reloadProducts() {
    const res = await fetch("/api/products", { cache: "no-store" });
    if (!res.ok) {
      setLoadErr(`Reload failed (HTTP ${res.status}).`);
      return;
    }
    const data = (await res.json()) as { products: Product[] };
    setAllProducts(data.products ?? []);
    setLoadErr("");
  }

  function toColorRowsFromProduct(p: Product): ColorImageRow[] {
    return (p.colors ?? []).map((c) => ({ label: c.label, image: c.image }));
  }

  function startEditing(p: Product) {
    if (pendingDeleteIds.includes(p.id)) return;
    setEditing({
      id: p.id,
      name: p.name,
      description: p.description,
      price: String(p.price),
      stock: String(p.stock),
      imageUrl: p.imageUrl,
      category: p.category,
      selectedSizes: [...(p.sizes ?? [])],
      colorImages: toColorRowsFromProduct(p)
    });
    setError("");
    setMessage("");
  }

  function toggleEditSize(size: string) {
    if (!editing) return;
    setEditing({
      ...editing,
      selectedSizes: editing.selectedSizes.includes(size)
        ? editing.selectedSizes.filter((s) => s !== size)
        : [...editing.selectedSizes, size]
    });
  }

  function updateEditColor(i: number, patch: Partial<ColorImageRow>) {
    if (!editing) return;
    setEditing({
      ...editing,
      colorImages: editing.colorImages.map((r, idx) => (idx === i ? { ...r, ...patch } : r))
    });
  }

  function removeEditColor(i: number) {
    if (!editing) return;
    setEditing({ ...editing, colorImages: editing.colorImages.filter((_, idx) => idx !== i) });
  }

  function togglePendingDelete(productId: string) {
    setPendingDeleteIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
    setMessage("");
    setError("");
    setEditing((cur) => (cur?.id === productId ? null : cur));
  }

  function clearPendingDeletes() {
    setPendingDeleteIds([]);
    setMessage("");
    setError("");
  }

  async function applyPendingDeletes() {
    if (pendingDeleteIds.length === 0) return;
    if (
      !window.confirm(
        `Permanently delete ${pendingDeleteIds.length} product(s) from the catalog? This cannot be undone.`
      )
    ) {
      return;
    }
    setApplyingDeletes(true);
    setError("");
    setMessage("");
    const ids = [...pendingDeleteIds];
    try {
      for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        const res = await fetch(`/api/admin/products?id=${encodeURIComponent(id)}`, { method: "DELETE" });
        const data = (await res.json()) as { message?: string };
        if (!res.ok) {
          setError(data.message || "Delete failed.");
          setPendingDeleteIds(ids.slice(i));
          await reloadProducts();
          return;
        }
      }
      invalidateProductCatalog();
      setPendingDeleteIds([]);
      setMessage(`Deleted ${ids.length} product(s).`);
      await reloadProducts();
    } catch {
      setError("Network error while deleting.");
    } finally {
      setApplyingDeletes(false);
    }
  }

  async function handleSaveEdit() {
    if (!editing) return;
    if (!window.confirm("Save these product changes?")) return;
    setError("");
    setMessage("");
    const priceNum = Number(editing.price);
    const stockNum = Number(editing.stock);
    if (!Number.isFinite(priceNum) || priceNum < 0) {
      setError("Enter a valid edit price.");
      return;
    }
    if (!Number.isFinite(stockNum) || stockNum < 0) {
      setError("Enter a valid edit stock.");
      return;
    }
    if (!editing.imageUrl.trim()) {
      setError("Primary image is required.");
      return;
    }
    if (editing.selectedSizes.length === 0) {
      setError("Select at least one size.");
      return;
    }
    setSavingEdit(true);
    try {
      const colorPayload: ProductColor[] = editing.colorImages
        .map((row) => ({
          id: row.label.trim().toLowerCase().replace(/\s+/g, "_"),
          label: row.label.trim(),
          image: row.image.trim()
        }))
        .filter((row) => row.label && row.image);

      const res = await fetch("/api/admin/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editing.id,
          name: editing.name.trim(),
          description: editing.description.trim(),
          price: priceNum,
          stock: stockNum,
          imageUrl: editing.imageUrl.trim(),
          category: editing.category.trim(),
          colors: colorPayload,
          sizes: editing.selectedSizes
        })
      });
      const data = (await res.json()) as { message?: string };
      if (!res.ok) {
        setError(data.message || "Failed to update product.");
        return;
      }
      invalidateProductCatalog();
      setMessage("Product updated.");
      setEditing(null);
      await reloadProducts();
    } catch {
      setError("Network error while updating.");
    } finally {
      setSavingEdit(false);
    }
  }

  if (authorized === null) {
    return (
      <main style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px" }}>
        Checking admin session…
      </main>
    );
  }

  if (!authorized) {
    return null;
  }

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px 120px" }}>
      <p style={{ marginBottom: 16 }}>
        <Link href="/admin" className="btn btn-secondary" style={{ display: "inline-block" }}>
          ← Admin home
        </Link>
      </p>

      <AdminProductsWorkspaceNav />

      <h1 style={{ marginBottom: 8, fontFamily: "var(--font-heading, serif)" }}>Manage catalog</h1>
      <p style={{ marginBottom: 24, color: "var(--color-text-secondary)", lineHeight: 1.55 }}>
        Edit products or mark them for removal. Nothing is removed from the shop until you click{" "}
        <strong>Save deletions</strong>. Built-in products stay hidden after delete until you restore them in Supabase
        if needed.
      </p>

      {loadErr && <p className="form-error" style={{ marginBottom: 16 }}>{loadErr}</p>}
      {message && (
        <p style={{ marginBottom: 16, padding: "12px 14px", background: "#ecfccb", borderRadius: 8, color: "#365314" }}>
          {message}
        </p>
      )}
      {error && <p className="form-error" style={{ marginBottom: 16 }}>{error}</p>}

      {editing && (
        <div style={{ marginBottom: 14, border: "1px solid var(--color-border)", borderRadius: 10, padding: 12 }}>
          <h2 style={{ marginTop: 0, marginBottom: 10, fontSize: "1.1rem" }}>Editing: {editing.name}</h2>
          <div style={{ display: "grid", gap: 10 }}>
            <input className="nav-search" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} placeholder="Product name" />
            <textarea className="nav-search" rows={4} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <input className="nav-search" value={editing.price} onChange={(e) => setEditing({ ...editing, price: e.target.value })} placeholder="Price" />
              <input className="nav-search" value={editing.stock} onChange={(e) => setEditing({ ...editing, stock: e.target.value })} placeholder="Stock" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 8 }}>
              <input className="nav-search" value={editing.imageUrl} onChange={(e) => setEditing({ ...editing, imageUrl: e.target.value })} placeholder="Primary image URL" />
              <label className="btn btn-secondary" style={{ cursor: "pointer" }}>
                Upload image
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  style={{ display: "none" }}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    e.target.value = "";
                    if (!file) return;
                    try {
                      const url = await uploadImageFile(file);
                      setEditing((prev) => (prev ? { ...prev, imageUrl: url } : prev));
                    } catch (err) {
                      setError(err instanceof Error ? err.message : "Upload failed.");
                    }
                  }}
                />
              </label>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {AVAILABLE_SIZES.map((sz) => (
                <button
                  key={sz}
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => toggleEditSize(sz)}
                  style={{ opacity: editing.selectedSizes.includes(sz) ? 1 : 0.55 }}
                >
                  {sz}
                </button>
              ))}
            </div>
            <div style={{ display: "grid", gap: 8 }}>
              {editing.colorImages.map((row, i) => (
                <div key={`${row.image}-${i}`} style={{ display: "grid", gridTemplateColumns: "56px 1fr 1fr auto", gap: 8, alignItems: "center" }}>
                  <img src={row.image} alt={row.label} style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 8, border: "1px solid var(--color-border)" }} />
                  <input className="nav-search" value={row.label} onChange={(e) => updateEditColor(i, { label: e.target.value })} placeholder="Color name" />
                  <input className="nav-search" value={row.image} onChange={(e) => updateEditColor(i, { image: e.target.value })} placeholder="Color image URL" />
                  <button type="button" className="btn btn-secondary" onClick={() => removeEditColor(i)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button type="button" className="btn" onClick={handleSaveEdit} disabled={savingEdit}>
                {savingEdit ? "Saving…" : "Save changes"}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setEditing(null)} disabled={savingEdit}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <section>
        <h2 style={{ marginBottom: 12, fontFamily: "var(--font-heading, serif)", fontSize: "1.05rem" }}>All products</h2>
        <div style={{ display: "grid", gap: 8 }}>
          {allProducts.map((p) => {
            const marked = pendingDeleteIds.includes(p.id);
            return (
              <div
                key={p.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto auto",
                  gap: 8,
                  alignItems: "center",
                  padding: "10px 12px",
                  border: marked ? "1px solid #fca5a5" : "1px solid var(--color-border)",
                  borderRadius: 8,
                  background: marked ? "#fef2f2" : undefined,
                  opacity: marked ? 0.92 : 1
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600, textDecoration: marked ? "line-through" : undefined }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>
                    {p.category} · {p.id}
                    {marked ? " · marked for deletion" : ""}
                  </div>
                </div>
                <button type="button" className="btn btn-secondary" onClick={() => startEditing(p)} disabled={marked} title={marked ? "Undo removal to edit" : "Edit product"}>
                  Edit
                </button>
                <button type="button" className={marked ? "btn" : "btn btn-secondary"} onClick={() => togglePendingDelete(p.id)} disabled={applyingDeletes}>
                  {marked ? "Undo remove" : "Mark for removal"}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {pendingDeleteIds.length > 0 && (
        <div
          style={{
            position: "sticky",
            bottom: 0,
            marginTop: 24,
            padding: "14px 16px",
            borderRadius: 10,
            border: "1px solid var(--color-border)",
            background: "var(--color-surface, #fff)",
            boxShadow: "0 -8px 24px rgba(0,0,0,0.08)",
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <p style={{ margin: 0, flex: "1 1 200px", color: "var(--color-text-secondary)", fontSize: 14 }}>
            <strong>{pendingDeleteIds.length}</strong> product(s) marked for removal. The catalog is unchanged until you
            save.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <button type="button" className="btn btn-secondary" onClick={clearPendingDeletes} disabled={applyingDeletes}>
              Clear marks
            </button>
            <button type="button" className="btn" onClick={() => void applyPendingDeletes()} disabled={applyingDeletes}>
              {applyingDeletes ? "Deleting…" : "Save deletions"}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
