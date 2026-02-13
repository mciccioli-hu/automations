import { NextRequest, NextResponse } from 'next/server';
import { getTemplateSummaries, getTemplateById } from '@/lib/templates/registry';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');

  if (id) {
    const template = getTemplateById(id);
    if (!template) {
      return NextResponse.json(
        { success: false, error: `Template "${id}" no encontrado.` },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: template });
  }

  const summaries = getTemplateSummaries();
  return NextResponse.json({ success: true, data: summaries });
}
