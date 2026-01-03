import React, { useState, useRef, useEffect } from 'react';
import { Copy, Check, Download, Maximize2, Minimize2 } from 'lucide-react';

export interface CodeEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  language?: 'javascript' | 'typescript' | 'html' | 'css' | 'json' | 'python' | 'markdown' | 'plaintext';
  theme?: 'light' | 'dark';
  readOnly?: boolean;
  showLineNumbers?: boolean;
  showCopyButton?: boolean;
  minHeight?: string;
  maxHeight?: string;
  className?: string;
  label?: string;
}

export function CodeEditor({
  value = '',
  onChange,
  language = 'javascript',
  theme = 'dark',
  readOnly = false,
  showLineNumbers = true,
  showCopyButton = true,
  minHeight = '200px',
  maxHeight = '600px',
  className = '',
  label,
}: CodeEditorProps) {
  const [code, setCode] = useState(value);
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCode(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setCode(newCode);
    onChange?.(newCode);
    updateLineNumbers();
  };

  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = e.currentTarget.scrollTop;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newCode = code.substring(0, start) + '  ' + code.substring(end);
      setCode(newCode);
      onChange?.(newCode);
      
      // Set cursor position after tab
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  const updateLineNumbers = () => {
    if (lineNumbersRef.current && textareaRef.current) {
      const lines = code.split('\n').length;
      lineNumbersRef.current.innerHTML = Array.from(
        { length: lines },
        (_, i) => `<div>${i + 1}</div>`
      ).join('');
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    const extensions: { [key: string]: string } = {
      javascript: 'js',
      typescript: 'ts',
      html: 'html',
      css: 'css',
      json: 'json',
      python: 'py',
      markdown: 'md',
      plaintext: 'txt',
    };
    
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${extensions[language]}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  useEffect(() => {
    updateLineNumbers();
  }, [code]);

  const themeClasses = theme === 'dark'
    ? 'bg-gray-900 text-gray-100'
    : 'bg-white text-gray-900';

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-2">
          {label}
        </label>
      )}

      <div
        className={`
          relative border-2 border-border dark:border-border rounded-xl overflow-hidden
          ${isFullscreen ? 'fixed inset-4 z-50' : ''}
        `}
        style={{
          minHeight: isFullscreen ? 'auto' : minHeight,
          maxHeight: isFullscreen ? 'auto' : maxHeight,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-border dark:border-border bg-muted/30 dark:bg-muted/30">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground capitalize">
              {language}
            </span>
            {readOnly && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400">
                Read Only
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {showCopyButton && (
              <button
                onClick={handleCopy}
                className="p-1.5 hover:bg-muted dark:hover:bg-muted rounded transition-colors"
                title="Copy code"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
            )}
            <button
              onClick={handleDownload}
              className="p-1.5 hover:bg-muted dark:hover:bg-muted rounded transition-colors"
              title="Download code"
            >
              <Download className="w-4 h-4 text-muted-foreground" />
            </button>
            <button
              onClick={toggleFullscreen}
              className="p-1.5 hover:bg-muted dark:hover:bg-muted rounded transition-colors"
              title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4 text-muted-foreground" />
              ) : (
                <Maximize2 className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Editor */}
        <div className={`flex ${themeClasses} h-full`}>
          {/* Line Numbers */}
          {showLineNumbers && (
            <div
              ref={lineNumbersRef}
              className="flex flex-col text-right pr-4 pl-4 py-4 select-none overflow-hidden border-r border-gray-700"
              style={{ minWidth: '50px' }}
            >
              <div className="text-gray-500">1</div>
            </div>
          )}

          {/* Code Textarea */}
          <textarea
            ref={textareaRef}
            value={code}
            onChange={handleChange}
            onScroll={handleScroll}
            onKeyDown={handleKeyDown}
            readOnly={readOnly}
            spellCheck={false}
            className={`
              flex-1 p-4 font-mono text-sm resize-none outline-none
              ${themeClasses}
              ${readOnly ? 'cursor-default' : ''}
            `}
            style={{
              tabSize: 2,
              lineHeight: '1.5',
            }}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-border dark:border-border bg-muted/30 dark:bg-muted/30 text-xs text-muted-foreground">
          <span>
            Lines: {code.split('\n').length} | Characters: {code.length}
          </span>
          <span>
            {readOnly ? 'Read-only mode' : 'Press Tab for indent'}
          </span>
        </div>
      </div>
    </div>
  );
}

// Syntax Highlighted Code Display (Read-only)
export function CodeBlock({
  code,
  language = 'javascript',
  showLineNumbers = true,
  maxHeight = '400px',
}: {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  maxHeight?: string;
}) {
  return (
    <CodeEditor
      value={code}
      language={language as any}
      readOnly
      showLineNumbers={showLineNumbers}
      maxHeight={maxHeight}
    />
  );
}
