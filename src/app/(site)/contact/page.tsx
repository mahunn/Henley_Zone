import { defaultBusiness, businessTelHref, businessWhatsappChatUrl } from "@/config/businesses";

export default function ContactPage() {
  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: 24 }}>
      <h1>Contact Us</h1>
      <p>For orders and support, contact us using the details below.</p>
      <p>
        <strong>Business:</strong> {defaultBusiness.name}
      </p>
      <p>
        <strong>Phone / WhatsApp:</strong>{" "}
        <a href={businessTelHref(defaultBusiness)}>{defaultBusiness.whatsappNumber}</a>
        {" · "}
        <a href={businessWhatsappChatUrl(defaultBusiness)} target="_blank" rel="noopener noreferrer">
          Open in WhatsApp
        </a>
      </p>
      <p>
        <strong>Support Hours:</strong> 10:00 AM - 8:00 PM (Daily)
      </p>
    </main>
  );
}

