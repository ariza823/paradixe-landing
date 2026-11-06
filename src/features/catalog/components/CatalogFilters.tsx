import Text from "@atoms/text/Text.tsx";
import { Chip } from "@atoms/chip/Chip.tsx";
import { ChevronRightIcon } from "@atoms/icons/Icons.tsx";
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
  "-mx-3 flex gap-2 overflow-x-auto px-3 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mx-0 lg:flex-wrap lg:px-0";

const countClasses = "font-normal tabular-nums opacity-70";

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
    <div className="chrome-frame flex flex-col gap-3 rounded-[28px] p-3 xl:flex-row xl:items-center xl:justify-between xl:rounded-full">
      <div role="group" aria-label="Categoría" className={scrollerClasses}>
        <Chip pressed={filters.category === null} onClick={() => onChange({ category: null })}>
          Todo <span className={countClasses}>{total}</span>
        </Chip>
        {categories.map((category) => (
          <Chip
            key={category.id}
            pressed={filters.category === category.id}
            onClick={() => onChange({ category: filters.category === category.id ? null : category.id })}
          >
            {category.label} <span className={countClasses}>{category.count}</span>
          </Chip>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-dashed border-line pt-3 xl:border-t-0 xl:pt-0">
        <Chip
          pressed={filters.onlyAvailable}
          onClick={() => onChange({ onlyAvailable: !filters.onlyAvailable })}
        >
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-accent-green" />
          Solo disponibles
        </Chip>

        <label htmlFor={sortId} className="sr-only">
          Ordenar por
        </label>
        <div className="relative order-last w-full sm:ml-auto sm:w-auto">
          <select
            id={sortId}
            value={filters.sort}
            onChange={(event) => onChange({ sort: event.target.value as SortOption })}
            className="min-h-11 w-full appearance-none rounded-full border border-line bg-surface-soft pr-10 pl-4 text-[13px] font-bold text-ink hover:border-accent-lilac"
          >
            {Object.entries(SORT_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 rotate-90 text-ink-muted">
            <ChevronRightIcon size={16} />
          </span>
        </div>

        <div className="flex flex-1 items-center justify-between gap-3">
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
