import { combineReducers, configureStore } from "@reduxjs/toolkit";
import catalogReducer from "@features/catalog/slices/catalogSlice.ts";
import uiReducer from "@core/slices/uiSlice.ts";

const rootReducer = combineReducers({
  catalog: catalogReducer,
  ui: uiReducer,
});

export function createAppStore(preloadedState: Partial<ReturnType<typeof rootReducer>> = {}) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefault) =>
      getDefault({ serializableCheck: { ignoredActionPaths: ["meta.arg"] } }),
  });
}

export const store = createAppStore();

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof createAppStore>;
export type AppDispatch = AppStore["dispatch"];
