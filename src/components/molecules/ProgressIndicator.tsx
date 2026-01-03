import React from 'react';
import { motion } from 'motion/react';
import { Check, Loader2 } from 'lucide-react';

export interface ProgressIndicatorProps {
  value: number;
  max?: number;
  variant?: 'linear' | 'circular' | 'steps';
  size?: 'sm' | 'md' | 'lg';
  showPercentage?: boolean;
  label?: string;
  status?: 'default' | 'success' | 'error' | 'warning';
  indeterminate?: boolean;
  steps?: number;
  currentStep?: number;
  className?: string;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  value,
  max = 100,
  variant = 'linear',
  size = 'md',
  showPercentage = true,
  label,
  status = 'default',
  indeterminate = false,
  steps,
  currentStep,
  className = '',
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      default:
        return 'bg-blue-500';
    }
  };

  const getSizeValue = () => {
    switch (size) {
      case 'sm':
        return { height: 'h-1', circular: 48 };
      case 'lg':
        return { height: 'h-3', circular: 96 };
      default:
        return { height: 'h-2', circular: 64 };
    }
  };

  const sizeValue = getSizeValue();

  if (variant === 'circular') {
    const circleSize = sizeValue.circular;
    const strokeWidth = size === 'sm' ? 4 : size === 'lg' ? 8 : 6;
    const radius = (circleSize - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <div className="relative" style={{ width: circleSize, height: circleSize }}>
          <svg className="transform -rotate-90" width={circleSize} height={circleSize}>
            {/* Background circle */}
            <circle
              cx={circleSize / 2}
              cy={circleSize / 2}
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              fill="none"
              className="text-gray-200 dark:text-gray-800"
            />
            
            {/* Progress circle */}
            {indeterminate ? (
              <motion.circle
                cx={circleSize / 2}
                cy={circleSize / 2}
                r={radius}
                stroke="currentColor"
                strokeWidth={strokeWidth}
                fill="none"
                strokeLinecap="round"
                className={getStatusColor().replace('bg-', 'text-')}
                strokeDasharray={circumference}
                animate={{
                  strokeDashoffset: [circumference, 0],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
            ) : (
              <motion.circle
                cx={circleSize / 2}
                cy={circleSize / 2}
                r={radius}
                stroke="currentColor"
                strokeWidth={strokeWidth}
                fill="none"
                strokeLinecap="round"
                className={getStatusColor().replace('bg-', 'text-')}
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            )}
          </svg>

          {/* Center content */}
          {!indeterminate && (
            <div className="absolute inset-0 flex items-center justify-center">
              {status === 'success' && percentage === 100 ? (
                <Check className="w-6 h-6 text-green-500" />
              ) : showPercentage ? (
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {Math.round(percentage)}%
                </span>
              ) : null}
            </div>
          )}
        </div>

        {label && (
          <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">
            {label}
          </span>
        )}
      </div>
    );
  }

  if (variant === 'steps' && steps) {
    const activeStep = currentStep !== undefined ? currentStep : Math.ceil((percentage / 100) * steps);

    return (
      <div className={className}>
        {label && (
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {label}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Step {activeStep} of {steps}
            </span>
          </div>
        )}

        <div className="flex items-center gap-2">
          {Array.from({ length: steps }).map((_, index) => (
            <React.Fragment key={index}>
              <div
                className={`
                  flex-1 ${sizeValue.height} rounded-full transition-colors
                  ${index < activeStep
                    ? getStatusColor()
                    : 'bg-gray-200 dark:bg-gray-800'
                  }
                `}
              />
              {index < steps - 1 && (
                <div className="w-2 h-0.5 bg-gray-300 dark:bg-gray-700" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  }

  // Linear variant (default)
  return (
    <div className={className}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-2">
          {label && (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {label}
            </span>
          )}
          {showPercentage && !indeterminate && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}

      <div className={`w-full ${sizeValue.height} bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden`}>
        {indeterminate ? (
          <motion.div
            className={`h-full ${getStatusColor()} rounded-full`}
            style={{ width: '30%' }}
            animate={{ x: ['-100%', '400%'] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ) : (
          <motion.div
            className={`h-full ${getStatusColor()} rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        )}
      </div>
    </div>
  );
};

// Specialized variants
export const LinearProgress: React.FC<Omit<ProgressIndicatorProps, 'variant'>> = (props) => (
  <ProgressIndicator {...props} variant="linear" />
);

export const CircularProgress: React.FC<Omit<ProgressIndicatorProps, 'variant'>> = (props) => (
  <ProgressIndicator {...props} variant="circular" />
);

export const StepsProgress: React.FC<Omit<ProgressIndicatorProps, 'variant'>> = (props) => (
  <ProgressIndicator {...props} variant="steps" />
);

export const Spinner: React.FC<{ size?: 'sm' | 'md' | 'lg'; className?: string }> = ({
  size = 'md',
  className = '',
}) => {
  const sizeClass = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-8 h-8' : 'w-6 h-6';

  return (
    <Loader2 className={`${sizeClass} animate-spin text-blue-500 ${className}`} />
  );
};
