import { TemplateDefinition, CanvasFormat } from '@/lib/types';
import { heroOverlay } from './definitions/hero-overlay';
import { collage2 } from './definitions/collage-2';
import { collage3 } from './definitions/collage-3';
import { collage4 } from './definitions/collage-4';
import { carouselCover } from './definitions/carousel-cover';
import { heroMinimal } from './definitions/hero-minimal';

/**
 * Template Registry — Single source of truth for all available templates.
 * To add a new template: create a file in definitions/ and register it here.
 */
const ALL_TEMPLATES: TemplateDefinition[] = [
  heroOverlay,
  heroMinimal,
  collage2,
  collage3,
  collage4,
  carouselCover,
];

export function getAllTemplates(): TemplateDefinition[] {
  return ALL_TEMPLATES;
}

export function getTemplateById(id: string): TemplateDefinition | undefined {
  return ALL_TEMPLATES.find((t) => t.id === id);
}

export function getTemplatesForImageCount(count: number): TemplateDefinition[] {
  return ALL_TEMPLATES.filter((t) => count >= t.imageCount);
}

export function getTemplatesForFormat(format: CanvasFormat): TemplateDefinition[] {
  return ALL_TEMPLATES.filter(
    (t) => t.supportedFormats.includes(format) && t.slides[format]?.length > 0
  );
}

export interface TemplateSummary {
  id: string;
  name: string;
  description: string;
  category: string;
  imageCount: number;
  maxImages?: number;
  supportedFormats: CanvasFormat[];
  tags?: string[];
}

export function getTemplateSummaries(): TemplateSummary[] {
  return ALL_TEMPLATES.map((t) => ({
    id: t.id,
    name: t.name,
    description: t.description,
    category: t.category,
    imageCount: t.imageCount,
    maxImages: t.maxImages,
    supportedFormats: t.supportedFormats.filter(
      (f) => t.slides[f]?.length > 0
    ),
    tags: t.tags,
  }));
}
