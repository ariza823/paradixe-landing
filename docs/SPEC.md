# PARADIXE_URBAN — Especificación de la landing

Landing de una sola página para la marca de streetwear PARADIXE_URBAN. Sirve de vitrina del drop actual, muestra una cuenta regresiva al lanzamiento y cierra la venta por WhatsApp. No hay carrito ni pagos en la web.

Versión: 0.1 · Fecha: 19 de octubre de 2026

---

## 1. Objetivo y alcance

Qué debe lograr la página:

- Que alguien que llega desde TikTok o IG entienda en 3 segundos qué es la marca.
- Mostrar las prendas del drop con foto, precio, numeración y tallas.
- Llevar al usuario a WhatsApp con un mensaje ya escrito (prenda + talla).
- Mostrar cuánto falta para el drop y, cuando llegue la fecha, cambiar a "Drop disponible".

Fuera de alcance en esta versión: carrito, pasarela de pago, login, panel de administración, base de datos. Todo el contenido vive en un archivo de configuración.

---

## 2. Stack

| Pieza | Elección | Motivo |
| --- | --- | --- |
| Build | Vite 5 | Arranque rápido, cero configuración |
| UI | React 18 | Lo que ya manejas |
| Lenguaje | TypeScript en modo `strict` | Tipos para productos y config |
| Estilos | CSS plano con variables (`global.css`) | Sitio pequeño; sin dependencias extra |
| Fuentes | Google Fonts | Gratis, cargan por CDN |
| Deploy | Vercel | Conectas el repo de GitHub y listo |

Sin librerías de UI, sin router (es una sola página con anclas `#drop`, `#como-comprar`).

---

## 3. Estructura de carpetas

```
paradixe-landing/
├─ index.html
├─ package.json
├─ tsconfig.json
├─ vite.config.ts
├─ public/
│  ├─ favicon.png            # la P cromada, 512×512
│  ├─ og-image.jpg           # 1200×630 para cuando compartan el link
│  └─ products/              # fotos de producto, 4:5 (1080×1350)
│     ├─ hoodie-cielo.jpg
│     └─ ...
└─ src/
   ├─ main.tsx
   ├─ App.tsx
   ├─ config.ts              # TODO el contenido editable
   ├─ types.ts
   ├─ hooks/
   │  └─ useCountdown.ts
   ├─ utils/
   │  └─ whatsapp.ts
   ├─ components/
   │  ├─ Header.tsx
   │  ├─ Hero.tsx
   │  ├─ Logo.tsx
   │  ├─ BarbedWire.tsx      # SVG del alambre
   │  ├─ Countdown.tsx
   │  ├─ DropGrid.tsx
   │  ├─ ProductCard.tsx
   │  ├─ HowToBuy.tsx
   │  ├─ Faq.tsx
   │  └─ Footer.tsx
   └─ styles/
      └─ global.css
```

Regla: los componentes no tienen textos de negocio quemados (precios, número, fechas). Todo sale de `config.ts`.

---

## 4. Identidad visual

### 4.1 Colores (tokens CSS en `:root`)

| Token | Hex | Uso |
| --- | --- | --- |
| `--bg` | `#100A1C` | Fondo general |
| `--bg-soft` | `#1A1230` | Tarjetas, secciones alternas |
| `--line` | `#4A3A6A` | Bordes, separadores punteados |
| `--text` | `#E9E2FF` | Texto principal |
| `--text-muted` | `#B9A7E6` | Texto secundario |
| `--sky` | `#8EC5EE` | Pastilla "Urban", botones principales |
| `--lilac` | `#B08BD8` | Alambre, bordes, brillos |
| `--deep` | `#4A2A7A` | Última capa del cromado |
| `--gold` | `#D9A441` | Numeración N°, detalles |
| `--green` | `#4FB848` | Botón de WhatsApp, estado "disponible" |

Contraste: texto `--text` sobre `--bg` pasa AA de sobra. El texto oscuro (`--bg`) sobre `--sky` también pasa. No pongas `--text-muted` en tamaños menores a 14 px.

### 4.2 Tipografías

| Rol | Fuente | Dónde |
| --- | --- | --- |
| Logo script | Monsieur La Doulaise | Solo "Paradixe" en el logo |
| Gótica | UnifrakturCook 700 | "Urban", títulos de sección |
| Texto | Space Mono 400/700 | Todo lo demás, botones, precios |

