import React, { useState, useMemo } from 'react';
import { Clock, Globe, Search, MapPin } from 'lucide-react';

/**
 * TimezoneInput Component
 * 
 * Timezone selector with search, current timezone detection,
 * and UTC offset display. Supports IANA timezone database.
 * 
 * @component
 * @example
 * ```tsx
 * <TimezoneInput
 *   value="America/New_York"
 *   onChange={setTimezone}
 *   label="Select Timezone"
 *   showCurrentTime
 * />
 * ```
 * 
 * Features:
 * - IANA timezone database
 * - Search/filter
 * - UTC offset display
 * - Current time in timezone
 * - Detect user timezone
 * - Group by region
 */

export interface TimezoneInputProps {
  value?: string;
  onChange?: (timezone: string) => void;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  showCurrentTime?: boolean;
  showOffset?: boolean;
  groupByRegion?: boolean;
  className?: string;
}

// Common timezones grouped by region
const TIMEZONES: { region: string; zones: string[] }[] = [
  {
    region: 'America',
    zones: [
      'America/New_York',
      'America/Chicago',
      'America/Denver',
      'America/Los_Angeles',
      'America/Anchorage',
      'America/Toronto',
      'America/Vancouver',
      'America/Mexico_City',
      'America/Sao_Paulo',
      'America/Argentina/Buenos_Aires',
    ],
  },
  {
    region: 'Europe',
    zones: [
      'Europe/London',
      'Europe/Paris',
      'Europe/Berlin',
      'Europe/Rome',
      'Europe/Madrid',
      'Europe/Amsterdam',
      'Europe/Brussels',
      'Europe/Vienna',
      'Europe/Stockholm',
      'Europe/Moscow',
    ],
  },
  {
    region: 'Asia',
    zones: [
      'Asia/Dubai',
      'Asia/Kolkata',
      'Asia/Bangkok',
      'Asia/Singapore',
      'Asia/Hong_Kong',
      'Asia/Shanghai',
      'Asia/Tokyo',
      'Asia/Seoul',
      'Asia/Ho_Chi_Minh',
      'Asia/Jakarta',
    ],
  },
  {
    region: 'Pacific',
    zones: [
      'Pacific/Auckland',
      'Pacific/Fiji',
      'Pacific/Guam',
      'Pacific/Honolulu',
      'Pacific/Tahiti',
    ],
  },
  {
    region: 'Australia',
    zones: [
      'Australia/Sydney',
      'Australia/Melbourne',
      'Australia/Brisbane',
      'Australia/Perth',
      'Australia/Adelaide',
    ],
  },
  {
    region: 'Africa',
    zones: [
      'Africa/Cairo',
      'Africa/Johannesburg',
      'Africa/Lagos',
      'Africa/Nairobi',
      'Africa/Casablanca',
    ],
  },
];

