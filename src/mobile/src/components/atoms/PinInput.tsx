import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, StyleSheet, ViewStyle } from 'react-native';
import { useAppearance } from '../../contexts/AppearanceContext';
import { borderRadius, spacing } from '../../theme/tokens';

/**
 * PinInput Component - React Native
 * 
 * PIN/OTP input with auto-focus and paste support
 */

export interface PinInputProps {
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  type?: 'text' | 'number' | 'password';
  mask?: boolean;
  size?: 'sm' | 'md' | 'lg';
  error?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  placeholder?: string;
  style?: ViewStyle;
}

export const PinInput: React.FC<PinInputProps> = ({
  length = 6,
  value = '',
  onChange,
  onComplete,
  type = 'number',
  mask = false,
  size = 'md',
  error = false,
  disabled = false,
  autoFocus = false,
  placeholder = '○',
  style,
}) => {
  const { theme } = useAppearance();
  const [pins, setPins] = useState<string[]>(
    Array.from({ length }, (_, i) => value[i] || '')
  );
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (value !== pins.join('')) {
      setPins(Array.from({ length }, (_, i) => value[i] || ''));
    }
  }, [value, length]);

  const handleChangeText = (index: number, text: string) => {
    if (disabled) return;

    // Handle paste (multiple characters)
    if (text.length > 1) {
      handlePaste(index, text);
      return;
    }

    // Validate input
    if (type === 'number' && text && !/^\d$/.test(text)) return;

    const newPins = [...pins];
    newPins[index] = text;
    setPins(newPins);

    const newValue = newPins.join('');
    onChange?.(newValue);

    // Auto-focus next input
    if (text && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Call onComplete when all pins are filled
    if (newValue.length === length && onComplete) {
      onComplete(newValue);
    }
  };

  const handleKeyPress = (index: number, key: string) => {
    if (key === 'Backspace') {
      if (!pins[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
        const newPins = [...pins];
        newPins[index - 1] = '';
        setPins(newPins);
        onChange?.(newPins.join(''));
      }
    }
  };

  const handlePaste = (startIndex: number, pastedData: string) => {
    const pastedPins = pastedData.slice(0, length - startIndex).split('');
    
    // Validate pasted data
    if (type === 'number' && pastedPins.some(pin => !/^\d$/.test(pin))) {
      return;
    }

    const newPins = [...pins];
    pastedPins.forEach((pin, i) => {
      const index = startIndex + i;
      if (index < length) {
        newPins[index] = pin;
      }
    });

    setPins(newPins);
    const newValue = newPins.join('');
    onChange?.(newValue);

    // Focus last filled input
    const lastIndex = Math.min(startIndex + pastedPins.length, length - 1);
    inputRefs.current[lastIndex]?.focus();

    if (newValue.length === length && onComplete) {
      onComplete(newValue);
    }
  };

  const getSizes = () => {
    switch (size) {
      case 'sm':
        return { width: 40, height: 40, fontSize: 18 };
      case 'lg':
        return { width: 56, height: 56, fontSize: 24 };
      default:
        return { width: 48, height: 48, fontSize: 20 };
    }
  };

  const sizes = getSizes();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
    input: {
      width: sizes.width,
      height: sizes.height,
      borderWidth: 2,
      borderRadius: borderRadius.xl,
      textAlign: 'center',
      fontSize: sizes.fontSize,
      fontWeight: '600',
      color: theme.colors.text,
      backgroundColor: theme.colors.background,
    },
  });

  return (
    <View style={[styles.container, style]}>
      {pins.map((pin, index) => (
        <TextInput
          key={index}
          ref={(ref) => (inputRefs.current[index] = ref)}
          value={pin}
          onChangeText={(text) => handleChangeText(index, text)}
          onKeyPress={({ nativeEvent }) => handleKeyPress(index, nativeEvent.key)}
          keyboardType={type === 'number' ? 'number-pad' : 'default'}
          maxLength={1}
          secureTextEntry={mask}
          editable={!disabled}
          autoFocus={autoFocus && index === 0}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.placeholder}
          selectTextOnFocus
          style={[
            styles.input,
            {
              borderColor: error
                ? theme.colors.error
                : pin
                ? theme.colors.primary
                : theme.colors.border,
              opacity: disabled ? 0.5 : 1,
            },
          ]}
        />
      ))}
    </View>
  );
};

// OTP Input alias
export const OTPInputAlternative: React.FC<Omit<PinInputProps, 'type' | 'length'>> = (props) => {
  return <PinInput type="number" length={6} {...props} />;
};

// Verification Code Input
export const VerificationCodeInput: React.FC<Omit<PinInputProps, 'type' | 'length'>> = (props) => {
  return <PinInput type="number" length={4} {...props} />;
};

export default PinInput;