Escala (desktop → móvil):

| Elemento | Desktop | Móvil |
| --- | --- | --- |
| Logo "Paradixe" | 220 px | `clamp(96px, 26vw, 220px)` |
| Pastilla "Urban" | 56 px | 32 px |
| Título de sección (gótica) | 56 px | 36 px |
| Cuerpo | 16 px | 15 px |
| Etiquetas / metadatos | 13 px, `letter-spacing: 3px`, mayúsculas | igual |

### 4.3 Efectos de marca

Cromado del logo (copiar tal cual):

```css
.logo-script {
  font-family: 'Monsieur La Doulaise', cursive;
  color: var(--text);
  -webkit-text-stroke: 2px #fff;
  text-shadow:
    0 -2px 0 #fff,
    0 3px 0 var(--sky),
    0 6px 0 var(--lilac),
    0 9px 0 var(--deep),
    0 0 40px rgba(142, 197, 238, 0.45);
}
```

Pastilla "Urban": fondo `--sky`, texto `--bg`, `border-radius: 999px`, `transform: rotate(-3deg)`.

Grano de fondo: overlay fijo con ruido SVG al 14% de opacidad, `pointer-events: none`, encima del fondo y debajo del contenido.

```css
body::before {
  content: '';
  position: fixed;
  inset: 0;
  opacity: 0.14;
  pointer-events: none;
  z-index: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E");
}
```

Alambre (componente `BarbedWire`): SVG `viewBox="0 0 900 120"`, trazo `--lilac` de 3 px, decorativo (`aria-hidden="true"`):

```
M20 60 C 120 10, 200 110, 300 60 S 480 10, 450 60 S 600 110, 700 60 S 820 10, 880 60
púas: M60 52 l 10 -16 M140 44 l 8 -18 M240 82 l 10 16 M560 82 l 10 16 M660 44 l 8 -18 M780 52 l 10 -16
```

Separadores entre secciones: `border-top: 1px dashed var(--line)`.

Nada de degradados de fondo, emojis ni sombras suaves tipo tarjeta genérica. La vibra es oscura, con grano y detalles de etiqueta de prenda.

---

## 5. Secciones (en orden)

### 5.1 Header (fijo arriba)

- Izquierda: "P" en script cromado (40 px), enlaza a `#top`.
- Derecha: enlaces "Drop" (`#drop`), "Cómo comprar" (`#como-comprar`) y botón verde "WhatsApp".
- Fondo `--bg` con 85% de opacidad y `backdrop-filter: blur(8px)`.
- Móvil (< 640 px): solo la P y el botón de WhatsApp; los enlaces se ocultan.

### 5.2 Hero

- Altura mínima `100svh`, contenido centrado.
- Arriba, texto de etiqueta en `--text-muted`: "DEPT. OF PARADISE ®" a la izquierda y "SS/26 — BOG, CO" a la derecha (en móvil se apilan centrados).
- Centro: `BarbedWire` detrás del logo, "Paradixe" cromado, pastilla "Urban" debajo.
- Debajo: `Countdown`.
- CTA principal: botón `--sky` "Ver el drop" → `#drop`. CTA secundario (borde verde): "Avísame por WhatsApp" → abre WhatsApp con el mensaje de lista de espera.

### 5.3 Countdown

- Muestra días, horas, minutos y segundos hasta `config.drop.date`.
- Cada bloque: número en Space Mono 700 de 48 px (32 px en móvil), etiqueta debajo en 12 px mayúsculas.
- Cuando la fecha pasa: reemplazar por la pastilla verde "DROP 01 DISPONIBLE".
- El contenedor lleva `aria-live="polite"` pero solo anuncia el cambio de estado, no cada segundo (el número va dentro de un elemento con `aria-hidden="true"` y hay un texto oculto que dice "Faltan X días").

### 5.4 Drop (`#drop`)

- Título en gótica: "Drop 01". Subtítulo: "Piezas numeradas. Cuando se acaban, no vuelven."
- Grid: `repeat(auto-fill, minmax(260px, 1fr))`, `gap: 24px`, máximo 1200 px de ancho.
- Una `ProductCard` por producto de `config.products`.

### 5.5 ProductCard

