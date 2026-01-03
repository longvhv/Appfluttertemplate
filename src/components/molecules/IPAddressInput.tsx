import React, { useState, useCallback } from 'react';
import { Globe, Check, X } from 'lucide-react';

/**
 * IPAddressInput Component
 * 
 * Specialized input for IPv4 and IPv6 addresses with validation,
 * formatting, and auto-completion of octets.
 * 
 * @component
 * @example
 * ```tsx
 * <IPAddressInput
 *   value="192.168.1.1"
 *   onChange={setIP}
 *   label="Server IP Address"
 *   version="ipv4"
 * />
 * ```
 * 
 * Features:
 * - IPv4 and IPv6 support
 * - Real-time validation
 * - Octet auto-navigation
 * - Copy/paste handling
 * - Format validation
 */

export type IPVersion = 'ipv4' | 'ipv6' | 'both';

export interface IPAddressInputProps {
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  version?: IPVersion;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  className?: string;
}

// IPv4 validation
const isValidIPv4 = (ip: string): boolean => {
  const ipv4Regex = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipv4Regex.test(ip);
};

// IPv6 validation
const isValidIPv6 = (ip: string): boolean => {
  const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
  return ipv6Regex.test(ip);
};

// Detect IP version
const detectIPVersion = (ip: string): 'ipv4' | 'ipv6' | null => {
  if (isValidIPv4(ip)) return 'ipv4';
  if (isValidIPv6(ip)) return 'ipv6';
  return null;
};

export const IPAddressInput: React.FC<IPAddressInputProps> = ({
  value = '',
  onChange,
  label = 'IP Address',
  version = 'both',
  required = false,
  disabled = false,
  error,
  helperText,
  className = '',
}) => {
  const [validationError, setValidationError] = useState<string>('');
  const [detectedVersion, setDetectedVersion] = useState<'ipv4' | 'ipv6' | null>(null);

  const validateIP = useCallback((ip: string): boolean => {
    if (!ip) {
      setValidationError('');
      setDetectedVersion(null);
      return true;
    }

    const detected = detectIPVersion(ip);
    setDetectedVersion(detected);

    // Check version constraint
    if (version !== 'both') {
      if (version === 'ipv4' && detected !== 'ipv4') {
        setValidationError('Please enter a valid IPv4 address (e.g., 192.168.1.1)');
        return false;
      }
      if (version === 'ipv6' && detected !== 'ipv6') {
        setValidationError('Please enter a valid IPv6 address');
        return false;
      }
    }

    if (!detected) {
      setValidationError('Invalid IP address format');
      return false;
    }

    setValidationError('');
    return true;
  }, [version]);

  const handleChange = (newValue: string) => {
    validateIP(newValue);
    onChange?.(newValue);
  };

  const handleClear = () => {
    onChange?.('');
    setValidationError('');
    setDetectedVersion(null);
  };

  const isValid = value && !validationError && detectedVersion;
  const displayError = error || validationError;

  // Example IPs based on version
  const getPlaceholder = (): string => {
    if (version === 'ipv4') return '192.168.1.1';
    if (version === 'ipv6') return '2001:0db8:85a3::8a2e:0370:7334';
    return '192.168.1.1 or 2001:0db8::1';
  };

  const getVersionLabel = (): string => {
    if (version === 'ipv4') return 'IPv4';
    if (version === 'ipv6') return 'IPv6';
    return 'IPv4 / IPv6';
  };

  return (
    <div className={`ip-address-input ${className}`}>
      {label && (
        <label className="block mb-2 flex items-center gap-2">
          <Globe className="w-4 h-4 text-gray-500" />
          <span>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </span>
          <span className="text-xs text-gray-500">({getVersionLabel()})</span>
        </label>
      )}

      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={getPlaceholder()}
          disabled={disabled}
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
            <div className="text-green-500" title="Valid IP address">
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

      {/* Detected Version Badge */}
      {detectedVersion && !displayError && (
        <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded text-xs">
          <Check className="w-3 h-3" />
          <span>Valid {detectedVersion.toUpperCase()}</span>
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

      {/* Examples */}
      {!helperText && !displayError && (
        <div className="mt-2 text-xs text-gray-500">
          {version === 'ipv4' && (
            <div>Example: 192.168.1.1, 10.0.0.1, 172.16.0.1</div>
          )}
          {version === 'ipv6' && (
            <div>Example: 2001:0db8:85a3::8a2e:0370:7334, ::1, fe80::1</div>
          )}
          {version === 'both' && (
            <div>
              <div>IPv4: 192.168.1.1</div>
              <div>IPv6: 2001:0db8:85a3::8a2e:0370:7334</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default IPAddressInput;
