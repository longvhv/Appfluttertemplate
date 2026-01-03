import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  Modal as RNModal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Pressable,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { X } from 'lucide-react-native';
import { useAppearance } from '../../contexts/AppearanceContext';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  footer?: React.ReactNode;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  footer,
}: ModalProps) {
  const { theme, isDarkMode } = useAppearance();
  const [dimensions, setDimensions] = useState(() => {
    const { width, height } = Dimensions.get('window');
    return { width, height };
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions({ width: window.width, height: window.height });
    });

    return () => subscription?.remove();
  }, []);

  const sizeStyles = useMemo(() => ({
    sm: { width: Math.min(dimensions.width * 0.8, 320) },
    md: { width: Math.min(dimensions.width * 0.85, 400) },
    lg: { width: Math.min(dimensions.width * 0.9, 500) },
    xl: { width: Math.min(dimensions.width * 0.95, 600) },
    full: { width: dimensions.width - 32, height: dimensions.height - 100 },
  }), [dimensions]);

  const handleOverlayPress = useCallback(() => {
    if (closeOnOverlayClick) {
      onClose();
    }
  }, [closeOnOverlayClick, onClose]);

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
    },
    overlayBackground: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
    },
    modalView: {
      borderRadius: 16,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 10,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 24,
      paddingVertical: 16,
      borderBottomWidth: 1,
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      flex: 1,
    },
    closeButton: {
      padding: 8,
      borderRadius: 8,
      marginLeft: 16,
    },
    content: {
      flex: 1,
    },
    contentContainer: {
      padding: 24,
    },
    footer: {
      paddingHorizontal: 24,
      paddingVertical: 16,
      borderTopWidth: 1,
      borderBottomLeftRadius: 16,
      borderBottomRightRadius: 16,
    },
    confirmFooter: {
      flexDirection: 'row',
      gap: 12,
      justifyContent: 'flex-end',
    },
    button: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 8,
      minWidth: 80,
      alignItems: 'center',
    },
    cancelButton: {
      borderWidth: 1,
    },
    confirmButton: {},
    buttonText: {
      fontSize: 14,
      fontWeight: '600',
    },
    message: {
      fontSize: 14,
      lineHeight: 20,
    },
  }), [isDarkMode, theme]);

  return (
    <RNModal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        {/* Overlay */}
        <Pressable
          style={styles.overlay}
          onPress={handleOverlayPress}
        >
          <View style={styles.overlayBackground} />
        </Pressable>

        {/* Modal Content */}
        <Pressable style={styles.centeredView}>
          <View
            style={[
              styles.modalView,
              sizeStyles[size],
              {
                backgroundColor: isDarkMode
                  ? theme.colors.background
                  : theme.colors.surface,
                maxHeight: dimensions.height * 0.9,
              },
            ]}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <View
                style={[
                  styles.header,
                  {
                    borderBottomColor: isDarkMode
                      ? theme.colors.border
                      : theme.colors.gray[200],
                  },
                ]}
              >
                {title && (
                  <Text
                    style={[
                      styles.title,
                      {
                        color: isDarkMode
                          ? theme.colors.text.primary
                          : theme.colors.gray[900],
                      },
                    ]}
                  >
                    {title}
                  </Text>
                )}
                {showCloseButton && (
                  <TouchableOpacity
                    onPress={onClose}
                    style={[
                      styles.closeButton,
                      {
                        backgroundColor: isDarkMode
                          ? theme.colors.gray[700]
                          : theme.colors.gray[100],
                      },
                    ]}
                    accessibilityLabel="Close modal"
                    accessibilityRole="button"
                  >
                    <X
                      size={20}
                      color={
                        isDarkMode
                          ? theme.colors.text.secondary
                          : theme.colors.gray[500]
                      }
                    />
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* Content */}
            <ScrollView
              style={styles.content}
              contentContainerStyle={styles.contentContainer}
              showsVerticalScrollIndicator={false}
            >
              {children}
            </ScrollView>

            {/* Footer */}
            {footer && (
              <View
                style={[
                  styles.footer,
                  {
                    borderTopColor: isDarkMode
                      ? theme.colors.border
                      : theme.colors.gray[200],
                    backgroundColor: isDarkMode
                      ? theme.colors.gray[900]
                      : theme.colors.gray[50],
                  },
                ]}
              >
                {footer}
              </View>
            )}
          </View>
        </Pressable>
      </KeyboardAvoidingView>
    </RNModal>
  );
}

// Preset modal variant for confirmations
export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'primary',
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'primary' | 'danger';
}) {
  const { theme, isDarkMode } = useAppearance();

  const variantColors = {
    primary: theme.colors.primary,
    danger: theme.colors.error,
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <View style={styles.confirmFooter}>
          <TouchableOpacity
            onPress={onClose}
            style={[
              styles.button,
              styles.cancelButton,
              {
                borderColor: isDarkMode
                  ? theme.colors.border
                  : theme.colors.gray[300],
                backgroundColor: 'transparent',
              },
            ]}
          >
            <Text
              style={[
                styles.buttonText,
                {
                  color: isDarkMode
                    ? theme.colors.text.primary
                    : theme.colors.gray[700],
                },
              ]}
            >
              {cancelText}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              onConfirm();
              onClose();
            }}
            style={[
              styles.button,
              styles.confirmButton,
              { backgroundColor: variantColors[variant] },
            ]}
          >
            <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>
              {confirmText}
            </Text>
          </TouchableOpacity>
        </View>
      }
    >
      <Text
        style={[
          styles.message,
          {
            color: isDarkMode
              ? theme.colors.text.secondary
              : theme.colors.gray[600],
          },
        ]}
      >
        {message}
      </Text>
    </Modal>
  );
}