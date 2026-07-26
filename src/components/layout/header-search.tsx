"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Product } from "@/types/commerce";
import { filterProductsBySearch } from "@/lib/product-search";
import { getProductsCatalog, getSyncedProductCatalog, deferCatalogRefresh } from "@/lib/product-catalog-client";
import { productPagePath } from "@/lib/product-url";
import { bn } from "@/config/ui-bn";

function SearchIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

export function HeaderSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [products, setProducts] = useState<Product[]>(() => getSyncedProductCatalog() ?? []);
  const searchWrapRef = useRef<HTMLDivElement>(null);

  const isProductPage = (pathname ?? "").startsWith("/product/");

  useEffect(() => {
    const load = isProductPage ? deferCatalogRefresh : getProductsCatalog;
    void load()
      .then((list) => setProducts(list))
      .catch(() => {});
  }, [isProductPage]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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

  return (
    <div className="nav-search-wrap" ref={searchWrapRef}>
      <form onSubmit={handleSearchSubmit} style={{ display: "flex", width: "100%" }}>
        <input
          type="search"
          placeholder={bn.nav.searchPlaceholder}
          className="nav-search"
          aria-label="Search products"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
        />
        <button type="submit" className="nav-search-btn" aria-label={bn.nav.search}>
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
                      href={productPagePath(p.slug)}
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
  );
}
