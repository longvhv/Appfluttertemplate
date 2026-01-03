import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, BookOpen, Settings as SettingsIcon, AlertTriangle, Shield,
  ChevronRight, ChevronLeft, Mail, Phone, Video, MessageCircle, X, ChevronDown, Send
} from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast as useToastUI } from '../components/ui';
import { useToast, ToastContainer } from '../src/components/Toast';
import { Modal } from '../src/components/Modal';
import { Spinner } from '../src/components/Spinner';
import { EmptyState } from '../src/components/EmptyState';
import { Tooltip } from '../src/components/Tooltip';
import { IconButton } from '../src/components/IconButton';
import { TextArea } from '../src/components/TextArea';
import { Pagination } from '../src/components/Pagination';

interface HelpCenterProps {
  onBack: () => void;
}

export function HelpCenter({ onBack }: HelpCenterProps) {
  const { t } = useLanguage();
  const toast = useToastUI();
  const { toasts, success, info, warning } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);
  const [articlePage, setArticlePage] = useState(0);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ author: string; message: string; time: string }>>([
    { author: 'Support Bot', message: 'Hello! How can I help you today?', time: 'Just now' }
  ]);
  const [chatInput, setChatInput] = useState('');

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setLoading(false);
    setShowContactForm(false);
    success('Message sent! We\'ll get back to you soon.', 'Message Sent');
    toast.success('Message sent successfully!');
  };

  const handleChatSend = () => {
    if (!chatInput.trim()) return;
    
    setChatMessages(prev => [...prev, {
      author: 'You',
      message: chatInput,
      time: 'Just now'
    }]);
    
    setChatInput('');
    
    // Simulate bot response
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        author: 'Support Bot',
        message: 'Thank you for your message. A support agent will respond shortly.',
        time: 'Just now'
      }]);
    }, 1000);
  };

  const categories = [
    { icon: BookOpen, title: 'Getting Started', articles: 12, color: 'from-blue-500 to-cyan-500' },
    { icon: SettingsIcon, title: 'Account & Settings', articles: 8, color: 'from-purple-500 to-pink-500' },
    { icon: AlertTriangle, title: 'Troubleshooting', articles: 15, color: 'from-orange-500 to-red-500' },
    { icon: Shield, title: 'Privacy & Security', articles: 6, color: 'from-green-500 to-emerald-500' },
  ];

  const popularArticles = [
    'How to create your first project',
    'Managing team members and permissions',
    'Understanding billing and payments',
    'Customizing your workspace',
    'Integrating with other tools',
    'Setting up notifications',
    'Exporting your data',
    'API documentation',
    'Mobile app guide',
    'Keyboard shortcuts',
  ];

  const articlesPerPage = 5;
  const displayedArticles = popularArticles.slice(
    articlePage * articlesPerPage,
    (articlePage + 1) * articlesPerPage
  );
  const hasMoreArticles = (articlePage + 1) * articlesPerPage < popularArticles.length;

  const categoryArticles: { [key: string]: string[] } = {
    'Getting Started': [
      'Quick start guide',
      'Creating your first project',
      'Understanding the dashboard',
      'Basic navigation',
      'Setting up your profile',
      'Inviting team members',
    ],
    'Account & Settings': [
      'Managing your profile',
      'Changing your password',
      'Email preferences',
      'Privacy settings',
      'Notification settings',
      'Language preferences',
    ],
    'Troubleshooting': [
      'Cannot login to account',
      'Upload errors',
      'Performance issues',
      'Connection problems',
      'Browser compatibility',
      'Mobile app issues',
    ],
    'Privacy & Security': [
      'Data encryption',
      'Two-factor authentication',
      'Privacy policy',
      'GDPR compliance',
      'Account security',
      'Data deletion',
    ],
  };

  const faqs = [
    {
      question: 'How do I reset my password?',
      answer: 'Click "Forgot Password" on the login page, enter your email, and follow the instructions sent to your inbox.',
    },
    {
      question: 'Can I export my data?',
      answer: 'Yes! Go to Settings > Privacy & Security > Download Data to export all your information.',
    },
    {
      question: 'How do I delete my account?',
      answer: 'Navigate to Settings > Privacy & Security > Delete Account. This action is permanent and cannot be undone.',
    },
  ];

  const contactMethods = [
    { icon: Mail, title: t('help.email'), subtitle: 'Response in 24h', status: 'online' },
    { icon: Phone, title: t('help.phone'), subtitle: 'Mon-Fri 9AM-5PM', status: 'online' },
    { icon: Video, title: t('help.videoChat'), subtitle: 'Schedule a call', status: 'offline' },
    { icon: MessageCircle, title: t('help.liveChat'), subtitle: 'Available now', status: 'online' },
  ];

  return (
    <>
      <PageHeader title={t('help.title')} onBack={onBack} />

      <div className="max-w-lg mx-auto px-adaptive py-adaptive pb-20">
        {/* Search Bar */}
        <div className="mb-adaptive-lg">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/70" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('help.search')}
              className="w-full pl-12 pr-4 py-adaptive-sm bg-card dark:bg-card border border-border dark:border-border rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all text-foreground"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="mb-adaptive-lg">
          <h3 className="text-foreground mb-adaptive-sm">{t('help.categories')}</h3>
          <div className="grid grid-cols-2 gap-adaptive-sm">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSelectedCategory(category.title);
                    info(`Viewing ${category.title}`, 'Category');
                  }}
                  className="bg-card dark:bg-card rounded-2xl card-padding text-left shadow-sm border border-border dark:border-border hover:shadow-md transition-all"
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center mb-adaptive-sm`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-foreground text-sm mb-1">{category.title}</p>
                  <p className="text-xs text-muted-foreground">{category.articles} {t('help.articles')}</p>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Popular Articles */}
        <div className="mb-adaptive-lg">
          <h3 className="text-foreground mb-adaptive-sm">{t('help.popularArticles')}</h3>
          <div className="bg-card dark:bg-card rounded-2xl shadow-sm border border-border dark:border-border overflow-hidden">
            {displayedArticles.map((article, index) => (
              <motion.button
                key={index}
                onClick={() => {
                  setSelectedArticle(article);
                  success('Article opened', 'Success');
                  toast.success('Article opened');
                }}
                whileTap={{ scale: 0.98 }}
                className={`w-full card-padding flex items-center justify-between hover:bg-muted/50 dark:hover:bg-muted/50 transition-colors ${
                  index !== displayedArticles.length - 1 ? 'border-b border-border/50 dark:border-border/50' : ''
                }`}
              >
                <span className="text-foreground text-sm text-left">{article}</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground/70 flex-shrink-0 ml-2" />
              </motion.button>
            ))}
          </div>
        </div>

        {/* Contact Methods */}
        <div className="mb-adaptive-lg">
          <h3 className="text-foreground mb-adaptive-sm">{t('help.contactSupport')}</h3>
          <div className="grid grid-cols-2 gap-adaptive-sm">
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              const isDisabled = method.status === 'offline';
              return (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileTap={!isDisabled ? { scale: 0.95 } : {}}
                  onClick={() => {
                    if (!isDisabled) {
                      if (method.title === t('help.email')) {
                        setShowContactForm(true);
                      } else if (method.title === t('help.phone')) {
                        setShowPhoneModal(true);
                      } else if (method.title === t('help.liveChat')) {
                        setShowChatModal(true);
                      }
                    }
                  }}
                  disabled={isDisabled}
                  className={`bg-card dark:bg-card rounded-xl card-padding text-left shadow-sm border border-border dark:border-border transition-all ${
                    isDisabled ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 rounded-xl flex items-center justify-center ${
                      isDisabled ? 'opacity-50' : ''
                    }`}>
                      <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        method.status === 'online' ? 'bg-green-500' : 'bg-muted-foreground/50'
                      }`}
                    />
                  </div>
                  <p className="text-foreground text-sm mb-1">{method.title}</p>
                  <p className="text-xs text-muted-foreground">{method.subtitle}</p>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      <ToastContainer toasts={toasts} />
    </>
  );
}