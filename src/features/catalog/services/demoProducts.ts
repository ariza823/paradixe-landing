import type { Product } from "../dto/product.types.ts";
import type { ProductsRepository } from "./productsService.types.ts";
import { buildSeedProducts } from "./seed.ts";

export const DEMO_STORAGE_KEY = "paradixe:demo-products";

function read(storage: Storage): Product[] {
  try {
    const raw = storage.getItem(DEMO_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Product[]) : buildSeedProducts();
  } catch {
    return buildSeedProducts();
  }
}

function write(storage: Storage, products: Product[]) {
  try {
    storage.setItem(DEMO_STORAGE_KEY, JSON.stringify(products));
  } catch {
    throw new Error("Modo demo: el navegador se quedó sin espacio para más fotos.");
  }
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("No se pudo leer la foto."));
    reader.readAsDataURL(blob);
  });
}

export function createDemoRepository(storage: Storage = window.localStorage): ProductsRepository {
  return {
    async list() {
      return read(storage);
    },

    async create(input) {
      const product: Product = { ...input, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
      write(storage, [...read(storage), product]);
      return product;
    },

    async update(id, input) {
      const products = read(storage);
      const current = products.find((p) => p.id === id);
      if (!current) throw new Error("El producto ya no existe.");
      const updated: Product = { ...current, ...input };
      write(storage, products.map((p) => (p.id === id ? updated : p)));
      return updated;
    },

    async remove(id) {
      write(storage, read(storage).filter((p) => p.id !== id));
    },

    async uploadImage(blob) {
      return blobToDataUrl(blob);
    },

    async removeImages() {
      return undefined;
    },
  };
}
