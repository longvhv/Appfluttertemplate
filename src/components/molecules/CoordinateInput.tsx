import React, { useState, useCallback } from 'react';
import { MapPin, Navigation, Crosshair } from 'lucide-react';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';

/**
 * CoordinateInput Component
 * 
 * Input for geographic coordinates (latitude and longitude) with validation,
 * formatting, and optional current location detection.
 * 
 * @component
 * @example
 * ```tsx
 * <CoordinateInput
 *   value={{ lat: 40.7128, lng: -74.0060 }}
 *   onChange={setCoordinates}
 *   label="Location Coordinates"
 *   enableGeolocation
 * />
 * ```
 * 
 * Features:
 * - Latitude/longitude input
 * - Decimal degrees format
 * - DMS (Degrees Minutes Seconds) format
 * - Current location detection
 * - Coordinate validation
 * - Map link generation
 */

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface CoordinateInputProps {
  value?: Coordinates;
  onChange?: (coords: Coordinates) => void;
  label?: string;
  format?: 'decimal' | 'dms';
  enableGeolocation?: boolean;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  showMapLink?: boolean;
  precision?: number;
  className?: string;
}

// Validate latitude (-90 to 90)
const validateLatitude = (lat: number): boolean => {
  return lat >= -90 && lat <= 90;
};

// Validate longitude (-180 to 180)
const validateLongitude = (lng: number): boolean => {
  return lng >= -180 && lng <= 180;
};

// Convert decimal degrees to DMS
const decimalToDMS = (decimal: number, isLat: boolean): string => {
  const absolute = Math.abs(decimal);
  const degrees = Math.floor(absolute);
  const minutesDecimal = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesDecimal);
  const seconds = ((minutesDecimal - minutes) * 60).toFixed(2);

  const direction = isLat
    ? decimal >= 0 ? 'N' : 'S'
    : decimal >= 0 ? 'E' : 'W';

  return `${degrees}° ${minutes}' ${seconds}" ${direction}`;
};

export const CoordinateInput: React.FC<CoordinateInputProps> = ({
  value,
  onChange,
  label = 'Coordinates',
  format = 'decimal',
  enableGeolocation = true,
  required = false,
  disabled = false,
  error,
  showMapLink = true,
  precision = 6,
  className = '',
}) => {
  const [latInput, setLatInput] = useState(value?.lat.toFixed(precision) || '');
  const [lngInput, setLngInput] = useState(value?.lng.toFixed(precision) || '');
  const [validationErrors, setValidationErrors] = useState<{
    lat?: string;
    lng?: string;
  }>({});
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const internalValue: Coordinates = value || { lat: 0, lng: 0 };

  const validateAndUpdate = useCallback((lat: string, lng: string) => {
    const errors: { lat?: string; lng?: string } = {};
    
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);

    if (lat && isNaN(latNum)) {
      errors.lat = 'Invalid number';
    } else if (lat && !validateLatitude(latNum)) {
      errors.lat = 'Latitude must be between -90 and 90';
    }

    if (lng && isNaN(lngNum)) {
      errors.lng = 'Invalid number';
    } else if (lng && !validateLongitude(lngNum)) {
      errors.lng = 'Longitude must be between -180 and 180';
    }

    setValidationErrors(errors);

    if (Object.keys(errors).length === 0 && lat && lng && !isNaN(latNum) && !isNaN(lngNum)) {
      onChange?.({ lat: latNum, lng: lngNum });
    }
  }, [onChange]);

  const handleLatChange = (newLat: string) => {
    setLatInput(newLat);
    validateAndUpdate(newLat, lngInput);
  };

  const handleLngChange = (newLng: string) => {
    setLngInput(newLng);
    validateAndUpdate(latInput, newLng);
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(precision);
        const lng = position.coords.longitude.toFixed(precision);
        
        setLatInput(lat);
        setLngInput(lng);
        validateAndUpdate(lat, lng);
        setIsGettingLocation(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Unable to get your location. Please enter coordinates manually.');
        setIsGettingLocation(false);
      }
    );
  };

  const getGoogleMapsLink = (): string => {
    if (!value) return '#';
    return `https://www.google.com/maps?q=${value.lat},${value.lng}`;
  };

  const hasValidCoordinates = value && 
    validateLatitude(value.lat) && 
    validateLongitude(value.lng);

  return (
    <div className={`coordinate-input ${className}`}>
      {label && (
        <label className="block mb-2 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-500" />
          <span>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </span>
        </label>
      )}

      {/* Coordinate Inputs */}
      <div className="grid grid-cols-2 gap-3">
        {/* Latitude */}
        <div>
          <Input
            label="Latitude"
            type="text"
            value={latInput}
            onChange={(e) => handleLatChange(e.target.value)}
            placeholder="40.7128"
            disabled={disabled || isGettingLocation}
            error={validationErrors.lat}
            helperText={format === 'dms' && value ? decimalToDMS(value.lat, true) : undefined}
          />
          <p className="mt-1 text-xs text-gray-400">-90 to 90</p>
        </div>

        {/* Longitude */}
        <div>
          <Input
            label="Longitude"
            type="text"
            value={lngInput}
            onChange={(e) => handleLngChange(e.target.value)}
            placeholder="-74.0060"
            disabled={disabled || isGettingLocation}
            error={validationErrors.lng}
            helperText={format === 'dms' && value ? decimalToDMS(value.lng, false) : undefined}
          />
          <p className="mt-1 text-xs text-gray-400">-180 to 180</p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-3 flex gap-2 flex-wrap">
        {enableGeolocation && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleGetCurrentLocation}
            disabled={disabled || isGettingLocation}
            icon={isGettingLocation ? (
              <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full" />
            ) : (
              <Crosshair className="w-4 h-4" />
            )}
          >
            {isGettingLocation ? 'Getting Location...' : 'Use Current Location'}
          </Button>
        )}

        {showMapLink && hasValidCoordinates && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(getGoogleMapsLink(), '_blank')}
            icon={<Navigation className="w-4 h-4" />}
          >
            View on Map
          </Button>
        )}
      </div>

      {/* Display DMS Format */}
      {format === 'dms' && hasValidCoordinates && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-500 mb-1">DMS Format:</div>
          <div className="text-sm space-y-1">
            <div>
              <span className="font-medium">Lat:</span> {decimalToDMS(value.lat, true)}
            </div>
            <div>
              <span className="font-medium">Lng:</span> {decimalToDMS(value.lng, false)}
            </div>
          </div>
        </div>
      )}

      {/* Main Error */}
      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}

      {/* Info */}
      {!error && hasValidCoordinates && (
        <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          <span>
            Precision: ±{Math.pow(10, -precision) * 111} km
          </span>
        </div>
      )}
    </div>
  );
};

export default CoordinateInput;
