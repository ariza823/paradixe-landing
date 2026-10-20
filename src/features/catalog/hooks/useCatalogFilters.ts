import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  DEFAULT_FILTERS,
  SORT_LABELS,
  type CatalogFilters,
  type SortOption,
} from "../utils/filterProducts.ts";

const PARAMS = {
  category: "cat",
  onlyAvailable: "disp",
  sort: "orden",
  query: "q",
} as const;

function isSortOption(value: string | null): value is SortOption {
  return value !== null && Object.hasOwn(SORT_LABELS, value);
}

export function parseFilters(params: URLSearchParams): CatalogFilters {
  const sort = params.get(PARAMS.sort);
  return {
    category: params.get(PARAMS.category),
    onlyAvailable: params.get(PARAMS.onlyAvailable) === "1",
    sort: isSortOption(sort) ? sort : DEFAULT_FILTERS.sort,
    query: params.get(PARAMS.query) ?? "",
  };
}

function writeFilters(params: URLSearchParams, filters: CatalogFilters) {
  const set = (key: string, value: string | null) => {
    if (value) params.set(key, value);
    else params.delete(key);
  };
  set(PARAMS.category, filters.category);
  set(PARAMS.onlyAvailable, filters.onlyAvailable ? "1" : null);
  set(PARAMS.sort, filters.sort === DEFAULT_FILTERS.sort ? null : filters.sort);
  set(PARAMS.query, filters.query.trim() || null);
}

export function useCatalogFilters() {
  const [params, setParams] = useSearchParams();
  const filters = useMemo(() => parseFilters(params), [params]);

  const update = useCallback(
    (patch: Partial<CatalogFilters>) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          writeFilters(next, { ...parseFilters(prev), ...patch });
          return next;
        },
        { replace: true, preventScrollReset: true },
      );
    },
    [setParams],
  );

  const reset = useCallback(() => update(DEFAULT_FILTERS), [update]);

  return { filters, update, reset };
}
