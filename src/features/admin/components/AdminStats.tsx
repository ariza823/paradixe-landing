import Text from "@atoms/text/Text.tsx";
import type { Product } from "@features/catalog/dto/product.types.ts";

interface AdminStatsProps {
  readonly products: Product[];
}

export function AdminStats({ products }: AdminStatsProps) {
  const withoutPhotos = products.filter((p) => p.images.length === 0).length;
  const stats = [
    { label: "Productos", value: products.length },
    { label: "Disponibles", value: products.filter((p) => p.status === "available").length },
    { label: "Próximos", value: products.filter((p) => p.status === "soon").length },
    { label: "Sin fotos", value: withoutPhotos, highlight: withoutPhotos > 0 },
  ];

  return (
    <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="flex flex-col gap-2 border border-dashed border-line bg-surface-soft/60 p-4">
          <dt>
            <Text as="span" size="label" variant="muted">
              {stat.label}
            </Text>
          </dt>
          <dd>
            <Text as="span" size="stat" variant={stat.highlight ? "gold" : "default"}>
              {stat.value}
            </Text>
          </dd>
        </div>
      ))}
    </dl>
  );
}
