"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { PdpDetail } from "../../../../lib/product-detail-mapper";
import { formatCurrency } from "../../../../lib/money";
import { defaultBusiness, businessTelHref, businessWhatsappChatUrl } from "../../../../config/businesses";
import { DELIVERY_FEE_INSIDE_DHAKA, DELIVERY_FEE_OUTSIDE_DHAKA } from "../../../../config/delivery";
import { bn } from "../../../../config/ui-bn";
import { ProductImage } from "../../../../components/shop/product-image";

/* ── Types ───────────────────────────────────────────── */

interface SelectedVariant {
  colorId: string;
  label: string;
  image: string;
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
  const detail = initialDetail;

  /* ── Gallery state ─────────────────────────────────── */
  const [activeImg, setActiveImg] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  /* ── Variant state ─────────────────────────────────── */
  const [selectedColors, setSelectedColors] = useState<SelectedVariant[]>([]);
  const [selectedSize, setSelectedSize] = useState<string>("");

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

  /* ── Derived values ────────────────────────────────── */
  const price = detail?.price ?? 0;
  const deliveryFee = delivery === "inside" ? DELIVERY_FEE_INSIDE_DHAKA : DELIVERY_FEE_OUTSIDE_DHAKA;
  const itemCount = Math.max(selectedColors.length, 1);
  const subtotal = price * itemCount;
  const total = subtotal + deliveryFee;
  const currency = defaultBusiness.currency;
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

  useEffect(() => {
    if (!leadId || !detail) return;
    const timer = setTimeout(async () => {
      try {
        const items = buildCartItems();
        await fetch("/api/checkout/lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: leadId,
            customerName: customerName.trim(),
            phone: phone.replace(/\s+/g, ""),
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
    }, 2000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leadId, customerName, phone, address, delivery, selectedColors.length]);

  /* ── Swipe handlers for gallery ────────────────────── */
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].screenX;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      touchEndX.current = e.changedTouches[0].screenX;
      const diff = touchStartX.current - touchEndX.current;
      const total = detail?.images.length ?? 1;
      if (Math.abs(diff) > 50) {
        if (diff > 0 && activeImg < total - 1) {
          setActiveImg((p) => p + 1);
        } else if (diff < 0 && activeImg > 0) {
          setActiveImg((p) => p - 1);
        }
      }
    },
    [activeImg, detail?.images.length]
  );

  /* ── Color toggle ──────────────────────────────────── */
  const toggleColor = useCallback(
    (color: PdpDetail["colors"][number]) => {
      setSelectedColors((prev) => {
        const exists = prev.find((c) => c.colorId === color.id);
        if (exists) {
          return prev.filter((c) => c.colorId !== color.id);
        }
        return [...prev, { colorId: color.id, label: color.label, image: color.swatchImage }];
      });
    },
    []
  );

  /* ── Build cart items for order API ────────────────── */
  const buildCartItems = useCallback(() => {
    if (!detail) return [];
    if (selectedColors.length === 0) {
      return [
        {
          key: `${detail.id}::${selectedSize}::default`,
          productId: detail.id,
          name: detail.name,
          price: detail.price,
          quantity: 1,
          imageUrl: detail.images[0],
          selectedColor: undefined,
          selectedSize: selectedSize || undefined
        }
      ];
    }
    return selectedColors.map((c) => ({
      key: `${detail.id}::${selectedSize}::${c.colorId}`,
      productId: detail.id,
      name: detail.name,
      price: detail.price,
      quantity: 1,
      imageUrl: c.image,
      selectedColor: c.label,
      selectedSize: selectedSize || undefined
    }));
  }, [detail, selectedColors, selectedSize]);

