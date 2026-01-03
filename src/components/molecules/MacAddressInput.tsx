import React, { useState, useCallback } from 'react';
import { Wifi, Check, X } from 'lucide-react';

/**
 * MacAddressInput Component
 * 
 * Specialized input for MAC (Media Access Control) addresses with 
 * auto-formatting, validation, and support for multiple formats.
 * 
 * @component
 * @example
 * ```tsx
 * <MacAddressInput
 *   value="00:1A:2B:3C:4D:5E"
 *   onChange={setMacAddress}
 *   label="Network Adapter MAC"
 *   format="colon"
 * />
 * ```
 * 
 * Features:
 * - Multiple format support (colon, hyphen, dot, none)
 * - Auto-formatting as you type
 * - Format conversion
 * - Real-time validation
 * - Copy/paste handling
 */

export type MacFormat = 'colon' | 'hyphen' | 'dot' | 'none';

export interface MacAddressInputProps {
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  format?: MacFormat;
  uppercase?: boolean;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  className?: string;
}

// Format separators
const FORMAT_SEPARATORS: Record<MacFormat, string> = {
  colon: ':',
  hyphen: '-',
  dot: '.',
  none: '',
};

// Format examples
const FORMAT_EXAMPLES: Record<MacFormat, string> = {
  colon: '00:1A:2B:3C:4D:5E',
  hyphen: '00-1A-2B-3C-4D-5E',
  dot: '001A.2B3C.4D5E',
  none: '001A2B3C4D5E',
};

// Clean MAC address (remove all separators)
const cleanMac = (mac: string): string => {
  return mac.replace(/[^0-9A-Fa-f]/g, '');
};

// Validate MAC address
const isValidMac = (mac: string): boolean => {
  const cleaned = cleanMac(mac);
  return /^[0-9A-Fa-f]{12}$/.test(cleaned);
};

// Format MAC address
const formatMac = (mac: string, format: MacFormat, uppercase: boolean): string => {
  const cleaned = cleanMac(mac);
  if (cleaned.length !== 12) return mac;

  let formatted = cleaned;
  if (uppercase) {
    formatted = formatted.toUpperCase();
  } else {
    formatted = formatted.toLowerCase();
  }

  const separator = FORMAT_SEPARATORS[format];

  switch (format) {
    case 'colon':
    case 'hyphen':
      return formatted.match(/.{1,2}/g)?.join(separator) || formatted;
    case 'dot':
      return formatted.match(/.{1,4}/g)?.join(separator) || formatted;
    case 'none':
      return formatted;
    default:
      return formatted;
  }
};

// Auto-format as user types
const autoFormatMac = (input: string, format: MacFormat, uppercase: boolean): string => {
  const cleaned = cleanMac(input);
  
  if (cleaned.length === 0) return '';
  if (cleaned.length > 12) return input; // Don't auto-format if too long

  let formatted = cleaned;
  if (uppercase) {
    formatted = formatted.toUpperCase();
  } else {
    formatted = formatted.toLowerCase();
  }

  const separator = FORMAT_SEPARATORS[format];

  switch (format) {
    case 'colon':
    case 'hyphen':
      if (cleaned.length <= 2) return formatted;
      const pairs = formatted.match(/.{1,2}/g) || [];
      return pairs.join(separator);
    
    case 'dot':
      if (cleaned.length <= 4) return formatted;
      const quads = formatted.match(/.{1,4}/g) || [];
      return quads.join(separator);
    
    case 'none':
      return formatted;
    
    default:
      return formatted;
  }
};

