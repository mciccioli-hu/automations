# PRD — Generador de Posteos para Redes Sociales (Inmobiliarias)

## 1. PRD Breve

### Problema
Los agentes inmobiliarios pierden tiempo creando manualmente piezas visuales para redes sociales a partir de sus publicaciones en portales (Zonaprop, Mercado Libre, Argenprop). Cada post requiere descargar fotos, abrir Canva, armar layouts, aplicar branding y exportar. Esto toma 15-30 minutos por propiedad.

### Objetivos
- **O1**: Permitir generar un post listo para Instagram en < 60 segundos desde que se pega un link.
- **O2**: Mantener consistencia de marca (logo, colores, tipografía) automáticamente.
- **O3**: Ofrecer un sistema de templates escalable donde agregar nuevos diseños sea trivial (solo JSON + assets).
- **O4**: Soportar multi-tenant: cada inmobiliaria ve solo sus assets y usa su propia marca.

### No-Objetivos (fuera de MVP)
- Publicación automática en Instagram/Facebook.
- Editor de imágenes avanzado (filtros, retoques).
- Generación de video/reels.
- Integración con CRM inmobiliario.
- Templates editables por el usuario final (solo selección).

### Métricas de Éxito
| Métrica | Target MVP |
|---------|-----------|
| Tiempo pegar-link → descarga | < 60 seg |
| Templates disponibles | ≥ 5 |
| Formatos soportados | 1080x1080, 1080x1350, 1080x1920 |
| Tasa de error en scraping | < 10% |
| Satisfacción usuario (NPS) | > 7/10 |

---

## 2. User Stories + User Flow

### User Stories

| ID | Como... | Quiero... | Para... | Prioridad |
|----|---------|-----------|---------|-----------|
| US-01 | Agente inmobiliario | Pegar un link de Zonaprop y obtener fotos+datos automáticamente | No tener que cargar datos manualmente | Must |
| US-02 | Agente | Editar/completar datos que falten o estén mal | Asegurar que el post tenga info correcta | Must |
| US-03 | Agente | Elegir un template visual para mi post | Que se vea profesional sin saber diseño | Must |
| US-04 | Agente | Seleccionar y reordenar las fotos que quiero usar | Mostrar las mejores fotos en el orden correcto | Must |
| US-05 | Agente | Ver un preview en tiempo real del post | Validar antes de generar | Must |
| US-06 | Agente | Descargar las imágenes finales listas para IG | Publicarlas directamente | Must |
| US-07 | Agente | Obtener un caption sugerido con hashtags | Ahorrar tiempo escribiendo la descripción | Should |
| US-08 | Admin de inmobiliaria | Configurar logo, colores y datos de contacto | Que todos los posts tengan branding consistente | Must |
| US-09 | Agente | Descargar un ZIP con todas las piezas del carrusel | Subir todo junto a Instagram | Should |

### User Flow Detallado

```
[PASO 1] Pegar Link
  → Usuario pega URL (ej: zonaprop.com.ar/propiedades/...)
  → Click "Obtener datos"
  → Loading spinner (2-5 seg)
  → Backend: scraping → normalización → respuesta

[PASO 2] Revisar/Editar Datos
  → Se muestran datos extraídos en formulario editable
  → Campos: operación, tipo, precio, moneda, ubicación, ambientes, m2, amenities
  → Galería de imágenes extraídas (thumbnails)
  → Usuario corrige lo que haga falta
  → Click "Continuar"

[PASO 3] Seleccionar Imágenes
  → Grid de todas las imágenes extraídas
  → Checkboxes para seleccionar (mín según template)
  → Drag & drop para reordenar
  → Click "Continuar"

[PASO 4] Elegir Template + Formato
  → Grid de templates disponibles (preview thumbnail)
  → Cada template muestra: nombre, cantidad de fotos, formatos disponibles
  → Selector de formato: 1080x1080 / 1080x1350 / 1080x1920
  → Click en template para seleccionar
  → Click "Continuar al editor"

[PASO 5] Editor / Preview
  → Vista previa del post generado con los datos + imágenes + branding
  → Panel lateral: editar textos (título, precio, ubicación, features, CTA)
  → Si carrusel: vista de cada slide con navegación
  → Ajuste de encuadre por imagen (pan/zoom)
  → Preview actualiza en tiempo real
  → Click "Generar post"

[PASO 6] Exportar / Descargar
  → Loading: generando imágenes finales en alta calidad
  → Preview de resultado final
  → Botones: "Descargar imagen" / "Descargar ZIP" (si carrusel)
  → Caption sugerido + hashtags (copiable)
  → Botón "Crear otro post" para volver al paso 1
```

