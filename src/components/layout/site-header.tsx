"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/components/cart-provider";
import { useWishlist } from "@/components/wishlist-provider";
import { defaultBusiness, businessTelHref, businessWhatsappChatUrl } from "@/config/businesses";
import { HeaderLoginLink } from "@/components/layout/header-login-link";
import { HeaderSearch } from "@/components/layout/header-search";
import { bn, categoryLabelBn } from "@/config/ui-bn";
import { getCategoriesCatalog, getSyncedCategories } from "@/lib/categories-client";
import { DEFAULT_CATEGORIES, type CategoryItem } from "@/types/category";

function CartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.13.556 4.13 1.528 5.87L0 24l6.29-1.65A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75c-1.993 0-3.886-.54-5.545-1.56l-.398-.237-3.728.978.995-3.636-.26-.413A9.72 9.72 0 0 1 2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75z"/>
    </svg>
  );
}

export function SiteHeader() {
  const { itemCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [logoSrc, setLogoSrc] = useState("/logo.png");
  const [currentHash, setCurrentHash] = useState("");
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [navCategories, setNavCategories] = useState<CategoryItem[]>(() => getSyncedCategories() ?? DEFAULT_CATEGORIES);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    void getCategoriesCatalog().then(setNavCategories);

    const onCategoriesUpdated = () => {
      void getCategoriesCatalog().then(setNavCategories);
    };
    window.addEventListener("hz:categories-updated", onCategoriesUpdated);
    return () => window.removeEventListener("hz:categories-updated", onCategoriesUpdated);
  }, []);

  useEffect(() => {
    const readHash = () => setCurrentHash(window.location.hash || "");
    readHash();
    window.addEventListener("hashchange", readHash);
    return () => window.removeEventListener("hashchange", readHash);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    lastScrollYRef.current = window.scrollY || 0;
    const mobileMq = window.matchMedia("(max-width: 767px)");

    const onScroll = () => {
      const y = window.scrollY || 0;
      const lastY = lastScrollYRef.current;
      const delta = y - lastY;
      const isMobile = mobileMq.matches;
      const hideThreshold = isMobile ? 3 : 4;
      const showThreshold = isMobile ? 1 : 4;

      if (y <= 8) {
        setIsHeaderVisible(true);
      } else if (delta > hideThreshold) {
        setIsHeaderVisible(false);
      } else if (delta < -showThreshold) {
        setIsHeaderVisible(true);
      }

      lastScrollYRef.current = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const activeCategory = searchParams.get("category");
  const onStorePage = pathname === "/store";
  const onHomePage = pathname === "/" && !currentHash.startsWith("#/product/");

  const navClass = (isActive: boolean) => `nav-link${isActive ? " active" : ""}`;

  const scrollToTopAfterNav = () => {
    // Ensure top scroll after route/hash navigation
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "auto" });
    }, 30);
  };

  /** Next.js Link often does not clear client-side hash on `/`; force hash home for hash-routed PDP. */
  const clickHomeOrLogo = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (typeof window === "undefined") return;
    const h = window.location.hash;
    if (pathname === "/" && h.startsWith("#/product/")) {
      e.preventDefault();
      window.location.hash = "#/";
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      });
      return;
    }
    scrollToTopAfterNav();
  };

  return (
    <div className={`main-header ${isHeaderVisible ? "header-scroll-up" : "header-scroll-down"}`}>
      {/* ── Topbar ── */}
      <div className="topbar">
        <div className="topbar-inner container">
          <span style={{ opacity: 0.9, fontSize: "12.5px" }}>
            📍 {bn.brand.codBanner}
            {" · "}
            <a href={businessTelHref(defaultBusiness)} style={{ color: "inherit", textDecoration: "underline" }}>
              📞 {defaultBusiness.whatsappNumber}
            </a>
            {" · "}
            <a
              href={businessWhatsappChatUrl(defaultBusiness)}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "inherit", textDecoration: "underline" }}
            >
              WhatsApp
            </a>
          </span>
          <div className="topbar-right">
            <HeaderLoginLink icon={<UserIcon />} />
          </div>
        </div>
      </div>

      {/* ── Main Nav ── */}
      <header className="site-header">
        <div className="site-header-nav">
          <Link
            href="/#/"
            className="logo-frame"
            aria-label={`${defaultBusiness.name} home`}
            onClick={clickHomeOrLogo}
          >
            <img
              src={logoSrc}
              alt={`${defaultBusiness.name} logo`}
              onError={() => setLogoSrc("/logo-placeholder.svg")}
              className="logo-image"
            />
          </Link>

          <HeaderSearch />

          <div className="header-icons">
            <Link
              className={`icon-nav-btn${pathname === "/wishlist" ? " active" : ""}`}
              href="/wishlist"
              aria-label={`${bn.nav.wishlist}${mounted && wishlistCount > 0 ? ` (${wishlistCount})` : ""}`}
              title={bn.nav.wishlist}
              onClick={scrollToTopAfterNav}
            >
              <HeartIcon />
              {mounted && wishlistCount > 0 && (
                <span className="cart-badge">{wishlistCount}</span>
              )}
            </Link>
            <a
              className="icon-nav-btn icon-nav-btn--whatsapp"
              href={businessWhatsappChatUrl(defaultBusiness)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              title="Chat on WhatsApp"
            >
              <WhatsAppIcon />
            </a>
          </div>
        </div>

        {/* ── Nav Links ── */}
        <nav className="header-nav-links" aria-label="Main navigation">
          <div className="header-nav-links-inner">
            <Link href="/#/" className={navClass(onHomePage)} onClick={clickHomeOrLogo}>
              {bn.nav.home}
            </Link>
            <Link href="/store" className={navClass(onStorePage && !activeCategory)} onClick={scrollToTopAfterNav}>
              {bn.nav.shop}
            </Link>
            {navCategories
              .filter((c) => c.showInNav !== false)
              .map((cat) => (
                <Link
                  key={cat.id}
                  href={`/store?category=${encodeURIComponent(cat.id)}`}
                  className={navClass(onStorePage && activeCategory === cat.id)}
                  onClick={scrollToTopAfterNav}
                >
                  {categoryLabelBn(cat.id, cat.nameBn)}
                </Link>
              ))}
            <Link href="/contact" className={navClass(pathname === "/contact")} onClick={scrollToTopAfterNav}>
              {bn.nav.contact}
            </Link>
          </div>
        </nav>
      </header>
    </div>
  );
}
