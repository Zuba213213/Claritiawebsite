# Fotos del sitio — claritia

Sube cada foto a esta carpeta **con el nombre exacto** de la tabla y aparece sola en el sitio
(no hay que tocar el HTML). Mientras el archivo no exista, el sitio muestra el placeholder.

Formato: **WebP**, sRGB, calidad ~80. Lado largo 1600–2000 px. Idealmente < 250 KB cada una.

| Archivo | Brief | Dónde aparece | Formato |
|---|---|---|---|
| `01-hero.webp` | Foto 01 | Hero (tarjeta junto al titular) | 4:5 vertical |
| `03-desde-casa.webp` | Foto 03 | "Desde donde estés" | 4:3 |
| `04-horario.webp` | Foto 04 | "En tu horario" | 4:5 |
| `05-privado.webp` | Foto 05 | "Privado" | 4:3 |
| `06-escribir.webp` | Foto 06 | Paso 1 | 4:3 |
| `07-agendar.webp` | Foto 07 | Paso 2 | 4:3 |
| `08-sesion.webp` | Foto 08 | Paso 3 (sin psicólogo en cuadro) | 4:3 |
| `09-cielo.webp` | Foto 09 | Fondo de la frase | 21:9 |
| `10-bodegon.webp` | Foto 10 | Sección de precio | 4:3 |
| `11-cierre.webp` | Foto 11 | Fondo del cierre | 16:9 |
| `f1-fundadora.webp` | Recomendación 6 | "Por qué existe claritia" | 4:5 |
| `v1-que-es.webp` | Póster Video 1 | "Qué es claritia" | 16:9 |
| `v2-como-funciona.webp` | Póster Video 2 | "Cómo funciona" | 16:9 |
| `v3-primera-sesion.webp` | Póster Video 3 | Arriba de Preguntas | 16:9 |
| `equipo/<slug>.webp` | Retratos equipo | Tarjetas de equipo (slug en `assets/claritia.js`) | 4:5 |

La Foto 02 (hero alterno) se guarda para la prueba A/B; la Foto 12 (vista previa al compartir)
reemplaza a `assets/og-claritia.jpg` (1200×630 px, < 300 KB para que WhatsApp la muestre).

Videos: se suben a YouTube (no listado) y su ID se pega en `CONFIG.videos` dentro de `assets/claritia.js`.
