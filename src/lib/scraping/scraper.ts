import { ScrapeResult, PropertyData, PropertyImage, SourceMetadata } from '@/lib/types';

/**
 * Scraping module — Uses ScrapingBee to fetch and parse property listings.
 *
 * This module provides a normalized interface for scraping different portals.
 * Currently supports: Zonaprop, Mercado Libre (inmuebles), Argenprop.
 *
 * IMPORTANT: Requires SCRAPINGBEE_API_KEY environment variable.
 */

const SCRAPINGBEE_API_KEY = process.env.SCRAPINGBEE_API_KEY || '';
const SCRAPINGBEE_URL = 'https://app.scrapingbee.com/api/v1/';

function detectPortal(url: string): string {
  if (url.includes('zonaprop.com')) return 'zonaprop';
  if (url.includes('mercadolibre.com') || url.includes('inmuebles.mercadolibre')) return 'mercadolibre';
  if (url.includes('argenprop.com')) return 'argenprop';
  if (url.includes('properati.com')) return 'properati';
  throw new Error(`Portal no soportado. URL: ${url}. Portales soportados: Zonaprop, Mercado Libre, Argenprop.`);
}

/**
 * Fetch the raw HTML of a page using ScrapingBee.
 */
async function fetchPageHtml(url: string): Promise<string> {
  if (!SCRAPINGBEE_API_KEY) {
    throw new Error(
      'SCRAPINGBEE_API_KEY no está configurada. Configurala en las variables de entorno.'
    );
  }

  const params = new URLSearchParams({
    api_key: SCRAPINGBEE_API_KEY,
    url: url,
    render_js: 'true',
    wait: '3000',
  });

  const response = await fetch(`${SCRAPINGBEE_URL}?${params.toString()}`, {
    signal: AbortSignal.timeout(30000),
  });

  if (!response.ok) {
    throw new Error(`ScrapingBee error: ${response.status} ${response.statusText}`);
  }

  return response.text();
}

/**
 * Extract images from Zonaprop HTML.
 * Zonaprop uses a gallery with high-res images in data attributes.
 */
function extractZonapropImages(html: string): PropertyImage[] {
  const images: PropertyImage[] = [];

  // Look for image URLs in the HTML (various patterns Zonaprop uses)
  const patterns = [
    /https?:\/\/[^"'\s]+\.(?:jpg|jpeg|png|webp)(?:\?[^"'\s]*)?/gi,
  ];

  const urls = new Set<string>();
  for (const pattern of patterns) {
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(html)) !== null) {
      let url = match[0];
      // Filter to only property images (Zonaprop uses specific CDN patterns)
      if (
        url.includes('img') &&
        !url.includes('logo') &&
        !url.includes('favicon') &&
        !url.includes('avatar') &&
        !url.includes('icon') &&
        !url.includes('sprite') &&
        !url.includes('banner') &&
        !url.includes('.svg')
      ) {
        // Try to get the highest resolution version
        url = url.replace(/\/thumbs\//, '/').replace(/\d+x\d+/, '1200x900');
        urls.add(url);
      }
    }
  }

  urls.forEach((url) => {
    images.push({ url });
  });

  return images;
}

/**
 * Extract property data from Zonaprop HTML using regex patterns.
 */
