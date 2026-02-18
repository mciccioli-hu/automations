# Generador de Posteos

Aplicación para generar posts profesionales de Instagram.

## Funcionalidades

- **6 Templates**: Hero Overlay, Hero Minimal, Collage 2/3/4 fotos, Carrusel con Cover.
- **Formatos Instagram**: 1080x1080 (feed cuadrado), 1080x1350 (feed vertical), 1080x1920 (stories).
- **Branding**: Logo, colores primario/secundario, datos de contacto.
- **Caption + Hashtags**: Generación automática de caption sugerido y hashtags en español.
- **Preview en tiempo real**: Vista previa antes de generar las imágenes finales.
- **Export**: Descarga individual o múltiple para carruseles.

## Stack

- **Frontend**: Next.js 14 (App Router), React, TailwindCSS
- **Backend**: Next.js API Routes
- **Rendering**: Sharp (Node.js) con SVG para text rendering
- **DB**: PostgreSQL + Prisma ORM
- **Scraping**: ScrapingBee

## Instalación

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# 3. Generar Prisma client
npx prisma generate

# 4. Ejecutar migraciones (requiere PostgreSQL)
npx prisma migrate dev --name init

# 5. Seed de datos iniciales
npx prisma db seed

# 6. Iniciar en desarrollo
npm run dev
```

## Uso sin base de datos

La app funciona sin PostgreSQL para desarrollo. El scraping usa datos mock cuando no hay `SCRAPINGBEE_API_KEY`, y los templates se cargan desde código (no necesitan DB).

```bash
npm install
npm run dev
```

Abrí http://localhost:3000, pegá cualquier URL de Zonaprop y la app cargará datos demo.

## Estructura del Proyecto

```
src/
├── app/                          # Next.js App Router
│   ├── api/
│   │   ├── scrape/route.ts       # POST — scrapear URL
│   │   ├── templates/route.ts    # GET  — listar templates
│   │   ├── preview/route.ts      # POST — generar preview
│   │   └── export/route.ts       # POST — generar export final
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                  # Wizard principal (6 pasos)
├── components/
│   ├── Step1LinkInput.tsx        # Paso 1: Pegar link
│   ├── Step2PropertyData.tsx     # Paso 2: Editar datos
│   ├── Step3ImageSelection.tsx   # Paso 3: Seleccionar imágenes
│   ├── Step4TemplateSelection.tsx # Paso 4: Elegir template
│   ├── Step5Preview.tsx          # Paso 5: Preview + editar textos
│   ├── Step6Export.tsx           # Paso 6: Descargar
│   └── StepIndicator.tsx        # Barra de progreso
├── lib/
│   ├── templates/
│   │   ├── definitions/          # JSON de cada template
│   │   │   ├── hero-overlay.ts
│   │   │   ├── hero-minimal.ts
│   │   │   ├── collage-2.ts
│   │   │   ├── collage-3.ts
│   │   │   ├── collage-4.ts
│   │   │   └── carousel-cover.ts
│   │   └── registry.ts          # Registro central de templates
│   ├── rendering/
│   │   └── image-renderer.ts    # Motor de renderizado (Sharp)
│   ├── scraping/
│   │   └── scraper.ts           # Scraping con ScrapingBee
│   ├── utils/
│   │   └── caption-generator.ts # Generador de captions
│   ├── db.ts                    # Prisma client singleton
│   ├── types.ts                 # Server-side types
│   └── types-client.ts          # Client-side types
├── prisma/
│   ├── schema.prisma            # Schema de base de datos
│   └── seed.ts                  # Datos iniciales
└── docs/
    └── PRD.md                   # PRD completo con 9 entregables
```

## Agregar un nuevo template

1. Crear archivo en `src/lib/templates/definitions/mi-template.ts`
2. Exportar un objeto `TemplateDefinition` con los layers por formato
3. Importar y agregar al array en `src/lib/templates/registry.ts`
4. Listo — el template aparece automáticamente en el selector

## API Reference

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/scrape` | POST | Scrapear URL y devolver datos normalizados |
| `/api/templates` | GET | Listar templates disponibles |
| `/api/templates?id=X` | GET | Obtener template por ID |
| `/api/preview` | POST | Generar preview de baja resolución |
| `/api/export` | POST | Generar imágenes finales en alta calidad |

## Licencia

Privado — Uso interno.
