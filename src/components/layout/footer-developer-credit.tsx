"use client";

import { usePathname } from "next/navigation";

export function FooterDeveloperCredit() {
  const pathname = usePathname() ?? "";

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <div className="footer-dev-section-vertical" style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "14px", marginTop: "14px" }}>
      <div className="footer-dev-label-vertical">DEVELOPED BY</div>
      <a
        href="https://websy.bd"
        target="_blank"
        rel="noopener noreferrer"
        className="footer-dev-link-block-vertical"
      >
        <img
          src="/websy-logo-white.png"
          alt="Websy.bd"
          className="footer-dev-logo-vertical"
          loading="lazy"
          decoding="async"
        />
        <div className="footer-dev-domain-vertical">websy.bd</div>
      </a>
    </div>
  );
}
