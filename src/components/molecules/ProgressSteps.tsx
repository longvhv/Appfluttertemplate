import React from 'react';
import { motion } from 'motion/react';
import { Check, Circle } from 'lucide-react';

export interface ProgressStep {
  id: string | number;
  label: string;
  description?: string;
  status: 'completed' | 'current' | 'upcoming' | 'error';
}

export interface ProgressStepsProps {
  steps: ProgressStep[];
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'simple' | 'numbered';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeConfig = {
  sm: {
    circle: 'w-6 h-6',
    icon: 'w-3 h-3',
    label: 'text-xs',
    description: 'text-xs',
    line: 'h-0.5',
  },
  md: {
    circle: 'w-8 h-8',
    icon: 'w-4 h-4',
    label: 'text-sm',
    description: 'text-xs',
    line: 'h-0.5',
  },
  lg: {
    circle: 'w-10 h-10',
    icon: 'w-5 h-5',
    label: 'text-base',
    description: 'text-sm',
    line: 'h-1',
  },
};

export function ProgressSteps({
  steps,
  orientation = 'horizontal',
  variant = 'default',
  size = 'md',
  className = '',
}: ProgressStepsProps) {
  const config = sizeConfig[size];

  if (orientation === 'vertical') {
    return (
      <div className={`space-y-4 ${className}`}>
        {steps.map((step, index) => (
          <div key={step.id} className="flex gap-4">
            {/* Indicator */}
            <div className="flex flex-col items-center">
              <StepIndicator step={step} index={index} variant={variant} config={config} />
              {index < steps.length - 1 && (
                <div className={`w-0.5 flex-1 mt-2 ${getLineColor(step.status)}`} />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pb-8">
              <p className={`${config.label} font-medium ${getLabelColor(step.status)}`}>
                {step.label}
              </p>
              {step.description && (
                <p className={`${config.description} text-muted-foreground mt-1`}>
                  {step.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Horizontal orientation
  return (
    <div className={`flex items-center ${className}`}>
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <div className="flex flex-col items-center gap-2 flex-1">
            <StepIndicator step={step} index={index} variant={variant} config={config} />
            <div className="text-center">
              <p className={`${config.label} font-medium ${getLabelColor(step.status)}`}>
                {step.label}
              </p>
              {step.description && (
                <p className={`${config.description} text-muted-foreground mt-0.5`}>
                  {step.description}
                </p>
              )}
            </div>
          </div>

          {index < steps.length - 1 && (
            <div className={`flex-1 ${config.line} ${getLineColor(steps[index + 1].status)} -mt-8`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function StepIndicator({
  step,
  index,
  variant,
  config,
}: {
  step: ProgressStep;
  index: number;
  variant: 'default' | 'simple' | 'numbered';
  config: any;
}) {
  const getCircleStyle = () => {
    switch (step.status) {
      case 'completed':
        return 'bg-indigo-600 text-white border-indigo-600';
      case 'current':
        return 'bg-indigo-600 text-white border-indigo-600 ring-4 ring-indigo-100 dark:ring-indigo-950/50';
      case 'error':
        return 'bg-red-600 text-white border-red-600';
      default:
        return 'bg-card dark:bg-card text-muted-foreground border-border dark:border-border';
    }
  };

  return (
    <div
      className={`
        ${config.circle} rounded-full border-2 flex items-center justify-center
        transition-all ${getCircleStyle()}
      `}
    >
      {step.status === 'completed' ? (
        <Check className={config.icon} />
      ) : step.status === 'error' ? (
        <Circle className={config.icon} />
      ) : variant === 'numbered' ? (
        <span className="text-xs font-medium">{index + 1}</span>
      ) : (
        <Circle className={config.icon} />
      )}
    </div>
  );
}

function getLabelColor(status: ProgressStep['status']) {
  switch (status) {
    case 'completed':
    case 'current':
      return 'text-foreground';
    case 'error':
      return 'text-red-600 dark:text-red-400';
    default:
      return 'text-muted-foreground';
  }
}

function getLineColor(status: ProgressStep['status']) {
  switch (status) {
    case 'completed':
    case 'current':
      return 'bg-indigo-600';
    case 'error':
      return 'bg-red-600';
    default:
      return 'bg-border dark:bg-border';
  }
}

// Animated Progress Steps
export function AnimatedProgressSteps({
  steps,
  currentStep,
  ...props
}: Omit<ProgressStepsProps, 'steps'> & {
  steps: Omit<ProgressStep, 'status'>[];
  currentStep: number;
}) {
  const stepsWithStatus: ProgressStep[] = steps.map((step, index) => ({
    ...step,
    status: index < currentStep ? 'completed' : index === currentStep ? 'current' : 'upcoming',
  }));

  return <ProgressSteps steps={stepsWithStatus} {...props} />;
}

// Simple linear progress
export interface LinearProgressProps {
  value: number;
  max?: number;
  showValue?: boolean;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export function LinearProgress({
  value,
  max = 100,
  showValue = false,
  color = 'bg-indigo-600',
  size = 'md',
  animated = true,
}: LinearProgressProps) {
  const percentage = Math.min((value / max) * 100, 100);
  
  const heights = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className="space-y-2">
      <div className={`w-full ${heights[size]} bg-muted dark:bg-muted rounded-full overflow-hidden`}>
        <motion.div
          className={`h-full ${color} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: animated ? 0.5 : 0, ease: 'easeOut' }}
        />
      </div>
      {showValue && (
        <p className="text-sm text-muted-foreground text-right">
          {Math.round(percentage)}%
        </p>
      )}
    </div>
  );
}

// Multi-segment progress
export interface MultiProgressProps {
  segments: Array<{
    id: string | number;
    value: number;
    color: string;
    label?: string;
  }>;
  showLabels?: boolean;
}

export function MultiProgress({ segments, showLabels = false }: MultiProgressProps) {
  const total = segments.reduce((sum, seg) => sum + seg.value, 0);

  return (
    <div className="space-y-2">
      <div className="w-full h-2 bg-muted dark:bg-muted rounded-full overflow-hidden flex">
        {segments.map((segment) => {
          const percentage = (segment.value / total) * 100;
          return (
            <motion.div
              key={segment.id}
              className={`h-full ${segment.color}`}
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              title={segment.label}
            />
          );
        })}
      </div>

      {showLabels && (
        <div className="flex flex-wrap gap-3">
          {segments.map((segment) => (
            <div key={segment.id} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${segment.color}`} />
              <span className="text-xs text-muted-foreground">{segment.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