- Foto 4:5 con `object-fit: cover`, `loading="lazy"`, `alt` con el nombre de la prenda. Si la imagen falla, mostrar un recuadro `--bg-soft` con la palabra "FOTO".
- Esquina superior: etiqueta dorada con la numeración, ej. "N°/030".
- Nombre (Space Mono 700, 18 px), color/variante en `--text-muted`.
- Precio formateado en pesos colombianos con `Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })`.
- Selector de talla: botones tipo pastilla (`<button aria-pressed>`), una sola talla activa. Tallas agotadas se ven tachadas y `disabled`.
- Botón verde "Pedir por WhatsApp": deshabilitado hasta elegir talla; al hacer clic abre WhatsApp con el mensaje del producto.
- Estados del producto: `available`, `soon` (botón dice "Sale el día del drop", deshabilitado), `sold_out` (sello "AGOTADO" rotado sobre la foto, sin botón).

### 5.6 Cómo comprar (`#como-comprar`)

Tres pasos en fila (columna en móvil), numerados 01, 02, 03 en dorado:

1. Elige tu prenda y talla.
2. Escríbenos por WhatsApp; te confirmamos disponibilidad.
3. Pagas (Nequi, Daviplata, Bre-B o link de pago) y te la enviamos.

Debajo, una línea con envíos: texto sacado de `config.shipping`.

### 5.7 FAQ

Lista de `<details>` / `<summary>` (accesible sin JS). Preguntas desde `config.faq`. Sugeridas: tallas y medidas, tiempos de envío, cambios, si habrá reposición.

### 5.8 Footer

- Logo pequeño (script + pastilla).
- Enlaces a Instagram y TikTok (iconos SVG de trazo con `aria-label`).
- "© 2026 Paradixe Urban · Bogotá".

---

## 6. Datos y tipos

### 6.1 `types.ts`

```ts
export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL'

export type ProductStatus = 'available' | 'soon' | 'sold_out'

export interface Product {
  id: string            // 'hoodie-cielo'
  name: string          // 'Hoodie Cielo'
  variant?: string      // 'Negro / estampado lila'
  price: number         // en COP, sin puntos: 180000
  image: string         // '/products/hoodie-cielo.jpg'
  edition: number       // total de unidades: 30
  sizes: Size[]
  soldOutSizes?: Size[]
  status: ProductStatus
}

export interface SiteConfig {
  brand: { name: string; handle: string; city: string }
  whatsapp: { number: string; waitlistMessage: string }
  drop: { name: string; date: string }  // ISO con zona: '2026-11-15T19:00:00-05:00'
  social: { instagram: string; tiktok: string }
  shipping: string
  products: Product[]
  faq: { q: string; a: string }[]
}
```

### 6.2 `config.ts` (ejemplo; los valores entre corchetes los llenas tú)

```ts
import type { SiteConfig } from './types'

export const config: SiteConfig = {
  brand: { name: 'Paradixe Urban', handle: '@paradixe_urban', city: 'Bogotá' },
  whatsapp: {
    number: '57XXXXXXXXXX', // código país + número, sin + ni espacios
    waitlistMessage: 'Hola Paradixe, quiero que me avisen del Drop 01.',
  },
  drop: { name: 'Drop 01', date: '2026-11-15T19:00:00-05:00' },
  social: {
    instagram: 'https://instagram.com/paradixe_urban',
    tiktok: 'https://tiktok.com/@paradixe_urban',
  },
  shipping: 'Envíos en Bogotá en [X] días y a todo Colombia en [X] días.',
  products: [
    {
      id: 'hoodie-cielo',
      name: '[Nombre prenda]',
      variant: '[Color / estampado]',
      price: 0, // [PRECIO]
      image: '/products/hoodie-cielo.jpg',
      edition: 30,
      sizes: ['S', 'M', 'L', 'XL'],
      status: 'soon',
    },
  ],
  faq: [
    { q: '¿Cómo sé mi talla?', a: '[Medidas en cm de ancho y largo por talla]' },
  ],
}
```

---

## 7. Lógica

### 7.1 `utils/whatsapp.ts`

```ts
export function buildWhatsAppUrl(number: string, message: string): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}

export function productMessage(p: { name: string; variant?: string }, size: string): string {
  const variant = p.variant ? ` (${p.variant})` : ''
  return `Hola Paradixe, quiero la ${p.name}${variant} en talla ${size}. ¿Está disponible?`
}
```

