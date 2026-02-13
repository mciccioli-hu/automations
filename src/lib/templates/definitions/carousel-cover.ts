import { TemplateDefinition, TemplateSlide, CanvasFormat } from '@/lib/types';

/**
 * CAROUSEL COVER — Slide 1: Cover con foto hero + datos.
 * Slides 2..N: Fotos individuales con branding sutil.
 * Ideal para carruseles de Instagram con múltiples fotos.
 *
 * Nota: Este template genera slides dinámicamente basándose en las imágenes seleccionadas.
 * El slide 0 es el cover, los slides 1..N son las fotos adicionales.
 * imageIndex 0 = cover, imageIndex 1..N = generated dynamically by the renderer.
 */

function buildCoverSlide(canvasHeight: number): TemplateSlide {
  const isSquare = canvasHeight === 1080;
  const gradientStart = isSquare ? 440 : 650;
  const titleY = isSquare ? 720 : 980;
  const priceY = isSquare ? 775 : 1040;
  const locationY = isSquare ? 845 : 1110;
  const featuresY = isSquare ? 885 : 1155;
  const logoY = isSquare ? 910 : 1180;
  const ctaY = isSquare ? 980 : 1250;

  return {
    id: 'cover',
    layers: [
      {
        type: 'image',
        id: 'cover-image',
        imageIndex: 0,
        rect: { x: 0, y: 0, width: 1080, height: canvasHeight },
        fit: 'cover',
        zIndex: 0,
      },
      {
        type: 'shape',
        id: 'gradient',
        shape: 'gradient-overlay',
        rect: { x: 0, y: gradientStart, width: 1080, height: canvasHeight - gradientStart },
        gradient: {
          type: 'linear',
          direction: 'to-bottom',
          stops: [
            { offset: 0, color: '#000000', opacity: 0 },
            { offset: 0.35, color: '#000000', opacity: 0.6 },
            { offset: 1, color: '#000000', opacity: 0.88 },
          ],
        },
        zIndex: 1,
      },
      // Operation badge
      {
        type: 'shape',
        id: 'badge-bg',
        shape: 'rect',
        rect: { x: 60, y: 60, width: 200, height: 48 },
        fill: 'brand.primary',
        borderRadius: 8,
        zIndex: 2,
      },
      {
        type: 'text',
        id: 'badge-text',
        field: 'custom',
        rect: { x: 60, y: 60, width: 200, height: 48 },
        defaultText: 'EN VENTA',
        style: {
          fontFamily: 'Inter',
          color: '#FFFFFF',
          fontSize: 22,
          fontWeight: 'bold',
          textAlign: 'center',
          textTransform: 'uppercase',
          letterSpacing: 2,
        },
        zIndex: 3,
      },
      // Carousel indicator "1/N"
      {
        type: 'shape',
        id: 'carousel-indicator-bg',
        shape: 'rect',
        rect: { x: 920, y: 60, width: 100, height: 48 },
        fill: '#000000',
        opacity: 0.5,
        borderRadius: 24,
        zIndex: 2,
      },
      {
        type: 'text',
        id: 'carousel-indicator',
        field: 'custom',
        rect: { x: 920, y: 60, width: 100, height: 48 },
        defaultText: '1/N',
        style: {
          fontFamily: 'Inter',
          color: '#FFFFFF',
          fontSize: 20,
          fontWeight: 'bold',
          textAlign: 'center',
        },
        zIndex: 3,
      },
      {
        type: 'text',
        id: 'title',
        field: 'title',
        rect: { x: 60, y: titleY, width: 960, height: 50 },
        style: {
          fontFamily: 'Inter',
          color: '#FFFFFF',
          fontSize: 40,
          fontWeight: 'bold',
          textAlign: 'left',
          lineHeight: 1.1,
          maxLines: 1,
        },
        zIndex: 2,
      },
      {
        type: 'text',
        id: 'price',
        field: 'price',
        rect: { x: 60, y: priceY, width: 960, height: 60 },
        style: {
          fontFamily: 'Inter',
          color: 'brand.secondary',
          fontSize: 52,
          fontWeight: 'black',
          textAlign: 'left',
        },
        zIndex: 2,
      },
      {
        type: 'text',
        id: 'location',
        field: 'location',
        rect: { x: 60, y: locationY, width: 600, height: 40 },
        style: {
          fontFamily: 'Inter',
          color: '#CCCCCC',
          fontSize: 26,
          fontWeight: 'normal',
          textAlign: 'left',
        },
        zIndex: 2,
      },
      {
        type: 'text',
        id: 'features',
        field: 'features',
        rect: { x: 60, y: featuresY, width: 700, height: 35 },
        style: {
          fontFamily: 'Inter',
          color: '#AAAAAA',
          fontSize: 22,
          fontWeight: 'normal',
          textAlign: 'left',
          maxLines: 1,
        },
        zIndex: 2,
      },
      {
        type: 'logo',
        id: 'logo',
        rect: { x: 860, y: logoY, width: 160, height: 90 },
        fit: 'contain',
        zIndex: 2,
      },
      {
        type: 'text',
        id: 'cta',
        field: 'cta',
        rect: { x: 60, y: ctaY, width: 700, height: 35 },
        style: {
          fontFamily: 'Inter',
          color: 'brand.secondary',
          fontSize: 20,
          fontWeight: 'bold',
          textAlign: 'left',
        },
        zIndex: 2,
      },
    ],
  };
}

