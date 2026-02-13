'use client';

import { TemplateSummary, CanvasFormat } from '@/lib/types-client';

interface Props {
  templates: TemplateSummary[];
  selectedTemplate: TemplateSummary | null;
  format: CanvasFormat;
  selectedImageCount: number;
  onSelectTemplate: (template: TemplateSummary) => void;
  onSelectFormat: (format: CanvasFormat) => void;
  onNext: () => void;
  onBack: () => void;
}

const FORMAT_LABELS: Record<CanvasFormat, { label: string; aspect: string }> = {
  '1080x1080': { label: 'Cuadrado', aspect: '1:1' },
  '1080x1350': { label: 'Vertical', aspect: '4:5' },
  '1080x1920': { label: 'Stories', aspect: '9:16' },
};

const CATEGORY_LABELS: Record<string, string> = {
  hero: 'Hero',
  collage: 'Collage',
  carousel: 'Carrusel',
};

const CATEGORY_ICONS: Record<string, string> = {
  hero: '🖼️',
  collage: '🎨',
  carousel: '📱',
};

export default function Step4TemplateSelection({
  templates,
  selectedTemplate,
  format,
  selectedImageCount,
  onSelectTemplate,
  onSelectFormat,
  onNext,
  onBack,
}: Props) {
  // Filter templates by selected format and available images
  const availableTemplates = templates.filter(
    (t) =>
      t.supportedFormats.includes(format) &&
      selectedImageCount >= t.imageCount
  );

  const unavailableTemplates = templates.filter(
    (t) =>
      !t.supportedFormats.includes(format) ||
      selectedImageCount < t.imageCount
  );

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-900 mb-1">Elegí un template</h2>
      <p className="text-gray-500 mb-6">Seleccioná el diseño y formato para tu post.</p>

      {/* Format selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Formato</label>
        <div className="flex gap-3">
          {(Object.keys(FORMAT_LABELS) as CanvasFormat[]).map((f) => (
            <button
              key={f}
              onClick={() => onSelectFormat(f)}
              className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all text-center
                ${
                  format === f
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
            >
              <div className="font-semibold text-sm">{FORMAT_LABELS[f].label}</div>
              <div className="text-xs text-gray-400 mt-0.5">{f} ({FORMAT_LABELS[f].aspect})</div>
            </button>
          ))}
        </div>
      </div>

      {/* Templates grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
        {availableTemplates.map((template) => (
          <div
            key={template.id}
            onClick={() => onSelectTemplate(template)}
            className={`template-card ${selectedTemplate?.id === template.id ? 'selected' : ''}`}
          >
            {/* Template preview placeholder */}
            <div className="aspect-square rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 mb-3 flex items-center justify-center relative overflow-hidden">
              <div className="text-4xl">{CATEGORY_ICONS[template.category] || '📐'}</div>
              {/* Miniature layout representation */}
              <div className="absolute inset-2 pointer-events-none">
                {template.category === 'hero' && (
                  <div className="w-full h-full rounded bg-gray-300/50 flex items-end p-2">
                    <div className="w-2/3 space-y-1">
                      <div className="h-2 bg-gray-400/50 rounded w-full" />
                      <div className="h-3 bg-gray-400/70 rounded w-3/4" />
                      <div className="h-1.5 bg-gray-400/40 rounded w-1/2" />
                    </div>
                  </div>
                )}
                {template.category === 'collage' && template.imageCount === 2 && (
                  <div className="w-full h-3/4 flex gap-1">
                    <div className="flex-1 bg-gray-300/60 rounded" />
                    <div className="flex-1 bg-gray-300/60 rounded" />
                  </div>
                )}
                {template.category === 'collage' && template.imageCount === 3 && (
                  <div className="w-full h-3/4 flex flex-col gap-1">
                    <div className="flex-1 bg-gray-300/60 rounded" />
                    <div className="flex-1 flex gap-1">
                      <div className="flex-1 bg-gray-300/60 rounded" />
                      <div className="flex-1 bg-gray-300/60 rounded" />
                    </div>
                  </div>
                )}
                {template.category === 'collage' && template.imageCount === 4 && (
                  <div className="w-full h-3/4 grid grid-cols-2 gap-1">
                    <div className="bg-gray-300/60 rounded" />
                    <div className="bg-gray-300/60 rounded" />
                    <div className="bg-gray-300/60 rounded" />
                    <div className="bg-gray-300/60 rounded" />
                  </div>
                )}
                {template.category === 'carousel' && (
                  <div className="w-full h-full flex gap-1">
                    <div className="flex-1 bg-gray-300/60 rounded flex items-end p-1">
                      <div className="w-full space-y-0.5">
                        <div className="h-1.5 bg-gray-400/50 rounded w-3/4" />
                        <div className="h-1 bg-gray-400/30 rounded w-1/2" />
                      </div>
                    </div>
                    <div className="w-3 bg-gray-300/30 rounded" />
                    <div className="w-2 bg-gray-300/20 rounded" />
                  </div>
                )}
              </div>

              {selectedTemplate?.id === template.id && (
                <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 text-sm">{template.name}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{template.description}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  {CATEGORY_LABELS[template.category]}
                </span>
                <span className="text-xs text-gray-400">
                  {template.imageCount === 1
                    ? '1 foto'
                    : template.maxImages
                    ? `${template.imageCount}-${template.maxImages} fotos`
                    : `${template.imageCount} fotos`}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Unavailable templates */}
      {unavailableTemplates.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-400 mb-3">
            No disponibles (necesitás más imágenes o no soportan este formato)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 opacity-40 pointer-events-none">
            {unavailableTemplates.map((template) => (
              <div key={template.id} className="template-card">
                <div className="aspect-square rounded-lg bg-gray-100 mb-3 flex items-center justify-center">
                  <span className="text-2xl text-gray-400">{CATEGORY_ICONS[template.category] || '📐'}</span>
                </div>
                <h3 className="font-semibold text-gray-500 text-sm">{template.name}</h3>
                <p className="text-xs text-gray-400">
                  Requiere {template.imageCount} fotos
                  {!template.supportedFormats.includes(format) && ` • No soporta ${format}`}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button onClick={onBack} className="px-6 py-2.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 font-medium transition-all">
          ← Volver
        </button>
        <button
          onClick={onNext}
          disabled={!selectedTemplate}
          className="px-8 py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
        >
          Continuar al editor →
        </button>
      </div>
    </div>
  );
}
