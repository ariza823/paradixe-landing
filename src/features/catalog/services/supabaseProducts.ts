import {
  PRODUCT_IMAGES_BUCKET,
  getSupabaseClient,
  type SupabaseConfig,
} from "@core/api/supabaseClient.ts";
import type { Product, ProductInput } from "../dto/product.types.ts";
import type { ProductRow, ProductsRepository } from "./productsService.types.ts";

const COLUMNS =
  "id, line, category, name, variant, description, price, images, edition, status, position, created_at";

export function fromRow(row: ProductRow): Product {
  return {
    id: row.id,
    line: row.line,
    category: row.category,
    name: row.name,
    variant: row.variant,
    description: row.description,
    price: row.price,
    images: row.images,
    edition: row.edition,
    status: row.status,
    position: row.position,
    createdAt: row.created_at,
  };
}

export function toRow(input: ProductInput): Omit<ProductRow, "id" | "created_at"> {
  return {
    line: input.line,
    category: input.category,
    name: input.name,
    variant: input.variant,
    description: input.description,
    price: input.price,
    images: input.images,
    edition: input.edition,
    status: input.status,
    position: input.position,
  };
}

function storagePathFromUrl(url: string): string | null {
  const marker = `/object/public/${PRODUCT_IMAGES_BUCKET}/`;
  const index = url.indexOf(marker);
  return index === -1 ? null : decodeURIComponent(url.slice(index + marker.length));
}

export function createSupabaseRepository(config: SupabaseConfig): ProductsRepository {
  const table = async () => (await getSupabaseClient(config)).from("products");
  const bucket = async () => (await getSupabaseClient(config)).storage.from(PRODUCT_IMAGES_BUCKET);

  return {
    async list() {
      const query = new URLSearchParams({ select: COLUMNS.replaceAll(" ", ""), order: "position.asc,created_at.asc" });
      const response = await fetch(`${config.url}/rest/v1/products?${query}`, {
        headers: { apikey: config.key, Accept: "application/json" },
      }).catch(() => null);
      if (!response?.ok) throw new Error("No pudimos cargar el catálogo.");
      return ((await response.json()) as ProductRow[]).map(fromRow);
    },

    async create(input) {
      const { data, error } = await (await table()).insert(toRow(input)).select(COLUMNS).single();
      if (error) throw new Error("No se pudo crear el producto.");
      return fromRow(data as ProductRow);
    },

    async update(id, input) {
      const { data, error } = await (await table()).update(toRow(input)).eq("id", id).select(COLUMNS).single();
      if (error) throw new Error("No se pudo guardar el producto.");
      return fromRow(data as ProductRow);
    },

    async remove(id) {
      const { error } = await (await table()).delete().eq("id", id);
      if (error) throw new Error("No se pudo eliminar el producto.");
    },

    async uploadImage(blob, line) {
      const storage = await bucket();
      const path = `${line}/${crypto.randomUUID()}.webp`;
      const { error } = await storage.upload(path, blob, {
        contentType: blob.type || "image/webp",
        cacheControl: "31536000",
        upsert: false,
      });
      if (error) throw new Error("No se pudo subir una de las fotos.");
      return storage.getPublicUrl(path).data.publicUrl;
    },

    async removeImages(urls) {
      const paths = urls.map(storagePathFromUrl).filter((p): p is string => p !== null);
      if (paths.length > 0) await (await bucket()).remove(paths);
    },
  };
}
