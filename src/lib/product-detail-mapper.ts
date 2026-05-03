import type { Product } from "@/types/commerce";

/** Shape expected by `ProductDetailView` */
export interface PdpDetail {
  id: string;
  slug: string;
  name: string;
  sku: string;
  brand: string;
  categories: string[];
  price: number;
  originalPrice?: number;
  stock: number;
  badge?: string;
  colors: { id: string; label: string; swatchImage: string }[];
  sizes: string[];
  images: string[];
  descriptionPoints: string[];
  specifications?: { label: string; value: string }[];
}

const defaultSizes = ["36", "38", "40", "42", "44", "46", "48"];

export function mapProductToPdpDetail(found: Product): PdpDetail {
  const hasColors = found.colors && found.colors.length > 0;
  const colorSwatches = hasColors
    ? found.colors!.map((c) => ({ id: c.id, label: c.label, swatchImage: c.image }))
    : [{ id: "default", label: "Default", swatchImage: found.imageUrl }];
  const galleryImages = hasColors ? found.colors!.map((c) => c.image) : [found.imageUrl];
  const sizes = found.sizes?.length ? found.sizes : defaultSizes;

  const desc = found.description.trim();
  const byNewline = desc.split(/\n+/).map((s) => s.trim()).filter(Boolean);
  const descriptionPoints =
    byNewline.length > 1
      ? byNewline
      : desc
          .split(".")
          .map((s) => s.trim())
          .filter(Boolean);

  const sizeLabel = sizes.join(", ");

  return {
    id: found.id,
    slug: found.slug,
    name: found.name,
    sku: `#${found.id.toUpperCase().slice(0, 8)}`,
    brand: "Henley Zone",
    categories: [found.category],
    price: found.price,
    originalPrice: undefined,
    stock: found.stock,
    badge: undefined,
    colors: colorSwatches,
    sizes,
    images: galleryImages,
    descriptionPoints:
      descriptionPoints.length > 0
        ? descriptionPoints
        : ["Premium quality product.", "Cash on delivery available.", "Delivery across Bangladesh."],
    specifications: [
      { label: "Category", value: found.category },
      {
        label: "Colors available",
        value: hasColors ? found.colors!.map((c) => c.label).join(", ") : "As shown"
      },
      { label: "Sizes", value: sizeLabel },
      { label: "Material", value: "Premium Cotton" },
      { label: "Care", value: "Machine wash cold" },
      { label: "Origin", value: "Bangladesh" }
    ]
  };
}
