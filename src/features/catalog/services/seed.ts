import { padNumber } from "@core/utils/format.ts";
import type { Product, ProductLine } from "../dto/product.types.ts";

interface SeedGroup {
  line: ProductLine;
  category: string;
  label: string;
  count: number;
  edition: number;
}

const SEED_GROUPS: SeedGroup[] = [
  { line: "streetwear", category: "camisetas", label: "Camiseta", count: 8, edition: 30 },
  { line: "streetwear", category: "hoodies", label: "Hoodie", count: 5, edition: 20 },
  { line: "streetwear", category: "clasicos", label: "Clásico", count: 4, edition: 30 },
  { line: "streetwear", category: "jeans", label: "Jean", count: 4, edition: 20 },
  { line: "joyeria", category: "anillos", label: "Anillo", count: 3, edition: 15 },
  { line: "joyeria", category: "collares", label: "Collar", count: 3, edition: 15 },
  { line: "joyeria", category: "aretes", label: "Aretes", count: 3, edition: 15 },
  { line: "joyeria", category: "pulseras", label: "Pulsera", count: 3, edition: 15 },
];

export function buildSeedProducts(): Product[] {
  const createdAt = new Date(0).toISOString();
  return SEED_GROUPS.flatMap((group) =>
    Array.from({ length: group.count }, (_, index) => ({
      id: `seed-${group.category}-${index + 1}`,
      line: group.line,
      category: group.category,
      name: `${group.label} N°${padNumber(index + 1)}`,
      variant: null,
      description: null,
      price: 0,
      images: [],
      edition: group.edition,
      status: "soon" as const,
      position: index + 1,
      createdAt,
    })),
  );
}
