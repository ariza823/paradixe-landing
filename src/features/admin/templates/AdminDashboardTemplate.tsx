import { useMemo, useState } from "react";
import Text from "@atoms/text/Text.tsx";
import Title from "@atoms/title/Title.tsx";
import Button from "@atoms/button/Button.tsx";
import { Chip } from "@atoms/chip/Chip.tsx";
import { Skeleton } from "@atoms/skeleton/Skeleton.tsx";
import { PlusIcon, SearchIcon } from "@atoms/icons/Icons.tsx";
import { EmptyState } from "@molecules/emptyState/EmptyState.tsx";
import { LINE_LIST, LINES, STATUS_LABELS } from "@config/catalog.config.ts";
import { useCatalog } from "@features/catalog/hooks/useCatalog.ts";
import { DEFAULT_FILTERS, filterProducts, productsOfLine } from "@features/catalog/utils/filterProducts.ts";
import type { Product, ProductLine, ProductStatus } from "@features/catalog/dto/product.types.ts";
import { AdminStats } from "../components/AdminStats.tsx";
import { AddProductTile, AdminProductTile } from "../components/AdminProductTile.tsx";
import { ProductFormDialog } from "../components/ProductFormDialog.tsx";
import { DeleteProductDialog } from "../components/DeleteProductDialog.tsx";

interface EditorState {
  open: boolean;
  product: Product | null;
  category: string | null;
}

const CLOSED_EDITOR: EditorState = { open: false, product: null, category: null };
const gridClasses = "grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5";

export function AdminDashboardTemplate() {
  const { items, status, error, retry } = useCatalog();
  const [line, setLine] = useState<ProductLine>("streetwear");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProductStatus | "all">("all");
  const [editor, setEditor] = useState<EditorState>(CLOSED_EDITOR);
  const [toDelete, setToDelete] = useState<Product | null>(null);

  const lineConfig = LINES[line];
  const lineProducts = useMemo(() => productsOfLine(items, line), [items, line]);
  const visible = useMemo(
    () =>
      filterProducts(lineProducts, { ...DEFAULT_FILTERS, query }).filter(
        (p) => statusFilter === "all" || p.status === statusFilter,
      ),
    [lineProducts, query, statusFilter],
  );
  const isFiltering = query.trim() !== "" || statusFilter !== "all";

  const openNew = (category: string | null) => setEditor({ open: true, product: null, category });
  const openEdit = (product: Product) => setEditor({ open: true, product, category: product.category });

  const renderCatalog = () => {
    if (status === "idle" || status === "loading") {
      return (
        <div className={gridClasses}>
          {Array.from({ length: 10 }, (_, i) => (
            <Skeleton key={i} addStyle="aspect-[4/6] w-full" />
          ))}
        </div>
      );
    }

    if (status === "error") {
      return (
        <EmptyState
          title={error ?? "No pudimos cargar el catálogo."}
          action={<Button onClick={retry}>Reintentar</Button>}
        />
      );
    }

    return lineConfig.categories.map((category) => {
      const products = visible.filter((p) => p.category === category.id);
      if (isFiltering && products.length === 0) return null;
      return (
        <section key={category.id} aria-labelledby={`admin-${category.id}`} className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4 border-b border-dashed border-line pb-3">
            <div className="flex items-baseline gap-3">
              <Title as="h2" size="group" id={`admin-${category.id}`}>
                {category.label}
              </Title>
              <Text as="span" size="label" variant="gold">
                {products.length}
              </Text>
            </div>
            <button
              type="button"
              onClick={() => openNew(category.id)}
              className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center gap-2 rounded-full px-3 text-[12px] whitespace-nowrap font-bold uppercase tracking-[2px] text-ink hover:text-accent-lilac"
            >
              <PlusIcon size={16} />
              <span className="hidden sm:inline">{`Agregar ${category.singular}`}</span>
              <span className="sr-only sm:hidden">{`Agregar ${category.singular}`}</span>
            </button>
          </div>
          <ul className={gridClasses}>
            {products.map((product) => (
              <li key={product.id}>
                <AdminProductTile product={product} onEdit={openEdit} onDelete={setToDelete} />
              </li>
            ))}
            {!isFiltering && (
              <li>
                <AddProductTile label={`Agregar ${category.singular}`} onClick={() => openNew(category.id)} />
              </li>
            )}
          </ul>
        </section>
      );
    });
  };

  return (
    <div className="mx-auto flex max-w-[1200px] flex-col gap-8 px-4 py-8 lg:px-12 lg:py-12">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-2">
          <Text as="span" size="label" variant="muted">
            Catálogo
          </Text>
          <Title as="h1" size="section">
            Productos
          </Title>
        </div>
        <div role="group" aria-label="Línea" className="flex flex-wrap gap-2">
          {LINE_LIST.map((item) => (
            <Chip key={item.id} pressed={line === item.id} onClick={() => setLine(item.id)}>
              {`${item.label} · ${productsOfLine(items, item.id).length}`}
            </Chip>
          ))}
        </div>
      </div>

      <AdminStats products={lineProducts} />

      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Buscar producto</span>
          <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-ink-muted">
            <SearchIcon size={18} />
          </span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por nombre o color…"
            className="min-h-11 w-full rounded-full border border-line bg-surface pr-4 pl-11 text-[14px] text-ink placeholder:text-ink-muted/70 focus-visible:border-accent-lilac"
          />
        </label>
        <label className="sr-only" htmlFor="admin-status">
          Filtrar por estado
        </label>
        <select
          id="admin-status"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as ProductStatus | "all")}
          className="min-h-11 rounded-full border border-line bg-surface px-4 text-[13px] font-bold text-ink"
        >
          <option value="all">Todos los estados</option>
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <Button onClick={() => openNew(null)} addStyle="hidden sm:inline-flex">
          <PlusIcon size={16} />
          Nuevo
        </Button>
      </div>

      {isFiltering && visible.length === 0 && status === "ready" ? (
        <EmptyState title="Ningún producto coincide" description="Prueba con otro nombre o estado." />
      ) : (
        renderCatalog()
      )}

      <button
        type="button"
        onClick={() => openNew(null)}
        aria-label={`Nuevo producto de ${lineConfig.label}`}
        className="fixed right-4 bottom-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-accent-sky text-on-accent shadow-[0_8px_24px_rgb(0_0_0/0.3)] hover:brightness-110 sm:hidden"
      >
        <PlusIcon size={26} />
      </button>

      <ProductFormDialog
        open={editor.open}
        line={line}
        product={editor.product}
        presetCategory={editor.category}
        onClose={() => setEditor(CLOSED_EDITOR)}
      />
      <DeleteProductDialog product={toDelete} onClose={() => setToDelete(null)} />
    </div>
  );
}
