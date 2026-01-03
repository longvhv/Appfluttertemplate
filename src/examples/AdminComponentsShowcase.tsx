import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Home,
  BarChart3,
  Users,
  Settings,
  FileText,
  Bell,
  HelpCircle,
  LogOut,
  Plus,
  Download,
  Share2,
} from 'lucide-react';
import { AppShell } from '../components/organisms/AppShell';
import { Sidebar, SidebarMenuItem } from '../components/organisms/Sidebar';
import { AdminHeader } from '../components/organisms/AdminHeader';
import { Menu, MenuItemData } from '../components/molecules/Menu';
import { Navbar, NavbarItem } from '../components/molecules/Navbar';
import { Button } from '../components/atoms/Button';
import { Badge } from '../components/atoms/Badge';
import { Card } from '../components/molecules/Card';
import { useToast } from '../src/components/Toast';

export function AdminComponentsShowcase() {
  const [activeDemo, setActiveDemo] = useState<
    'appshell' | 'sidebar' | 'header' | 'menu' | 'navbar'
  >('appshell');
  const { success, info } = useToast();

  // Sidebar Items
  const sidebarItems: SidebarMenuItem[] = [
    {
      id: 'home',
      label: 'Dashboard',
      icon: Home,
      active: activeDemo === 'appshell',
      onClick: () => info('Navigating to Dashboard'),
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      badge: 'New',
      children: [
        {
          id: 'overview',
          label: 'Overview',
          icon: BarChart3,
          onClick: () => info('Viewing Analytics Overview'),
        },
        {
          id: 'reports',
          label: 'Reports',
          icon: FileText,
          onClick: () => info('Viewing Reports'),
        },
      ],
    },
    {
      id: 'users',
      label: 'Users',
      icon: Users,
      badge: 12,
      onClick: () => info('Viewing Users'),
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      badge: 5,
      onClick: () => info('Viewing Notifications'),
    },
    {
      id: 'help',
      label: 'Help Center',
      icon: HelpCircle,
      onClick: () => info('Opening Help Center'),
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      onClick: () => info('Opening Settings'),
    },
  ];

  // Menu Items
  const menuItems: MenuItemData[] = [
    {
      id: 'new',
      label: 'New File',
      icon: <Plus className="w-4 h-4" />,
      shortcut: '⌘N',
      onClick: () => success('Creating new file'),
    },
    {
      id: 'divider1',
      label: '',
      divider: true,
    },
    {
      id: 'export',
      label: 'Export',
      icon: <Download className="w-4 h-4" />,
      children: [
        {
          id: 'pdf',
          label: 'Export as PDF',
          onClick: () => success('Exporting as PDF'),
        },
        {
          id: 'csv',
          label: 'Export as CSV',
          onClick: () => success('Exporting as CSV'),
        },
      ],
    },
    {
      id: 'share',
      label: 'Share',
      icon: <Share2 className="w-4 h-4" />,
      shortcut: '⌘S',
      onClick: () => success('Opening share dialog'),
    },
    {
      id: 'divider2',
      label: '',
      divider: true,
    },
    {
      id: 'delete',
      label: 'Delete',
      danger: true,
      shortcut: '⌘⌫',
      onClick: () => success('Item deleted'),
    },
  ];

  // Navbar Items
  const navbarItems: NavbarItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      active: true,
      onClick: () => info('Dashboard'),
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      badge: 'New',
      onClick: () => info('Analytics'),
    },
    {
      id: 'users',
      label: 'Users',
      icon: Users,
      badge: 12,
      onClick: () => info('Users'),
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      onClick: () => info('Settings'),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Demo Selector */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Admin Components Showcase
          </h1>
          <div className="flex gap-2 flex-wrap">
            {[
              { id: 'appshell', label: 'App Shell' },
              { id: 'sidebar', label: 'Sidebar' },
              { id: 'header', label: 'Admin Header' },
              { id: 'menu', label: 'Menu' },
              { id: 'navbar', label: 'Navbar' },
            ].map((demo) => (
              <Button
                key={demo.id}
                variant={activeDemo === demo.id ? 'primary' : 'outline'}
                onClick={() => setActiveDemo(demo.id as any)}
              >
                {demo.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Demo Content */}
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {activeDemo === 'appshell' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-[600px] border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl overflow-hidden"
            >
              <AppShell
                sidebarItems={sidebarItems}
                notifications={5}
                onSearch={(query) => info(`Searching for: ${query}`)}
                sidebarHeader={
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600" />
                    <div>
                      <h2 className="font-bold text-gray-900 dark:text-white">
                        My App
                      </h2>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        v1.0.0
                      </p>
                    </div>
                  </div>
                }
                sidebarFooter={
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                }
              >
                <div className="p-8">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Welcome to AppShell
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-8">
                    This is a complete application layout with sidebar, header, and content area.
                    Try resizing the window to see the responsive behavior!
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <Card key={i}>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                          Feature {i}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Description of feature {i}
                        </p>
                      </Card>
                    ))}
                  </div>
                </div>
              </AppShell>
            </motion.div>
          )}

          {activeDemo === 'sidebar' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Default Sidebar
                </h3>
                <div className="h-[600px] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
                  <Sidebar
                    items={sidebarItems}
                    header={
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600" />
                        <div>
                          <h2 className="font-bold text-gray-900 dark:text-white">
                            My App
                          </h2>
                        </div>
                      </div>
                    }
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Collapsed Sidebar
                </h3>
                <div className="h-[600px] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
                  <Sidebar items={sidebarItems} collapsed />
                </div>
              </div>
            </motion.div>
          )}

          {activeDemo === 'header' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Admin Header
                  </h3>
                  <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
                    <AdminHeader
                      notifications={5}
                      onSearch={(query) => info(`Searching: ${query}`)}
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    With Menu Button
                  </h3>
                  <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
                    <AdminHeader
                      showMenuButton
                      notifications={12}
                      onMenuClick={() => info('Menu clicked')}
                      onSearch={(query) => info(`Searching: ${query}`)}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeDemo === 'menu' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Default Menu
                  </h3>
                  <Menu
                    items={menuItems}
                    trigger={
                      <Button variant="outline">Open Menu</Button>
                    }
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Bottom End
                  </h3>
                  <Menu
                    items={menuItems}
                    placement="bottom-end"
                    trigger={
                      <Button variant="outline">Open Menu</Button>
                    }
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    With Nested Items
                  </h3>
                  <Menu
                    items={menuItems}
                    trigger={
                      <Button variant="primary">Actions</Button>
                    }
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Icon Menu
                  </h3>
                  <Menu
                    items={menuItems}
                    trigger={
                      <Button variant="ghost" size="sm">
                        •••
                      </Button>
                    }
                  />
                </div>
              </div>
            </motion.div>
          )}

          {activeDemo === 'navbar' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Default Navbar
                  </h3>
                  <Navbar
                    items={navbarItems}
                    logo={
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600" />
                        <span className="font-bold text-gray-900 dark:text-white">
                          My App
                        </span>
                      </div>
                    }
                    actions={
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          Login
                        </Button>
                        <Button variant="primary" size="sm">
                          Sign Up
                        </Button>
                      </div>
                    }
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Sticky Navbar
                  </h3>
                  <div className="h-[400px] overflow-y-auto border border-gray-200 dark:border-gray-800 rounded-xl">
                    <Navbar
                      items={navbarItems}
                      variant="sticky"
                      logo={<span className="font-bold">Logo</span>}
                    />
                    <div className="p-8 space-y-4">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <Card key={i}>
                          <p className="text-gray-600 dark:text-gray-400">
                            Content {i + 1} - Scroll to see sticky navbar
                          </p>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Floating Navbar
                  </h3>
                  <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-xl">
                    <Navbar
                      items={navbarItems}
                      variant="floating"
                      logo={<span className="font-bold">Logo</span>}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
