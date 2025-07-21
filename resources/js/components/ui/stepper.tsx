import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  current: boolean;
}

interface StepperProps {
  steps: Step[];
  className?: string;
}

export function Stepper({ steps, className = '' }: StepperProps) {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <div
                className={`
                  flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200
                  ${
                    step.completed
                      ? 'bg-green-500 border-green-500 text-white'
                      : step.current
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : 'bg-white border-gray-300 text-gray-500'
                  }
                `}
              >
                {step.completed ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-medium">{step.id}</span>
                )}
              </div>
              
              {/* Step Title */}
              <div className="mt-2 text-center">
                <p
                  className={`text-sm font-medium ${
                    step.current ? 'text-blue-600' : step.completed ? 'text-green-600' : 'text-gray-500'
                  }`}
                >
                  {step.title}
                </p>
                {step.description && (
                  <p className="text-xs text-gray-400 mt-1">{step.description}</p>
                )}
              </div>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-4 transition-all duration-200 ${
                  step.completed ? 'bg-green-500' : 'bg-gray-300'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
