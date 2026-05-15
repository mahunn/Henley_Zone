/** Prefix for a calendar month, e.g. ORD-202605 */
export function orderIdMonthPrefix(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `ORD-${y}${m}`;
}

/** Full id: ORD-YYYYMM + 4-digit serial, e.g. ORD-2026050001 */
export function formatMonthlyOrderId(date: Date, serial: number): string {
  return `${orderIdMonthPrefix(date)}${String(serial).padStart(4, "0")}`;
}

const MONTHLY_ORDER_ID_RE = /^ORD-(\d{4})(\d{2})(\d{4})$/;

/** Parse serial from ids like ORD-2026050007; returns 0 if not a monthly id. */
export function parseMonthlyOrderSerial(id: string): { yyyymm: string; serial: number } | null {
  const m = id.match(MONTHLY_ORDER_ID_RE);
  if (!m) return null;
  return { yyyymm: `${m[1]}${m[2]}`, serial: Number(m[3]) };
}
