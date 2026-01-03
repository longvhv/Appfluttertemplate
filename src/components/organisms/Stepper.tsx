import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ChevronLeft, ChevronRight, type LucideIcon } from 'lucide-react';
import { Button } from '../atoms/Button';

export interface StepItem {
  id: string;
  label: string;
  description?: string;
  icon?: LucideIcon;
  optional?: boolean;
  content?: React.ReactNode;
}

export interface StepperProps {
  steps: StepItem[];
  currentStep?: number;
  onStepChange?: (step: number) => void;
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'numbered' | 'dots';
  onComplete?: () => void;
  allowStepClick?: boolean;
  className?: string;
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep: controlledStep,
  onStepChange,
  orientation = 'horizontal',
  variant = 'default',
  onComplete,
  allowStepClick = false,
  className = '',
}) => {
  const [internalStep, setInternalStep] = useState(0);
  const currentStep = controlledStep !== undefined ? controlledStep : internalStep;

  const handleStepChange = (step: number) => {
    if (step < 0 || step >= steps.length) return;
    
    if (onStepChange) {
      onStepChange(step);
    } else {
      setInternalStep(step);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      handleStepChange(currentStep + 1);
    } else if (onComplete) {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      handleStepChange(currentStep - 1);
    }
  };

  const handleStepClick = (index: number) => {
    if (allowStepClick && index < currentStep) {
      handleStepChange(index);
    }
  };

  const activeStepData = steps[currentStep];

  return (
    <div className={`${className}`}>
      {/* Steps Header */}
      <div
        className={`
          flex ${orientation === 'vertical' ? 'flex-col' : 'flex-row items-center'}
          ${orientation === 'horizontal' ? 'mb-8' : 'mb-0'}
        `}
      >
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;
          const isClickable = allowStepClick && index < currentStep;

          return (
            <React.Fragment key={step.id}>
              <div className={`flex ${orientation === 'vertical' ? 'w-full' : 'flex-col items-center'}`}>
                {/* Step Circle */}
                <button
                  onClick={() => handleStepClick(index)}
                  disabled={!isClickable}
                  className={`
                    relative flex items-center justify-center
                    ${variant === 'dots' ? 'w-3 h-3' : 'w-10 h-10'}
                    rounded-full transition-all
                    ${isCompleted
                      ? 'bg-blue-600 text-white'
                      : isActive
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100 dark:ring-blue-900'
                      : 'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                    }
                    ${isClickable ? 'cursor-pointer hover:scale-110' : 'cursor-default'}
                  `}
                >
                  {variant === 'dots' ? null : isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : variant === 'numbered' ? (
                    <span className="text-sm font-semibold">{index + 1}</span>
                  ) : Icon ? (
                    <Icon className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-semibold">{index + 1}</span>
                  )}
                </button>

                {/* Step Label */}
                {variant !== 'dots' && (
                  <div className={`
                    ${orientation === 'vertical' ? 'ml-4 flex-1' : 'mt-2'}
                    text-center
                  `}>
                    <p className={`
                      text-sm font-medium
                      ${isActive
                        ? 'text-blue-600 dark:text-blue-400'
                        : isCompleted
                        ? 'text-gray-900 dark:text-white'
                        : 'text-gray-500 dark:text-gray-500'
                      }
                    `}>
                      {step.label}
                      {step.optional && (
                        <span className="ml-1 text-xs text-gray-400">(Optional)</span>
                      )}
                    </p>
                    {step.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
                        {step.description}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={`
                    ${orientation === 'vertical' ? 'w-0.5 h-12 ml-5' : 'h-0.5 flex-1 mx-2'}
                    ${index < currentStep
                      ? 'bg-blue-600'
                      : 'bg-gray-200 dark:bg-gray-800'
                    }
                  `}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Step Content */}
      <div className={orientation === 'vertical' ? 'ml-14' : ''}>
        <AnimatePresence mode="wait">
          {activeStepData?.content && (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-6"
            >
              {activeStepData.content}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Button>

          <div className="text-sm text-gray-500 dark:text-gray-500">
            Step {currentStep + 1} of {steps.length}
          </div>

          <Button
            variant="primary"
            onClick={handleNext}
          >
            {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
            {currentStep < steps.length - 1 && (
              <ChevronRight className="w-4 h-4 ml-1" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
