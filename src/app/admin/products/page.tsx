"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Product, ProductColor } from "@/types/commerce";
import { invalidateProductCatalog } from "@/lib/product-catalog-client";
import { AdminProductsWorkspaceNav } from "@/components/admin/admin-products-workspace-nav";

const AVAILABLE_SIZES = ["32", "34", "36", "38", "40", "42", "44", "46", "48"];
type ColorImageRow = { label: string; image: string };

export default function AdminProductsPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [existingCategories, setExistingCategories] = useState<string[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loadErr, setLoadErr] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("20");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState("");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [colorImages, setColorImages] = useState<ColorImageRow[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [uploadingPrimary, setUploadingPrimary] = useState(false);
  const [uploadingColorImages, setUploadingColorImages] = useState(false);

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
    async function loadProductsAndCats() {
      try {
        const res = await fetch("/api/products", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as { products: Product[] };
        const products = data.products ?? [];
        setAllProducts(products);
        const cats = Array.from(new Set(products.map((p) => p.category))).sort();
        setExistingCategories(cats);
        setLoadErr("");
      } catch {
        setLoadErr("Could not load categories.");
      }
    }
    if (authorized) void loadProductsAndCats();
  }, [authorized]);

  async function reloadProductsAndCats() {
    const res = await fetch("/api/products", { cache: "no-store" });
    if (!res.ok) return;
    const data = (await res.json()) as { products: Product[] };
    const products = data.products ?? [];
    setAllProducts(products);
    setExistingCategories(Array.from(new Set(products.map((p) => p.category))).sort());
  }

  function toggleSize(size: string) {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
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

  function updateColorImageRow(i: number, patch: Partial<ColorImageRow>) {
    setColorImages((prev) => prev.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));
  }

  function removeColorImageRow(i: number) {
    setColorImages((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function onSubmit(e: React.FormEvent) {
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

    const colorPayload: ProductColor[] = colorImages
      .map((row) => ({
        id: row.label.trim().toLowerCase().replace(/\s+/g, "_"),
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
          description: description.trim(),
          price: priceNum,
          stock: stockNum,
          imageUrl: imageUrl.trim(),
          category: category.trim(),
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
      setDescription("");
      setPrice("");
      setStock("20");
      setImageUrl("");
      setCategory("");
      setSelectedSizes([]);
      setColorImages([]);
      await reloadProductsAndCats();
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

      <AdminProductsWorkspaceNav />

      <h1 style={{ marginBottom: 8, fontFamily: "var(--font-heading, serif)" }}>Add product</h1>
      <p style={{ marginBottom: 24, color: "var(--color-text-secondary)", lineHeight: 1.55 }}>
        Add products under existing sections only (Two Pieces, Three Pieces, Salwar Kameez, etc). Upload images directly from device, paste full Bangla details, and keep the form simple for daily use. To edit or remove products, switch to <strong>Manage catalog</strong> above.
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
        <p style={{ margin: 0, fontSize: 13, color: "var(--color-text-secondary)" }}>
          Product link is created automatically from product name (no slug setup needed).
        </p>

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
        </div>

        <fieldset style={{ border: "1px solid var(--color-border)", borderRadius: 10, padding: "14px 16px" }}>
          <legend style={{ fontWeight: 600, padding: "0 6px" }}>Category</legend>
          <select
            className="nav-search"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select existing category…</option>
            {existingCategories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </fieldset>

        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontWeight: 600 }}>Available sizes</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {AVAILABLE_SIZES.map((sz) => {
              const active = selectedSizes.includes(sz);
              return (
                <button
                  key={sz}
                  type="button"
                  onClick={() => toggleSize(sz)}
                  style={{
                    minWidth: 52,
                    minHeight: 40,
                    borderRadius: 10,
                    border: active ? "1px solid var(--color-primary)" : "1px solid var(--color-border)",
                    background: active ? "rgba(14,165,233,0.12)" : "#fff",
                    color: active ? "var(--color-primary-dark)" : "var(--color-text-primary)",
                    fontWeight: 700,
                    cursor: "pointer"
                  }}
                  aria-pressed={active}
                >
                  {sz}
                </button>
              );
            })}
          </div>
        </label>

        <fieldset style={{ border: "1px solid var(--color-border)", borderRadius: 10, padding: "14px 16px" }}>
          <legend style={{ fontWeight: 600, padding: "0 6px" }}>Color images (optional)</legend>
          <p style={{ margin: "0 0 10px", fontSize: 13, color: "var(--color-text-secondary)" }}>
            Upload multiple color images in one go. Color name is auto-filled from file name and you can edit it.
          </p>
          <label style={{ display: "inline-flex", alignItems: "center", gap: 8, flexWrap: "wrap", cursor: uploadingColorImages ? "wait" : "pointer" }}>
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
                  setColorImages((prev) => [...prev, ...uploaded]);
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

          {colorImages.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
              {colorImages.map((row, i) => (
                <div
                  key={`${row.image}-${i}`}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "56px 1fr auto",
                    gap: 10,
                    alignItems: "center"
                  }}
                >
                  <img
                    src={row.image}
                    alt={row.label}
                    style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 8, border: "1px solid var(--color-border)" }}
                  />
                  <input
                    className="nav-search"
                    value={row.label}
                    onChange={(e) => updateColorImageRow(i, { label: e.target.value })}
                    placeholder="Color name"
                  />
                  <button type="button" className="btn btn-secondary" onClick={() => removeColorImageRow(i)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </fieldset>

        <button type="submit" className="btn" disabled={submitting}>
          {submitting ? "Saving…" : "Create product"}
        </button>
      </form>
    </main>
  );
}
