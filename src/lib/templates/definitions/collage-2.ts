import { TemplateDefinition } from '@/lib/types';

/**
 * COLLAGE 2 — 2 fotos lado a lado con barra inferior de datos.
 * Ideal para mostrar interior + exterior, o living + dormitorio.
 */
export const collage2: TemplateDefinition = {
  id: 'collage-2',
  version: '1.0.0',
  name: 'Collage 2 Fotos',
  description: '2 fotos lado a lado con datos abajo',
  category: 'collage',
  imageCount: 2,
  supportedFormats: ['1080x1080', '1080x1350'],
  safeArea: { top: 40, bottom: 40, left: 40, right: 40 },
  tags: ['collage', '2-fotos', 'dual'],
  slides: {
    '1080x1080': [
      {
        id: 'main',
        backgroundColor: '#FFFFFF',
        layers: [
          // Image 1 (left)
          {
            type: 'image',
            id: 'img-left',
            imageIndex: 0,
            rect: { x: 20, y: 20, width: 518, height: 680 },
            fit: 'cover',
            borderRadius: 12,
            zIndex: 1,
          },
          // Image 2 (right)
          {
            type: 'image',
            id: 'img-right',
            imageIndex: 1,
            rect: { x: 542, y: 20, width: 518, height: 680 },
            fit: 'cover',
            borderRadius: 12,
            zIndex: 1,
          },
          // Bottom bar background
          {
            type: 'shape',
            id: 'bottom-bar',
            shape: 'rect',
            rect: { x: 0, y: 720, width: 1080, height: 360 },
            fill: 'brand.primary',
            zIndex: 2,
          },
          // Title
          {
            type: 'text',
            id: 'title',
            field: 'title',
            rect: { x: 60, y: 750, width: 960, height: 50 },
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
          // Price
          {
            type: 'text',
            id: 'price',
            field: 'price',
            rect: { x: 60, y: 810, width: 500, height: 55 },
            style: {
              fontFamily: 'Inter',
              color: '#FFFFFF',
              fontSize: 44,
              fontWeight: 'black',
              textAlign: 'left',
            },
            zIndex: 3,
          },
          // Location
          {
            type: 'text',
            id: 'location',
            field: 'location',
            rect: { x: 60, y: 870, width: 500, height: 35 },
            style: {
              fontFamily: 'Inter',
              color: 'brand.secondary',
              fontSize: 24,
              fontWeight: 'normal',
              textAlign: 'left',
            },
            zIndex: 3,
          },
          // Features
          {
            type: 'text',
            id: 'features',
            field: 'features',
            rect: { x: 60, y: 915, width: 600, height: 35 },
            style: {
              fontFamily: 'Inter',
              color: '#CCCCCC',
              fontSize: 22,
              fontWeight: 'normal',
              textAlign: 'left',
              maxLines: 1,
            },
            zIndex: 3,
          },
          // Logo
          {
            type: 'logo',
            id: 'logo',
            rect: { x: 860, y: 820, width: 160, height: 80 },
            fit: 'contain',
            zIndex: 3,
          },
          // CTA
          {
            type: 'text',
            id: 'cta',
            field: 'cta',
            rect: { x: 60, y: 970, width: 600, height: 35 },
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
    '1080x1350': [
      {
        id: 'main',
        backgroundColor: '#FFFFFF',
        layers: [
          {
            type: 'image',
            id: 'img-left',
            imageIndex: 0,
            rect: { x: 20, y: 20, width: 518, height: 880 },
            fit: 'cover',
            borderRadius: 12,
            zIndex: 1,
          },
          {
            type: 'image',
            id: 'img-right',
            imageIndex: 1,
            rect: { x: 542, y: 20, width: 518, height: 880 },
            fit: 'cover',
            borderRadius: 12,
            zIndex: 1,
          },
          {
            type: 'shape',
            id: 'bottom-bar',
            shape: 'rect',
            rect: { x: 0, y: 920, width: 1080, height: 430 },
            fill: 'brand.primary',
            zIndex: 2,
          },
          {
            type: 'text',
            id: 'title',
            field: 'title',
            rect: { x: 60, y: 950, width: 960, height: 55 },
            style: {
              fontFamily: 'Inter',
              color: '#FFFFFF',
              fontSize: 38,
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
            rect: { x: 60, y: 1015, width: 500, height: 60 },
            style: {
              fontFamily: 'Inter',
              color: '#FFFFFF',
              fontSize: 48,
              fontWeight: 'black',
              textAlign: 'left',
            },
            zIndex: 3,
          },
          {
            type: 'text',
            id: 'location',
            field: 'location',
            rect: { x: 60, y: 1085, width: 500, height: 40 },
            style: {
              fontFamily: 'Inter',
              color: 'brand.secondary',
              fontSize: 26,
              fontWeight: 'normal',
              textAlign: 'left',
            },
            zIndex: 3,
          },
          {
            type: 'text',
            id: 'features',
            field: 'features',
            rect: { x: 60, y: 1135, width: 600, height: 40 },
            style: {
              fontFamily: 'Inter',
              color: '#CCCCCC',
              fontSize: 24,
              fontWeight: 'normal',
              textAlign: 'left',
              maxLines: 1,
            },
            zIndex: 3,
          },
          {
            type: 'logo',
            id: 'logo',
            rect: { x: 860, y: 1060, width: 160, height: 80 },
            fit: 'contain',
            zIndex: 3,
          },
          {
            type: 'text',
            id: 'cta',
            field: 'cta',
            rect: { x: 60, y: 1200, width: 600, height: 40 },
            style: {
              fontFamily: 'Inter',
              color: 'brand.secondary',
              fontSize: 22,
              fontWeight: 'bold',
              textAlign: 'left',
            },
            zIndex: 3,
          },
        ],
      },
    ],
    '1080x1920': [] as any, // Not supported
  },
};
