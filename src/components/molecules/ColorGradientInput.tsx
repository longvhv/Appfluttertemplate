import React, { useState, useRef, useCallback } from 'react';
import { Palette, Plus, Trash2, Copy, Check } from 'lucide-react';
import { Button } from '../atoms/Button';

/**
 * ColorGradientInput Component
 * 
 * Advanced input for creating CSS gradients with multiple color stops,
 * angle/direction control, and visual preview.
 * 
 * @component
 * @example
 * ```tsx
 * <ColorGradientInput
 *   value="linear-gradient(90deg, #ff0000 0%, #00ff00 100%)"
 *   onChange={setGradient}
 *   label="Background Gradient"
 * />
 * ```
 * 
 * Features:
 * - Linear and radial gradients
 * - Multiple color stops
 * - Position/angle control
 * - Live preview
 * - CSS output
 * - Preset gradients
 */

export type GradientType = 'linear' | 'radial';

export interface ColorStop {
  color: string;
  position: number; // 0-100
}

export interface GradientValue {
  type: GradientType;
  angle?: number; // 0-360 for linear
  shape?: 'circle' | 'ellipse'; // for radial
  stops: ColorStop[];
}

export interface ColorGradientInputProps {
  value?: string | GradientValue;
  onChange?: (value: string, gradientValue: GradientValue) => void;
  label?: string;
  disabled?: boolean;
  error?: string;
  showPresets?: boolean;
  className?: string;
}

// Popular gradient presets
const GRADIENT_PRESETS: { name: string; gradient: GradientValue }[] = [
  {
    name: 'Sunset',
    gradient: {
      type: 'linear',
      angle: 135,
      stops: [
        { color: '#FF512F', position: 0 },
        { color: '#F09819', position: 100 },
      ],
    },
  },
  {
    name: 'Ocean',
    gradient: {
      type: 'linear',
      angle: 180,
      stops: [
        { color: '#2E3192', position: 0 },
        { color: '#1BFFFF', position: 100 },
      ],
    },
  },
  {
    name: 'Purple Haze',
    gradient: {
      type: 'linear',
      angle: 90,
      stops: [
        { color: '#8E2DE2', position: 0 },
        { color: '#4A00E0', position: 100 },
      ],
    },
  },
  {
    name: 'Green Beach',
    gradient: {
      type: 'linear',
      angle: 120,
      stops: [
        { color: '#02AAB0', position: 0 },
        { color: '#00CDAC', position: 100 },
      ],
    },
  },
];

// Convert GradientValue to CSS string
const gradientToCSS = (gradient: GradientValue): string => {
  const stopsCSS = gradient.stops
    .sort((a, b) => a.position - b.position)
    .map(stop => `${stop.color} ${stop.position}%`)
    .join(', ');

  if (gradient.type === 'linear') {
    return `linear-gradient(${gradient.angle || 90}deg, ${stopsCSS})`;
  } else {
    const shape = gradient.shape || 'circle';
    return `radial-gradient(${shape}, ${stopsCSS})`;
  }
};

