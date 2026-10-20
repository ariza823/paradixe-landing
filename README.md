# Paradixe Urban

Landing y catálogo de **Paradixe Urban**, marca de streetwear y joyería de Bogotá. Es una vitrina: muestra cada pieza con fotos, precio y número de edición, y la venta se cierra por **WhatsApp**. Tiene un **panel admin** para cargar productos y fotos desde producción, sin tocar código.

**Sitio:** https://paradixe-urban.pages.dev

![React](https://img.shields.io/badge/React-18.3-61dafb) ![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6) ![Vite](https://img.shields.io/badge/Vite-7-646cff) ![Tailwind](https://img.shields.io/badge/Tailwind-v4-38bdf8) ![Supabase](https://img.shields.io/badge/Supabase-Postgres%20%2B%20RLS-3ecf8e) ![Cloudflare Pages](https://img.shields.io/badge/Cloudflare-Pages-f38020)

---

## Qué hace

- **Dos líneas:**
  - `/`: Streetwear, con camisetas, hoodies, clásicos (polos y básicos) y jeans.
  - `/joyeria`: Joyería, con anillos, collares, aretes y pulseras.
- **Catálogo con filtros en la URL:** categoría con conteo, "solo disponibles", orden (destacados, precio, más nuevos) y búsqueda sin tildes. Los links se pueden compartir, por ejemplo `/?cat=hoodies&disp=1`.
- **Tarjeta de producto:**
  - Galería con scroll-snap: se desliza en móvil y tiene flechas en escritorio.
  - Badge de edición (`N°/030`) y precio en COP. Con precio 0 dice "Precio por confirmar".
  - Comportamiento según el estado:
    - **Disponible:** botones de WhatsApp con el mensaje armado. Cada categoría puede tener uno o varios números.
    - **Próximamente:** botón bloqueado.
    - **Agotado:** foto en gris con sello.
- **Pantalla de Próximamente** cuando una línea no tiene productos todavía, con un botón de "Avísame por WhatsApp".
- **Sin tallas, a propósito:** el sitio es una vitrina y no se compromete con stock por talla.
- **Panel admin oculto:**
  - Login con Supabase Auth.
  - Resumen por línea, buscador y filtro por estado.
  - Botón **+** en cada categoría para crear productos.
  - Formulario validado con zod.
  - Hasta 6 fotos por producto: se arrastran, se comprimen a WebP 1080×1350 en el navegador y se elige la portada. Al quitar una foto, también se borra del storage.
- **Modo demo:** sin variables de entorno, el sitio funciona con datos de ejemplo y el panel guarda en `localStorage`.
- **Modo claro y oscuro:** oscuro por defecto. Respeta `prefers-color-scheme` y recuerda la elección.
- **Cuenta regresiva de "drop":** está lista pero desactivada. Se reactiva descomentando `HomePage.tsx` y `Hero.tsx`.

## Stack

| Capa | Tecnología |
|---|---|
| UI | React 18.3, TypeScript strict (`exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`) |
| Estilos | Tailwind CSS v4 con tokens semánticos (`bg-surface`, `text-ink`, `text-accent-gold`…) y tema por clase `dark` |
| Estado | Redux Toolkit (catálogo y toasts). Context solo para auth y tema |
| Rutas | React Router 7 con páginas lazy |
| Formularios | react-hook-form + zod v4 |
| Backend | Supabase: Postgres + RLS, Auth y Storage |
| Build | Vite 7, pnpm 11 |
| Tests | Vitest + Testing Library + jsdom |
| Calidad | ESLint 9 (flat config), `tsc --noEmit` |
| Hosting | Cloudflare Pages |

## Arquitectura

```
src/
├── config/            # contenido de negocio (sin textos quemados en componentes)
│   ├── site.config.ts     # marca, textos, WhatsApp general, FAQ, drop
│   └── catalog.config.ts  # líneas, categorías, WhatsApp por categoría, textos de "Próximamente"
├── core/
│   ├── api/           # cliente Supabase cargado bajo demanda
│   ├── store/         # rootReducer + hooks tipados
│   ├── slices/        # toasts
│   ├── hooks/ utils/  # countdown, título, WhatsApp, formato COP, compresión de imágenes
│   └── components/    # atoms (Text, Title, Button, Chip, Field…) y molecules (Dialog, Section, Toaster…)
├── features/          # catalog, admin, auth, home, jewelry, hero, how-to-buy, faq, theme
├── layout/            # Header, Footer, Layout
├── routes/            # AppRoutes con lazy pages
└── __tests__/         # espejo de src
supabase/
├── migrations/        # esquema, RLS, grants y bucket de fotos
└── seed.sql           # espacios iniciales del catálogo
docs/                  # SPEC, SUPABASE (base de datos y panel), DEPLOY (Cloudflare)
```

**Decisiones de arquitectura:**
- **Patrón repository:** todo acceso a datos pasa por `ProductsRepository`, que tiene dos implementaciones, Supabase y demo (`localStorage`). Ningún componente llama a Supabase directo.
- **Bundle liviano:** el sitio público lee los productos por REST con `fetch`. `supabase-js` (unos 59 KB gzip) solo se descarga en el panel, y el JS inicial queda en unos **81 KB gzip**.
- **Panel aislado:** el panel vive en una ruta configurable (`VITE_ADMIN_PATH`), fuera del layout público, sin links, sin `robots.txt` y con `noindex`. La seguridad no depende de que la ruta sea secreta (está en el bundle); depende del **login más RLS**.

## Base de datos

Tabla `products`:

| Columna | Tipo / regla |
|---|---|
| `id` | uuid |
| `line` | enum `streetwear` \| `joyeria` |
| `category` | texto (1 a 40), tiene que coincidir con un `id` de `catalog.config.ts` |
| `name` | texto (1 a 80) |
| `variant` | color o variante (hasta 80) |
| `description` | hasta 500 |
| `price` | entero en COP (0 = "Precio por confirmar") |
| `images` | `text[]`, máximo 6; la primera es la portada |
| `edition` | 1 a 9999 |
| `status` | enum `available` \| `soon` \| `sold_out` |
| `position` | orden dentro de la categoría |
| `created_at` / `updated_at` | `updated_at` la mantiene un trigger |

**Seguridad:**
- **`products`:** lectura pública. Insert, update y delete solo para usuarios en `admins`, vía `is_admin()`.
- **`is_admin()`:** función `security definer` con `search_path = ''`. Se le revocó la ejecución a `public` y `anon`.
- **`admins`:** cada usuario solo ve su fila y no hay política de insert, así que nadie se agrega solo.
- **Grants explícitos:** el proyecto no expone tablas automáticamente.
- **Bucket `products`:** lectura pública, máximo 2 MB por archivo y solo webp, jpeg o png. Solo los admins escriben.
- **Registros:** desactivados en Supabase Auth.

Paso a paso del setup en [`docs/SUPABASE.md`](docs/SUPABASE.md).

## Correr en local

Requisitos: Node 22.13 o superior y pnpm 11 (fijado en `packageManager`).

```bash
pnpm install
cp .env.example .env    # opcional: sin .env corre en modo demo
pnpm dev                # http://localhost:5173
```

Si no hay `.env`, el panel está en `/admin` y entra en modo demo.

| Script | Qué hace |
|---|---|
| `pnpm dev` | servidor de desarrollo |
| `pnpm build` | `tsc --noEmit` + `vite build` |
| `pnpm preview` | sirve el build |
| `pnpm test` / `pnpm test:watch` | Vitest |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | TypeScript |

### Variables de entorno

| Variable | Para qué |
|---|---|
| `VITE_SUPABASE_URL` | URL del proyecto Supabase |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | key pública (`sb_publishable_…`). La `secret` nunca va en el front |
| `VITE_ADMIN_PATH` | ruta del panel, sin `/`. Por defecto `admin` |

Las `VITE_*` se escriben en el JS durante el build: si cambias una, reinicia `pnpm dev` o vuelve a desplegar. Los tests fuerzan el modo demo y no dependen del `.env`.

## Deploy

Cloudflare Pages construye cada push a `main`.

| Campo | Valor |
|---|---|
| Build command | `pnpm build` |
| Output | `dist` |
| Variables | las tres `VITE_*`, más `PNPM_VERSION=11.3.0` y `NODE_VERSION=22` |

- **Headers y caché:** `public/_headers` agrega los headers de seguridad (`nosniff`, `Referrer-Policy`, `X-Frame-Options: DENY`) y la caché de un año para `/assets/*`.
- **SPA sin configuración:** como no hay `404.html`, Pages trata el sitio como SPA y las rutas funcionan al recargar.

Elegimos Cloudflare en vez de Vercel porque el plan Hobby de Vercel no permite uso comercial. Detalles en [`docs/DEPLOY.md`](docs/DEPLOY.md).

## Operación

- **Sin deploy:** productos, precios, fotos y estado se cambian desde el panel y salen al recargar.
- **Con push a `main`:** textos, FAQ, números de WhatsApp y categorías viven en `src/config/`.
- **Nueva categoría:** agrégala en `catalog.config.ts` con un `id` igual a `category` en la base (minúsculas, sin tildes). No hace falta migración.
- **Plan Free de Supabase:** pausa el proyecto tras 7 días sin actividad, y se reactiva desde el dashboard. Conviene exportar `products` de vez en cuando.

## Calidad

- **Tests:** 29 tests de utilidades, servicios, schemas, la tarjeta de producto, la sección de catálogo y el flujo completo del panel en modo demo (entrar, **+**, crear y validar).
- **Responsive:** auditado en 320, 360, 390, 430, 640, 768, 1024 y 1280 px, en modo claro y oscuro, con 0 fallos. Revisa scroll horizontal, botones cortados, áreas táctiles de menos de 44 px y textos partidos.
  - En móvil el header y los filtros no son fijos.
- **A11y:**
  - Un `<h1>` por página, foco visible y áreas táctiles de 44 px o más.
  - Respeta `prefers-reduced-motion`, usa `<dialog>` nativo y tiene un skip link.
- **Reglas del proyecto:** en [`CLAUDE.md`](CLAUDE.md).

## Documentación

- [`docs/SUPABASE.md`](docs/SUPABASE.md): base de datos, panel admin y edición del catálogo.
- [`docs/DEPLOY.md`](docs/DEPLOY.md): publicación en Cloudflare Pages.
- [`docs/SPEC.md`](docs/SPEC.md): spec original de la marca.
