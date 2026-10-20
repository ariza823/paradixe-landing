import type { ProductLine, ProductStatus } from "@features/catalog/dto/product.types.ts";
import { config } from "./site.config.ts";

export interface CategoryConfig {
  id: string;
  label: string;
  singular: string;
  whatsapp?: string[];
}

export interface LineConfig {
  id: ProductLine;
  label: string;
  path: string;
  sectionId: string;
  title: string;
  tagline: string;
  lockedLabel: string;
  categories: CategoryConfig[];
}

export const MAX_PRODUCT_IMAGES = 6;

export const LINES: Record<ProductLine, LineConfig> = {
  streetwear: {
    id: "streetwear",
    label: "Streetwear",
    path: "/",
    sectionId: "catalogo",
    title: "Colección",
    tagline: "Piezas numeradas. Cuando se acaban, no vuelven.",
    lockedLabel: "Próximamente",
    categories: [
      { id: "camisetas", label: "Camisetas", singular: "camiseta", whatsapp: ["573143370824", "573238492841"] },
      { id: "hoodies", label: "Hoodies", singular: "hoodie", whatsapp: ["573143370824", "573238492841"] },
      { id: "clasicos", label: "Clásicos", singular: "clásico" },
      { id: "jeans", label: "Jeans", singular: "jean", whatsapp: ["573015311468"] },
    ],
  },
  joyeria: {
    id: "joyeria",
    label: "Joyería",
    path: "/joyeria",
    sectionId: "catalogo",
    title: "Joyería",
    tagline: "Plata, acero y cromo. Tirajes cortos, sin reposición.",
    lockedLabel: "Próximamente",
    categories: [
      { id: "anillos", label: "Anillos", singular: "anillo" },
      { id: "collares", label: "Collares", singular: "collar" },
      { id: "aretes", label: "Aretes", singular: "aretes" },
      { id: "pulseras", label: "Pulseras", singular: "pulsera" },
    ],
  },
};

export const LINE_LIST: LineConfig[] = [LINES.streetwear, LINES.joyeria];

export const STATUS_LABELS: Record<ProductStatus, string> = {
  available: "Disponible",
  soon: "Próximamente",
  sold_out: "Agotado",
};

export function categoryLabel(line: ProductLine, categoryId: string): string {
  return LINES[line].categories.find((c) => c.id === categoryId)?.label ?? categoryId;
}

export function categoryWhatsApp(line: ProductLine, categoryId: string): string[] {
  return LINES[line].categories.find((c) => c.id === categoryId)?.whatsapp ?? [config.whatsapp.number];
}
