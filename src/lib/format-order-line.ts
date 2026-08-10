import type { CartItem } from "@/types/commerce";

/** Human-readable line for admin UI + order storage (includes color/size when present). 100% crash-proof against null/undefined. */
export function formatOrderItemLabel(item: Partial<CartItem> | null | undefined): string {
  if (!item) return "Product";
  const name = (typeof item.name === "string" ? item.name : "Product").trim();
  const extras: string[] = [];

  const color = typeof item.selectedColor === "string" ? item.selectedColor.trim() : "";
  if (color && !name.toLowerCase().includes(color.toLowerCase())) {
    extras.push(color);
  }

  const size = typeof item.selectedSize === "string" ? item.selectedSize.trim() : "";
  if (size && !/\bsize\s*[\d]+/i.test(name)) {
    extras.push(`Size ${size}`);
  }

  if (extras.length === 0) return name;

  if (name.includes("(") && name.endsWith(")")) {
    return `${name.slice(0, -1)}, ${extras.join(", ")})`;
  }
  return `${name} (${extras.join(", ")})`;
}
