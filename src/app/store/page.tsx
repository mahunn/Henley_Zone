"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/components/cart-provider";
import { useWishlist } from "@/components/wishlist-provider";
import { formatCurrency } from "@/lib/money";
import { defaultBusiness } from "@/config/businesses";
import { Product } from "@/types/commerce";
import { productMatchesSearch } from "@/lib/product-search";
import { getProductsCatalog, getSyncedProductCatalog } from "@/lib/product-catalog-client";
import { animateFlyToCart } from "@/lib/cart-fly-animation";

/* ─── Color-aware product card ───────────────────────────────── */
function StoreCard({ product }: { product: Product }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const colors = product.colors ?? [];
  const [activeIdx, setActiveIdx] = useState(0);
  const [justAdded, setJustAdded] = useState(false);
  const cardImgRef = useRef<HTMLImageElement>(null);

  const displayImage = colors.length > 0 ? colors[activeIdx].image : product.imageUrl;
  const activeLabel = colors.length > 0 ? colors[activeIdx].label : null;
  const activeColorId = colors.length > 0 ? colors[activeIdx].id : undefined;
  const wishlisted = isWishlisted(product.id, activeColorId);

  const cartProduct = {
    ...product,
    name: activeLabel ? `${product.name} (${activeLabel})` : product.name,
    imageUrl: displayImage
  };

  return (
    <article className="product-card" style={{ position: "relative" }}>
      {/* Image — clicking goes to hash product detail */}
      <div style={{ position: "relative" }}>
        <a href={`/#/product/${product.slug}`} style={{ display: "block" }}>
          <img
            ref={cardImgRef}
            src={displayImage}
            alt={`${product.name}${activeLabel ? ` – ${activeLabel}` : ""}`}
            className="product-image"
          />
        </a>
        <button
          type="button"
          className={`store-wish-btn${wishlisted ? " active" : ""}`}
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
      </div>

      {/* Color count badge */}
      {colors.length > 1 && (
        <span
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            background: "var(--color-primary)",
            color: "#fff",
            fontSize: 10,
            fontWeight: 700,
            padding: "2px 7px",
            borderRadius: 4,
            fontFamily: "var(--font-body, sans-serif)"
          }}
        >
          {colors.length} colors
        </span>
      )}

      <h2 style={{ margin: "0 0 4px", fontSize: "0.98rem", color: "var(--color-text-primary)" }}>
        {product.name}
      </h2>
      <p className="muted" style={{ fontSize: 13, margin: "0 0 6px" }}>
        {product.description}
      </p>

      <p style={{ margin: "0 0 8px", fontWeight: 700, color: "var(--color-primary-dark)", fontFamily: "var(--font-body, sans-serif)" }}>
        {formatCurrency(product.price, defaultBusiness.currency)}
      </p>

      {/* Color swatches */}
      {colors.length > 1 && (
        <div className="pc-color-swatches" style={{ marginBottom: 8 }}>
          {colors.map((color, i) => (
            <button
              key={color.id}
              className={`pc-color-dot${activeIdx === i ? " active" : ""}`}
              onClick={() => setActiveIdx(i)}
              title={color.label}
              aria-label={color.label}
              aria-pressed={activeIdx === i}
            >
              <img src={color.image} alt={color.label} />
            </button>
          ))}
          <span style={{ fontSize: 11, color: "var(--color-text-secondary)", marginLeft: 2, alignSelf: "center", fontFamily: "var(--font-body, sans-serif)" }}>
            {activeLabel}
          </span>
        </div>
      )}

      {/* Bottom Actions */}
      <div className="pc-bottom-actions" style={{ marginTop: "auto" }}>
        <button
          className={`pc-bottom-btn pc-btn-cart${justAdded ? " is-added" : ""}`}
          type="button"
          onClick={() => {
            addToCart(cartProduct);
            animateFlyToCart(cardImgRef.current);
            setJustAdded(true);
            window.setTimeout(() => setJustAdded(false), 700);
          }}
        >
          {justAdded ? "Added ✓" : "Add to Cart"}
        </button>
        <button
          className="pc-bottom-btn pc-btn-buy"
          type="button"
          onClick={() => {
            router.push(`/#/product/${product.slug}`);
          }}
        >
          Buy Now
        </button>
      </div>
    </article>
  );
}

/* ─── Store skeleton (first paint / Suspense) ─────────────────── */
function StoreGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="store-skel-grid" aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="store-skel-card">
          <div className="store-skel-img" />
          <div className="store-skel-line" style={{ width: "88%" }} />
          <div className="store-skel-line" style={{ width: "100%" }} />
          <div className="store-skel-line" style={{ width: "42%", height: 14 }} />
        </div>
      ))}
    </div>
  );
}

function StorePageSuspenseFallback() {
  return (
    <main className="container" style={{ paddingBottom: 48 }}>
      <h1 className="section-title" style={{ marginTop: 24 }}>Clothing Store</h1>
      <p className="muted" style={{ marginBottom: 16 }}>
        Cash on Delivery · সারা বাংলাদেশে ডেলিভারি
      </p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
        <span className="chip chip-active">All</span>
      </div>
      <StoreGridSkeleton />
    </main>
  );
}

/* ─── Store Page ─────────────────────────────────────────────── */
export default function StorePage() {
  return (
    <Suspense fallback={<StorePageSuspenseFallback />}>
      <StorePageContent />
    </Suspense>
  );
}

function StorePageContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>(() => getSyncedProductCatalog() ?? []);
  const [loading, setLoading] = useState(() => getSyncedProductCatalog() === null);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const router = useRouter();

  useEffect(() => {
    void getProductsCatalog()
      .then((list) => {
        setProducts(list);
        setError("");
      })
      .catch(() => {
        setError("Could not load products.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))),
    [products]
  );

  useEffect(() => {
    const cat = searchParams.get("category");
    if (!cat) { setActiveCategory("all"); return; }
    setActiveCategory(categories.includes(cat) ? cat : "all");
  }, [searchParams, categories]);

  const searchQuery = searchParams.get("search")?.toLowerCase() || "";

  const filtered = products.filter((p) => {
    const matchCat = activeCategory === "all" || p.category === activeCategory;
    const matchSearch = !searchQuery || productMatchesSearch(p, searchQuery);
    return matchCat && matchSearch;
  });

  return (
    <main className="container" style={{ paddingBottom: 48 }}>
      <h1 className="section-title" style={{ marginTop: 24 }}>Clothing Store</h1>
      <p className="muted" style={{ marginBottom: 16 }}>
        Cash on Delivery · সারা বাংলাদেশে ডেলিভারি
      </p>

      {/* Category filter chips */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
        <button
          className={`chip${activeCategory === "all" ? " chip-active" : ""}`}
          onClick={() => { setActiveCategory("all"); router.push("/store"); }}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`chip${activeCategory === cat ? " chip-active" : ""}`}
            onClick={() => { setActiveCategory(cat); router.push(`/store?category=${encodeURIComponent(cat)}`); }}
          >
            {cat}
          </button>
        ))}
      </div>

      {error && products.length === 0 ? (
        <p style={{ color: "var(--color-badge-sale)" }}>{error}</p>
      ) : loading && products.length === 0 ? (
        <StoreGridSkeleton />
      ) : (
        <div className="product-grid">
          {filtered.map((product) => (
            <StoreCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
