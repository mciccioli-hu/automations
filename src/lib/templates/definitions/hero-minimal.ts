import { TemplateDefinition } from '@/lib/types';

/**
 * HERO MINIMAL — 1 foto con franja lateral de datos.
 * Diseño limpio y moderno, ideal para propiedades premium.
 */
export const heroMinimal: TemplateDefinition = {
  id: 'hero-minimal',
  version: '1.0.0',
  name: 'Hero Minimal',
  description: '1 foto con panel lateral de datos — estilo premium',
  category: 'hero',
  imageCount: 1,
  supportedFormats: ['1080x1080', '1080x1350'],
  safeArea: { top: 40, bottom: 40, left: 40, right: 40 },
  tags: ['hero', 'minimal', 'premium', '1-foto'],
  slides: {
    '1080x1080': [
      {
        id: 'main',
        backgroundColor: '#FFFFFF',
        layers: [
          // Main image (left 65%)
          {
            type: 'image',
            id: 'main-image',
            imageIndex: 0,
            rect: { x: 0, y: 0, width: 700, height: 1080 },
            fit: 'cover',
            zIndex: 0,
          },
          // Right panel background
          {
            type: 'shape',
            id: 'right-panel',
            shape: 'rect',
            rect: { x: 700, y: 0, width: 380, height: 1080 },
            fill: 'brand.primary',
            zIndex: 1,
          },
          // Operation badge
          {
            type: 'shape',
            id: 'badge-bg',
            shape: 'rect',
            rect: { x: 730, y: 60, width: 180, height: 44 },
            fill: 'brand.secondary',
            borderRadius: 6,
            opacity: 0.2,
            zIndex: 2,
          },
          {
            type: 'text',
            id: 'operation-text',
            field: 'custom',
            rect: { x: 730, y: 60, width: 180, height: 44 },
            defaultText: 'EN VENTA',
            style: {
              fontFamily: 'Inter',
              color: 'brand.secondary',
              fontSize: 18,
              fontWeight: 'bold',
              textAlign: 'center',
              textTransform: 'uppercase',
              letterSpacing: 3,
            },
            zIndex: 3,
          },
          // Title (vertical in panel)
          {
            type: 'text',
            id: 'title',
            field: 'title',
            rect: { x: 730, y: 150, width: 320, height: 90 },
            style: {
              fontFamily: 'Inter',
              color: '#FFFFFF',
              fontSize: 32,
              fontWeight: 'bold',
              textAlign: 'left',
              lineHeight: 1.2,
              maxLines: 3,
            },
            zIndex: 2,
          },
          // Price
          {
            type: 'text',
            id: 'price',
            field: 'price',
            rect: { x: 730, y: 280, width: 320, height: 55 },
            style: {
              fontFamily: 'Inter',
              color: 'brand.secondary',
              fontSize: 40,
              fontWeight: 'black',
              textAlign: 'left',
            },
            zIndex: 2,
          },
          // Divider
          {
            type: 'shape',
            id: 'divider',
            shape: 'rect',
            rect: { x: 730, y: 360, width: 60, height: 4 },
            fill: 'brand.secondary',
            borderRadius: 2,
            zIndex: 2,
          },
          // Location
          {
            type: 'text',
            id: 'location',
            field: 'location',
            rect: { x: 730, y: 390, width: 320, height: 35 },
            style: {
              fontFamily: 'Inter',
              color: '#CCCCCC',
              fontSize: 22,
              fontWeight: 'normal',
              textAlign: 'left',
            },
            zIndex: 2,
          },
          // Features (stacked)
          {
            type: 'text',
            id: 'features',
            field: 'features',
            rect: { x: 730, y: 440, width: 320, height: 120 },
            style: {
              fontFamily: 'Inter',
              color: '#AAAAAA',
              fontSize: 20,
              fontWeight: 'normal',
              textAlign: 'left',
              lineHeight: 1.6,
              maxLines: 4,
            },
            zIndex: 2,
          },
          // Logo
          {
            type: 'logo',
            id: 'logo',
            rect: { x: 730, y: 880, width: 180, height: 80 },
            fit: 'contain',
            zIndex: 2,
          },
          // CTA
          {
            type: 'text',
            id: 'cta',
            field: 'cta',
            rect: { x: 730, y: 980, width: 320, height: 35 },
            style: {
              fontFamily: 'Inter',
              color: 'brand.secondary',
              fontSize: 18,
              fontWeight: 'bold',
              textAlign: 'left',
            },
            zIndex: 2,
          },
        ],
      },
    ],
    '1080x1350': [
      {
        id: 'main',
        backgroundColor: 'brand.primary',
        layers: [
          // Image takes top 70%
          {
            type: 'image',
            id: 'main-image',
            imageIndex: 0,
            rect: { x: 30, y: 30, width: 1020, height: 850 },
            fit: 'cover',
            borderRadius: 16,
            zIndex: 1,
          },
          // Bottom info section
          {
            type: 'shape',
            id: 'badge-bg',
            shape: 'rect',
            rect: { x: 60, y: 50, width: 180, height: 44 },
            fill: 'brand.primary',
            borderRadius: 6,
            zIndex: 2,
          },
          {
            type: 'text',
            id: 'operation-text',
            field: 'custom',
            rect: { x: 60, y: 50, width: 180, height: 44 },
            defaultText: 'EN VENTA',
            style: {
              fontFamily: 'Inter',
              color: '#FFFFFF',
              fontSize: 18,
              fontWeight: 'bold',
              textAlign: 'center',
              textTransform: 'uppercase',
              letterSpacing: 3,
            },
            zIndex: 3,
          },
          {
            type: 'text',
            id: 'title',
            field: 'title',
            rect: { x: 60, y: 920, width: 960, height: 50 },
            style: {
              fontFamily: 'Inter',
              color: '#FFFFFF',
              fontSize: 36,
              fontWeight: 'bold',
              textAlign: 'left',
              maxLines: 1,
            },
            zIndex: 2,
          },
          {
            type: 'text',
            id: 'price',
            field: 'price',
            rect: { x: 60, y: 980, width: 500, height: 55 },
            style: {
              fontFamily: 'Inter',
              color: 'brand.secondary',
              fontSize: 46,
              fontWeight: 'black',
              textAlign: 'left',
            },
            zIndex: 2,
          },
          {
            type: 'shape',
            id: 'divider',
            shape: 'rect',
            rect: { x: 60, y: 1055, width: 60, height: 4 },
            fill: 'brand.secondary',
            borderRadius: 2,
            zIndex: 2,
          },
          {
            type: 'text',
            id: 'location',
            field: 'location',
            rect: { x: 60, y: 1080, width: 500, height: 35 },
            style: {
              fontFamily: 'Inter',
              color: '#CCCCCC',
              fontSize: 24,
              fontWeight: 'normal',
              textAlign: 'left',
            },
            zIndex: 2,
          },
          {
            type: 'text',
            id: 'features',
            field: 'features',
            rect: { x: 60, y: 1125, width: 600, height: 35 },
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
            rect: { x: 860, y: 1050, width: 160, height: 80 },
            fit: 'contain',
            zIndex: 2,
          },
          {
            type: 'text',
            id: 'cta',
            field: 'cta',
            rect: { x: 60, y: 1190, width: 500, height: 35 },
            style: {
              fontFamily: 'Inter',
              color: 'brand.secondary',
              fontSize: 22,
              fontWeight: 'bold',
              textAlign: 'left',
            },
            zIndex: 2,
          },
        ],
      },
    ],
    '1080x1920': [] as any,
  },
};
