"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { CategoryItem } from "@/types/category";
import { getCategoriesCatalog, invalidateCategoriesCatalog } from "@/lib/categories-client";
import { AdminIconButton, AdminIconLink } from "@/components/admin/admin-icon-button";
import {
  IconCheck,
  IconEdit,
  IconHome,
  IconPlus,
  IconSave,
  IconSpinner,
  IconTrash,
  IconX
} from "@/components/admin/admin-icons";

export default function AdminCategoriesPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Form states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formNameBn, setFormNameBn] = useState("");
  const [formLabel, setFormLabel] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formImageUrl, setFormImageUrl] = useState("");
  const [formShowInNav, setFormShowInNav] = useState(true);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const verifySession = useCallback(async () => {
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
    void verifySession();
  }, [verifySession]);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    try {
      const list = await getCategoriesCatalog(true);
      setCategories(list);
    } catch {
      setError("Failed to load categories.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authorized) {
      void loadCategories();
    }
  }, [authorized, loadCategories]);

  function startAddingNew() {
    setEditingId(null);
    setFormTitle("");
    setFormNameBn("");
    setFormLabel("");
    setFormDescription("");
    setFormImageUrl("");
    setFormShowInNav(true);
    setIsAddingNew(true);
    setMessage("");
    setError("");
  }

  function startEditing(cat: CategoryItem) {
    setIsAddingNew(false);
    setEditingId(cat.id);
    setFormTitle(cat.title);
    setFormNameBn(cat.nameBn);
    setFormLabel(cat.label || "");
    setFormDescription(cat.description || "");
    setFormImageUrl(cat.imageUrl || "");
    setFormShowInNav(cat.showInNav !== false);
    setMessage("");
    setError("");
  }

  function cancelForm() {
    setIsAddingNew(false);
    setEditingId(null);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!formTitle.trim()) {
      setError("Category title is required.");
      return;
    }
    if (!formNameBn.trim()) {
      setError("Bangla name is required.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        id: editingId || formTitle.trim(),
        title: formTitle.trim(),
        nameBn: formNameBn.trim(),
        label: formLabel.trim(),
        description: formDescription.trim(),
        imageUrl: formImageUrl.trim(),
        showInNav: formShowInNav,
        order: editingId
          ? (categories.find((c) => c.id === editingId)?.order ?? 99)
          : categories.length + 1
      };

      const method = editingId ? "PUT" : "POST";
      const res = await fetch("/api/categories", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = (await res.json()) as { message?: string; categories?: CategoryItem[] };
      if (!res.ok) {
        setError(data.message || "Failed to save category.");
        return;
      }

      if (data.categories) {
        setCategories(data.categories);
      }
      invalidateCategoriesCatalog();
      setMessage(editingId ? `Category "${formTitle}" updated!` : `Category "${formTitle}" added successfully!`);
      cancelForm();
    } catch {
      setError("Network error while saving category.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(cat: CategoryItem) {
    if (!confirm(`Are you sure you want to delete category "${cat.title}" (${cat.nameBn})?`)) {
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/categories?id=${encodeURIComponent(cat.id)}`, {
        method: "DELETE"
      });
      const data = (await res.json()) as { message?: string; categories?: CategoryItem[] };

      if (!res.ok) {
        setError(data.message || "Failed to delete category.");
        return;
      }

      if (data.categories) {
        setCategories(data.categories);
      }
      invalidateCategoriesCatalog();
      setMessage(`Category "${cat.title}" removed.`);
    } catch {
      setError("Failed to delete category.");
    } finally {
      setSaving(false);
    }
  }

  async function handleMove(index: number, direction: "up" | "down") {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= categories.length) return;

    const listCopy = [...categories];
    const temp = listCopy[index];
    listCopy[index] = listCopy[targetIdx];
    listCopy[targetIdx] = temp;

    const reorderIds = listCopy.map((c) => c.id);

    setCategories(listCopy); // optimistic UI update
    try {
      const res = await fetch("/api/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reorderIds })
      });
      const data = (await res.json()) as { categories?: CategoryItem[] };
      if (res.ok && data.categories) {
        setCategories(data.categories);
        invalidateCategoriesCatalog();
      }
    } catch {
      // Revert if error
      void loadCategories();
    }
  }

  async function handleToggleNavVisibility(cat: CategoryItem) {
    const updated = { ...cat, showInNav: !cat.showInNav };

    try {
      const res = await fetch("/api/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated)
      });
      const data = (await res.json()) as { categories?: CategoryItem[] };
      if (res.ok && data.categories) {
        setCategories(data.categories);
        invalidateCategoriesCatalog();
      }
    } catch {
      void loadCategories();
    }
  }

  if (authorized === null || loading) {
    return (
      <main style={{ maxWidth: 760, margin: "0 auto", padding: "40px 24px" }}>
        Checking session & categories…
      </main>
    );
  }

  if (!authorized) return null;

  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "40px 24px" }}>
      <p style={{ marginBottom: 16 }}>
        <AdminIconLink href="/admin" variant="ghost" label="Admin home">
          <IconHome />
        </AdminIconLink>
      </p>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h1 style={{ margin: 0, fontFamily: "var(--font-heading, serif)" }}>Categories & Nav Order</h1>
        {!isAddingNew && !editingId && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={startAddingNew}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, cursor: "pointer" }}
          >
            <IconPlus size={18} /> Add New Category
          </button>
        )}
      </div>

      <p style={{ marginBottom: 24, color: "var(--color-text-secondary)", lineHeight: 1.55 }}>
        Manage category names (English & Bangla), add new categories (like <strong>Kurti / কুর্তি</strong>), toggle visibility, and adjust their position in the main header navigation bar.
      </p>

      {message && (
        <div style={{ marginBottom: 16, padding: "12px 14px", background: "#ecfccb", borderRadius: 8, color: "#365314" }}>
          {message}
        </div>
      )}
      {error && <div className="form-error" style={{ marginBottom: 16 }}>{error}</div>}

      {/* Add / Edit Form */}
      {(isAddingNew || editingId) && (
        <form
          onSubmit={handleSave}
          style={{
            background: "var(--color-surface, #fff)",
            border: "2px solid var(--color-primary, #0ea5e9)",
            borderRadius: 12,
            padding: 20,
            marginBottom: 24,
            display: "flex",
            flexDirection: "column",
            gap: 16
          }}
        >
          <h3 style={{ margin: 0, fontFamily: "var(--font-heading, serif)" }}>
            {editingId ? `Edit Category: ${editingId}` : "Add New Category"}
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontWeight: 600 }}>Category Name (English) *</span>
              <input
                className="nav-search"
                required
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="e.g. Kurti"
              />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontWeight: 600 }}>Name in Bangla (বাংলা) *</span>
              <input
                className="nav-search"
                required
                value={formNameBn}
                onChange={(e) => setFormNameBn(e.target.value)}
                placeholder="যেমন: কুর্তি"
              />
            </label>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontWeight: 600 }}>Tagline / Label (Optional)</span>
              <input
                className="nav-search"
                value={formLabel}
                onChange={(e) => setFormLabel(e.target.value)}
                placeholder="e.g. Modern Kurti Collection"
              />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontWeight: 600 }}>Image URL (Optional)</span>
              <input
                className="nav-search"
                value={formImageUrl}
                onChange={(e) => setFormImageUrl(e.target.value)}
                placeholder="/products/kurti/frog1/magenda.jpeg"
              />
            </label>
          </div>

          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontWeight: 600 }}>Description (Optional)</span>
            <input
              className="nav-search"
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="Short category description"
            />
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontWeight: 600 }}>
            <input
              type="checkbox"
              checked={formShowInNav}
              onChange={(e) => setFormShowInNav(e.target.checked)}
              style={{ width: 18, height: 18 }}
            />
            Show this category in top navigation bar
          </label>

          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, cursor: "pointer" }}
            >
              {saving ? <IconSpinner size={18} /> : <IconSave size={18} />}
              {editingId ? "Save Changes" : "Create Category"}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={cancelForm}
              disabled={saving}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, cursor: "pointer" }}
            >
              <IconX size={18} /> Cancel
            </button>
          </div>
        </form>
      )}

      {/* Category List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {categories.map((cat, idx) => (
          <div
            key={cat.id}
            style={{
              display: "grid",
              gridTemplateColumns: "40px 1fr auto auto",
              gap: 12,
              alignItems: "center",
              padding: "14px 16px",
              background: "#fff",
              border: "1px solid var(--color-border, #e2e8f0)",
              borderRadius: 10,
              boxShadow: "0 1px 3px rgba(0,0,0,0.03)"
            }}
          >
            {/* Reorder Buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <button
                type="button"
                onClick={() => handleMove(idx, "up")}
                disabled={idx === 0}
                style={{
                  border: "none",
                  background: "none",
                  cursor: idx === 0 ? "default" : "pointer",
                  opacity: idx === 0 ? 0.3 : 0.8,
                  fontSize: 16,
                  lineHeight: 1
                }}
                title="Move Up"
              >
                ▲
              </button>
              <button
                type="button"
                onClick={() => handleMove(idx, "down")}
                disabled={idx === categories.length - 1}
                style={{
                  border: "none",
                  background: "none",
                  cursor: idx === categories.length - 1 ? "default" : "pointer",
                  opacity: idx === categories.length - 1 ? 0.3 : 0.8,
                  fontSize: 16,
                  lineHeight: 1
                }}
                title="Move Down"
              >
                ▼
              </button>
            </div>

            {/* Information */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontWeight: 700, fontSize: 16 }}>{cat.title}</span>
                <span
                  style={{
                    background: "#e0f2fe",
                    color: "#0369a1",
                    padding: "2px 8px",
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: 600
                  }}
                >
                  {cat.nameBn}
                </span>
                {cat.id === "Kurti" && (
                  <span style={{ background: "#fef08a", color: "#854d0e", fontSize: 11, padding: "2px 6px", borderRadius: 4, fontWeight: 700 }}>
                    NEW
                  </span>
                )}
              </div>
              {cat.description && (
                <div style={{ fontSize: 13, color: "var(--color-text-secondary)", marginTop: 2 }}>
                  {cat.description}
                </div>
              )}
            </div>

            {/* Nav Visibility Toggle */}
            <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={cat.showInNav !== false}
                onChange={() => handleToggleNavVisibility(cat)}
                style={{ width: 16, height: 16 }}
              />
              In Nav Bar
            </label>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: 6 }}>
              <AdminIconButton
                type="button"
                variant="ghost"
                label={`Edit ${cat.title}`}
                onClick={() => startEditing(cat)}
              >
                <IconEdit />
              </AdminIconButton>
              <AdminIconButton
                type="button"
                variant="danger"
                label={`Delete ${cat.title}`}
                onClick={() => handleDelete(cat)}
              >
                <IconTrash />
              </AdminIconButton>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
