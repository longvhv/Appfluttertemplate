import React, { useRef, useState } from 'react';
import { Upload, X, File, FileText, Image as ImageIcon, Film, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface FileWithPreview extends File {
  preview?: string;
}

export interface FileUploadProps {
  value?: FileWithPreview[];
  onChange?: (files: FileWithPreview[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in bytes
  maxFiles?: number;
  disabled?: boolean;
  variant?: 'default' | 'compact';
  showPreview?: boolean;
  className?: string;
}

export function FileUpload({
  value = [],
  onChange,
  accept,
  multiple = false,
  maxSize = 5 * 1024 * 1024, // 5MB default
  maxFiles = 10,
  disabled = false,
  variant = 'default',
  showPreview = true,
  className = '',
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList || !onChange) return;

    setError(null);
    const newFiles: FileWithPreview[] = [];

    // Validate files
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];

      // Check file size
      if (file.size > maxSize) {
        setError(`File ${file.name} exceeds ${formatFileSize(maxSize)}`);
        continue;
      }

      // Check max files
      if (value.length + newFiles.length >= maxFiles) {
        setError(`Maximum ${maxFiles} files allowed`);
        break;
      }

      // Create preview for images
      const fileWithPreview = file as FileWithPreview;
      if (file.type.startsWith('image/')) {
        fileWithPreview.preview = URL.createObjectURL(file);
      }

      newFiles.push(fileWithPreview);
    }

    if (multiple) {
      onChange([...value, ...newFiles]);
    } else {
      onChange(newFiles);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!disabled) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const handleRemove = (index: number) => {
    if (!onChange) return;
    const file = value[index];
    if (file.preview) {
      URL.revokeObjectURL(file.preview);
    }
    onChange(value.filter((_, i) => i !== index));
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return ImageIcon;
    if (file.type.startsWith('video/')) return Film;
    if (file.type.startsWith('audio/')) return Music;
    if (file.type.includes('pdf') || file.type.includes('document')) return FileText;
    return File;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (variant === 'compact') {
    return (
      <div className={className}>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          disabled={disabled}
          className="hidden"
        />

        <button
          type="button"
          onClick={handleClick}
          disabled={disabled}
          className={`
            inline-flex items-center gap-2
            px-4 py-2 rounded-lg
            bg-white dark:bg-gray-900
            border border-gray-300 dark:border-gray-700
            text-gray-700 dark:text-gray-300
            hover:bg-gray-50 dark:hover:bg-gray-800
            transition-colors
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          <Upload className="w-4 h-4" />
          <span className="text-sm font-medium">Upload Files</span>
        </button>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 mt-2">{error}</p>
        )}
      </div>
    );
  }

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        disabled={disabled}
        className="hidden"
      />

      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`
          relative
          border-2 border-dashed rounded-lg
          p-8 text-center
          transition-all
          ${
            isDragging
              ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30'
              : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <Upload
          className={`
            w-12 h-12 mx-auto mb-4
            ${isDragging ? 'text-indigo-500' : 'text-gray-400 dark:text-gray-500'}
          `}
        />

        <p className="text-base font-medium text-gray-900 dark:text-white mb-1">
          {isDragging ? 'Drop files here' : 'Click to upload or drag and drop'}
        </p>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          {accept || 'Any file type'} up to {formatFileSize(maxSize)}
        </p>

        {multiple && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            Maximum {maxFiles} files
          </p>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 mt-2">{error}</p>
      )}

      {/* File List */}
      {showPreview && value.length > 0 && (
        <div className="mt-4 space-y-2">
          <AnimatePresence>
            {value.map((file, index) => {
              const Icon = getFileIcon(file);

              return (
                <motion.div
                  key={`${file.name}-${index}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="
                    flex items-center gap-3
                    p-3 rounded-lg
                    bg-gray-50 dark:bg-gray-800
                    border border-gray-200 dark:border-gray-700
                  "
                >
                  {/* Preview/Icon */}
                  {file.preview ? (
                    <img
                      src={file.preview}
                      alt={file.name}
                      className="w-12 h-12 rounded object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                    </div>
                  )}

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatFileSize(file.size)}
                    </p>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(index);
                    }}
                    className="
                      flex-shrink-0
                      p-1 rounded-full
                      hover:bg-gray-200 dark:hover:bg-gray-700
                      text-gray-500 dark:text-gray-400
                      hover:text-red-600 dark:hover:text-red-400
                      transition-colors
                    "
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
