'use client';

interface Step {
  number: number;
  label: string;
}

const STEPS: Step[] = [
  { number: 1, label: 'Link' },
  { number: 2, label: 'Datos' },
  { number: 3, label: 'Imágenes' },
  { number: 4, label: 'Template' },
  { number: 5, label: 'Preview' },
  { number: 6, label: 'Export' },
];

export default function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center gap-1 px-4 py-4">
      {STEPS.map((step, idx) => (
        <div key={step.number} className="flex items-center">
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-all duration-300
              ${
                step.number < currentStep
                  ? 'bg-green-500 text-white'
                  : step.number === currentStep
                  ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                  : 'bg-gray-200 text-gray-400'
              }`}
          >
            {step.number < currentStep ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              step.number
            )}
          </div>
          <span
            className={`ml-1.5 text-xs font-medium hidden sm:inline
              ${step.number === currentStep ? 'text-blue-600' : step.number < currentStep ? 'text-green-600' : 'text-gray-400'}`}
          >
            {step.label}
          </span>
          {idx < STEPS.length - 1 && (
            <div
              className={`w-6 sm:w-10 h-0.5 mx-1.5 transition-colors duration-300
                ${step.number < currentStep ? 'bg-green-400' : 'bg-gray-200'}`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
