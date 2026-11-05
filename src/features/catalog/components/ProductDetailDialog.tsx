import type { ReactNode } from "react";
import Text from "@atoms/text/Text.tsx";
import { Dialog } from "@molecules/dialog/Dialog.tsx";
import { STATUS_LABELS, categoryLabel } from "@config/catalog.config.ts";
import type { Product } from "../dto/product.types.ts";
import { ProductGallery } from "./ProductGallery.tsx";
import { ProductPrice } from "./ProductPrice.tsx";

interface ProductDetailDialogProps {
  readonly product: Product;
  readonly open: boolean;
  readonly startIndex: number;
  readonly onClose: () => void;
  readonly action: ReactNode;
}

export function ProductDetailDialog({ product, open, startIndex, onClose, action }: ProductDetailDialogProps) {
  const facts = [
    { label: "Categoría", value: categoryLabel(product.line, product.category) },
    { label: "Edición", value: `${product.edition} piezas` },
    { label: "Estado", value: STATUS_LABELS[product.status] },
  ];

  return (
    <Dialog open={open} title={product.name} onClose={onClose} footer={action}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          {product.variant && (
            <Text size="body_sm" variant="muted">
              {product.variant}
            </Text>
          )}
          <ProductPrice price={product.price} />
        </div>

        <ProductGallery
          images={product.images}
          name={product.name}
          edition={product.edition}
          isSoldOut={product.status === "sold_out"}
          startIndex={startIndex}
        />

        {product.description && <Text variant="muted">{product.description}</Text>}

        <dl className="grid grid-cols-2 gap-4 border-t border-dashed border-line pt-5 sm:grid-cols-3">
          {facts.map((fact) => (
            <div key={fact.label} className="flex flex-col gap-1">
              <dt>
                <Text as="span" size="label" variant="muted">
                  {fact.label}
                </Text>
              </dt>
              <dd>
                <Text as="span" size="body_bold">
                  {fact.value}
                </Text>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </Dialog>
  );
}
