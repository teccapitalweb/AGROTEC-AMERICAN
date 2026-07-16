# Fuentes locales — AgroTec America

Las fuentes se sirven **desde este repo**, no desde Google Fonts. El landing no hace
ninguna petición a `fonts.googleapis.com` ni a `fonts.gstatic.com` en runtime.

| Archivo | Familia | Peso | Uso |
|---|---|---|---|
| `bricolage-700.woff2` | Bricolage Grotesque | 700 | Títulos |
| `bricolage-800.woff2` | Bricolage Grotesque | 800 | Títulos (H1, H2) |
| `hanken-400.woff2` | Hanken Grotesk | 400 | Cuerpo |
| `hanken-600.woff2` | Hanken Grotesk | 600 | Cuerpo (énfasis) |
| `hanken-700.woff2` | Hanken Grotesk | 700 | Botones, etiquetas |

Total: ~120 KB. Subset **latin** únicamente.

## Licencia

Ambas familias son **SIL Open Font License 1.1** — uso comercial y self-hosting permitidos.
El texto completo está en `OFL-Bricolage-Grotesque.txt` y `OFL-Hanken-Grotesk.txt`.

## De dónde salieron

Descargadas del CDN de Google Fonts (subset latin, formato woff2) y verificadas
con su magic number `wOF2`. Para actualizarlas, pedir el CSS de Google Fonts con
un User-Agent moderno y bajar la URL `.woff2` del bloque `latin`.

## Cómo se declaran

En el `<head>` de `index.html`, vía `@font-face` con `font-display: swap`.
`bricolage-800` y `hanken-400` van además con `<link rel="preload">` por ser
las que pinta el hero.