---

## 3. Wireframes Textuales

### Pantalla 1: Pegar Link
```
┌─────────────────────────────────────────────────┐
│  🏠 Generador de Posteos                        │
│                                                  │
│  Pegá el link de la publicación:                │
│  ┌──────────────────────────────────────┐       │
│  │ https://zonaprop.com.ar/...          │       │
│  └──────────────────────────────────────┘       │
│                                                  │
│  Portales soportados: Zonaprop • ML • Argenprop │
│                                                  │
│         [ 🔍 Obtener datos ]                    │
│                                                  │
│  ⚠️ Asegurate de tener derecho a usar las       │
│     imágenes de la publicación.                  │
└─────────────────────────────────────────────────┘
```

### Pantalla 2: Selección de Imágenes + Datos
```
┌──────────────────────────────────────────────────────────┐
│  ← Volver    Paso 2 de 6: Datos e imágenes               │
│                                                           │
│  ┌─ DATOS DE LA PROPIEDAD ────────────────────────────┐  │
│  │ Operación: [Venta ▼]  Tipo: [Departamento ▼]      │  │
│  │ Precio: [195000] Moneda: [USD ▼] Expensas: [____] │  │
│  │ Barrio: [Palermo]  Ciudad: [CABA]                  │  │
│  │ Ambientes: [2] Dormitorios: [1] Baños: [1]        │  │
│  │ M² totales: [55] M² cubiertos: [48]               │  │
│  │ Amenities: [SUM, Pileta, Gym]                      │  │
│  └────────────────────────────────────────────────────┘  │
│                                                           │
│  ┌─ IMÁGENES (12 encontradas) ────────────────────────┐  │
│  │ ☑ [img1] ☑ [img2] ☑ [img3] ☐ [img4]              │  │
│  │ ☐ [img5] ☐ [img6] ☐ [img7] ☐ [img8]              │  │
│  │ ☐ [img9] ☐ [img10] ☐ [img11] ☐ [img12]           │  │
│  │                                                     │  │
│  │ 💡 Arrastrá para reordenar. Seleccioná al menos 1. │  │
│  └────────────────────────────────────────────────────┘  │
│                                                           │
│                        [ Continuar → ]                    │
└──────────────────────────────────────────────────────────┘
```

### Pantalla 3: Selección de Template
```
┌──────────────────────────────────────────────────────────┐
│  ← Volver    Paso 3 de 6: Elegí un template              │
│                                                           │
│  Formato: ( • 1080x1080 ) ( 1080x1350 ) ( 1080x1920 )  │
│                                                           │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐              │
│  │           │ │           │ │           │              │
│  │  HERO     │ │ COLLAGE   │ │ COLLAGE   │              │
│  │  1 foto   │ │ 2 fotos   │ │ 3 fotos   │              │
│  │           │ │           │ │           │              │
│  │ [preview] │ │ [preview] │ │ [preview] │              │
│  │           │ │           │ │           │              │
│  └───────────┘ └───────────┘ └───────────┘              │
│                                                           │
│  ┌───────────┐ ┌───────────┐                             │
│  │           │ │           │                             │
│  │ COLLAGE   │ │ CARRUSEL  │                             │
│  │ 4 fotos   │ │ Cover+N   │                             │
│  │           │ │           │                             │
│  │ [preview] │ │ [preview] │                             │
│  │           │ │           │                             │
│  └───────────┘ └───────────┘                             │
│                                                           │
│                        [ Continuar → ]                    │
└──────────────────────────────────────────────────────────┘
```