function buildPhotoSlide(canvasHeight: number): TemplateSlide {
  return {
    id: 'photo-slide',
    layers: [
      // Full-bleed image (imageIndex will be set dynamically)
      {
        type: 'image',
        id: 'slide-image',
        imageIndex: 1, // Will be overridden per slide
        rect: { x: 0, y: 0, width: 1080, height: canvasHeight },
        fit: 'cover',
        zIndex: 0,
      },
      // Subtle bottom gradient for branding
      {
        type: 'shape',
        id: 'bottom-gradient',
        shape: 'gradient-overlay',
        rect: { x: 0, y: canvasHeight - 120, width: 1080, height: 120 },
        gradient: {
          type: 'linear',
          direction: 'to-bottom',
          stops: [
            { offset: 0, color: '#000000', opacity: 0 },
            { offset: 1, color: '#000000', opacity: 0.5 },
          ],
        },
        zIndex: 1,
      },
      // Small logo in corner
      {
        type: 'logo',
        id: 'logo-small',
        rect: { x: 900, y: canvasHeight - 90, width: 130, height: 60 },
        fit: 'contain',
        zIndex: 2,
      },
      // Slide indicator
      {
        type: 'shape',
        id: 'indicator-bg',
        shape: 'rect',
        rect: { x: 920, y: 60, width: 100, height: 48 },
        fill: '#000000',
        opacity: 0.5,
        borderRadius: 24,
        zIndex: 2,
      },
      {
        type: 'text',
        id: 'indicator-text',
        field: 'custom',
        rect: { x: 920, y: 60, width: 100, height: 48 },
        defaultText: 'N/N',
        style: {
          fontFamily: 'Inter',
          color: '#FFFFFF',
          fontSize: 20,
          fontWeight: 'bold',
          textAlign: 'center',
        },
        zIndex: 3,
      },
    ],
  };
}

export const carouselCover: TemplateDefinition = {
  id: 'carousel-cover',
  version: '1.0.0',
  name: 'Carrusel con Cover',
  description: 'Cover con datos + slides de fotos individuales (carrusel IG)',
  category: 'carousel',
  imageCount: 2,
  maxImages: 10,
  supportedFormats: ['1080x1080', '1080x1350'],
  safeArea: { top: 60, bottom: 60, left: 40, right: 40 },
  tags: ['carousel', 'carrusel', 'multi-foto'],
  slides: {
    '1080x1080': [
      buildCoverSlide(1080),
      buildPhotoSlide(1080),
    ],
    '1080x1350': [
      buildCoverSlide(1350),
      buildPhotoSlide(1350),
    ],
    '1080x1920': [],
  },
};
