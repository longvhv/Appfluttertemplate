import React, { useState, useCallback, useRef, useEffect } from 'react';
import { MapPin, Search, X } from 'lucide-react';
import { Input } from '../atoms/Input';
import { Button } from '../atoms/Button';

/**
 * AddressInput Component
 * 
 * A comprehensive address input with autocomplete, manual entry, and validation.
 * Supports multiple address formats and can integrate with geocoding APIs.
 * 
 * @component
 * @example
 * ```tsx
 * <AddressInput
 *   value={address}
 *   onChange={setAddress}
 *   label="Shipping Address"
 *   required
 * />
 * ```
 * 
 * Features:
 * - Street address with autocomplete
 * - City, state, postal code fields
 * - Country selection
 * - Geocoding support (mock)
 * - Validation
 * - Manual entry mode
 */

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

export interface AddressInputProps {
  value?: Address;
  onChange?: (address: Address) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  countries?: string[];
  enableGeocoding?: boolean;
  className?: string;
}

// Mock address suggestions (in production, integrate with Google Places, Mapbox, etc.)
const mockAddressSuggestions = (query: string): string[] => {
  const suggestions = [
    '123 Main Street, New York, NY 10001, USA',
    '456 Park Avenue, Los Angeles, CA 90001, USA',
    '789 Market Street, San Francisco, CA 94102, USA',
    '321 Broadway, Seattle, WA 98101, USA',
    '654 Elm Street, Austin, TX 78701, USA',
    '15 Nguyễn Huệ, Quận 1, Hồ Chí Minh, Vietnam',
    '20 Hoàn Kiếm, Hà Nội, Vietnam',
  ];
  
  if (!query) return [];
  return suggestions.filter(s => 
    s.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);
};

const DEFAULT_COUNTRIES = [
  'USA',
  'Vietnam',
  'UK',
  'Canada',
  'Australia',
  'Germany',
  'France',
  'Japan',
  'Singapore',
  'Thailand',
];

export const AddressInput: React.FC<AddressInputProps> = ({
  value,
  onChange,
  label = 'Address',
  placeholder = 'Search for an address...',
  required = false,
  disabled = false,
  error,
  countries = DEFAULT_COUNTRIES,
  enableGeocoding = false,
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [manualEntry, setManualEntry] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const internalValue: Address = value || {
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: countries[0] || 'USA',
  };

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    if (query.length > 2) {
      const results = mockAddressSuggestions(query);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, []);

  const parseAddress = (addressString: string): Address => {
    // Simple parsing logic (in production, use proper address parsing)
    const parts = addressString.split(',').map(p => p.trim());
    
    return {
      street: parts[0] || '',
      city: parts[1] || '',
      state: parts[2]?.split(' ')[0] || '',
      postalCode: parts[2]?.match(/\d{5}/)?.[0] || '',
      country: parts[3] || internalValue.country,
    };
  };

  const handleSelectSuggestion = (suggestion: string) => {
    const parsed = parseAddress(suggestion);
    
    if (enableGeocoding) {
      // Mock geocoding (in production, use real geocoding API)
      parsed.latitude = 40.7128 + Math.random();
      parsed.longitude = -74.0060 + Math.random();
    }
    
    onChange?.(parsed);
    setSearchQuery('');
    setShowSuggestions(false);
  };

  const handleFieldChange = (field: keyof Address, fieldValue: string) => {
    onChange?.({
      ...internalValue,
      [field]: fieldValue,
    });
  };

  const handleClear = () => {
    onChange?.({
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: countries[0] || 'USA',
    });
    setSearchQuery('');
  };

  const isAddressFilled = internalValue.street || internalValue.city || 
                          internalValue.state || internalValue.postalCode;

  return (
    <div className={`address-input ${className}`} ref={wrapperRef}>
      {label && (
        <label className="block mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {!manualEntry && !isAddressFilled ? (
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder={placeholder}
              disabled={disabled}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg ${
                error ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50`}
            />
          </div>

          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSelectSuggestion(suggestion)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-start gap-2 transition-colors"
                >
                  <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{suggestion}</span>
                </button>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => setManualEntry(true)}
            className="mt-2 text-sm text-blue-600 hover:text-blue-700"
          >
            Enter address manually
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Street Address */}
          <Input
            label="Street Address"
            value={internalValue.street}
            onChange={(e) => handleFieldChange('street', e.target.value)}
            placeholder="123 Main Street"
            disabled={disabled}
            required={required}
          />

          {/* City and State */}
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="City"
              value={internalValue.city}
              onChange={(e) => handleFieldChange('city', e.target.value)}
              placeholder="New York"
              disabled={disabled}
              required={required}
            />
            <Input
              label="State/Province"
              value={internalValue.state}
              onChange={(e) => handleFieldChange('state', e.target.value)}
              placeholder="NY"
              disabled={disabled}
            />
          </div>

          {/* Postal Code and Country */}
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Postal Code"
              value={internalValue.postalCode}
              onChange={(e) => handleFieldChange('postalCode', e.target.value)}
              placeholder="10001"
              disabled={disabled}
            />
            <div>
              <label className="block text-sm mb-1">Country</label>
              <select
                value={internalValue.country}
                onChange={(e) => handleFieldChange('country', e.target.value)}
                disabled={disabled}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {countries.map(country => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Geocoding Info */}
          {enableGeocoding && internalValue.latitude && internalValue.longitude && (
            <div className="text-xs text-gray-500 flex items-center gap-2">
              <MapPin className="w-3 h-3" />
              <span>
                {internalValue.latitude.toFixed(6)}, {internalValue.longitude.toFixed(6)}
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              disabled={disabled}
              icon={<X className="w-4 h-4" />}
            >
              Clear
            </Button>
            {!manualEntry && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setManualEntry(false)}
                disabled={disabled}
              >
                Search Again
              </Button>
            )}
          </div>
        </div>
      )}

      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default AddressInput;
