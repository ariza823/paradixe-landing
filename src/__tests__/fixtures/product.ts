import type { Product } from "@features/catalog/dto/product.types.ts";

export function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: "p-1",
    line: "streetwear",
    category: "hoodies",
    name: "Hoodie Cielo",
    variant: "Negro",
    description: null,
    price: 180000,
    images: [],
    edition: 30,
    status: "available",
    position: 1,
    createdAt: "2026-10-01T00:00:00.000Z",
    ...overrides,
  };
}
