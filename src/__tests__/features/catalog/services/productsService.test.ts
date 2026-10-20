import { createDemoRepository, DEMO_STORAGE_KEY } from "@features/catalog/services/demoProducts.ts";
import { saveProductWithImages } from "@features/catalog/services/productsService.ts";
import type { ProductsRepository } from "@features/catalog/services/productsService.types.ts";
import { fromRow, toRow } from "@features/catalog/services/supabaseProducts.ts";
import { makeProduct } from "../../../fixtures/product.ts";

describe("demo repository", () => {
  it("arranca con el seed: camisetas, hoodies, clásicos, jeans y joyería", async () => {
    const products = await createDemoRepository(localStorage).list();
    const count = (category: string) => products.filter((p) => p.category === category).length;
    expect(count("camisetas")).toBe(8);
    expect(count("hoodies")).toBe(5);
    expect(count("clasicos")).toBe(4);
    expect(count("jeans")).toBe(4);
    expect(products.some((p) => p.line === "joyeria")).toBe(true);
  });

  it("crea, actualiza y elimina persistiendo en localStorage", async () => {
    const repo = createDemoRepository(localStorage);
    const { id: _id, createdAt: _createdAt, ...input } = makeProduct();
    const created = await repo.create(input);
    expect(localStorage.getItem(DEMO_STORAGE_KEY)).toContain(created.id);

    const updated = await repo.update(created.id, { ...input, name: "Hoodie Nube" });
    expect(updated.name).toBe("Hoodie Nube");

    await repo.remove(created.id);
    expect((await repo.list()).some((p) => p.id === created.id)).toBe(false);
  });
});

describe("saveProductWithImages", () => {
  it("sube solo las fotos nuevas, conserva el orden y limpia las que se quitaron", async () => {
    const repo: ProductsRepository = {
      list: vi.fn(),
      create: vi.fn(async (input) => ({ ...input, id: "new", createdAt: "" })),
      update: vi.fn(),
      remove: vi.fn(),
      uploadImage: vi.fn(async () => "https://cdn/new.webp"),
      removeImages: vi.fn(async () => undefined),
    };
    const { id: _id, createdAt: _c, images: _i, ...input } = makeProduct();

    const saved = await saveProductWithImages(repo, {
      id: null,
      input,
      images: [
        { kind: "local", blob: new Blob(["x"], { type: "image/webp" }), preview: "blob:1" },
        { kind: "remote", url: "https://cdn/keep.webp" },
      ],
      previousImages: ["https://cdn/keep.webp", "https://cdn/old.webp"],
    });

    expect(saved.images).toEqual(["https://cdn/new.webp", "https://cdn/keep.webp"]);
    expect(repo.uploadImage).toHaveBeenCalledTimes(1);
    expect(repo.removeImages).toHaveBeenCalledWith(["https://cdn/old.webp"]);
  });
});

describe("supabase mappers", () => {
  it("convierte entre camelCase y snake_case sin perder datos", () => {
    const product = makeProduct();
    const row = { ...toRow(product), id: product.id, created_at: product.createdAt };
    expect(fromRow(row)).toEqual(product);
  });
});
