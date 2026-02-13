'use client';

import { useState } from 'react';

interface ExportFile {
  name: string;
  data: string;
  size: number;
}

interface Props {
  files: ExportFile[];
  caption: string;
  hashtags: string;
  onCreateAnother: () => void;
  onBack: () => void;
}

export default function Step6Export({
  files,
  caption,
  hashtags,
  onCreateAnother,
  onBack,
}: Props) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [captionCopied, setCaptionCopied] = useState(false);

  const downloadFile = (file: ExportFile) => {
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${file.data}`;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAll = () => {
    // Download each file individually (ZIP would require additional library on client)
    files.forEach((file, i) => {
      setTimeout(() => downloadFile(file), i * 200);
    });
  };

  const copyCaption = () => {
    const fullText = `${caption}\n\n${hashtags}`;
    navigator.clipboard.writeText(fullText).then(() => {
      setCaptionCopied(true);
      setTimeout(() => setCaptionCopied(false), 2000);
    });
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Success header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Tu post está listo!</h2>
        <p className="text-gray-500">
          {files.length === 1
            ? '1 imagen generada'
            : `${files.length} imágenes generadas (carrusel)`}
        </p>
      </div>

      {/* Preview */}
      <div className="bg-gray-100 rounded-2xl p-6 mb-6">
        <div className="max-w-md mx-auto">
          <img
            src={`data:image/png;base64,${files[activeSlide]?.data}`}
            alt={`Slide ${activeSlide + 1}`}
            className="w-full rounded-lg shadow-xl"
          />

          {files.length > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <button
                onClick={() => setActiveSlide(Math.max(0, activeSlide - 1))}
                disabled={activeSlide === 0}
                className="px-3 py-1.5 rounded-lg bg-white shadow text-sm disabled:opacity-30"
              >
                ←
              </button>
              {files.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveSlide(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    i === activeSlide ? 'bg-blue-600 scale-125' : 'bg-gray-300'
                  }`}
                />
              ))}
              <button
                onClick={() => setActiveSlide(Math.min(files.length - 1, activeSlide + 1))}
                disabled={activeSlide === files.length - 1}
                className="px-3 py-1.5 rounded-lg bg-white shadow text-sm disabled:opacity-30"
              >
                →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Download buttons */}
      <div className="flex flex-wrap gap-3 mb-8">
        {files.length === 1 ? (
          <button
            onClick={() => downloadFile(files[0])}
            className="flex-1 py-3 px-6 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Descargar imagen ({formatSize(files[0].size)})
          </button>
        ) : (
          <>
            <button
              onClick={() => downloadFile(files[activeSlide])}
              className="flex-1 py-3 px-6 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Descargar slide {activeSlide + 1}
            </button>
            <button
              onClick={downloadAll}
              className="flex-1 py-3 px-6 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Descargar todas ({files.length} slides)
            </button>
          </>
        )}
      </div>

      {/* Caption */}
      {(caption || hashtags) && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">Caption sugerido</h3>
            <button
              onClick={copyCaption}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                captionCopied
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {captionCopied ? 'Copiado!' : 'Copiar caption'}
            </button>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-line font-mono leading-relaxed">
            {caption}
          </div>
          {hashtags && (
            <div className="mt-3 bg-blue-50 rounded-lg p-3 text-xs text-blue-700 font-mono">
              {hashtags}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={onCreateAnother}
          className="flex-1 py-3 px-6 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Crear otro post
        </button>
        <button
          onClick={onBack}
          className="py-3 px-6 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-all"
        >
          Editar este post
        </button>
      </div>
    </div>
  );
}
