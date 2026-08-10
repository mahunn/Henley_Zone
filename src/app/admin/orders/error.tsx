"use client";

import { useEffect } from "react";

export default function OrdersErrorBoundary({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin orders error boundary caught:", error);
  }, [error]);

  return (
    <main style={{ maxWidth: 800, margin: "40px auto", padding: "24px", fontFamily: "sans-serif", textAlign: "center" }}>
      <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: 8, padding: 24 }}>
        <h2 style={{ color: "#991B1B", margin: "0 0 8px" }}>Orders View Error</h2>
        <p style={{ color: "#7F1D1D", fontSize: 14, margin: "0 0 16px" }}>
          {error.message || "An unexpected error occurred while rendering the orders list."}
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              padding: "8px 16px",
              background: "#166534",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              fontWeight: 600
            }}
          >
            Retry Loading
          </button>
          <a
            href="https://docs.google.com/spreadsheets"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "8px 16px",
              background: "#0F172A",
              color: "#fff",
              borderRadius: 6,
              textDecoration: "none",
              fontWeight: 600,
              fontSize: 13
            }}
          >
            Open Google Sheet
          </a>
        </div>
      </div>
    </main>
  );
}
