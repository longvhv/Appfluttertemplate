import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Users, MessageSquare, Activity } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Spinner, SpinnerContainer } from '../src/components/Spinner';
import { Skeleton, SkeletonCard } from '../src/components/Skeleton';
import { EmptyState } from '../src/components/EmptyState';
import { useToast, ToastContainer } from '../src/components/Toast';
import { Tooltip } from '../src/components/Tooltip';
import { IconButton } from '../src/components/IconButton';

export function Home() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toasts, success, error, info } = useToast();
  const [loading, setLoading] = useState(true);
  const [hasData, setHasData] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      // Uncomment to test empty state
      // setHasData(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    { id: 1, label: t('home.totalUsers'), value: '12,453', icon: Users, color: 'bg-blue-500' },
    { id: 2, label: t('home.activeNow'), value: '8,924', icon: Activity, color: 'bg-green-500' },
    { id: 3, label: t('home.newMessages'), value: '1,234', icon: MessageSquare, color: 'bg-purple-500' },
    { id: 4, label: t('home.growth'), value: '+23%', icon: TrendingUp, color: 'bg-orange-500' },
  ];

  const recentActivity = [
    { id: 1, action: 'New user registered', time: '5 minutes ago', icon: '👤' },
    { id: 2, action: 'Payment received', time: '15 minutes ago', icon: '💰' },
    { id: 3, action: 'New feature deployed', time: '1 hour ago', icon: '🚀' },
    { id: 4, action: 'Support ticket resolved', time: '2 hours ago', icon: '✅' },
  ];

  return (
    <div className="pb-20 bg-background">
      {/* Loading State */}
      {loading ? (
        <div className="max-w-lg mx-auto px-adaptive">
          {/* Header Skeleton */}
          <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 pb-8 rounded-2xl mt-4">
            <div className="pt-8 pb-4 px-4">
              <Skeleton variant="text" width="60%" height={32} className="mb-2" />
              <Skeleton variant="text" width="40%" height={20} className="mb-4" />
              <div className="flex items-center gap-3">
                <Skeleton variant="circular" width={48} height={48} />
                <div className="flex-1">
                  <Skeleton variant="text" width="50%" height={16} className="mb-1" />
                  <Skeleton variant="text" width="70%" height={14} />
                </div>
              </div>
            </div>
          </div>
          
          {/* Stats Skeleton */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>

          {/* Activity Skeleton */}
          <div className="mt-6 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-3 bg-card rounded-xl p-4">
                <Skeleton variant="circular" width={40} height={40} />
                <div className="flex-1">
                  <Skeleton variant="text" width="80%" className="mb-1" />
                  <Skeleton variant="text" width="40%" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : !hasData ? (
        /* Empty State */
        <div className="max-w-lg mx-auto px-adaptive pt-20">
          <EmptyState
            title="No Data Available"
            description="There's no activity data to display yet. Start using the app to see your statistics here."
            action={{
              label: "Get Started",
              onClick: () => success("Welcome! Let's get started.", "Success"),
            }}
          />
        </div>
      ) : (
        /* Main Content */
        <>
          {/* Welcome Card with Gradient */}
          <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 pb-8">
            <div className="max-w-lg mx-auto px-adaptive pt-8 pb-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-white"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-white text-3xl mb-2">{t('home.welcome')}</h1>
                    <p className="text-white/90">{t('home.subtitle')}</p>
                  </div>
                  <Tooltip content="View profile settings" placement="bottom">
                    <IconButton
                      icon={Users}
                      onClick={() => info("Profile settings")}
                      variant="ghost"
                      ariaLabel="Profile settings"
                      className="!text-white hover:bg-white/10"
                    />
                  </Tooltip>
                </div>
                <div className="mt-4 flex items-center gap-adaptive">
                  <img
                    src={user?.avatar}
                    alt={user?.name}
                    className="w-12 h-12 rounded-full border-2 border-white/30"
                  />
                  <div>
                    <p className="text-white">{user?.name}</p>
                    <p className="text-white/80 text-sm">{user?.email}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="max-w-lg mx-auto px-adaptive mt-6">
            <div className="grid grid-cols-2 gap-adaptive section-spacing">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Tooltip key={stat.id} content={`View ${stat.label} details`} placement="top">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => success(`Viewing ${stat.label}`, "Stat Clicked")}
                      className="bg-card dark:bg-card rounded-2xl card-padding shadow-lg border border-border dark:border-border cursor-pointer"
                    >
                      <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center mb-adaptive`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-2xl text-foreground mb-1">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </motion.div>
                  </Tooltip>
                );
              })}
            </div>
          </div>

          <div className="max-w-lg mx-auto px-adaptive">
            {/* Features Section */}
            <div className="section-spacing">
              <h2 className="text-foreground mb-adaptive">{t('home.features')}</h2>
              <div className="grid grid-cols-3 gap-adaptive">
                {['📊', '📈', '💡', '🎯', '⚡', '🔥'].map((emoji, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => info(`Feature ${emoji} clicked`)}
                    className="bg-gradient-to-br from-muted/50 to-muted dark:from-muted dark:to-accent rounded-2xl card-padding flex items-center justify-center cursor-pointer border border-border dark:border-border"
                  >
                    <span className="text-4xl">{emoji}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <div className="flex items-center justify-between mb-adaptive">
                <h2 className="text-foreground">{t('home.recentActivity')}</h2>
                <button 
                  onClick={() => success("Viewing all activities")}
                  className="text-indigo-600 dark:text-indigo-400 text-sm hover:text-indigo-700 dark:hover:text-indigo-300"
                >
                  {t('home.viewAll')}
                </button>
              </div>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => success(`Activity: ${activity.action}`, "Activity Details")}
                    className="bg-card dark:bg-card rounded-xl card-padding flex items-center gap-adaptive shadow-sm border border-border dark:border-border cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 rounded-full flex items-center justify-center">
                      <span className="text-xl">{activity.icon}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-foreground text-sm">{activity.action}</p>
                      <p className="text-muted-foreground text-xs mt-0.5">{activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Toast Container */}
      <ToastContainer toasts={toasts} position="top-right" />
    </div>
  );
}