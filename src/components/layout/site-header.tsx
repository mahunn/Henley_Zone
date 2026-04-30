"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/components/cart-provider";
import { useWishlist } from "@/components/wishlist-provider";
import { defaultBusiness } from "@/config/businesses";
import { Product } from "@/types/commerce";
import { filterProductsBySearch } from "@/lib/product-search";

function SearchIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

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

export function SiteHeader() {
  const { itemCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [logoSrc, setLogoSrc] = useState("/logo.png");
  const [currentHash, setCurrentHash] = useState("");

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const searchWrapRef = useRef<HTMLDivElement>(null);

  // Fetch products for live search
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.products) setProducts(data.products);
      })
      .catch(() => {});
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchFocused(false);
      router.push(`/store?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const searchResults = searchQuery.trim()
    ? filterProductsBySearch(products, searchQuery).slice(0, 5)
    : [];

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

  return (
    <div className="main-header">
      {/* ── Topbar ── */}
      <div className="topbar">
        <div className="topbar-inner container">
          <span style={{ opacity: 0.9, fontSize: "12.5px" }}>
            📍 সারা বাংলাদেশে ক্যাশ অন ডেলিভারি পাওয়া যাচ্ছে
          </span>
          <div className="topbar-right">
            <Link href="/login" style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <UserIcon />
              Login
            </Link>
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
            onClick={scrollToTopAfterNav}
          >
            <img
              src={logoSrc}
              alt={`${defaultBusiness.name} logo`}
              onError={() => setLogoSrc("/logo-placeholder.svg")}
              className="logo-image"
            />
          </Link>

          <div className="nav-search-wrap" ref={searchWrapRef}>
            <form onSubmit={handleSearchSubmit} style={{ display: "flex", width: "100%" }}>
              <input
                type="search"
                placeholder="পণ্য খুঁজুন..."
                className="nav-search"
                aria-label="Search products"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
              />
              <button type="submit" className="nav-search-btn" aria-label="Search">
                <SearchIcon />
              </button>
            </form>

            {/* Live Search Dropdown */}
            {isSearchFocused && searchQuery.trim() && (
              <div className="nav-search-dropdown">
                {searchResults.length > 0 ? (
                  <>
                    <div className="search-dropdown-list">
                      {searchResults.map((p) => {
                        const initials = p.name.slice(0, 2).toUpperCase();
                        const fallbackSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='48'%3E%3Crect width='40' height='48' rx='6' fill='%23e0f2fe'/%3E%3Ctext x='20' y='29' text-anchor='middle' font-family='sans-serif' font-size='12' font-weight='700' fill='%230284c7'%3E${encodeURIComponent(initials)}%3C/text%3E%3C/svg%3E`;
                        return (
                          <a
                            key={p.id}
                            href={`/#/product/${p.slug}`}
                            className="search-dropdown-item"
                            onClick={() => {
                              setIsSearchFocused(false);
                              setSearchQuery("");
                            }}
                          >
                            <img
                              src={p.imageUrl ?? fallbackSvg}
                              alt={p.name}
                              className="search-dropdown-img"
                              onError={(e) => { (e.target as HTMLImageElement).src = fallbackSvg; }}
                            />
                            <div className="search-dropdown-info">
                              <div className="search-dropdown-name">{p.name}</div>
                              <div className="search-dropdown-cat">{p.category}</div>
                            </div>
                          </a>
                        );
                      })}
                    </div>
                    <button
                      className="search-dropdown-footer"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsSearchFocused(false);
                        router.push(`/store?search=${encodeURIComponent(searchQuery.trim())}`);
                      }}
                    >
                      View all results for "{searchQuery}" →
                    </button>
                  </>
                ) : (
                  <div className="search-dropdown-empty">
                    No products found for "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="header-icons">
            <Link
              className={`icon-nav-btn${pathname === "/wishlist" ? " active" : ""}`}
              href="/wishlist"
              aria-label={`Wishlist${mounted && wishlistCount > 0 ? ` (${wishlistCount})` : ""}`}
              title="Wishlist"
              onClick={scrollToTopAfterNav}
            >
              <HeartIcon />
              {mounted && wishlistCount > 0 && (
                <span className="cart-badge">{wishlistCount}</span>
              )}
            </Link>
            <Link className="icon-nav-btn" href="/cart" aria-label="Cart" title={`Cart (${mounted ? itemCount : 0})`}>
              <CartIcon />
              {mounted && itemCount > 0 && (
                <span className="cart-badge">{itemCount}</span>
              )}
            </Link>
          </div>
        </div>

        {/* ── Nav Links ── */}
        <nav className="header-nav-links" aria-label="Main navigation">
          <div className="header-nav-links-inner">
            <Link href="/#/" className={navClass(onHomePage)} onClick={scrollToTopAfterNav}>
              Home
            </Link>
            <Link href="/store" className={navClass(onStorePage && !activeCategory)} onClick={scrollToTopAfterNav}>
              Shop
            </Link>
            <Link
              href="/store?category=Salwar+Kameez"
              className={navClass(onStorePage && activeCategory === "Salwar Kameez")}
              onClick={scrollToTopAfterNav}
            >
              Salwar
            </Link>
            <Link
              href="/store?category=Two+Pieces"
              className={navClass(onStorePage && activeCategory === "Two Pieces")}
              onClick={scrollToTopAfterNav}
            >
              Two Pieces
            </Link>
            <Link
              href="/store?category=Frogs"
              className={navClass(onStorePage && activeCategory === "Frogs")}
              onClick={scrollToTopAfterNav}
            >
              Frogs
            </Link>
            <Link
              href="/store?category=Gown"
              className={navClass(onStorePage && activeCategory === "Gown")}
              onClick={scrollToTopAfterNav}
            >
              Gown
            </Link>
            <Link href="/contact" className={navClass(pathname === "/contact")} onClick={scrollToTopAfterNav}>
              Contact
            </Link>
          </div>
        </nav>
      </header>
    </div>
  );
}
