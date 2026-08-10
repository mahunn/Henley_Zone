import { Order } from "@/types/commerce";
import { formatOrderItemLabel } from "@/lib/format-order-line";

export interface GoogleSheetOrderPayload {
  orderId: string;
  date: string;
  monthName: string;
  dayHeading: string;
  customerName: string;
  phone: string;
  address: string;
  itemsText: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: string;
  packingStatus: string;
  note: string;
}

/**
 * Formats order items into clean detailed Bengali descriptions for Google Sheet rows.
 * E.g.: "কটন শার্ট (কালার: নেভী, সাইজ: 42) - 1টি"
 */
export function formatOrderItemsForSheet(order: Order): string {
  if (!order.items || order.items.length === 0) return "N/A";
  
  return order.items
    .map((item) => {
      const label = formatOrderItemLabel(item);
      const qty = `${item.quantity}টি`;
      return `${label} - ${qty}`;
    })
    .join(" | ");
}

/**
 * Gets the configured Google Apps Script Webhook URL from environment variables.
 */
export function getGoogleSheetWebhookUrl(): string {
  return (
    process.env.GOOGLE_SHEET_WEBHOOK_URL ||
    process.env.NEXT_PUBLIC_GOOGLE_SHEET_WEBHOOK_URL ||
    "https://script.google.com/macros/s/AKfycbwlPAQnXh0uOMX9B_6Y2hu84aSS9VwLj5yUXBdf5vY8VYsR5jMPwOjIhbkKlEL6UoOiyw/exec"
  ).trim();
}

/**
 * Synchronizes a newly placed order to Google Sheets in real-time.
 * Safe & non-blocking: Never throws an unhandled exception to prevent order disruption.
 */
export async function syncOrderToGoogleSheet(order: Order): Promise<{ success: boolean; error?: string }> {
  const webhookUrl = getGoogleSheetWebhookUrl();
  if (!webhookUrl) {
    return { success: false, error: "GOOGLE_SHEET_WEBHOOK_URL not configured." };
  }

  const orderDate = new Date(order.createdAt);
  const validDate = Number.isNaN(orderDate.getTime()) ? new Date() : orderDate;

  const monthName = validDate.toLocaleDateString("en-US", {
    timeZone: "Asia/Dhaka",
    month: "long",
    year: "numeric"
  }); // e.g. "August 2026"

  const dayHeading = validDate.toLocaleDateString("en-US", {
    timeZone: "Asia/Dhaka",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  }); // e.g. "Monday, 10 August 2026"

  const payload: GoogleSheetOrderPayload = {
    orderId: order.id,
    date: validDate.toLocaleString("en-GB", {
      timeZone: "Asia/Dhaka",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    }),
    monthName,
    dayHeading,
    customerName: order.customerName,
    phone: order.phone,
    address: order.address,
    itemsText: formatOrderItemsForSheet(order),
    subtotal: order.subtotal,
    deliveryFee: order.deliveryFee,
    total: order.total,
    status: order.status ? order.status.toUpperCase() : "PENDING",
    packingStatus: "Unpacked",
    note: order.note || ""
  };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      console.warn("Google Sheet webhook returned non-200 status:", response.status, text);
      return { success: false, error: `HTTP ${response.status}: ${text}` };
    }

    return { success: true };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "Unknown sync error";
    console.warn("Failed to sync order to Google Sheet:", errorMsg);
    return { success: false, error: errorMsg };
  }
}

/**
 * Sync status updates (e.g. Confirmed / Cancelled / Delivered) to Google Sheet row
 */
export async function syncOrderStatusToGoogleSheet(
  orderId: string,
  status: Order["status"]
): Promise<void> {
  const webhookUrl = getGoogleSheetWebhookUrl();
  if (!webhookUrl) return;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "UPDATE_STATUS",
        orderId,
        status: status.toUpperCase()
      }),
      signal: controller.signal
    });

    clearTimeout(timeout);
  } catch (err) {
    console.warn("Failed to sync order status update to Google Sheet:", err);
  }
}

/**
 * Enhanced Google Apps Script with Month-wise Tabs & Day-wise Sections
 */
