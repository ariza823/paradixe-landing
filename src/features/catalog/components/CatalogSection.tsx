import { useMemo } from "react";
import Text from "@atoms/text/Text.tsx";
import Title from "@atoms/title/Title.tsx";
import Button from "@atoms/button/Button.tsx";
import { Section } from "@molecules/section/Section.tsx";
import { EmptyState } from "@molecules/emptyState/EmptyState.tsx";
import { LINES } from "@config/catalog.config.ts";
import type { Product, ProductLine } from "../dto/product.types.ts";
import { useCatalog } from "../hooks/useCatalog.ts";
import { useCatalogFilters } from "../hooks/useCatalogFilters.ts";
import {
  filterProducts,
  groupByCategory,
  productsOfLine,
} from "../utils/filterProducts.ts";
import { CatalogFilters } from "./CatalogFilters.tsx";
import { ProductCard } from "./ProductCard.tsx";
import { ProductCardSkeleton } from "./ProductCardSkeleton.tsx";

interface CatalogSectionProps {
  readonly line: ProductLine;
  readonly isReleased: boolean;
}

const SKELETON_COUNT = 8;
const gridClasses = "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

function ProductList({ products, isReleased }: { readonly products: Product[]; readonly isReleased: boolean }) {
  return (
    <ul className={gridClasses}>
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} isReleased={isReleased} />
        </li>
      ))}
    </ul>
  );
}

export function CatalogSection({ line, isReleased }: CatalogSectionProps) {
  const lineConfig = LINES[line];
  const { items, status, error, retry } = useCatalog();
  const { filters, update, reset } = useCatalogFilters();

  const lineProducts = useMemo(() => productsOfLine(items, line), [items, line]);
  const visible = useMemo(() => filterProducts(lineProducts, filters), [lineProducts, filters]);
  const categoryOrder = lineConfig.categories.map((c) => c.id);

  const categories = lineConfig.categories
    .map((c) => ({ ...c, count: lineProducts.filter((p) => p.category === c.id).length }))
    .filter((c) => c.count > 0);

  const isGrouped = filters.category === null && filters.sort === "featured";
  const titleId = `${lineConfig.sectionId}-title`;

  const renderContent = () => {
    if (status === "idle" || status === "loading") {
      return (
        <ul className={gridClasses} aria-busy="true" aria-label="Cargando productos">
          {Array.from({ length: SKELETON_COUNT }, (_, i) => (
            <li key={i}>
              <ProductCardSkeleton />
            </li>
          ))}
        </ul>
      );
    }

    if (status === "error") {
      return (
        <EmptyState
          title={error ?? "No pudimos cargar el catálogo."}
          description="Revisa tu conexión e inténtalo de nuevo."
          action={<Button onClick={retry}>Reintentar</Button>}
        />
      );
    }

    if (visible.length === 0) {
      return (
        <EmptyState
          title="Nada con esos filtros"
          description="Prueba con otra categoría."
          action={<Button onClick={reset}>Limpiar filtros</Button>}
        />
      );
    }

    if (!isGrouped) return <ProductList products={visible} isReleased={isReleased} />;

    return groupByCategory(visible, categoryOrder).map((group) => {
      const category = lineConfig.categories.find((c) => c.id === group.category);
      return (
        <div key={group.category} className="flex flex-col gap-6">
          <div className="flex items-baseline justify-between gap-4 border-b border-dashed border-line pb-3">
            <Title as="h3" size="group">
              {category?.label ?? group.category}
            </Title>
            <Text as="span" size="label" variant="gold">
              {`${group.products.length} pzs`}
            </Text>
          </div>
          <ProductList products={group.products} isReleased={isReleased} />
        </div>
      );
    });
  };

  return (
    <Section id={lineConfig.sectionId} labelledBy={titleId}>
      <div className="flex flex-col gap-3">
        <Title id={titleId}>{lineConfig.title}</Title>
        <Text variant="muted">{lineConfig.tagline}</Text>
      </div>

      <CatalogFilters
        line={lineConfig}
        filters={filters}
        categories={categories}
        total={lineProducts.length}
        resultCount={visible.length}
        onChange={update}
        onReset={reset}
      />

      {renderContent()}
    </Section>
  );
}
