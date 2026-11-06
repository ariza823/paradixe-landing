import { useState } from "react";
import Text from "@atoms/text/Text.tsx";
import Title from "@atoms/title/Title.tsx";
import { categoryWhatsApp } from "@config/catalog.config.ts";
import type { Product } from "../dto/product.types.ts";
import { ProductAction } from "./ProductAction.tsx";
import { ProductDetailDialog } from "./ProductDetailDialog.tsx";
import { ProductGallery } from "./ProductGallery.tsx";
import { ProductPrice } from "./ProductPrice.tsx";

interface ProductCardProps {
  readonly product: Product;
  readonly isReleased: boolean;
}

export function ProductCard({ product, isReleased }: ProductCardProps) {
  const [detailIndex, setDetailIndex] = useState<number | null>(null);
  const [whatsappNumber] = useState(() => categoryWhatsApp(product.line, product.category));
  const isSoldOut = product.status === "sold_out";
  const isLocked = product.status === "soon" && !isReleased;
  const action = isSoldOut ? null : (
    <ProductAction product={product} whatsappNumber={whatsappNumber} isLocked={isLocked} />
  );

  return (
    <article className="ticket-card flex h-full flex-col hover:chrome-stack hover:[--ticket-line:var(--accent-lilac)] motion-safe:transition-[translate,box-shadow,border-color] motion-safe:hover:-translate-x-1 motion-safe:hover:-translate-y-1">
      <div className="overflow-hidden rounded-t-[22px]">
        <ProductGallery
          images={product.images}
          name={product.name}
          size={product.size}
          isSoldOut={isSoldOut}
          onOpen={setDetailIndex}
        />
      </div>

      <div className="ticket-stub flex flex-1 flex-col gap-4 p-5">
        <div className="flex flex-col gap-1">
          <Title as="h3" size="product">
            {product.name}
          </Title>
          {product.variant && (
            <Text size="body_sm" variant="muted">
              {product.variant}
            </Text>
          )}
        </div>

        <ProductPrice price={product.price} />

        {action && <div className="mt-auto">{action}</div>}
      </div>

      <ProductDetailDialog
        product={product}
        open={detailIndex !== null}
        startIndex={detailIndex ?? 0}
        onClose={() => setDetailIndex(null)}
        action={action}
      />
    </article>
  );
}
