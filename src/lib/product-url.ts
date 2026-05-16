/** Canonical fast product page (use in ads, Buy Now, and internal links). */
export function productPagePath(slug: string): string {
  return `/product/${encodeURIComponent(slug)}`;
}