### Pantalla 4: Editor / Preview
```
┌──────────────────────────────────────────────────────────────────┐
│  ← Volver    Paso 4 de 6: Personalizá tu post                    │
│                                                                   │
│  ┌─ PREVIEW ──────────────────┐  ┌─ EDITAR ──────────────────┐  │
│  │                             │  │                            │  │
│  │  ┌───────────────────────┐  │  │ Título:                    │  │
│  │  │                       │  │  │ [Depto 2 amb en Palermo]   │  │
│  │  │      [IMAGEN]         │  │  │                            │  │
│  │  │                       │  │  │ Precio:                    │  │
│  │  │                       │  │  │ [USD 195.000]              │  │
│  │  │  ┌──────────────────┐ │  │  │                            │  │
│  │  │  │ DEPTO 2 AMB      │ │  │  │ Ubicación:                │  │
│  │  │  │ Palermo, CABA    │ │  │  │ [Palermo, CABA]           │  │
│  │  │  │ USD 195.000      │ │  │  │                            │  │
│  │  │  │ 2 amb • 55m²     │ │  │  │ Features:                 │  │
│  │  │  │                  │ │  │  │ [2 amb • 55 m² • balcón]  │  │
│  │  │  │  [LOGO]          │ │  │  │                            │  │
│  │  │  └──────────────────┘ │  │  │ CTA:                       │  │
│  │  └───────────────────────┘  │  │ [Consultá por WhatsApp]    │  │
│  │                             │  │                            │  │
│  │  Si carrusel:               │  │ Encuadre imagen:           │  │
│  │  [1] [2] [3] [4]  slides   │  │ [Pan/Zoom control]         │  │
│  └─────────────────────────────┘  └────────────────────────────┘  │
│                                                                   │
│                        [ Generar Post → ]                         │
└──────────────────────────────────────────────────────────────────┘
```

### Pantalla 5: Export / Download
```
┌──────────────────────────────────────────────────────────┐
│  ✅ ¡Tu post está listo!                                  │
│                                                           │
│  ┌─ PREVIEW FINAL ────────────────────────────────────┐  │
│  │                                                     │  │
│  │  [Imagen final renderizada]                         │  │
│  │                                                     │  │
│  │  Si carrusel: [1] [2] [3] [4] navegación           │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                           │
│  [ ⬇ Descargar imagen ] [ ⬇ Descargar ZIP ]             │
│                                                           │
│  ┌─ CAPTION SUGERIDO ─────────────────────────────────┐  │
│  │ 🏠 Depto 2 amb en Palermo                          │  │
│  │ 💰 USD 195.000                                      │  │
│  │ 📍 Palermo, CABA                                    │  │
│  │ ✨ 2 ambientes • 55 m² • Balcón • Amenities        │  │
│  │                                                     │  │
│  │ Consultá por WhatsApp: wa.me/541112345678           │  │
│  │                                                     │  │
│  │ #departamento #palermo #venta #inmobiliaria         │  │
│  │ #propiedades #realestate #buenosaires               │  │
│  │                                                     │  │
│  │                              [ 📋 Copiar caption ]  │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                           │
│  [ 🔄 Crear otro post ]  [ 📝 Editar este post ]         │
└──────────────────────────────────────────────────────────┘
```

---

## 4. Template System

### JSON Schema para Templates

Ver archivo: `/src/lib/templates/template-schema.ts`

Cada template se define como un archivo JSON con:
- Metadata (id, nombre, descripción, thumbnail)
- Canvas size (width x height)
- Layers ordenados por z-index: imágenes, rectángulos de fondo, textos, logos
- Safe areas para Instagram
- Variantes por formato (1080x1080, 1080x1350, 1080x1920)

### Versionado de Templates
- Cada template tiene `version: string` (semver)
- Los drafts/exports guardan `templateId + templateVersion`
- Si se actualiza un template, los exports existentes no cambian
- Nuevas versiones no rompen exports previos

### Templates Incluidos (MVP)

1. **hero-overlay** — 1 foto grande con overlay degradado + datos
2. **collage-2** — 2 fotos lado a lado + barra inferior de datos
3. **collage-3** — 1 foto grande arriba + 2 chicas abajo
4. **collage-4** — Grid 2x2 de fotos + overlay central
5. **carousel-cover** — Slide 1 (cover con foto+datos) + slides 2-N (fotos individuales)

Ver archivos JSON en: `/src/lib/templates/definitions/`

---

## 5. Arquitectura Técnica

### Stack
- **Frontend**: Next.js 14 (App Router), React, TailwindCSS, DnD Kit
- **Backend**: Next.js API Routes (Route Handlers)
- **Rendering**: Sharp (Node.js) para composición de imágenes + SVG para text rendering
- **DB**: PostgreSQL + Prisma ORM
- **Storage**: S3-compatible (presigned URLs para download)
- **Scraping**: ScrapingBee (existente)

