# Catálogo y base de datos (Supabase)

Proyecto `paradixe-urban` · ref `zyniqiufdvewkdaatokl` · São Paulo `sa-east-1` · plan Free.
Dashboard: https://supabase.com/dashboard/project/zyniqiufdvewkdaatokl

Sin variables de entorno el sitio corre en **modo demo** (seed + localStorage). Con ellas, todo lo que guardas en el panel queda en Supabase y se ve en producción.

## Qué hay en el catálogo
La landing es una **vitrina**: muestra la pieza, fotos, precio y un botón a WhatsApp. **No maneja tallas**, ni en la base de datos, ni en el panel, ni en la tarjeta, para no comprometerse con ninguna.

| Línea | Ruta | Categorías (`category`) | Espacios del seed |
|---|---|---|---|
| `streetwear` | `/` | `camisetas`, `hoodies`, `clasicos` (polos y básicos), `jeans` | 8 · 5 · 4 · 4 |
| `joyeria` | `/joyeria` | `anillos`, `collares`, `aretes`, `pulseras` | 3 · 3 · 3 · 3 |

Cada producto tiene:
- nombre;
- color o variante;
- descripción;
- precio en COP (`0` muestra "Precio por confirmar");
- unidades (`N°/030`);
- estado (`available`, `soon` o `sold_out`);
- orden;
- hasta 6 fotos (la primera es la portada).

## Estado de la base
Ya está montada:
- Tablas, RLS, grants y bucket de fotos.
- Registros públicos desactivados y tu usuario en `admins`.
- `supabase/migrations/20261020000000_catalog.sql` coincide con la versión corregida que corriste, sin las columnas de tallas.

### Pendiente
- [x] **SQL Editor** → correr `supabase/migrations/20261020010000_drop_sizes.sql`. Quita `sizes`, `sold_out_sizes` y el check `sold_out_subset` de tu base. El sitio funciona aunque no lo corras, pero así la base queda igual al código.
- [x] **SQL Editor** → correr `supabase/seed.sql`. Crea los 33 espacios de la tabla de arriba en "Próximamente". Solo inserta si `products` está vacía, así que repetirlo no duplica nada.
- [ ] **Local:** el `.env` ya existe con las tres variables. Reinicia `pnpm dev`.
- [ ] **Cloudflare Pages:** variables y deploy según `docs/DEPLOY.md`.
- [ ] **Probar:** entra a la ruta del panel, crea un producto con foto y recarga `/`.

## Variables de entorno
| Variable | Valor |
|---|---|
| `VITE_SUPABASE_URL` | `https://zyniqiufdvewkdaatokl.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | la publishable key (**Settings → API Keys**, botón copiar). Es pública; la `secret` nunca va en el front |
| `VITE_ADMIN_PATH` | la ruta secreta del panel, sin `/`. Está en tu `.env`. Si falta, el panel queda en `/admin` |

## Panel admin (ingreso oculto)
- El panel vive en `https://tu-dominio/<VITE_ADMIN_PATH>`. Guárdalo en favoritos.
  - Nada en el sitio enlaza a esa ruta.
  - `robots.txt` no la menciona y la página lleva `noindex`.
- La ruta queda dentro del bundle de JS (todo `VITE_*` es público), así que solo evita bots y curiosos. Lo que protege los datos es el login con RLS.
- Para agregar otro admin: **Authentication → Users → Add user → Create new user** (con *Auto Confirm*) y después:
  ```sql
  insert into public.admins (user_id)
  select id from auth.users where email = 'correo@ejemplo.com';
  ```
  No uses "Send invitation": el link lleva a la Site URL y el sitio no tiene pantalla para aceptar invitaciones.

## Editar el catálogo
**Desde el panel (lo normal):**
- Para crear: **+** en la categoría, llena nombre, precio y estado, sube fotos y dale **Guardar**.
- Para editar, toca la tarjeta. La papelera elimina el producto y también borra sus fotos del storage.
- **Orden:** el número menor aparece primero dentro de su categoría.
- Para lanzar una pieza, cambia su estado de *Próximamente* a *Disponible*. *Agotado* la pone en gris con sello.

