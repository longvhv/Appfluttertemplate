import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { Upload, File as FileIcon, X, Image as ImageIcon } from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useAppearance } from '../../contexts/AppearanceContext';

export interface FileUploadProps {
  accept?: 'image' | 'document' | 'all';
  multiple?: boolean;
  maxSize?: number; // in MB
  maxFiles?: number;
  onUpload?: (files: any[]) => void;
  onChange?: (files: any[]) => void;
  variant?: 'default' | 'compact' | 'button';
  showPreview?: boolean;
}

// Memoized file preview component
const FilePreview = React.memo<{
  file: any;
  onRemove: () => void;
  theme: any;
}>(({ file, onRemove, theme }) => {
  const isImage = file.type?.startsWith('image/') || file.mimeType?.startsWith('image/');

  const styles = useMemo(() => StyleSheet.create({
    previewItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      backgroundColor: theme.colors.surface,
      borderRadius: 8,
      marginTop: 8,
      gap: 12,
    },
    thumbnail: {
      width: 48,
      height: 48,
      borderRadius: 6,
      backgroundColor: theme.colors.border,
    },
    fileInfo: {
      flex: 1,
    },
    fileName: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.text,
    },
    fileSize: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    removeButton: {
      padding: 4,
    },
  }), [theme]);

  const fileSize = useMemo(() => {
    const size = file.size || file.fileSize || 0;
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }, [file]);

  return (
    <View style={styles.previewItem}>
      {isImage ? (
        <Image source={{ uri: file.uri }} style={styles.thumbnail} />
      ) : (
        <View style={[styles.thumbnail, { alignItems: 'center', justifyContent: 'center' }]}>
          <FileIcon size={24} color={theme.colors.text} />
        </View>
      )}
      <View style={styles.fileInfo}>
        <Text style={styles.fileName} numberOfLines={1}>
          {file.name || 'Unknown file'}
        </Text>
        <Text style={styles.fileSize}>{fileSize}</Text>
      </View>
      <TouchableOpacity onPress={onRemove} style={styles.removeButton}>
        <X size={20} color={theme.colors.textSecondary} />
      </TouchableOpacity>
    </View>
  );
});

FilePreview.displayName = 'FilePreview';

