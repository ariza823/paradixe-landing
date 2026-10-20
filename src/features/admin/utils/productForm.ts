import { LINES } from "@config/catalog.config.ts";
import type { Product, ProductInput, ProductLine } from "@features/catalog/dto/product.types.ts";
import type { ProductFormValues } from "../schemas/product.zod.ts";

const DEFAULT_EDITION: Record<ProductLine, number> = {
  streetwear: 30,
  joyeria: 15,
};

export function nextPosition(products: Product[], line: ProductLine, category: string): number {
  const positions = products
    .filter((p) => p.line === line && p.category === category)
    .map((p) => p.position);
  return positions.length === 0 ? 1 : Math.max(...positions) + 1;
}

export function emptyFormValues(
  line: ProductLine,
  category: string | null,
  products: Product[],
): ProductFormValues {
  const resolvedCategory = category ?? LINES[line].categories[0]?.id ?? "";
  return {
    category: resolvedCategory,
    name: "",
    variant: "",
    description: "",
    price: 0,
    edition: DEFAULT_EDITION[line],
    position: nextPosition(products, line, resolvedCategory),
    status: "soon",
  };
}

export function productToFormValues(product: Product): ProductFormValues {
  return {
    category: product.category,
    name: product.name,
    variant: product.variant ?? "",
    description: product.description ?? "",
    price: product.price,
    edition: product.edition,
    position: product.position,
    status: product.status,
  };
}

export function formValuesToInput(
  line: ProductLine,
  values: ProductFormValues,
): Omit<ProductInput, "images"> {
  return {
    line,
    category: values.category,
    name: values.name.trim(),
    variant: values.variant.trim() || null,
    description: values.description.trim() || null,
    price: values.price,
    edition: values.edition,
    position: values.position,
    status: values.status,
  };
}
