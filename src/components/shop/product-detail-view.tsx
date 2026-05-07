"use client";

import { useState, useLayoutEffect } from "react";
import { useCart } from "@/components/cart-provider";
import { useWishlist } from "@/components/wishlist-provider";
import { useRouter } from "next/navigation";

interface ProductColor {
  id: string;
  label: string;
  swatchImage: string;
}

interface DetailProduct {
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
  colors: ProductColor[];
  sizes: string[];
  images: string[];
  descriptionPoints: string[];
  specifications?: { label: string; value: string }[];
}

interface Props {
  product: DetailProduct;
  relatedProducts?: {
    id: string;
    slug: string;
    name: string;
    category: string;
    image: string;
    price: number;
    originalPrice?: number;
    discountPercent?: number;
    badge?: string;
  }[];
  onBack?: () => void;
}

function StarRow({ count = 0 }: { count?: number }) {
  return (
    <div className="pdp-stars">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} style={{ opacity: i <= count ? 1 : 0.25 }}>★</span>
      ))}
    </div>
  );
}

function CreditCardIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  );
}

function HeadphonesIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}

const BADGE_CLASS: Record<string, string> = {
  Top: "pc-badge-top",
  Best: "pc-badge-best",
  New: "pc-badge-new",
  "Flash deal": "pc-badge-flash",
  Feature: "pc-badge-feature"
};

type RelatedProduct = NonNullable<Props["relatedProducts"]>[number];

