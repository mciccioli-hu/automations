import { NextRequest, NextResponse } from 'next/server';
import { getTemplateById } from '@/lib/templates/registry';
import { renderPost, RenderInput } from '@/lib/rendering/image-renderer';
import { generateCaption, generateHashtags } from '@/lib/utils/caption-generator';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const body: RenderInput & { property: any } = await request.json();

    // Validate
    if (!body.templateId || !body.format || !body.images?.length || !body.texts || !body.brand) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos requeridos.' },
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

    if (body.images.length < template.imageCount) {
      return NextResponse.json(
        {
          success: false,
          error: `Este template requiere al menos ${template.imageCount} imagen(es).`,
        },
        { status: 400 }
      );
    }

    console.log(`[Export] Generating final images for template: ${body.templateId}`);
    const result = await renderPost(template, body, false);

    const exportId = uuidv4();

    // Generate caption and hashtags
    const caption = body.property
      ? generateCaption(body.property, body.brand)
      : '';
    const hashtags = body.property
      ? generateHashtags(body.property)
      : '';

    // Convert buffers to base64 for download
    const files = result.slides.map((buffer, index) => ({
      name: result.slides.length === 1
        ? `post-${body.templateId}.png`
        : `post-${body.templateId}-slide-${index + 1}.png`,
      data: buffer.toString('base64'),
      size: buffer.length,
      slideIndex: index,
    }));

    return NextResponse.json({
      success: true,
      data: {
        exportId,
        files,
        caption,
        hashtags,
        slideCount: files.length,
      },
    });
  } catch (error: any) {
    console.error('[Export] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error al generar las imágenes finales.' },
      { status: 500 }
    );
  }
}
