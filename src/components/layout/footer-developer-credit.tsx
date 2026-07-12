"use client";

import { usePathname } from "next/navigation";

export function FooterDeveloperCredit() {
  const pathname = usePathname() ?? "";

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <div className="footer-dev-inline">
      <div className="footer-dev-label">Developed by</div>
      <a
        href="https://websy.bd"
        target="_blank"
        rel="noopener noreferrer"
        className="footer-dev-pill"
      >
        <img
          src="/websy-logo.png"
          alt="Websy Logo"
          width={56}
          height={14}
          className="footer-dev-logo-img"
          loading="lazy"
          decoding="async"
        />
        <span className="footer-dev-domain">websy.bd</span>
      </a>
    </div>
  );
}