function RelatedProductCard({ rp }: { rp: RelatedProduct }) {
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
        <a href={`/#/product/${rp.slug}`} style={{ display: "block", textDecoration: "none" }}>
          <img src={rp.image} alt={rp.name} className="pc-img" />
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
        <a href={`/#/product/${rp.slug}`} className="pc-name" style={{ textDecoration: "none" }}>
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

function fmt(price: number) {
  return `৳${price.toLocaleString("en-BD")}`;
}

export function ProductDetailView({ product, relatedProducts = [], onBack }: Props) {
  const router = useRouter();
  const { addToCart, buyNow } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [activeImg, setActiveImg] = useState(0);

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [product.slug]);
  const [activeColor, setActiveColor] = useState<string | null>(
    product.colors[0]?.id ?? null
  );

  // Keep gallery image in sync with color swatch selection
  // (when colors map 1-to-1 with images, selecting a color jumps to that image)
  function handleColorSelect(colorId: string) {
    setActiveColor(colorId);
    const colorIdx = product.colors.findIndex((c) => c.id === colorId);
    if (colorIdx !== -1 && colorIdx < product.images.length) {
      setActiveImg(colorIdx);
    }
  }

  // Keep active color in sync when thumbnail is clicked
  function handleThumbClick(imgIdx: number) {
    setActiveImg(imgIdx);
    if (imgIdx < product.colors.length) {
      setActiveColor(product.colors[imgIdx].id);
    }
  }
  const [activeSize, setActiveSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState<"descriptions" | "specifications" | "reviews">("descriptions");
  const [variantError, setVariantError] = useState("");

  // Always use the currently-selected color's image when adding to cart
  const selectedColorImage =
    product.colors.find((c) => c.id === activeColor)?.swatchImage ??
    product.images[activeImg] ??
    product.images[0] ??
    "";

  const cartProduct = {
    id: product.id,
    slug: product.slug,
    name: `${product.name}${activeColor ? ` (${product.colors.find((c) => c.id === activeColor)?.label ?? ""})` : ""}`,
    description: product.descriptionPoints.join(". "),
    price: product.price,
    stock: product.stock,
    imageUrl: selectedColorImage,
    category: product.categories[0] ?? ""
  };

  const wishlistColorId = product.colors.length > 0 ? (activeColor ?? undefined) : undefined;
  const wishlisted = isWishlisted(product.id, wishlistColorId);

  function handleAddToCart() {
    if (!activeColor || !activeSize) {
      setVariantError("Please select both color and size first.");
      return;
    }
    setVariantError("");
    for (let i = 0; i < qty; i++) {
      addToCart(cartProduct, {
        selectedColor: product.colors.find((c) => c.id === activeColor)?.label,
        selectedSize: activeSize
      });
    }
  }

  function handleBuyNow() {
    if (!activeColor || !activeSize) {
      setVariantError("Please select both color and size first.");
      return;
    }
    setVariantError("");
    buyNow(cartProduct, {
      selectedColor: product.colors.find((c) => c.id === activeColor)?.label,
      selectedSize: activeSize
    });
    router.push("/checkout");
  }

  const discountPct =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round((1 - product.price / product.originalPrice) * 100)
      : null;

  return (
    <div className="pdp-wrap container">
      {/* Breadcrumb */}
      <nav className="pdp-breadcrumb" aria-label="Breadcrumb">
        {onBack ? (
          <button
            onClick={onBack}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "inherit", fontFamily: "inherit", fontSize: "inherit" }}
          >
            Home
          </button>
        ) : (
          <a href="/#/">Home</a>
        )}
        <span>›</span>
        <span>Shop</span>
        <span>›</span>
        <span style={{ color: "var(--color-text-primary)", fontWeight: 500 }}>{product.name}</span>
      </nav>

      {/* Main: Gallery + Info */}
      <div className="pdp-main">
        {/* Gallery */}
        <div className="pdp-gallery">
          <img
            src={product.images[activeImg]}
            alt={product.name}
            className="pdp-main-img"
          />
          {product.images.length > 1 && (
            <div className="pdp-thumbnails">
              {product.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={product.colors[i]?.label ?? `View ${i + 1}`}
                  className={`pdp-thumb${activeImg === i ? " active" : ""}`}
                  onClick={() => handleThumbClick(i)}
                  title={product.colors[i]?.label}
                />
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="pdp-info">
          {/* Badge */}
          {product.badge && (
            <div className="pdp-badge-row">
              <span className={`pc-badge ${BADGE_CLASS[product.badge] ?? "pc-badge-new"}`}>
                {product.badge}
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className="pdp-title">{product.name}</h1>

          {/* Rating + Stock */}
          <div className="pdp-rating-row">
            <StarRow count={0} />
            <span className="pdp-in-stock">✓ In Stock ({product.stock} items)</span>
          </div>

          {/* Price */}
          <div className="pdp-price-row">
            <span className="pdp-price">{fmt(product.price)}</span>
            {product.originalPrice && (
              <span className="pdp-original-price">{fmt(product.originalPrice)}</span>
            )}
            {discountPct && (
              <span className="pc-badge pc-badge-sale">-{discountPct}%</span>
            )}
          </div>

          {/* Brand link */}
          <div style={{ fontSize: 13, color: "var(--color-text-secondary)", fontFamily: "var(--font-body, sans-serif)" }}>
            Brand: <span style={{ color: "var(--color-primary)", fontWeight: 600 }}>{product.brand}</span>
          </div>

          {/* Color Selector */}
          {product.colors.length > 0 && (
            <div>
              <p className="selector-label">
                Color:{" "}
                {activeColor
                  ? product.colors.find((c) => c.id === activeColor)?.label
                  : ""}
              </p>
              <div className="color-swatches">
                {product.colors.map((color) => (
                  <button
                    key={color.id}
                    className={`swatch-btn${activeColor === color.id ? " active" : ""}`}
                    onClick={() => handleColorSelect(color.id)}
                    title={color.label}
                    aria-label={color.label}
                    aria-pressed={activeColor === color.id}
                  >
                    <img src={color.swatchImage} alt={color.label} className="swatch-img" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selector */}
          {product.sizes.length > 0 && (
            <div>
              <p className="selector-label">Size: {activeSize ?? "Select size"}</p>
              <div className="size-grid">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    className={`size-btn${activeSize === sz ? " active" : ""}`}
                    onClick={() => setActiveSize(sz)}
                    aria-pressed={activeSize === sz}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Qty + Actions */}
          <div className="pdp-actions-row">
            <div className="qty-stepper">
              <button
                className="qty-btn"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <input
                type="number"
                className="qty-display"
                value={qty}
                min={1}
                onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                aria-label="Quantity"
              />
              <button
                className="qty-btn"
                onClick={() => setQty((q) => q + 1)}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <button className="btn" onClick={handleAddToCart}>
              Add to Cart
            </button>
            <button className="btn btn-dark" onClick={handleBuyNow}>
              Buy Now
            </button>
          </div>
          {variantError && (
            <div className="form-error" style={{ marginTop: -4 }}>
              <span>⚠</span> {variantError}
            </div>
          )}

          {/* Wishlist / Compare */}
          <div className="pdp-secondary-actions">
            <button
              type="button"
              className={`btn-outline${wishlisted ? " pdp-wishlisted" : ""}`}
              onClick={() =>
                toggleWishlist({
                  productId: product.id,
                  slug: product.slug,
                  name: cartProduct.name,
                  price: product.price,
                  imageUrl: selectedColorImage,
                  category: cartProduct.category,
                  colorId: wishlistColorId
                })
              }
            >
              {wishlisted ? "♥ Saved" : "♡ Wishlist"}
            </button>
            <button type="button" className="btn-outline">⇄ Compare</button>
          </div>

          {/* Meta */}
          <div className="pdp-meta">
            <div className="pdp-meta-row">
              <span className="pdp-meta-label">Brand:</span>
              <span className="pdp-meta-val">{product.brand}</span>
            </div>
            <div className="pdp-meta-row">
              <span className="pdp-meta-label">Categories:</span>
              <span className="pdp-meta-val">
                {product.categories.map((c) => (
                  <span key={c} className="pdp-meta-tag">{c}</span>
                ))}
              </span>
            </div>
            <div className="pdp-meta-row">
              <span className="pdp-meta-label">SKU:</span>
              <span className="pdp-meta-val">{product.sku}</span>
            </div>
          </div>

          {/* Social Share */}
          <div className="social-share-row">
            <span className="social-share-label">Share:</span>
            {["f", "t", "in", "p"].map((s) => (
              <button key={s} className="social-share-btn" title={s} aria-label={`Share on ${s}`}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="pdp-tabs-section">
        <div className="tabs-nav" role="tablist">
          {(["descriptions", "specifications", "reviews"] as const).map((tab) => (
            <button
              key={tab}
              role="tab"
              aria-selected={activeTab === tab}
              className={`tab-btn${activeTab === tab ? " active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "descriptions" ? "Descriptions" : tab === "specifications" ? "Specifications" : "Latest Reviews"}
            </button>
          ))}
        </div>

        {activeTab === "descriptions" && (
          <div className="tab-panel" role="tabpanel">
            <ul>
              {product.descriptionPoints.map((pt, i) => (
                <li key={i}>{pt}</li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === "specifications" && (
          <div className="tab-panel" role="tabpanel">
            {product.specifications && product.specifications.length > 0 ? (
              <table style={{ borderCollapse: "collapse", width: "100%", fontSize: 13.5 }}>
                <tbody>
                  {product.specifications.map((row) => (
                    <tr key={row.label} style={{ borderBottom: "1px solid var(--color-border)" }}>
                      <td style={{ padding: "8px 12px 8px 0", color: "var(--color-text-secondary)", fontWeight: 500, width: 140 }}>
                        {row.label}
                      </td>
                      <td style={{ padding: "8px 0" }}>{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{ color: "var(--color-text-secondary)", fontStyle: "italic" }}>
                No specifications available.
              </p>
            )}
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="tab-panel" role="tabpanel">
            <p style={{ color: "var(--color-text-secondary)", fontStyle: "italic" }}>
              No reviews yet. Be the first to review this product!
            </p>
          </div>
        )}
      </div>

      {/* Trust Badges */}
      <div className="trust-badges" style={{ marginTop: 28 }}>
        <div className="trust-item">
          <div className="trust-icon"><CreditCardIcon /></div>
          <div>
            <div className="trust-text-title">Secure Online Payment</div>
            <div className="trust-text-sub">SSL / Secure Certificate protected</div>
          </div>
        </div>
        <div className="trust-item">
          <div className="trust-icon"><HeadphonesIcon /></div>
          <div>
            <div className="trust-text-title">24/7 Customer Support</div>
            <div className="trust-text-sub">Friendly support always available</div>
          </div>
        </div>
        <div className="trust-item">
          <div className="trust-icon"><RefreshIcon /></div>
          <div>
            <div className="trust-text-title">Money Back Guarantee</div>
            <div className="trust-text-sub">Return within 3 days</div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="fancy-section" style={{ marginTop: 36 }}>
          <div className="fancy-title-row">
            <h2 className="fancy-title">Related Products</h2>
          </div>
          <div className="product-row-scroll">
            {relatedProducts.map((rp) => (
              <RelatedProductCard key={rp.id} rp={rp} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
