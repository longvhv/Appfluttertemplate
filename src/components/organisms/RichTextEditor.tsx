import React, { useState, useRef } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Link,
  Image,
  Code,
  Quote,
  Undo,
  Redo,
} from 'lucide-react';

export interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  minHeight?: string;
  maxHeight?: string;
  showToolbar?: boolean;
  className?: string;
  label?: string;
}

export function RichTextEditor({
  value = '',
  onChange,
  placeholder = 'Start typing...',
  disabled = false,
  minHeight = '200px',
  maxHeight = '500px',
  showToolbar = true,
  className = '',
  label,
}: RichTextEditorProps) {
  const [content, setContent] = useState(value);
  const editorRef = useRef<HTMLDivElement>(null);

  const executeCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    updateContent();
  };

  const updateContent = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      setContent(html);
      onChange?.(html);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      executeCommand('createLink', url);
    }
  };

  const insertImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      executeCommand('insertImage', url);
    }
  };

  const toolbarButtons = [
    { icon: Bold, command: 'bold', title: 'Bold (Ctrl+B)' },
    { icon: Italic, command: 'italic', title: 'Italic (Ctrl+I)' },
    { icon: Underline, command: 'underline', title: 'Underline (Ctrl+U)' },
    { icon: Strikethrough, command: 'strikeThrough', title: 'Strikethrough' },
    { icon: AlignLeft, command: 'justifyLeft', title: 'Align Left' },
    { icon: AlignCenter, command: 'justifyCenter', title: 'Align Center' },
    { icon: AlignRight, command: 'justifyRight', title: 'Align Right' },
    { icon: List, command: 'insertUnorderedList', title: 'Bullet List' },
    { icon: ListOrdered, command: 'insertOrderedList', title: 'Numbered List' },
    { icon: Quote, command: 'formatBlock', value: 'blockquote', title: 'Quote' },
    { icon: Code, command: 'formatBlock', value: 'pre', title: 'Code Block' },
    { icon: Undo, command: 'undo', title: 'Undo (Ctrl+Z)' },
    { icon: Redo, command: 'redo', title: 'Redo (Ctrl+Y)' },
  ];

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
          <div className="flex flex-wrap gap-1 p-2 border-b border-border dark:border-border bg-muted/30 dark:bg-muted/30">
            {/* Text Formatting */}
            <div className="flex gap-1 pr-2 border-r border-border dark:border-border">
              {toolbarButtons.slice(0, 4).map((btn) => {
                const Icon = btn.icon;
                return (
                  <button
                    key={btn.command}
                    onClick={() => executeCommand(btn.command, btn.value)}
                    disabled={disabled}
                    title={btn.title}
                    className="p-2 hover:bg-muted dark:hover:bg-muted rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Icon className="w-4 h-4 text-foreground" />
                  </button>
                );
              })}
            </div>

            {/* Alignment */}
            <div className="flex gap-1 pr-2 border-r border-border dark:border-border">
              {toolbarButtons.slice(4, 7).map((btn) => {
                const Icon = btn.icon;
                return (
                  <button
                    key={btn.command}
                    onClick={() => executeCommand(btn.command, btn.value)}
                    disabled={disabled}
                    title={btn.title}
                    className="p-2 hover:bg-muted dark:hover:bg-muted rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Icon className="w-4 h-4 text-foreground" />
                  </button>
                );
              })}
            </div>

            {/* Lists & Blocks */}
            <div className="flex gap-1 pr-2 border-r border-border dark:border-border">
              {toolbarButtons.slice(7, 11).map((btn) => {
                const Icon = btn.icon;
                return (
                  <button
                    key={btn.command}
                    onClick={() => executeCommand(btn.command, btn.value)}
                    disabled={disabled}
                    title={btn.title}
                    className="p-2 hover:bg-muted dark:hover:bg-muted rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Icon className="w-4 h-4 text-foreground" />
                  </button>
                );
              })}
            </div>

            {/* Insert Link & Image */}
            <div className="flex gap-1 pr-2 border-r border-border dark:border-border">
              <button
                onClick={insertLink}
                disabled={disabled}
                title="Insert Link"
                className="p-2 hover:bg-muted dark:hover:bg-muted rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Link className="w-4 h-4 text-foreground" />
              </button>
              <button
                onClick={insertImage}
                disabled={disabled}
                title="Insert Image"
                className="p-2 hover:bg-muted dark:hover:bg-muted rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Image className="w-4 h-4 text-foreground" />
              </button>
            </div>

            {/* Undo/Redo */}
            <div className="flex gap-1">
              {toolbarButtons.slice(11).map((btn) => {
                const Icon = btn.icon;
                return (
                  <button
                    key={btn.command}
                    onClick={() => executeCommand(btn.command, btn.value)}
                    disabled={disabled}
                    title={btn.title}
                    className="p-2 hover:bg-muted dark:hover:bg-muted rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Icon className="w-4 h-4 text-foreground" />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Editor Content */}
        <div
          ref={editorRef}
          contentEditable={!disabled}
          onInput={updateContent}
          onPaste={handlePaste}
          dangerouslySetInnerHTML={{ __html: content }}
          className={`
            p-4 outline-none overflow-y-auto
            text-foreground
            prose prose-sm max-w-none
            prose-headings:text-foreground
            prose-p:text-foreground
            prose-strong:text-foreground
            prose-code:text-foreground
            prose-pre:bg-muted
            prose-blockquote:text-foreground
            prose-blockquote:border-indigo-600
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          style={{
            minHeight,
            maxHeight,
          }}
          data-placeholder={placeholder}
        />
      </div>

      {/* Character Count */}
      <div className="mt-2 text-xs text-muted-foreground text-right">
        {content.replace(/<[^>]*>/g, '').length} characters
      </div>

      {/* CSS for placeholder */}
      <style>{`
        [contenteditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
