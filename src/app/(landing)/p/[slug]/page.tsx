import type { Metadata } from "next";
import { getCachedProducts, getProductBySlug } from "../../../../lib/products-catalog-server";
import { mapProductToPdpDetail } from "../../../../lib/product-detail-mapper";
import { LandingProductPage } from "./landing-product-page";

// Force VS Code tsserver type refresh

export const dynamicParams = true;
export const revalidate = 3600;

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
    title: `${product.name} — অর্ডার করুন`,
    description: description || product.name,
    openGraph: {
      title: `${product.name} — অর্ডার করুন`,
      description: description || undefined,
      images: image ? [{ url: image }] : undefined
    }
  };
}

export default async function LandingPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug);
  const product = await getProductBySlug(decoded);
  const detail = product ? mapProductToPdpDetail(product) : null;

  const lcpImage = detail?.images[0];

  const jsonLd = product
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        image: product.imageUrl ? [product.imageUrl] : [],
        description: product.description.trim().slice(0, 160) || product.name,
        sku: `HENLEY-${product.id.toUpperCase().slice(0, 8)}`,
        offers: {
          "@type": "Offer",
          url: `https://henleyzone.com/p/${product.slug}`,
          priceCurrency: "BDT",
          price: product.price.toString(),
          availability:
            product.stock > 0
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
          itemCondition: "https://schema.org/NewCondition"
        }
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {lcpImage ? (
        <link rel="preload" as="image" href={lcpImage} fetchPriority="high" />
      ) : null}
      <LandingProductPage slug={decoded} initialDetail={detail} />
    </>
  );
}
