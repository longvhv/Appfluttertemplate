import React from 'react';
import { motion } from 'motion/react';
import { Home, Bell, Settings } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface BottomNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function BottomNav({ currentPage, onNavigate }: BottomNavProps) {
  const { t } = useLanguage();

  const navItems = [
    { id: 'home', icon: Home, label: t('nav.home') },
    { id: 'notifications', icon: Bell, label: t('nav.notifications') },
    { id: 'settings', icon: Settings, label: t('nav.settings') },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background dark:bg-background border-t border-border dark:border-border z-50">
      <div className="max-w-lg mx-auto px-adaptive">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <motion.button
                key={item.id}
                whileTap={{ scale: 0.9 }}
                onClick={() => item.id !== currentPage && onNavigate(item.id)}
                className="flex flex-col items-center gap-adaptive-sm flex-1 py-adaptive-sm relative"
              >
                <motion.div
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    y: isActive ? -2 : 0,
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  <Icon
                    className={`w-6 h-6 ${
                      isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-muted-foreground'
                    }`}
                  />
                </motion.div>
                <span
                  className={`text-xs ${
                    isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-muted-foreground'
                  }`}
                >
                  {item.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-12 h-1 bg-indigo-600 dark:bg-indigo-400 rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}