import { productFormSchema } from "@features/admin/schemas/product.zod.ts";
import { emptyFormValues, formValuesToInput, nextPosition } from "@features/admin/utils/productForm.ts";
import { makeProduct } from "../../../fixtures/product.ts";

describe("productFormSchema", () => {
  const valid = { ...emptyFormValues("streetwear", "hoodies", []), name: "Hoodie Cielo" };

  it("acepta un producto válido", () => {
    expect(productFormSchema.safeParse(valid).success).toBe(true);
  });

  it("rechaza nombre corto y precio inválido", () => {
    const result = productFormSchema.safeParse({ ...valid, name: "H", price: Number.NaN });
    expect(result.success).toBe(false);
    const fields = result.error?.issues.map((issue) => issue.path[0]);
    expect(fields).toEqual(expect.arrayContaining(["name", "price"]));
  });
});

describe("productForm utils", () => {
  it("calcula la siguiente posición dentro de la categoría", () => {
    const products = [makeProduct({ position: 4 }), makeProduct({ id: "x", category: "camisetas", position: 9 })];
    expect(nextPosition(products, "streetwear", "hoodies")).toBe(5);
    expect(nextPosition([], "streetwear", "hoodies")).toBe(1);
  });

  it("normaliza vacíos a null", () => {
    const input = formValuesToInput("streetwear", {
      ...emptyFormValues("streetwear", "hoodies", []),
      name: "  Hoodie  ",
    });
    expect(input).toMatchObject({ name: "Hoodie", variant: null, description: null });
  });
});
