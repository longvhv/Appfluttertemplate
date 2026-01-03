import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useAppearance } from '../../contexts/AppearanceContext';
import { Modal } from './Modal';

export interface DropdownMenuItem {
  label: string;
  icon?: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  variant?: 'default' | 'danger';
  divide?: boolean;
}

export interface DropdownMenuProps {
  trigger: React.ReactElement;
  items: DropdownMenuItem[];
}

export function DropdownMenu({ trigger, items }: DropdownMenuProps) {
  const { theme, isDarkMode } = useAppearance();
  const [isOpen, setIsOpen] = useState(false);

  const handleItemPress = (item: DropdownMenuItem) => {
    if (!item.disabled && item.onPress) {
      item.onPress();
      setIsOpen(false);
    }
  };

  const clonedTrigger = React.cloneElement(trigger, {
    onPress: () => setIsOpen(true),
  });

  return (
    <>
      {clonedTrigger}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Options"
        size="sm"
      >
        <ScrollView style={styles.menu}>
          {items.map((item, index) => {
            const isDanger = item.variant === 'danger';

            return (
              <View key={index}>
                {item.divide && index > 0 && (
                  <View
                    style={[
                      styles.divider,
                      {
                        borderColor: isDarkMode
                          ? theme.colors.border
                          : theme.colors.gray[200],
                      },
                    ]}
                  />
                )}
                <TouchableOpacity
                  onPress={() => handleItemPress(item)}
                  disabled={item.disabled}
                  style={[
                    styles.item,
                    {
                      opacity: item.disabled ? 0.5 : 1,
                    },
                  ]}
                  activeOpacity={0.7}
                >
                  {item.icon && <View style={styles.icon}>{item.icon}</View>}
                  <Text
                    style={[
                      styles.label,
                      {
                        color: isDanger
                          ? theme.colors.error
                          : isDarkMode
                          ? theme.colors.text.primary
                          : theme.colors.gray[700],
                      },
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  menu: {
    maxHeight: 400,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
  },
  icon: {
    width: 20,
    height: 20,
  },
  label: {
    fontSize: 14,
    flex: 1,
  },
  divider: {
    borderTopWidth: 1,
    marginVertical: 4,
  },
});
