"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Product, ProductColor } from "@/types/commerce";
import { invalidateProductCatalog } from "@/lib/product-catalog-client";

type ColorRow = { id: string; label: string; image: string };

const emptyColor = (): ColorRow => ({ id: "", label: "", image: "" });

export default function AdminProductsPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [existingCategories, setExistingCategories] = useState<string[]>([]);
  const [loadErr, setLoadErr] = useState("");

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("20");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState("");
  const [useNewCategory, setUseNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [sizesInput, setSizesInput] = useState("36, 38, 40, 42, 44, 46, 48");
  const [colors, setColors] = useState<ColorRow[]>([emptyColor()]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [uploadingPrimary, setUploadingPrimary] = useState(false);
  const [uploadingColorIdx, setUploadingColorIdx] = useState<number | null>(null);

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
      const res = await fetch("/api/orders", { method: "GET", cache: "no-store" });
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
    async function loadCats() {
      try {
        const res = await fetch("/api/products", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as { products: Product[] };
        const cats = Array.from(new Set((data.products ?? []).map((p) => p.category))).sort();
        setExistingCategories(cats);
        setLoadErr("");
      } catch {
        setLoadErr("Could not load categories.");
      }
    }
    if (authorized) void loadCats();
  }, [authorized]);

  const effectiveCategory = useMemo(() => {
    if (useNewCategory) return newCategoryName.trim();
    return category.trim();
  }, [useNewCategory, newCategoryName, category]);

  function addColorRow() {
    setColors((c) => [...c, emptyColor()]);
  }

  function removeColorRow(i: number) {
    setColors((c) => (c.length <= 1 ? c : c.filter((_, j) => j !== i)));
  }

  function updateColorRow(i: number, patch: Partial<ColorRow>) {
    setColors((c) => c.map((row, j) => (j === i ? { ...row, ...patch } : row)));
  }

  function copyPrimaryToRow(i: number) {
    if (!imageUrl.trim()) return;
    updateColorRow(i, { image: imageUrl.trim() });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    setError("");
    if (!effectiveCategory) {
      setError("Choose an existing category or enter a new category name.");
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
      setError("Add a primary image by uploading a file or pasting an image URL.");
      return;
    }
    const sizes = sizesInput
      .split(/[,،\n]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (sizes.length === 0) {
      setError("Enter at least one size (comma-separated).");
      return;
    }

    const colorPayload: ProductColor[] = colors
      .map((row) => ({
        id: row.id.trim() || row.label.trim().toLowerCase().replace(/\s+/g, "_"),
        label: row.label.trim(),
        image: row.image.trim()
      }))
      .filter((row) => row.label && row.image);

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          slug: slug.trim() || undefined,
          description: description.trim(),
          price: priceNum,
          stock: stockNum,
          imageUrl: imageUrl.trim(),
          category: effectiveCategory,
          colors: colorPayload,
          sizes
        })
      });
      const data = (await res.json()) as { message?: string; product?: Product };
      if (!res.ok) {
        setError(data.message || "Save failed.");
        return;
      }
      invalidateProductCatalog();
      setMessage(`Product “${data.product?.name ?? name}” was created.`);
      setName("");
      setSlug("");
      setDescription("");
      setPrice("");
      setStock("20");
      setImageUrl("");
      setCategory("");
      setNewCategoryName("");
      setSizesInput("36, 38, 40, 42, 44, 46, 48");
      setColors([emptyColor()]);
      setUseNewCategory(false);
      const res2 = await fetch("/api/products", { cache: "no-store" });
      if (res2.ok) {
        const d2 = (await res2.json()) as { products: Product[] };
        const cats = Array.from(new Set((d2.products ?? []).map((p) => p.category))).sort();
        setExistingCategories(cats);
      }
    } catch {
      setError("Network error while saving.");
    } finally {
      setSubmitting(false);
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
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px" }}>
      <p style={{ marginBottom: 16 }}>
        <Link href="/admin" className="btn btn-secondary" style={{ display: "inline-block" }}>
          ← Admin home
        </Link>
      </p>
      <h1 style={{ marginBottom: 8, fontFamily: "var(--font-heading, serif)" }}>Add product</h1>
      <p style={{ marginBottom: 24, color: "var(--color-text-secondary)", lineHeight: 1.55 }}>
        Create a product in an existing category or type a new category name. For launch you can rely on <strong>paste image URL only</strong> (e.g. <code style={{ fontSize: 13 }}>/products/…</code> under <code style={{ fontSize: 13 }}>public/</code> or any https link) — no file-upload or Storage setup is required until you want it.
        Optional later: <strong>upload images</strong> (JPEG/PNG/WebP/GIF, up to 5&nbsp;MB) via Supabase Storage or local <code style={{ fontSize: 13 }}>public/uploads/catalog/</code> — see <code style={{ fontSize: 13 }}>supabase/migrations</code> for the <code style={{ fontSize: 13 }}>product-images</code> bucket.
        Saving new products to the database still needs Supabase and the <code style={{ fontSize: 13 }}>products</code> table (run migrations for <code style={{ fontSize: 13 }}>colors_json</code> / <code style={{ fontSize: 13 }}>sizes_json</code> if your table does not have them yet).
      </p>

      {loadErr && <p className="form-error" style={{ marginBottom: 16 }}>{loadErr}</p>}
      {message && (
        <p style={{ marginBottom: 16, padding: "12px 14px", background: "#ecfccb", borderRadius: 8, color: "#365314" }}>
          {message}
        </p>
      )}
      {error && <p className="form-error" style={{ marginBottom: 16 }}>{error}</p>}

      <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontWeight: 600 }}>Product name</span>
          <input
            className="nav-search"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Printed Salwar Kameez"
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontWeight: 600 }}>URL slug (optional)</span>
          <input
            className="nav-search"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="auto-generated from name if left blank"
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontWeight: 600 }}>Description</span>
          <textarea
            className="nav-search"
            required
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Full description. You can use line breaks; they appear as bullet points on the product page."
            style={{ minHeight: 120, resize: "vertical" }}
          />
        </label>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontWeight: 600 }}>Price (৳)</span>
            <input
              className="nav-search"
              required
              inputMode="decimal"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="899"
            />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontWeight: 600 }}>Stock</span>
            <input
              className="nav-search"
              required
              inputMode="numeric"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
          </label>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={{ fontWeight: 600 }}>Primary image</span>
          <label
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              flexWrap: "wrap",
              cursor: uploadingPrimary ? "wait" : "pointer"
            }}
          >
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              disabled={uploadingPrimary}
              style={{ maxWidth: "100%" }}
              onChange={async (e) => {
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
                } finally {
                  setUploadingPrimary(false);
                }
              }}
            />
            {uploadingPrimary && (
              <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>Uploading…</span>
            )}
          </label>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Primary preview"
              style={{ maxWidth: 200, maxHeight: 200, borderRadius: 8, objectFit: "cover", border: "1px solid var(--color-border)" }}
            />
          ) : null}
          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontWeight: 500, fontSize: 14 }}>Or paste image URL</span>
            <input
              className="nav-search"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://… or /products/… (required if you did not upload)"
            />
          </label>
        </div>

        <fieldset style={{ border: "1px solid var(--color-border)", borderRadius: 10, padding: "14px 16px" }}>
          <legend style={{ fontWeight: 600, padding: "0 6px" }}>Category</legend>
          <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, cursor: "pointer" }}>
            <input
              type="radio"
              checked={!useNewCategory}
              onChange={() => setUseNewCategory(false)}
            />
            Existing category
          </label>
          {!useNewCategory && (
            <select
              className="nav-search"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ marginBottom: 12 }}
            >
              <option value="">Select…</option>
              {existingCategories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          )}
          <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, cursor: "pointer" }}>
            <input
              type="radio"
              checked={useNewCategory}
              onChange={() => setUseNewCategory(true)}
            />
            New category
          </label>
          {useNewCategory && (
            <input
              className="nav-search"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Type a new category name"
            />
          )}
        </fieldset>

        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontWeight: 600 }}>Sizes (comma-separated)</span>
          <input
            className="nav-search"
            required
            value={sizesInput}
            onChange={(e) => setSizesInput(e.target.value)}
            placeholder="36, 38, 40, 42 or S, M, L, XL"
          />
        </label>

        <fieldset style={{ border: "1px solid var(--color-border)", borderRadius: 10, padding: "14px 16px" }}>
          <legend style={{ fontWeight: 600, padding: "0 6px" }}>Color variants (optional)</legend>
          <p style={{ margin: "0 0 12px", fontSize: 13, color: "var(--color-text-secondary)" }}>
            Leave rows empty to show only the primary image. Each variant needs a label and an image (upload or URL).
          </p>
          {colors.map((row, i) => (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
                marginBottom: 10,
                paddingBottom: 10,
                borderBottom: i < colors.length - 1 ? "1px solid var(--color-border)" : "none"
              }}
            >
              <input
                className="nav-search"
                placeholder="Color label"
                value={row.label}
                onChange={(e) => updateColorRow(i, { label: e.target.value })}
              />
              <input
                className="nav-search"
                placeholder="Image URL"
                value={row.image}
                onChange={(e) => updateColorRow(i, { image: e.target.value })}
              />
              <div style={{ gridColumn: "1 / -1", display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                <label style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer" }}>
                  <span>Upload:</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    disabled={uploadingColorIdx === i}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      e.target.value = "";
                      if (!file) return;
                      setError("");
                      setUploadingColorIdx(i);
                      try {
                        const url = await uploadImageFile(file);
                        updateColorRow(i, { image: url });
                      } catch (err) {
                        setError(err instanceof Error ? err.message : "Upload failed.");
                      } finally {
                        setUploadingColorIdx(null);
                      }
                    }}
                  />
                  {uploadingColorIdx === i && <span style={{ color: "var(--color-text-secondary)" }}>…</span>}
                </label>
                <button type="button" className="btn btn-secondary" style={{ fontSize: 13 }} onClick={() => copyPrimaryToRow(i)}>
                  Use primary image URL
                </button>
                <button type="button" className="btn btn-secondary" style={{ fontSize: 13 }} onClick={() => removeColorRow(i)}>
                  Remove row
                </button>
              </div>
            </div>
          ))}
          <button type="button" className="btn btn-secondary" onClick={addColorRow}>
            + Add color row
          </button>
        </fieldset>

        <button type="submit" className="btn" disabled={submitting}>
          {submitting ? "Saving…" : "Create product"}
        </button>
      </form>
    </main>
  );
}