function extractZonapropData(html: string): Partial<PropertyData> {
  const data: Partial<PropertyData> = {
    operation: 'venta',
    currency: 'USD',
  };

  // Operation type
  if (/alquiler|alquilar|rent/i.test(html)) {
    data.operation = 'alquiler';
  }

  // Price - look for common patterns
  const priceMatch = html.match(/(?:USD|U\$S|US\$|ARS|\$)\s*([\d.,]+)/i);
  if (priceMatch) {
    const priceStr = priceMatch[1].replace(/\./g, '').replace(',', '.');
    data.price = parseFloat(priceStr) || null;
    if (/ARS|\$(?!.*U)/i.test(priceMatch[0])) {
      data.currency = 'ARS';
    }
  }

  // Property type
  const typeMatch = html.match(/(?:tipo de propiedad|property type)[:\s]*([^<,]+)/i);
  if (typeMatch) {
    data.propertyType = typeMatch[1].trim();
  } else if (/departamento/i.test(html)) {
    data.propertyType = 'Departamento';
  } else if (/casa/i.test(html)) {
    data.propertyType = 'Casa';
  } else if (/ph\b/i.test(html)) {
    data.propertyType = 'PH';
  }

  // Rooms/ambientes
  const ambientsMatch = html.match(/(\d+)\s*(?:ambientes?|amb)/i);
  if (ambientsMatch) {
    data.bedrooms = parseInt(ambientsMatch[1]);
  }

  // Bathrooms
  const bathMatch = html.match(/(\d+)\s*(?:baños?|bath)/i);
  if (bathMatch) {
    data.bathrooms = parseInt(bathMatch[1]);
  }

  // Area
  const areaMatch = html.match(/(\d+)\s*m[²2]\s*(?:totales?|total)/i);
  if (areaMatch) {
    data.totalAreaM2 = parseInt(areaMatch[1]);
  }
  const coveredMatch = html.match(/(\d+)\s*m[²2]\s*(?:cubiertos?|covered)/i);
  if (coveredMatch) {
    data.coveredAreaM2 = parseInt(coveredMatch[1]);
  }

  // Location - try various patterns
  const neighborhoodMatch = html.match(/(?:barrio|neighborhood)[:\s]*([^<,]+)/i);
  if (neighborhoodMatch) {
    data.neighborhood = neighborhoodMatch[1].trim();
  }

  return data;
}

/**
 * Main scrape function — fetches and normalizes data from any supported portal.
 */
export async function scrapeProperty(url: string): Promise<ScrapeResult> {
  const portal = detectPortal(url);
  const scrapedAt = new Date().toISOString();

  const html = await fetchPageHtml(url);

  let images: PropertyImage[] = [];
  let propertyData: Partial<PropertyData> = {};

  switch (portal) {
    case 'zonaprop':
      images = extractZonapropImages(html);
      propertyData = extractZonapropData(html);
      break;
    case 'mercadolibre':
    case 'argenprop':
      // For now, use generic extraction (same patterns work for most portals)
      images = extractZonapropImages(html); // Generic image extraction
      propertyData = extractZonapropData(html); // Generic data extraction
      break;
    default:
      throw new Error(`Parser no implementado para: ${portal}`);
  }

  // Normalize and fill defaults
  const property: PropertyData = {
    operation: propertyData.operation || 'venta',
    propertyType: propertyData.propertyType || 'Propiedad',
    price: propertyData.price || null,
    currency: propertyData.currency || 'USD',
    expenses: propertyData.expenses || null,
    address: propertyData.address || '',
    neighborhood: propertyData.neighborhood || '',
    city: propertyData.city || '',
    province: propertyData.province || '',
    bedrooms: propertyData.bedrooms || null,
    bathrooms: propertyData.bathrooms || null,
    totalAreaM2: propertyData.totalAreaM2 || null,
    coveredAreaM2: propertyData.coveredAreaM2 || null,
    amenities: propertyData.amenities || [],
    description: propertyData.description || '',
  };

  const source: SourceMetadata = {
    portal,
    scrapedAt,
    originalUrl: url,
  };

  return { images, property, source };
}

/**
 * Create a mock scrape result for testing/demo purposes.
 */
export function createMockScrapeResult(url: string): ScrapeResult {
  return {
    images: [
      { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop', width: 1200, height: 800 },
      { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=800&fit=crop', width: 1200, height: 800 },
      { url: 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=1200&h=800&fit=crop', width: 1200, height: 800 },
      { url: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&h=800&fit=crop', width: 1200, height: 800 },
      { url: 'https://images.unsplash.com/photo-1560440021-33f9b867899d?w=1200&h=800&fit=crop', width: 1200, height: 800 },
      { url: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&h=800&fit=crop', width: 1200, height: 800 },
    ],
    property: {
      operation: 'venta',
      propertyType: 'Departamento',
      price: 195000,
      currency: 'USD',
      expenses: 45000,
      address: 'Thames 1234',
      neighborhood: 'Palermo',
      city: 'CABA',
      province: 'Buenos Aires',
      bedrooms: 2,
      bathrooms: 1,
      totalAreaM2: 55,
      coveredAreaM2: 48,
      amenities: ['SUM', 'Pileta', 'Gym', 'Balcón'],
      description: 'Hermoso departamento de 2 ambientes con balcón y amenities de primer nivel. Luminoso, con vista abierta.',
    },
    source: {
      portal: detectPortal(url) || 'demo',
      scrapedAt: new Date().toISOString(),
      originalUrl: url,
    },
  };
}
