import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import { Sidebar, SidebarMenuItem } from './Sidebar';
import { AdminHeader } from './AdminHeader';
import { useAppearance } from '../../contexts/AppearanceContext';

export interface AppShellProps {
  children: React.ReactNode;
  sidebarItems?: SidebarMenuItem[];
  sidebarHeader?: React.ReactNode;
  sidebarFooter?: React.ReactNode;
  showSidebar?: boolean;
  notifications?: number;
  onSearch?: (query: string) => void;
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  sidebarItems,
  sidebarHeader,
  sidebarFooter,
  showSidebar = true,
  notifications = 0,
  onSearch,
}) => {
  const { theme } = useAppearance();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [slideAnim] = useState(new Animated.Value(-300));

  const openSidebar = () => {
    setSidebarOpen(true);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 65,
      friction: 11,
    }).start();
  };

  const closeSidebar = () => {
    Animated.timing(slideAnim, {
      toValue: -300,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setSidebarOpen(false));
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
    },
    // Modal Styles
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    sidebarContainer: {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: 280,
      backgroundColor: theme.colors.background,
      shadowColor: '#000',
      shadowOffset: { width: 2, height: 0 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 5,
    },
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <AdminHeader
        showMenuButton={showSidebar}
        onMenuPress={openSidebar}
        notifications={notifications}
        onSearch={onSearch}
      />

      {/* Content */}
      <View style={styles.content}>{children}</View>

      {/* Sidebar Modal */}
      {showSidebar && (
        <Modal
          visible={sidebarOpen}
          transparent
          animationType="none"
          onRequestClose={closeSidebar}
        >
          <TouchableWithoutFeedback onPress={closeSidebar}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <Animated.View
                  style={[
                    styles.sidebarContainer,
                    {
                      transform: [{ translateX: slideAnim }],
                    },
                  ]}
                >
                  <Sidebar
                    items={sidebarItems}
                    header={sidebarHeader}
                    footer={sidebarFooter}
                    onItemPress={closeSidebar}
                  />
                </Animated.View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </View>
  );
};
