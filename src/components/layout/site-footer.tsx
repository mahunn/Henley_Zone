import Link from "next/link";
import { defaultBusiness, businessTelHref, businessWhatsappChatUrl } from "@/config/businesses";
import { FooterDeveloperCredit } from "@/components/layout/footer-developer-credit";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand column */}
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
              📍 Dhaka, Bangladesh
            </p>
          </div>

          {/* Categories */}
          <div>
            <div className="footer-col-title">Categories</div>
            <div className="footer-links">
              <Link href="/store?category=Salwar+Kameez">Salwar Kameez</Link>
              <Link href="/store?category=Two+Pieces">Two Pieces</Link>
              <Link href="/store?category=Frogs">Frogs</Link>
              <Link href="/store?category=Gown">Gown</Link>
              <Link href="/store">All Products</Link>
            </div>
          </div>

          {/* Information */}
          <div>
            <div className="footer-col-title">Information</div>
            <div className="footer-links">
              <Link href="/contact">Contact Us</Link>
              <Link href="/shipping-policy">Shipping Policy</Link>
              <Link href="/return-policy">Return Policy</Link>
              <Link href="/privacy-policy">Privacy Policy</Link>
              <Link href="/terms">Terms &amp; Service</Link>
            </div>
            <Link href="/admin/login" className="footer-admin-login-mobile">
              Admin Login
            </Link>
          </div>

          {/* Newsletter */}
          <div>
            <div className="footer-col-title">Newsletter</div>
            <p className="footer-brand-text">
              নতুন পণ্য ও অফার পেতে সাবস্ক্রাইব করুন।
            </p>
            <input
              type="email"
              placeholder="Your e-mail"
              className="footer-newsletter-input"
              aria-label="Email for newsletter"
            />
            <button className="btn" style={{ width: "100%", justifyContent: "center" }}>
              Subscribe
            </button>
          </div>
        </div>

        <FooterDeveloperCredit />
      </div>

      <div className="footer-bottom container">
        © {new Date().getFullYear()} {defaultBusiness.name}. All rights reserved.
      </div>
    </footer>
  );
}
