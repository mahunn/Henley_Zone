"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { useWishlist } from "@/components/wishlist-provider";
import { CountdownTimer } from "@/components/shop/countdown-timer";
import { animateFlyToCart } from "@/lib/cart-fly-animation";

const ProductDetailView = dynamic(
  () => import("@/components/shop/product-detail-view").then((m) => m.ProductDetailView),
  {
    ssr: false,
    loading: () => (
      <div className="container" style={{ padding: "48px 16px", textAlign: "center" }}>
        <p style={{ color: "var(--color-text-secondary)" }}>Loading product…</p>
      </div>
    )
  }
);
import { seedProducts } from "@/data/seed-products";
import { categories } from "@/data/categories";
import type { Product } from "@/types/commerce";
import { getProductsCatalog, getSyncedProductCatalog } from "@/lib/product-catalog-client";
import { mapProductToPdpDetail } from "@/lib/product-detail-mapper";

/* ─── Types ──────────────────────────────────────────────────── */
interface ColorVariant {
  id: string;
  label: string;
  image: string;
}

interface StoreProduct {
  id: string;
  slug: string;
  name: string;
  category: string;
  image: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  badge?: string;
  colors?: ColorVariant[];
}

function productToStoreProduct(p: Product): StoreProduct {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    category: p.category,
    image: p.imageUrl,
    price: p.price,
    colors: p.colors
  };
}

/* ─── Detail product lookup (catalog from API = seed + DB) ─────── */
function buildDetailProduct(slug: string, catalog: Product[]) {
  // NAKSHI example from style.json
  if (slug === "nakshi-tw-7") {
    return {
      id: "nakshi-tw-7",
      slug: "nakshi-tw-7",
      name: "NAKSHI - TW-7",
      sku: "#TH-7",
      brand: "ANS FASHION",
      categories: ["KURTI", "Two piece"],
      price: 799,
      originalPrice: undefined as number | undefined,
      stock: 31,
      badge: "Top",
      colors: [
        { id: "c1", label: "Olive Green", swatchImage: "https://placehold.co/52x62/6b7c5a/fff?text=GRN" },
        { id: "c2", label: "Blue", swatchImage: "https://placehold.co/52x62/0ea5e9/fff?text=BLU" }
      ],
      sizes: ["36", "38", "40", "42", "44", "46", "48"],
      images: [
        "https://placehold.co/500x620/e0f2fe/0284c7?text=NAKSHI+TW7+Main",
        "https://placehold.co/500x620/e0f2fe/0284c7?text=NAKSHI+TW7+Alt"
      ],
      descriptionPoints: [
        "দারুণ স্টাইলিশ ও কোয়ালিটি পণ্য",
        "প্রিমিয়াম সুতি কাপড়",
        "মারাত্মক এমব্রয়ডারি",
        "কালার গ্যারান্টি ক্লিন প্রিন্ট",
        "সাদা সালোয়ার সহ",
        "সাইজ ৩৬ থেকে ৪৮"
      ],
      specifications: [
        { label: "Category", value: "KURTI / Two piece" },
        { label: "Brand", value: "ANS FASHION" },
        { label: "Size range", value: "36 – 48" },
        { label: "Material", value: "Premium Cotton" },
        { label: "Embroidery", value: "Sequence embroidery" },
        { label: "SKU", value: "#TH-7" }
      ]
    };
  }

  const found = catalog.find((p) => p.slug === slug);
  if (!found) return null;
  return mapProductToPdpDetail(found);
}

/* ─── fmt ────────────────────────────────────────────────────── */
function fmt(price: number) {
  return `৳${price.toLocaleString("en-BD")}`;
}

/* ─── ProductCard ───────────────────────────────────────────── */
const BADGE_CLASS: Record<string, string> = {
  Top: "pc-badge-top",
  Best: "pc-badge-best",
  New: "pc-badge-new",
  "Flash deal": "pc-badge-flash",
  Feature: "pc-badge-feature"
};

