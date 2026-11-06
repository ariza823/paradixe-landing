import Text from "@atoms/text/Text.tsx";
import { formatCOP } from "@core/utils/format.ts";

interface ProductPriceProps {
  readonly price: number;
}

export function ProductPrice({ price }: ProductPriceProps) {
  if (price > 0) return <Text size="price">{formatCOP(price)}</Text>;
  return (
    <Text size="label" variant="muted">
      Precio por confirmar
    </Text>
  );
}
