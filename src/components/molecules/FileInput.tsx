import React, { useRef, useState } from 'react';
import { Upload, X, File, Image, FileText, FileCode, Music, Video } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface FileInputProps {
  value?: File | File[];
  onChange?: (files: File | File[] | null) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  maxFiles?: number;
  disabled?: boolean;
  showPreview?: boolean;
  dragAndDrop?: boolean;
  className?: string;
  label?: string;
}

export function FileInput({
  value,
  onChange,
  accept,
  multiple = false,
  maxSize = 10,
  maxFiles = 5,
  disabled = false,
  showPreview = true,
  dragAndDrop = true,
  className = '',
  label,
}: FileInputProps) {
  const [files, setFiles] = useState<File[]>(
    value ? (Array.isArray(value) ? value : [value]) : []
  );
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (maxSize && file.size > maxSize * 1024 * 1024) {
      return `File size exceeds ${maxSize}MB`;
    }
    return null;
  };

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;

    const filesArray = Array.from(newFiles);
    const validFiles: File[] = [];
    let errorMsg = '';

    for (const file of filesArray) {
      const validation = validateFile(file);
      if (validation) {
        errorMsg = validation;
        break;
      }
      validFiles.push(file);
    }

    if (errorMsg) {
      setError(errorMsg);
      setTimeout(() => setError(''), 3000);
      return;
    }

    if (multiple) {
      const totalFiles = [...files, ...validFiles];
      if (maxFiles && totalFiles.length > maxFiles) {
        setError(`Maximum ${maxFiles} files allowed`);
        setTimeout(() => setError(''), 3000);
        return;
      }
      setFiles(totalFiles);
      onChange?.(totalFiles);
    } else {
      setFiles(validFiles);
      onChange?.(validFiles[0]);
    }

    setError('');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (!disabled) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onChange?.(multiple ? newFiles : null);
  };

  const getFileIcon = (file: File) => {
    const type = file.type;
    if (type.startsWith('image/')) return <Image className="w-5 h-5" />;
    if (type.startsWith('video/')) return <Video className="w-5 h-5" />;
    if (type.startsWith('audio/')) return <Music className="w-5 h-5" />;
    if (type.includes('pdf') || type.includes('document')) return <FileText className="w-5 h-5" />;
    if (type.includes('code') || type.includes('text')) return <FileCode className="w-5 h-5" />;
    return <File className="w-5 h-5" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-2">
          {label}
        </label>
      )}

      {/* Drop Zone */}
      <div
        onDrop={dragAndDrop ? handleDrop : undefined}
        onDragOver={dragAndDrop ? handleDragOver : undefined}
        onDragLeave={dragAndDrop ? handleDragLeave : undefined}
        onClick={() => !disabled && inputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
          transition-all
          ${dragOver
            ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/20'
            : error
            ? 'border-red-600 bg-red-50 dark:bg-red-950/20'
            : 'border-border dark:border-border hover:border-indigo-400 dark:hover:border-indigo-600'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          disabled={disabled}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-3">
          <div className={`
            p-3 rounded-full
            ${error
              ? 'bg-red-100 dark:bg-red-950/30'
              : 'bg-indigo-100 dark:bg-indigo-950/30'
            }
          `}>
            <Upload className={`w-6 h-6 ${error ? 'text-red-600' : 'text-indigo-600'}`} />
          </div>

          <div>
            <p className="text-sm font-medium text-foreground">
              {dragAndDrop ? 'Drop files here or click to browse' : 'Click to browse files'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {accept ? `Accepts: ${accept}` : 'All file types'}
              {maxSize && ` • Max: ${maxSize}MB`}
              {multiple && maxFiles && ` • Up to ${maxFiles} files`}
            </p>
          </div>
        </div>

        {error && (
          <p className="mt-2 text-xs text-red-600">{error}</p>
        )}
      </div>

      {/* File List */}
      {showPreview && files.length > 0 && (
        <div className="mt-4 space-y-2">
          <AnimatePresence>
            {files.map((file, index) => (
              <motion.div
                key={`${file.name}-${index}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 dark:bg-muted/50"
              >
                {/* Preview */}
                {file.type.startsWith('image/') ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-card dark:bg-card text-indigo-600">
                    {getFileIcon(file)}
                  </div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </div>

                {/* Remove Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  className="p-2 hover:bg-muted dark:hover:bg-muted rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
