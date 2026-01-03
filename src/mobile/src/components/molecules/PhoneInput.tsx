import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  Modal as RNModal,
  FlatList,
  TextInput,
} from 'react-native';
import { Phone, ChevronDown, Search } from 'lucide-react-native';
import { useAppearance } from '../../contexts/AppearanceContext';
import { spacing, borderRadius, typography } from '../../theme/tokens';
import Input from '../atoms/Input';

/**
 * PhoneInput Component - React Native
 * 
 * Phone number input with country code picker
 */

export interface Country {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
}

export interface PhoneInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onChangeCountry?: (country: Country) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  style?: ViewStyle;
}

// Popular countries list
const COUNTRIES: Country[] = [
  { code: 'VN', name: 'Vietnam', dialCode: '+84', flag: '🇻🇳' },
  { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧' },
  { code: 'CN', name: 'China', dialCode: '+86', flag: '🇨🇳' },
  { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳' },
  { code: 'JP', name: 'Japan', dialCode: '+81', flag: '🇯🇵' },
  { code: 'KR', name: 'South Korea', dialCode: '+82', flag: '🇰🇷' },
  { code: 'SG', name: 'Singapore', dialCode: '+65', flag: '🇸🇬' },
  { code: 'TH', name: 'Thailand', dialCode: '+66', flag: '🇹🇭' },
  { code: 'MY', name: 'Malaysia', dialCode: '+60', flag: '🇲🇾' },
  { code: 'ID', name: 'Indonesia', dialCode: '+62', flag: '🇮🇩' },
  { code: 'PH', name: 'Philippines', dialCode: '+63', flag: '🇵🇭' },
  { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺' },
  { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦' },
  { code: 'DE', name: 'Germany', dialCode: '+49', flag: '🇩🇪' },
  { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷' },
  { code: 'IT', name: 'Italy', dialCode: '+39', flag: '🇮🇹' },
  { code: 'ES', name: 'Spain', dialCode: '+34', flag: '🇪🇸' },
  { code: 'BR', name: 'Brazil', dialCode: '+55', flag: '🇧🇷' },
  { code: 'MX', name: 'Mexico', dialCode: '+52', flag: '🇲🇽' },
];

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChangeText,
  onChangeCountry,
  label = 'Phone Number',
  placeholder = 'Enter phone number',
  required = false,
  error,
  disabled = false,
  style,
}) => {
  const { theme } = useAppearance();
  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]);
  const [showPicker, setShowPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCountries = COUNTRIES.filter(
    (country) =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.dialCode.includes(searchQuery)
  );

  const handleSelectCountry = (country: Country) => {
    setSelectedCountry(country);
    onChangeCountry?.(country);
    setShowPicker(false);
    setSearchQuery('');
  };

  const formatPhoneNumber = (text: string): string => {
    // Remove non-digits
    const digits = text.replace(/\D/g, '');
    return digits;
  };

  const handleTextChange = (text: string) => {
    const formatted = formatPhoneNumber(text);
    onChangeText(formatted);
  };

  const styles = StyleSheet.create({
    container: {
      marginBottom: spacing.md,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    countryButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.md,
      marginRight: spacing.sm,
      minWidth: 100,
    },
    countryButtonDisabled: {
      opacity: 0.5,
    },
    flag: {
      fontSize: 20,
      marginRight: spacing.xs,
    },
    dialCode: {
      ...typography.body1,
      color: theme.colors.text,
      marginRight: spacing.xs,
      flex: 1,
    },
    inputWrapper: {
      flex: 1,
    },
    // Modal styles
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: theme.colors.card,
      borderTopLeftRadius: borderRadius.xl,
      borderTopRightRadius: borderRadius.xl,
      maxHeight: '80%',
    },
    modalHeader: {
      padding: spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.divider,
    },
    modalTitle: {
      ...typography.h3,
      color: theme.colors.text,
      marginBottom: spacing.md,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing.md,
    },
    searchIcon: {
      marginRight: spacing.sm,
    },
    searchInput: {
      flex: 1,
      ...typography.body1,
      color: theme.colors.text,
      paddingVertical: spacing.sm,
    },
    countryList: {
      paddingHorizontal: spacing.lg,
    },
    countryItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.divider,
    },
    countryItemFlag: {
      fontSize: 24,
      marginRight: spacing.md,
    },
    countryItemContent: {
      flex: 1,
    },
    countryItemName: {
      ...typography.body1,
      color: theme.colors.text,
      marginBottom: spacing.xs,
    },
    countryItemCode: {
      ...typography.caption,
      color: theme.colors.textSecondary,
    },
    countryItemDialCode: {
      ...typography.body1,
      color: theme.colors.primary,
      fontWeight: '600',
    },
  });

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={{ ...typography.caption, color: theme.colors.text, marginBottom: spacing.xs }}>
          {label}
          {required && <Text style={{ color: theme.colors.error }}> *</Text>}
        </Text>
      )}

      <View style={styles.inputContainer}>
        {/* Country Picker Button */}
        <TouchableOpacity
          style={[styles.countryButton, disabled && styles.countryButtonDisabled]}
          onPress={() => !disabled && setShowPicker(true)}
          disabled={disabled}
        >
          <Text style={styles.flag}>{selectedCountry.flag}</Text>
          <Text style={styles.dialCode}>{selectedCountry.dialCode}</Text>
          <ChevronDown size={16} color={theme.colors.textTertiary} />
        </TouchableOpacity>

        {/* Phone Number Input */}
        <View style={styles.inputWrapper}>
          <Input
            value={value}
            onChangeText={handleTextChange}
            placeholder={placeholder}
            keyboardType="phone-pad"
            error={error}
            disabled={disabled}
            leftIcon={<Phone size={20} color={theme.colors.textSecondary} />}
          />
        </View>
      </View>

      {/* Country Picker Modal */}
      <RNModal
        visible={showPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPicker(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowPicker(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={styles.modalContent}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Header with Search */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Country</Text>
              <View style={styles.searchContainer}>
                <Search
                  size={20}
                  color={theme.colors.textSecondary}
                  style={styles.searchIcon}
                />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search countries..."
                  placeholderTextColor={theme.colors.textTertiary}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
            </View>

            {/* Country List */}
            <FlatList
              data={filteredCountries}
              keyExtractor={(item) => item.code}
              style={styles.countryList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.countryItem}
                  onPress={() => handleSelectCountry(item)}
                >
                  <Text style={styles.countryItemFlag}>{item.flag}</Text>
                  <View style={styles.countryItemContent}>
                    <Text style={styles.countryItemName}>{item.name}</Text>
                    <Text style={styles.countryItemCode}>{item.code}</Text>
                  </View>
                  <Text style={styles.countryItemDialCode}>{item.dialCode}</Text>
                </TouchableOpacity>
              )}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </RNModal>
    </View>
  );
};

export default PhoneInput;
