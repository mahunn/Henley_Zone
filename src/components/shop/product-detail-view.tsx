"use client";

import { useState, useLayoutEffect } from "react";
import { useCart } from "@/components/cart-provider";
import { useWishlist } from "@/components/wishlist-provider";
import { useRouter } from "next/navigation";
import { HorizontalScrollRow } from "@/components/shop/horizontal-scroll-row";
import { ProductImageLightbox } from "@/components/shop/product-image-lightbox";
import { ProductImage } from "@/components/shop/product-image";
import { bn } from "@/config/ui-bn";

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
  /** Build product URL (default: legacy hash route). Prefer `/product/[slug]` for speed. */
  productLink?: (slug: string) => string;
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
  /** When false, related block is rendered elsewhere (lazy-loaded for faster LCP). */
  renderRelated?: boolean;
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

function fmt(price: number) {
  return `৳${price.toLocaleString("en-BD")}`;
}

export function ProductDetailView({
  product,
  productLink = (slug) => `/#/product/${slug}`,
  onBack,
  renderRelated: _renderRelated = true
}: Props) {
  const router = useRouter();
  const { addToCart, buyNow } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [activeImg, setActiveImg] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

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
      setVariantError(bn.product.selectColorSize);
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
      setVariantError(bn.product.selectColorSize);
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

  const showGalleryThumbs = product.images.length > 1;
  const showColorSwatches = product.colors.length > 0 && !showGalleryThumbs;
  const showVariantPicker = showGalleryThumbs || showColorSwatches || product.sizes.length > 0;

  const variantPicker = showVariantPicker ? (
    <section className="pdp-variant-picker" aria-label="Choose color and size">
      {(showGalleryThumbs || showColorSwatches) && (
        <div className="pdp-variant-row pdp-variant-row--color">
          {product.colors.length > 0 && (
            <p className="selector-label pdp-variant-label">
              {bn.product.color}:{" "}
              <strong>{activeColor ? product.colors.find((c) => c.id === activeColor)?.label : "—"}</strong>
            </p>
          )}
          {showGalleryThumbs && (
            <HorizontalScrollRow
              trackClassName="pdp-thumbnails"
              scrollStep={84}
              minItemsForArrows={3}
              ariaLabel={bn.product.colorsAria}
            >
              {product.images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  className={`pdp-thumb-btn${activeImg === i ? " active" : ""}`}
                  onClick={() => handleThumbClick(i)}
                  title={product.colors[i]?.label}
                  aria-label={product.colors[i]?.label ?? `View image ${i + 1}`}
                  aria-pressed={activeImg === i}
                >
                  <ProductImage
                    src={img}
                    alt={product.colors[i]?.label ?? `View ${i + 1}`}
                    className="pdp-thumb"
                    width={68}
                    height={68}
                    sizes="68px"
                  />
                </button>
              ))}
            </HorizontalScrollRow>
          )}
          {showColorSwatches && (
            <HorizontalScrollRow
              trackClassName="color-swatches"
              scrollStep={72}
              minItemsForArrows={3}
              ariaLabel={bn.product.colorsAria}
            >
              {product.colors.map((color) => (
                <button
                  key={color.id}
                  type="button"
                  className={`swatch-btn${activeColor === color.id ? " active" : ""}`}
                  onClick={() => handleColorSelect(color.id)}
                  title={color.label}
                  aria-label={color.label}
                  aria-pressed={activeColor === color.id}
                >
                  <ProductImage
                    src={color.swatchImage}
                    alt={color.label}
                    className="swatch-img"
                    width={48}
                    height={48}
                    sizes="48px"
                  />
                </button>
              ))}
            </HorizontalScrollRow>
          )}
        </div>
      )}

      {product.sizes.length > 0 && (
        <div className="pdp-variant-row pdp-variant-row--size">
          <p className="selector-label pdp-variant-label">
            {bn.product.size}: <strong>{activeSize ?? bn.product.selectSize}</strong>
          </p>
          <HorizontalScrollRow
            trackClassName="size-grid"
            scrollStep={88}
            minItemsForArrows={5}
            ariaLabel={bn.product.sizesAria}
          >
            {product.sizes.map((sz) => (
              <button
                key={sz}
                type="button"
                className={`size-btn${activeSize === sz ? " active" : ""}`}
                onClick={() => setActiveSize(sz)}
                aria-pressed={activeSize === sz}
              >
                {sz}
              </button>
            ))}
          </HorizontalScrollRow>
        </div>
      )}
    </section>
  ) : null;

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
        <div className="pdp-gallery-col">
          <div className="pdp-gallery">
            <div className="pdp-main-img-wrap">
              <button
                type="button"
                className="pdp-main-img-btn"
                onClick={() => setLightboxOpen(true)}
                aria-label={bn.product.viewFullImage}
              >
                <ProductImage
                  src={product.images[activeImg]}
                  alt={product.name}
                  className="pdp-main-img"
                  fill
                  sizes="(max-width: 767px) 360px, 44vw"
                  priority
                />
              </button>
            </div>
          </div>
        </div>

        <div className="pdp-main-right">
          <div className="pdp-info-summary">
            {product.badge && (
              <div className="pdp-badge-row">
                <span className={`pc-badge ${BADGE_CLASS[product.badge] ?? "pc-badge-new"}`}>
                  {product.badge}
                </span>
              </div>
            )}

            {product.categories[0] && (
              <p className="pdp-category">{product.categories[0]}</p>
            )}

            <h1 className="pdp-title">{product.name}</h1>

            <div className="pdp-rating-row">
              <StarRow count={0} />
              <span className="pdp-in-stock">
                ✓ {bn.product.inStock} ({product.stock} {bn.product.items})
              </span>
            </div>

            <div className="pdp-price-row">
              <span className="pdp-price">{fmt(product.price)}</span>
              {product.originalPrice && (
                <span className="pdp-original-price">{fmt(product.originalPrice)}</span>
              )}
              {discountPct && (
                <span className="pc-badge pc-badge-sale">-{discountPct}%</span>
              )}
            </div>

            <div className="pdp-brand-line">
              {bn.product.brand}: <span>{product.brand}</span>
            </div>
          </div>

          {variantPicker}

          <div className="pdp-info-body">
          <div className="pdp-cta-block">
            <div className="qty-stepper pdp-qty">
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
            <div className="pdp-actions-row">
              <button type="button" className="btn pdp-btn-add" onClick={handleAddToCart}>
                {bn.product.addToCart}
              </button>
              <button type="button" className="btn pdp-btn-buy" onClick={handleBuyNow}>
                {bn.product.buyNow}
              </button>
            </div>
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
      </div>

      <ProductImageLightbox
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={product.images}
        index={activeImg}
        onIndexChange={handleThumbClick}
        alt={product.name}
      />

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
              {tab === "descriptions" ? bn.product.descriptions : tab === "specifications" ? bn.product.specifications : bn.product.reviews}
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

    </div>
  );
}
