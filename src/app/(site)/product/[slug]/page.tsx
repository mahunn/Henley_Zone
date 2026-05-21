import type { Metadata } from "next";
import { mapProductToPdpDetail } from "@/lib/product-detail-mapper";
import { getCachedProducts, getProductBySlug } from "@/lib/products-catalog-server";
import { ProductDetailShell } from "./product-detail-shell";

export const dynamicParams = true;
export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const products = await getCachedProducts();
    return products.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return { title: "Product" };
  }
  const description = product.description.trim().slice(0, 160);
  const image = product.colors?.[0]?.image ?? product.imageUrl;
  return {
    title: product.name,
    description: description || product.name,
    openGraph: {
      title: product.name,
      description: description || undefined,
      images: image ? [{ url: image }] : undefined
    }
  };
}

function productToRelated(p: { id: string; slug: string; name: string; category: string; imageUrl: string; price: number }) {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    category: p.category,
    image: p.imageUrl,
    price: p.price
  };
}

export default async function ProductPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug);
  const products = await getCachedProducts();
  const found = products.find((p) => p.slug === decoded) ?? null;
  const initialDetail = found ? mapProductToPdpDetail(found) : null;
  const initialRelated = products
    .filter((p) => p.slug !== decoded)
    .slice(0, 6)
    .map(productToRelated);

  const lcpImage = initialDetail?.images[0];

  return (
    <>
      {lcpImage ? (
        <link rel="preload" as="image" href={lcpImage} fetchPriority="high" />
      ) : null}
      <ProductDetailShell
        slug={decoded}
        initialDetail={initialDetail}
        initialRelated={initialRelated}
        skipCatalogUntilIdle={Boolean(initialDetail)}
      />
    </>
  );
}
