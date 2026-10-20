import type { Product, ProductLine } from "../dto/product.types.ts";

export type SortOption = "featured" | "price_asc" | "price_desc" | "newest";

export interface CatalogFilters {
  category: string | null;
  onlyAvailable: boolean;
  sort: SortOption;
  query: string;
}

export const DEFAULT_FILTERS: CatalogFilters = {
  category: null,
  onlyAvailable: false,
  sort: "featured",
  query: "",
};

export const SORT_LABELS: Record<SortOption, string> = {
  featured: "Destacados",
  price_asc: "Menor precio",
  price_desc: "Mayor precio",
  newest: "Más nuevos",
};

const sorters: Record<SortOption, (a: Product, b: Product) => number> = {
  featured: (a, b) => a.position - b.position || a.createdAt.localeCompare(b.createdAt),
  price_asc: (a, b) => a.price - b.price,
  price_desc: (a, b) => b.price - a.price,
  newest: (a, b) => b.createdAt.localeCompare(a.createdAt),
};

function normalize(text: string): string {
  return text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim();
}

export function productsOfLine(products: Product[], line: ProductLine): Product[] {
  return products.filter((p) => p.line === line);
}

export function filterProducts(products: Product[], filters: CatalogFilters): Product[] {
  const query = normalize(filters.query);
  return products
    .filter((p) => !filters.category || p.category === filters.category)
    .filter((p) => !filters.onlyAvailable || p.status === "available")
    .filter((p) => !query || normalize(`${p.name} ${p.variant ?? ""}`).includes(query))
    .sort(sorters[filters.sort]);
}

export function groupByCategory(products: Product[], categoryOrder: string[]) {
  return categoryOrder
    .map((category) => ({ category, products: products.filter((p) => p.category === category) }))
    .filter((group) => group.products.length > 0);
}

export function hasActiveFilters(filters: CatalogFilters): boolean {
  return (
    filters.category !== null ||
    filters.onlyAvailable ||
    filters.sort !== "featured" ||
    filters.query !== ""
  );
}
