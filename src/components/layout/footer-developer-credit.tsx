"use client";

import { useState } from "react";

const MAHIN_PROFILE_REMOTE = "https://mahinahmad.com/profile.jpg";
const PORTRAIT_FALLBACK = "/credits/mahin-ahmad-profile.svg";

export function FooterDeveloperCredit() {
  const [src, setSrc] = useState(MAHIN_PROFILE_REMOTE);

  return (
    <div className="footer-dev-wrap">
      <div className="footer-dev-section-label">Developed by</div>
      <a
        href="https://mahinahmad.com"
        target="_blank"
        rel="noopener noreferrer"
        className="footer-dev-card"
      >
        <div className="footer-dev-text">
          <span className="footer-dev-name">Mahin Ahmad</span>
          <span className="footer-dev-url">mahinahmad.com</span>
        </div>
        <img
          src={src}
          alt="Mahin Ahmad"
          width={88}
          height={88}
          className="footer-dev-avatar"
          loading="lazy"
          decoding="async"
          sizes="88px"
          onError={() => {
            setSrc((current) => (current === PORTRAIT_FALLBACK ? current : PORTRAIT_FALLBACK));
          }}
        />
      </a>
    </div>
  );
}
