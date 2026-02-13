'use client';

import { useState, useCallback } from 'react';
import { PropertyImage, SelectedImage } from '@/lib/types-client';

interface Props {
  images: PropertyImage[];
  selectedImages: SelectedImage[];
  onSelectionChange: (selected: SelectedImage[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step3ImageSelection({
  images,
  selectedImages,
  onSelectionChange,
  onNext,
  onBack,
}: Props) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const isSelected = useCallback(
    (url: string) => selectedImages.some((img) => img.url === url),
    [selectedImages]
  );

  const toggleImage = (image: PropertyImage) => {
    if (isSelected(image.url)) {
      onSelectionChange(
        selectedImages
          .filter((img) => img.url !== image.url)
          .map((img, i) => ({ ...img, order: i }))
      );
    } else {
      onSelectionChange([
        ...selectedImages,
        { url: image.url, order: selectedImages.length },
      ]);
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newSelected = [...selectedImages];
    const [dragged] = newSelected.splice(draggedIndex, 1);
    newSelected.splice(index, 0, dragged);
    const reordered = newSelected.map((img, i) => ({ ...img, order: i }));
    onSelectionChange(reordered);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-900 mb-1">Seleccioná las imágenes</h2>
      <p className="text-gray-500 mb-6">
        Hacé click para seleccionar. {selectedImages.length > 0 && 'Arrastrá para reordenar las seleccionadas.'}
      </p>

      {/* Selected images (reorderable) */}
      {selectedImages.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-xs font-bold">
              {selectedImages.length}
            </span>
            Seleccionadas (arrastrá para reordenar)
          </h3>
          <div className="flex gap-3 overflow-x-auto pb-3">
            {selectedImages.map((img, index) => (
              <div
                key={img.url}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`relative flex-shrink-0 w-28 h-28 rounded-lg overflow-hidden cursor-grab active:cursor-grabbing border-2 transition-all
                  ${draggedIndex === index ? 'border-blue-400 opacity-50 scale-95' : 'border-blue-500'}`}
              >
                <img
                  src={img.url}
                  alt={`Seleccionada ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute top-1 left-1 w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                  {index + 1}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleImage({ url: img.url });
                  }}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All images grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
        {images.map((image, index) => {
          const selected = isSelected(image.url);
          const selectionOrder = selectedImages.findIndex((img) => img.url === image.url);

          return (
            <div
              key={image.url}
              onClick={() => toggleImage(image)}
              className={`image-grid-item aspect-square ${selected ? 'selected' : ''}`}
            >
              <img
                src={image.url}
                alt={`Imagen ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {selected && (
                <div className="absolute top-2 left-2 w-7 h-7 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center shadow-lg">
                  {selectionOrder + 1}
                </div>
              )}
              {!selected && (
                <div className="absolute top-2 left-2 w-7 h-7 rounded-full border-2 border-white bg-black/30 shadow-lg" />
              )}
            </div>
          );
        })}
      </div>

      {images.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          No se encontraron imágenes.
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button onClick={onBack} className="px-6 py-2.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 font-medium transition-all">
          ← Volver
        </button>
        <button
          onClick={onNext}
          disabled={selectedImages.length === 0}
          className="px-8 py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
        >
          Continuar →
        </button>
      </div>
    </div>
  );
}
