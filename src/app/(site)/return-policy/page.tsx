import Link from "next/link";
import { defaultBusiness, businessTelHref, businessWhatsappChatUrl } from "@/config/businesses";

export default function ReturnPolicyPage() {
  const telUrl = businessTelHref(defaultBusiness);
  const waUrl = businessWhatsappChatUrl(defaultBusiness);

  return (
    <main style={{ background: "var(--color-bg)", minHeight: "80vh", padding: "48px 16px" }}>
      <div
        style={{
          maxWidth: 720,
          margin: "0 auto",
          background: "var(--color-surface)",
          borderRadius: 16,
          boxShadow: "0 4px 20px rgba(15, 23, 42, 0.05)",
          border: "1px solid var(--color-border)",
          overflow: "hidden"
        }}
      >
        {/* Header Hero Section */}
        <div
          style={{
            background: "linear-gradient(135deg, var(--color-primary-light) 0%, #f0f9ff 100%)",
            padding: "40px 24px",
            textAlign: "center",
            borderBottom: "1px solid var(--color-border)"
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "#fff",
              boxShadow: "0 4px 12px rgba(14, 165, 233, 0.15)",
              fontSize: 24,
              marginBottom: 16
            }}
          >
            🔄
          </div>
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "1.75rem",
              fontWeight: 700,
              color: "var(--color-text-primary)",
              marginBottom: 8
            }}
          >
            রিটার্ন ও এক্সচেঞ্জ পলিসি
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "var(--color-text-secondary)",
              maxWidth: 480,
              margin: "0 auto",
              lineHeight: 1.5
            }}
          >
            Henley Zone-এ আপনার শপিং অভিজ্ঞতা সহজ ও আনন্দদায়ক করতে আমাদের রয়েছে সহজ রিটার্ন পলিসি।
          </p>
        </div>

        {/* Highlights Cards (Policy Rules with automatic ✅) */}
        <div style={{ padding: "32px 24px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
            
            {/* Rule 1 */}
            <div
              style={{
                display: "flex",
                gap: 16,
                padding: 16,
                borderRadius: 12,
                background: "#f8fafc",
                border: "1.5px solid var(--color-border)",
                alignItems: "flex-start"
              }}
            >
              <span style={{ fontSize: 20, flexShrink: 0, marginTop: 2 }}>✅</span>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 4 }}>
                  ৩ দিনের মধ্যে পরিবর্তনযোগ্য
                </h3>
                <p style={{ fontSize: 13.5, color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
                  ডেলিভারি পাওয়ার পর ৩ দিনের মধ্যে রিটার্ন অথবা এক্সচেঞ্জ রিকোয়েস্ট করতে পারবেন।
                </p>
              </div>
            </div>

            {/* Rule 2 */}
            <div
              style={{
                display: "flex",
                gap: 16,
                padding: 16,
                borderRadius: 12,
                background: "#f8fafc",
                border: "1.5px solid var(--color-border)",
                alignItems: "flex-start"
              }}
            >
              <span style={{ fontSize: 20, flexShrink: 0, marginTop: 2 }}>✅</span>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 4 }}>
                  অক্ষত ও অব্যবহৃত কন্ডিশন
                </h3>
                <p style={{ fontSize: 13.5, color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
                  পণ্যটি অবশ্যই অব্যবহৃত, না ধোয়া এবং অরিজিনাল কন্ডিশনে ট্যাগসহ ফেরত দিতে হবে।
                </p>
              </div>
            </div>

            {/* Rule 3 */}
            <div
              style={{
                display: "flex",
                gap: 16,
                padding: 16,
                borderRadius: 12,
                background: "#f8fafc",
                border: "1.5px solid var(--color-border)",
                alignItems: "flex-start"
              }}
            >
              <span style={{ fontSize: 20, flexShrink: 0, marginTop: 2 }}>✅</span>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 4 }}>
                  ডেলিভারি চার্জের নিয়ম
                </h3>
                <p style={{ fontSize: 13.5, color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
                  ত্রুটিপূর্ণ বা ভুল পণ্য পাঠানো ছাড়া অন্য সকল ক্ষেত্রে ডেলিভারি চার্জ অফেরতযোগ্য।
                </p>
              </div>
            </div>

          </div>

          {/* Quick Step Guide */}
          <div style={{ marginBottom: 32 }}>
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.2rem",
                fontWeight: 700,
                color: "var(--color-text-primary)",
                marginBottom: 16,
                display: "flex",
                alignItems: "center",
                gap: 8
              }}
            >
              📋 কীভাবে রিটার্ন করবেন?
            </h2>
            <div style={{ position: "relative", paddingLeft: 24, borderLeft: "2px solid var(--color-border)" }}>
              {/* Step 1 */}
              <div style={{ marginBottom: 20, position: "relative" }}>
                <div
                  style={{
                    position: "absolute",
                    left: -33,
                    top: 0,
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: "var(--color-primary)",
                    border: "3px solid #fff"
                  }}
                />
                <h4 style={{ fontSize: 14, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 4 }}>
                  ধাপ ১: ছবি তুলুন ও আমাদের জানান
                </h4>
                <p style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.45 }}>
                  পণ্যের সমস্যা বা পছন্দের কারণ উল্লেখ করে আমাদের হোয়াটসঅ্যাপে মেসেজ দিন অথবা সরাসরি কল করুন।
                </p>
              </div>

              {/* Step 2 */}
              <div style={{ marginBottom: 20, position: "relative" }}>
                <div
                  style={{
                    position: "absolute",
                    left: -33,
                    top: 0,
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: "var(--color-primary)",
                    border: "3px solid #fff"
                  }}
                />
                <h4 style={{ fontSize: 14, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 4 }}>
                  ধাপ ২: ডেলিভারি ম্যানের কাছে হস্তান্তর
                </h4>
                <p style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.45 }}>
                  আমাদের কুরিয়ার পার্টনার আপনার ঠিকানায় গিয়ে এক্সচেঞ্জ পণ্য পৌঁছে দিবে এবং পূর্বের পণ্যটি সংগ্রহ করবে।
                </p>
              </div>

              {/* Step 3 */}
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    position: "absolute",
                    left: -33,
                    top: 0,
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: "var(--color-primary)",
                    border: "3px solid #fff"
                  }}
                />
                <h4 style={{ fontSize: 14, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 4 }}>
                  ধাপ ৩: কাজ সম্পন্ন
                </h4>
                <p style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.45 }}>
                  পণ্যটি আমাদের হাতে এসে পৌঁছালে তা ভেরিফাই করার পর আপনার এক্সচেঞ্জ সম্পন্ন হবে।
                </p>
              </div>
            </div>
          </div>

          {/* Call to action & support */}
          <div
            style={{
              padding: "24px 20px",
              borderRadius: 12,
              background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
              border: "1px solid #bbf7d0",
              textAlign: "center"
            }}
          >
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#166534", marginBottom: 8 }}>
              যেকোনো হেল্পের জন্য সরাসরি যোগাযোগ করুন
            </h3>
            <p style={{ fontSize: 13, color: "#1e293b", marginBottom: 16 }}>
              আমাদের কাস্টমার কেয়ার টিম আপনাকে সব ধরণের সহায়তার জন্য প্রস্তুত রয়েছে।
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <a
                href={telUrl}
                style={{
                  padding: "10px 20px",
                  borderRadius: 8,
                  background: "#16a34a",
                  color: "#fff",
                  fontSize: 13.5,
                  fontWeight: 700,
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6
                }}
              >
                📞 কল করুন
              </a>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: "10px 20px",
                  borderRadius: 8,
                  background: "#25d366",
                  color: "#fff",
                  fontSize: 13.5,
                  fontWeight: 700,
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6
                }}
              >
                💬 হোয়াটসঅ্যাপ চ্যাট
              </a>
            </div>
          </div>

          {/* Back button */}
          <div style={{ textAlign: "center", marginTop: 24 }}>
            <Link
              href="/store"
              style={{
                fontSize: 13.5,
                color: "var(--color-primary)",
                fontWeight: 600,
                textDecoration: "none"
              }}
            >
              ← শপে ফিরে যান
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
