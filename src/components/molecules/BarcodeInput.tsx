import React, { useState, useRef, useCallback } from 'react';
import { Camera, QrCode, X, Check, Upload } from 'lucide-react';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';

/**
 * BarcodeInput Component
 * 
 * Input for barcodes and QR codes with manual entry, camera scanning,
 * and image upload capabilities. Supports multiple barcode formats.
 * 
 * @component
 * @example
 * ```tsx
 * <BarcodeInput
 *   value={barcode}
 *   onChange={setBarcode}
 *   label="Scan Product Barcode"
 *   format="EAN13"
 * />
 * ```
 * 
 * Features:
 * - Manual barcode entry
 * - Camera scanner (mock)
 * - Image upload scanning (mock)
 * - Format validation
 * - Multiple barcode formats
 * - Real-time validation
 */

export type BarcodeFormat = 
  | 'EAN13'
  | 'EAN8'
  | 'UPC'
  | 'CODE128'
  | 'CODE39'
  | 'QR'
  | 'DATAMATRIX'
  | 'ANY';

export interface BarcodeInputProps {
  value?: string;
  onChange?: (value: string, format?: BarcodeFormat) => void;
  label?: string;
  placeholder?: string;
  format?: BarcodeFormat;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  enableCamera?: boolean;
  enableUpload?: boolean;
  className?: string;
}

// Barcode format validation patterns
const BARCODE_PATTERNS: Record<BarcodeFormat, RegExp | null> = {
  EAN13: /^\d{13}$/,
  EAN8: /^\d{8}$/,
  UPC: /^\d{12}$/,
  CODE128: /^[\x00-\x7F]+$/,
  CODE39: /^[A-Z0-9\-\.\ \$\/\+\%]+$/,
  QR: null, // QR codes can contain any data
  DATAMATRIX: null,
  ANY: null,
};

const BARCODE_FORMAT_NAMES: Record<BarcodeFormat, string> = {
  EAN13: 'EAN-13 (13 digits)',
  EAN8: 'EAN-8 (8 digits)',
  UPC: 'UPC (12 digits)',
  CODE128: 'Code 128',
  CODE39: 'Code 39',
  QR: 'QR Code',
  DATAMATRIX: 'Data Matrix',
  ANY: 'Any Format',
};

export const BarcodeInput: React.FC<BarcodeInputProps> = ({
  value = '',
  onChange,
  label = 'Barcode',
  placeholder = 'Enter or scan barcode...',
  format = 'ANY',
  required = false,
  disabled = false,
  error,
  enableCamera = true,
  enableUpload = true,
  className = '',
}) => {
  const [scanning, setScanning] = useState(false);
  const [validationError, setValidationError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateBarcode = useCallback((barcodeValue: string): boolean => {
    if (!barcodeValue) return true;

    const pattern = BARCODE_PATTERNS[format];
    if (pattern && !pattern.test(barcodeValue)) {
      setValidationError(`Invalid ${BARCODE_FORMAT_NAMES[format]}`);
      return false;
    }

    setValidationError('');
    return true;
  }, [format]);

  const handleChange = (newValue: string) => {
    const isValid = validateBarcode(newValue);
    if (isValid || !newValue) {
      onChange?.(newValue, format);
    }
  };

  // Mock camera scanning
  const handleCameraScan = () => {
    setScanning(true);
    
    // Simulate scanning process
    setTimeout(() => {
      // Generate mock barcode based on format
      let mockBarcode = '';
      switch (format) {
        case 'EAN13':
          mockBarcode = '8719389373646';
          break;
        case 'EAN8':
          mockBarcode = '96385074';
          break;
        case 'UPC':
          mockBarcode = '012345678905';
          break;
        case 'CODE128':
          mockBarcode = 'ABC123XYZ';
          break;
        case 'CODE39':
          mockBarcode = 'CODE39-123';
          break;
        case 'QR':
          mockBarcode = 'https://example.com/product/12345';
          break;
        default:
          mockBarcode = '1234567890123';
      }
      
      onChange?.(mockBarcode, format);
      setScanning(false);
      setValidationError('');
    }, 2000);
  };

  // Mock image upload scanning
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setScanning(true);

    // Simulate image processing
    setTimeout(() => {
      const mockBarcode = format === 'EAN13' ? '8719389373646' : '1234567890';
      onChange?.(mockBarcode, format);
      setScanning(false);
      setValidationError('');
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }, 1500);
  };

  const handleClear = () => {
    onChange?.('', format);
    setValidationError('');
  };

  const displayError = error || validationError;

  return (
    <div className={`barcode-input ${className}`}>
      {label && (
        <label className="block mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Format Info */}
      <div className="mb-2 text-xs text-gray-500 flex items-center gap-1">
        <QrCode className="w-3 h-3" />
        <span>{BARCODE_FORMAT_NAMES[format]}</span>
      </div>

      {/* Manual Input */}
      <div className="relative">
        <Input
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled || scanning}
          error={displayError}
          className="pr-10"
        />
        
        {value && !scanning && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            disabled={disabled}
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {value && !displayError && (
          <div className="absolute right-10 top-1/2 -translate-y-1/2 text-green-500">
            <Check className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Scanning Options */}
      <div className="mt-3 flex gap-2">
        {enableCamera && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleCameraScan}
            disabled={disabled || scanning}
            icon={<Camera className="w-4 h-4" />}
          >
            {scanning ? 'Scanning...' : 'Scan with Camera'}
          </Button>
        )}

        {enableUpload && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || scanning}
              icon={<Upload className="w-4 h-4" />}
            >
              Upload Image
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </>
        )}
      </div>

      {/* Scanning Indicator */}
      {scanning && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full" />
            <span className="text-sm text-blue-700">Scanning barcode...</span>
          </div>
        </div>
      )}

      {/* Success State */}
      {value && !displayError && !scanning && (
        <div className="mt-2 text-sm text-green-600 flex items-center gap-1">
          <Check className="w-4 h-4" />
          <span>Valid {BARCODE_FORMAT_NAMES[format]}</span>
        </div>
      )}

      {/* Help Text */}
      {!displayError && !scanning && (
        <p className="mt-2 text-xs text-gray-500">
          {format === 'ANY' 
            ? 'Enter any barcode format or scan using camera/image'
            : `Enter a valid ${BARCODE_FORMAT_NAMES[format]}`
          }
        </p>
      )}
    </div>
  );
};

export default BarcodeInput;
