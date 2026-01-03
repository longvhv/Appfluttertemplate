import React, { useState, useEffect } from 'react';
import { Check, X, Copy, Download, Upload, Code } from 'lucide-react';

export interface JSONInputProps {
  value?: object | string;
  onChange?: (value: object | null) => void;
  placeholder?: string;
  disabled?: boolean;
  minHeight?: string;
  maxHeight?: string;
  showValidation?: boolean;
  showActions?: boolean;
  className?: string;
  label?: string;
}

export function JSONInput({
  value,
  onChange,
  placeholder = '{\n  "key": "value"\n}',
  disabled = false,
  minHeight = '200px',
  maxHeight = '500px',
  showValidation = true,
  showActions = true,
  className = '',
  label,
}: JSONInputProps) {
  const [jsonText, setJsonText] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (value) {
      try {
        const formatted = typeof value === 'string' 
          ? value 
          : JSON.stringify(value, null, 2);
        setJsonText(formatted);
        setIsValid(true);
        setError('');
      } catch (err) {
        setError('Invalid JSON');
        setIsValid(false);
      }
    }
  }, [value]);

  const handleChange = (text: string) => {
    setJsonText(text);

    if (!text.trim()) {
      setIsValid(true);
      setError('');
      if (onChange) onChange(null);
      return;
    }

    try {
      const parsed = JSON.parse(text);
      setIsValid(true);
      setError('');
      if (onChange) onChange(parsed);
    } catch (err) {
      setIsValid(false);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Invalid JSON syntax');
      }
    }
  };

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(jsonText);
      const formatted = JSON.stringify(parsed, null, 2);
      setJsonText(formatted);
      setIsValid(true);
      setError('');
    } catch (err) {
      // Keep current text if invalid
    }
  };

  const handleMinify = () => {
    try {
      const parsed = JSON.parse(jsonText);
      const minified = JSON.stringify(parsed);
      setJsonText(minified);
      setIsValid(true);
      setError('');
    } catch (err) {
      // Keep current text if invalid
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([jsonText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'data.json';
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      handleChange(text);
    };
    reader.readAsText(file);
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-2">
          {label}
        </label>
      )}

      <div className="border-2 border-border dark:border-border rounded-xl overflow-hidden bg-card dark:bg-card">
        {/* Toolbar */}
        {showActions && (
          <div className="flex items-center justify-between gap-2 p-2 border-b border-border dark:border-border bg-muted/30 dark:bg-muted/30">
            <div className="flex items-center gap-1">
              <button
                onClick={handleFormat}
                disabled={disabled || !isValid}
                className="px-3 py-1.5 text-xs font-medium rounded-lg hover:bg-muted dark:hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-foreground"
              >
                Format
              </button>

              <button
                onClick={handleMinify}
                disabled={disabled || !isValid}
                className="px-3 py-1.5 text-xs font-medium rounded-lg hover:bg-muted dark:hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-foreground"
              >
                Minify
              </button>

              <div className="w-px h-4 bg-border dark:bg-border mx-1" />

              <button
                onClick={handleCopy}
                disabled={disabled}
                className="p-1.5 rounded-lg hover:bg-muted dark:hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Copy JSON"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4 text-foreground" />
                )}
              </button>

              <button
                onClick={handleDownload}
                disabled={disabled || !isValid}
                className="p-1.5 rounded-lg hover:bg-muted dark:hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Download JSON"
              >
                <Download className="w-4 h-4 text-foreground" />
              </button>

              <label className="relative">
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleImport}
                  disabled={disabled}
                  className="hidden"
                />
                <div className="p-1.5 rounded-lg hover:bg-muted dark:hover:bg-muted transition-colors cursor-pointer">
                  <Upload className="w-4 h-4 text-foreground" />
                </div>
              </label>
            </div>

            {/* Validation Status */}
            {showValidation && (
              <div className="flex items-center gap-2">
                {isValid ? (
                  <div className="flex items-center gap-1 text-xs font-medium text-green-600">
                    <Check className="w-3 h-3" />
                    <span>Valid JSON</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-xs font-medium text-red-600">
                    <X className="w-3 h-3" />
                    <span>Invalid</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Editor */}
        <div className="relative">
          <textarea
            value={jsonText}
            onChange={(e) => handleChange(e.target.value)}
            disabled={disabled}
            placeholder={placeholder}
            className={`
              w-full p-4 bg-transparent text-foreground font-mono text-sm resize-none
              outline-none placeholder:text-muted-foreground
              ${!isValid ? 'text-red-600' : ''}
            `}
            style={{
              minHeight,
              maxHeight,
            }}
          />

          {/* Line Numbers (Optional Enhancement) */}
          <div className="absolute top-4 left-2 select-none pointer-events-none text-muted-foreground/50 font-mono text-sm leading-6">
            {jsonText.split('\n').map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="px-4 py-2 border-t border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20 text-xs text-red-600 dark:text-red-400 font-mono">
            <X className="w-3 h-3 inline mr-1" />
            {error}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-border dark:border-border bg-muted/30 dark:bg-muted/30 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Code className="w-3 h-3" />
            <span>JSON</span>
          </div>
          <div className="flex items-center gap-4">
            <span>{jsonText.split('\n').length} lines</span>
            <span>{jsonText.length} characters</span>
          </div>
        </div>
      </div>
    </div>
  );
}