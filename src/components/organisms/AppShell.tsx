import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sidebar, SidebarMenuItem } from './Sidebar';
import { AdminHeader } from './AdminHeader';

export interface AppShellProps {
  children: React.ReactNode;
  sidebarItems?: SidebarMenuItem[];
  sidebarHeader?: React.ReactNode;
  sidebarFooter?: React.ReactNode;
  showSidebar?: boolean;
  sidebarCollapsible?: boolean;
  notifications?: number;
  onSearch?: (query: string) => void;
  className?: string;
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  sidebarItems,
  sidebarHeader,
  sidebarFooter,
  showSidebar = true,
  sidebarCollapsible = true,
  notifications = 0,
  onSearch,
  className = '',
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className={`flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950 ${className}`}>
      {/* Desktop Sidebar */}
      {showSidebar && (
        <div className="hidden lg:block">
          <Sidebar
            items={sidebarItems}
            collapsed={sidebarCollapsed}
            onCollapse={setSidebarCollapsed}
            header={sidebarHeader}
            footer={sidebarFooter}
          />
        </div>
      )}

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {showSidebar && mobileSidebarOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 z-50 lg:hidden"
            >
              <Sidebar
                items={sidebarItems}
                collapsed={false}
                header={sidebarHeader}
                footer={sidebarFooter}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <AdminHeader
          showMenuButton={showSidebar}
          onMenuClick={() => setMobileSidebarOpen(true)}
          notifications={notifications}
          onSearch={onSearch}
        />

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950">
          {children}
        </main>
      </div>
    </div>
  );
};
