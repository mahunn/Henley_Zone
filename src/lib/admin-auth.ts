import { createHmac, timingSafeEqual } from "node:crypto";
import type { NextResponse } from "next/server";

export const ADMIN_SESSION_COOKIE = "admin_session";

/** Session cookie: no maxAge — kept until the browser is fully closed. */
export function setAdminSessionCookie(response: NextResponse, sessionValue: string) {
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: sessionValue,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/"
  });
}

export function getAdminUsername() {
  return process.env.ADMIN_DASHBOARD_USERNAME;
}

export function getAdminPassword() {
  return process.env.ADMIN_DASHBOARD_PASSWORD;
}

export function getAdminSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET;
}

export function createSessionValue() {
  const secret = getAdminSessionSecret();
  if (!secret) return "";
  const issuedAt = Date.now().toString();
  const signature = signValue(issuedAt, secret);
  return `${issuedAt}.${signature}`;
}

export function isValidSessionCookie(cookieValue?: string) {
  const secret = getAdminSessionSecret();
  if (!cookieValue || !secret) return false;

  const normalized = decodeURIComponent(cookieValue);
  const [issuedAt, providedSignature] = normalized.split(".");
  if (!issuedAt || !providedSignature) return false;

  const expectedSignature = signValue(issuedAt, secret);
  const providedBuffer = Buffer.from(providedSignature);
  const expectedBuffer = Buffer.from(expectedSignature);
  if (providedBuffer.length !== expectedBuffer.length) return false;

  try {
    return timingSafeEqual(providedBuffer, expectedBuffer);
  } catch {
    return false;
  }
}

function signValue(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("hex");
}

