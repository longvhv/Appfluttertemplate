import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Pipette } from 'lucide-react';

export interface ColorPickerProps {
  value?: string;
  onChange?: (color: string) => void;
  presets?: string[];
  showPresets?: boolean;
  showInput?: boolean;
  format?: 'hex' | 'rgb' | 'hsl';
  className?: string;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  value = '#3B82F6',
  onChange,
  presets = defaultPresets,
  showPresets = true,
  showInput = true,
  format = 'hex',
  className = '',
}) => {
  const [color, setColor] = useState(value);
  const [showPicker, setShowPicker] = useState(false);

  const handleChange = (newColor: string) => {
    setColor(newColor);
    if (onChange) {
      onChange(newColor);
    }
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return '#' + [r, g, b].map((x) => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  };

  const formatColor = (hex: string) => {
    if (format === 'rgb') {
      const rgb = hexToRgb(hex);
      return rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : hex;
    }
    if (format === 'hsl') {
      // Simplified HSL conversion
      return hex; // Would need full conversion
    }
    return hex;
  };

  return (
    <div className={`relative ${className}`}>
      {/* Color Preview */}
      <button
        onClick={() => setShowPicker(!showPicker)}
        className="flex items-center gap-3 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 transition-colors"
      >
        <div
          className="w-8 h-8 rounded-md border-2 border-white shadow-sm"
          style={{ backgroundColor: color }}
        />
        {showInput && (
          <span className="text-sm font-mono text-gray-700 dark:text-gray-300">
            {formatColor(color)}
          </span>
        )}
        <Pipette className="w-4 h-4 text-gray-400 ml-auto" />
      </button>

      {/* Picker Popover */}
      <AnimatePresence>
        {showPicker && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowPicker(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 mt-2 z-50 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 p-4 w-64"
            >
              {/* Color Gradient Picker */}
              <div className="mb-4">
                <div className="relative w-full h-32 rounded-lg overflow-hidden mb-3">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => handleChange(e.target.value)}
                    className="absolute inset-0 w-full h-full cursor-pointer"
                    style={{ minHeight: '100%' }}
                  />
                </div>

                {/* Hex Input */}
                {showInput && (
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^#[0-9A-F]{6}$/i.test(value) || /^#[0-9A-F]{3}$/i.test(value)) {
                        handleChange(value);
                      }
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="#000000"
                  />
                )}
              </div>

              {/* Preset Colors */}
              {showPresets && (
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Presets
                  </p>
                  <div className="grid grid-cols-8 gap-2">
                    {presets.map((preset) => (
                      <button
                        key={preset}
                        onClick={() => handleChange(preset)}
                        className="relative w-8 h-8 rounded-md border-2 border-white dark:border-gray-800 shadow-sm hover:scale-110 transition-transform"
                        style={{ backgroundColor: preset }}
                      >
                        {color === preset && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white drop-shadow" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const defaultPresets = [
  '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899', '#F43F5E',
  '#F97316', '#EAB308', '#84CC16', '#22C55E', '#14B8A6', '#06B6D4', '#0EA5E9', '#6366F1',
  '#8B5CF6', '#A855F7', '#D946EF', '#EC4899', '#F43F5E', '#64748B', '#000000', '#FFFFFF',
];

// Compact variant
export const CompactColorPicker: React.FC<Omit<ColorPickerProps, 'showInput'>> = (props) => (
  <ColorPicker {...props} showInput={false} />
);