export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * HENLEY ZONE - MONTH-WISE & DAY-WISE ORDER SYNC
 * Features:
 * 1. Automatically creates a tab for each Month (e.g. "August 2026").
 * 2. Adds Green Section Header for each Day (e.g. "📅 Monday, 10 August 2026").
 * 3. Adds Dropdown Menus for Order Status (Confirmed, Pending, Cancelled) and Packing Status.
 */

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var data = JSON.parse(e.postData.contents);
    var monthName = data.monthName || "Orders";
    var dayHeading = data.dayHeading || "Today";

    // 1. Get or Create Month Tab
    var sheet = ss.getSheetByName(monthName);
    if (!sheet) {
      sheet = ss.insertSheet(monthName);
      var defaultSheet = ss.getSheetByName("Sheet1");
      if (defaultSheet && defaultSheet.getLastRow() === 0 && ss.getSheets().length > 1) {
        try { ss.deleteSheet(defaultSheet); } catch(e) {}
      }
    }

    // 2. Initialize Headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      var headers = [
        "Order ID",
        "Date & Time",
        "Customer Name",
        "Phone Number",
        "Delivery Address",
        "Detailed Items (Color/Size/Qty)",
        "Total (৳)",
        "Order Status",
        "Packing Status",
        "Notes"
      ];
      sheet.appendRow(headers);
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground("#0F172A").setFontColor("#FFFFFF").setFontWeight("bold").setFontSize(11);
      sheet.setFrozenRows(1);
    }

    // 3. Handle Status Updates from Admin Panel
    if (data.action === "UPDATE_STATUS") {
      var sheets = ss.getSheets();
      for (var s = 0; s < sheets.length; s++) {
        var curSheet = sheets[s];
        var rows = curSheet.getDataRange().getValues();
        for (var i = 1; i < rows.length; i++) {
          if (rows[i][0] === data.orderId) {
            var statusCell = curSheet.getRange(i + 1, 8);
            statusCell.setValue(data.status);
            applyStatusColor(statusCell, data.status);
            break;
          }
        }
      }
      return ContentService.createTextOutput(JSON.stringify({ result: "status updated" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // 4. Check if Day Header exists for today; if not, add Green Day Section Header
    var lastRow = sheet.getLastRow();
    var needDayHeader = true;
    if (lastRow > 1) {
      var lastValues = sheet.getRange(1, 1, lastRow, 2).getValues();
      for (var r = lastValues.length - 1; r >= 0; r--) {
        if (lastValues[r][0] && String(lastValues[r][0]).indexOf(dayHeading) !== -1) {
          needDayHeader = false;
          break;
        }
      }
    }

    if (needDayHeader) {
      // Append blank row for spacing if not first row
      if (sheet.getLastRow() > 1) {
        sheet.appendRow(["", "", "", "", "", "", "", "", "", ""]);
      }
      var dayHeaderRow = ["📅 " + dayHeading, "", "", "", "", "", "", "", "", ""];
      sheet.appendRow(dayHeaderRow);
      var dayHeaderIdx = sheet.getLastRow();
      var dayRange = sheet.getRange(dayHeaderIdx, 1, 1, 10);
      dayRange.setBackground("#15803D").setFontColor("#FFFFFF").setFontWeight("bold").setFontSize(11);
    }

    // 5. Append New Order Row
    var newRow = [
      data.orderId || "",
      data.date || new Date().toLocaleString(),
      data.customerName || "",
      "'" + (data.phone || ""),
      data.address || "",
      data.itemsText || "",
      data.total || 0,
      data.status || "PENDING",
      data.packingStatus || "Unpacked",
      data.note || ""
    ];

    sheet.appendRow(newRow);
    var orderRowIdx = sheet.getLastRow();
    
    var rowRange = sheet.getRange(orderRowIdx, 1, 1, newRow.length);
    rowRange.setFontFamily("Arial").setFontSize(10).setVerticalAlignment("middle");

    // Add Dropdown Menu for Order Status (Column 8)
    var statusCell = sheet.getRange(orderRowIdx, 8);
    var statusRule = SpreadsheetApp.newDataValidation()
      .requireValueInList(["PENDING", "CONFIRMED", "DELIVERED", "CANCELLED"], true)
      .setAllowInvalid(false)
      .build();
    statusCell.setDataValidation(statusRule);
    applyStatusColor(statusCell, data.status || "PENDING");

    // Add Dropdown Menu for Packing Status (Column 9)
    var packingCell = sheet.getRange(orderRowIdx, 9);
    var packingRule = SpreadsheetApp.newDataValidation()
      .requireValueInList(["Unpacked", "Packed", "Done for delivery"], true)
      .setAllowInvalid(false)
      .build();
    packingCell.setDataValidation(packingRule);
    applyPackingColor(packingCell, data.packingStatus || "Unpacked");

    return ContentService.createTextOutput(JSON.stringify({ result: "success", row: orderRowIdx }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ result: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function applyStatusColor(cell, status) {
  var s = (status || "").toUpperCase();
  if (s === "CONFIRMED") {
    cell.setBackground("#DCFCE7").setFontColor("#166534").setFontWeight("bold");
  } else if (s === "PENDING") {
    cell.setBackground("#FEF3C7").setFontColor("#92400E").setFontWeight("bold");
  } else if (s === "CANCELLED") {
    cell.setBackground("#FEE2E2").setFontColor("#991B1B").setFontWeight("bold");
  } else if (s === "DELIVERED") {
    cell.setBackground("#E0F2FE").setFontColor("#0369A1").setFontWeight("bold");
  }
}

function applyPackingColor(cell, packing) {
  if (packing === "Packed") {
    cell.setBackground("#FDF2F8").setFontColor("#9D174D").setFontWeight("bold");
  } else if (packing === "Done for delivery") {
    cell.setBackground("#15803D").setFontColor("#FFFFFF").setFontWeight("bold");
  } else {
    cell.setBackground("#F1F5F9").setFontColor("#475569");
  }
}
`;
