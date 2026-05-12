"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";

const MAHIN_PROFILE_REMOTE = "https://mahinahmad.com/profile.jpg";
const PORTRAIT_FALLBACK = "/credits/mahin-ahmad-profile.svg";

export function FooterDeveloperCredit() {
  const pathname = usePathname() ?? "";
  const [src, setSrc] = useState(MAHIN_PROFILE_REMOTE);

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <div className="footer-dev-inline">
      <div className="footer-dev-label">Developed by</div>
      <a
        href="https://mahinahmad.com"
        target="_blank"
        rel="noopener noreferrer"
        className="footer-dev-link-row"
      >
        <div className="footer-dev-copy">
          <span className="footer-dev-name-sm">Mahin Ahmad</span>
          <span className="footer-dev-domain">mahinahmad.com</span>
        </div>
        <img
          src={src}
          alt="Mahin Ahmad"
          width={40}
          height={40}
          className="footer-dev-photo"
          loading="lazy"
          decoding="async"
          onError={() => {
            setSrc((current) => (current === PORTRAIT_FALLBACK ? current : PORTRAIT_FALLBACK));
          }}
        />
      </a>
    </div>
  );
}
