import { defaultBusiness } from "@/config/businesses";
import { formatOrderItemLabel } from "@/lib/format-order-line";
import { formatCurrency } from "@/lib/money";
import type { Order } from "@/types/commerce";

/** Plain-text order summary (admin copy + customer receipt). */
export function formatOrderForClipboard(order: Order): string {
  return formatOrderSummaryLines(order).join("\n");
}

export function formatOrderSummaryLines(order: Order): string[] {
  const currency = defaultBusiness.currency;
  const lines = [
    `Order ID: ${order.id}`,
    `Date: ${new Date(order.createdAt).toLocaleString()}`,
    `Customer: ${order.customerName}`,
    `Phone: ${order.phone}`,
    `Address: ${order.address}`,
    `Payment: ${order.paymentMethod}`,
    `Status: ${order.status}`,
    `Subtotal: ${formatCurrency(order.subtotal, currency)}`,
    `Delivery: ${formatCurrency(order.deliveryFee, currency)}`,
    `Total: ${formatCurrency(order.total, currency)}`,
    "Items:"
  ];

  for (const item of order.items) {
    const label = formatOrderItemLabel(item);
    const lineTotal = item.price * item.quantity;
    lines.push(
      `- ${label} x${item.quantity} @ ${formatCurrency(item.price, currency)} = ${formatCurrency(lineTotal, currency)}`
    );
  }

  if (order.note?.trim()) {
    lines.push(`Note: ${order.note.trim()}`);
  }

  return lines;
}
