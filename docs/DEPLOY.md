# Publicar en Cloudflare Pages

Repo: `github.com/ariza823/paradixe-landing` · build con pnpm 11 · plan **Free** de Cloudflare (permite uso comercial).

## Por qué Cloudflare y no Vercel
- El plan Hobby de Vercel es solo para uso no comercial. Una tienda que vende por WhatsApp no cumple esa condición.
- Cloudflare Pages Free permite uso comercial y no tiene límite de ancho de banda para sitios estáticos (si un video se vuelve viral, no llega factura ni se cae el sitio). La CDN tiene nodo en Bogotá.
- Límites del Free: 500 builds al mes, 1 build a la vez, hasta 20.000 archivos y 25 MiB por archivo. Sobra para este sitio.

## 0. Antes de empezar
- [ ] Agregar `public/_headers` (abajo está el contenido). Vite lo copia a `dist/` en el build.
- [ ] **No** crear `public/_redirects`. Pages detecta que no hay `404.html` y trata el sitio como SPA: `/joyeria` y el panel funcionan al recargar sin configurar nada. Un `/* /index.html 200` lo marca como posible bucle infinito.
- [ ] `vercel.json` se puede borrar porque Cloudflare lo ignora.
- [ ] Confirmar que `.env` no se sube: `git check-ignore .env` debe imprimir `.env`.
- [ ] En local todo en verde (en PowerShell 5.1, uno por uno en vez de `&&`):
  ```
  pnpm lint
  pnpm typecheck
  pnpm test
  pnpm build
  ```
- [ ] Hacer commit y push a `main`.

### `public/_headers`
```
/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: DENY

/assets/*
  Cache-Control: public, max-age=31536000, immutable
```
Los archivos de `/assets/` llevan hash en el nombre, así que la caché de un año nunca sirve una versión vieja. HTTPS y HSTS los maneja Cloudflare.

## 1. Crear el proyecto
1. Entra a https://dash.cloudflare.com (con GitHub es lo más directo).
2. **Workers & Pages → Create → Pages → Connect to Git.** Si el dashboard te muestra primero "Workers", busca la pestaña o el enlace de **Pages**.
3. Autoriza la app de Cloudflare en GitHub, solo para el repo `paradixe-landing`.
4. Configuración del build:

| Campo | Valor |
|---|---|
| Project name | `paradixe-urban` (queda `paradixe-urban.pages.dev`) |
| Production branch | `main` |
| Framework preset | React (Vite), o *None* y llenar a mano |
| Build command | `pnpm build` |
| Build output directory | `dist` |
| Root directory | vacío |

## 2. Variables de entorno
En la misma pantalla (**Environment variables**) o después en **Settings → Variables and Secrets**. Pages separa **Production** y **Preview**.

| Variable | Production | Preview |
|---|---|---|
| `VITE_SUPABASE_URL` | `https://zyniqiufdvewkdaatokl.supabase.co` | no ponerla |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | la `sb_publishable_…`, copiada con el botón de Supabase → Settings → API Keys | no ponerla |
| `VITE_ADMIN_PATH` | la misma de tu `.env`, sin `/` | la misma |
| `PNPM_VERSION` | `11.3.0` | `11.3.0` |
| `NODE_VERSION` | `22` (o la que uses en local) | `22` |

- Si dejas las de Supabase fuera de Preview, los previews corren en **modo demo** y no pueden tocar los productos reales.
- Las `VITE_*` se escriben dentro del JS al momento del build. Si cambias una, hay que hacer **Retry deployment** o un push nuevo. Guardarla no basta.
- Ponlas como texto plano, no como *Secret*. Las de build tienen que poder leerse durante `pnpm build`, y de todas formas terminan públicas en el bundle.

Dale **Save and Deploy**.

## 3. Verificar el deploy
- [ ] `https://paradixe-urban.pages.dev/` carga el catálogo con los productos de Supabase, sin la franja de "Modo demo".
- [ ] `/joyeria` carga y al recargar no da 404.
- [ ] `/<VITE_ADMIN_PATH>` muestra el login y entras con tu usuario admin.
- [ ] Crea o edita un producto con foto, guarda y recarga `/`: debe aparecer.
- [ ] En DevTools → Network → algún archivo de `/assets/`, debe salir `cache-control: public, max-age=31536000, immutable`.

## 4. Dominio propio (opcional)
1. En el proyecto: **Custom domains → Set up a custom domain** → `paradixeurban.com` (o el que compres).
2. Para el dominio raíz (sin `www`), Cloudflare exige que el dominio use **sus nameservers**: agregas el dominio como sitio en Cloudflare (plan Free) y cambias los nameservers donde lo compraste. Para solo un subdominio (`www.` o `tienda.`) basta con un `CNAME` a `paradixe-urban.pages.dev`.
3. El HTTPS se activa solo.
4. Si el dominio final no es `paradixeurban.com`, cambia `og:url` y las URLs de `og:image` en `index.html` y haz push.

## 5. Día a día
- **Push a `main`:** publica en producción.
- **Push a otra rama o PR:** crea un preview con su propia URL (`<rama>.paradixe-urban.pages.dev`). Sin las variables de Supabase, corre en modo demo.
- **Productos, fotos, precios y estado:** se cambian desde el panel en producción. Van directo a Supabase y salen al recargar, sin deploy. Las fotos se comprimen a WebP 1080×1350 en el navegador, así que puedes subir PNG pesados. Usa fotos verticales 4:5.
- **Textos, WhatsApp, FAQ y categorías:** viven en `src/config/` y sí necesitan push.
- Cada push gasta un build de los 500 del mes. Si haces muchos commits pequeños, agrúpalos antes del push.

## Si algo falla
| Síntoma | Causa probable |
|---|---|
| Build falla en `pnpm install` | `PNPM_VERSION` no coincide con `packageManager` o el lockfile no está subido |
| Build falla con error de Node | Falta `NODE_VERSION` o es menor a la que pide el proyecto |
| Build falla en `tsc` | Corre `pnpm typecheck` en local, arréglalo y haz push |
| Sale "Modo demo" en producción | Variables puestas en Preview y no en Production, o no se hizo redeploy |
| `/joyeria` da 404 al recargar | Hay un `404.html` en `dist/` (Pages deja de tratarlo como SPA) |
| La ruta del panel da 404 | `VITE_ADMIN_PATH` distinto al que escribes, o falta redeploy |
| No cargan productos | Proyecto de Supabase pausado (plan Free, 7 días sin uso); reactívalo en el dashboard |
| Fotos no suben | Más de 2 MB después de comprimir o formato distinto a webp/jpeg/png (ver `docs/SUPABASE.md`) |
| Los headers no aparecen | `_headers` no quedó en `public/`, o sea, no llegó a `dist/` |
