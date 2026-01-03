import React, { useState } from 'react';
import { Phone, Check, X } from 'lucide-react';
import { Select } from './Select';

export interface CountryCode {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
}

export interface PhoneInputProps {
  value?: string;
  onChange?: (value: string, fullNumber: string) => void;
  defaultCountry?: string;
  disabled?: boolean;
  autoValidate?: boolean;
  className?: string;
  label?: string;
  error?: boolean;
  errorMessage?: string;
}

const COUNTRY_CODES: CountryCode[] = [
  { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸' },
  { code: 'VN', name: 'Vietnam', dialCode: '+84', flag: '🇻🇳' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧' },
  { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷' },
  { code: 'DE', name: 'Germany', dialCode: '+49', flag: '🇩🇪' },
  { code: 'CN', name: 'China', dialCode: '+86', flag: '🇨🇳' },
  { code: 'JP', name: 'Japan', dialCode: '+81', flag: '🇯🇵' },
  { code: 'KR', name: 'South Korea', dialCode: '+82', flag: '🇰🇷' },
  { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺' },
  { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦' },
  { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳' },
  { code: 'BR', name: 'Brazil', dialCode: '+55', flag: '🇧🇷' },
  { code: 'MX', name: 'Mexico', dialCode: '+52', flag: '🇲🇽' },
  { code: 'RU', name: 'Russia', dialCode: '+7', flag: '🇷🇺' },
  { code: 'SG', name: 'Singapore', dialCode: '+65', flag: '🇸🇬' },
];

export function PhoneInput({
  value = '',
  onChange,
  defaultCountry = 'US',
  disabled = false,
  autoValidate = true,
  className = '',
  label,
  error = false,
  errorMessage,
}: PhoneInputProps) {
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(
    COUNTRY_CODES.find(c => c.code === defaultCountry) || COUNTRY_CODES[0]
  );
  const [phoneNumber, setPhoneNumber] = useState(value);
  const [touched, setTouched] = useState(false);

  const formatPhoneNumber = (num: string): string => {
    // Remove all non-digits
    const digits = num.replace(/\D/g, '');
    
    // Format based on country
    if (selectedCountry.code === 'US' || selectedCountry.code === 'CA') {
      // US/Canada format: (XXX) XXX-XXXX
      if (digits.length <= 3) return digits;
      if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    } else if (selectedCountry.code === 'VN') {
      // Vietnam format: XXXX XXX XXX
      if (digits.length <= 4) return digits;
      if (digits.length <= 7) return `${digits.slice(0, 4)} ${digits.slice(4)}`;
      return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 10)}`;
    }
    
    // Default format with spaces every 3 digits
    return digits.replace(/(\d{3})(?=\d)/g, '$1 ').trim();
  };

  const validatePhoneNumber = (num: string): boolean => {
    const digits = num.replace(/\D/g, '');
    
    // Basic validation: 7-15 digits
    return digits.length >= 7 && digits.length <= 15;
  };

  const isValid = validatePhoneNumber(phoneNumber);
  const showValidation = touched && autoValidate;

  const handleCountryChange = (countryCode: string) => {
    const country = COUNTRY_CODES.find(c => c.code === countryCode);
    if (country) {
      setSelectedCountry(country);
      const fullNumber = `${country.dialCode} ${phoneNumber}`;
      onChange?.(phoneNumber, fullNumber);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const formatted = formatPhoneNumber(input);
    setPhoneNumber(formatted);
    
    const fullNumber = `${selectedCountry.dialCode} ${formatted}`;
    onChange?.(formatted, fullNumber);
  };

  const handleBlur = () => {
    setTouched(true);
  };

  const countryOptions = COUNTRY_CODES.map(country => ({
    value: country.code,
    label: `${country.flag} ${country.dialCode}`,
  }));

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-2">
          {label}
        </label>
      )}
      
      <div className="flex gap-2">
        {/* Country Code Selector */}
        <div className="w-32">
          <Select
            options={countryOptions}
            value={selectedCountry.code}
            onChange={(value) => handleCountryChange(value as string)}
            disabled={disabled}
          />
        </div>

        {/* Phone Number Input */}
        <div className="flex-1 relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            <Phone className="w-5 h-5" />
          </div>
          
          <input
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneChange}
            onBlur={handleBlur}
            disabled={disabled}
            placeholder="Enter phone number"
            className={`
              w-full pl-10 pr-10 py-2.5 rounded-xl
              border-2 transition-all
              bg-card dark:bg-card
              text-foreground placeholder:text-muted-foreground
              ${error || (showValidation && !isValid)
                ? 'border-red-600 focus:border-red-600 focus:ring-4 focus:ring-red-600/20'
                : showValidation && isValid
                ? 'border-green-600 focus:border-green-600 focus:ring-4 focus:ring-green-600/20'
                : 'border-border dark:border-border focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/20'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          />

          {/* Validation Icon */}
          {showValidation && phoneNumber && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {isValid ? (
                <Check className="w-5 h-5 text-green-600" />
              ) : (
                <X className="w-5 h-5 text-red-600" />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Full Number Display */}
      {phoneNumber && (
        <p className="mt-2 text-xs text-muted-foreground">
          Full number: {selectedCountry.dialCode} {phoneNumber}
        </p>
      )}

      {/* Error Message */}
      {(error || (showValidation && !isValid && phoneNumber)) && (
        <p className="mt-1 text-xs text-red-600">
          {errorMessage || 'Please enter a valid phone number'}
        </p>
      )}
    </div>
  );
}
