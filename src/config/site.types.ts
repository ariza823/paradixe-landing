export interface FaqItem {
  q: string;
  a: string;
}

export interface SiteConfig {
  brand: { name: string; handle: string; city: string };
  hero: { eyebrowLeft: string; eyebrowRight: string };
  jewelry: { eyebrowLeft: string; eyebrowRight: string; intro: string };
  whatsapp: { number: string; contactMessage: string; waitlistMessage: string };
  drop: { name: string; tagline: string; date: string };
  social: { instagram: string; tiktok: string };
  howToBuy: string[];
  shipping: string;
  faq: FaqItem[];
}
