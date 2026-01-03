import React, { useState, useRef } from 'react';
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Link,
  Image,
  Code,
  Eye,
  EyeOff,
} from 'lucide-react';

export interface MarkdownInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  minHeight?: string;
  maxHeight?: string;
  showToolbar?: boolean;
  showPreview?: boolean;
  className?: string;
  label?: string;
}

export function MarkdownInput({
  value = '',
  onChange,
  placeholder = 'Write in Markdown...',
  disabled = false,
  minHeight = '200px',
  maxHeight = '500px',
  showToolbar = true,
  showPreview: initialShowPreview = true,
  className = '',
  label,
}: MarkdownInputProps) {
  const [markdown, setMarkdown] = useState(value);
  const [showPreview, setShowPreview] = useState(initialShowPreview);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (newValue: string) => {
    setMarkdown(newValue);
    onChange?.(newValue);
  };

  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = markdown.substring(start, end);
    const newText =
      markdown.substring(0, start) +
      before +
      selectedText +
      after +
      markdown.substring(end);

    handleChange(newText);

    // Set cursor position
    setTimeout(() => {
      textarea.focus();
      const cursorPos = start + before.length + selectedText.length;
      textarea.setSelectionRange(cursorPos, cursorPos);
    }, 0);
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      insertMarkdown('[', `](${url})`);
    }
  };

  const insertImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      insertMarkdown('![Alt text](', `${url})`);
    }
  };

  const toolbarButtons = [
    {
      icon: Bold,
      title: 'Bold',
      action: () => insertMarkdown('**', '**'),
    },
    {
      icon: Italic,
      title: 'Italic',
      action: () => insertMarkdown('*', '*'),
    },
    {
      icon: Heading1,
      title: 'Heading 1',
      action: () => insertMarkdown('# '),
    },
    {
      icon: Heading2,
      title: 'Heading 2',
      action: () => insertMarkdown('## '),
    },
    {
      icon: List,
      title: 'Bullet List',
      action: () => insertMarkdown('- '),
    },
    {
      icon: ListOrdered,
      title: 'Numbered List',
      action: () => insertMarkdown('1. '),
    },
    {
      icon: Code,
      title: 'Code',
      action: () => insertMarkdown('`', '`'),
    },
    {
      icon: Link,
      title: 'Link',
      action: insertLink,
    },
    {
      icon: Image,
      title: 'Image',
      action: insertImage,
    },
  ];

  // Simple markdown to HTML converter
  const renderMarkdown = (md: string) => {
    let html = md;

    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Italic
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Code
    html = html.replace(/`(.*?)`/g, '<code>$1</code>');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="text-indigo-600 hover:underline">$1</a>');

    // Images
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full rounded-lg" />');

    // Lists
    html = html.replace(/^\* (.*)$/gim, '<li>$1</li>');
    html = html.replace(/^\d+\. (.*)$/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

    // Line breaks
    html = html.replace(/\n/g, '<br />');

    return html;
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
        {showToolbar && (
          <div className="flex items-center justify-between gap-2 p-2 border-b border-border dark:border-border bg-muted/30 dark:bg-muted/30">
            <div className="flex items-center gap-1">
              {toolbarButtons.map((btn, index) => {
                const Icon = btn.icon;
                return (
                  <button
                    key={index}
                    onClick={btn.action}
                    disabled={disabled}
                    title={btn.title}
                    className="p-2 hover:bg-muted dark:hover:bg-muted rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Icon className="w-4 h-4 text-foreground" />
                  </button>
                );
              })}
            </div>

            {/* Preview Toggle */}
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="p-2 hover:bg-muted dark:hover:bg-muted rounded transition-colors flex items-center gap-2"
            >
              {showPreview ? (
                <>
                  <EyeOff className="w-4 h-4" />
                  <span className="text-sm">Hide Preview</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  <span className="text-sm">Show Preview</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Editor & Preview */}
        <div className={`grid ${showPreview ? 'grid-cols-2' : 'grid-cols-1'} divide-x divide-border dark:divide-border`}>
          {/* Editor */}
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={markdown}
              onChange={(e) => handleChange(e.target.value)}
              disabled={disabled}
              placeholder={placeholder}
              className="w-full p-4 bg-transparent text-foreground resize-none outline-none font-mono text-sm"
              style={{
                minHeight,
                maxHeight,
              }}
            />
          </div>

          {/* Preview */}
          {showPreview && (
            <div
              className="p-4 overflow-y-auto prose prose-sm max-w-none"
              style={{
                minHeight,
                maxHeight,
              }}
            >
              {markdown ? (
                <div
                  className="text-foreground"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(markdown) }}
                />
              ) : (
                <p className="text-muted-foreground text-sm italic">
                  Preview will appear here...
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-border dark:border-border bg-muted/30 dark:bg-muted/30 text-xs text-muted-foreground">
          <span>Markdown supported</span>
          <span>{markdown.length} characters</span>
        </div>
      </div>

      {/* Markdown Guide */}
      <details className="mt-3">
        <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
          Markdown Guide
        </summary>
        <div className="mt-2 p-3 bg-muted/30 dark:bg-muted/30 rounded-lg text-xs space-y-1 font-mono">
          <div><strong># Heading 1</strong></div>
          <div><strong>## Heading 2</strong></div>
          <div><strong>**bold**</strong> → <strong>bold</strong></div>
          <div><strong>*italic*</strong> → <em>italic</em></div>
          <div><strong>`code`</strong> → <code>code</code></div>
          <div><strong>[text](url)</strong> → link</div>
          <div><strong>![alt](url)</strong> → image</div>
          <div><strong>- item</strong> → bullet list</div>
          <div><strong>1. item</strong> → numbered list</div>
        </div>
      </details>
    </div>
  );
}
