import Text from "@atoms/text/Text.tsx";
import Title from "@atoms/title/Title.tsx";
import { IconButton } from "@atoms/iconButton/IconButton.tsx";
import { LogoMark } from "@atoms/logo/Logo.tsx";
import { PencilIcon, PlusIcon, TrashIcon } from "@atoms/icons/Icons.tsx";
import { STATUS_LABELS } from "@config/catalog.config.ts";
import { formatCOP, padNumber } from "@core/utils/format.ts";
import type { Product, ProductStatus } from "@features/catalog/dto/product.types.ts";

const statusClasses: Record<ProductStatus, string> = {
  available: "bg-accent-green text-on-accent",
  soon: "bg-accent-sky text-on-accent",
  sold_out: "bg-ink text-surface",
};

interface AdminProductTileProps {
  readonly product: Product;
  readonly onEdit: (product: Product) => void;
  readonly onDelete: (product: Product) => void;
}

export function AdminProductTile({ product, onEdit, onDelete }: AdminProductTileProps) {
  const cover = product.images[0];

  return (
    <article className="flex h-full flex-col border border-line bg-surface">
      <button
        type="button"
        onClick={() => onEdit(product)}
        aria-label={`Editar ${product.name}`}
        className="group relative aspect-[4/5] overflow-hidden bg-surface-soft"
      >
        {cover ? (
          <img src={cover} alt="" loading="lazy" className="h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-300 group-hover:scale-[1.03]" />
        ) : (
          <span className="flex h-full flex-col items-center justify-center gap-1 opacity-50">
            <LogoMark />
            <Text as="span" size="caption" variant="muted">
              Sin fotos
            </Text>
          </span>
        )}
        <Text
          as="span"
          size="caption"
          variant="none"
          addStyle={`absolute top-2 left-2 rounded-full px-2.5 py-0.5 font-bold ${statusClasses[product.status]}`}
        >
          {STATUS_LABELS[product.status]}
        </Text>
        {product.images.length > 1 && (
          <Text as="span" size="caption" addStyle="absolute right-2 bottom-2 rounded-full bg-surface/85 px-2 py-0.5 font-bold">
            {`${product.images.length} fotos`}
          </Text>
        )}
      </button>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <Title as="h3" size="product" addStyle="truncate text-[16px]!" title={product.name}>
          {product.name}
        </Title>
        <Text size="caption" variant="muted">
          {`N°/${padNumber(product.edition, 3)}`}
        </Text>
        <Text size="body_bold" addStyle="mt-1">
          {product.price > 0 ? formatCOP(product.price) : "Sin precio"}
        </Text>
      </div>

      <div className="flex gap-2 border-t border-dashed border-line p-3">
        <button
          type="button"
          onClick={() => onEdit(product)}
          className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full border border-line text-[12px] font-bold uppercase tracking-[1px] whitespace-nowrap text-ink hover:border-accent-lilac hover:text-accent-lilac"
        >
          <PencilIcon size={16} />
          <span className="max-[359px]:sr-only">Editar</span>
        </button>
        <IconButton label={`Eliminar ${product.name}`} tone="danger" onClick={() => onDelete(product)}>
          <TrashIcon size={16} />
        </IconButton>
      </div>
    </article>
  );
}

interface AddProductTileProps {
  readonly label: string;
  readonly onClick: () => void;
}

export function AddProductTile({ label, onClick }: AddProductTileProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex h-full min-h-64 w-full flex-col items-center justify-center gap-3 border-2 border-dashed border-line text-ink-muted hover:border-accent-sky hover:text-ink"
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-current motion-safe:transition-transform group-hover:rotate-90">
        <PlusIcon size={26} />
      </span>
      <Text as="span" size="label_bold" variant="none">
        {label}
      </Text>
    </button>
  );
}
