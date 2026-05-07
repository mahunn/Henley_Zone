"use client";

/**
 * Creates a quick "snapshot flying to cart" animation from product image to header cart icon.
 */
export function animateFlyToCart(imageEl: HTMLElement | null) {
  if (typeof window === "undefined" || !imageEl) return;
  const headerEl = document.querySelector(".main-header") as HTMLElement | null;
  const isMobile = window.matchMedia("(max-width: 767px)").matches;

  const from = imageEl.getBoundingClientRect();
  if (!from.width || !from.height) return;

  const clone = imageEl.cloneNode(true) as HTMLElement;
  clone.setAttribute("aria-hidden", "true");
  clone.style.position = "fixed";
  clone.style.left = `${from.left}px`;
  clone.style.top = `${from.top}px`;
  clone.style.width = `${from.width}px`;
  clone.style.height = `${from.height}px`;
  clone.style.margin = "0";
  clone.style.objectFit = "cover";
  clone.style.objectPosition = "top";
  clone.style.borderRadius = "10px";
  clone.style.pointerEvents = "none";
  clone.style.zIndex = "9999";
  clone.style.boxShadow = "0 10px 30px rgba(0,0,0,0.22)";
  clone.style.transition = "none";
  clone.style.transformOrigin = "center center";

  document.body.appendChild(clone);

  const navTop = headerEl ? headerEl.getBoundingClientRect().top + 16 : 56;
  const toY = navTop - (from.top + from.height / 2);
  const upY = Math.min(-90, toY);
  const driftX = 10;
  const durationMs = isMobile ? 2200 : 980;
  const firstStopOffset = isMobile ? 0.34 : 0.2;
  const firstStopY = isMobile ? -4 : -8;

  requestAnimationFrame(() => {
    clone.animate(
      [
        {
          transform: "translate(0px, 0px) scale(1)",
          opacity: 1,
          borderRadius: "10px",
          offset: 0
        },
        {
          // pop near the card first
          transform: `translate(0px, ${firstStopY}px) scale(1.12)`,
          opacity: 1,
          borderRadius: "12px",
          offset: firstStopOffset
        },
        {
          // then fly upward and fade out
          transform: `translate(${driftX}px, ${upY}px) scale(0.22)`,
          opacity: 0,
          borderRadius: "999px",
          offset: 1
        }
      ],
      {
        duration: durationMs,
        easing: "cubic-bezier(0.15, 0.85, 0.2, 1)",
        fill: "forwards"
      }
    );
  });

  window.setTimeout(() => {
    clone.remove();
  }, durationMs + 60);
}

