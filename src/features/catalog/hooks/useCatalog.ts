import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@core/store/hookStore.ts";
import { fetchProducts } from "../slices/catalogSlice.ts";

export function useCatalog() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.catalog.items);
  const status = useAppSelector((state) => state.catalog.status);
  const error = useAppSelector((state) => state.catalog.error);

  useEffect(() => {
    if (status === "idle") void dispatch(fetchProducts());
  }, [dispatch, status]);

  const retry = useCallback(() => {
    void dispatch(fetchProducts());
  }, [dispatch]);

  return { items, status, error, retry };
}
