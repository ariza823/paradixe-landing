import {
  DEFAULT_FILTERS,
  filterProducts,
  groupByCategory,
  hasActiveFilters,
} from "@features/catalog/utils/filterProducts.ts";
import { parseFilters } from "@features/catalog/hooks/useCatalogFilters.ts";
import { makeProduct } from "../../../fixtures/product.ts";

const products = [
  makeProduct({ id: "a", category: "camisetas", name: "Tee Alambre", price: 95000, position: 2 }),
  makeProduct({ id: "b", category: "hoodies", name: "Hoodie Cielo", price: 180000, position: 1 }),
  makeProduct({ id: "c", category: "camisetas", name: "Tee Paraíso", price: 120000, position: 1, status: "soon", createdAt: "2026-10-10T00:00:00.000Z" }),
];

const ids = (list: { id: string }[]) => list.map((p) => p.id);

describe("filterProducts", () => {
  it("ordena por posición en destacados", () => {
    expect(ids(filterProducts(products, DEFAULT_FILTERS))).toEqual(["b", "c", "a"]);
  });

  it("filtra por categoría", () => {
    expect(ids(filterProducts(products, { ...DEFAULT_FILTERS, category: "camisetas" }))).toEqual(["c", "a"]);
  });

  it("filtra solo disponibles, busca sin tildes y ordena por precio", () => {
    expect(ids(filterProducts(products, { ...DEFAULT_FILTERS, onlyAvailable: true }))).toEqual(["b", "a"]);
    expect(ids(filterProducts(products, { ...DEFAULT_FILTERS, query: "paraiso" }))).toEqual(["c"]);
    expect(ids(filterProducts(products, { ...DEFAULT_FILTERS, sort: "price_asc" }))).toEqual(["a", "c", "b"]);
    expect(ids(filterProducts(products, { ...DEFAULT_FILTERS, sort: "newest" }))[0]).toBe("c");
  });

  it("agrupa por categoría respetando el orden y omite grupos vacíos", () => {
    const groups = groupByCategory(products, ["hoodies", "camisetas", "gorras"]);
    expect(groups.map((g) => g.category)).toEqual(["hoodies", "camisetas"]);
  });
});

describe("parseFilters", () => {
  it("lee los filtros de la URL e ignora un orden inválido", () => {
    const filters = parseFilters(new URLSearchParams("cat=hoodies&disp=1&orden=hack"));
    expect(filters).toEqual({ ...DEFAULT_FILTERS, category: "hoodies", onlyAvailable: true });
    expect(hasActiveFilters(filters)).toBe(true);
    expect(hasActiveFilters(parseFilters(new URLSearchParams()))).toBe(false);
  });
});