function ProductCard({
  product,
  onAddToCart,
  onBuyNow
}: {
  product: StoreProduct;
  onAddToCart: (p: StoreProduct) => void;
  onBuyNow: (p: StoreProduct) => void;
}) {
  const { toggleWishlist, isWishlisted } = useWishlist();
  const colors = product.colors ?? [];
  const [activeColorIdx, setActiveColorIdx] = useState(0);
  const [justAdded, setJustAdded] = useState(false);
  const cardImgRef = useRef<HTMLImageElement>(null);

  // The displayed image follows the selected color
  const displayImage =
    colors.length > 0 ? colors[activeColorIdx].image : product.image;

  // The active color label
  const activeLabel = colors.length > 0 ? colors[activeColorIdx].label : null;
  const activeColorId = colors.length > 0 ? colors[activeColorIdx].id : undefined;
  const wishlisted = isWishlisted(product.id, activeColorId);

  function handleColorClick(e: React.MouseEvent, idx: number) {
    e.preventDefault();
    e.stopPropagation();
    setActiveColorIdx(idx);
  }

  return (
    <div className="pc">
      <div className="pc-img-wrap">
        <a href={`/#/product/${product.slug}`} style={{ textDecoration: "none", display: "block" }}>
          <img ref={cardImgRef} src={displayImage} alt={`${product.name}${activeLabel ? ` – ${activeLabel}` : ""}`} className="pc-img" />
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
              productId: product.id,
              slug: product.slug,
              name: activeLabel ? `${product.name} (${activeLabel})` : product.name,
              price: product.price,
              imageUrl: displayImage,
              category: product.category,
              colorId: activeColorId
            });
          }}
        >
          <svg viewBox="0 0 24 24" fill={wishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
        <div className="pc-badges">
          {product.discountPercent && (
            <span className="pc-badge pc-badge-sale">-{product.discountPercent}%</span>
          )}
          {product.badge && (
            <span className={`pc-badge ${BADGE_CLASS[product.badge] ?? "pc-badge-new"}`}>
              {product.badge}
            </span>
          )}
        </div>
      </div>

      <div className="pc-body">
        <span className="pc-cat">{product.category}</span>
        <a href={`/#/product/${product.slug}`} className="pc-name" style={{ textDecoration: "none" }}>
          {product.name}
        </a>
        <div className="pc-stars">☆☆☆☆☆</div>
        <div className="pc-price-row">
          <span className="pc-price">{fmt(product.price)}</span>
          {product.originalPrice && (
            <span className="pc-original-price">{fmt(product.originalPrice)}</span>
          )}
        </div>

        {/* Color swatches — only shown when product has multiple colors */}
        {colors.length > 1 && (
          <div className="pc-color-swatches" title={activeLabel ?? ""}>
            {colors.map((color, i) => (
              <button
                key={color.id}
                className={`pc-color-dot${activeColorIdx === i ? " active" : ""}`}
                onClick={(e) => handleColorClick(e, i)}
                title={color.label}
                aria-label={color.label}
                aria-pressed={activeColorIdx === i}
              >
                <img src={color.image} alt={color.label} />
              </button>
            ))}
          </div>
        )}

        {/* Bottom Actions */}
        <div className="pc-bottom-actions">
          <button
            className={`pc-bottom-btn pc-btn-cart${justAdded ? " is-added" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              onAddToCart({ ...product, image: displayImage });
              animateFlyToCart(cardImgRef.current);
              setJustAdded(true);
              window.setTimeout(() => setJustAdded(false), 700);
            }}
          >
            {justAdded ? "Added ✓" : "Add to Cart"}
          </button>
          <button
            className="pc-bottom-btn pc-btn-buy"
            onClick={(e) => {
              e.preventDefault();
              onBuyNow({ ...product, image: displayImage });
            }}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── CategoryScrollSection ──────────────────────────────────── */
function CategoryScrollSection() {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!trackRef.current) return;
    trackRef.current.scrollBy({ left: dir === "left" ? -240 : 240, behavior: "smooth" });
  };

  const catItems = [
    ...categories.map((c) => ({ id: c.id, label: c.title, image: c.imageUrl })),
    { id: "KURTI", label: "KURTI", image: "https://placehold.co/120x120/e0f2fe/0284c7?text=KURTI" },
    { id: "BORKA", label: "BORKA", image: "https://placehold.co/120x120/e0f2fe/0284c7?text=BORKA" }
  ];

  return (
    <div className="cat-scroll-wrap">
      <button className="cat-scroll-arrow left" onClick={() => scroll("left")} aria-label="Previous categories">‹</button>
      <div className="cat-scroll-track" ref={trackRef}>
        {catItems.map((cat) => (
          <Link
            key={cat.id}
            href={`/store?category=${encodeURIComponent(cat.id)}`}
            className="cat-item"
          >
            <img src={cat.image} alt={cat.label} className="cat-item-img" />
            <span className="cat-item-label">{cat.label}</span>
          </Link>
        ))}
      </div>
      <button className="cat-scroll-arrow right" onClick={() => scroll("right")} aria-label="Next categories">›</button>
    </div>
  );
}

/* ─── ProductRowSection ──────────────────────────────────────── */
function ProductRowSection({
  title,
  products,
  viewAllHref,
  onAddToCart,
  onBuyNow
}: {
  title: string;
  products: StoreProduct[];
  viewAllHref?: string;
  onAddToCart: (p: StoreProduct) => void;
  onBuyNow: (p: StoreProduct) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: "left" | "right") => {
    trackRef.current?.scrollBy({ left: dir === "left" ? -220 : 220, behavior: "smooth" });
  };

  return (
    <section className="fancy-section reveal">
      <div className="fancy-title-row">
        <h2 className="fancy-title">{title}</h2>
        {viewAllHref && (
          <Link href={viewAllHref} className="fancy-view-all">
            View All →
          </Link>
        )}
      </div>
      <div className="cat-scroll-wrap">
        <button className="cat-scroll-arrow left" onClick={() => scroll("left")} aria-label="Scroll left">‹</button>
        <div className="product-row-scroll" ref={trackRef}>
          {products.map((p) => (
            <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} onBuyNow={onBuyNow} />
          ))}
        </div>
        <button className="cat-scroll-arrow right" onClick={() => scroll("right")} aria-label="Scroll right">›</button>
      </div>
    </section>
  );
}

/* ─── DealsProductScroll (arrows inside the deals panel) ────── */
function DealsProductScroll({
  products,
  onAddToCart,
  onBuyNow
}: {
  products: StoreProduct[];
  onAddToCart: (p: StoreProduct) => void;
  onBuyNow: (p: StoreProduct) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: "left" | "right") =>
    trackRef.current?.scrollBy({ left: dir === "left" ? -220 : 220, behavior: "smooth" });

  return (
    <div className="cat-scroll-wrap">
      <button className="cat-scroll-arrow left" onClick={() => scroll("left")} aria-label="Scroll left">‹</button>
      <div className="product-row-scroll" ref={trackRef}>
        {products.map((p) => (
          <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} onBuyNow={onBuyNow} />
        ))}
      </div>
      <button className="cat-scroll-arrow right" onClick={() => scroll("right")} aria-label="Scroll right">›</button>
    </div>
  );
}

/* ─── HomePage ───────────────────────────────────────────────── */
function HomePage({
  catalog,
  onAddToCart,
  onBuyNow
}: {
  catalog: StoreProduct[];
  onAddToCart: (p: StoreProduct) => void;
  onBuyNow: (p: StoreProduct) => void;
}) {
  // Deals countdown — 5 days from now
  const dealTarget = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);

  const newArrivals = catalog.slice(0, 5);
  const featured = [
    catalog.find((p) => p.slug === "batik-print-two-piece"),
    catalog.find((p) => p.slug === "cotton-gown-embroidery"),
    catalog.find((p) => p.slug === "salwar-sequence-embroidery"),
    catalog.find((p) => p.slug === "salwar-premium-cotton"),
    catalog.find((p) => p.slug === "embroidered-frogs")
  ].filter(Boolean) as StoreProduct[];
  const [dealsProducts, setDealsProducts] = useState<StoreProduct[]>(() => catalog.slice(0, 2));
  useEffect(() => {
    if (catalog.length < 2) return;
    const shuffled = [...catalog].sort(() => Math.random() - 0.5);
    setDealsProducts(shuffled.slice(0, 2));
  }, [catalog]);
  const flashDealProducts = [
    catalog.find((p) => p.slug === "embroidered-frogs"),
    catalog.find((p) => p.slug === "cotton-gown-embroidery")
  ].filter(Boolean) as StoreProduct[];

  return (
    <main className="page-main">
      {/* ── Hero Banner ── */}
      <div className="hero-banner-new">
        <img
          src="/banner-home.png"
          alt="Henley Zone collection banner"
          className="hero-banner-img"
          width={1920}
          height={640}
          decoding="async"
          fetchPriority="high"
          loading="eager"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        <div className="hero-banner-cta-desktop">
          <Link href="/store" className="hero-banner-shop-btn">
            Shop Now →
          </Link>
        </div>
      </div>
      <div className="hero-banner-cta-strip">
        <Link href="/store" className="hero-banner-shop-btn">
          Shop Now →
        </Link>
      </div>

      <div className="container">
        {/* ── Categories ── */}
        <section className="fancy-section reveal">
          <div className="fancy-title-row">
            <h2 className="fancy-title">Shop by Category</h2>
          </div>
          <CategoryScrollSection />
        </section>

        {/* ── Deals of the Week ── */}
        <section className="fancy-section reveal">
          <div className="fancy-title-row">
            <h2 className="fancy-title">Deals Of The Week</h2>
          </div>
          <div className="deals-section">
            <div className="deals-inner">
              <div className="deals-timer-col">
                <span className="deals-timer-label">Offer Ends In</span>
                <CountdownTimer targetDate={dealTarget} />
                <Link href="/store" className="deals-view-all">View All</Link>
              </div>
              <div className="deals-products">
                <DealsProductScroll products={dealsProducts} onAddToCart={onAddToCart} onBuyNow={onBuyNow} />
              </div>
            </div>
          </div>
        </section>

        {/* ── New Arrival ── */}
        <ProductRowSection
          title="New Arrival"
          products={newArrivals}
          viewAllHref="/store?sort=newest"
          onAddToCart={onAddToCart}
          onBuyNow={onBuyNow}
        />

        {/* ── Featured ── */}
        <ProductRowSection
          title="Featured"
          products={featured}
          onAddToCart={onAddToCart}
          onBuyNow={onBuyNow}
        />

        {/* ── Flash Deal ── */}
        {flashDealProducts.length === 2 && (
          <section className="fancy-section reveal">
            <div className="fancy-title-row">
              <h2 className="fancy-title">Flash Deal</h2>
            </div>
            <div className="flash-grid">
              {flashDealProducts.map((fd) => (
                <a
                  key={fd.id}
                  href={`/#/product/${fd.slug}`}
                  className="flash-card"
                  style={{ textDecoration: "none" }}
                >
                  <img src={fd.image} alt={fd.name} className="flash-card-img" />
                  <div className="flash-card-body">
                    <span className="flash-badge">Flash Deal</span>
                    <div className="flash-card-name">{fd.name}</div>
                    <div className="flash-price-row">
                      <span className="flash-card-price">{fmt(fd.price)}</span>
                      {fd.originalPrice && (
                        <span className="flash-card-original">{fmt(fd.originalPrice)}</span>
                      )}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* ── Trust Badges ── */}
        <section className="fancy-section reveal">
          <div className="trust-badges">
            <div className="trust-item">
              <div className="trust-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2" />
                  <line x1="1" y1="10" x2="23" y2="10" />
                </svg>
              </div>
              <div>
                <div className="trust-text-title">Cash on Delivery</div>
                <div className="trust-text-sub">সারা বাংলাদেশে COD সুবিধা</div>
              </div>
            </div>
            <div className="trust-item">
              <div className="trust-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                  <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                </svg>
              </div>
              <div>
                <div className="trust-text-title">24/7 Customer Support</div>
                <div className="trust-text-sub">WhatsApp ও ফোনে সাপোর্ট</div>
              </div>
            </div>
            <div className="trust-item">
              <div className="trust-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 4 23 10 17 10" />
                  <polyline points="1 20 1 14 7 14" />
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                </svg>
              </div>
              <div>
                <div className="trust-text-title">Easy Returns</div>
                <div className="trust-text-sub">৩ দিনের মধ্যে রিটার্ন</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

/* ─── Main Page (Hash Router) ───────────────────────────────── */
export default function Page() {
  const { addToCart } = useCart();
  const [view, setView] = useState<"home" | "product">("home");
  const [productSlug, setProductSlug] = useState("");
  const [catalog, setCatalog] = useState<Product[]>(() => getSyncedProductCatalog() ?? seedProducts);

  useEffect(() => {
    void getProductsCatalog()
      .then(setCatalog)
      .catch(() => {});
  }, []);

  const storeCatalog = useMemo(() => catalog.map(productToStoreProduct), [catalog]);

  // Parse hash and update view
  const parseHash = useCallback(() => {
    const hash = window.location.hash;
    if (hash.startsWith("#/product/")) {
      setProductSlug(hash.replace("#/product/", "").split("?")[0]);
      setView("product");
    } else {
      setView("home");
    }
  }, []);

  useEffect(() => {
    parseHash();
    window.addEventListener("hashchange", parseHash);
    return () => window.removeEventListener("hashchange", parseHash);
  }, [parseHash]);

  useEffect(() => {
    if (view !== "product") return;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
  }, [view, productSlug]);

  function handleAddToCart(p: StoreProduct) {
    addToCart({
      id: p.id,
      slug: p.slug,
      name: p.name,
      description: "",
      price: p.price,
      stock: 99,
      imageUrl: p.image,
      category: p.category
    });
  }

  function handleBuyNow(p: StoreProduct) {
    // Open PDP first so customer can choose size/color before checkout.
    window.location.hash = `#/product/${p.slug}`;
  }

  // Product Detail View
  if (view === "product") {
    const detail = buildDetailProduct(productSlug, catalog);
    if (!detail) {
      return (
        <div className="container" style={{ padding: "48px 16px", textAlign: "center" }}>
          <h2 style={{ fontFamily: "var(--font-heading, serif)", marginBottom: 12 }}>
            Product not found
          </h2>
          <a href="/#/" className="btn">← Back to Home</a>
        </div>
      );
    }

    const related = storeCatalog
      .filter((p) => p.slug !== productSlug)
      .slice(0, 6)
      .map((p) => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        category: p.category,
        image: p.image,
        price: p.price,
        originalPrice: p.originalPrice,
        discountPercent: p.discountPercent,
        badge: p.badge
      }));

    return (
      <ProductDetailView
        product={detail}
        relatedProducts={related}
        onBack={() => {
          window.location.hash = "#/";
        }}
      />
    );
  }

  return (
    <HomePage catalog={storeCatalog} onAddToCart={handleAddToCart} onBuyNow={handleBuyNow} />
  );
}
