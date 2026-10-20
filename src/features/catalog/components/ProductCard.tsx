import Text from "@atoms/text/Text.tsx";
import Title from "@atoms/title/Title.tsx";
import Button from "@atoms/button/Button.tsx";
import { WhatsAppIcon } from "@atoms/icons/Icons.tsx";
import { LINES, categoryWhatsApp } from "@config/catalog.config.ts";
import { formatCOP } from "@core/utils/format.ts";
import { buildWhatsAppUrl, formatPhone, productMessage } from "@core/utils/whatsapp.ts";
import type { Product } from "../dto/product.types.ts";
import { ProductGallery } from "./ProductGallery.tsx";

interface ProductCardProps {
  readonly product: Product;
  readonly isReleased: boolean;
}

export function ProductCard({ product, isReleased }: ProductCardProps) {
  const isSoldOut = product.status === "sold_out";
  const isLocked = product.status === "soon" && !isReleased;
  const numbers = categoryWhatsApp(product.line, product.category);
  const hasSeveral = numbers.length > 1;

  return (
    <article className="flex h-full flex-col border border-line bg-surface">
      <ProductGallery
        images={product.images}
        name={product.name}
        edition={product.edition}
        isSoldOut={isSoldOut}
      />

      <div className="flex flex-1 flex-col gap-4 p-5">
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

        {product.price > 0 ? (
          <Text size="price">{formatCOP(product.price)}</Text>
        ) : (
          <Text size="label" variant="muted">
            Precio por confirmar
          </Text>
        )}

        {!isSoldOut && isLocked && (
          <Button variant="whatsapp" disabled addStyle="mt-auto w-full px-4 tracking-[1px]">
            {LINES[product.line].lockedLabel}
          </Button>
        )}

        {!isSoldOut && !isLocked && (
          <div className="mt-auto flex flex-col gap-2">
            {numbers.map((number, index) => (
              <Button
                key={number}
                variant={index === 0 ? "whatsapp" : "outline_green"}
                href={buildWhatsAppUrl(number, productMessage(product))}
                external
                ariaLabel={hasSeveral ? `Pedir por WhatsApp al ${formatPhone(number)}` : undefined}
                addStyle="w-full px-4 tracking-[1px]"
              >
                <WhatsAppIcon size={18} />
                {hasSeveral ? formatPhone(number) : "Pedir por WhatsApp"}
              </Button>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
