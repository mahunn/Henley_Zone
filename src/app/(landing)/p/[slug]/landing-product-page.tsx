"use client";

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Product, CartItem } from "../../../../types/commerce";
import type { PdpDetail } from "../../../../lib/product-detail-mapper";
import { getProductsCatalog } from "../../../../lib/product-catalog-client";
import { productPagePath } from "../../../../lib/product-url";
import { defaultBusiness, businessTelHref, businessWhatsappChatUrl } from "../../../../config/businesses";
import { DELIVERY_FEE_INSIDE_DHAKA, DELIVERY_FEE_OUTSIDE_DHAKA } from "../../../../config/delivery";
import { bn } from "../../../../config/ui-bn";
import { ProductImage } from "../../../../components/shop/product-image";
import { useCart } from "../../../../components/cart-provider";
import { normalizePhoneNumber, isValidPhoneNumber } from "../../../../lib/phone-normalizer";
import { trackViewContent, trackInitiateCheckout } from "../../../../lib/meta-pixel";

/* ── Types ───────────────────────────────────────────── */

export interface SelectedColorVariant {
  colorId: string;
  label: string;
  image: string;
  /** Size label -> quantity (e.g. { "42": 2, "44": 1 }) */
  sizes: Record<string, number>;
  /** Quantity fallback if product has no sizes */
  quantity?: number;
}

type DeliveryArea = "inside" | "outside";

/* ── Component ───────────────────────────────────────── */

