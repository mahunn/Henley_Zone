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

function cleanPoint(text: string): string {
  return text
    .replace(/^[•\-–—*✅❤️🚚◾☎️👉✨🪧📏📐#\s]+/u, "")
    .replace(/\s+/g, " ")
    .trim();
}

function toDescriptionPoints(description: string): string[] {
  const raw = description.trim();
  if (!raw) return [];

  const byLines = raw.split(/\r?\n+/).map((s) => s.trim()).filter(Boolean);
  const seed = byLines.length > 1 ? byLines : [raw];

  const splitByMarkers = seed.flatMap((line) =>
    line
      .split(/(?=[✅❤️🚚◾☎️👉✨🪧📏📐#])/u)
      .map((s) => s.trim())
      .filter(Boolean)
  );

  const refined = splitByMarkers.flatMap((line) => {
    if (line.length <= 140) return [line];
    return line
      .split(/[।.!?]+/u)
      .map((s) => s.trim())
      .filter(Boolean);
  });

  const points = refined.map(cleanPoint).filter(Boolean);
  return points.length > 0 ? points.slice(0, 24) : [];
}

export function mapProductToPdpDetail(found: Product): PdpDetail {
  const hasColors = found.colors && found.colors.length > 0;
  const colorSwatches = hasColors
    ? found.colors!.map((c) => ({ id: c.id, label: c.label, swatchImage: c.image }))
    : [{ id: "default", label: "Default", swatchImage: found.imageUrl }];
  const galleryImages = hasColors ? found.colors!.map((c) => c.image) : [found.imageUrl];
  const sizes = found.sizes?.length ? found.sizes : defaultSizes;

  const desc = found.description.trim();
  const descriptionPoints = toDescriptionPoints(desc);

  const sizeLabel = sizes.join(", ");
  const hasCotton = /cotton|কটন|সুতি/i.test(desc);
  const deliveryMatch = desc.match(/ঢাকা[^।\n]*?৮০[^।\n]*|ঢাকার বাইরে[^।\n]*?১৫০[^।\n]*/i);
  const contactMatch = desc.match(/(?:\+?88)?01[3-9]\d{8}/);

  const specs: { label: string; value: string }[] = [
    { label: "Category", value: found.category },
    {
      label: "Colors available",
      value: hasColors ? found.colors!.map((c) => c.label).join(", ") : "As shown"
    },
    { label: "Sizes", value: sizeLabel },
    { label: "Material", value: hasCotton ? "Premium Cotton" : "Premium Quality Fabric" },
    { label: "Care", value: "Machine wash cold" },
    { label: "Origin", value: "Bangladesh" }
  ];

  if (deliveryMatch) {
    specs.push({ label: "Delivery", value: cleanPoint(deliveryMatch[0]) });
  }
  if (contactMatch) {
    specs.push({ label: "Contact", value: contactMatch[0] });
  }

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
    specifications: specs
  };
}
