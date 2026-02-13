import { NextRequest, NextResponse } from 'next/server';
import { scrapeProperty, createMockScrapeResult } from '@/lib/scraping/scraper';
import { generateDefaultTexts } from '@/lib/utils/caption-generator';
import { ApiResponse, ScrapeResult, BrandConfig } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, useMock } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Se requiere una URL válida.' } satisfies ApiResponse<never>,
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { success: false, error: 'El formato de la URL no es válido.' } satisfies ApiResponse<never>,
        { status: 400 }
      );
    }

    let result: ScrapeResult;

    if (useMock || !process.env.SCRAPINGBEE_API_KEY) {
      // Use mock data for demo/testing
      console.log('[Scrape] Using mock data (no SCRAPINGBEE_API_KEY or useMock=true)');
      result = createMockScrapeResult(url);
    } else {
      console.log(`[Scrape] Scraping URL: ${url}`);
      result = await scrapeProperty(url);
    }

    // Generate default texts for convenience
    const defaultBrand: BrandConfig = {
      agencyId: 'default',
      agencyName: 'Mi Inmobiliaria',
      logoUrl: '',
      primaryColor: '#1a365d',
      secondaryColor: '#e2e8f0',
      fontFamily: 'Inter',
    };

    const defaultTexts = generateDefaultTexts(result.property, defaultBrand);

    return NextResponse.json({
      success: true,
      data: {
        ...result,
        defaultTexts,
      },
    } satisfies ApiResponse<ScrapeResult & { defaultTexts: typeof defaultTexts }>);
  } catch (error: any) {
    console.error('[Scrape] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Error al obtener datos de la publicación.',
      } satisfies ApiResponse<never>,
      { status: 500 }
    );
  }
}
