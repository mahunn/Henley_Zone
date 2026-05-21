"use client";

import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { bn } from "@/config/ui-bn";

type Props = {
  children: ReactNode;
  trackClassName?: string;
  scrollStep?: number;
  ariaLabel?: string;
  /** Show prev/next buttons when there are at least this many items (default 4). */
  minItemsForArrows?: number;
};

export function HorizontalScrollRow({
  children,
  trackClassName = "",
  scrollStep = 200,
  ariaLabel,
  minItemsForArrows = 4
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const itemCount = Children.count(children);
  const showArrows = itemCount >= minItemsForArrows;

  const updateScrollState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    const observer = new ResizeObserver(updateScrollState);
    observer.observe(el);
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      observer.disconnect();
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState, children]);

  function scroll(dir: "left" | "right") {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -scrollStep : scrollStep, behavior: "smooth" });
  }

  const trackClasses = ["hz-scroll-track", trackClassName].filter(Boolean).join(" ");

  return (
    <div className="hz-scroll-block">
      <div className="cat-scroll-wrap hz-scroll-wrap" role={ariaLabel ? "group" : undefined} aria-label={ariaLabel}>
        {showArrows ? (
          <button
            type="button"
            className="cat-scroll-arrow hz-scroll-arrow left"
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            aria-label={bn.scroll.previous}
          >
            ‹
          </button>
        ) : null}
        <div ref={trackRef} className={trackClasses}>
          {children}
        </div>
        {showArrows ? (
          <button
            type="button"
            className="cat-scroll-arrow hz-scroll-arrow right"
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            aria-label={bn.scroll.next}
          >
            ›
          </button>
        ) : null}
      </div>
    </div>
  );
}
