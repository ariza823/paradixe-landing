import type { Product, ProductInput, ProductLine } from "../dto/product.types.ts";

export interface ProductRow {
  id: string;
  line: ProductLine;
  category: string;
  name: string;
  variant: string | null;
  description: string | null;
  price: number;
  images: string[];
  edition: number;
  status: Product["status"];
  position: number;
  created_at: string;
}

export interface ProductsRepository {
  list(): Promise<Product[]>;
  create(input: ProductInput): Promise<Product>;
  update(id: string, input: ProductInput): Promise<Product>;
  remove(id: string): Promise<void>;
  uploadImage(blob: Blob, line: ProductLine): Promise<string>;
  removeImages(urls: string[]): Promise<void>;
}
