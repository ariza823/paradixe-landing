import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Product } from "../dto/product.types.ts";
import { getProductsRepository, saveProductWithImages } from "../services/productsService.ts";
import type { CatalogState, SaveProductArgs } from "./catalogSlice.types.ts";

const initialState: CatalogState = {
  items: [],
  status: "idle",
  error: null,
  saving: false,
  deletingId: null,
};

const messageOf = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

export const fetchProducts = createAsyncThunk<Product[], void, { rejectValue: string }>(
  "catalog/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      return await getProductsRepository().list();
    } catch (error) {
      return rejectWithValue(messageOf(error, "No pudimos cargar el catálogo."));
    }
  },
);

export const saveProduct = createAsyncThunk<Product, SaveProductArgs, { rejectValue: string }>(
  "catalog/saveProduct",
  async (args, { rejectWithValue }) => {
    try {
      return await saveProductWithImages(getProductsRepository(), args);
    } catch (error) {
      return rejectWithValue(messageOf(error, "No se pudo guardar el producto."));
    }
  },
);

export const deleteProduct = createAsyncThunk<string, Product, { rejectValue: string }>(
  "catalog/deleteProduct",
  async (product, { rejectWithValue }) => {
    try {
      const repo = getProductsRepository();
      await repo.remove(product.id);
      await repo.removeImages(product.images).catch(() => undefined);
      return product.id;
    } catch (error) {
      return rejectWithValue(messageOf(error, "No se pudo eliminar el producto."));
    }
  },
);

const catalogSlice = createSlice({
  name: "catalog",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "ready";
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload ?? "No pudimos cargar el catálogo.";
      })
      .addCase(saveProduct.pending, (state) => {
        state.saving = true;
      })
      .addCase(saveProduct.fulfilled, (state, action) => {
        state.saving = false;
        const index = state.items.findIndex((p) => p.id === action.payload.id);
        if (index === -1) state.items.push(action.payload);
        else state.items[index] = action.payload;
      })
      .addCase(saveProduct.rejected, (state) => {
        state.saving = false;
      })
      .addCase(deleteProduct.pending, (state, action) => {
        state.deletingId = action.meta.arg.id;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.deletingId = null;
        state.items = state.items.filter((p) => p.id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state) => {
        state.deletingId = null;
      });
  },
});

export default catalogSlice.reducer;
