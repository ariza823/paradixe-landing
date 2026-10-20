import { supabaseConfig } from "@core/api/supabaseClient.ts";
import type { ProductImageItem, ProductInput, ProductLine } from "../dto/product.types.ts";
import type { ProductsRepository } from "./productsService.types.ts";
import { createSupabaseRepository } from "./supabaseProducts.ts";
import { createDemoRepository } from "./demoProducts.ts";

let repository: ProductsRepository | null = null;

export function getProductsRepository(): ProductsRepository {
  repository ??= supabaseConfig ? createSupabaseRepository(supabaseConfig) : createDemoRepository();
  return repository;
}

export function setProductsRepository(next: ProductsRepository) {
  repository = next;
}

export async function resolveImages(
  repo: ProductsRepository,
  images: ProductImageItem[],
  line: ProductLine,
): Promise<string[]> {
  return Promise.all(
    images.map((image) => (image.kind === "remote" ? image.url : repo.uploadImage(image.blob, line))),
  );
}

export async function saveProductWithImages(
  repo: ProductsRepository,
  params: { id: string | null; input: Omit<ProductInput, "images">; images: ProductImageItem[]; previousImages: string[] },
) {
  const urls = await resolveImages(repo, params.images, params.input.line);
  const input: ProductInput = { ...params.input, images: urls };
  const saved = params.id ? await repo.update(params.id, input) : await repo.create(input);
  const orphaned = params.previousImages.filter((url) => !urls.includes(url));
  if (orphaned.length > 0) await repo.removeImages(orphaned).catch(() => undefined);
  return saved;
}
