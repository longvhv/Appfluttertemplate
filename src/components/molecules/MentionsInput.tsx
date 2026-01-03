import React, { useState, useRef, useEffect } from 'react';
import { AtSign } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface MentionUser {
  id: string;
  name: string;
  username: string;
  avatar?: string;
}

export interface MentionsInputProps {
  value?: string;
  onChange?: (value: string, mentions: MentionUser[]) => void;
  users: MentionUser[];
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
  rows?: number;
  className?: string;
  label?: string;
}

export function MentionsInput({
  value = '',
  onChange,
  users,
  placeholder = 'Type @ to mention someone...',
  disabled = false,
  maxLength,
  rows = 4,
  className = '',
  label,
}: MentionsInputProps) {
  const [text, setText] = useState(value);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<MentionUser[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mentionStart, setMentionStart] = useState(-1);
  const [mentions, setMentions] = useState<MentionUser[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node) &&
        textareaRef.current &&
        !textareaRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTextChange = (newText: string) => {
    setText(newText);

    const cursorPos = textareaRef.current?.selectionStart || 0;
    const textBeforeCursor = newText.slice(0, cursorPos);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');

    if (lastAtIndex !== -1) {
      const textAfterAt = textBeforeCursor.slice(lastAtIndex + 1);
      
      // Check if we're still in a mention (no space after @)
      if (!textAfterAt.includes(' ')) {
        setMentionStart(lastAtIndex);
        
        // Filter users based on query
        const query = textAfterAt.toLowerCase();
        const filtered = users.filter(
          (user) =>
            user.name.toLowerCase().includes(query) ||
            user.username.toLowerCase().includes(query)
        );
        
        setSuggestions(filtered);
        setShowSuggestions(filtered.length > 0);
        setSelectedIndex(0);
      } else {
        setShowSuggestions(false);
      }
    } else {
      setShowSuggestions(false);
    }

    // Extract mentions from text
    const mentionRegex = /@\[([^\]]+)\]\(([^)]+)\)/g;
    const extractedMentions: MentionUser[] = [];
    let match;
    
    while ((match = mentionRegex.exec(newText)) !== null) {
      const user = users.find((u) => u.id === match[2]);
      if (user) extractedMentions.push(user);
    }
    
    setMentions(extractedMentions);
    onChange?.(newText, extractedMentions);
  };

  const insertMention = (user: MentionUser) => {
    if (mentionStart === -1) return;

    const beforeMention = text.slice(0, mentionStart);
    const afterMention = text.slice(textareaRef.current?.selectionStart || text.length);
    
    // Format: @[Display Name](userId)
    const mentionText = `@[${user.name}](${user.id})`;
    const newText = beforeMention + mentionText + ' ' + afterMention;
    
    setText(newText);
    setShowSuggestions(false);
    
    // Update mentions list
    const newMentions = [...mentions, user];
    setMentions(newMentions);
    onChange?.(newText, newMentions);

    // Focus back and move cursor
    setTimeout(() => {
      textareaRef.current?.focus();
      const cursorPos = beforeMention.length + mentionText.length + 1;
      textareaRef.current?.setSelectionRange(cursorPos, cursorPos);
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case 'Enter':
        if (suggestions[selectedIndex]) {
          e.preventDefault();
          insertMention(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        break;
    }
  };

  // Render text with highlighted mentions
  const renderPreview = () => {
    const mentionRegex = /@\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = mentionRegex.exec(text)) !== null) {
      // Add text before mention
      if (match.index > lastIndex) {
        parts.push(
          <span key={`text-${lastIndex}`}>
            {text.slice(lastIndex, match.index)}
          </span>
        );
      }

      // Add mention
      parts.push(
        <span
          key={`mention-${match.index}`}
          className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-100 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded font-medium"
        >
          @{match[1]}
        </span>
      );

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(<span key={`text-${lastIndex}`}>{text.slice(lastIndex)}</span>);
    }

    return parts;
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-2">
          {label}
        </label>
      )}

      <div className="relative">
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => handleTextChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          maxLength={maxLength}
          rows={rows}
          className="w-full px-4 py-3 rounded-xl border-2 border-border dark:border-border bg-card dark:bg-card text-foreground placeholder:text-muted-foreground resize-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        />

        {/* Mention Icon */}
        <div className="absolute right-3 bottom-3 text-muted-foreground pointer-events-none">
          <AtSign className="w-5 h-5" />
        </div>

        {/* Suggestions Dropdown */}
        <AnimatePresence>
          {showSuggestions && suggestions.length > 0 && (
            <motion.div
              ref={suggestionsRef}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-50 w-full mt-2 bg-card dark:bg-card border border-border dark:border-border rounded-xl shadow-xl overflow-hidden"
            >
              <div className="max-h-48 overflow-y-auto">
                {suggestions.map((user, index) => (
                  <button
                    key={user.id}
                    onClick={() => insertMention(user)}
                    className={`
                      w-full px-4 py-3 text-left transition-colors
                      flex items-center gap-3
                      ${index === selectedIndex
                        ? 'bg-indigo-50 dark:bg-indigo-950/30'
                        : 'hover:bg-muted/50 dark:hover:bg-muted/50'
                      }
                    `}
                  >
                    {/* Avatar */}
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-semibold text-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {user.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        @{user.username}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Preview */}
      {text && mentions.length > 0 && (
        <div className="mt-3 p-3 rounded-xl bg-muted/30 dark:bg-muted/30 text-sm text-foreground">
          <div className="text-xs font-medium text-muted-foreground mb-2">
            Preview:
          </div>
          <div className="whitespace-pre-wrap break-words">
            {renderPreview()}
          </div>
        </div>
      )}

      {/* Character Count & Mentions */}
      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {mentions.length > 0 && `${mentions.length} mention${mentions.length !== 1 ? 's' : ''}`}
        </span>
        {maxLength && (
          <span>
            {text.length} / {maxLength}
          </span>
        )}
      </div>
    </div>
  );
}
