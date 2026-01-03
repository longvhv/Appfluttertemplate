import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useAppearance } from '../../contexts/AppearanceContext';
import { Modal } from './Modal';

export interface PopoverProps {
  trigger: React.ReactElement;
  content: React.ReactNode;
  title?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Popover({
  trigger,
  content,
  title,
  open: controlledOpen,
  onOpenChange,
}: PopoverProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;

  const setOpen = (value: boolean) => {
    if (onOpenChange) {
      onOpenChange(value);
    } else {
      setInternalOpen(value);
    }
  };

  const toggleOpen = () => {
    setOpen(!isOpen);
  };

  const clonedTrigger = React.cloneElement(trigger, {
    onPress: () => {
      toggleOpen();
      trigger.props.onPress?.();
    },
  });

  return (
    <>
      {clonedTrigger}
      <Modal
        isOpen={isOpen}
        onClose={() => setOpen(false)}
        title={title}
        size="sm"
      >
        {content}
      </Modal>
    </>
  );
}

// Popover Menu (common use case)
export interface PopoverMenuProps {
  trigger: React.ReactElement;
  items: Array<{
    label: string;
    icon?: React.ReactNode;
    onPress: () => void;
    danger?: boolean;
    disabled?: boolean;
  }>;
  title?: string;
}

export function PopoverMenu({ trigger, items, title }: PopoverMenuProps) {
  const { theme, isDarkMode } = useAppearance();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover
      trigger={trigger}
      title={title}
      open={isOpen}
      onOpenChange={setIsOpen}
      content={
        <View style={styles.menuContainer}>
          {items.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                if (!item.disabled) {
                  item.onPress();
                  setIsOpen(false);
                }
              }}
              disabled={item.disabled}
              style={[
                styles.menuItem,
                {
                  opacity: item.disabled ? 0.5 : 1,
                },
              ]}
              activeOpacity={0.7}
            >
              {item.icon && <View style={styles.menuIcon}>{item.icon}</View>}
              <Text
                style={[
                  styles.menuLabel,
                  {
                    color: item.danger
                      ? theme.colors.error
                      : isDarkMode
                      ? theme.colors.text.secondary
                      : theme.colors.gray[700],
                  },
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  menuContainer: {
    minWidth: 160,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  menuIcon: {
    width: 20,
    height: 20,
  },
  menuLabel: {
    fontSize: 14,
    flex: 1,
  },
});
