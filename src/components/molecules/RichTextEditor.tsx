import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  Code,
  Quote,
  Undo,
  Redo,
} from 'lucide-react';

export interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
  maxHeight?: number;
  showToolbar?: boolean;
  disabled?: boolean;
  className?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value = '',
  onChange,
  placeholder = 'Start typing...',
  minHeight = 200,
  maxHeight = 500,
  showToolbar = true,
  disabled = false,
  className = '',
}) => {
  const [content, setContent] = useState(value);
  const editorRef = useRef<HTMLDivElement>(null);

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      setContent(html);
      if (onChange) {
        onChange(html);
      }
    }
  };

  const execCommand = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const insertImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      execCommand('insertImage', url);
    }
  };

  const toolbarButtons = [
    { icon: Bold, command: 'bold', title: 'Bold (⌘B)' },
    { icon: Italic, command: 'italic', title: 'Italic (⌘I)' },
    { icon: Underline, command: 'underline', title: 'Underline (⌘U)' },
    { type: 'divider' },
    { icon: List, command: 'insertUnorderedList', title: 'Bullet List' },
    { icon: ListOrdered, command: 'insertOrderedList', title: 'Numbered List' },
    { type: 'divider' },
    { icon: LinkIcon, command: 'link', title: 'Insert Link', onClick: insertLink },
    { icon: ImageIcon, command: 'image', title: 'Insert Image', onClick: insertImage },
    { type: 'divider' },
    { icon: Quote, command: 'formatBlock', value: 'blockquote', title: 'Quote' },
    { icon: Code, command: 'formatBlock', value: 'pre', title: 'Code Block' },
    { type: 'divider' },
    { icon: Undo, command: 'undo', title: 'Undo (⌘Z)' },
    { icon: Redo, command: 'redo', title: 'Redo (⌘⇧Z)' },
  ];

  return (
    <div className={`border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden ${className}`}>
      {/* Toolbar */}
      {showToolbar && (
        <div className="flex items-center gap-1 p-2 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
          {toolbarButtons.map((button, index) => {
            if (button.type === 'divider') {
              return (
                <div
                  key={index}
                  className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1"
                />
              );
            }

            const Icon = button.icon!;
            return (
              <motion.button
                key={index}
                type="button"
                onClick={() => {
                  if (button.onClick) {
                    button.onClick();
                  } else if (button.value) {
                    execCommand(button.command, button.value);
                  } else {
                    execCommand(button.command);
                  }
                }}
                disabled={disabled}
                title={button.title}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Icon className="w-4 h-4" />
              </motion.button>
            );
          })}
        </div>
      )}

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable={!disabled}
        onInput={handleInput}
        dangerouslySetInnerHTML={{ __html: content }}
        className={`
          p-4 outline-none overflow-y-auto
          text-gray-900 dark:text-white
          ${disabled ? 'bg-gray-50 dark:bg-gray-900 cursor-not-allowed' : 'bg-white dark:bg-gray-950'}
          prose prose-sm dark:prose-invert max-w-none
          [&_a]:text-blue-600 [&_a]:underline
          [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic
          [&_pre]:bg-gray-100 [&_pre]:dark:bg-gray-800 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto
          [&_code]:bg-gray-100 [&_code]:dark:bg-gray-800 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded
          [&_img]:rounded-lg [&_img]:max-w-full
          [&_ul]:list-disc [&_ul]:pl-6
          [&_ol]:list-decimal [&_ol]:pl-6
        `}
        style={{
          minHeight: `${minHeight}px`,
          maxHeight: `${maxHeight}px`,
        }}
        data-placeholder={placeholder}
      />

      {/* Character count */}
      <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {editorRef.current?.innerText.length || 0} characters
        </p>
      </div>
    </div>
  );
};

// Minimal variant
export const SimpleTextEditor: React.FC<RichTextEditorProps> = (props) => (
  <RichTextEditor {...props} showToolbar={false} />
);