export const MacAddressInput: React.FC<MacAddressInputProps> = ({
  value = '',
  onChange,
  label = 'MAC Address',
  format = 'colon',
  uppercase = true,
  required = false,
  disabled = false,
  error,
  helperText,
  className = '',
}) => {
  const [validationError, setValidationError] = useState<string>('');

  const validateMac = useCallback((mac: string): boolean => {
    if (!mac) {
      setValidationError('');
      return true;
    }

    const cleaned = cleanMac(mac);

    if (!/^[0-9A-Fa-f]+$/.test(cleaned)) {
      setValidationError('MAC address can only contain hexadecimal characters (0-9, A-F)');
      return false;
    }

    if (cleaned.length > 12) {
      setValidationError('MAC address must be exactly 12 hexadecimal digits');
      return false;
    }

    if (cleaned.length < 12 && cleaned.length > 0) {
      setValidationError(`MAC address must be 12 digits (currently ${cleaned.length})`);
      return false;
    }

    setValidationError('');
    return true;
  }, []);

  const handleChange = (newValue: string) => {
    // Auto-format as user types
    const formatted = autoFormatMac(newValue, format, uppercase);
    validateMac(formatted);
    onChange?.(formatted);
  };

  const handleClear = () => {
    onChange?.('');
    setValidationError('');
  };

  const handleFormatChange = (newFormat: MacFormat) => {
    if (isValidMac(value)) {
      const newFormatted = formatMac(value, newFormat, uppercase);
      onChange?.(newFormatted);
    }
  };

  const isValid = value && isValidMac(value);
  const displayError = error || validationError;

  return (
    <div className={`mac-address-input ${className}`}>
      {label && (
        <label className="block mb-2 flex items-center gap-2">
          <Wifi className="w-4 h-4 text-gray-500" />
          <span>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </span>
        </label>
      )}

      {/* Format Selector */}
      <div className="mb-2 flex gap-2">
        {(['colon', 'hyphen', 'dot', 'none'] as MacFormat[]).map((fmt) => (
          <button
            key={fmt}
            type="button"
            onClick={() => handleFormatChange(fmt)}
            disabled={disabled}
            className={`px-2 py-1 text-xs rounded border transition-colors ${
              format === fmt
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            } disabled:opacity-50`}
          >
            {FORMAT_EXAMPLES[fmt]}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={FORMAT_EXAMPLES[format]}
          disabled={disabled}
          maxLength={format === 'dot' ? 14 : format === 'none' ? 12 : 17}
          className={`w-full px-3 py-2 pr-20 border rounded-lg font-mono text-sm ${
            displayError ? 'border-red-500' : 
            isValid ? 'border-green-500' : 
            'border-gray-300'
          } focus:outline-none focus:ring-2 ${
            displayError ? 'focus:ring-red-500' :
            isValid ? 'focus:ring-green-500' :
            'focus:ring-blue-500'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        />

        {/* Status Icons */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {isValid && (
            <div className="text-green-500" title="Valid MAC address">
              <Check className="w-4 h-4" />
            </div>
          )}
          
          {value && (
            <button
              type="button"
              onClick={handleClear}
              disabled={disabled}
              className="text-gray-400 hover:text-gray-600"
              title="Clear"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Valid Badge */}
      {isValid && !displayError && (
        <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded text-xs">
          <Check className="w-3 h-3" />
          <span>Valid MAC Address</span>
        </div>
      )}

      {/* Error */}
      {displayError && (
        <p className="mt-2 text-sm text-red-500">{displayError}</p>
      )}

      {/* Helper Text */}
      {helperText && !displayError && (
        <p className="mt-2 text-xs text-gray-500">{helperText}</p>
      )}

      {/* Format Info */}
      {!helperText && !displayError && (
        <div className="mt-2 text-xs text-gray-500">
          <div>Format: {format === 'colon' ? 'Colon-separated' : 
                        format === 'hyphen' ? 'Hyphen-separated' :
                        format === 'dot' ? 'Dot-separated (Cisco)' :
                        'No separators'}</div>
          <div className="mt-1">
            Example: {FORMAT_EXAMPLES[format]}
          </div>
        </div>
      )}

      {/* Common MAC Addresses Reference */}
      {!value && !displayError && (
        <details className="mt-2 text-xs text-gray-500">
          <summary className="cursor-pointer hover:text-gray-700">Common OUIs</summary>
          <div className="mt-1 pl-2 space-y-1">
            <div>• 00:50:56 - VMware</div>
            <div>• 08:00:27 - VirtualBox</div>
            <div>• 00:1C:42 - Parallels</div>
            <div>• 00:0C:29 - VMware ESX</div>
          </div>
        </details>
      )}
    </div>
  );
};

export default MacAddressInput;
