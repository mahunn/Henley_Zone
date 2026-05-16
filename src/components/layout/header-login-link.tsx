"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type HeaderLoginLinkProps = {
  icon: React.ReactNode;
};

export function HeaderLoginLink({ icon }: HeaderLoginLinkProps) {
  const [href, setHref] = useState("/login");
  const [label, setLabel] = useState("লগইন");

  useEffect(() => {
    let cancelled = false;
    void fetch("/api/admin/session", { method: "GET", cache: "no-store", credentials: "include" })
      .then((res) => {
        if (cancelled || !res.ok) return;
        setHref("/admin");
        setLabel("অ্যাডমিন");
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Link href={href} style={{ display: "flex", alignItems: "center", gap: 4 }}>
      {icon}
      {label}
    </Link>
  );
}
