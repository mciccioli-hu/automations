import { NextRequest, NextResponse } from 'next/server';
import { getTemplateById } from '@/lib/templates/registry';
import { renderPreview, RenderInput } from '@/lib/rendering/image-renderer';

export async function POST(request: NextRequest) {
  try {
    const body: RenderInput = await request.json();

    // Validate required fields
    if (!body.templateId || !body.format || !body.images?.length || !body.texts || !body.brand) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos requeridos: templateId, format, images, texts, brand.' },
        { status: 400 }
      );
    }

    const template = getTemplateById(body.templateId);
    if (!template) {
      return NextResponse.json(
        { success: false, error: `Template "${body.templateId}" no encontrado.` },
        { status: 404 }
      );
    }

    // Check image count
    if (body.images.length < template.imageCount) {
      return NextResponse.json(
        {
          success: false,
          error: `Este template requiere al menos ${template.imageCount} imagen(es). Recibidas: ${body.images.length}.`,
        },
        { status: 400 }
      );
    }

    console.log(`[Preview] Generating preview for template: ${body.templateId}, format: ${body.format}`);
    const previews = await renderPreview(template, body);

    // Convert to base64 for preview
    const previewDataUrls = previews.map(
      (buf) => `data:image/jpeg;base64,${buf.toString('base64')}`
    );

    return NextResponse.json({
      success: true,
      data: {
        slides: previewDataUrls,
        slideCount: previewDataUrls.length,
      },
    });
  } catch (error: any) {
    console.error('[Preview] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error al generar preview.' },
      { status: 500 }
    );
  }
}
