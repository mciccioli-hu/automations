import sharp from 'sharp';
import {
  TemplateDefinition,
  TemplateSlide,
  TemplatePlaceholder,
  ImagePlaceholder,
  TextPlaceholder,
  ShapePlaceholder,
  LogoPlaceholder,
  CanvasFormat,
  CANVAS_SIZES,
  PostTexts,
  BrandConfig,
  SelectedImage,
  Rect,
  TextStyle,
  PropertyData,
} from '@/lib/types';

// ============================================================
// Image Renderer — Generates final images using Sharp
// ============================================================

interface RenderContext {
  template: TemplateDefinition;
  format: CanvasFormat;
  images: SelectedImage[];
  texts: PostTexts;
  brand: BrandConfig;
  property: PropertyData;
  /** For preview mode, use lower quality/smaller size */
  previewMode?: boolean;
  /** Total number of slides (for carousel indicators) */
  totalSlides?: number;
  /** Current slide index (1-based, for indicators) */
  slideIndex?: number;
}

/**
 * Download an image from URL and return it as a Buffer.
 */
async function fetchImageBuffer(url: string): Promise<Buffer> {
  const response = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 PostGenerator/1.0' },
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error(`Failed to fetch image: ${url} (${response.status})`);
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Resolve color references like 'brand.primary', 'brand.secondary' to actual hex values.
 */
function resolveColor(color: string, brand: BrandConfig): string {
  if (color === 'brand.primary') return brand.primaryColor || '#1a365d';
  if (color === 'brand.secondary') return brand.secondaryColor || '#e2e8f0';
  return color;
}

/**
 * Create a Sharp composite overlay for an image placeholder.
 */
async function renderImageLayer(
  layer: ImagePlaceholder,
  images: SelectedImage[],
  previewMode: boolean
): Promise<sharp.OverlayOptions | null> {
  const img = images[layer.imageIndex];
  if (!img) return null;

  try {
    const buffer = await fetchImageBuffer(img.url);
    let pipeline = sharp(buffer);

    // Resize to fit the placeholder rect
    if (layer.fit === 'cover') {
      pipeline = pipeline.resize(
        Math.round(layer.rect.width),
        Math.round(layer.rect.height),
        { fit: 'cover', position: 'centre' }
      );
    } else if (layer.fit === 'contain') {
      pipeline = pipeline.resize(
        Math.round(layer.rect.width),
        Math.round(layer.rect.height),
        { fit: 'inside' }
      );
    } else {
      pipeline = pipeline.resize(
        Math.round(layer.rect.width),
        Math.round(layer.rect.height),
        { fit: 'fill' }
      );
    }

    // Apply border radius by compositing with a mask
    if (layer.borderRadius && layer.borderRadius > 0) {
      const w = Math.round(layer.rect.width);
      const h = Math.round(layer.rect.height);
      const r = Math.min(layer.borderRadius, Math.min(w, h) / 2);
      const roundedMask = Buffer.from(
        `<svg width="${w}" height="${h}"><rect x="0" y="0" width="${w}" height="${h}" rx="${r}" ry="${r}" fill="white"/></svg>`
      );
      const imageBuffer = await pipeline.png().toBuffer();
      const masked = await sharp(imageBuffer)
        .composite([{ input: roundedMask, blend: 'dest-in' }])
        .png()
        .toBuffer();
      return {
        input: masked,
        left: Math.round(layer.rect.x),
        top: Math.round(layer.rect.y),
      };
    }

    if (previewMode) {
      pipeline = pipeline.jpeg({ quality: 70 });
    } else {
      pipeline = pipeline.png();
    }

    const outputBuffer = await pipeline.toBuffer();
    return {
      input: outputBuffer,
      left: Math.round(layer.rect.x),
      top: Math.round(layer.rect.y),
    };
  } catch (error) {
    console.error(`Failed to render image layer ${layer.id}:`, error);
    // Return a gray placeholder on failure
    const placeholder = await sharp({
      create: {
        width: Math.round(layer.rect.width),
        height: Math.round(layer.rect.height),
        channels: 4,
        background: { r: 200, g: 200, b: 200, alpha: 1 },
      },
    })
      .png()
      .toBuffer();
    return {
      input: placeholder,
      left: Math.round(layer.rect.x),
      top: Math.round(layer.rect.y),
    };
  }
}

/**
 * Create an SVG text element for a text placeholder.
 */
function renderTextLayer(
  layer: TextPlaceholder,
  texts: PostTexts,
  brand: BrandConfig,
  property: PropertyData,
  ctx: RenderContext
): sharp.OverlayOptions | null {
  let text = '';

  switch (layer.field) {
    case 'title':
      text = texts.title;
      break;
    case 'price':
      text = texts.price;
      break;
    case 'location':
      text = texts.location;
      break;
    case 'features':
      text = texts.features;
      break;
    case 'cta':
      text = texts.cta;
      break;
    case 'custom':
      // Handle special custom fields
      if (layer.id === 'operation-text' || layer.id === 'badge-text') {
        text = property.operation === 'alquiler' ? 'EN ALQUILER' : 'EN VENTA';
      } else if (layer.id === 'carousel-indicator' || layer.id === 'indicator-text') {
        const total = ctx.totalSlides || 1;
        const current = ctx.slideIndex || 1;
        text = `${current}/${total}`;
      } else {
        text = layer.defaultText || '';
      }
      break;
    default:
      text = layer.defaultText || '';
  }

  if (!text) {
    text = layer.defaultText || '';
  }
  if (!text) return null;

  const color = resolveColor(layer.style.color, brand);
  const fontWeight = layer.style.fontWeight === 'black' ? '900' :
    layer.style.fontWeight === 'bold' ? '700' : '400';
  const textAnchor = layer.style.textAlign === 'center' ? 'middle' :
    layer.style.textAlign === 'right' ? 'end' : 'start';
  const xPos = layer.style.textAlign === 'center' ? layer.rect.width / 2 :
    layer.style.textAlign === 'right' ? layer.rect.width : 0;

  // Escape XML entities
  text = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // Truncate if needed
  if (layer.style.maxLines === 1) {
    // Estimate chars that fit (rough: fontSize * 0.55 per char)
    const maxChars = Math.floor(layer.rect.width / (layer.style.fontSize * 0.55));
    if (text.length > maxChars) {
      text = text.substring(0, maxChars - 1) + '…';
    }
  }

  const letterSpacing = layer.style.letterSpacing ? `letter-spacing="${layer.style.letterSpacing}"` : '';
  const textTransform = layer.style.textTransform && layer.style.textTransform !== 'none'
    ? `text-transform: ${layer.style.textTransform};` : '';

  // Center vertically
  const yPos = layer.rect.height / 2 + layer.style.fontSize * 0.35;

  const svg = `<svg width="${Math.round(layer.rect.width)}" height="${Math.round(layer.rect.height)}">
    <text
      x="${xPos}"
      y="${yPos}"
      font-family="Inter, Helvetica, Arial, sans-serif"
      font-size="${layer.style.fontSize}"
      font-weight="${fontWeight}"
      fill="${color}"
      text-anchor="${textAnchor}"
      ${letterSpacing}
      style="${textTransform}"
    >${text}</text>
  </svg>`;

  return {
    input: Buffer.from(svg),
    left: Math.round(layer.rect.x),
    top: Math.round(layer.rect.y),
  };
}

/**
 * Render a shape layer (solid rect or gradient overlay).
 */
async function renderShapeLayer(
  layer: ShapePlaceholder,
  brand: BrandConfig
): Promise<sharp.OverlayOptions | null> {
  const w = Math.round(layer.rect.width);
  const h = Math.round(layer.rect.height);
  const opacity = layer.opacity !== undefined ? layer.opacity : 1;

  if (layer.shape === 'gradient-overlay' && layer.gradient) {
    // Render gradient as SVG
    const stops = layer.gradient.stops
      .map(
        (s) =>
          `<stop offset="${s.offset * 100}%" stop-color="${s.color}" stop-opacity="${s.opacity}"/>`
      )
      .join('\n');

    let gradientDef = '';
    if (layer.gradient.direction === 'to-bottom') {
      gradientDef = `<linearGradient id="g" x1="0" y1="0" x2="0" y2="1">${stops}</linearGradient>`;
    } else if (layer.gradient.direction === 'to-top') {
      gradientDef = `<linearGradient id="g" x1="0" y1="1" x2="0" y2="0">${stops}</linearGradient>`;
    } else if (layer.gradient.direction === 'to-right') {
      gradientDef = `<linearGradient id="g" x1="0" y1="0" x2="1" y2="0">${stops}</linearGradient>`;
    } else {
      gradientDef = `<linearGradient id="g" x1="1" y1="0" x2="0" y2="0">${stops}</linearGradient>`;
    }

    const svg = `<svg width="${w}" height="${h}">
      <defs>${gradientDef}</defs>
      <rect width="${w}" height="${h}" fill="url(#g)"/>
    </svg>`;

    return {
      input: Buffer.from(svg),
      left: Math.round(layer.rect.x),
      top: Math.round(layer.rect.y),
    };
  }

  // Solid rect
  const fillColor = resolveColor(layer.fill || '#000000', brand);
  const r = layer.borderRadius || 0;

  // Parse hex color to RGBA
  const hex = fillColor.replace('#', '');
  const red = parseInt(hex.substring(0, 2), 16);
  const green = parseInt(hex.substring(2, 4), 16);
  const blue = parseInt(hex.substring(4, 6), 16);

  if (r > 0) {
    // Use SVG for rounded rects
    const svg = `<svg width="${w}" height="${h}">
      <rect width="${w}" height="${h}" rx="${r}" ry="${r}" fill="${fillColor}" fill-opacity="${opacity}"/>
    </svg>`;
    return {
      input: Buffer.from(svg),
      left: Math.round(layer.rect.x),
      top: Math.round(layer.rect.y),
    };
  }

  const solidRect = await sharp({
    create: {
      width: w,
      height: h,
      channels: 4,
      background: { r: red, g: green, b: blue, alpha: opacity },
    },
  })
    .png()
    .toBuffer();

  return {
    input: solidRect,
    left: Math.round(layer.rect.x),
    top: Math.round(layer.rect.y),
  };
}

/**
 * Render the logo layer.
 */
async function renderLogoLayer(
  layer: LogoPlaceholder,
  brand: BrandConfig
): Promise<sharp.OverlayOptions | null> {
  if (!brand.logoUrl) {
    // If no logo, render agency name as text instead
    if (brand.agencyName) {
      const fontSize = Math.min(24, Math.round(layer.rect.height * 0.4));
      const svg = `<svg width="${Math.round(layer.rect.width)}" height="${Math.round(layer.rect.height)}">
        <text x="${layer.rect.width / 2}" y="${layer.rect.height / 2 + fontSize * 0.35}"
          font-family="Inter, Helvetica, Arial, sans-serif" font-size="${fontSize}" font-weight="700"
          fill="#FFFFFF" text-anchor="middle">${brand.agencyName.replace(/&/g, '&amp;')}</text>
      </svg>`;
      return {
        input: Buffer.from(svg),
        left: Math.round(layer.rect.x),
        top: Math.round(layer.rect.y),
      };
    }
    return null;
  }

  try {
    const buffer = await fetchImageBuffer(brand.logoUrl);
    const resized = await sharp(buffer)
      .resize(Math.round(layer.rect.width), Math.round(layer.rect.height), {
        fit: 'inside',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toBuffer();

    return {
      input: resized,
      left: Math.round(layer.rect.x),
      top: Math.round(layer.rect.y),
    };
  } catch (error) {
    console.error('Failed to render logo:', error);
    return null;
  }
}

/**
 * Render a single slide.
 */
async function renderSlide(
  slide: TemplateSlide,
  ctx: RenderContext
): Promise<Buffer> {
  const canvasSize = CANVAS_SIZES[ctx.format];
  const bgColor = resolveColor(slide.backgroundColor || '#FFFFFF', ctx.brand);

  // Parse background color
  const hex = bgColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) || 255;
  const g = parseInt(hex.substring(2, 4), 16) || 255;
  const b = parseInt(hex.substring(4, 6), 16) || 255;

  // Create base canvas
  let canvas = sharp({
    create: {
      width: canvasSize.width,
      height: canvasSize.height,
      channels: 4,
      background: { r, g, b, alpha: 1 },
    },
  });

  // Sort layers by zIndex
  const sortedLayers = [...slide.layers].sort((a, b) => a.zIndex - b.zIndex);

  // Render all layers
  const overlays: sharp.OverlayOptions[] = [];

  for (const layer of sortedLayers) {
    let overlay: sharp.OverlayOptions | null = null;

    switch (layer.type) {
      case 'image':
        overlay = await renderImageLayer(layer, ctx.images, ctx.previewMode || false);
        break;
      case 'text':
        overlay = renderTextLayer(layer, ctx.texts, ctx.brand, ctx.property, ctx);
        break;
      case 'shape':
        overlay = await renderShapeLayer(layer, ctx.brand);
        break;
      case 'logo':
        overlay = await renderLogoLayer(layer, ctx.brand);
        break;
    }

    if (overlay) {
      overlays.push(overlay);
    }
  }

  // Composite all overlays
  const result = await canvas
    .composite(overlays)
    .png({ quality: ctx.previewMode ? 70 : 100 })
    .toBuffer();

  return result;
}

// ============================================================
// Public API
// ============================================================

export interface RenderInput {
  templateId: string;
  format: CanvasFormat;
  images: SelectedImage[];
  texts: PostTexts;
  brand: BrandConfig;
  property: PropertyData;
}

export interface RenderOutput {
  slides: Buffer[];
}

/**
 * Render all slides for a template.
 * For carousel templates, generates dynamic slides based on image count.
 */
export async function renderPost(
  template: TemplateDefinition,
  input: RenderInput,
  previewMode: boolean = false
): Promise<RenderOutput> {
  const slides = template.slides[input.format];
  if (!slides || slides.length === 0) {
    throw new Error(`Template ${template.id} does not support format ${input.format}`);
  }

  const renderedSlides: Buffer[] = [];

  if (template.category === 'carousel') {
    // Carousel: slide 0 = cover, slides 1..N = one per additional image
    const totalSlides = input.images.length;
    const coverSlide = slides[0];
    const photoSlideTemplate = slides[1];

    // Render cover slide
    const coverCtx: RenderContext = {
      template,
      format: input.format,
      images: input.images,
      texts: input.texts,
      brand: input.brand,
      property: input.property,
      previewMode,
      totalSlides,
      slideIndex: 1,
    };
    renderedSlides.push(await renderSlide(coverSlide, coverCtx));

    // Render photo slides (1 per additional image)
    if (photoSlideTemplate) {
      for (let i = 1; i < input.images.length; i++) {
        // Create a modified slide where the image index points to the current image
        const modifiedSlide: TemplateSlide = {
          ...photoSlideTemplate,
          layers: photoSlideTemplate.layers.map((layer) => {
            if (layer.type === 'image') {
              return { ...layer, imageIndex: i };
            }
            return layer;
          }),
        };

        const slideCtx: RenderContext = {
          template,
          format: input.format,
          images: input.images,
          texts: input.texts,
          brand: input.brand,
          property: input.property,
          previewMode,
          totalSlides,
          slideIndex: i + 1,
        };
        renderedSlides.push(await renderSlide(modifiedSlide, slideCtx));
      }
    }
  } else {
    // Non-carousel: render all defined slides (usually just 1)
    for (let i = 0; i < slides.length; i++) {
      const ctx: RenderContext = {
        template,
        format: input.format,
        images: input.images,
        texts: input.texts,
        brand: input.brand,
        property: input.property,
        previewMode,
        totalSlides: slides.length,
        slideIndex: i + 1,
      };
      renderedSlides.push(await renderSlide(slides[i], ctx));
    }
  }

  return { slides: renderedSlides };
}

/**
 * Generate a low-res preview (scaled down for speed).
 */
export async function renderPreview(
  template: TemplateDefinition,
  input: RenderInput
): Promise<Buffer[]> {
  const result = await renderPost(template, input, true);

  // Scale down for preview
  const previews = await Promise.all(
    result.slides.map(async (slide) => {
      return sharp(slide)
        .resize(540, undefined, { fit: 'inside' })
        .jpeg({ quality: 75 })
        .toBuffer();
    })
  );

  return previews;
}