export function LandingProductPage({
  slug,
  initialDetail
}: {
  slug: string;
  initialDetail: PdpDetail | null;
}) {
  const router = useRouter();
  const { addCartItems, itemCount: globalCartCount } = useCart();
  const detail = initialDetail;

  useEffect(() => {
    if (detail?.id) {
      trackViewContent({
        id: detail.id,
        name: detail.name,
        price: detail.price,
        category: detail.categories?.[0]
      });
    }
  }, [detail?.id, detail?.name, detail?.price]);

  /* ── Gallery state ─────────────────────────────────── */
  const [activeImg, setActiveImg] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  /* ── Variant state ─────────────────────────────────── */
  const [selectedColors, setSelectedColors] = useState<SelectedColorVariant[]>([]);
  const [selectedStandaloneSizes, setSelectedStandaloneSizes] = useState<Record<string, number>>({});
  const [standaloneQty, setStandaloneQty] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [cartToastMessage, setCartToastMessage] = useState<string | null>(null);

  const translateColorLabel = useCallback((label: string): string => {
    const clean = label.trim().toLowerCase();
    switch (clean) {
      case "maroon":
        return "মেরুন";
      case "white":
        return "সাদা";
      case "brown":
        return "ব্রাউন";
      case "coffee":
        return "কফি";
      case "black":
        return "কালো";
      case "red":
        return "লাল";
      case "navy":
      case "navy blue":
        return "নেভী";
      case "blue":
        return "নীল";
      case "sky blue":
        return "আকাশি";
      case "green":
        return "সবুজ";
      case "deep green":
        return "গাঢ় সবুজ";
      case "olive":
      case "olive green":
        return "অলিভ";
      case "yellow":
        return "হলুদ";
      case "mustard":
        return "সরিষা";
      case "orange":
        return "কমলা";
      case "brick":
        return "ইটা";
      case "pink":
        return "গোলাপী";
      case "magenta":
        return "ম্যাজেন্টা";
      case "purple":
        return "বেগুনি";
      case "lavender":
        return "ল্যাভেন্ডার";
      case "ash":
      case "grey":
      case "gray":
        return "ছাই";
      case "cream":
        return "ক্রিম";
      case "beige":
        return "বেইজ";
      case "teal":
        return "টিল";
      case "lime green":
      case "tiya":
        return "টিয়া";
      default:
        return label;
    }
  }, []);

  useEffect(() => {
    void getProductsCatalog().then((all) => {
      if (!detail) return;
      const filtered = all.filter((p) => p.id !== detail.id);
      setRelatedProducts(filtered.slice(0, 4));
    });
  }, [detail]);

  const sizes = useMemo(() => detail?.sizes ?? [], [detail]);
  const colors = useMemo(() => detail?.colors ?? [], [detail]);
  const hasRealColors = useMemo(
    () => colors.length > 1 || (colors.length === 1 && colors[0].id !== "default"),
    [colors]
  );

  // Initialize with first color if real colors exist
  useEffect(() => {
    if (detail && hasRealColors && selectedColors.length === 0) {
      const defaultColor = detail.colors.find((c) => c.id !== "default") || detail.colors[0];
      const availableSizes = defaultColor.sizes && defaultColor.sizes.length > 0 ? defaultColor.sizes : detail.sizes;
      const initialSizes: Record<string, number> = {};
      if (availableSizes && availableSizes.length > 0) {
        initialSizes[availableSizes[0]] = 1;
      }
      setSelectedColors([
        {
          colorId: defaultColor.id,
          label: translateColorLabel(defaultColor.label),
          image: defaultColor.swatchImage,
          sizes: initialSizes,
          quantity: 1
        }
      ]);
    } else if (detail && !hasRealColors && detail.sizes?.length > 0 && Object.keys(selectedStandaloneSizes).length === 0) {
      setSelectedStandaloneSizes({ [detail.sizes[0]]: 1 });
    }
  }, [detail, hasRealColors, selectedColors.length, selectedStandaloneSizes, translateColorLabel]);

  /* ── Color toggle handler ──────────────────────────── */
  const toggleColor = useCallback(
    (color: PdpDetail["colors"][number]) => {
      setSelectedColors((prev) => {
        const exists = prev.find((c) => c.colorId === color.id);
        if (exists) {
          return prev.filter((c) => c.colorId !== color.id);
        }
        const availableSizes = color.sizes && color.sizes.length > 0 ? color.sizes : sizes;
        const defaultSizes: Record<string, number> = {};
        if (availableSizes.length > 0) {
          defaultSizes[availableSizes[0]] = 1;
        }
        return [
          ...prev,
          {
            colorId: color.id,
            label: translateColorLabel(color.label),
            image: color.swatchImage,
            sizes: defaultSizes,
            quantity: 1
          }
        ];
      });
    },
    [sizes, translateColorLabel]
  );

  /* ── Size toggle for a specific color ──────────────── */
  const toggleSizeForColor = useCallback((colorId: string, size: string) => {
    setSelectedColors((prev) =>
      prev.map((c) => {
        if (c.colorId !== colorId) return c;
        const currentQty = c.sizes[size] ?? 0;
        const nextSizes = { ...c.sizes };
        if (currentQty > 0) {
          delete nextSizes[size];
        } else {
          nextSizes[size] = 1;
        }
        return { ...c, sizes: nextSizes };
      })
    );
  }, []);

  /* ── Quantity adjuster for a specific color + size ── */
  const updateSizeQtyForColor = useCallback((colorId: string, size: string, delta: number) => {
    setSelectedColors((prev) =>
      prev.map((c) => {
        if (c.colorId !== colorId) return c;
        const currentQty = c.sizes[size] ?? 1;
        const nextQty = currentQty + delta;
        const nextSizes = { ...c.sizes };
        if (nextQty <= 0) {
          delete nextSizes[size];
        } else {
          nextSizes[size] = nextQty;
        }
        return { ...c, sizes: nextSizes };
      })
    );
  }, []);

  /* ── Quantity adjuster for color without sizes ─────── */
  const updateColorOnlyQty = useCallback((colorId: string, delta: number) => {
    setSelectedColors((prev) =>
      prev.map((c) => {
        if (c.colorId !== colorId) return c;
        const currentQty = c.quantity ?? 1;
        const nextQty = Math.max(1, currentQty + delta);
        return { ...c, quantity: nextQty };
      })
    );
  }, []);

  /* ── Standalone size handlers (products without multiple colors) ── */
  const toggleStandaloneSize = useCallback((size: string) => {
    setSelectedStandaloneSizes((prev) => {
      const currentQty = prev[size] ?? 0;
      const next = { ...prev };
      if (currentQty > 0) {
        delete next[size];
      } else {
        next[size] = 1;
      }
      return next;
    });
  }, []);

  const updateStandaloneSizeQty = useCallback((size: string, delta: number) => {
    setSelectedStandaloneSizes((prev) => {
      const currentQty = prev[size] ?? 1;
      const nextQty = currentQty + delta;
      const next = { ...prev };
      if (nextQty <= 0) {
        delete next[size];
      } else {
        next[size] = nextQty;
      }
      return next;
    });
  }, []);

  /* ── Total Items Count & Calculations ─────────────── */
  const totalItemCount = useMemo(() => {
    if (hasRealColors) {
      if (selectedColors.length === 0) return 0;
      return selectedColors.reduce((sum, c) => {
        if (sizes.length > 0) {
          const sizeSum = Object.values(c.sizes).reduce((s, q) => s + q, 0);
          return sum + sizeSum;
        }
        return sum + (c.quantity ?? 1);
      }, 0);
    }

    if (sizes.length > 0) {
      const sizeSum = Object.values(selectedStandaloneSizes).reduce((s, q) => s + q, 0);
      return sizeSum;
    }

    return standaloneQty;
  }, [hasRealColors, selectedColors, sizes.length, selectedStandaloneSizes, standaloneQty]);

  /* ── Order form state ──────────────────────────────── */
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [delivery, setDelivery] = useState<DeliveryArea>("outside");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [leadId, setLeadId] = useState("");

  /* ── FAQ state ─────────────────────────────────────── */
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  /* ── Refs ───────────────────────────────────────────── */
  const orderFormRef = useRef<HTMLDivElement>(null);
  const variantSectionRef = useRef<HTMLDivElement>(null);

  /* ── Derived values ────────────────────────────────── */
  const price = detail?.price ?? 0;
  const originalPrice = detail?.originalPrice || Math.round(price / 0.87);
  const deliveryFee = delivery === "inside" ? DELIVERY_FEE_INSIDE_DHAKA : DELIVERY_FEE_OUTSIDE_DHAKA;
  const effectiveCount = Math.max(totalItemCount, 1);
  const subtotal = price * (totalItemCount > 0 ? totalItemCount : 1);
  const total = subtotal + deliveryFee;
  const phoneNumber = defaultBusiness.whatsappNumber;

  /* ── Lead tracking ─────────────────────────────────── */
  useEffect(() => {
    let id = localStorage.getItem("lpLeadId");
    if (!id) {
      id = `lp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem("lpLeadId", id);
    }
    setLeadId(id);
  }, []);

  /* ── Build cart items for order API & Cart Provider ────────────────── */
  const buildCartItems = useCallback((): CartItem[] => {
    if (!detail) return [];

    if (hasRealColors && selectedColors.length > 0) {
      const items: CartItem[] = [];
      for (const color of selectedColors) {
        const sizeEntries = Object.entries(color.sizes).filter(([_, qty]) => qty > 0);
        if (sizeEntries.length > 0) {
          for (const [size, qty] of sizeEntries) {
            items.push({
              key: `${detail.id}::${size}::${color.colorId}`,
              productId: detail.id,
              name: detail.name,
              price: detail.price,
              quantity: qty,
              imageUrl: color.image || detail.images[0],
              selectedColor: color.label,
              selectedSize: size
            });
          }
        } else {
          // Color selected with fallback quantity
          items.push({
            key: `${detail.id}::default::${color.colorId}`,
            productId: detail.id,
            name: detail.name,
            price: detail.price,
            quantity: color.quantity ?? 1,
            imageUrl: color.image || detail.images[0],
            selectedColor: color.label,
            selectedSize: undefined
          });
        }
      }
      return items;
    }

    if (sizes.length > 0) {
      const sizeEntries = Object.entries(selectedStandaloneSizes).filter(([_, qty]) => qty > 0);
      if (sizeEntries.length > 0) {
        return sizeEntries.map(([size, qty]) => ({
          key: `${detail.id}::${size}::default`,
          productId: detail.id,
          name: detail.name,
          price: detail.price,
          quantity: qty,
          imageUrl: detail.images[0],
          selectedColor: undefined,
          selectedSize: size
        }));
      }
    }

    return [
      {
        key: `${detail.id}::default::default`,
        productId: detail.id,
        name: detail.name,
        price: detail.price,
        quantity: Math.max(1, standaloneQty),
        imageUrl: detail.images[0],
        selectedColor: undefined,
        selectedSize: undefined
      }
    ];
  }, [detail, hasRealColors, selectedColors, sizes.length, selectedStandaloneSizes, standaloneQty]);

  // Lead auto-capture
  useEffect(() => {
    const cleanedPhone = normalizePhoneNumber(phone);
    if (!leadId || !detail || !cleanedPhone.trim()) return;
    const timer = setTimeout(async () => {
      try {
        const items = buildCartItems();
        await fetch("/api/checkout/lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: leadId,
            customerName: customerName.trim(),
            phone: cleanedPhone,
            address: address.trim(),
            items,
            subtotal,
            deliveryFee,
            total,
            deliveryArea: delivery,
            status: "abandoned"
          })
        });
      } catch {
        /* silent */
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [leadId, detail, customerName, phone, address, delivery, subtotal, deliveryFee, total, buildCartItems]);

  /* ── Swipe handlers for gallery ────────────────────── */
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].screenX;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      touchEndX.current = e.changedTouches[0].screenX;
      const diff = touchStartX.current - touchEndX.current;
      const totalImgs = detail?.images.length ?? 1;
      if (Math.abs(diff) > 50) {
        if (diff > 0 && activeImg < totalImgs - 1) {
          setActiveImg((p) => p + 1);
        } else if (diff < 0 && activeImg > 0) {
          setActiveImg((p) => p - 1);
        }
      }
    },
    [activeImg, detail?.images.length]
  );

  /* ── Scroll Helpers ────────────────────────────────── */
  const scrollToOrder = useCallback(() => {
    orderFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const scrollToVariants = useCallback(() => {
    variantSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  /* ── Add to Cart Action ────────────────────────────── */
  const handleAddToCart = useCallback(() => {
    const itemsToAdd = buildCartItems();
    if (itemsToAdd.length === 0) return;
    addCartItems(itemsToAdd);

    const totalAdded = itemsToAdd.reduce((sum, item) => sum + item.quantity, 0);
    setCartToastMessage(`✓ ${totalAdded}টি আইটেম কার্টে যোগ করা হয়েছে!`);
    setTimeout(() => {
      setCartToastMessage(null);
    }, 4000);
  }, [addCartItems, buildCartItems]);

  /* ── Submit order ──────────────────────────────────── */
  const submitOrder = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!detail) return;

    const cleanedPhone = normalizePhoneNumber(phone);

    if (!customerName.trim() || !cleanedPhone || !address.trim()) {
      setError(bn.landing.errors.required);
      return;
    }

    if (!isValidPhoneNumber(phone)) {
      setError("সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)");
      return;
    }

    /* Colors check */
    if (hasRealColors && selectedColors.length === 0) {
      setError("অনুগ্রহ করে অন্তত একটি রঙ সিলেক্ট করুন।");
      return;
    }

    /* Sizes check */
    if (hasRealColors && sizes.length > 0) {
      const emptyColor = selectedColors.find((c) => Object.keys(c.sizes).length === 0);
      if (emptyColor) {
        setError(`অনুগ্রহ করে "${emptyColor.label}" রঙের অন্তত একটি সাইজ সিলেক্ট করুন।`);
        return;
      }
    } else if (!hasRealColors && sizes.length > 0 && Object.keys(selectedStandaloneSizes).length === 0) {
      setError("অনুগ্রহ করে অন্তত একটি সাইজ সিলেক্ট করুন।");
      return;
    }

    const items = buildCartItems();
    if (items.length === 0) {
      setError("অনুগ্রহ করে পণ্য ও সাইজ সিলেক্ট করুন।");
      return;
    }

    const orderPayload = {
      items,
      subtotal,
      deliveryFee,
      total,
      paymentMethod: "COD" as const,
      status: "pending" as const,
      customerName: customerName.trim(),
      phone: cleanedPhone,
      address: address.trim(),
      createdAt: new Date().toISOString(),
      leadId: leadId || undefined
    };

    try {
      setSubmitting(true);
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload)
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || bn.landing.errors.failed);
        return;
      }
      const order = data.order;
      if (!order?.id) {
        setError(bn.landing.errors.failed);
        return;
      }
      localStorage.removeItem("lpLeadId");
      localStorage.setItem("latestOrder", JSON.stringify(order));
      router.push("/checkout/success");
    } catch {
      setError(bn.landing.errors.network);
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Not found ─────────────────────────────────────── */
  if (!detail) {
    return (
      <div className="lp-page" style={{ padding: "60px 20px", textAlign: "center" }}>
        <h2 style={{ marginBottom: 12, fontSize: "1.2rem" }}>{bn.product.notFound}</h2>
        <a href="/store" className="lp-cta-btn" style={{ display: "inline-flex", width: "auto", animation: "none" }}>
          {bn.product.browseStore}
        </a>
      </div>
    );
  }

  const images = detail.images;
  const stock = detail.stock;
  const faqs = bn.landing.faq;
  const reviews = bn.landing.reviews;
  const waUrl = businessWhatsappChatUrl(defaultBusiness);

  return (
    <div className="lp-page">
      {/* ═══════════════════════════════════════════════════
          TOAST NOTIFICATION (Add to cart feedback)
          ═══════════════════════════════════════════════════ */}
      {cartToastMessage && (
        <div className="lp-toast-notification">
          <div className="lp-toast-content">
            <span className="lp-toast-icon">🛒</span>
            <span className="lp-toast-text">{cartToastMessage}</span>
          </div>
          <Link href="/cart" className="lp-toast-link">
            কার্ট দেখুন →
          </Link>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════
          TRUST BADGES TOP BANNER (Screenshot Exact Layout)
          ═══════════════════════════════════════════════════ */}
      <div className="lp-trust-banner">
        <div className="lp-trust-card">
          <span className="lp-trust-emoji">🚚</span>
          <span className="lp-trust-text">সারাদেশে ডেলিভারি</span>
        </div>
        <div className="lp-trust-card">
          <span className="lp-trust-emoji">💰</span>
          <span className="lp-trust-text">ক্যাশ অন ডেলিভারি</span>
        </div>
        <div className="lp-trust-card">
          <span className="lp-trust-emoji">✅</span>
          <span className="lp-trust-text">১০০% অরিজিনাল</span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          SECTION 1: IMAGE GALLERY (swipeable)
          ═══════════════════════════════════════════════════ */}
      <section className="lp-gallery" aria-label="Product images">
        <div
          className="lp-gallery-main"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <ProductImage
            src={images[activeImg]}
            alt={`${detail.name} — image ${activeImg + 1}`}
            fill
            sizes="(max-width: 767px) 100vw, 600px"
            priority={activeImg === 0}
            loadDelay={0}
            className="lp-gallery-main-img"
          />

          {/* Discount badge */}
          {originalPrice > price && (
            <div className="lp-gallery-badge">
              -{Math.round(((originalPrice - price) / originalPrice) * 100)}% ছাড়
            </div>
          )}

          {/* Counter */}
          <div className="lp-gallery-counter">
            {activeImg + 1} / {images.length}
          </div>

          {/* Nav arrows */}
          {activeImg > 0 && (
            <button
              className="lp-gallery-nav prev"
              onClick={() => setActiveImg((p) => p - 1)}
              aria-label="Previous image"
            >
              ‹
            </button>
          )}
          {activeImg < images.length - 1 && (
            <button
              className="lp-gallery-nav next"
              onClick={() => setActiveImg((p) => p + 1)}
              aria-label="Next image"
            >
              ›
            </button>
          )}
        </div>

        {/* Thumbnail strip */}
        {images.length > 1 && (
          <div className="lp-gallery-thumbs">
            {images.map((img, i) => (
              <ProductImage
                key={i}
                src={img}
                alt={`Thumbnail ${i + 1}`}
                width={60}
                height={72}
                sizes="60px"
                loadDelay={100 + i * 100}
                className={`lp-gallery-thumb${i === activeImg ? " active" : ""}`}
                onClick={() => setActiveImg(i)}
              />
            ))}
          </div>
        )}
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 2: PRODUCT INFO
          ═══════════════════════════════════════════════════ */}
      <section className="lp-info">
        <div className="lp-info-brand">{detail.brand}</div>
        <h1 className="lp-info-name">{detail.name}</h1>

        {/* Rating */}
        <div className="lp-info-rating">
          <span className="lp-info-stars">★★★★★</span>
          <span className="lp-info-review-count">
            ({stock > 50 ? "৪৫" : "২৮"} {bn.landing.reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="lp-info-price">
          {originalPrice > price && (
            <span className="lp-info-price-original">
              ৳{originalPrice.toLocaleString("bn-BD")}
            </span>
          )}
          <span className="lp-info-price-current">
            ৳{price.toLocaleString("bn-BD")}
          </span>
          {originalPrice > price && (
            <span className="lp-info-price-discount">
              -{Math.round(((originalPrice - price) / originalPrice) * 100)}%
            </span>
          )}
        </div>

        {/* Stock */}
        <div className="lp-info-stock">
          {bn.landing.stockAvailable} ({stock}{bn.landing.stockUnit})
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 3: KEY HIGHLIGHTS / BULLET POINTS
          ═══════════════════════════════════════════════════ */}
      {detail.descriptionPoints?.length > 0 && (
        <section className="lp-desc">
          <ul className="lp-desc-list">
            {detail.descriptionPoints.map((point, i) => (
              <li key={i} className="lp-desc-item">
                <span className="lp-desc-bullet">🔸</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════
          SECTION 4: DUAL ACTION BUTTONS (Order Now & Add To Cart)
          ═══════════════════════════════════════════════════ */}
      <div className="lp-action-buttons-wrap">
        <button
          className="lp-action-btn lp-btn-order"
          onClick={scrollToOrder}
          type="button"
          id="lp-top-order-btn"
        >
          <span className="lp-btn-icon">⚡</span>
          <span>সরাসরি অর্ডার করুন</span>
        </button>

        <button
          className="lp-action-btn lp-btn-cart"
          onClick={handleAddToCart}
          type="button"
          id="lp-top-cart-btn"
        >
          <span className="lp-btn-icon">🛒</span>
          <span>কার্টে যোগ করুন</span>
        </button>
      </div>

      {/* ═══════════════════════════════════════════════════
          SECTION 5: HOTLINE / QUICK CALL BANNER
          ═══════════════════════════════════════════════════ */}
      <section className="lp-call-banner">
        <div className="lp-call-banner-text">যেকোনো তথ্যের জন্য সরাসরি কল বা হোয়াটসঅ্যাপ করুন</div>
        <a href={businessTelHref(defaultBusiness)} className="lp-call-banner-btn">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          <span>{phoneNumber}</span>
        </a>
      </section>

      {/* ═══════════════════════════════════════════════════
          STEP 1: COLOR & MULTI-SIZE SELECTION
          (Exact design from user screenshot)
          ═══════════════════════════════════════════════════ */}
      {hasRealColors && (
        <section className="lp-variants" id="lp-variant-section" ref={variantSectionRef}>
          <div className="lp-step-header">
            <div className="lp-step-badge">ধাপ ১</div>
            <h2 className="lp-variants-title">🎨 পছন্দের রঙ ও সাইজ সিলেক্ট করুন</h2>
            <p className="lp-variants-hint">নিচের যেকোনো রঙে ক্লিক করে পছন্দমতো সাইজ এবং পরিমাণ নির্ধারণ করুন (একাধিক রঙ নেওয়া যাবে)</p>
          </div>

          <div className="lp-variant-list">
            {colors.map((color, idx) => {
              const selectedColorObj = selectedColors.find((c) => c.colorId === color.id);
              const isSelected = Boolean(selectedColorObj);
              const translatedLabel = translateColorLabel(color.label);
              const cardOriginalPrice = Math.round(price / 0.87);

              // Selected sizes for this color
              const colorSizes = selectedColorObj?.sizes ?? {};
              const selectedSizeKeys = Object.keys(colorSizes);

              return (
                <div
                  key={color.id}
                  className={`lp-variant-card${isSelected ? " selected" : ""}`}
                >
                  {/* Top Bar / Clickable Header */}
                  <div
                    className="lp-variant-card-header"
                    onClick={() => toggleColor(color)}
                    role="button"
                    tabIndex={0}
                    aria-pressed={isSelected}
                  >
                    <div className="lp-variant-checkbox">
                      {isSelected && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>

                    <div className="lp-variant-details">
                      <div className="lp-variant-name">{translatedLabel}</div>
                      <div className="lp-variant-price">
                        <span className="lp-variant-price-original">
                          ৳{cardOriginalPrice.toLocaleString("bn-BD")}
                        </span>
                        <span className="lp-variant-price-current">
                          ৳{price.toLocaleString("bn-BD")}
                        </span>
                      </div>
                    </div>

                    <ProductImage
                      src={color.swatchImage}
                      alt={color.label}
                      width={64}
                      height={76}
                      sizes="64px"
                      loadDelay={200 + idx * 80}
                      className="lp-variant-img"
                    />
                  </div>

                  {/* Expanded Section When Color is Selected */}
                  {isSelected && (
                    <div className="lp-variant-expanded">
                      {(() => {
                        const availableSizes = color.sizes && color.sizes.length > 0 ? color.sizes : sizes;
                        if (availableSizes.length > 0) {
                          return (
                            <div className="lp-variant-sizes-section">
                              <div className="lp-variant-sizes-label">সাইজ নির্বাচন করুন:</div>
                              <div className="lp-variant-sizes-grid">
                                {availableSizes.map((size) => {
                                  const isSizeActive = (colorSizes[size] ?? 0) > 0;
                                  return (
                                    <button
                                      key={size}
                                      type="button"
                                      className={`lp-size-chip${isSizeActive ? " active" : ""}`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleSizeForColor(color.id, size);
                                      }}
                                    >
                                      {size}
                                    </button>
                                  );
                                })}
                              </div>

                              {/* Individual Quantity Counters For Each Selected Size */}
                              {selectedSizeKeys.length > 0 && (
                                <div className="lp-size-qty-list">
                                  {selectedSizeKeys.map((size) => {
                                    const qty = colorSizes[size] || 1;
                                    return (
                                      <div key={size} className="lp-size-qty-row">
                                        <span className="lp-size-qty-title">{size} সাইজ পরিমাণ:</span>
                                        <div className="lp-size-qty-controls">
                                          <button
                                            type="button"
                                            className="lp-qty-btn minus"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              updateSizeQtyForColor(color.id, size, -1);
                                            }}
                                            aria-label="Decrease"
                                          >
                                            −
                                          </button>
                                          <span className="lp-qty-num">{qty}</span>
                                          <button
                                            type="button"
                                            className="lp-qty-btn plus"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              updateSizeQtyForColor(color.id, size, 1);
                                            }}
                                            aria-label="Increase"
                                          >
                                            +
                                          </button>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        }
                        return (
                          /* Quantity control when product has no specific sizes */
                          <div className="lp-size-qty-list" style={{ marginTop: 10 }}>
                            <div className="lp-size-qty-row">
                              <span className="lp-size-qty-title">পরিমাণ:</span>
                              <div className="lp-size-qty-controls">
                                <button
                                  type="button"
                                  className="lp-qty-btn minus"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateColorOnlyQty(color.id, -1);
                                  }}
                                >
                                  −
                                </button>
                                <span className="lp-qty-num">{selectedColorObj?.quantity ?? 1}</span>
                                <button
                                  type="button"
                                  className="lp-qty-btn plus"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateColorOnlyQty(color.id, 1);
                                  }}
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Sticky/Bottom Summary Bar for Variants (from screenshot) */}
          <div className="lp-variant-summary-bar">
            <div className="lp-variant-summary-count">
              নির্বাচিত: <strong>{totalItemCount} টি</strong>
            </div>
            <div className="lp-variant-summary-total">
              ৳{subtotal.toLocaleString("bn-BD")}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════
          STANDALONE SIZES (For products without multi-colors)
          ═══════════════════════════════════════════════════ */}
      {!hasRealColors && sizes.length > 0 && (
        <section className="lp-variants" id="lp-variant-section" ref={variantSectionRef}>
          <div className="lp-step-header">
            <div className="lp-step-badge">ধাপ ১</div>
            <h2 className="lp-variants-title">📏 সাইজ ও পরিমাণ সিলেক্ট করুন</h2>
            <p className="lp-variants-hint">পছন্দের সাইজ বাটনে ক্লিক করে পরিমাণ নির্ধারণ করুন</p>
          </div>

          <div className="lp-variant-sizes-section" style={{ background: "#fff", padding: 14, borderRadius: 12, border: "1.5px solid #e2e8f0" }}>
            <div className="lp-variant-sizes-grid">
              {sizes.map((size) => {
                const isSizeActive = (selectedStandaloneSizes[size] ?? 0) > 0;
                return (
                  <button
                    key={size}
                    type="button"
                    className={`lp-size-chip${isSizeActive ? " active" : ""}`}
                    onClick={() => toggleStandaloneSize(size)}
                  >
                    {size}
                  </button>
                );
              })}
            </div>

            {/* Individual Quantity Counters */}
            {Object.keys(selectedStandaloneSizes).length > 0 && (
              <div className="lp-size-qty-list" style={{ marginTop: 12 }}>
                {Object.keys(selectedStandaloneSizes).map((size) => {
                  const qty = selectedStandaloneSizes[size] || 1;
                  return (
                    <div key={size} className="lp-size-qty-row">
                      <span className="lp-size-qty-title">{size} সাইজ পরিমাণ:</span>
                      <div className="lp-size-qty-controls">
                        <button
                          type="button"
                          className="lp-qty-btn minus"
                          onClick={() => updateStandaloneSizeQty(size, -1)}
                        >
                          −
                        </button>
                        <span className="lp-qty-num">{qty}</span>
                        <button
                          type="button"
                          className="lp-qty-btn plus"
                          onClick={() => updateStandaloneSizeQty(size, 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="lp-variant-summary-bar">
            <div className="lp-variant-summary-count">
              নির্বাচিত: <strong>{totalItemCount} টি</strong>
            </div>
            <div className="lp-variant-summary-total">
              ৳{subtotal.toLocaleString("bn-BD")}
            </div>
          </div>
        </section>
      )}

      {/* Standalone Single Product Quantity (when no colors and no sizes) */}
      {!hasRealColors && sizes.length === 0 && (
        <section className="lp-variants" id="lp-variant-section" ref={variantSectionRef}>
          <div className="lp-step-header">
            <div className="lp-step-badge">ধাপ ১</div>
            <h2 className="lp-variants-title">🔢 পরিমাণ সিলেক্ট করুন</h2>
          </div>
          <div className="lp-size-qty-list" style={{ background: "#fff", padding: 14, borderRadius: 12, border: "1.5px solid #e2e8f0" }}>
            <div className="lp-size-qty-row">
              <span className="lp-size-qty-title">পণ্যের পরিমাণ:</span>
              <div className="lp-size-qty-controls">
                <button
                  type="button"
                  className="lp-qty-btn minus"
                  onClick={() => setStandaloneQty((p) => Math.max(1, p - 1))}
                >
                  −
                </button>
                <span className="lp-qty-num">{standaloneQty}</span>
                <button
                  type="button"
                  className="lp-qty-btn plus"
                  onClick={() => setStandaloneQty((p) => p + 1)}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════
          STEP 2: DIRECT ORDER FORM (Checkout)
          ═══════════════════════════════════════════════════ */}
      <form onSubmit={submitOrder}>
        <section className="lp-order-form" ref={orderFormRef} id="lp-order-section">
          <div className="lp-step-header">
            <div className="lp-step-badge">ধাপ ২</div>
            <h2 className="lp-order-form-title">📦 ডেলিভারি তথ্য দিন ও অর্ডার কনফার্ম করুন</h2>
            <p className="lp-variants-hint">সম্পূর্ণ ক্যাশ অন ডেলিভারি (পণ্য হাতে পেয়ে টাকা পরিশোধ করুন)</p>
          </div>

          {/* Name */}
          <div className="lp-form-group">
            <label htmlFor="lp-name" className="lp-form-label">
              আপনার পুরো নাম লিখুন <span style={{ color: "#e11d48" }}>*</span>
            </label>
            <input
              id="lp-name"
              type="text"
              className="lp-form-input"
              placeholder="যেমন: আরিফ হাসান"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
              autoComplete="name"
              enterKeyHint="next"
            />
          </div>

          {/* Phone */}
          <div className="lp-form-group">
            <label htmlFor="lp-phone" className="lp-form-label">
              আপনার মোবাইল নম্বর লিখুন <span style={{ color: "#e11d48" }}>*</span>
            </label>
            <input
              id="lp-phone"
              type="tel"
              className="lp-form-input"
              placeholder="01XXXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              autoComplete="tel"
              inputMode="tel"
              enterKeyHint="next"
            />
          </div>

          {/* Address */}
          <div className="lp-form-group">
            <label htmlFor="lp-address" className="lp-form-label">
              আপনার সম্পূর্ণ ঠিকানা লিখুন <span style={{ color: "#e11d48" }}>*</span>
            </label>
            <textarea
              id="lp-address"
              className="lp-form-textarea"
              placeholder="বাসা নং, রোড নং, এলাকা, থানা ও জেলা উল্লেখ করুন"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              autoComplete="street-address"
              rows={3}
              enterKeyHint="done"
            />
          </div>

          {/* Delivery Area */}
          <div className="lp-form-group">
            <label className="lp-form-label">ডেলিভারি এলাকা নির্বাচন করুন</label>
            <div className="lp-delivery-options">
              <button
                type="button"
                className={`lp-delivery-option${delivery === "outside" ? " selected" : ""}`}
                onClick={() => setDelivery("outside")}
                aria-pressed={delivery === "outside"}
              >
                <div className="lp-delivery-radio">
                  <div className="lp-delivery-radio-dot" />
                </div>
                <span>ঢাকার বাইরে</span>
                <span className="lp-delivery-fee">({DELIVERY_FEE_OUTSIDE_DHAKA} টাকা)</span>
              </button>
              <button
                type="button"
                className={`lp-delivery-option${delivery === "inside" ? " selected" : ""}`}
                onClick={() => setDelivery("inside")}
                aria-pressed={delivery === "inside"}
              >
                <div className="lp-delivery-radio">
                  <div className="lp-delivery-radio-dot" />
                </div>
                <span>ঢাকার ভিতরে</span>
                <span className="lp-delivery-fee">({DELIVERY_FEE_INSIDE_DHAKA} টাকা)</span>
              </button>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            ORDER SUMMARY
            ═══════════════════════════════════════════════════ */}
        <div className="lp-summary">
          <h3 className="lp-summary-title">অর্ডারের বিবরণ (Order Summary)</h3>

          {/* Itemized List */}
          <div className="lp-summary-items">
            {buildCartItems().map((it, idx) => (
              <div key={idx} className="lp-summary-item">
                <span className="lp-summary-item-name">
                  {it.name}
                  {it.selectedColor ? ` — ${it.selectedColor}` : ""}
                  {it.selectedSize ? ` (${it.selectedSize} সাইজ)` : ""}
                  {" "}<strong>x{it.quantity}</strong>
                </span>
                <span className="lp-summary-item-price">
                  ৳{((it.price || price) * it.quantity).toLocaleString("bn-BD")}
                </span>
              </div>
            ))}
          </div>

          <div className="lp-summary-row">
            <span>মোট পণ্যের দাম (Subtotal)</span>
            <span>৳{subtotal.toLocaleString("bn-BD")}</span>
          </div>
          <div className="lp-summary-row">
            <span>ডেলিভারি চার্জ (Delivery Fee)</span>
            <span>৳{deliveryFee.toLocaleString("bn-BD")}</span>
          </div>
          <div className="lp-summary-row total">
            <span>সর্বমোট প্রদেয় বিল (Total Payable)</span>
            <span>৳{total.toLocaleString("bn-BD")}</span>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════
            ERROR MESSAGE
            ═══════════════════════════════════════════════════ */}
        {error && (
          <div className="lp-error" role="alert">
            <span>⚠</span> {error}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════
            CONFIRM ORDER & ADD TO CART BUTTONS
            ═══════════════════════════════════════════════════ */}
        <div className="lp-confirm-wrap">
          <button
            type="submit"
            className="lp-confirm-btn"
            disabled={submitting}
            id="lp-confirm-order-btn"
          >
            {submitting ? "অর্ডার কনফার্ম হচ্ছে..." : "🛍️ অর্ডার কনফার্ম করুন (ক্যাশ অন ডেলিভারি)"}
          </button>

          <button
            type="button"
            className="lp-add-cart-bottom-btn"
            onClick={handleAddToCart}
            id="lp-bottom-add-to-cart-btn"
          >
            <span className="lp-btn-icon">🛒</span>
            <span>কার্টে যোগ করুন (Add to Cart)</span>
          </button>
        </div>

        {/* Reassurance Trust Box */}
        <div className="lp-reassurance-box">
          <div className="lp-reassurance-item">
            <span className="lp-reassurance-icon">🛡️</span>
            <span>১০০% ক্যাশ অন ডেলিভারি — আগে কোনো টাকা দেওয়া লাগবে না।</span>
          </div>
          <div className="lp-reassurance-item">
            <span className="lp-reassurance-icon">📦</span>
            <span>ডেলিভারি ম্যানের সামনে পার্সেল চেক করে টাকা পরিশোধ করতে পারবেন।</span>
          </div>
          <div className="lp-reassurance-item">
            <span className="lp-reassurance-icon">🔄</span>
            <span>কোনো সমস্যা হলে ৭ দিনের মধ্যে সহজ রিটার্ন ও এক্সচেঞ্জ সুবিধা।</span>
          </div>
        </div>
      </form>

      {/* ═══════════════════════════════════════════════════
          SECTION 6: RELATED PRODUCTS (4 items)
          ═══════════════════════════════════════════════════ */}
      {relatedProducts.length > 0 && (
        <section className="lp-related" style={{ marginTop: "32px", paddingTop: "24px", borderTop: "1px dashed var(--color-border)" }}>
          <h2 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "16px", textAlign: "center", color: "var(--color-text-primary)" }}>
            🛍️ আরও কিছু চমৎকার পছন্দ
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
            {relatedProducts.map((rp) => (
              <a
                key={rp.id}
                href={productPagePath(rp.slug)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  background: "#fff",
                  border: "1.5px solid var(--color-border)",
                  borderRadius: "12px",
                  overflow: "hidden",
                  textDecoration: "none",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  transition: "transform 0.2s ease"
                }}
              >
                <div style={{ position: "relative", width: "100%", paddingTop: "120%", background: "#f8fafc" }}>
                  <img
                    src={rp.imageUrl}
                    alt={rp.name}
                    style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
                <div style={{ padding: "10px", display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--color-text-primary)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: 1.3 }}>
                    {rp.name}
                  </div>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "#e11d48", marginTop: "auto" }}>
                    ৳{rp.price.toLocaleString("bn-BD")}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════
          SECTION 7: FAQ
          ═══════════════════════════════════════════════════ */}
      <section className="lp-faq">
        <h2 className="lp-faq-title">{bn.landing.faqTitle}</h2>
        {faqs.map((faq, i) => (
          <div
            key={i}
            className={`lp-faq-item${openFaq === i ? " open" : ""}`}
          >
            <button
              type="button"
              className="lp-faq-question"
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              aria-expanded={openFaq === i}
            >
              <span>{faq.q}</span>
              <span className="lp-faq-arrow">⌄</span>
            </button>
            <div className="lp-faq-answer">
              <p className="lp-faq-answer-text">{faq.a}</p>
            </div>
          </div>
        ))}
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 8: CUSTOMER REVIEWS
          ═══════════════════════════════════════════════════ */}
      <section className="lp-reviews">
        <h2 className="lp-reviews-title">{bn.landing.reviewsTitle}</h2>
        {reviews.map((review, i) => (
          <div key={i} className="lp-review-card">
            <div className="lp-review-stars">
              {"★".repeat(review.stars)}
            </div>
            <h3 className="lp-review-title">{review.title}</h3>
            <p className="lp-review-text">{review.text}</p>
            <p className="lp-review-author">
              — {review.name}, {review.location}
            </p>
          </div>
        ))}
      </section>

      {/* ═══════════════════════════════════════════════════
          MOBILE STICKY BOTTOM ACTION BAR (Conversion Booster)
          ═══════════════════════════════════════════════════ */}
      <div className="lp-sticky-bottom-bar">
        <div className="lp-sticky-left">
          <div className="lp-sticky-label">
            নির্বাচিত: <strong>{totalItemCount} টি</strong>
          </div>
          <div className="lp-sticky-price">
            ৳{subtotal.toLocaleString("bn-BD")}
          </div>
        </div>
        <div className="lp-sticky-actions">
          <button
            type="button"
            className="lp-sticky-btn cart"
            onClick={handleAddToCart}
            title="কার্টে যোগ করুন"
          >
            🛒 কার্ট {globalCartCount > 0 ? `(${globalCartCount})` : ""}
          </button>
          <button
            type="button"
            className="lp-sticky-btn order"
            onClick={scrollToOrder}
          >
            ⚡ অর্ডার করুন
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          FLOATING WHATSAPP BUTTON
          ═══════════════════════════════════════════════════ */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="lp-floating-wa"
        aria-label="Chat on WhatsApp"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.13.556 4.13 1.528 5.87L0 24l6.29-1.65A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75c-1.993 0-3.886-.54-5.545-1.56l-.398-.237-3.728.978.995-3.636-.26-.413A9.72 9.72 0 0 1 2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75z"/>
        </svg>
      </a>
    </div>
  );
}

