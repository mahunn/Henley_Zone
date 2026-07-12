import { Suspense } from "react";
import Link from "next/link";
import "../globals.css";
import "./landing.css";
import { defaultBusiness, businessWhatsappChatUrl, businessTelHref } from "../../config/businesses";
import { bn } from "../../config/ui-bn";
import { DeferredMetaPixel } from "../../components/analytics/deferred-meta-pixel";

function LandingHeader() {
  const waUrl = businessWhatsappChatUrl(defaultBusiness);
  const telHref = businessTelHref(defaultBusiness);

  return (
    <header className="lp-header">
      <div className="lp-header-inner">
        <Link href="/#/" className="lp-header-logo">
          <img src="/logo.png" alt="Henley" className="lp-header-logo-img" />
        </Link>
        <div className="lp-header-actions">
          <a href={telHref} className="lp-header-action-btn phone" aria-label="Call Us">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </a>
          <a href={waUrl} target="_blank" rel="noopener noreferrer" className="lp-header-action-btn whatsapp" aria-label="Chat on WhatsApp">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.13.556 4.13 1.528 5.87L0 24l6.29-1.65A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75c-1.993 0-3.886-.54-5.545-1.56l-.398-.237-3.728.978.995-3.636-.26-.413A9.72 9.72 0 0 1 2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75z"/>
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}

/**
 * Minimal landing layout — reuses SiteHeader (with topbar/nav hidden via CSS)
 * to provide inline search, cart, and wishlist.
 */
export default function LandingLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const waUrl = businessWhatsappChatUrl(defaultBusiness);

  return (
    <>
      <DeferredMetaPixel />

      {/* ── Branded Header (inline, matching main site) ── */}
      <LandingHeader />

      {/* ── Page Content ──────────────────────────────── */}
      {children}

      {/* ── Floating WhatsApp ─────────────────────────── */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="lp-whatsapp-float"
        aria-label="Chat on WhatsApp"
      >
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.13.556 4.13 1.528 5.87L0 24l6.29-1.65A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75c-1.993 0-3.886-.54-5.545-1.56l-.398-.237-3.728.978.995-3.636-.26-.413A9.72 9.72 0 0 1 2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75z"/></svg>
      </a>

      {/* ── Minimal Footer ────────────────────────────── */}
      <footer className="lp-footer">
        © {new Date().getFullYear()} {defaultBusiness.name} — সর্বস্বত্ব সংরক্ষিত
      </footer>
    </>
  );
}
