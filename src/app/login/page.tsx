"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"]
});

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const supabase = useMemo(() => {
    if (!supabaseUrl || !supabaseAnonKey) return null;
    return createClient(supabaseUrl, supabaseAnonKey);
  }, [supabaseUrl, supabaseAnonKey]);

  const onLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      // 1) Try admin auth first
      const adminRes = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: identifier, password })
      });

      if (adminRes.ok) {
        router.push("/admin");
        router.refresh();
        return;
      }

      // 2) Fallback: customer auth
      if (!supabase) {
        setError("Customer auth is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
        return;
      }

      const payload = identifier.includes("@")
        ? { email: identifier, password }
        : { phone: identifier, password };
      const { error: customerError } = await supabase.auth.signInWithPassword(payload);
      if (customerError) {
        setError(customerError.message || "Invalid login credentials.");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={`login-page ${inter.className}`}>
      <div className="login-card login-card-unified">
        <div className="login-head">
          <h1>Login</h1>
          <p>One login for all users. Role decides your destination.</p>
        </div>

        <form className="login-form" onSubmit={onLogin}>
          <label className="login-label" htmlFor="identifier">
            Email / Phone *
          </label>
          <input
            id="identifier"
            className="login-input"
            type="text"
            placeholder="Email or phone"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />
          <label className="login-label" htmlFor="password">
            Password *
          </label>
          <input
            id="password"
            className="login-input"
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error ? <p className="login-error">{error}</p> : null}
          <div className="login-links-row">
            <button type="button" className="login-inline-link">
              Forgot password?
            </button>
            <Link href="/login" className="login-inline-link">
              Register now
            </Link>
          </div>
          <button className="login-submit login-submit-green" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="login-back-link"><Link href="/">Back to home</Link></p>
      </div>
    </main>
  );
}
