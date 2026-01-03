import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../atoms/Button';

export interface TourStep {
  target: string; // CSS selector
  title: string;
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  showControls?: boolean;
  disableBeacon?: boolean;
}

export interface TourProps {
  steps: TourStep[];
  run?: boolean;
  onComplete?: () => void;
  onSkip?: () => void;
  showProgress?: boolean;
  showSkipButton?: boolean;
  continuous?: boolean;
  className?: string;
}

export const Tour: React.FC<TourProps> = ({
  steps,
  run: controlledRun,
  onComplete,
  onSkip,
  showProgress = true,
  showSkipButton = true,
  continuous = true,
  className = '',
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(controlledRun || false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  const activeStep = steps[currentStep];

  useEffect(() => {
    if (controlledRun !== undefined) {
      setIsRunning(controlledRun);
    }
  }, [controlledRun]);

  useEffect(() => {
    if (isRunning && activeStep) {
      updatePosition();
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition);

      return () => {
        window.removeEventListener('resize', updatePosition);
        window.removeEventListener('scroll', updatePosition);
      };
    }
  }, [isRunning, currentStep, activeStep]);

  const updatePosition = () => {
    if (!activeStep) return;

    const target = document.querySelector(activeStep.target);
    if (!target || !tooltipRef.current) return;

    const targetRect = target.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const placement = activeStep.placement || 'bottom';
    const offset = 16;

    let top = 0;
    let left = 0;

    switch (placement) {
      case 'top':
        top = targetRect.top - tooltipRect.height - offset;
        left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
        break;
      case 'bottom':
        top = targetRect.bottom + offset;
        left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
        break;
      case 'left':
        top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
        left = targetRect.left - tooltipRect.width - offset;
        break;
      case 'right':
        top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
        left = targetRect.right + offset;
        break;
    }

    // Keep tooltip within viewport
    top = Math.max(offset, Math.min(top, window.innerHeight - tooltipRect.height - offset));
    left = Math.max(offset, Math.min(left, window.innerWidth - tooltipRect.width - offset));

    setTooltipPosition({ top, left });

    // Highlight target
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    setIsRunning(false);
    setCurrentStep(0);
    if (onSkip) {
      onSkip();
    }
  };

  const handleComplete = () => {
    setIsRunning(false);
    setCurrentStep(0);
    if (onComplete) {
      onComplete();
    }
  };

  if (!isRunning || !activeStep) return null;

  const target = document.querySelector(activeStep.target);
  if (!target) return null;

  const targetRect = target.getBoundingClientRect();

  return (
    <AnimatePresence>
      <div className={`fixed inset-0 z-50 ${className}`}>
        {/* Backdrop with spotlight */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50"
          style={{
            clipPath: `polygon(
              0 0,
              100% 0,
              100% 100%,
              0 100%,
              0 ${targetRect.top - 8}px,
              ${targetRect.left - 8}px ${targetRect.top - 8}px,
              ${targetRect.left - 8}px ${targetRect.bottom + 8}px,
              ${targetRect.right + 8}px ${targetRect.bottom + 8}px,
              ${targetRect.right + 8}px ${targetRect.top - 8}px,
              100% ${targetRect.top - 8}px,
              100% 0,
              0 0
            )`,
          }}
        />

        {/* Target highlight border */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute border-2 border-blue-500 rounded-lg pointer-events-none"
          style={{
            top: targetRect.top - 8,
            left: targetRect.left - 8,
            width: targetRect.width + 16,
            height: targetRect.height + 16,
          }}
        />

        {/* Tooltip */}
        <motion.div
          ref={tooltipRef}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="absolute w-80 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden"
          style={{
            top: tooltipPosition.top,
            left: tooltipPosition.left,
          }}
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {activeStep.title}
                </h3>
                {showProgress && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Step {currentStep + 1} of {steps.length}
                  </p>
                )}
              </div>
              
              {showSkipButton && (
                <button
                  onClick={handleSkip}
                  className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <p className="text-gray-700 dark:text-gray-300">
              {activeStep.content}
            </p>
          </div>

          {/* Footer */}
          {(activeStep.showControls !== false) && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                  disabled={currentStep === 0}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Back
                </Button>

                {/* Progress dots */}
                {showProgress && (
                  <div className="flex items-center gap-1.5">
                    {steps.map((_, index) => (
                      <div
                        key={index}
                        className={`
                          w-2 h-2 rounded-full transition-colors
                          ${index === currentStep
                            ? 'bg-blue-500'
                            : index < currentStep
                            ? 'bg-blue-300 dark:bg-blue-700'
                            : 'bg-gray-300 dark:bg-gray-700'
                          }
                        `}
                      />
                    ))}
                  </div>
                )}

                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleNext}
                >
                  {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
                  {currentStep < steps.length - 1 && (
                    <ChevronRight className="w-4 h-4 ml-1" />
                  )}
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
