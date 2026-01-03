import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, File, FileImage, FileVideo, FileAudio, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface UploadFile {
  id: string;
  file: File;
  preview?: string;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

export interface AdvancedFileUploadProps {
  accept?: string;
  maxSize?: number; // in bytes
  maxFiles?: number;
  multiple?: boolean;
  onUpload?: (files: File[]) => Promise<void>;
  onFileRemove?: (id: string) => void;
  showPreview?: boolean;
  className?: string;
}

export function AdvancedFileUpload({
  accept,
  maxSize = 10 * 1024 * 1024, // 10MB default
  maxFiles = 10,
  multiple = true,
  onUpload,
  onFileRemove,
  showPreview = true,
  className = '',
}: AdvancedFileUploadProps) {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return FileImage;
    if (type.startsWith('video/')) return FileVideo;
    if (type.startsWith('audio/')) return FileAudio;
    if (type.includes('pdf') || type.includes('document')) return FileText;
    return File;
  };

  const createFilePreview = (file: File): Promise<string | undefined> => {
    return new Promise((resolve) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = () => resolve(undefined);
        reader.readAsDataURL(file);
      } else {
        resolve(undefined);
      }
    });
  };

  const validateFile = (file: File): string | null => {
    if (maxSize && file.size > maxSize) {
      return `File size exceeds ${(maxSize / (1024 * 1024)).toFixed(2)}MB`;
    }
    if (accept) {
      const acceptedTypes = accept.split(',').map(t => t.trim());
      const fileType = file.type;
      const fileExtension = `.${file.name.split('.').pop()}`;
      
      const isAccepted = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return fileExtension === type;
        }
        if (type.endsWith('/*')) {
          return fileType.startsWith(type.replace('/*', ''));
        }
        return fileType === type;
      });
      
      if (!isAccepted) {
        return `File type not accepted. Allowed: ${accept}`;
      }
    }
    return null;
  };

  const handleFiles = useCallback(async (newFiles: FileList | null) => {
    if (!newFiles) return;

    const filesArray = Array.from(newFiles);
    
    if (files.length + filesArray.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }

    const uploadFiles: UploadFile[] = [];

    for (const file of filesArray) {
      const error = validateFile(file);
      const preview = showPreview ? await createFilePreview(file) : undefined;
      
      uploadFiles.push({
        id: Math.random().toString(36).substring(7),
        file,
        preview,
        progress: 0,
        status: error ? 'error' : 'pending',
        error,
      });
    }

    setFiles((prev) => [...prev, ...uploadFiles]);

    // Auto-upload valid files
    if (onUpload) {
      const validFiles = uploadFiles.filter(f => f.status === 'pending');
      if (validFiles.length > 0) {
        uploadFilesAsync(validFiles);
      }
    }
  }, [files, maxFiles, showPreview, onUpload]);

  const uploadFilesAsync = async (filesToUpload: UploadFile[]) => {
    for (const uploadFile of filesToUpload) {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadFile.id ? { ...f, status: 'uploading' } : f
        )
      );

      try {
        // Simulate upload progress
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise((resolve) => setTimeout(resolve, 200));
          setFiles((prev) =>
            prev.map((f) =>
              f.id === uploadFile.id ? { ...f, progress } : f
            )
          );
        }

        if (onUpload) {
          await onUpload([uploadFile.file]);
        }

        setFiles((prev) =>
          prev.map((f) =>
            f.id === uploadFile.id ? { ...f, status: 'success' } : f
          )
        );
      } catch (error) {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === uploadFile.id
              ? { ...f, status: 'error', error: 'Upload failed' }
              : f
          )
        );
      }
    }
  };

  const handleRemove = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    onFileRemove?.(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className={className}>
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
          transition-all
          ${isDragging
            ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/20'
            : 'border-border dark:border-border hover:border-indigo-600 hover:bg-muted/50 dark:hover:bg-muted/50'
          }
        `}
      >
        <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragging ? 'text-indigo-600' : 'text-muted-foreground'}`} />
        <p className="text-lg font-medium text-foreground mb-2">
          {isDragging ? 'Drop files here' : 'Click to upload or drag and drop'}
        </p>
        <p className="text-sm text-muted-foreground">
          {accept || 'Any file type'} • Max {(maxSize / (1024 * 1024)).toFixed(0)}MB • Up to {maxFiles} files
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-6 space-y-3">
          <AnimatePresence>
            {files.map((uploadFile) => {
              const Icon = getFileIcon(uploadFile.file.type);
              
              return (
                <motion.div
                  key={uploadFile.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="bg-card dark:bg-card border border-border dark:border-border rounded-xl p-4"
                >
                  <div className="flex items-start gap-4">
                    {/* Preview or Icon */}
                    <div className="flex-shrink-0">
                      {uploadFile.preview ? (
                        <img
                          src={uploadFile.preview}
                          alt={uploadFile.file.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-muted dark:bg-muted rounded-lg flex items-center justify-center">
                          <Icon className="w-8 h-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">
                            {uploadFile.file.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formatFileSize(uploadFile.file.size)}
                          </p>
                        </div>

                        {/* Status Icon */}
                        <div className="flex items-center gap-2 ml-2">
                          {uploadFile.status === 'success' && (
                            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                          )}
                          {uploadFile.status === 'error' && (
                            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                          )}
                          <button
                            onClick={() => handleRemove(uploadFile.id)}
                            className="p-1 hover:bg-muted dark:hover:bg-muted rounded transition-colors"
                          >
                            <X className="w-4 h-4 text-muted-foreground" />
                          </button>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      {uploadFile.status === 'uploading' && (
                        <div className="w-full h-2 bg-muted dark:bg-muted rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-indigo-600"
                            initial={{ width: 0 }}
                            animate={{ width: `${uploadFile.progress}%` }}
                            transition={{ duration: 0.2 }}
                          />
                        </div>
                      )}

                      {/* Error Message */}
                      {uploadFile.error && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                          {uploadFile.error}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Summary */}
      {files.length > 0 && (
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {files.filter(f => f.status === 'success').length} of {files.length} files uploaded
          </span>
          <span>
            {formatFileSize(files.reduce((sum, f) => sum + f.file.size, 0))} total
          </span>
        </div>
      )}
    </div>
  );
}
