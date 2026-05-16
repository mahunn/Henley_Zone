import Link from "next/link";
import { defaultBusiness, businessTelHref, businessWhatsappChatUrl } from "@/config/businesses";
import { FooterDeveloperCredit } from "@/components/layout/footer-developer-credit";
import { bn } from "@/config/ui-bn";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand-name">{defaultBusiness.name}</div>
            <p className="footer-brand-text">
              বাংলাদেশের নারীদের জন্য প্রিমিয়াম পোশাকের অনলাইন শপ।
              সারা দেশে ক্যাশ অন ডেলিভারি সুবিধায় পাওয়া যাচ্ছে।
            </p>
            <p className="footer-brand-text">
              📞{" "}
              <a href={businessTelHref(defaultBusiness)} className="footer-contact-link">
                {defaultBusiness.whatsappNumber}
              </a>
              {" · "}
              <a
                href={businessWhatsappChatUrl(defaultBusiness)}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-contact-link"
              >
                WhatsApp
              </a>
              <br />
              📍 {bn.footer.location}
            </p>
          </div>

          <div>
            <div className="footer-col-title">{bn.footer.categories}</div>
            <div className="footer-links">
              <Link href="/store?category=Salwar+Kameez">{bn.categories["Salwar Kameez"]}</Link>
              <Link href="/store?category=Two+Pieces">{bn.categories["Two Pieces"]}</Link>
              <Link href="/store?category=Frogs">{bn.categories.Frogs}</Link>
              <Link href="/store?category=Gown">{bn.categories.Gown}</Link>
              <Link href="/store?category=Plazo">{bn.categories.Plazo}</Link>
              <Link href="/store">{bn.footer.allProducts}</Link>
            </div>
          </div>

          <div>
            <div className="footer-col-title">{bn.footer.information}</div>
            <div className="footer-links">
              <Link href="/contact">{bn.footer.contact}</Link>
              <Link href="/shipping-policy">{bn.footer.shipping}</Link>
              <Link href="/return-policy">{bn.footer.returns}</Link>
              <Link href="/privacy-policy">{bn.footer.privacy}</Link>
              <Link href="/terms">{bn.footer.terms}</Link>
            </div>
            <Link href="/admin/login" className="footer-admin-login-mobile">
              {bn.nav.admin} Login
            </Link>
          </div>

          <div className="footer-newsletter-col">
            <div className="footer-col-title">{bn.footer.newsletter}</div>
            <p className="footer-brand-text">{bn.footer.newsletterText}</p>
            <input
              type="email"
              placeholder={bn.footer.emailPlaceholder}
              className="footer-newsletter-input"
              aria-label="Email for newsletter"
            />
            <button className="btn" style={{ width: "100%", justifyContent: "center" }}>
              {bn.footer.subscribe}
            </button>
            <FooterDeveloperCredit />
          </div>
        </div>
      </div>

      <div className="footer-bottom container">
        © {new Date().getFullYear()} {defaultBusiness.name}. {bn.footer.rights}
      </div>
    </footer>
  );
}
