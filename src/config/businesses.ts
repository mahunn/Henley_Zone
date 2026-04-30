import { BusinessConfig } from "@/types/business";

export const businesses: BusinessConfig[] = [
  {
    slug: "clothing-store",
    name: "Henley Clothing",
    type: "clothing",
    tagline: "Quality styles with cash on delivery checkout.",
    whatsappNumber: "+8801XXXXXXXXX",
    codEnabled: true,
    currency: "BDT"
  },
  {
    slug: "business-two",
    name: "Business Two",
    type: "retail",
    tagline: "Second business website powered by the same core.",
    whatsappNumber: "+8801XXXXXXXXX",
    codEnabled: true,
    currency: "BDT"
  },
  {
    slug: "business-three",
    name: "Business Three",
    type: "service",
    tagline: "Third business website with reusable platform.",
    whatsappNumber: "+8801XXXXXXXXX",
    codEnabled: true,
    currency: "BDT"
  }
];

export const defaultBusiness = businesses[0];

