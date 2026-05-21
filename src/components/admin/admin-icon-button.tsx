"use client";

import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export type AdminIconButtonVariant =
  | "primary"
  | "ghost"
  | "danger"
  | "success"
  | "warning"
  | "call"
  | "whatsapp";

type BaseProps = {
  label: string;
  variant?: AdminIconButtonVariant;
  children: ReactNode;
  className?: string;
  size?: "md" | "lg";
};

type AdminIconButtonProps = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: string;
    external?: boolean;
  };

type LinkProps = BaseProps & {
  href: string;
  asLink?: true;
};

function variantClass(variant: AdminIconButtonVariant) {
  return `admin-icon-btn admin-icon-btn--${variant}`;
}

function sizeClass(size: "md" | "lg") {
  return size === "lg" ? "admin-icon-btn--lg" : "";
}

export function AdminIconButton({
  label,
  variant = "ghost",
  children,
  className = "",
  size = "md",
  disabled,
  href,
  external,
  type = "button",
  ...rest
}: AdminIconButtonProps) {
  const classes = [variantClass(variant), sizeClass(size), className].filter(Boolean).join(" ");

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        title={label}
        aria-label={label}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        aria-disabled={disabled || undefined}
      >
        <span className="admin-icon-btn__glyph">{children}</span>
      </a>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      title={label}
      aria-label={label}
      disabled={disabled}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      <span className="admin-icon-btn__glyph">{children}</span>
    </button>
  );
}

export function AdminIconLink({
  label,
  variant = "ghost",
  children,
  className = "",
  size = "md",
  href
}: LinkProps) {
  const classes = [variantClass(variant), sizeClass(size), className].filter(Boolean).join(" ");

  return (
    <Link href={href} className={classes} title={label} aria-label={label}>
      <span className="admin-icon-btn__glyph">{children}</span>
    </Link>
  );
}

/** Horizontal group for toolbar actions */
export function AdminIconToolbar({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`admin-icon-toolbar ${className}`.trim()}>{children}</div>;
}
