export type ProductLine = "streetwear" | "joyeria";

export type ProductStatus = "available" | "soon" | "sold_out";

export interface Product {
  id: string;
  line: ProductLine;
  category: string;
  name: string;
  variant: string | null;
  description: string | null;
  price: number;
  images: string[];
  edition: number;
  status: ProductStatus;
  position: number;
  createdAt: string;
}

export type ProductInput = Omit<Product, "id" | "createdAt">;

export type ProductImageItem =
  | { kind: "remote"; url: string }
  | { kind: "local"; blob: Blob; preview: string };