### Pipeline
```
[1. Scrape]     URL → ScrapingBee → HTML → Parser → PropertyPostInput
     ↓
[2. Normalize]  Limpiar datos, inferir campos, validar
     ↓
[3. Download]   Descargar imágenes a S3/cache (parallel, con retry)
     ↓
[4. User Edit]  Frontend: editar datos + seleccionar imágenes + elegir template
     ↓
[5. Compose]    Backend: Sharp pipeline → resize/crop imágenes + overlay textos + logo
     ↓
[6. Export]     Guardar resultado en S3 → generar presigned URL → servir al usuario
```

### Decisión de Rendering: Sharp vs Puppeteer

| Criterio | Sharp/Canvas | Puppeteer |
|----------|-------------|-----------|
| Velocidad | ✅ Muy rápido (~200ms) | ❌ Lento (~2-5s) |
| Calidad | ✅ Excelente | ✅ Excelente |
| Memoria | ✅ Bajo | ❌ Alto (Chrome) |
| Tipografía | ⚠️ Requiere SVG/registrar fuentes | ✅ Nativo CSS |
| Complejidad | ⚠️ Más código para layouts | ✅ HTML/CSS familiar |
| Deploy | ✅ Simple | ❌ Necesita Chrome |
| Escalabilidad | ✅ Buena | ❌ Limitada |

**Decisión: Sharp** con text rendering via SVG embebido. Razón: velocidad es prioridad #1, y el rendering es suficientemente simple para no necesitar CSS layout.

---

## 6. APIs / Endpoints

### POST /api/scrape
Scrapea y normaliza datos de una URL.

**Request:**
```json
{ "url": "https://zonaprop.com.ar/propiedades/..." }
```

**Response:**
```json
{
  "success": true,
  "data": {
    "images": [{ "url": "...", "width": 1024, "height": 768 }],
    "property": { "operation": "venta", "propertyType": "Departamento", ... },
    "source": { "portal": "zonaprop", "scrapedAt": "2025-..." }
  }
}
```

### GET /api/templates
Lista templates disponibles.

**Response:**
```json
{
  "templates": [
    {
      "id": "hero-overlay",
      "name": "Hero con overlay",
      "description": "1 foto grande con datos superpuestos",
      "thumbnail": "/templates/hero-overlay-thumb.png",
      "imageCount": 1,
      "supportedFormats": ["1080x1080", "1080x1350", "1080x1920"]
    }
  ]
}
```

### POST /api/preview
Genera preview de baja resolución.

**Request:**
```json
{
  "templateId": "hero-overlay",
  "format": "1080x1080",
  "images": [{ "url": "...", "cropData": { "x": 0, "y": 0, "w": 1, "h": 1 } }],
  "texts": { "title": "...", "price": "...", "location": "...", "features": "...", "cta": "..." },
  "brand": { "logoUrl": "...", "primaryColor": "#1a365d", ... }
}
```

**Response:**
```json
{
  "previewUrl": "data:image/jpeg;base64,...",
  "slides": ["data:image/jpeg;base64,..."]
}
```

### POST /api/export
Genera imágenes finales en alta calidad.

**Request:** (mismo schema que /api/preview + `projectId`)

**Response:**
```json
{
  "exportId": "exp_...",
  "files": [
    { "name": "post-slide-1.png", "url": "/api/download/exp_.../1", "size": 524288 }
  ],
  "zipUrl": "/api/download/exp_.../zip",
  "caption": "🏠 Depto 2 amb en Palermo\n💰 USD 195.000\n...",
  "hashtags": "#departamento #palermo #venta ..."
}
```

### GET /api/download/:exportId/:fileIndex
Descarga archivo individual o ZIP.

---

## 7. Modelo de Datos

### Tablas principales (Prisma)

