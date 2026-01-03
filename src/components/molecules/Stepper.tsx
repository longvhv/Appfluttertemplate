import React from 'react';
import { Check } from 'lucide-react';

export interface Step {
  label: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface StepperProps {
  steps: Step[];
  currentStep: number;
  onChange?: (step: number) => void;
  orientation?: 'horizontal' | 'vertical';
  allowClickable?: boolean;
  className?: string;
}

export function Stepper({
  steps,
  currentStep,
  onChange,
  orientation = 'horizontal',
  allowClickable = false,
  className = '',
}: StepperProps) {
  const handleStepClick = (index: number) => {
    if (allowClickable && onChange && index <= currentStep) {
      onChange(index);
    }
  };

  if (orientation === 'vertical') {
    return (
      <div className={`flex flex-col ${className}`}>
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const Icon = step.icon;
          const isClickable = allowClickable && index <= currentStep;

          return (
            <div key={index} className="flex gap-4">
              {/* Left side - Icon */}
              <div className="flex flex-col items-center">
                <button
                  onClick={() => handleStepClick(index)}
                  disabled={!isClickable}
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    transition-all flex-shrink-0
                    ${isCompleted
                      ? 'bg-indigo-600 text-white'
                      : isCurrent
                      ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 dark:ring-indigo-950/50'
                      : 'bg-muted dark:bg-muted text-muted-foreground'
                    }
                    ${isClickable ? 'cursor-pointer hover:scale-110' : 'cursor-default'}
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : Icon ? (
                    <Icon className="w-5 h-5" />
                  ) : (
                    <span className="font-medium">{index + 1}</span>
                  )}
                </button>
                {index < steps.length - 1 && (
                  <div
                    className={`w-0.5 h-12 my-1 ${
                      isCompleted ? 'bg-indigo-600' : 'bg-border dark:bg-border'
                    }`}
                  />
                )}
              </div>

              {/* Right side - Content */}
              <div className="pb-8 flex-1">
                <h4
                  className={`font-medium ${
                    isCurrent
                      ? 'text-foreground'
                      : isCompleted
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                  }`}
                >
                  {step.label}
                </h4>
                {step.description && (
                  <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Horizontal orientation
  return (
    <div className={`flex items-center ${className}`}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const Icon = step.icon;
        const isClickable = allowClickable && index <= currentStep;

        return (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={() => handleStepClick(index)}
                disabled={!isClickable}
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  transition-all flex-shrink-0
                  ${isCompleted
                    ? 'bg-indigo-600 text-white'
                    : isCurrent
                    ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 dark:ring-indigo-950/50'
                    : 'bg-muted dark:bg-muted text-muted-foreground'
                  }
                  ${isClickable ? 'cursor-pointer hover:scale-110' : 'cursor-default'}
                `}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : Icon ? (
                  <Icon className="w-5 h-5" />
                ) : (
                  <span className="font-medium">{index + 1}</span>
                )}
              </button>
              <div className="text-center">
                <p
                  className={`text-sm font-medium ${
                    isCurrent
                      ? 'text-foreground'
                      : isCompleted
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                  }`}
                >
                  {step.label}
                </p>
                {step.description && (
                  <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                )}
              </div>
            </div>

            {index < steps.length - 1 && (
              <div
                className={`h-0.5 flex-1 mx-4 ${
                  isCompleted ? 'bg-indigo-600' : 'bg-border dark:bg-border'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// Simple dot stepper
export interface DotStepperProps {
  totalSteps: number;
  currentStep: number;
  onChange?: (step: number) => void;
  size?: 'sm' | 'md' | 'lg';
}

export function DotStepper({
  totalSteps,
  currentStep,
  onChange,
  size = 'md',
}: DotStepperProps) {
  const dotSize = size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4';

  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <button
          key={index}
          onClick={() => onChange?.(index)}
          className={`
            rounded-full transition-all
            ${dotSize}
            ${index === currentStep
              ? 'bg-indigo-600 scale-125'
              : index < currentStep
              ? 'bg-indigo-400'
              : 'bg-gray-300 dark:bg-gray-700'
            }
            ${onChange ? 'cursor-pointer hover:scale-110' : 'cursor-default'}
          `}
        />
      ))}
    </div>
  );
}
