import React, { useState, useRef } from 'react';
import { MapPin, Navigation, Search, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface LocationData {
  address: string;
  city?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
}

export interface LocationInputProps {
  value?: LocationData;
  onChange?: (location: LocationData) => void;
  placeholder?: string;
  disabled?: boolean;
  showCurrentLocation?: boolean;
  showSuggestions?: boolean;
  className?: string;
  label?: string;
}

export function LocationInput({
  value,
  onChange,
  placeholder = 'Enter location...',
  disabled = false,
  showCurrentLocation = true,
  showSuggestions = true,
  className = '',
  label,
}: LocationInputProps) {
  const [location, setLocation] = useState<LocationData>(
    value || { address: '' }
  );
  const [searching, setSearching] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [suggestions, setSuggestions] = useState<LocationData[]>([]);
  const [showSuggestionsList, setShowSuggestionsList] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock suggestions (in real app, use Google Places API, Mapbox, etc.)
  const mockSuggestions = [
    { address: '123 Main St, New York, NY 10001', city: 'New York', country: 'USA', latitude: 40.7128, longitude: -74.0060 },
    { address: '456 Market St, San Francisco, CA 94102', city: 'San Francisco', country: 'USA', latitude: 37.7749, longitude: -122.4194 },
    { address: '789 Park Ave, London, UK', city: 'London', country: 'United Kingdom', latitude: 51.5074, longitude: -0.1278 },
    { address: '321 Nguyen Hue, Ho Chi Minh City, Vietnam', city: 'Ho Chi Minh City', country: 'Vietnam', latitude: 10.7769, longitude: 106.7009 },
    { address: '654 Ba Dinh, Hanoi, Vietnam', city: 'Hanoi', country: 'Vietnam', latitude: 21.0285, longitude: 105.8542 },
  ];

  const handleAddressChange = (address: string) => {
    const newLocation = { ...location, address };
    setLocation(newLocation);
    onChange?.(newLocation);

    // Search for suggestions
    if (address.length > 2 && showSuggestions) {
      setSearching(true);
      // Mock search delay
      setTimeout(() => {
        const filtered = mockSuggestions.filter((s) =>
          s.address.toLowerCase().includes(address.toLowerCase())
        );
        setSuggestions(filtered);
        setShowSuggestionsList(true);
        setSearching(false);
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestionsList(false);
    }
  };

  const handleSelectSuggestion = (suggestion: LocationData) => {
    setLocation(suggestion);
    onChange?.(suggestion);
    setShowSuggestionsList(false);
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // Mock reverse geocoding (in real app, use API)
        const newLocation: LocationData = {
          address: `Location at ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
          latitude,
          longitude,
        };

        setLocation(newLocation);
        onChange?.(newLocation);
        setGettingLocation(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Unable to get your location');
        setGettingLocation(false);
      }
    );
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-2">
          {label}
        </label>
      )}

      <div className="relative">
        {/* Main Input */}
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            {searching ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <MapPin className="w-5 h-5" />
            )}
          </div>

          <input
            ref={inputRef}
            type="text"
            value={location.address}
            onChange={(e) => handleAddressChange(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowSuggestionsList(true)}
            disabled={disabled}
            placeholder={placeholder}
            className="w-full pl-10 pr-12 py-2.5 rounded-xl border-2 border-border dark:border-border bg-card dark:bg-card text-foreground placeholder:text-muted-foreground focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          />

          {/* Current Location Button */}
          {showCurrentLocation && (
            <button
              onClick={getCurrentLocation}
              disabled={disabled || gettingLocation}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-muted dark:hover:bg-muted rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Use current location"
            >
              {gettingLocation ? (
                <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
              ) : (
                <Navigation className="w-4 h-4 text-indigo-600" />
              )}
            </button>
          )}
        </div>

        {/* Suggestions Dropdown */}
        <AnimatePresence>
          {showSuggestionsList && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-50 w-full mt-2 bg-card dark:bg-card border border-border dark:border-border rounded-xl shadow-xl overflow-hidden"
            >
              <div className="max-h-64 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectSuggestion(suggestion)}
                    className="w-full px-4 py-3 text-left hover:bg-muted/50 dark:hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          {suggestion.address}
                        </p>
                        {(suggestion.city || suggestion.country) && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {[suggestion.city, suggestion.country]
                              .filter(Boolean)
                              .join(', ')}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Location Details */}
      {(location.latitude || location.city) && (
        <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
          {location.city && (
            <span className="px-2 py-1 bg-muted/50 dark:bg-muted/50 rounded">
              📍 {location.city}
            </span>
          )}
          {location.country && (
            <span className="px-2 py-1 bg-muted/50 dark:bg-muted/50 rounded">
              🌍 {location.country}
            </span>
          )}
          {location.latitude && location.longitude && (
            <span className="px-2 py-1 bg-muted/50 dark:bg-muted/50 rounded font-mono">
              {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
