'use client';

import { PropertyData } from '@/lib/types-client';

interface Props {
  data: PropertyData;
  onChange: (data: PropertyData) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step2PropertyData({ data, onChange, onNext, onBack }: Props) {
  const update = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-900 mb-1">Datos de la propiedad</h2>
      <p className="text-gray-500 mb-6">Revisá y editá los datos extraídos. Completá lo que falte.</p>

      <div className="space-y-6">
        {/* Operation + Type */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Operación</label>
            <select
              value={data.operation}
              onChange={(e) => update('operation', e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="venta">Venta</option>
              <option value="alquiler">Alquiler</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de propiedad</label>
            <select
              value={data.propertyType}
              onChange={(e) => update('propertyType', e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Departamento">Departamento</option>
              <option value="Casa">Casa</option>
              <option value="PH">PH</option>
              <option value="Local">Local</option>
              <option value="Oficina">Oficina</option>
              <option value="Terreno">Terreno</option>
              <option value="Cochera">Cochera</option>
            </select>
          </div>
        </div>

        {/* Price + Currency + Expenses */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
            <input
              type="number"
              value={data.price || ''}
              onChange={(e) => update('price', e.target.value ? Number(e.target.value) : null)}
              placeholder="195000"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Moneda</label>
            <select
              value={data.currency}
              onChange={(e) => update('currency', e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="USD">USD</option>
              <option value="ARS">ARS</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expensas</label>
            <input
              type="number"
              value={data.expenses || ''}
              onChange={(e) => update('expenses', e.target.value ? Number(e.target.value) : null)}
              placeholder="45000"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Location */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Barrio</label>
            <input
              type="text"
              value={data.neighborhood || ''}
              onChange={(e) => update('neighborhood', e.target.value)}
              placeholder="Palermo"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
            <input
              type="text"
              value={data.city || ''}
              onChange={(e) => update('city', e.target.value)}
              placeholder="CABA"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Provincia</label>
            <input
              type="text"
              value={data.province || ''}
              onChange={(e) => update('province', e.target.value)}
              placeholder="Buenos Aires"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Rooms */}
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ambientes</label>
            <input
              type="number"
              value={data.bedrooms || ''}
              onChange={(e) => update('bedrooms', e.target.value ? Number(e.target.value) : null)}
              placeholder="2"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Baños</label>
            <input
              type="number"
              value={data.bathrooms || ''}
              onChange={(e) => update('bathrooms', e.target.value ? Number(e.target.value) : null)}
              placeholder="1"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">M² totales</label>
            <input
              type="number"
              value={data.totalAreaM2 || ''}
              onChange={(e) => update('totalAreaM2', e.target.value ? Number(e.target.value) : null)}
              placeholder="55"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">M² cubiertos</label>
            <input
              type="number"
              value={data.coveredAreaM2 || ''}
              onChange={(e) => update('coveredAreaM2', e.target.value ? Number(e.target.value) : null)}
              placeholder="48"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Amenities */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amenities <span className="text-gray-400 font-normal">(separados por coma)</span>
          </label>
          <input
            type="text"
            value={data.amenities?.join(', ') || ''}
            onChange={(e) => update('amenities', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
            placeholder="SUM, Pileta, Gym, Balcón"
            className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción corta (opcional)</label>
          <textarea
            value={data.description || ''}
            onChange={(e) => update('description', e.target.value)}
            placeholder="Hermoso departamento luminoso con vista abierta..."
            rows={2}
            className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button onClick={onBack} className="px-6 py-2.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 font-medium transition-all">
          ← Volver
        </button>
        <button onClick={onNext} className="px-8 py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all">
          Continuar →
        </button>
      </div>
    </div>
  );
}
