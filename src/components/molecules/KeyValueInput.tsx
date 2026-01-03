import React, { useState } from 'react';
import { Plus, X, Key as KeyIcon } from 'lucide-react';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';

/**
 * KeyValueInput Component
 * 
 * Input for managing key-value pairs like HTTP headers, metadata, 
 * environment variables, or configuration settings.
 * 
 * @component
 * @example
 * ```tsx
 * <KeyValueInput
 *   value={headers}
 *   onChange={setHeaders}
 *   label="HTTP Headers"
 *   keyPlaceholder="Header Name"
 *   valuePlaceholder="Header Value"
 * />
 * ```
 * 
 * Features:
 * - Dynamic key-value pairs
 * - Add/remove rows
 * - Duplicate key detection
 * - Bulk import/export
 * - Validation
 */

export interface KeyValuePair {
  key: string;
  value: string;
  enabled?: boolean;
}

export interface KeyValueInputProps {
  value?: KeyValuePair[];
  onChange?: (pairs: KeyValuePair[]) => void;
  label?: string;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
  maxPairs?: number;
  allowDuplicateKeys?: boolean;
  allowToggle?: boolean;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  className?: string;
}

export const KeyValueInput: React.FC<KeyValueInputProps> = ({
  value = [],
  onChange,
  label = 'Key-Value Pairs',
  keyPlaceholder = 'Key',
  valuePlaceholder = 'Value',
  maxPairs = 20,
  allowDuplicateKeys = false,
  allowToggle = false,
  required = false,
  disabled = false,
  error,
  helperText,
  className = '',
}) => {
  const [duplicateKeys, setDuplicateKeys] = useState<Set<string>>(new Set());

  const pairs = value.length === 0 ? [{ key: '', value: '', enabled: true }] : value;

  const checkDuplicates = (updatedPairs: KeyValuePair[]) => {
    if (allowDuplicateKeys) {
      setDuplicateKeys(new Set());
      return;
    }

    const keyCounts = new Map<string, number>();
    updatedPairs.forEach(pair => {
      if (pair.key) {
        keyCounts.set(pair.key, (keyCounts.get(pair.key) || 0) + 1);
      }
    });

    const duplicates = new Set<string>();
    keyCounts.forEach((count, key) => {
      if (count > 1) duplicates.add(key);
    });

    setDuplicateKeys(duplicates);
  };

  const handlePairChange = (index: number, field: 'key' | 'value', fieldValue: string) => {
    const updated = [...pairs];
    updated[index] = { ...updated[index], [field]: fieldValue };
    
    checkDuplicates(updated);
    onChange?.(updated);
  };

  const handleToggle = (index: number) => {
    const updated = [...pairs];
    updated[index] = { 
      ...updated[index], 
      enabled: !updated[index].enabled 
    };
    onChange?.(updated);
  };

  const handleAdd = () => {
    if (pairs.length >= maxPairs) return;
    
    const updated = [...pairs, { key: '', value: '', enabled: true }];
    onChange?.(updated);
  };

  const handleRemove = (index: number) => {
    if (pairs.length === 1) {
      // Reset to empty pair instead of removing
      onChange?.([{ key: '', value: '', enabled: true }]);
      return;
    }

    const updated = pairs.filter((_, i) => i !== index);
    checkDuplicates(updated);
    onChange?.(updated);
  };

  const handleBulkImport = () => {
    const input = prompt('Paste key-value pairs (format: key=value or key:value, one per line)');
    if (!input) return;

    const lines = input.split('\n').filter(line => line.trim());
    const imported: KeyValuePair[] = [];

    lines.forEach(line => {
      const separatorMatch = line.match(/[:=]/);
      if (separatorMatch) {
        const separator = separatorMatch[0];
        const [key, ...valueParts] = line.split(separator);
        if (key && valueParts.length > 0) {
          imported.push({
            key: key.trim(),
            value: valueParts.join(separator).trim(),
            enabled: true,
          });
        }
      }
    });

    if (imported.length > 0) {
      const updated = [...pairs.filter(p => p.key || p.value), ...imported].slice(0, maxPairs);
      checkDuplicates(updated);
      onChange?.(updated);
    }
  };

  const handleExport = () => {
    const exported = pairs
      .filter(p => p.key)
      .map(p => `${p.key}=${p.value}`)
      .join('\n');
    
    navigator.clipboard.writeText(exported);
    alert('Copied to clipboard!');
  };

  const nonEmptyCount = pairs.filter(p => p.key || p.value).length;

  return (
    <div className={`key-value-input ${className}`}>
      {label && (
        <div className="flex items-center justify-between mb-3">
          <label className="flex items-center gap-2">
            <KeyIcon className="w-4 h-4 text-gray-500" />
            <span>
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </span>
            <span className="text-xs text-gray-500">
              ({nonEmptyCount}/{maxPairs})
            </span>
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleBulkImport}
              disabled={disabled}
              className="text-xs text-blue-600 hover:text-blue-700 disabled:opacity-50"
            >
              Import
            </button>
            <button
              type="button"
              onClick={handleExport}
              disabled={disabled || nonEmptyCount === 0}
              className="text-xs text-blue-600 hover:text-blue-700 disabled:opacity-50"
            >
              Export
            </button>
          </div>
        </div>
      )}

      {/* Headers */}
      <div className={`grid gap-2 mb-2 ${allowToggle ? 'grid-cols-[40px_1fr_1fr_40px]' : 'grid-cols-[1fr_1fr_40px]'}`}>
        {allowToggle && <div />}
        <div className="text-xs text-gray-500 uppercase tracking-wide">Key</div>
        <div className="text-xs text-gray-500 uppercase tracking-wide">Value</div>
        <div />
      </div>

      {/* Pairs */}
      <div className="space-y-2">
        {pairs.map((pair, index) => {
          const isDuplicate = duplicateKeys.has(pair.key);
          const isEnabled = pair.enabled !== false;

          return (
            <div
              key={index}
              className={`grid gap-2 items-start ${
                allowToggle ? 'grid-cols-[40px_1fr_1fr_40px]' : 'grid-cols-[1fr_1fr_40px]'
              } ${!isEnabled && allowToggle ? 'opacity-50' : ''}`}
            >
              {/* Toggle */}
              {allowToggle && (
                <div className="flex items-center pt-2">
                  <input
                    type="checkbox"
                    checked={isEnabled}
                    onChange={() => handleToggle(index)}
                    disabled={disabled}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {/* Key Input */}
              <Input
                value={pair.key}
                onChange={(e) => handlePairChange(index, 'key', e.target.value)}
                placeholder={keyPlaceholder}
                disabled={disabled || (allowToggle && !isEnabled)}
                error={isDuplicate ? 'Duplicate key' : undefined}
              />

              {/* Value Input */}
              <Input
                value={pair.value}
                onChange={(e) => handlePairChange(index, 'value', e.target.value)}
                placeholder={valuePlaceholder}
                disabled={disabled || (allowToggle && !isEnabled)}
              />

              {/* Remove Button */}
              <button
                type="button"
                onClick={() => handleRemove(index)}
                disabled={disabled}
                className="mt-2 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                title="Remove pair"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Add Button */}
      {pairs.length < maxPairs && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleAdd}
          disabled={disabled}
          icon={<Plus className="w-4 h-4" />}
          className="mt-3"
        >
          Add Pair
        </Button>
      )}

      {/* Error */}
      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}

      {/* Helper Text */}
      {helperText && !error && (
        <p className="mt-2 text-xs text-gray-500">{helperText}</p>
      )}

      {/* Duplicate Warning */}
      {!allowDuplicateKeys && duplicateKeys.size > 0 && (
        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
          ⚠️ Duplicate keys detected: {Array.from(duplicateKeys).join(', ')}
        </div>
      )}

      {/* Import Format Hint */}
      {!helperText && !error && (
        <p className="mt-2 text-xs text-gray-400">
          Import format: key=value or key:value (one per line)
        </p>
      )}
    </div>
  );
};

export default KeyValueInput;
