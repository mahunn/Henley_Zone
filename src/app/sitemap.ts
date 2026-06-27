import { MetadataRoute } from "next";
import { getCachedProducts } from "@/lib/products-catalog-server";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const domain = "https://henleyzone.com";

  let products: any[] = [];
  try {
    products = await getCachedProducts();
  } catch {
    // fallback
  }

  const productEntries = products.map((p) => ({
    url: `${domain}/product/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8
  }));

  const routes = [
    "",
    "/store",
    "/cart",
    "/wishlist",
    "/checkout",
    "/contact",
    "/privacy-policy",
    "/terms",
    "/return-policy",
    "/shipping-policy"
  ].map((route) => ({
    url: `${domain}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.6
  }));

  return [...routes, ...productEntries];
}
