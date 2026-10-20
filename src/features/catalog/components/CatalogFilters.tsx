import Text from "@atoms/text/Text.tsx";
import { Chip } from "@atoms/chip/Chip.tsx";
import type { LineConfig } from "@config/catalog.config.ts";
import {
  SORT_LABELS,
  hasActiveFilters,
  type CatalogFilters as Filters,
  type SortOption,
} from "../utils/filterProducts.ts";

interface CategoryCount {
  id: string;
  label: string;
  count: number;
}

interface CatalogFiltersProps {
  readonly line: LineConfig;
  readonly filters: Filters;
  readonly categories: CategoryCount[];
  readonly total: number;
  readonly resultCount: number;
  readonly onChange: (patch: Partial<Filters>) => void;
  readonly onReset: () => void;
}

const scrollerClasses =
  "-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mx-0 lg:flex-wrap lg:px-0";

export function CatalogFilters({
  line,
  filters,
  categories,
  total,
  resultCount,
  onChange,
  onReset,
}: CatalogFiltersProps) {
  const sortId = `sort-${line.id}`;

  return (
    <div className="-mx-4 flex flex-col gap-3 border-y border-dashed border-line bg-surface/90 px-4 py-4 backdrop-blur-[8px] md:sticky md:top-16 md:z-30 lg:-mx-12 lg:px-12">
      <div role="group" aria-label="Categoría" className={scrollerClasses}>
        <Chip pressed={filters.category === null} onClick={() => onChange({ category: null })}>
          {`Todo · ${total}`}
        </Chip>
        {categories.map((category) => (
          <Chip
            key={category.id}
            pressed={filters.category === category.id}
            onClick={() => onChange({ category: filters.category === category.id ? null : category.id })}
          >
            {`${category.label} · ${category.count}`}
          </Chip>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <Chip
          pressed={filters.onlyAvailable}
          onClick={() => onChange({ onlyAvailable: !filters.onlyAvailable })}
        >
          Solo disponibles
        </Chip>

        <label htmlFor={sortId} className="sr-only">
          Ordenar por
        </label>
        <select
          id={sortId}
          value={filters.sort}
          onChange={(event) => onChange({ sort: event.target.value as SortOption })}
          className="ml-auto min-h-11 rounded-full border border-line bg-surface px-4 text-[13px] font-bold text-ink sm:order-last"
        >
          {Object.entries(SORT_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:flex-1">
          <Text as="span" size="caption" variant="muted" aria-live="polite">
            {`${resultCount} ${resultCount === 1 ? "pieza" : "piezas"}`}
          </Text>
          {hasActiveFilters(filters) && (
            <button
              type="button"
              onClick={onReset}
              className="min-h-11 px-2 text-[12px] font-bold uppercase tracking-[2px] text-ink underline decoration-dashed underline-offset-4 hover:text-accent-lilac sm:ml-auto"
            >
              Limpiar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
