/** Normalize an explicit slug from the admin form (Latin letters, numbers, hyphens). */
export function normalizeProductSlug(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/[''`]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

/** URL-safe slug from a product name (ASCII fallback for mixed scripts). */
export function slugifyName(name: string): string {
  const base = normalizeProductSlug(name);
  if (base.length >= 3) return base;
  const fallback = `item-${Date.now().toString(36)}`;
  return base.length > 0 ? `${base}-${fallback}` : fallback;
}
