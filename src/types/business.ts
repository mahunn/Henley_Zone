export type BusinessType = "clothing" | "service" | "retail";

export interface BusinessConfig {
  slug: string;
  name: string;
  type: BusinessType;
  tagline: string;
  /** Human-readable phone (e.g. 01…) for footer, contact, etc. */
  whatsappNumber: string;
  /** Digits only, country code without + (e.g. 880…) for wa.me and tel: */
  whatsappInternationalDigits: string;
  codEnabled: boolean;
  currency: string;
}

