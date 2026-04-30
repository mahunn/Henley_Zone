export type BusinessType = "clothing" | "service" | "retail";

export interface BusinessConfig {
  slug: string;
  name: string;
  type: BusinessType;
  tagline: string;
  whatsappNumber: string;
  codEnabled: boolean;
  currency: string;
}

