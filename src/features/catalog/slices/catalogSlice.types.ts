import type { Product, ProductImageItem, ProductInput } from "../dto/product.types.ts";

export type LoadStatus = "idle" | "loading" | "ready" | "error";

export interface CatalogState {
  items: Product[];
  status: LoadStatus;
  error: string | null;
  saving: boolean;
  deletingId: string | null;
}

export interface SaveProductArgs {
  id: string | null;
  input: Omit<ProductInput, "images">;
  images: ProductImageItem[];
  previousImages: string[];
}
