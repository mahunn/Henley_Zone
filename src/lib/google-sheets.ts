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
 * Formats a date into a clean DD-MM-YYYY, hh:mm AM/PM string in Asia/Dhaka time zone.
 * E.g. "10-08-2026, 08:30 PM"
 */
export function formatBangladeshiDate(isoString: string | undefined | null): string {
  const d = isoString ? new Date(isoString) : new Date();
  const date = Number.isNaN(d.getTime()) ? new Date() : d;

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  const strHours = String(hours).padStart(2, "0");

  return `${day}-${month}-${year}, ${strHours}:${minutes} ${ampm}`;
}

/**
 * Formats order items into clean detailed descriptions for Google Sheet rows.
 */
export function formatOrderItemsForSheet(order: Order): string {
  if (!order.items || order.items.length === 0) return "N/A";

  return order.items
    .map((item) => {
      const label = formatOrderItemLabel(item);
      const qty = `${item.quantity || 1}টি`;
      return `${label} - ${qty}`;
    })
    .join(" | ");
}

/**
 * Gets the configured Google Apps Script Webhook URL.
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
 * Clean, non-blocking, and formatted with Date first and descending order.
 */
export async function syncOrderToGoogleSheet(order: Order): Promise<{ success: boolean; error?: string }> {
  const webhookUrl = getGoogleSheetWebhookUrl();
  if (!webhookUrl) {
    return { success: false, error: "GOOGLE_SHEET_WEBHOOK_URL not configured." };
  }

  const validDate = order.createdAt ? new Date(order.createdAt) : new Date();
  const d = Number.isNaN(validDate.getTime()) ? new Date() : validDate;

  const monthName = d.toLocaleDateString("en-US", {
    timeZone: "Asia/Dhaka",
    month: "long",
    year: "numeric"
  });

  const dayHeading = d.toLocaleDateString("en-US", {
    timeZone: "Asia/Dhaka",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  const payload: GoogleSheetOrderPayload = {
    orderId: order.id,
    date: formatBangladeshiDate(order.createdAt),
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
 * Sync status updates to Google Sheet row
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
 * Full Professional Google Apps Script (Paste into Extensions > Apps Script)
 */
export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * HENLEY ZONE - PROFESSIONAL ORDER MANAGEMENT SCRIPT
 * 
 * Column Order:
 * A: Date & Time
 * B: Order ID
 * C: Customer Name
 * D: Phone Number
 * E: Delivery Address
 * F: Detailed Items (Color/Size/Qty)
 * G: Total (৳)
 * H: Order Status
 * I: Packing Status
 * J: Notes
 */

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Orders");
    
    if (!sheet) {
      sheet = ss.getSheets()[0];
      sheet.setName("Orders");
    }

    var data = JSON.parse(e.postData.contents);

    // 1. Setup Header Row if sheet is empty
    if (sheet.getLastRow() === 0) {
      setupSheetHeaders(sheet);
    }

    // 2. Handle Status Updates from Admin Dashboard
    if (data.action === "UPDATE_STATUS") {
      var rows = sheet.getDataRange().getValues();
      for (var i = 1; i < rows.length; i++) {
        if (rows[i][1] === data.orderId) { // Order ID is now Column B (index 1)
          var statusCell = sheet.getRange(i + 1, 8);
          statusCell.setValue(data.status);
          applyStatusBadge(statusCell, data.status);
          return ContentService.createTextOutput(JSON.stringify({ result: "status updated" }))
            .setMimeType(ContentService.MimeType.JSON);
        }
      }
    }

    var formattedDate = data.date || formatDateBD(new Date());

    // 3. Formatted Row (Date First, then Order ID, Name, Phone)
    var newRow = [
      formattedDate,
      data.orderId || "",
      data.customerName || "",
      "'" + (data.phone || ""),
      data.address || "",
      data.itemsText || "",
      data.total ? "৳" + Number(data.total).toLocaleString("en-US") : "৳0",
      data.status || "PENDING",
      data.packingStatus || "Unpacked",
      data.note || ""
    ];

    // 4. Insert at Row 2 (Descending: Newest at the top!)
    sheet.insertRowBefore(2);
    var rowRange = sheet.getRange(2, 1, 1, newRow.length);
    rowRange.setValues([newRow]);
    
    rowRange.setFontFamily("Segoe UI")
      .setFontSize(10)
      .setVerticalAlignment("middle")
      .setBackground("#FFFFFF");

    sheet.getRange(2, 1).setHorizontalAlignment("center"); // Date & Time
    sheet.getRange(2, 2).setHorizontalAlignment("center").setFontWeight("bold"); // Order ID
    sheet.getRange(2, 3).setHorizontalAlignment("left").setFontWeight("600"); // Customer Name
    sheet.getRange(2, 4).setHorizontalAlignment("center").setFontWeight("600"); // Phone Number
    sheet.getRange(2, 5).setWrap(true); // Address
    sheet.getRange(2, 6).setWrap(true); // Items
    sheet.getRange(2, 7).setHorizontalAlignment("right").setFontWeight("bold"); // Total

    // Order Status Dropdown & Badge (Column 8)
    var statusCell = sheet.getRange(2, 8);
    var statusRule = SpreadsheetApp.newDataValidation()
      .requireValueInList(["PENDING", "CONFIRMED", "DELIVERED", "CANCELLED"], true)
      .setAllowInvalid(false)
      .build();
    statusCell.setDataValidation(statusRule);
    applyStatusBadge(statusCell, data.status || "PENDING");

    // Packing Status Dropdown & Badge (Column 9)
    var packingCell = sheet.getRange(2, 9);
    var packingRule = SpreadsheetApp.newDataValidation()
      .requireValueInList(["Unpacked", "Packed", "Done for delivery"], true)
      .setAllowInvalid(false)
      .build();
    packingCell.setDataValidation(packingRule);
    applyPackingBadge(packingCell, data.packingStatus || "Unpacked");

    return ContentService.createTextOutput(JSON.stringify({ result: "success", row: 2 }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ result: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function setupSheetHeaders(sheet) {
  var headers = [
    "Date & Time",
    "Order ID",
    "Customer Name",
    "Phone Number",
    "Delivery Address",
    "Detailed Items (Color/Size/Qty)",
    "Total",
    "Order Status",
    "Packing Status",
    "Notes"
  ];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange
    .setBackground("#0F172A")
    .setFontColor("#FFFFFF")
    .setFontWeight("bold")
    .setFontSize(11)
    .setFontFamily("Segoe UI")
    .setVerticalAlignment("middle")
    .setHorizontalAlignment("center");
  
  sheet.setRowHeight(1, 38);
  sheet.setFrozenRows(1);
  
  // Extra-wide column widths so everything is completely visible with 0 clipping
  sheet.setColumnWidth(1, 195); // Date & Time (e.g. 10-08-2026, 06:55 PM)
  sheet.setColumnWidth(2, 175); // Order ID
  sheet.setColumnWidth(3, 190); // Customer Name
  sheet.setColumnWidth(4, 150); // Phone Number
  sheet.setColumnWidth(5, 260); // Delivery Address
  sheet.setColumnWidth(6, 330); // Detailed Items
  sheet.setColumnWidth(7, 100); // Total
  sheet.setColumnWidth(8, 140); // Order Status
  sheet.setColumnWidth(9, 150); // Packing Status
  sheet.setColumnWidth(10, 180); // Notes
}

function applyStatusBadge(cell, status) {
  var s = (status || "").toUpperCase();
  cell.setHorizontalAlignment("center");
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

function applyPackingBadge(cell, packing) {
  cell.setHorizontalAlignment("center");
  if (packing === "Packed") {
    cell.setBackground("#FDF2F8").setFontColor("#9D174D").setFontWeight("bold");
  } else if (packing === "Done for delivery") {
    cell.setBackground("#15803D").setFontColor("#FFFFFF").setFontWeight("bold");
  } else {
    cell.setBackground("#F1F5F9").setFontColor("#475569").setFontWeight("normal");
  }
}

function formatDateBD(d) {
  var dt = new Date(d);
  var day = ("0" + dt.getDate()).slice(-2);
  var month = ("0" + (dt.getMonth() + 1)).slice(-2);
  var year = dt.getFullYear();
  
  var hours = dt.getHours();
  var minutes = ("0" + dt.getMinutes()).slice(-2);
  var ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  var strHours = ("0" + hours).slice(-2);
  
  return day + "-" + month + "-" + year + ", " + strHours + ":" + minutes + " " + ampm;
}
`;
