/** Digits only for wa.me / tel (E.164-style, no +). Handles common BD formats. Safe with null/undefined. */
export function normalizePhoneDigits(phone: string | null | undefined): string {
  if (!phone) return "";
  const str = String(phone);
  const digits = str.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("880")) return digits;
  if (digits.startsWith("0")) return `880${digits.slice(1)}`;
  if (digits.length === 10 && digits.startsWith("1")) return `880${digits}`;
  return digits;
}

export function customerTelHref(phone: string | null | undefined): string {
  const digits = normalizePhoneDigits(phone);
  return digits ? `tel:+${digits}` : "";
}

export function customerWhatsappUrl(phone: string | null | undefined, message?: string): string {
  const digits = normalizePhoneDigits(phone);
  if (!digits) return "";
  const base = `https://wa.me/${digits}`;
  if (!message || typeof message !== "string" || !message.trim()) return base;
  return `${base}?text=${encodeURIComponent(message.trim())}`;
}
