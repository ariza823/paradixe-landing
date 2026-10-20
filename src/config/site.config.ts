import type { SiteConfig } from "./site.types.ts";

export const config: SiteConfig = {
  brand: { name: "Paradixe Urban", handle: "@paradixe_urban", city: "Bogotá" },
  hero: { eyebrowLeft: "Dept. of Paradise ®", eyebrowRight: "SS/26 — BOG, CO" },
  jewelry: {
    eyebrowLeft: "Dept. of Paradise ®",
    eyebrowRight: "Joyería — BOG, CO",
    intro: "Piezas de metal hechas para durar más que la tendencia.",
  },
  whatsapp: {
    number: "573143370824",
    contactMessage: "Hola Paradixe, tengo una pregunta.",
    waitlistMessage: "Hola Paradixe, quiero que me avisen cuando salga algo nuevo.",
  },
  drop: {
    name: "Drop 01",
    tagline: "Piezas numeradas. Cuando se acaban, no vuelven.",
    date: "2026-11-15T19:00:00-05:00",
  },
  social: {
    instagram: "https://instagram.com/paradixe_urban",
    tiktok: "https://tiktok.com/@paradixe_urban",
  },
  howToBuy: [
    "Elige la pieza que te gusta.",
    "Escríbenos por WhatsApp; te confirmamos disponibilidad.",
    "Pagas (Nequi, Daviplata, Bre-B o link de pago) y te la enviamos.",
  ],
  shipping: "Envíos en Bogotá en [X] días y a todo Colombia en [X] días.",
  faq: [
    { q: "¿Cuánto tarda el envío?", a: "[Tiempos de envío en Bogotá y resto del país]" },
    { q: "¿Puedo hacer cambios?", a: "[Política de cambios: plazo y condiciones]" },
    { q: "¿Va a haber reposición?", a: "No. Cada pieza es numerada y cuando se acaba la edición, no vuelve." },
  ],
};
