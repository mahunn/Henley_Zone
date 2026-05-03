import { BusinessConfig } from "@/types/business";

/** wa.me / tel — digits only, no leading + */
export function businessWhatsappChatUrl(b: BusinessConfig) {
  return `https://wa.me/${b.whatsappInternationalDigits}`;
}

export function businessTelHref(b: BusinessConfig) {
  return `tel:${b.whatsappInternationalDigits}`;
}

export const businesses: BusinessConfig[] = [
  {
    slug: "clothing-store",
    name: "Henley Clothing",
    type: "clothing",
    tagline: "Quality styles with cash on delivery checkout.",
    whatsappNumber: "01581708578",
    whatsappInternationalDigits: "8801581708578",
    codEnabled: true,
    currency: "BDT"
  },
  {
    slug: "business-two",
    name: "Business Two",
    type: "retail",
    tagline: "Second business website powered by the same core.",
    whatsappNumber: "01581708578",
    whatsappInternationalDigits: "8801581708578",
    codEnabled: true,
    currency: "BDT"
  },
  {
    slug: "business-three",
    name: "Business Three",
    type: "service",
    tagline: "Third business website with reusable platform.",
    whatsappNumber: "01581708578",
    whatsappInternationalDigits: "8801581708578",
    codEnabled: true,
    currency: "BDT"
  }
];

export const defaultBusiness = businesses[0];

