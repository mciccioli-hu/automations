'use client';

import { useState, useEffect } from 'react';
import StepIndicator from '@/components/StepIndicator';
import Step1LinkInput from '@/components/Step1LinkInput';
import Step2PropertyData from '@/components/Step2PropertyData';
import Step3ImageSelection from '@/components/Step3ImageSelection';
import Step4TemplateSelection from '@/components/Step4TemplateSelection';
import Step5Preview from '@/components/Step5Preview';
import Step6Export from '@/components/Step6Export';
import {
  WizardState,
  PropertyImage,
  PropertyData,
  SelectedImage,
  TemplateSummary,
  CanvasFormat,
  PostTexts,
  BrandConfig,
} from '@/lib/types-client';

const DEFAULT_BRAND: BrandConfig = {
  agencyId: 'default',
  agencyName: 'Mi Inmobiliaria',
  logoUrl: '',
  primaryColor: '#1a365d',
  secondaryColor: '#e2e8f0',
  fontFamily: 'Inter',
  instagramHandle: '',
  whatsapp: '',
  website: '',
};

const DEFAULT_TEXTS: PostTexts = {
  title: '',
  price: '',
  location: '',
  features: '',
  cta: '',
};

const DEFAULT_PROPERTY: PropertyData = {
  operation: 'venta',
  propertyType: 'Departamento',
  price: null,
  currency: 'USD',
};

export default function Home() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Wizard state
  const [url, setUrl] = useState('');
  const [images, setImages] = useState<PropertyImage[]>([]);
  const [property, setProperty] = useState<PropertyData>(DEFAULT_PROPERTY);
  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);
  const [templates, setTemplates] = useState<TemplateSummary[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateSummary | null>(null);
  const [format, setFormat] = useState<CanvasFormat>('1080x1080');
  const [texts, setTexts] = useState<PostTexts>(DEFAULT_TEXTS);
  const [brand, setBrand] = useState<BrandConfig>(DEFAULT_BRAND);
  const [exportData, setExportData] = useState<{
    files: Array<{ name: string; data: string; size: number }>;
    caption: string;
    hashtags: string;
  } | null>(null);

  // Fetch templates on mount
  useEffect(() => {
    fetch('/api/templates')
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setTemplates(data.data);
        }
      })
      .catch(console.error);
  }, []);

  // Step 1: Scrape URL
  const handleScrape = async (inputUrl: string) => {
    setIsLoading(true);
    setError(null);
    setUrl(inputUrl);

    try {
      const res = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: inputUrl, useMock: true }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || 'Error al obtener datos');
        return;
      }

      setImages(data.data.images || []);
      setProperty(data.data.property || DEFAULT_PROPERTY);

      // Set default texts from scraped data
      if (data.data.defaultTexts) {
        setTexts(data.data.defaultTexts);
      }

      // Auto-select first 3 images
      const autoSelected = (data.data.images || [])
        .slice(0, 3)
        .map((img: PropertyImage, i: number) => ({
          url: img.url,
          order: i,
        }));
      setSelectedImages(autoSelected);

      setStep(2);
    } catch (err: any) {
      setError(err.message || 'Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 5: Generate export
  const handleGenerate = async () => {
    if (!selectedTemplate) return;
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: selectedTemplate.id,
          format,
          images: selectedImages,
          texts,
          brand,
          property,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || 'Error al generar las imágenes');
        return;
      }

      setExportData({
        files: data.data.files,
        caption: data.data.caption,
        hashtags: data.data.hashtags,
      });

      setStep(6);
    } catch (err: any) {
      setError(err.message || 'Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset wizard
  const handleReset = () => {
    setStep(1);
    setUrl('');
    setImages([]);
    setProperty(DEFAULT_PROPERTY);
    setSelectedImages([]);
    setSelectedTemplate(null);
    setFormat('1080x1080');
    setTexts(DEFAULT_TEXTS);
    setExportData(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <StepIndicator currentStep={step} />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 px-4 py-8">
        {step === 1 && (
          <Step1LinkInput
            onSubmit={handleScrape}
            isLoading={isLoading}
            error={error}
          />
        )}

        {step === 2 && (
          <Step2PropertyData
            data={property}
            onChange={setProperty}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        )}

        {step === 3 && (
          <Step3ImageSelection
            images={images}
            selectedImages={selectedImages}
            onSelectionChange={setSelectedImages}
            onNext={() => setStep(4)}
            onBack={() => setStep(2)}
          />
        )}

        {step === 4 && (
          <Step4TemplateSelection
            templates={templates}
            selectedTemplate={selectedTemplate}
            format={format}
            selectedImageCount={selectedImages.length}
            onSelectTemplate={setSelectedTemplate}
            onSelectFormat={setFormat}
            onNext={() => setStep(5)}
            onBack={() => setStep(3)}
          />
        )}

        {step === 5 && selectedTemplate && (
          <Step5Preview
            template={selectedTemplate}
            format={format}
            images={selectedImages}
            texts={texts}
            brand={brand}
            property={property}
            onTextsChange={setTexts}
            onBrandChange={setBrand}
            onGenerate={handleGenerate}
            onBack={() => setStep(4)}
            isGenerating={isLoading}
          />
        )}

        {step === 6 && exportData && (
          <Step6Export
            files={exportData.files}
            caption={exportData.caption}
            hashtags={exportData.hashtags}
            onCreateAnother={handleReset}
            onBack={() => setStep(5)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-4 text-center text-xs text-gray-400">
        Generador de Posteos para Inmobiliarias — v0.1.0
      </footer>
    </div>
  );
}
