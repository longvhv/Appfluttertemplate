import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, File, X, Check, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { Button } from '../atoms/Button';

export interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  maxFiles?: number;
  onUpload?: (files: File[]) => void;
  onChange?: (files: File[]) => void;
  variant?: 'default' | 'compact' | 'button';
  showPreview?: boolean;
  disabled?: boolean;
  className?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  accept,
  multiple = false,
  maxSize = 10,
  maxFiles = 5,
  onUpload,
  onChange,
  variant = 'default',
  showPreview = true,
  disabled = false,
  className = '',
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (maxSize && file.size > maxSize * 1024 * 1024) {
      return `${file.name} exceeds ${maxSize}MB`;
    }
    return null;
  };

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;

    const fileArray = Array.from(newFiles);
    const validFiles: File[] = [];
    const newErrors: string[] = [];

    fileArray.forEach((file) => {
      const error = validateFile(file);
      if (error) {
        newErrors.push(error);
      } else {
        validFiles.push(file);
      }
    });

    if (maxFiles && files.length + validFiles.length > maxFiles) {
      newErrors.push(`Maximum ${maxFiles} files allowed`);
      return;
    }

    const updatedFiles = multiple ? [...files, ...validFiles] : validFiles;
    setFiles(updatedFiles);
    setErrors(newErrors);

    if (onChange) {
      onChange(updatedFiles);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!disabled) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleRemove = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    if (onChange) {
      onChange(updatedFiles);
    }
  };

  const handleUpload = async () => {
    if (onUpload && files.length > 0) {
      setUploading(true);
      try {
        await onUpload(files);
        setFiles([]);
      } catch (error) {
        setErrors(['Upload failed']);
      } finally {
        setUploading(false);
      }
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return ImageIcon;
    }
    return File;
  };

  if (variant === 'button') {
    return (
      <div className={className}>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
          disabled={disabled}
        />
        <Button
          onClick={handleClick}
          disabled={disabled}
          variant="outline"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Files
        </Button>

        {files.length > 0 && showPreview && (
          <div className="mt-4 space-y-2">
            {files.map((file, index) => (
              <FilePreview
                key={index}
                file={file}
                onRemove={() => handleRemove(index)}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={className}>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
          disabled={disabled}
        />
        <button
          onClick={handleClick}
          disabled={disabled}
          className={`
            w-full flex items-center gap-3 px-4 py-3 rounded-lg border-2 border-dashed
            transition-colors
            ${isDragging
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <Upload className="w-5 h-5 text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Drop files or click to upload
          </span>
        </button>

        {files.length > 0 && showPreview && (
          <div className="mt-3 space-y-2">
            {files.map((file, index) => (
              <FilePreview
                key={index}
                file={file}
                onRemove={() => handleRemove(index)}
                compact
              />
            ))}
          </div>
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
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
        disabled={disabled}
      />

      {/* Dropzone */}
      <motion.div
        whileHover={!disabled ? { scale: 1.01 } : {}}
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative border-2 border-dashed rounded-xl p-12 text-center
          transition-all cursor-pointer
          ${isDragging
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {isDragging ? 'Drop files here' : 'Upload files'}
        </h3>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Drag and drop or click to browse
        </p>

        <p className="text-xs text-gray-500 dark:text-gray-500">
          {accept ? `Accepted: ${accept}` : 'All file types accepted'} • Max {maxSize}MB
          {multiple && ` • Up to ${maxFiles} files`}
        </p>
      </motion.div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="mt-4 space-y-2">
          {errors.map((error, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm"
            >
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          ))}
        </div>
      )}

      {/* File Previews */}
      {files.length > 0 && showPreview && (
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
              {files.length} file{files.length > 1 ? 's' : ''} selected
            </h4>
            {onUpload && (
              <Button
                onClick={handleUpload}
                disabled={uploading}
                size="sm"
                variant="primary"
              >
                {uploading ? 'Uploading...' : 'Upload All'}
              </Button>
            )}
          </div>

          <div className="space-y-2">
            {files.map((file, index) => (
              <FilePreview
                key={index}
                file={file}
                onRemove={() => handleRemove(index)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface FilePreviewProps {
  file: File;
  onRemove: () => void;
  compact?: boolean;
}

const FilePreview: React.FC<FilePreviewProps> = ({ file, onRemove, compact = false }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const Icon = file.type.startsWith('image/') ? ImageIcon : File;

  // Generate preview for images
  React.useEffect(() => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [file]);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`
        flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800
        ${compact ? 'text-sm' : ''}
      `}
    >
      {preview ? (
        <img
          src={preview}
          alt={file.name}
          className={`${compact ? 'w-8 h-8' : 'w-12 h-12'} object-cover rounded`}
        />
      ) : (
        <div className={`
          ${compact ? 'w-8 h-8' : 'w-12 h-12'}
          flex items-center justify-center rounded bg-gray-200 dark:bg-gray-700
        `}>
          <Icon className={`${compact ? 'w-4 h-4' : 'w-6 h-6'} text-gray-400`} />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <p className={`font-medium text-gray-900 dark:text-white truncate ${compact ? 'text-sm' : ''}`}>
          {file.name}
        </p>
        <p className={`text-gray-500 dark:text-gray-400 ${compact ? 'text-xs' : 'text-sm'}`}>
          {formatSize(file.size)}
        </p>
      </div>

      <button
        onClick={onRemove}
        className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        <X className="w-4 h-4 text-gray-400" />
      </button>
    </motion.div>
  );
};
