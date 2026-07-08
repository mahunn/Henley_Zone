"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Product, ProductColor } from "@/types/commerce";
import { invalidateProductCatalog } from "@/lib/product-catalog-client";
import { AdminProductsWorkspaceNav } from "@/components/admin/admin-products-workspace-nav";
import { AdminIconButton, AdminIconLink, AdminIconToolbar } from "@/components/admin/admin-icon-button";
import {
  IconEdit,
  IconHome,
  IconSave,
  IconSpinner,
  IconTrash,
  IconUndo,
  IconUpload,
  IconX
} from "@/components/admin/admin-icons";
import { categories as staticCategories } from "@/data/categories";
import { categoryLabelBn } from "@/config/ui-bn";

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
  const [existingCategories, setExistingCategories] = useState<string[]>([]);
  const [loadErr, setLoadErr] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<EditFormState | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [pendingDeleteIds, setPendingDeleteIds] = useState<string[]>([]);
  const [applyingDeletes, setApplyingDeletes] = useState(false);
  const [uploadingColorImages, setUploadingColorImages] = useState(false);

  const [syncing, setSyncing] = useState(false);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState("");
  const [syncErrorMsg, setSyncErrorMsg] = useState("");

  const needsSync = allProducts.some(
    (p) =>
      p.imageUrl.startsWith("/products/") ||
      (p.colors && p.colors.some((c) => c.image.startsWith("/")))
  );

  async function handleSyncSeeds() {
    setSyncing(true);
    setSyncSuccessMsg("");
    setSyncErrorMsg("");
    try {
      const res = await fetch("/api/admin/products/sync-seeds", {
        method: "POST"
      });
      const data = (await res.json()) as { ok?: boolean; message?: string };
      if (!res.ok) {
        setSyncErrorMsg(data.message || "Failed to sync products.");
        return;
      }
      setSyncSuccessMsg(data.message || "Products synced successfully!");
      invalidateProductCatalog();
      await reloadProducts();
    } catch {
      setSyncErrorMsg("Network error during sync.");
    } finally {
      setSyncing(false);
    }
  }

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
        const products = data.products ?? [];
        setAllProducts(products);
        const cats = Array.from(
          new Set([
            ...staticCategories.map((c) => c.id),
            ...products.map((p) => p.category)
          ])
        ).sort();
        setExistingCategories(cats);
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
    const products = data.products ?? [];
    setAllProducts(products);
    setExistingCategories(
      Array.from(
        new Set([
          ...staticCategories.map((c) => c.id),
          ...products.map((p) => p.category)
        ])
      ).sort()
    );
    setLoadErr("");
  }

  function toColorRowsFromProduct(p: Product): ColorImageRow[] {
    return (p.colors ?? []).map((c) => ({ label: c.label, image: c.image }));
  }

  function makeColorLabelFromFileName(fileName: string): string {
    const base = fileName.replace(/\.[^/.]+$/, "");
    const cleaned = base.replace(/[-_]+/g, " ").trim();
    if (!cleaned) return "Color";
    return cleaned
      .split(/\s+/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");
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
        <AdminIconLink href="/admin" variant="ghost" label="Admin home">
          <IconHome />
        </AdminIconLink>
      </p>

      <AdminProductsWorkspaceNav />

      <h1 style={{ marginBottom: 8, fontFamily: "var(--font-heading, serif)" }}>Manage catalog</h1>
      <p style={{ marginBottom: 24, color: "var(--color-text-secondary)", lineHeight: 1.55 }}>
        Edit products or mark them for removal. Nothing is removed from the shop until you click{" "}
        <strong>Save deletions</strong>. Built-in products stay hidden after delete until you restore them in Supabase
        if needed.
      </p>

      <div
        style={{
          background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
          border: "1px solid var(--color-border)",
          borderRadius: "16px",
          padding: "20px",
          marginBottom: "24px",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          transition: "all 0.3s ease"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "20px" }}>☁️</span>
          <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700, fontFamily: "var(--font-heading, serif)" }}>
            Supabase Cloud Sync
          </h3>
        </div>
        <p style={{ margin: 0, fontSize: "13.5px", color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
          Seeded products are loaded from a local configuration file. Sync them to your Supabase Storage bucket and database table to make sure they are fully hosted, secure, and editable directly from your Supabase dashboard.
        </p>

        {allProducts.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 600 }}>
            {needsSync ? (
              <span style={{ color: "#d97706" }}>⚠️ Local seed images detected. Sync recommended.</span>
            ) : (
              <span style={{ color: "#16a34a" }}>✅ All seed products and images are synced to Supabase.</span>
            )}
          </div>
        )}

        {syncSuccessMsg && (
          <p style={{ margin: 0, padding: "10px 12px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px", color: "#166534", fontSize: "13px" }}>
            {syncSuccessMsg}
          </p>
        )}

        {syncErrorMsg && (
          <p style={{ margin: 0, padding: "10px 12px", background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: "8px", color: "#991b1b", fontSize: "13px" }}>
            {syncErrorMsg}
          </p>
        )}

        <div style={{ display: "flex", gap: "8px" }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleSyncSeeds}
            disabled={syncing}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              cursor: syncing ? "wait" : "pointer",
              padding: "8px 16px",
              borderRadius: "10px",
              border: "1px solid #0ea5e9",
              background: syncing ? "#f1f5f9" : "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
              color: syncing ? "#94a3b8" : "#fff",
              fontWeight: 600,
              fontSize: "13.5px",
              boxShadow: syncing ? "none" : "0 4px 12px rgba(14, 165, 233, 0.15)",
              transition: "all 0.2s ease"
            }}
          >
            {syncing ? (
              <>
                <IconSpinner size={16} />
                <span>Syncing products & images...</span>
              </>
            ) : (
              <>
                <span>Sync Seeds to Supabase</span>
              </>
            )}
          </button>
        </div>
      </div>

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
              <label className="admin-icon-btn admin-icon-btn--ghost" style={{ cursor: "pointer" }} title="Upload primary image" aria-label="Upload primary image">
                <span className="admin-icon-btn__glyph">
                  <IconUpload />
                </span>
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
              {editing.imageUrl ? (
                <div style={{ marginTop: 2, marginBottom: 6 }}>
                  <img
                    src={editing.imageUrl}
                    alt="Primary preview"
                    style={{ maxWidth: 120, maxHeight: 120, borderRadius: 8, objectFit: "cover", border: "1px solid var(--color-border)" }}
                  />
                </div>
              ) : null}
            </div>
            <fieldset style={{ border: "1px solid var(--color-border)", borderRadius: 10, padding: "14px 16px" }}>
              <legend style={{ fontWeight: 600, padding: "0 6px" }}>Category</legend>
              <select
                className="nav-search"
                value={editing.category}
                onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                style={{ width: "100%", background: "#fff" }}
              >
                <option value="">Select category…</option>
                {existingCategories.map((c) => {
                  const label = categoryLabelBn(c);
                  return (
                    <option key={c} value={c}>
                      {c === label ? c : `${c} (${label})`}
                    </option>
                  );
                })}
              </select>
            </fieldset>
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
            <fieldset style={{ border: "1px solid var(--color-border)", borderRadius: 10, padding: "14px 16px" }}>
              <legend style={{ fontWeight: 600, padding: "0 6px" }}>Color images (optional)</legend>
              <p style={{ margin: "0 0 10px", fontSize: 13, color: "var(--color-text-secondary)" }}>
                Upload multiple color images. Color name is auto-filled from file name and you can edit it.
              </p>
              <label style={{ display: "inline-flex", alignItems: "center", gap: 8, flexWrap: "wrap", cursor: uploadingColorImages ? "wait" : "pointer", marginBottom: 12 }}>
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  disabled={uploadingColorImages}
                  onChange={async (e) => {
                    const files = Array.from(e.target.files ?? []);
                    e.target.value = "";
                    if (files.length === 0) return;
                    setError("");
                    setUploadingColorImages(true);
                    try {
                      const uploaded: ColorImageRow[] = [];
                      for (const file of files) {
                        const url = await uploadImageFile(file);
                        uploaded.push({
                          label: makeColorLabelFromFileName(file.name),
                          image: url
                        });
                      }
                      setEditing((prev) =>
                        prev ? { ...prev, colorImages: [...prev.colorImages, ...uploaded] } : prev
                      );
                    } catch (err) {
                      setError(err instanceof Error ? err.message : "Color image upload failed.");
                    } finally {
                      setUploadingColorImages(false);
                    }
                  }}
                />
                {uploadingColorImages && (
                  <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>Uploading color images…</span>
                )}
              </label>

              {editing.colorImages.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {editing.colorImages.map((row, i) => (
                    <div key={`${row.image}-${i}`} style={{ display: "grid", gridTemplateColumns: "56px 1fr 1fr auto", gap: 8, alignItems: "center" }}>
                      <img src={row.image} alt={row.label} style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 8, border: "1px solid var(--color-border)" }} />
                      <input className="nav-search" value={row.label} onChange={(e) => updateEditColor(i, { label: e.target.value })} placeholder="Color name" />
                      <input className="nav-search" value={row.image} onChange={(e) => updateEditColor(i, { image: e.target.value })} placeholder="Color image URL" />
                      <AdminIconButton
                        type="button"
                        variant="danger"
                        label={`Remove color ${row.label}`}
                        onClick={() => removeEditColor(i)}
                      >
                        <IconTrash />
                      </AdminIconButton>
                    </div>
                  ))}
                </div>
              )}
            </fieldset>
            <AdminIconToolbar>
              <AdminIconButton
                type="button"
                variant="success"
                label={savingEdit ? "Saving product" : "Save product changes"}
                onClick={handleSaveEdit}
                disabled={savingEdit}
              >
                {savingEdit ? <IconSpinner /> : <IconSave />}
              </AdminIconButton>
              <AdminIconButton
                type="button"
                variant="ghost"
                label="Cancel editing"
                onClick={() => setEditing(null)}
                disabled={savingEdit}
              >
                <IconX />
              </AdminIconButton>
            </AdminIconToolbar>
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
                <AdminIconButton
                  type="button"
                  variant="primary"
                  label={marked ? "Undo removal to edit" : `Edit ${p.name}`}
                  onClick={() => startEditing(p)}
                  disabled={marked}
                >
                  <IconEdit />
                </AdminIconButton>
                <AdminIconButton
                  type="button"
                  variant={marked ? "warning" : "danger"}
                  label={marked ? "Undo removal mark" : `Mark ${p.name} for removal`}
                  onClick={() => togglePendingDelete(p.id)}
                  disabled={applyingDeletes}
                >
                  {marked ? <IconUndo /> : <IconTrash />}
                </AdminIconButton>
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
          <AdminIconToolbar>
            <AdminIconButton
              type="button"
              variant="ghost"
              label="Clear removal marks"
              onClick={clearPendingDeletes}
              disabled={applyingDeletes}
            >
              <IconUndo />
            </AdminIconButton>
            <AdminIconButton
              type="button"
              variant="danger"
              label={applyingDeletes ? "Deleting products" : "Save deletions permanently"}
              onClick={() => void applyPendingDeletes()}
              disabled={applyingDeletes}
            >
              {applyingDeletes ? <IconSpinner /> : <IconTrash />}
            </AdminIconButton>
          </AdminIconToolbar>
        </div>
      )}
    </main>
  );
}
