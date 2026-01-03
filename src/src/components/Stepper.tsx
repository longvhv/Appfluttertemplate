import React from 'react';
import { Check } from 'lucide-react';
import { motion } from 'motion/react';

export interface Step {
  label: string;
  description?: string;
  icon?: React.ReactNode;
  optional?: boolean;
}

export interface StepperProps {
  steps: Step[];
  activeStep: number;
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'circles' | 'arrows';
  size?: 'sm' | 'md' | 'lg';
  onStepClick?: (step: number) => void;
  allowStepClick?: boolean;
  className?: string;
}

export function Stepper({
  steps,
  activeStep,
  orientation = 'horizontal',
  variant = 'default',
  size = 'md',
  onStepClick,
  allowStepClick = false,
  className = '',
}: StepperProps) {
  const sizes = {
    sm: {
      circle: 'w-8 h-8 text-sm',
      icon: 'w-4 h-4',
      label: 'text-sm',
      description: 'text-xs',
    },
    md: {
      circle: 'w-10 h-10 text-base',
      icon: 'w-5 h-5',
      label: 'text-base',
      description: 'text-sm',
    },
    lg: {
      circle: 'w-12 h-12 text-lg',
      icon: 'w-6 h-6',
      label: 'text-lg',
      description: 'text-base',
    },
  };

  const isStepComplete = (index: number) => index < activeStep;
  const isStepActive = (index: number) => index === activeStep;
  const isStepClickable = (index: number) =>
    allowStepClick && (onStepClick || isStepComplete(index));

  const renderStepIndicator = (step: Step, index: number) => {
    const complete = isStepComplete(index);
    const active = isStepActive(index);

    if (variant === 'arrows') {
      return (
        <div
          className={`
            relative flex items-center justify-center
            px-6 py-3
            ${
              complete
                ? 'bg-indigo-600 text-white'
                : active
                ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
            }
            ${isStepClickable(index) ? 'cursor-pointer hover:opacity-80' : ''}
            transition-all
          `}
          style={{
            clipPath: orientation === 'horizontal'
              ? 'polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%, 20px 50%)'
              : undefined,
          }}
        >
          <span className="font-medium">{step.label}</span>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center gap-2">
        {/* Circle */}
        <motion.div
          initial={false}
          animate={{
            scale: active ? 1.1 : 1,
          }}
          className={`
            ${sizes[size].circle}
            rounded-full
            flex items-center justify-center
            font-semibold
            transition-all
            ${
              complete
                ? 'bg-indigo-600 dark:bg-indigo-500 text-white'
                : active
                ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 ring-4 ring-indigo-100 dark:ring-indigo-950'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
            }
            ${isStepClickable(index) ? 'cursor-pointer hover:opacity-80' : ''}
          `}
        >
          {complete ? (
            <Check className={sizes[size].icon} />
          ) : step.icon ? (
            <span className={sizes[size].icon}>{step.icon}</span>
          ) : (
            index + 1
          )}
        </motion.div>

        {/* Label */}
        {orientation === 'horizontal' && (
          <div className="text-center max-w-[120px]">
            <p
              className={`
                ${sizes[size].label}
                font-medium
                ${
                  active
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-600 dark:text-gray-400'
                }
              `}
            >
              {step.label}
            </p>
            {step.description && (
              <p className={`${sizes[size].description} text-gray-500 dark:text-gray-400 mt-0.5`}>
                {step.description}
              </p>
            )}
            {step.optional && (
              <p className={`${sizes[size].description} text-gray-400 dark:text-gray-500 italic mt-0.5`}>
                Optional
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderConnector = (index: number) => {
    if (index === steps.length - 1) return null;

    const complete = isStepComplete(index + 1);

    if (orientation === 'vertical') {
      return (
        <div className="flex justify-center ml-5">
          <div
            className={`
              w-0.5 h-12
              ${complete ? 'bg-indigo-600 dark:bg-indigo-500' : 'bg-gray-200 dark:bg-gray-700'}
              transition-colors
            `}
          />
        </div>
      );
    }

    if (variant === 'arrows') return null;

    return (
      <div className="flex-1 flex items-center px-4">
        <div
          className={`
            w-full h-0.5
            ${complete ? 'bg-indigo-600 dark:bg-indigo-500' : 'bg-gray-200 dark:bg-gray-700'}
            transition-colors
          `}
        />
      </div>
    );
  };

  if (orientation === 'vertical') {
    return (
      <div className={`flex flex-col ${className}`}>
        {steps.map((step, index) => (
          <div key={index}>
            <div
              onClick={() => isStepClickable(index) && onStepClick?.(index)}
              className="flex items-start gap-4"
            >
              {renderStepIndicator(step, index)}
              <div className="flex-1 py-2">
                <p
                  className={`
                    ${sizes[size].label}
                    font-medium
                    ${
                      isStepActive(index)
                        ? 'text-gray-900 dark:text-white'
                        : 'text-gray-600 dark:text-gray-400'
                    }
                  `}
                >
                  {step.label}
                </p>
                {step.description && (
                  <p className={`${sizes[size].description} text-gray-500 dark:text-gray-400 mt-0.5`}>
                    {step.description}
                  </p>
                )}
                {step.optional && (
                  <p className={`${sizes[size].description} text-gray-400 dark:text-gray-500 italic mt-0.5`}>
                    Optional
                  </p>
                )}
              </div>
            </div>
            {renderConnector(index)}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`flex items-center ${className}`}>
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div
            onClick={() => isStepClickable(index) && onStepClick?.(index)}
            className={isStepClickable(index) ? 'cursor-pointer' : ''}
          >
            {renderStepIndicator(step, index)}
          </div>
          {renderConnector(index)}
        </React.Fragment>
      ))}
    </div>
  );
}
