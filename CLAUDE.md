# Paradixe Urban — Landing + catálogo + panel

React 18 + TypeScript strict + Tailwind v4 + Vite + Redux Toolkit + React Router 7 + Supabase. Feature-based, misma organización que litigando-front-app. Spec original en `docs/SPEC.md`, setup de backend en `docs/SUPABASE.md`, deploy (Cloudflare Pages) en `docs/DEPLOY.md`.

## Commands
- `pnpm dev` / `pnpm build` / `pnpm preview`
- `pnpm test` / `pnpm test:watch`
- `pnpm lint` / `pnpm typecheck`

## Rutas
- `/` streetwear (hero + catálogo; countdown comentado), `/joyeria`, panel admin oculto en `/${VITE_ADMIN_PATH}` (default `/admin`; login + panel, lazy, sin links ni robots.txt que lo delaten)

## Structure
- `src/config/` — `site.config.ts` (textos de negocio, WhatsApp, fecha del drop, FAQ) y `catalog.config.ts` (líneas y categorías; sin tallas: la landing solo muestra)
- `src/core/` — `api/` (Supabase lazy), `store/` (rootReducer + hookStore), `slices/` (ui/toasts), `components/{atoms,molecules}`, `hooks/`, `utils/`
- `src/features/{module}/{components|pages|templates|context|services|slices|schemas|dto|hooks|utils}` — catalog, admin, auth, home, jewelry, hero, how-to-buy, faq, theme
- `src/routes/` — AppRoutes con lazy pages
- `src/layout/` — Header, Footer, Layout (Outlet)
- `supabase/` — migración SQL (RLS + storage) y seed
- `src/__tests__/` — espejo de `src`

## Rules
- **Package manager**: pnpm
- **Imports**: alias `@core`, `@atoms`, `@molecules`, `@features`, `@layout`, `@config`, `@assets` con extensión `.ts/.tsx`; relativos solo dentro de la misma feature
- **Datos**: productos viven en Supabase (o en el repositorio demo si no hay env). Todo acceso pasa por `ProductsRepository` (`features/catalog/services`); componentes no llaman a Supabase directo
- **Estado**: Redux para catálogo y toasts; Context solo para auth y theme; estado local para UI
- **Bundle**: no importar `@supabase/supabase-js` de forma estática; usar `getSupabaseClient()`
- **Contenido**: ningún componente quema precios, números, fechas ni textos de negocio
- **Colores**: solo tokens semánticos (`bg-surface`, `text-ink`, `text-ink-muted`, `bg-accent-sky`, `text-accent-gold`, `border-line`, `text-danger`…). Nada de hex sueltos. Tema por clase `dark` en `<html>`
- **`<Text>` / `<Title>`**: `size` = tipografía, `variant` = color, `addStyle` = layout puntual. No `<p>`/`<h1-6>` sueltos en features/layout
- **Formularios**: react-hook-form + zod (`features/*/schemas/*.zod.ts`)
- **A11y**: un `<h1>` por página, botones reales, áreas táctiles ≥ 44px, foco visible, `prefers-reduced-motion`, diálogos con `<dialog>` nativo
- **Sin comentarios** en el código
- **Calidad**: antes de entregar, `pnpm lint`, `pnpm typecheck` y `pnpm test` en verde