Los enlaces de WhatsApp abren con `target="_blank" rel="noopener noreferrer"`.

### 7.2 `hooks/useCountdown.ts`

- Recibe la fecha objetivo (string ISO).
- Devuelve `{ days, hours, minutes, seconds, isOver }`.
- Usa `setInterval` de 1000 ms dentro de `useEffect` y lo limpia en el `return` (si no, en StrictMode se duplican intervalos).
- Calcula siempre desde `Date.now()`, no restando 1 en cada tick (así no se desfasa si la pestaña se duerme).
- Cuando `isOver` es `true`, detiene el intervalo.

### 7.3 Estado de la ProductCard

- `useState<Size | null>(null)` para la talla elegida.
- El botón de pedido se arma con `buildWhatsAppUrl(config.whatsapp.number, productMessage(product, size))`.
- Si el drop no ha llegado (`isOver === false`) y el producto está en `soon`, el botón queda deshabilitado aunque haya talla.

---

## 8. Responsive

| Breakpoint | Cambios |
| --- | --- |
| ≥ 1024 px | Grid de 3 o 4 columnas, pasos de "Cómo comprar" en fila |
| 640–1023 px | Grid de 2 columnas |
| < 640 px | 1 columna, header reducido, textos de etiqueta del hero apilados, logo con `clamp` |

Padding lateral: 16 px en móvil, 48 px en desktop. Nada de scroll horizontal; revisar en 360 px de ancho.

---

## 9. Accesibilidad

- Un solo `<h1>` (el logo, con texto real "Paradixe Urban"; la pastilla visual puede ir `aria-hidden` si el h1 ya dice todo).
- Todos los botones son `<button>` o `<a href>` reales; nada de `onClick` en `div`.
- Selector de tallas con `aria-pressed` y un `aria-label` en el grupo ("Elige tu talla").
- Foco visible: `outline: 2px solid var(--sky); outline-offset: 3px`.
- Áreas táctiles de mínimo 44×44 px.
- Respetar `prefers-reduced-motion`: sin animaciones de entrada ni rotaciones animadas.

---

## 10. SEO y compartir

- `<title>`: "Paradixe Urban — Streetwear underground · Bogotá".
- `<meta name="description">` de máximo 155 caracteres.
- Open Graph: `og:title`, `og:description`, `og:image` (`/og-image.jpg`, 1200×630), `og:url`.
- `lang="es"` en `<html>`.
- Favicon con la P cromada.

---

## 11. Rendimiento

- Fotos de producto en JPG/WebP, máximo 200 KB cada una, 1080×1350.
- `loading="lazy"` en todas las imágenes menos las del hero.
- Fuentes con `display=swap` y `preconnect`.
- Meta: Lighthouse ≥ 90 en Performance y Accessibility en móvil.

---

## 12. Deploy

1. `npm create vite@latest paradixe-landing -- --template react-ts`
2. Copiar la estructura de la sección 3.
3. `npm run dev` para trabajar local.
4. Subir a GitHub (repo `paradixe-landing` en tu cuenta).
5. En Vercel: Import Project → elegir el repo → framework Vite (lo detecta solo) → Deploy.
6. Opcional: dominio propio (ej. `paradixeurban.com`) desde la configuración de dominios de Vercel.
7. Poner el link en la bio de IG y TikTok.

---

## 13. Checklist de entrega

- [ ] `config.ts` con número de WhatsApp real, fecha del drop, precios y fotos.
- [ ] Fotos en `public/products/` con los nombres que usa la config.
- [ ] El mensaje de WhatsApp llega con prenda y talla correctas (probarlo desde el celular).
- [ ] La cuenta regresiva cambia a "DROP 01 DISPONIBLE" al pasar la fecha (probar poniendo una fecha de hace 1 minuto).
- [ ] Sin scroll horizontal en 360 px.
- [ ] Navegable solo con teclado (Tab llega a tallas y botones).
- [ ] `og-image` se ve bien al compartir el link por WhatsApp.
- [ ] Lighthouse móvil ≥ 90.

---

## 14. Siguientes versiones (no ahora)

- Captura de correos para lista de espera (Formspree o una función serverless).
- Galería de clientes con fotos etiquetadas.
- Tienda con carrito y pasarela (Wompi, Bold o Shopify headless).