// Get UTC offset for a timezone
const getUTCOffset = (timezone: string): string => {
  try {
    const now = new Date();
    const tzDate = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
    const utcDate = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
    const offset = (tzDate.getTime() - utcDate.getTime()) / (1000 * 60 * 60);
    
    const sign = offset >= 0 ? '+' : '-';
    const hours = Math.floor(Math.abs(offset));
    const minutes = Math.round((Math.abs(offset) - hours) * 60);
    
    return `UTC${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  } catch (e) {
    return 'UTC+00:00';
  }
};

// Get current time in timezone
const getCurrentTime = (timezone: string): string => {
  try {
    return new Date().toLocaleTimeString('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch (e) {
    return '--:--';
  }
};

// Format timezone name for display
const formatTimezoneName = (timezone: string): string => {
  return timezone.split('/').pop()?.replace(/_/g, ' ') || timezone;
};

// Detect user's timezone
const detectUserTimezone = (): string => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (e) {
    return 'UTC';
  }
};

export const TimezoneInput: React.FC<TimezoneInputProps> = ({
  value,
  onChange,
  label = 'Timezone',
  required = false,
  disabled = false,
  error,
  showCurrentTime = true,
  showOffset = true,
  groupByRegion = true,
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const userTimezone = useMemo(() => detectUserTimezone(), []);
  const selectedTimezone = value || userTimezone;

  // Flatten all timezones for searching
  const allTimezones = useMemo(() => {
    return TIMEZONES.flatMap(group => group.zones);
  }, []);

  // Filter timezones based on search
  const filteredTimezones = useMemo(() => {
    if (!searchQuery) {
      return groupByRegion ? TIMEZONES : [{ region: 'All', zones: allTimezones }];
    }

    const query = searchQuery.toLowerCase();
    const filtered = allTimezones.filter(tz =>
      tz.toLowerCase().includes(query) ||
      formatTimezoneName(tz).toLowerCase().includes(query) ||
      getUTCOffset(tz).toLowerCase().includes(query)
    );

    if (groupByRegion) {
      return TIMEZONES.map(group => ({
        region: group.region,
        zones: group.zones.filter(tz => filtered.includes(tz)),
      })).filter(group => group.zones.length > 0);
    } else {
      return [{ region: 'Results', zones: filtered }];
    }
  }, [searchQuery, groupByRegion, allTimezones]);

  const handleSelect = (timezone: string) => {
    onChange?.(timezone);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleDetectTimezone = () => {
    onChange?.(userTimezone);
  };

  return (
    <div className={`timezone-input ${className}`}>
      {label && (
        <label className="block mb-2 flex items-center gap-2">
          <Globe className="w-4 h-4 text-gray-500" />
          <span>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </span>
        </label>
      )}

      {/* Selected Timezone Display */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full px-3 py-2 border rounded-lg text-left ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${
          disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:border-gray-400'
        } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="text-sm">{formatTimezoneName(selectedTimezone)}</div>
            <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
              {showOffset && <span>{getUTCOffset(selectedTimezone)}</span>}
              {showCurrentTime && (
                <>
                  {showOffset && <span>•</span>}
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {getCurrentTime(selectedTimezone)}
                  </span>
                </>
              )}
            </div>
          </div>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Dropdown */}
      {isOpen && !disabled && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-96 overflow-hidden">
          {/* Search */}
          <div className="p-2 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search timezone..."
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>
          </div>

          {/* Detect Button */}
          <button
            type="button"
            onClick={handleDetectTimezone}
            className="w-full px-4 py-2 text-left text-sm hover:bg-blue-50 border-b border-gray-200 flex items-center gap-2 text-blue-600"
          >
            <MapPin className="w-4 h-4" />
            <span>Detect my timezone ({formatTimezoneName(userTimezone)})</span>
          </button>

          {/* Timezone List */}
          <div className="overflow-y-auto max-h-72">
            {filteredTimezones.map((group, groupIndex) => (
              <div key={groupIndex}>
                {group.zones.length > 0 && groupByRegion && (
                  <div className="px-4 py-2 text-xs uppercase tracking-wide text-gray-500 bg-gray-50 sticky top-0">
                    {group.region}
                  </div>
                )}
                {group.zones.map((tz, tzIndex) => (
                  <button
                    key={tzIndex}
                    type="button"
                    onClick={() => handleSelect(tz)}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${
                      tz === selectedTimezone ? 'bg-blue-50 text-blue-700' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div>{formatTimezoneName(tz)}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                          <span>{getUTCOffset(tz)}</span>
                          {showCurrentTime && (
                            <>
                              <span>•</span>
                              <span>{getCurrentTime(tz)}</span>
                            </>
                          )}
                        </div>
                      </div>
                      {tz === selectedTimezone && (
                        <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ))}

            {filteredTimezones.every(group => group.zones.length === 0) && (
              <div className="px-4 py-8 text-center text-gray-500 text-sm">
                No timezones found matching "{searchQuery}"
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}

      {/* Helper Text */}
      {!error && (
        <p className="mt-2 text-xs text-gray-500">
          Your detected timezone: {formatTimezoneName(userTimezone)}
        </p>
      )}
    </div>
  );
};

export default TimezoneInput;
