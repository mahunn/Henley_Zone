import { Order } from "@/types/commerce";
import { formatOrderItemLabel } from "@/lib/format-order-line";

/**
 * Encodes CSV content with UTF-8 BOM so Excel and Google Sheets open Bengali text cleanly.
 */
function toCsvBlobWithBom(csvString: string): Blob {
  const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
  return new Blob([bom, csvString], { type: "text/csv;charset=utf-8;" });
}

function escapeCsvField(val: string | number | undefined | null): string {
  if (val === undefined || val === null) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

/**
 * Steadfast Courier Bulk Upload CSV Format:
 * Columns: Invoice, Recipient Name, Recipient Phone, Recipient Address, COD Amount, Note
 */
export function generateSteadfastCourierCsv(orders: Order[]): Blob {
  const headers = [
    "Invoice",
    "Recipient Name",
    "Recipient Phone",
    "Recipient Address",
    "COD Amount",
    "Note"
  ];

  const rows = orders.map((order) => {
    const itemsSummary = order.items
      .map((item) => `${formatOrderItemLabel(item)} x${item.quantity}`)
      .join(", ");
    
    const noteText = order.note ? `${itemsSummary} | Note: ${order.note}` : itemsSummary;

    return [
      escapeCsvField(order.id),
      escapeCsvField(order.customerName),
      escapeCsvField(order.phone),
      escapeCsvField(order.address),
      escapeCsvField(order.total),
      escapeCsvField(noteText)
    ].join(",");
  });

  const csvContent = [headers.join(","), ...rows].join("\r\n");
  return toCsvBlobWithBom(csvContent);
}

/**
 * Pathao Courier Bulk Upload CSV Format
 */
export function generatePathaoCourierCsv(orders: Order[]): Blob {
  const headers = [
    "Merchant Order ID",
    "Recipient Name",
    "Recipient Phone",
    "Recipient Address",
    "Amount to Collect",
    "Item Description / Note"
  ];

  const rows = orders.map((order) => {
    const itemsSummary = order.items
      .map((item) => `${formatOrderItemLabel(item)} x${item.quantity}`)
      .join(", ");

    return [
      escapeCsvField(order.id),
      escapeCsvField(order.customerName),
      escapeCsvField(order.phone),
      escapeCsvField(order.address),
      escapeCsvField(order.total),
      escapeCsvField(itemsSummary)
    ].join(",");
  });

  const csvContent = [headers.join(","), ...rows].join("\r\n");
  return toCsvBlobWithBom(csvContent);
}

/**
 * General Detailed Excel / Spreadsheet CSV Export
 */
export function generateDetailedSpreadsheetCsv(orders: Order[]): Blob {
  const headers = [
    "Order ID",
    "Date",
    "Customer Name",
    "Phone Number",
    "Delivery Address",
    "Items & Variants",
    "Subtotal",
    "Delivery Fee",
    "Total Payable",
    "Order Status",
    "Customer Note"
  ];

  const rows = orders.map((order) => {
    const itemsSummary = order.items
      .map((item) => `${formatOrderItemLabel(item)} (${item.quantity} pcs - ৳${item.price * item.quantity})`)
      .join(" | ");

    return [
      escapeCsvField(order.id),
      escapeCsvField(new Date(order.createdAt).toLocaleString()),
      escapeCsvField(order.customerName),
      escapeCsvField(order.phone),
      escapeCsvField(order.address),
      escapeCsvField(itemsSummary),
      escapeCsvField(order.subtotal),
      escapeCsvField(order.deliveryFee),
      escapeCsvField(order.total),
      escapeCsvField(order.status),
      escapeCsvField(order.note || "")
    ].join(",");
  });

  const csvContent = [headers.join(","), ...rows].join("\r\n");
  return toCsvBlobWithBom(csvContent);
}

/**
 * Triggers a browser file download for generated CSV Blobs
 */
export function downloadBlobFile(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
