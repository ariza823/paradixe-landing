import Button from "@atoms/button/Button.tsx";
import { WhatsAppIcon } from "@atoms/icons/Icons.tsx";
import { LINES } from "@config/catalog.config.ts";
import { buildWhatsAppUrl, productMessage } from "@core/utils/whatsapp.ts";
import type { Product } from "../dto/product.types.ts";

interface ProductActionProps {
  readonly product: Product;
  readonly whatsappNumber: string;
  readonly isLocked: boolean;
}

const buttonClasses = "w-full px-4 tracking-[1px]";

export function ProductAction({ product, whatsappNumber, isLocked }: ProductActionProps) {
  if (isLocked) {
    return (
      <Button variant="whatsapp" disabled addStyle={buttonClasses}>
        {LINES[product.line].lockedLabel}
      </Button>
    );
  }

  return (
    <Button
      variant="whatsapp"
      href={buildWhatsAppUrl(whatsappNumber, productMessage(product))}
      external
      addStyle={buttonClasses}
    >
      <WhatsAppIcon size={18} />
      Pedir por WhatsApp
    </Button>
  );
}
