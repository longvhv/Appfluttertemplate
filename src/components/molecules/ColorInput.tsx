import React, { useState, useRef, useEffect } from 'react';
import { Pipette, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface ColorInputProps {
  value?: string;
  onChange?: (value: string) => void;
  format?: 'hex' | 'rgb' | 'hsl';
  showPresets?: boolean;
  presetColors?: string[];
  showAlpha?: boolean;
  showCopyButton?: boolean;
  disabled?: boolean;
  className?: string;
  label?: string;
}

export function ColorInput({
  value = '#3b82f6',
  onChange,
  format = 'hex',
  showPresets = true,
  presetColors,
  showAlpha = false,
  showCopyButton = true,
  disabled = false,
  className = '',
  label,
}: ColorInputProps) {
  const [color, setColor] = useState(value);
  const [copied, setCopied] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  const defaultPresets = [
    '#ef4444', '#f97316', '#f59e0b', '#eab308',
    '#84cc16', '#22c55e', '#10b981', '#14b8a6',
    '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
    '#8b5cf6', '#a855f7', '#d946ef', '#ec4899',
    '#f43f5e', '#64748b', '#000000', '#ffffff',
  ];

  const presets = presetColors || defaultPresets;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    onChange?.(newColor);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(color);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
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

  const getFormattedColor = () => {
    if (format === 'hex') return color;
    if (format === 'rgb') {
      const rgb = hexToRgb(color);
      return rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : color;
    }
    return color;
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
        <div className="flex items-center gap-2">
          {/* Color Preview */}
          <button
            onClick={() => !disabled && setShowPicker(!showPicker)}
            disabled={disabled}
            className="w-12 h-12 rounded-xl border-2 border-border dark:border-border shadow-sm transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
            style={{ backgroundColor: color }}
          >
            <div
              className="w-full h-full"
              style={{
                background: `linear-gradient(45deg, #ccc 25%, transparent 25%), 
                            linear-gradient(-45deg, #ccc 25%, transparent 25%), 
                            linear-gradient(45deg, transparent 75%, #ccc 75%), 
                            linear-gradient(-45deg, transparent 75%, #ccc 75%)`,
                backgroundSize: '8px 8px',
                backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px',
              }}
            />
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={getFormattedColor()}
            onChange={(e) => handleColorChange(e.target.value)}
            disabled={disabled}
            className="flex-1 px-4 py-2.5 rounded-xl border-2 border-border dark:border-border bg-card dark:bg-card text-foreground font-mono text-sm focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          />

          {/* Native Color Picker */}
          <div className="relative">
            <input
              type="color"
              value={color}
              onChange={(e) => handleColorChange(e.target.value)}
              disabled={disabled}
              className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
            />
            <button
              disabled={disabled}
              className="p-2.5 rounded-xl border-2 border-border dark:border-border hover:bg-muted dark:hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Pipette className="w-5 h-5 text-foreground" />
            </button>
          </div>

          {/* Copy Button */}
          {showCopyButton && (
            <button
              onClick={handleCopy}
              disabled={disabled}
              className="p-2.5 rounded-xl border-2 border-border dark:border-border hover:bg-muted dark:hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {copied ? (
                <Check className="w-5 h-5 text-green-600" />
              ) : (
                <Copy className="w-5 h-5 text-foreground" />
              )}
            </button>
          )}
        </div>

        {/* Preset Colors Dropdown */}
        <AnimatePresence>
          {showPicker && showPresets && (
            <motion.div
              ref={pickerRef}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-50 mt-2 p-4 bg-card dark:bg-card border-2 border-border dark:border-border rounded-xl shadow-xl"
            >
              <div className="mb-2 text-sm font-medium text-foreground">
                Preset Colors
              </div>
              <div className="grid grid-cols-10 gap-2">
                {presets.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => {
                      handleColorChange(preset);
                      setShowPicker(false);
                    }}
                    className={`
                      w-8 h-8 rounded-lg border-2 transition-all hover:scale-110
                      ${color.toLowerCase() === preset.toLowerCase()
                        ? 'border-indigo-600 ring-2 ring-indigo-600/20'
                        : 'border-border dark:border-border'
                      }
                    `}
                    style={{ backgroundColor: preset }}
                  />
                ))}
              </div>

              {/* Custom Colors Section */}
              <div className="mt-4 pt-4 border-t border-border dark:border-border">
                <div className="text-xs text-muted-foreground mb-2">
                  Or use the color picker above
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Color Info */}
      <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
        <span>HEX: {color.toUpperCase()}</span>
        {(() => {
          const rgb = hexToRgb(color);
          return rgb && <span>RGB: {rgb.r}, {rgb.g}, {rgb.b}</span>;
        })()}
      </div>
    </div>
  );
}