  /* ── Scroll to order form ──────────────────────────── */
  const scrollToOrder = useCallback(() => {
    orderFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  /* ── Submit order ──────────────────────────────────── */
  const submitOrder = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!detail) return;

    const cleanedPhone = phone.replace(/\s+/g, "");

    if (!customerName.trim() || !cleanedPhone || !address.trim()) {
      setError(bn.landing.errors.required);
      return;
    }

    if (!/^\+?[0-9]{10,15}$/.test(cleanedPhone)) {
      setError(bn.landing.errors.phone);
      return;
    }

    /* colors required only if product has multiple colors */
    const hasMultipleColors = detail.colors.length > 1 || (detail.colors.length === 1 && detail.colors[0].id !== "default");
    if (hasMultipleColors && selectedColors.length === 0) {
      setError(bn.landing.errors.noColor);
      return;
    }

    const items = buildCartItems();

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
  const colors = detail.colors;
  const hasRealColors = colors.length > 1 || (colors.length === 1 && colors[0].id !== "default");
  const sizes = detail.sizes;
  const stock = detail.stock;
  const faqs = bn.landing.faq;
  const reviews = bn.landing.reviews;

  return (
    <div className="lp-page">
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
            className="lp-gallery-main-img"
          />

          {/* Discount badge (if originalPrice exists) */}
          {detail.originalPrice && detail.originalPrice > detail.price && (
            <div className="lp-gallery-badge">
              -{Math.round(((detail.originalPrice - detail.price) / detail.originalPrice) * 100)}% ছাড়
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
          {detail.originalPrice && detail.originalPrice > detail.price && (
            <span className="lp-info-price-original">
              {formatCurrency(detail.originalPrice, currency)}
            </span>
          )}
          <span className="lp-info-price-current">
            ৳{price.toLocaleString("bn-BD")}
          </span>
          {detail.originalPrice && detail.originalPrice > detail.price && (
            <span className="lp-info-price-discount">
              -{Math.round(((detail.originalPrice - detail.price) / detail.originalPrice) * 100)}%
            </span>
          )}
        </div>

        {/* Stock */}
        <div className="lp-info-stock">
          {bn.landing.stockAvailable} ({stock}{bn.landing.stockUnit})
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 3: DESCRIPTION POINTS
          ═══════════════════════════════════════════════════ */}
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

      {/* ═══════════════════════════════════════════════════
          SECTION 4: CTA "ORDER NOW" BUTTON
          ═══════════════════════════════════════════════════ */}
      <div className="lp-cta-wrap">
        <button
          className="lp-cta-btn"
          onClick={scrollToOrder}
          type="button"
          id="lp-order-now-btn"
        >
          {bn.landing.orderNow}
        </button>
      </div>

      {/* ═══════════════════════════════════════════════════
          SECTION 5: PHONE / CALL
          ═══════════════════════════════════════════════════ */}
      <section className="lp-call">
        <p className="lp-call-label">{bn.landing.callAnytime}</p>
        <p className="lp-call-number">{phoneNumber}</p>
        <a
          href={businessTelHref(defaultBusiness)}
          className="lp-call-btn"
        >
          {bn.landing.callBtn} {phoneNumber}
        </a>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 6: TRUST BADGES
          ═══════════════════════════════════════════════════ */}
      <div className="lp-trust">
        <span className="lp-trust-item">{bn.landing.trustDelivery}</span>
        <span className="lp-trust-item">{bn.landing.trustCod}</span>
        <span className="lp-trust-item">{bn.landing.trustGuarantee}</span>
      </div>

      {/* ═══════════════════════════════════════════════════
          SECTION 7: COLOR / VARIANT SELECTION
          ═══════════════════════════════════════════════════ */}
      {hasRealColors && (
        <section className="lp-variants">
          <h2 className="lp-variants-title">{bn.landing.selectColorSize}</h2>
          <p className="lp-variants-hint">{bn.landing.multiSelectHint}</p>
          <div className="lp-variant-list">
            {colors.map((color) => {
              const isSelected = selectedColors.some((c) => c.colorId === color.id);
              return (
                <button
                  key={color.id}
                  type="button"
                  className={`lp-variant-card${isSelected ? " selected" : ""}`}
                  onClick={() => toggleColor(color)}
                  aria-pressed={isSelected}
                >
                  <div className="lp-variant-checkbox">
                    {isSelected && "✓"}
                  </div>
                  <div className="lp-variant-details">
                    <div className="lp-variant-name">{color.label}</div>
                    <div className="lp-variant-price">
                      <span className="lp-variant-price-current">
                        ৳{price.toLocaleString("bn-BD")}
                      </span>
                    </div>
                  </div>
                  <ProductImage
                    src={color.swatchImage}
                    alt={color.label}
                    width={60}
                    height={72}
                    sizes="60px"
                    className="lp-variant-img"
                  />
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════
          SECTION 7B: SIZE SELECTION
          ═══════════════════════════════════════════════════ */}
      {sizes.length > 0 && (
        <section className="lp-sizes">
          <h3 className="lp-sizes-title">{bn.product.size}</h3>
          <div className="lp-sizes-grid">
            {sizes.map((size) => (
              <button
                key={size}
                type="button"
                className={`lp-size-chip${selectedSize === size ? " selected" : ""}`}
                onClick={() => setSelectedSize(selectedSize === size ? "" : size)}
                aria-pressed={selectedSize === size}
              >
                {size}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════
          DIVIDER
          ═══════════════════════════════════════════════════ */}
      <hr className="lp-divider" />

      {/* ═══════════════════════════════════════════════════
          SECTION 8: ORDER FORM (inline checkout)
          ═══════════════════════════════════════════════════ */}
      <form onSubmit={submitOrder}>
        <section className="lp-order-form" ref={orderFormRef} id="lp-order-section">
          <h2 className="lp-order-form-title">{bn.landing.orderFormTitle}</h2>

          {/* Name */}
          <div className="lp-form-group">
            <label htmlFor="lp-name" className="lp-form-label">
              {bn.landing.nameLabel}
            </label>
            <input
              id="lp-name"
              type="text"
              className="lp-form-input"
              placeholder={bn.landing.namePlaceholder}
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
              {bn.landing.phoneLabel}
            </label>
            <input
              id="lp-phone"
              type="tel"
              className="lp-form-input"
              placeholder={bn.landing.phonePlaceholder}
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
              {bn.landing.addressLabel}
            </label>
            <textarea
              id="lp-address"
              className="lp-form-textarea"
              placeholder={bn.landing.addressPlaceholder}
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
            <label className="lp-form-label">{bn.landing.deliveryAreaLabel}</label>
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
                <span>{bn.landing.outsideDhaka}</span>
                <span className="lp-delivery-fee">({DELIVERY_FEE_OUTSIDE_DHAKA} {bn.landing.taka})</span>
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
                <span>{bn.landing.insideDhaka}</span>
                <span className="lp-delivery-fee">({DELIVERY_FEE_INSIDE_DHAKA} {bn.landing.taka})</span>
              </button>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            SECTION 9: ORDER SUMMARY
            ═══════════════════════════════════════════════════ */}
        <div className="lp-summary">
          <h3 className="lp-summary-title">{bn.landing.orderSummaryTitle}</h3>

          {/* Item list */}
          {selectedColors.length > 0 ? (
            <div className="lp-summary-items">
              {selectedColors.map((c) => (
                <div key={c.colorId} className="lp-summary-item">
                  <span className="lp-summary-item-name">
                    {detail.name} — {c.label}
                    {selectedSize ? ` (${selectedSize})` : ""}
                  </span>
                  <span className="lp-summary-item-price">
                    ৳{price.toLocaleString("bn-BD")}
                  </span>
                </div>
              ))}
            </div>
          ) : hasRealColors ? (
            <div className="lp-summary-warning">{bn.landing.selectColorWarning}</div>
          ) : (
            <div className="lp-summary-items">
              <div className="lp-summary-item">
                <span className="lp-summary-item-name">
                  {detail.name}
                  {selectedSize ? ` (${selectedSize})` : ""}
                </span>
                <span className="lp-summary-item-price">
                  ৳{price.toLocaleString("bn-BD")}
                </span>
              </div>
            </div>
          )}

          <div className="lp-summary-row">
            <span>{bn.checkout.subtotal}</span>
            <span>৳{subtotal.toLocaleString("bn-BD")}</span>
          </div>
          <div className="lp-summary-row">
            <span>{bn.checkout.deliveryFee}</span>
            <span>৳{deliveryFee.toLocaleString("bn-BD")}</span>
          </div>
          <div className="lp-summary-row total">
            <span>{bn.checkout.totalPayable}</span>
            <span>৳{total.toLocaleString("bn-BD")}</span>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════
            ERROR
            ═══════════════════════════════════════════════════ */}
        {error && (
          <div className="lp-error" role="alert">
            <span>⚠</span> {error}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════
            SECTION 10: CONFIRM ORDER BUTTON
            ═══════════════════════════════════════════════════ */}
        <div className="lp-confirm-wrap">
          <button
            type="submit"
            className="lp-confirm-btn"
            disabled={submitting}
            id="lp-confirm-order-btn"
          >
            {submitting ? bn.landing.confirming : bn.landing.confirmOrder}
          </button>
        </div>
        <p className="lp-secure-note">{bn.landing.secureNote}</p>
      </form>

      {/* ═══════════════════════════════════════════════════
          SECTION 11: FAQ
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
          SECTION 12: CUSTOMER REVIEWS
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
          SECTION 13: STATS BAR
          ═══════════════════════════════════════════════════ */}
      <div className="lp-stats">
        <div className="lp-stat">
          <div className="lp-stat-value">{bn.landing.statsRating}</div>
          <div className="lp-stat-label">{bn.landing.statsRatingLabel}</div>
        </div>
        <div className="lp-stat">
          <div className="lp-stat-value">{bn.landing.statsCustomers}</div>
          <div className="lp-stat-label">{bn.landing.statsCustomersLabel}</div>
        </div>
        <div className="lp-stat">
          <div className="lp-stat-value">{bn.landing.statsPositive}</div>
          <div className="lp-stat-label">{bn.landing.statsPositiveLabel}</div>
        </div>
      </div>
    </div>
  );
}