```prisma
model Agency {
  id              String   @id @default(cuid())
  name            String
  logoUrl         String?
  primaryColor    String   @default("#1a365d")
  secondaryColor  String   @default("#e2e8f0")
  fontFamily      String   @default("Inter")
  instagramHandle String?
  whatsapp        String?
  website         String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  users           User[]
  projects        PostProject[]
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  agencyId  String
  agency    Agency   @relation(fields: [agencyId], references: [id])
  projects  PostProject[]
}

model PostProject {
  id            String    @id @default(cuid())
  userId        String
  agencyId      String
  listingUrl    String
  propertyData  Json      // PropertyPostInput normalizado
  selectedImages Json     // [{ url, order, cropData }]
  templateId    String
  templateVersion String
  format        String    // "1080x1080" | "1080x1350" | "1080x1920"
  customTexts   Json      // { title, price, location, features, cta }
  status        String    @default("draft") // draft | exported
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  user          User      @relation(fields: [userId], references: [id])
  agency        Agency    @relation(fields: [agencyId], references: [id])
  exports       Export[]
}

model Export {
  id          String   @id @default(cuid())
  projectId   String
  files       Json     // [{ key, name, size, format }]
  caption     String?
  hashtags    String?
  createdAt   DateTime @default(now())
  project     PostProject @relation(fields: [projectId], references: [id])
}

model Template {
  id          String   @id
  version     String
  name        String
  description String
  category    String   // "hero" | "collage" | "carousel"
  imageCount  Int
  definition  Json     // Full template JSON
  thumbnail   String?
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

---

## 8. Edge Cases y Validaciones

| Caso | Manejo |
|------|--------|
| URL no soportada / inválida | Mostrar error claro: "Portal no soportado. Probá con Zonaprop, ML o Argenprop." |
| Scraping falla (timeout, 403) | Retry 1 vez. Si falla, ofrecer carga manual de datos e imágenes. |
| Sin precio en publicación | Campo en blanco. Permitir que el usuario lo complete o dejarlo vacío (template muestra "Consultar precio"). |
| Sin barrio/ubicación | Marcar como requerido en UI. Si no se completa, usar "Ubicación a confirmar". |
| Pocas imágenes para template | Deshabilitar templates que requieren más fotos que las disponibles. |
| Imágenes muy chicas (< 500px) | Advertencia de calidad. Permitir uso pero avisar que puede verse pixelado. |
| Imagen falla al descargar | Marcarla como "no disponible" en galería. Permitir continuar con las demás. |
| Imágenes duplicadas | Detectar duplicados por URL. Mostrar solo únicos. |
| Logo no configurado | Usar espacio de logo vacío o mostrar nombre de inmobiliaria como texto. |
| Texto muy largo para placeholder | Truncar con "..." respetando tamaño máximo. Preview muestra resultado real. |
| Formato no soportado por template | Deshabilitar selector de formato para ese template. |
| Usuario sin agencia configurada | Redirigir a configuración de marca antes de crear post. |
| Export concurrente pesado | Cola de jobs (en futuro). MVP: procesar en-request con timeout de 30s. |

---

## 9. Checklist de Aceptación + Roadmap

### Criterios de Aceptación MVP

- [ ] Puedo pegar un link de Zonaprop y obtener fotos + datos en < 5 seg.
- [ ] Puedo editar/completar datos faltantes en un formulario claro.
- [ ] Puedo ver todas las imágenes extraídas y seleccionar cuáles usar.
- [ ] Puedo reordenar imágenes con drag & drop.
- [ ] Puedo elegir entre al menos 5 templates.
- [ ] Puedo elegir formato (1080x1080, 1080x1350, 1080x1920).
- [ ] Puedo ver un preview antes de generar.
- [ ] Puedo editar textos (título, precio, ubicación, features, CTA) y ver cambios en preview.
- [ ] El post generado incluye logo + colores de mi inmobiliaria.
- [ ] Puedo descargar la imagen final en alta calidad (PNG).
- [ ] Si es carrusel, puedo descargar ZIP con todas las slides.
- [ ] Se genera un caption sugerido + hashtags copiables.
- [ ] El flujo completo toma < 60 segundos para un usuario que no edita nada.
- [ ] Cada inmobiliaria solo ve sus propios posts y marca.
- [ ] Las imágenes exportadas tienen buena calidad (sin pixelado visible en IG).
- [ ] Los textos son legibles (buen contraste sobre las imágenes).
- [ ] Hay safe areas respetadas (no se tapa contenido con UI de IG).

### Roadmap Sugerido

**V1 (MVP)** — Este entregable
- Scraping Zonaprop
- 5 templates (hero, collage 2/3/4, carrusel)
- Formatos 1080x1080 y 1080x1350
- Export PNG + ZIP
- Caption + hashtags
- Branding básico (logo + color primario)

**V1.1**
- Soporte Mercado Libre y Argenprop
- Formato stories 1080x1920
- Crop/zoom por imagen en preview
- Más templates (8-10)

**V2**
- Historial de posts generados
- Templates favoritos
- Carga manual de propiedad (sin link)
- Paleta de colores secundarios en templates
- Compartir directo a Instagram (API Graph)

**V3**
- Editor de templates para admins
- Generación de video/reels
- A/B testing de diseños
- Integración CRM (Tokko, Apinmo)
