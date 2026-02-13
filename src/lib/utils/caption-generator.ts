import { PropertyData, BrandConfig } from '@/lib/types';

/**
 * Generates an Instagram caption and hashtags for a property post.
 * Uses Spanish (rioplatense) tone.
 */

const PROPERTY_TYPE_EMOJIS: Record<string, string> = {
  departamento: '🏢',
  casa: '🏡',
  ph: '🏠',
  local: '🏪',
  oficina: '🏢',
  terreno: '🌳',
  cochera: '🚗',
  default: '🏠',
};

const OPERATION_TEXT: Record<string, string> = {
  venta: 'EN VENTA',
  alquiler: 'EN ALQUILER',
};

function getPropertyEmoji(type: string): string {
  const key = type.toLowerCase();
  return PROPERTY_TYPE_EMOJIS[key] || PROPERTY_TYPE_EMOJIS.default;
}

function formatPrice(price: number | null, currency: string): string {
  if (!price) return 'Consultar precio';
  const formatted = new Intl.NumberFormat('es-AR').format(price);
  return `${currency} ${formatted}`;
}

function buildFeaturesList(property: PropertyData): string[] {
  const features: string[] = [];
  if (property.bedrooms) {
    features.push(`${property.bedrooms} ${property.bedrooms === 1 ? 'dormitorio' : 'dormitorios'}`);
  }
  if (property.bathrooms) {
    features.push(`${property.bathrooms} ${property.bathrooms === 1 ? 'baño' : 'baños'}`);
  }
  if (property.totalAreaM2) {
    features.push(`${property.totalAreaM2} m² totales`);
  }
  if (property.coveredAreaM2) {
    features.push(`${property.coveredAreaM2} m² cubiertos`);
  }
  if (property.amenities?.length) {
    features.push(...property.amenities.slice(0, 3));
  }
  return features;
}

export function generateCaption(
  property: PropertyData,
  brand: BrandConfig
): string {
  const emoji = getPropertyEmoji(property.propertyType);
  const operation = OPERATION_TEXT[property.operation] || 'EN VENTA';
  const location = [property.neighborhood, property.city].filter(Boolean).join(', ');
  const price = formatPrice(property.price, property.currency);
  const features = buildFeaturesList(property);

  let caption = '';

  // Title line
  caption += `${emoji} ${operation} | ${property.propertyType}`;
  if (location) caption += ` en ${location}`;
  caption += '\n\n';

  // Price
  caption += `💰 ${price}\n`;

  // Location
  if (location) {
    caption += `📍 ${location}`;
    if (property.province) caption += `, ${property.province}`;
    caption += '\n';
  }

  // Features
  if (features.length > 0) {
    caption += `\n✨ ${features.join(' • ')}\n`;
  }

  // Description (short)
  if (property.description) {
    const shortDesc = property.description.length > 150
      ? property.description.substring(0, 147) + '...'
      : property.description;
    caption += `\n${shortDesc}\n`;
  }

  // CTA
  caption += '\n';
  if (brand.whatsapp) {
    caption += `📱 Consultá por WhatsApp: wa.me/${brand.whatsapp.replace(/[^0-9]/g, '')}\n`;
  }
  if (brand.website) {
    caption += `🌐 ${brand.website}\n`;
  }
  if (brand.instagramHandle) {
    caption += `📸 Más propiedades: @${brand.instagramHandle.replace('@', '')}\n`;
  }

  // Agency
  caption += `\n🏢 ${brand.agencyName}`;

  return caption;
}

export function generateHashtags(property: PropertyData): string {
  const tags: string[] = [];

  // Operation
  tags.push(property.operation === 'alquiler' ? 'alquiler' : 'venta');

  // Property type
  if (property.propertyType) {
    tags.push(property.propertyType.toLowerCase().replace(/\s+/g, ''));
  }

  // Location
  if (property.neighborhood) {
    tags.push(property.neighborhood.toLowerCase().replace(/\s+/g, ''));
  }
  if (property.city) {
    tags.push(property.city.toLowerCase().replace(/\s+/g, ''));
  }
  if (property.province) {
    tags.push(property.province.toLowerCase().replace(/\s+/g, ''));
  }

  // Generic real estate tags
  tags.push(
    'inmobiliaria',
    'propiedades',
    'realestate',
    'inmuebles',
    'inversiones',
    'hogar'
  );

  // Specific features
  if (property.amenities?.length) {
    property.amenities.slice(0, 3).forEach((a) => {
      tags.push(a.toLowerCase().replace(/\s+/g, ''));
    });
  }

  // Operation-specific
  if (property.operation === 'venta') {
    tags.push('departamentoenventa', 'oportunidad');
  } else {
    tags.push('departamentoenalquiler', 'alquilar');
  }

  // Deduplicate
  const unique = [...new Set(tags)];
  return unique.map((t) => `#${t}`).join(' ');
}

/**
 * Generate default post texts from property data.
 */
export function generateDefaultTexts(
  property: PropertyData,
  brand: BrandConfig
): {
  title: string;
  price: string;
  location: string;
  features: string;
  cta: string;
} {
  // Title
  const parts: string[] = [];
  if (property.propertyType) parts.push(property.propertyType);
  if (property.bedrooms) parts.push(`${property.bedrooms} amb`);
  if (property.neighborhood) parts.push(`en ${property.neighborhood}`);
  const title = parts.join(' ') || 'Propiedad en venta';

  // Price
  const price = formatPrice(property.price, property.currency);

  // Location
  const location = [property.neighborhood, property.city].filter(Boolean).join(', ') || '';

  // Features
  const featureItems: string[] = [];
  if (property.bedrooms) featureItems.push(`${property.bedrooms} amb`);
  if (property.totalAreaM2) featureItems.push(`${property.totalAreaM2} m²`);
  if (property.bathrooms) featureItems.push(`${property.bathrooms} ${property.bathrooms === 1 ? 'baño' : 'baños'}`);
  if (property.amenities?.length) {
    featureItems.push(...property.amenities.slice(0, 2));
  }
  const features = featureItems.join(' • ');

  // CTA
  let cta = '';
  if (brand.whatsapp) {
    cta = `Consultá por WhatsApp`;
  } else if (brand.instagramHandle) {
    cta = `Más info: @${brand.instagramHandle.replace('@', '')}`;
  } else {
    cta = 'Consultanos por más información';
  }

  return { title, price, location, features, cta };
}
