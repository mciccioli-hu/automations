// ============================================================
// Core Types for the Real Estate Post Generator
// ============================================================

// --- Property & Scraping Types ---

export interface PropertyImage {
  url: string;
  width?: number;
  height?: number;
  /** Local cached path after download */
  cachedPath?: string;
}

export type OperationType = 'venta' | 'alquiler';
export type CurrencyType = 'USD' | 'ARS' | string;

export interface PropertyData {
  operation: OperationType;
  propertyType: string;
  price: number | null;
  currency: CurrencyType;
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

export interface SourceMetadata {
  portal: string;
  scrapedAt: string;
  originalUrl: string;
}

export interface ScrapeResult {
  images: PropertyImage[];
  property: PropertyData;
  source: SourceMetadata;
}

// --- Brand / Multi-tenant Types ---

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

// --- Template System Types ---

export type CanvasFormat = '1080x1080' | '1080x1350' | '1080x1920';

export interface CanvasSize {
  width: number;
  height: number;
}

export const CANVAS_SIZES: Record<CanvasFormat, CanvasSize> = {
  '1080x1080': { width: 1080, height: 1080 },
  '1080x1350': { width: 1080, height: 1350 },
  '1080x1920': { width: 1080, height: 1920 },
};

export type ImageFit = 'cover' | 'contain' | 'fill';

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ImagePlaceholder {
  type: 'image';
  id: string;
  /** Index of the image from the selected images array (0-based) */
  imageIndex: number;
  rect: Rect;
  fit: ImageFit;
  borderRadius?: number;
  /** Optional border */
  border?: { width: number; color: string };
  /** Z-index for layering */
  zIndex: number;
}

export interface TextPlaceholder {
  type: 'text';
  id: string;
  /** Which data field to bind: 'title' | 'price' | 'location' | 'features' | 'cta' | 'custom' */
  field: 'title' | 'price' | 'location' | 'features' | 'cta' | 'custom';
  rect: Rect;
  style: TextStyle;
  /** Default text if field is empty */
  defaultText?: string;
  zIndex: number;
}

export interface TextStyle {
  fontFamily: string;
  /** Use 'brand.primary' or 'brand.secondary' for dynamic brand colors, or hex */
  color: string;
  fontSize: number;
  fontWeight: 'normal' | 'bold' | 'black';
  textAlign: 'left' | 'center' | 'right';
  lineHeight?: number;
  letterSpacing?: number;
  textTransform?: 'none' | 'uppercase' | 'lowercase';
  /** Max lines before truncation */
  maxLines?: number;
}

export interface ShapePlaceholder {
  type: 'shape';
  id: string;
  shape: 'rect' | 'gradient-overlay';
  rect: Rect;
  fill?: string;
  opacity?: number;
  borderRadius?: number;
  /** For gradient overlays */
  gradient?: {
    type: 'linear';
    direction: 'to-bottom' | 'to-top' | 'to-right' | 'to-left';
    stops: Array<{ offset: number; color: string; opacity: number }>;
  };
  zIndex: number;
}

export interface LogoPlaceholder {
  type: 'logo';
  id: string;
  rect: Rect;
  fit: ImageFit;
  zIndex: number;
}

export type TemplatePlaceholder =
  | ImagePlaceholder
  | TextPlaceholder
  | ShapePlaceholder
  | LogoPlaceholder;

export interface SafeArea {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface TemplateSlide {
  /** Unique slide id */
  id: string;
  /** Placeholders for this slide */
  layers: TemplatePlaceholder[];
  /** Background color */
  backgroundColor?: string;
}

export interface TemplateDefinition {
  id: string;
  version: string;
  name: string;
  description: string;
  category: 'hero' | 'collage' | 'carousel';
  /** How many user images this template needs (min) */
  imageCount: number;
  /** Max images (for carousels) */
  maxImages?: number;
  /** Supported canvas formats */
  supportedFormats: CanvasFormat[];
  /** For non-carousel: single slide. For carousel: multiple slides */
  slides: Record<CanvasFormat, TemplateSlide[]>;
  /** Instagram safe areas */
  safeArea: SafeArea;
  /** Thumbnail for the template picker */
  thumbnailUrl?: string;
  /** Tags for filtering */
  tags?: string[];
}

// --- User Input / Project Types ---

export interface CropData {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface SelectedImage {
  url: string;
  order: number;
  cropData?: CropData;
}

export interface PostTexts {
  title: string;
  price: string;
  location: string;
  features: string;
  cta: string;
}

export interface PostProjectInput {
  templateId: string;
  format: CanvasFormat;
  images: SelectedImage[];
  texts: PostTexts;
  brand: BrandConfig;
  property: PropertyData;
}

// --- Export Types ---

export interface ExportFile {
  name: string;
  buffer?: Buffer;
  url?: string;
  size: number;
  slideIndex: number;
}

export interface ExportResult {
  files: ExportFile[];
  caption: string;
  hashtags: string;
}

// --- API Types ---

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
