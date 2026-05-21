"use client";

import { useWishlist } from "@/components/wishlist-provider";
import { ProductImage } from "@/components/shop/product-image";

const BADGE_CLASS: Record<string, string> = {
  Top: "pc-badge-top",
  Best: "pc-badge-best",
  New: "pc-badge-new",
  "Flash deal": "pc-badge-flash",
  Feature: "pc-badge-feature"
};

export type RelatedProductItem = {
  id: string;
  slug: string;
  name: string;
  category: string;
  image: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  badge?: string;
};

function fmt(price: number) {
  return `৳${price.toLocaleString("en-BD")}`;
}

function RelatedProductCard({
  rp,
  productLink
}: {
  rp: RelatedProductItem;
  productLink: (slug: string) => string;
}) {
  const { toggleWishlist, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(rp.id, undefined);
  const disc =
    rp.discountPercent ??
    (rp.originalPrice && rp.originalPrice > rp.price
      ? Math.round((1 - rp.price / rp.originalPrice) * 100)
      : null);

  return (
    <div className="pc" style={{ textDecoration: "none" }}>
      <div className="pc-img-wrap">
        <a href={productLink(rp.slug)} style={{ display: "block", textDecoration: "none" }}>
          <ProductImage
            src={rp.image}
            alt={rp.name}
            className="pc-img"
            width={320}
            height={400}
            sizes="180px"
          />
        </a>
        <button
          type="button"
          className={`pc-wish-btn${wishlisted ? " active" : ""}`}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist({
              productId: rp.id,
              slug: rp.slug,
              name: rp.name,
              price: rp.price,
              imageUrl: rp.image,
              category: rp.category
            });
          }}
        >
          <svg viewBox="0 0 24 24" fill={wishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
        <div className="pc-badges">
          {disc && <span className="pc-badge pc-badge-sale">-{disc}%</span>}
          {rp.badge && (
            <span className={`pc-badge ${BADGE_CLASS[rp.badge] ?? "pc-badge-new"}`}>{rp.badge}</span>
          )}
        </div>
      </div>
      <div className="pc-body">
        <span className="pc-cat">{rp.category}</span>
        <a href={productLink(rp.slug)} className="pc-name" style={{ textDecoration: "none" }}>
          {rp.name}
        </a>
        <div className="pc-price-row">
          <span className="pc-price">{fmt(rp.price)}</span>
          {rp.originalPrice && <span className="pc-original-price">{fmt(rp.originalPrice)}</span>}
        </div>
      </div>
    </div>
  );
}

export function RelatedProductsSection({
  title,
  relatedProducts,
  productLink
}: {
  title: string;
  relatedProducts: RelatedProductItem[];
  productLink: (slug: string) => string;
}) {
  if (!relatedProducts.length) return null;

  return (
    <div className="fancy-section" style={{ marginTop: 36 }}>
      <div className="fancy-title-row">
        <h2 className="fancy-title">{title}</h2>
      </div>
      <div className="product-row-scroll">
        {relatedProducts.map((rp) => (
          <RelatedProductCard key={rp.id} rp={rp} productLink={productLink} />
        ))}
      </div>
    </div>
  );
}