**Desde Supabase (cambios masivos):** en el **SQL Editor**, o fila por fila en **Table Editor → products**.
```sql
-- publicar todas las camisetas
update public.products set status = 'available' where category = 'camisetas';

-- precio a todos los jeans
update public.products set price = 160000 where category = 'jeans';

-- borrar los espacios vacíos que no usaste
delete from public.products where status = 'soon' and price = 0 and cardinality(images) = 0;
```
Si borras productos por SQL, sus fotos se quedan en el bucket. Para que se borren también, elimínalos desde el panel.

## Agregar una categoría (p. ej. gorras)
1. En `src/config/catalog.config.ts`, agrégala a su línea: `{ id: "gorras", label: "Gorras", singular: "gorra" }`.
2. El `id` tiene que coincidir exacto (minúsculas, sin tildes) con `category` en la base. Si no coincide, el producto existe pero no aparece en ningún filtro y no sale ningún error.
3. No hace falta tocar la base, porque `category` es texto libre de hasta 40 caracteres. Haz deploy y ya sale en los filtros y en el panel con su **+**.
4. Opcional, para crear espacios vacíos:
   ```sql
   insert into public.products (line, category, name, edition, status, position)
   select 'streetwear', 'gorras', 'Gorra N°' || lpad(i::text, 2, '0'), 20, 'soon', i
   from generate_series(1, 4) as i;
   ```

## Cuenta regresiva del drop
Está comentada en `src/features/home/pages/HomePage.tsx` y `src/features/hero/components/Hero.tsx`. Para usarla de nuevo, descomenta esas líneas y ajusta `drop.date` en `src/config/site.config.ts`.

## Seguridad (lo que hace la migración)
- **`products`:** cualquiera puede leer, pero solo los usuarios en `admins` pueden insertar, editar o borrar (vía `is_admin()`).
- **`admins`:** cada usuario solo ve su propia fila y nadie puede agregarse a sí mismo.
- **`is_admin()`:** es `security definer`, la ejecuta solo `authenticated` y tiene `revoke` para `public` y `anon`.
- **Grants explícitos:** el proyecto no expone tablas nuevas automáticamente, así que los permisos se dan en la migración.
- **Bucket `products`:** público para lectura, máximo 2 MB por archivo, solo webp, jpeg o png. Solo los admins pueden hacer select, insert, update o delete sobre los objetos.

## Plan Free
- El proyecto **se pausa tras 7 días sin actividad**. Mientras está pausado el sitio no carga productos; se reactiva con un clic en el dashboard.
- Límites: 500 MB de base de datos, 1 GB de storage y 5 GB de egress al mes. Con fotos WebP de 1080×1350 caben miles.
- No incluye backups descargables. De vez en cuando, exporta `products` desde el Table Editor.

## Si algo falla
| Error | Causa probable |
|---|---|
| `permission denied for table products` | Falta un `grant` (la migración no corrió completa) |
| `new row violates row-level security policy` | Tu usuario no está en `admins` o la sesión expiró |
| Error al subir una foto | Pesa más de 2 MB, no es webp/jpeg/png o falta la política `select` del storage |
| El sitio sigue en modo demo | Faltan las variables o falta redeploy en Cloudflare Pages |
| La ruta del panel da 404 | `VITE_ADMIN_PATH` en Cloudflare distinto al que usas, o falta redeploy |
| No cargan productos | El proyecto está pausado (plan Free) |

## Por qué Supabase
- Es Postgres real con RLS: aunque la key pública esté en el front, solo los usuarios en `admins` pueden escribir.
- Storage con CDN para las fotos. Se comprimen a WebP 1080×1350 en el navegador antes de subir.
- El sitio público lee por REST con `fetch`, sin cargar `supabase-js`; el cliente completo solo se descarga en el panel.
