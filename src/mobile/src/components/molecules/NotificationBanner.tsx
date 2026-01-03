import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { X, Info, AlertCircle, CheckCircle2, AlertTriangle } from 'lucide-react-native';
import { useAppearance } from '../../contexts/AppearanceContext';

export interface NotificationBannerProps {
  type?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message: string;
  onClose?: () => void;
  action?: {
    label: string;
    onPress: () => void;
  };
  closable?: boolean;
  icon?: React.ReactNode;
}

const icons = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: AlertCircle,
};

export function NotificationBanner({
  type = 'info',
  title,
  message,
  onClose,
  action,
  closable = true,
  icon,
}: NotificationBannerProps) {
  const { theme, isDarkMode } = useAppearance();
  const Icon = icon ? () => <>{icon}</> : icons[type];

  const typeStyles = {
    info: {
      bg: isDarkMode ? 'rgba(59, 130, 246, 0.15)' : '#EFF6FF',
      border: isDarkMode ? theme.colors.info : '#93C5FD',
      icon: isDarkMode ? theme.colors.info : '#2563EB',
      text: isDarkMode ? '#DBEAFE' : '#1E40AF',
    },
    success: {
      bg: isDarkMode ? 'rgba(34, 197, 94, 0.15)' : '#F0FDF4',
      border: isDarkMode ? theme.colors.success : '#86EFAC',
      icon: isDarkMode ? theme.colors.success : '#16A34A',
      text: isDarkMode ? '#DCFCE7' : '#166534',
    },
    warning: {
      bg: isDarkMode ? 'rgba(234, 179, 8, 0.15)' : '#FEFCE8',
      border: isDarkMode ? theme.colors.warning : '#FDE047',
      icon: isDarkMode ? theme.colors.warning : '#CA8A04',
      text: isDarkMode ? '#FEF9C3' : '#854D0E',
    },
    error: {
      bg: isDarkMode ? 'rgba(239, 68, 68, 0.15)' : '#FEF2F2',
      border: isDarkMode ? theme.colors.error : '#FCA5A5',
      icon: isDarkMode ? theme.colors.error : '#DC2626',
      text: isDarkMode ? '#FEE2E2' : '#991B1B',
    },
  };

  const style = typeStyles[type];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: style.bg,
          borderColor: style.border,
        },
      ]}
    >
      <Icon size={20} color={style.icon} style={styles.icon} />

      <View style={styles.content}>
        {title && (
          <Text style={[styles.title, { color: style.text }]}>{title}</Text>
        )}
        <Text style={[styles.message, { color: style.text }]}>{message}</Text>

        {action && (
          <TouchableOpacity onPress={action.onPress} style={styles.action}>
            <Text style={[styles.actionText, { color: style.icon }]}>
              {action.label}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {closable && onClose && (
        <TouchableOpacity
          onPress={onClose}
          style={styles.closeButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <X size={16} color={style.icon} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
  },
  icon: {
    marginTop: 2,
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
  action: {
    marginTop: 8,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  closeButton: {
    padding: 4,
  },
});