export const FileUpload: React.FC<FileUploadProps> = ({
  accept = 'all',
  multiple = false,
  maxSize = 10,
  maxFiles = 5,
  onUpload,
  onChange,
  variant = 'default',
  showPreview = true,
}) => {
  const { theme } = useAppearance();
  const [files, setFiles] = useState<any[]>([]);

  const validateFile = useCallback((file: any): string | null => {
    if (maxSize && file.size && file.size > maxSize * 1024 * 1024) {
      return `File exceeds ${maxSize}MB`;
    }
    return null;
  }, [maxSize]);

  const handlePickDocument = useCallback(async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: accept === 'image' ? 'image/*' : accept === 'document' ? 'application/*' : '*/*',
        multiple,
      });

      if (result.canceled) return;

      const newFiles = result.assets || [];
      
      for (const file of newFiles) {
        const error = validateFile(file);
        if (error) {
          Alert.alert('Error', error);
          return;
        }
      }

      if (maxFiles && files.length + newFiles.length > maxFiles) {
        Alert.alert('Error', `Maximum ${maxFiles} files allowed`);
        return;
      }

      const updatedFiles = multiple ? [...files, ...newFiles] : newFiles;
      setFiles(updatedFiles);

      if (onChange) {
        onChange(updatedFiles);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick file');
    }
  }, [accept, multiple, maxSize, maxFiles, files, validateFile, onChange]);

  const handlePickImage = useCallback(async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: multiple,
        quality: 1,
      });

      if (result.canceled) return;

      const newFiles = result.assets || [];

      if (maxFiles && files.length + newFiles.length > maxFiles) {
        Alert.alert('Error', `Maximum ${maxFiles} files allowed`);
        return;
      }

      const updatedFiles = multiple ? [...files, ...newFiles] : newFiles;
      setFiles(updatedFiles);

      if (onChange) {
        onChange(updatedFiles);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  }, [multiple, maxFiles, files, onChange]);

  const handlePick = useCallback(() => {
    if (accept === 'image') {
      handlePickImage();
    } else {
      handlePickDocument();
    }
  }, [accept, handlePickImage, handlePickDocument]);

  const handleRemove = useCallback((index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    if (onChange) {
      onChange(updatedFiles);
    }
  }, [files, onChange]);

  const handleUpload = useCallback(() => {
    if (onUpload && files.length > 0) {
      onUpload(files);
      setFiles([]);
    }
  }, [onUpload, files]);

  const formatSize = useCallback((bytes: number) => {
    if (!bytes) return 'Unknown size';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }, []);

  const styles = StyleSheet.create({
    container: {
      width: '100%',
    },
    dropzone: {
      borderWidth: 2,
      borderStyle: 'dashed',
      borderColor: theme.colors.border,
      borderRadius: 12,
      padding: 48,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.card,
    },
    dropzoneCompact: {
      padding: 16,
      flexDirection: 'row',
      gap: 12,
    },
    icon: {
      marginBottom: 16,
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 8,
      textAlign: 'center',
    },
    description: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 16,
      textAlign: 'center',
    },
    info: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    button: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 8,
    },
    buttonOutline: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '600',
      textAlign: 'center',
    },
    buttonOutlineText: {
      color: theme.colors.text,
    },
    filesContainer: {
      marginTop: 16,
      gap: 8,
    },
    filesHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    filesTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.text,
    },
    fileItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      backgroundColor: theme.colors.background,
      borderRadius: 8,
      gap: 12,
    },
    filePreview: {
      width: 48,
      height: 48,
      borderRadius: 8,
      backgroundColor: theme.colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    fileImage: {
      width: 48,
      height: 48,
      borderRadius: 8,
    },
    fileInfo: {
      flex: 1,
    },
    fileName: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.text,
    },
    fileSize: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    removeButton: {
      padding: 4,
    },
    uploadButton: {
      marginTop: 8,
    },
  });

  if (variant === 'button') {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={handlePick} style={styles.button} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Upload Files</Text>
        </TouchableOpacity>

        {files.length > 0 && showPreview && (
          <View style={styles.filesContainer}>
            {files.map((file, index) => (
              <FilePreview
                key={index}
                file={file}
                onRemove={() => handleRemove(index)}
                theme={theme}
              />
            ))}
          </View>
        )}
      </View>
    );
  }

  if (variant === 'compact') {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={handlePick}
          style={[styles.dropzone, styles.dropzoneCompact]}
          activeOpacity={0.7}
        >
          <Upload size={20} color={theme.colors.textSecondary} />
          <Text style={{ flex: 1, fontSize: 14, color: theme.colors.textSecondary }}>
            Drop files or tap to upload
          </Text>
        </TouchableOpacity>

        {files.length > 0 && showPreview && (
          <View style={styles.filesContainer}>
            {files.map((file, index) => (
              <FilePreview
                key={index}
                file={file}
                onRemove={() => handleRemove(index)}
                theme={theme}
                compact
              />
            ))}
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePick} style={styles.dropzone} activeOpacity={0.7}>
        <Upload size={48} color={theme.colors.textSecondary} style={styles.icon} />
        <Text style={styles.title}>Upload files</Text>
        <Text style={styles.description}>Tap to browse</Text>
        <Text style={styles.info}>
          Max {maxSize}MB{multiple && ` • Up to ${maxFiles} files`}
        </Text>
      </TouchableOpacity>

      {files.length > 0 && showPreview && (
        <View style={styles.filesContainer}>
          <View style={styles.filesHeader}>
            <Text style={styles.filesTitle}>
              {files.length} file{files.length > 1 ? 's' : ''} selected
            </Text>
            {onUpload && (
              <TouchableOpacity onPress={handleUpload} style={styles.button} activeOpacity={0.8}>
                <Text style={styles.buttonText}>Upload All</Text>
              </TouchableOpacity>
            )}
          </View>

          {files.map((file, index) => (
            <FilePreview
              key={index}
              file={file}
              onRemove={() => handleRemove(index)}
              theme={theme}
            />
          ))}
        </View>
      )}
    </View>
  );
};