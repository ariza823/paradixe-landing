import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const src = (dir: string) => path.resolve(root, "./src", dir);

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": src(""),
      "@core": src("core"),
      "@components": src("core/components"),
      "@atoms": src("core/components/atoms"),
      "@molecules": src("core/components/molecules"),
      "@features": src("features"),
      "@layout": src("layout"),
      "@config": src("config"),
      "@assets": src("assets"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    css: false,
    setupFiles: ["./src/__tests__/setup.ts"],
    env: { VITE_SUPABASE_URL: "", VITE_SUPABASE_PUBLISHABLE_KEY: "" },
  },
});
