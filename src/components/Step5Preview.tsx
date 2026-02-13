'use client';

import { useState, useEffect, useCallback } from 'react';
import { PostTexts, BrandConfig, SelectedImage, CanvasFormat, TemplateSummary, PropertyData } from '@/lib/types-client';

interface Props {
  template: TemplateSummary;
  format: CanvasFormat;
  images: SelectedImage[];
  texts: PostTexts;
  brand: BrandConfig;
  property: PropertyData;
  onTextsChange: (texts: PostTexts) => void;
  onBrandChange: (brand: BrandConfig) => void;
  onGenerate: () => void;
  onBack: () => void;
  isGenerating: boolean;
}

export default function Step5Preview({
  template,
  format,
  images,
  texts,
  brand,
  property,
  onTextsChange,
  onBrandChange,
  onGenerate,
  onBack,
  isGenerating,
}: Props) {
  const [previewSlides, setPreviewSlides] = useState<string[]>([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);

  const fetchPreview = useCallback(async () => {
    setIsLoadingPreview(true);
    setPreviewError(null);

    try {
      const res = await fetch('/api/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: template.id,
          format,
          images,
          texts,
          brand,
          property,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setPreviewSlides(data.data.slides);
      } else {
        setPreviewError(data.error || 'Error al generar preview');
      }
    } catch (err: any) {
      setPreviewError(err.message || 'Error de conexión');
    } finally {
      setIsLoadingPreview(false);
    }
  }, [template.id, format, images, texts, brand, property]);

  // Fetch preview on mount and when relevant data changes
  useEffect(() => {
    const timeout = setTimeout(fetchPreview, 500);
    return () => clearTimeout(timeout);
  }, [fetchPreview]);

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-900 mb-1">Personalizá tu post</h2>
      <p className="text-gray-500 mb-6">Editá los textos y revisá el preview.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Preview */}
        <div className="order-1 lg:order-1">
          <div className="sticky top-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Preview</h3>
            <div className="bg-gray-100 rounded-2xl p-4 flex items-center justify-center min-h-[400px]">
              {isLoadingPreview ? (
                <div className="text-center text-gray-400">
                  <svg className="animate-spin w-8 h-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <p className="text-sm">Generando preview...</p>
                </div>
              ) : previewError ? (
                <div className="text-center text-red-500">
                  <svg className="w-8 h-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm">{previewError}</p>
                  <button onClick={fetchPreview} className="mt-2 text-blue-600 text-sm font-medium hover:underline">
                    Reintentar
                  </button>
                </div>
              ) : previewSlides.length > 0 ? (
                <div className="w-full">
                  <img
                    src={previewSlides[activeSlide]}
                    alt={`Preview slide ${activeSlide + 1}`}
                    className="w-full rounded-lg shadow-lg"
                  />
                  {/* Slide navigation for carousels */}
                  {previewSlides.length > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-4">
                      <button
                        onClick={() => setActiveSlide(Math.max(0, activeSlide - 1))}
                        disabled={activeSlide === 0}
                        className="px-3 py-1.5 rounded-lg bg-white shadow text-sm disabled:opacity-30"
                      >
                        ←
                      </button>
                      {previewSlides.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveSlide(i)}
                          className={`w-2.5 h-2.5 rounded-full transition-all ${
                            i === activeSlide ? 'bg-blue-600 scale-125' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                      <button
                        onClick={() => setActiveSlide(Math.min(previewSlides.length - 1, activeSlide + 1))}
                        disabled={activeSlide === previewSlides.length - 1}
                        className="px-3 py-1.5 rounded-lg bg-white shadow text-sm disabled:opacity-30"
                      >
                        →
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-400">
                  <p className="text-sm">El preview se mostrará aquí</p>
                </div>
              )}
            </div>

            <button onClick={fetchPreview} className="mt-3 w-full py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 font-medium transition-all">
              Actualizar preview
            </button>
          </div>
        </div>

        {/* Edit panel */}
        <div className="order-2 lg:order-2 space-y-5">
          <h3 className="text-sm font-semibold text-gray-700">Textos del post</h3>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Título corto</label>
            <input
              type="text"
              value={texts.title}
              onChange={(e) => onTextsChange({ ...texts, title: e.target.value })}
              placeholder="Depto 2 amb en Palermo"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Precio</label>
            <input
              type="text"
              value={texts.price}
              onChange={(e) => onTextsChange({ ...texts, price: e.target.value })}
              placeholder="USD 195.000"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Ubicación</label>
            <input
              type="text"
              value={texts.location}
              onChange={(e) => onTextsChange({ ...texts, location: e.target.value })}
              placeholder="Palermo, CABA"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Features</label>
            <input
              type="text"
              value={texts.features}
              onChange={(e) => onTextsChange({ ...texts, features: e.target.value })}
              placeholder="2 amb • 55 m² • balcón • amenities"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">CTA (llamada a la acción)</label>
            <input
              type="text"
              value={texts.cta}
              onChange={(e) => onTextsChange({ ...texts, cta: e.target.value })}
              placeholder="Consultá por WhatsApp"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Brand config */}
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Branding</h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Nombre de la inmobiliaria</label>
                <input
                  type="text"
                  value={brand.agencyName}
                  onChange={(e) => onBrandChange({ ...brand, agencyName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">URL del logo (opcional)</label>
                <input
                  type="url"
                  value={brand.logoUrl}
                  onChange={(e) => onBrandChange({ ...brand, logoUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Color primario</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={brand.primaryColor}
                      onChange={(e) => onBrandChange({ ...brand, primaryColor: e.target.value })}
                      className="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={brand.primaryColor}
                      onChange={(e) => onBrandChange({ ...brand, primaryColor: e.target.value })}
                      className="flex-1 px-2 py-2 rounded-lg border border-gray-300 text-gray-900 text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Color secundario</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={brand.secondaryColor}
                      onChange={(e) => onBrandChange({ ...brand, secondaryColor: e.target.value })}
                      className="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={brand.secondaryColor}
                      onChange={(e) => onBrandChange({ ...brand, secondaryColor: e.target.value })}
                      className="flex-1 px-2 py-2 rounded-lg border border-gray-300 text-gray-900 text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Instagram</label>
                  <input
                    type="text"
                    value={brand.instagramHandle || ''}
                    onChange={(e) => onBrandChange({ ...brand, instagramHandle: e.target.value })}
                    placeholder="@miinmobiliaria"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">WhatsApp</label>
                  <input
                    type="text"
                    value={brand.whatsapp || ''}
                    onChange={(e) => onBrandChange({ ...brand, whatsapp: e.target.value })}
                    placeholder="541112345678"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Generate button */}
          <div className="pt-4">
            <div className="flex justify-between">
              <button onClick={onBack} className="px-6 py-2.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 font-medium transition-all">
                ← Volver
              </button>
              <button
                onClick={onGenerate}
                disabled={isGenerating}
                className="px-8 py-3 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-lg shadow-green-200"
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Generando...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Generar Post
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
