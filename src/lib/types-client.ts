/**
 * Client-side types (subset of server types without Node.js dependencies).
 */

export type CanvasFormat = '1080x1080' | '1080x1350' | '1080x1920';

export interface PropertyImage {
  url: string;
  width?: number;
  height?: number;
}

export type OperationType = 'venta' | 'alquiler';

export interface PropertyData {
  operation: OperationType;
  propertyType: string;
  price: number | null;
  currency: string;
  expenses?: number | null;
  address?: string;
  neighborhood?: string;
  city?: string;
  province?: string;
  bedrooms?: number | null;
  bathrooms?: number | null;
  totalAreaM2?: number | null;
  coveredAreaM2?: number | null;
  amenities?: string[];
  description?: string;
}

export interface BrandConfig {
  agencyId: string;
  agencyName: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  instagramHandle?: string;
  whatsapp?: string;
  website?: string;
}

export interface PostTexts {
  title: string;
  price: string;
  location: string;
  features: string;
  cta: string;
}

export interface SelectedImage {
  url: string;
  order: number;
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

export interface WizardState {
  step: number;
  url: string;
  images: PropertyImage[];
  property: PropertyData;
  selectedImages: SelectedImage[];
  selectedTemplate: TemplateSummary | null;
  format: CanvasFormat;
  texts: PostTexts;
  brand: BrandConfig;
  previewSlides: string[];
  exportData: {
    files: Array<{ name: string; data: string; size: number }>;
    caption: string;
    hashtags: string;
  } | null;
}