// Parse CSS gradient to GradientValue (simplified)
const parseGradient = (css: string): GradientValue | null => {
  try {
    if (css.startsWith('linear-gradient')) {
      const match = css.match(/linear-gradient\((\d+)deg,\s*(.+)\)/);
      if (match) {
        const angle = parseInt(match[1]);
        const stopsStr = match[2];
        const stops: ColorStop[] = [];
        
        const stopMatches = stopsStr.matchAll(/(#[0-9A-Fa-f]{6}|rgb\([^)]+\))\s+(\d+)%/g);
        for (const stopMatch of stopMatches) {
          stops.push({
            color: stopMatch[1],
            position: parseInt(stopMatch[2]),
          });
        }
        
        return { type: 'linear', angle, stops };
      }
    } else if (css.startsWith('radial-gradient')) {
      // Simplified radial parsing
      return {
        type: 'radial',
        shape: 'circle',
        stops: [
          { color: '#ff0000', position: 0 },
          { color: '#0000ff', position: 100 },
        ],
      };
    }
  } catch (e) {
    console.error('Failed to parse gradient:', e);
  }
  return null;
};

const DEFAULT_GRADIENT: GradientValue = {
  type: 'linear',
  angle: 90,
  stops: [
    { color: '#4F46E5', position: 0 },
    { color: '#06B6D4', position: 100 },
  ],
};

export const ColorGradientInput: React.FC<ColorGradientInputProps> = ({
  value,
  onChange,
  label = 'Gradient',
  disabled = false,
  error,
  showPresets = true,
  className = '',
}) => {
  const [gradient, setGradient] = useState<GradientValue>(() => {
    if (!value) return DEFAULT_GRADIENT;
    if (typeof value === 'string') {
      return parseGradient(value) || DEFAULT_GRADIENT;
    }
    return value;
  });

  const [copied, setCopied] = useState(false);

  const handleChange = useCallback((newGradient: GradientValue) => {
    setGradient(newGradient);
    const css = gradientToCSS(newGradient);
    onChange?.(css, newGradient);
  }, [onChange]);

  const handleTypeChange = (type: GradientType) => {
    handleChange({ ...gradient, type });
  };

  const handleAngleChange = (angle: number) => {
    handleChange({ ...gradient, angle });
  };

  const handleShapeChange = (shape: 'circle' | 'ellipse') => {
    handleChange({ ...gradient, shape });
  };

  const handleStopColorChange = (index: number, color: string) => {
    const newStops = [...gradient.stops];
    newStops[index] = { ...newStops[index], color };
    handleChange({ ...gradient, stops: newStops });
  };

  const handleStopPositionChange = (index: number, position: number) => {
    const newStops = [...gradient.stops];
    newStops[index] = { ...newStops[index], position };
    handleChange({ ...gradient, stops: newStops });
  };

  const handleAddStop = () => {
    const newPosition = gradient.stops.length > 0
      ? Math.round((gradient.stops[gradient.stops.length - 1].position + 100) / 2)
      : 50;
    
    const newStops = [...gradient.stops, { color: '#888888', position: newPosition }];
    handleChange({ ...gradient, stops: newStops });
  };

  const handleRemoveStop = (index: number) => {
    if (gradient.stops.length <= 2) return; // Minimum 2 stops
    const newStops = gradient.stops.filter((_, i) => i !== index);
    handleChange({ ...gradient, stops: newStops });
  };

  const handleCopyCSS = () => {
    const css = gradientToCSS(gradient);
    navigator.clipboard.writeText(css);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePresetClick = (preset: GradientValue) => {
    handleChange(preset);
  };

  const cssValue = gradientToCSS(gradient);

  return (
    <div className={`color-gradient-input ${className}`}>
      {label && (
        <label className="block mb-2 flex items-center gap-2">
          <Palette className="w-4 h-4 text-gray-500" />
          <span>{label}</span>
        </label>
      )}

      {/* Preview */}
      <div
        className="w-full h-24 rounded-lg border-2 border-gray-300 mb-4 shadow-sm"
        style={{ background: cssValue }}
      />

      {/* Type Selection */}
      <div className="mb-4 flex gap-2">
        <Button
          variant={gradient.type === 'linear' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => handleTypeChange('linear')}
          disabled={disabled}
        >
          Linear
        </Button>
        <Button
          variant={gradient.type === 'radial' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => handleTypeChange('radial')}
          disabled={disabled}
        >
          Radial
        </Button>
      </div>

      {/* Angle/Shape Control */}
      {gradient.type === 'linear' ? (
        <div className="mb-4">
          <label className="block text-sm mb-2">
            Angle: {gradient.angle}°
          </label>
          <input
            type="range"
            min="0"
            max="360"
            value={gradient.angle || 90}
            onChange={(e) => handleAngleChange(parseInt(e.target.value))}
            disabled={disabled}
            className="w-full"
          />
        </div>
      ) : (
        <div className="mb-4 flex gap-2">
          <Button
            variant={gradient.shape === 'circle' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => handleShapeChange('circle')}
            disabled={disabled}
          >
            Circle
          </Button>
          <Button
            variant={gradient.shape === 'ellipse' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => handleShapeChange('ellipse')}
            disabled={disabled}
          >
            Ellipse
          </Button>
        </div>
      )}

      {/* Color Stops */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm">Color Stops</label>
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddStop}
            disabled={disabled || gradient.stops.length >= 10}
            icon={<Plus className="w-4 h-4" />}
          >
            Add Stop
          </Button>
        </div>

        <div className="space-y-2">
          {gradient.stops.map((stop, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="color"
                value={stop.color}
                onChange={(e) => handleStopColorChange(index, e.target.value)}
                disabled={disabled}
                className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={stop.color}
                onChange={(e) => handleStopColorChange(index, e.target.value)}
                disabled={disabled}
                className="w-24 px-2 py-1 border border-gray-300 rounded text-sm font-mono"
              />
              <input
                type="range"
                min="0"
                max="100"
                value={stop.position}
                onChange={(e) => handleStopPositionChange(index, parseInt(e.target.value))}
                disabled={disabled}
                className="flex-1"
              />
              <span className="w-12 text-sm text-gray-600">{stop.position}%</span>
              <button
                type="button"
                onClick={() => handleRemoveStop(index)}
                disabled={disabled || gradient.stops.length <= 2}
                className="p-2 text-red-500 hover:bg-red-50 rounded disabled:opacity-30"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* CSS Output */}
      <div className="mb-4">
        <label className="block text-sm mb-2">CSS Output</label>
        <div className="relative">
          <textarea
            value={cssValue}
            readOnly
            rows={2}
            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg font-mono text-xs bg-gray-50 resize-none"
          />
          <button
            type="button"
            onClick={handleCopyCSS}
            className="absolute right-2 top-2 p-1 hover:bg-gray-200 rounded"
            title="Copy CSS"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <Copy className="w-4 h-4 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Presets */}
      {showPresets && (
        <div>
          <label className="block text-sm mb-2">Presets</label>
          <div className="grid grid-cols-2 gap-2">
            {GRADIENT_PRESETS.map((preset, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handlePresetClick(preset.gradient)}
                disabled={disabled}
                className="h-12 rounded-lg border-2 border-gray-300 hover:border-blue-500 transition-colors relative overflow-hidden group"
                style={{ background: gradientToCSS(preset.gradient) }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                  <span className="text-white opacity-0 group-hover:opacity-100 text-xs font-medium">
                    {preset.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default ColorGradientInput;
