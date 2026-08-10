/**
 * Bangladeshi & International Phone Number Normalizer
 * Converts Bengali digits, cleans spaces/hyphens, and formats standard BD numbers.
 */

const BENGALI_DIGITS: Record<string, string> = {
  "০": "0",
  "১": "1",
  "২": "2",
  "৩": "3",
  "৪": "4",
  "৫": "5",
  "৬": "6",
  "৭": "7",
  "৮": "8",
  "৯": "9"
};

/**
 * Converts any Bengali numerals (০-৯) into ASCII digits (0-9)
 */
export function convertBengaliToEnglishDigits(input: string): string {
  if (!input) return "";
  return input.replace(/[০-৯]/g, (digit) => BENGALI_DIGITS[digit] || digit);
}

/**
 * Normalizes phone numbers:
 * - Translates Bengali numerals to English
 * - Removes non-digit characters (spaces, dashes, parentheses)
 * - Standardizes +8801XXXXXXXXX / 8801XXXXXXXXX to 01XXXXXXXXX
 */
export function normalizePhoneNumber(rawPhone: string): string {
  if (!rawPhone) return "";
  
  // 1. Convert Bengali numbers
  let cleaned = convertBengaliToEnglishDigits(rawPhone.trim());
  
  // 2. Remove all spaces, dashes, dots, brackets
  cleaned = cleaned.replace(/[\s\-().]/g, "");

  // 3. Normalize Bangladesh country codes
  if (cleaned.startsWith("+8801")) {
    cleaned = "0" + cleaned.slice(4);
  } else if (cleaned.startsWith("8801")) {
    cleaned = "0" + cleaned.slice(3);
  } else if (cleaned.startsWith("+88")) {
    cleaned = cleaned.slice(3);
  } else if (cleaned.startsWith("88") && cleaned.length === 13) {
    cleaned = cleaned.slice(2);
  }

  return cleaned;
}

/**
 * Validates whether a phone number is a valid 11-digit BD mobile number
 * or valid international telephone number.
 */
export function isValidPhoneNumber(rawPhone: string): boolean {
  const normalized = normalizePhoneNumber(rawPhone);
  
  // Standard BD Mobile check: starts with 01[3-9] and has 11 digits
  if (/^01[3-9]\d{8}$/.test(normalized)) {
    return true;
  }

  // Fallback check for general 10-15 digit numbers
  return /^\+?\d{10,15}$/.test(normalized);
}
