import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Info,
  X,
} from 'lucide-react-native';
import { useAppearance } from '../../contexts/AppearanceContext';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
}

const { width } = Dimensions.get('window');

export function Toast({
  id,
  type,
  title,
  message,
  duration = 5000,
  onClose,
}: ToastProps) {
  const { theme, isDarkMode } = useAppearance();
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Slide in
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto dismiss
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose(id);
    });
  };

  const icons = {
    success: CheckCircle2,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
  };

  const typeColors = {
    success: {
      bg: isDarkMode ? 'rgba(34, 197, 94, 0.15)' : '#F0FDF4',
      border: isDarkMode ? theme.colors.success : '#86EFAC',
      icon: isDarkMode ? theme.colors.success : '#16A34A',
      text: isDarkMode ? '#DCFCE7' : '#166534',
    },
    error: {
      bg: isDarkMode ? 'rgba(239, 68, 68, 0.15)' : '#FEF2F2',
      border: isDarkMode ? theme.colors.error : '#FCA5A5',
      icon: isDarkMode ? theme.colors.error : '#DC2626',
      text: isDarkMode ? '#FEE2E2' : '#991B1B',
    },
    warning: {
      bg: isDarkMode ? 'rgba(234, 179, 8, 0.15)' : '#FEFCE8',
      border: isDarkMode ? theme.colors.warning : '#FDE047',
      icon: isDarkMode ? theme.colors.warning : '#CA8A04',
      text: isDarkMode ? '#FEF9C3' : '#854D0E',
    },
    info: {
      bg: isDarkMode ? 'rgba(59, 130, 246, 0.15)' : '#EFF6FF',
      border: isDarkMode ? theme.colors.info : '#93C5FD',
      icon: isDarkMode ? theme.colors.info : '#2563EB',
      text: isDarkMode ? '#DBEAFE' : '#1E40AF',
    },
  };

  const Icon = icons[type];
  const colors = typeColors[type];

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: colors.bg,
          borderColor: colors.border,
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <Icon size={20} color={colors.icon} style={styles.icon} />
      <View style={styles.content}>
        {title && (
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        )}
        <Text style={[styles.message, { color: colors.text }]}>{message}</Text>
      </View>
      <TouchableOpacity
        onPress={handleClose}
        style={styles.closeButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        accessibilityLabel="Close notification"
        accessibilityRole="button"
      >
        <X size={16} color={colors.icon} />
      </TouchableOpacity>
    </Animated.View>
  );
}

// Toast Container
export interface ToastContainerProps {
  toasts: ToastProps[];
}

export function ToastContainer({ toasts }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <View style={styles.toastContainer} pointerEvents="box-none">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </View>
  );
}

// Toast Hook
let toastId = 0;

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const showToast = (
    type: ToastType,
    message: string,
    title?: string,
    duration?: number
  ) => {
    const id = `toast-${++toastId}`;
    const toast: ToastProps = {
      id,
      type,
      title,
      message,
      duration,
      onClose: removeToast,
    };

    setToasts((prev) => [...prev, toast]);
    return id;
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return {
    toasts,
    success: (message: string, title?: string, duration?: number) =>
      showToast('success', message, title, duration),
    error: (message: string, title?: string, duration?: number) =>
      showToast('error', message, title, duration),
    warning: (message: string, title?: string, duration?: number) =>
      showToast('warning', message, title, duration),
    info: (message: string, title?: string, duration?: number) =>
      showToast('info', message, title, duration),
    remove: removeToast,
  };
}

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    zIndex: 9999,
    gap: 8,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    minWidth: width - 32,
    maxWidth: width - 32,
  },
  icon: {
    marginTop: 2,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  message: {
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.9,
  },
  closeButton: {
    padding: 4,
    marginLeft: 8,
  },
});
