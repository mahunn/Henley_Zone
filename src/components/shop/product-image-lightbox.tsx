"use client";

import { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { ProductImage } from "@/components/shop/product-image";
import { bn } from "@/config/ui-bn";

type Props = {
  open: boolean;
  onClose: () => void;
  images: string[];
  index: number;
  onIndexChange: (index: number) => void;
  alt: string;
};

export function ProductImageLightbox({
  open,
  onClose,
  images,
  index,
  onIndexChange,
  alt
}: Props) {
  const hasMultiple = images.length > 1;
  const safeIndex = images.length ? Math.min(index, images.length - 1) : 0;

  const goPrev = useCallback(() => {
    if (!images.length) return;
    onIndexChange((safeIndex - 1 + images.length) % images.length);
  }, [safeIndex, images.length, onIndexChange]);

  const goNext = useCallback(() => {
    if (!images.length) return;
    onIndexChange((safeIndex + 1) % images.length);
  }, [safeIndex, images.length, onIndexChange]);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (hasMultiple && e.key === "ArrowLeft") goPrev();
      if (hasMultiple && e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, goPrev, goNext, hasMultiple]);

  if (!open || !images.length || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div
      className="pdp-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      onClick={onClose}
    >
      <button
        type="button"
        className="pdp-lightbox-close"
        onClick={onClose}
        aria-label={bn.product.closeImage}
      >
        ×
      </button>

      {hasMultiple && (
        <>
          <button
            type="button"
            className="pdp-lightbox-nav pdp-lightbox-nav--prev"
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            aria-label={bn.scroll.previous}
          >
            ‹
          </button>
          <button
            type="button"
            className="pdp-lightbox-nav pdp-lightbox-nav--next"
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            aria-label={bn.scroll.next}
          >
            ›
          </button>
        </>
      )}

      <div className="pdp-lightbox-stage" onClick={(e) => e.stopPropagation()}>
        <div className="pdp-lightbox-img-wrap">
          <ProductImage
            src={images[safeIndex]}
            alt={alt}
            fill
            sizes="100vw"
            className="pdp-lightbox-img"
            priority
          />
        </div>
        {hasMultiple && (
          <p className="pdp-lightbox-counter">
            {safeIndex + 1} / {images.length}
          </p>
        )}
      </div>
    </div>,
    document.body
  );
}
