import type { CartItem } from "@/types/commerce";

/** Human-readable line for admin UI + order storage (includes color/size when present). */
export function formatOrderItemLabel(item: CartItem): string {
  const extras: string[] = [];

  const color = item.selectedColor?.trim();
  if (color && !item.name.toLowerCase().includes(color.toLowerCase())) {
    extras.push(color);
  }

  const size = item.selectedSize?.trim();
  if (size && !/\bsize\s*[\d]+/i.test(item.name)) {
    extras.push(`Size ${size}`);
  }

  if (extras.length === 0) return item.name;

  const base = item.name.trim();
  if (base.includes("(") && base.endsWith(")")) {
    return `${base.slice(0, -1)}, ${extras.join(", ")})`;
  }
  return `${base} (${extras.join(", ")})`;
}
