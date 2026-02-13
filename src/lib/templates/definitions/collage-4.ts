import { TemplateDefinition } from '@/lib/types';

/**
 * COLLAGE 4 — Grid 2x2 de fotos con overlay central de datos.
 * Muestra 4 ambientes con info en el centro.
 */
export const collage4: TemplateDefinition = {
  id: 'collage-4',
  version: '1.0.0',
  name: 'Collage 4 Fotos',
  description: 'Grid 2x2 con datos superpuestos en el centro',
  category: 'collage',
  imageCount: 4,
  supportedFormats: ['1080x1080', '1080x1350'],
  safeArea: { top: 40, bottom: 40, left: 40, right: 40 },
  tags: ['collage', '4-fotos', 'grid'],
  slides: {
    '1080x1080': [
      {
        id: 'main',
        backgroundColor: '#111111',
        layers: [
          // Top-left
          {
            type: 'image',
            id: 'img-tl',
            imageIndex: 0,
            rect: { x: 8, y: 8, width: 528, height: 528 },
            fit: 'cover',
            borderRadius: 8,
            zIndex: 1,
          },
          // Top-right
          {
            type: 'image',
            id: 'img-tr',
            imageIndex: 1,
            rect: { x: 544, y: 8, width: 528, height: 528 },
            fit: 'cover',
            borderRadius: 8,
            zIndex: 1,
          },
          // Bottom-left
          {
            type: 'image',
            id: 'img-bl',
            imageIndex: 2,
            rect: { x: 8, y: 544, width: 528, height: 528 },
            fit: 'cover',
            borderRadius: 8,
            zIndex: 1,
          },
          // Bottom-right
          {
            type: 'image',
            id: 'img-br',
            imageIndex: 3,
            rect: { x: 544, y: 544, width: 528, height: 528 },
            fit: 'cover',
            borderRadius: 8,
            zIndex: 1,
          },
          // Center overlay (dark card)
          {
            type: 'shape',
            id: 'center-card',
            shape: 'rect',
            rect: { x: 190, y: 320, width: 700, height: 440 },
            fill: 'brand.primary',
            opacity: 0.92,
            borderRadius: 16,
            zIndex: 5,
          },
          // Title
          {
            type: 'text',
            id: 'title',
            field: 'title',
            rect: { x: 230, y: 355, width: 620, height: 50 },
            style: {
              fontFamily: 'Inter',
              color: '#FFFFFF',
              fontSize: 34,
              fontWeight: 'bold',
              textAlign: 'center',
              maxLines: 1,
            },
            zIndex: 6,
          },
          // Divider line (shape as thin rect)
          {
            type: 'shape',
            id: 'divider',
            shape: 'rect',
            rect: { x: 340, y: 415, width: 400, height: 3 },
            fill: 'brand.secondary',
            borderRadius: 2,
            zIndex: 6,
          },
          // Price
          {
            type: 'text',
            id: 'price',
            field: 'price',
            rect: { x: 230, y: 435, width: 620, height: 60 },
            style: {
              fontFamily: 'Inter',
              color: '#FFFFFF',
              fontSize: 48,
              fontWeight: 'black',
              textAlign: 'center',
            },
            zIndex: 6,
          },
          // Location
          {
            type: 'text',
            id: 'location',
            field: 'location',
            rect: { x: 230, y: 505, width: 620, height: 35 },
            style: {
              fontFamily: 'Inter',
              color: 'brand.secondary',
              fontSize: 26,
              fontWeight: 'normal',
              textAlign: 'center',
            },
            zIndex: 6,
          },
          // Features
          {
            type: 'text',
            id: 'features',
            field: 'features',
            rect: { x: 230, y: 550, width: 620, height: 35 },
            style: {
              fontFamily: 'Inter',
              color: '#BBBBBB',
              fontSize: 22,
              fontWeight: 'normal',
              textAlign: 'center',
              maxLines: 1,
            },
            zIndex: 6,
          },
          // Logo
          {
            type: 'logo',
            id: 'logo',
            rect: { x: 440, y: 600, width: 200, height: 70 },
            fit: 'contain',
            zIndex: 6,
          },
          // CTA
          {
            type: 'text',
            id: 'cta',
            field: 'cta',
            rect: { x: 230, y: 685, width: 620, height: 35 },
            style: {
              fontFamily: 'Inter',
              color: 'brand.secondary',
              fontSize: 20,
              fontWeight: 'bold',
              textAlign: 'center',
            },
            zIndex: 6,
          },
        ],
      },
    ],
    '1080x1350': [
      {
        id: 'main',
        backgroundColor: '#111111',
        layers: [
          {
            type: 'image',
            id: 'img-tl',
            imageIndex: 0,
            rect: { x: 8, y: 8, width: 528, height: 528 },
            fit: 'cover',
            borderRadius: 8,
            zIndex: 1,
          },
          {
            type: 'image',
            id: 'img-tr',
            imageIndex: 1,
            rect: { x: 544, y: 8, width: 528, height: 528 },
            fit: 'cover',
            borderRadius: 8,
            zIndex: 1,
          },
          {
            type: 'image',
            id: 'img-bl',
            imageIndex: 2,
            rect: { x: 8, y: 544, width: 528, height: 528 },
            fit: 'cover',
            borderRadius: 8,
            zIndex: 1,
          },
          {
            type: 'image',
            id: 'img-br',
            imageIndex: 3,
            rect: { x: 544, y: 544, width: 528, height: 528 },
            fit: 'cover',
            borderRadius: 8,
            zIndex: 1,
          },
          // Bottom info section
          {
            type: 'shape',
            id: 'bottom-section',
            shape: 'rect',
            rect: { x: 0, y: 1080, width: 1080, height: 270 },
            fill: 'brand.primary',
            zIndex: 2,
          },
          {
            type: 'text',
            id: 'title',
            field: 'title',
            rect: { x: 60, y: 1100, width: 960, height: 45 },
            style: {
              fontFamily: 'Inter',
              color: '#FFFFFF',
              fontSize: 36,
              fontWeight: 'bold',
              textAlign: 'left',
              maxLines: 1,
            },
            zIndex: 3,
          },
          {
            type: 'text',
            id: 'price',
            field: 'price',
            rect: { x: 60, y: 1155, width: 500, height: 55 },
            style: {
              fontFamily: 'Inter',
              color: '#FFFFFF',
              fontSize: 44,
              fontWeight: 'black',
              textAlign: 'left',
            },
            zIndex: 3,
          },
          {
            type: 'text',
            id: 'location',
            field: 'location',
            rect: { x: 60, y: 1215, width: 400, height: 35 },
            style: {
              fontFamily: 'Inter',
              color: 'brand.secondary',
              fontSize: 24,
              fontWeight: 'normal',
              textAlign: 'left',
            },
            zIndex: 3,
          },
          {
            type: 'text',
            id: 'features',
            field: 'features',
            rect: { x: 60, y: 1255, width: 600, height: 35 },
            style: {
              fontFamily: 'Inter',
              color: '#AAAAAA',
              fontSize: 22,
              fontWeight: 'normal',
              textAlign: 'left',
              maxLines: 1,
            },
            zIndex: 3,
          },
          {
            type: 'logo',
            id: 'logo',
            rect: { x: 860, y: 1185, width: 160, height: 70 },
            fit: 'contain',
            zIndex: 3,
          },
          {
            type: 'text',
            id: 'cta',
            field: 'cta',
            rect: { x: 60, y: 1300, width: 500, height: 30 },
            style: {
              fontFamily: 'Inter',
              color: 'brand.secondary',
              fontSize: 20,
              fontWeight: 'bold',
              textAlign: 'left',
            },
            zIndex: 3,
          },
        ],
      },
    ],
    '1080x1920': [] as any,
  },
};
