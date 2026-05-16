import { seedProducts } from "@/data/seed-products";
import { mapProductToPdpDetail } from "@/lib/product-detail-mapper";
import { ProductDetailShell } from "./product-detail-shell";

export const dynamicParams = true;

export function generateStaticParams() {
  return seedProducts.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug);
  const found = seedProducts.find((p) => p.slug === decoded);
  const initialDetail = found ? mapProductToPdpDetail(found) : null;

  return <ProductDetailShell slug={decoded} initialDetail={initialDetail} />;
}
