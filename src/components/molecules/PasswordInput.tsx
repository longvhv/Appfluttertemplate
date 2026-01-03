import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff, Check, X } from 'lucide-react';

export interface PasswordStrength {
  score: 0 | 1 | 2 | 3 | 4 | 5;
  label: 'Very Weak' | 'Weak' | 'Fair' | 'Good' | 'Strong' | 'Very Strong';
  color: string;
}

export interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string;
  error?: string;
  hint?: string;
  size?: 'sm' | 'md' | 'lg';
  showStrength?: boolean;
  showRequirements?: boolean;
  showToggle?: boolean;
  variant?: 'default' | 'filled' | 'flushed';
  requirements?: {
    minLength?: number;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
    requireNumber?: boolean;
    requireSpecialChar?: boolean;
  };
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      label,
      error,
      hint,
      size = 'md',
      showStrength = false,
      showRequirements = false,
      showToggle = true,
      variant = 'default',
      requirements = {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumber: true,
        requireSpecialChar: true,
      },
      value,
      onChange,
      className = '',
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const password = String(value || '');

    const calculateStrength = (pwd: string): PasswordStrength => {
      let score = 0;

      if (pwd.length >= 8) score++;
      if (pwd.length >= 12) score++;
      if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
      if (/\d/.test(pwd)) score++;
      if (/[^a-zA-Z0-9]/.test(pwd)) score++;

      const labels: PasswordStrength['label'][] = [
        'Very Weak',
        'Weak',
        'Fair',
        'Good',
        'Strong',
        'Very Strong',
      ];

      const colors = [
        '#ef4444', // red
        '#f97316', // orange
        '#f59e0b', // amber
        '#eab308', // yellow
        '#22c55e', // green
        '#10b981', // emerald
      ];

      return {
        score: score as PasswordStrength['score'],
        label: labels[score],
        color: colors[score],
      };
    };

    const checkRequirement = (requirement: keyof typeof requirements): boolean => {
      if (!requirements[requirement]) return true;

      switch (requirement) {
        case 'minLength':
          return password.length >= (requirements.minLength || 0);
        case 'requireUppercase':
          return /[A-Z]/.test(password);
        case 'requireLowercase':
          return /[a-z]/.test(password);
        case 'requireNumber':
          return /\d/.test(password);
        case 'requireSpecialChar':
          return /[^a-zA-Z0-9]/.test(password);
        default:
          return true;
      }
    };

    const strength = calculateStrength(password);

    const requirementsList = [
      {
        key: 'minLength',
        label: `At least ${requirements.minLength || 8} characters`,
        met: checkRequirement('minLength'),
      },
      {
        key: 'requireUppercase',
        label: 'One uppercase letter',
        met: checkRequirement('requireUppercase'),
      },
      {
        key: 'requireLowercase',
        label: 'One lowercase letter',
        met: checkRequirement('requireLowercase'),
      },
      {
        key: 'requireNumber',
        label: 'One number',
        met: checkRequirement('requireNumber'),
      },
      {
        key: 'requireSpecialChar',
        label: 'One special character',
        met: checkRequirement('requireSpecialChar'),
      },
    ].filter((req) => requirements[req.key as keyof typeof requirements]);

    const sizeClasses = {
      sm: 'h-9 text-sm',
      md: 'h-11 text-base',
      lg: 'h-13 text-lg',
    };

    const variantClasses = {
      default: `
        border border-border dark:border-border
        bg-background dark:bg-background
        focus-within:ring-2 focus-within:ring-indigo-600 focus-within:border-transparent
      `,
      filled: `
        border-0
        bg-muted dark:bg-muted
        focus-within:ring-2 focus-within:ring-indigo-600
      `,
      flushed: `
        border-0 border-b-2 border-border dark:border-border
        bg-transparent
        rounded-none
        focus-within:border-indigo-600 focus-within:ring-0
      `,
    };

    return (
      <div className={`w-full ${className}`}>
        {label && (
          <label className="block text-sm font-medium text-foreground mb-2">
            {label}
            {props.required && <span className="text-red-600 ml-1">*</span>}
          </label>
        )}

        <div
          className={`
            relative flex items-center rounded-xl overflow-hidden
            transition-all duration-200
            ${variantClasses[variant]}
            ${error ? 'border-red-600 focus-within:ring-red-600' : ''}
          `}
        >
          <input
            ref={ref}
            type={showPassword ? 'text' : 'password'}
            value={value}
            onChange={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`
              flex-1 bg-transparent border-0 outline-none px-4
              text-foreground placeholder:text-muted-foreground
              ${sizeClasses[size]}
            `}
            {...props}
          />

          {showToggle && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="px-3 text-muted-foreground hover:text-foreground transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          )}
        </div>

        {/* Password Strength */}
        {showStrength && password && (
          <div className="mt-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">
                Password strength
              </span>
              <span
                className="text-sm font-medium"
                style={{ color: strength.color }}
              >
                {strength.label}
              </span>
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((level) => (
                <div
                  key={level}
                  className="h-2 flex-1 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor:
                      level <= strength.score ? strength.color : '#e5e7eb',
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Requirements */}
        {showRequirements && (isFocused || password) && (
          <div className="mt-3 space-y-2">
            {requirementsList.map((req) => (
              <div
                key={req.key}
                className="flex items-center gap-2 text-sm"
              >
                {req.met ? (
                  <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                ) : (
                  <X className="w-4 h-4 text-muted-foreground" />
                )}
                <span
                  className={
                    req.met
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-muted-foreground'
                  }
                >
                  {req.label}
                </span>
              </div>
            ))}
          </div>
        )}

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 mt-2">{error}</p>
        )}
        {!error && hint && (
          <p className="text-sm text-muted-foreground mt-2">{hint}</p>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';

// Confirm Password component
export interface ConfirmPasswordInputProps extends PasswordInputProps {
  passwordValue: string;
  matchError?: string;
}

export const ConfirmPasswordInput = forwardRef<HTMLInputElement, ConfirmPasswordInputProps>(
  ({ passwordValue, matchError = 'Passwords do not match', value, ...props }, ref) => {
    const doPasswordsMatch = !value || value === passwordValue;

    return (
      <PasswordInput
        ref={ref}
        value={value}
        error={!doPasswordsMatch ? matchError : props.error}
        showStrength={false}
        showRequirements={false}
        {...props}
      />
    );
  }
);

ConfirmPasswordInput.displayName = 'ConfirmPasswordInput';
