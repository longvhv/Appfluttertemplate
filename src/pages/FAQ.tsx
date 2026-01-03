import React, { useState } from 'react';
import { HelpCircle, Search } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Accordion, 
  SearchBar, 
  Card, 
  Text,
  Tabs,
  TabPanel 
} from '../components/ui';
import { useToast, ToastContainer } from '../src/components/Toast';
import { Badge } from '../src/components/Badge';
import { EmptyState } from '../src/components/EmptyState';

interface FAQProps {
  onBack: () => void;
}

export function FAQ({ onBack }: FAQProps) {
  const { t } = useLanguage();
  const { toasts, success, info } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('general');

  const categories = [
    { id: 'general', label: 'General' },
    { id: 'account', label: 'Account' },
    { id: 'billing', label: 'Billing' },
    { id: 'technical', label: 'Technical' },
  ];

  const faqData = {
    general: [
      {
        id: 'what-is',
        title: 'What is this application?',
        content: 'This is an enterprise-grade application built with React, featuring a modern design system, dark mode support, and full internationalization.',
        icon: HelpCircle,
      },
      {
        id: 'how-start',
        title: 'How do I get started?',
        content: 'Simply create an account, verify your email, and you\'ll be ready to go. Check out our quick start guide in the Help Center.',
        icon: HelpCircle,
      },
      {
        id: 'features',
        title: 'What features are available?',
        content: 'We offer a comprehensive set of features including user management, notifications, privacy controls, appearance customization, and multi-language support.',
        icon: HelpCircle,
      },
    ],
    account: [
      {
        id: 'reset-password',
        title: 'How do I reset my password?',
        content: 'Click on "Forgot Password" on the login page, enter your email, and follow the instructions sent to your inbox.',
        icon: HelpCircle,
      },
      {
        id: 'change-email',
        title: 'Can I change my email address?',
        content: 'Yes, go to Settings > Profile and update your email address. You\'ll need to verify the new email.',
        icon: HelpCircle,
      },
      {
        id: 'delete-account',
        title: 'How do I delete my account?',
        content: 'Navigate to Settings > Privacy & Security > Delete Account. Please note that this action is permanent and cannot be undone.',
        icon: HelpCircle,
      },
    ],
    billing: [
      {
        id: 'pricing',
        title: 'What are your pricing plans?',
        content: 'We offer flexible pricing plans to suit your needs. Visit our pricing page for detailed information.',
        icon: HelpCircle,
      },
      {
        id: 'payment-methods',
        title: 'What payment methods do you accept?',
        content: 'We accept all major credit cards, PayPal, and bank transfers for enterprise customers.',
        icon: HelpCircle,
      },
      {
        id: 'refund',
        title: 'What is your refund policy?',
        content: 'We offer a 30-day money-back guarantee. If you\'re not satisfied, contact support for a full refund.',
        icon: HelpCircle,
      },
    ],
    technical: [
      {
        id: 'browser-support',
        title: 'Which browsers are supported?',
        content: 'We support the latest versions of Chrome, Firefox, Safari, and Edge. For the best experience, keep your browser up to date.',
        icon: HelpCircle,
      },
      {
        id: 'mobile-app',
        title: 'Is there a mobile app?',
        content: 'Yes! Our mobile apps are available for both iOS and Android. Download them from the App Store or Google Play.',
        icon: HelpCircle,
      },
      {
        id: 'api',
        title: 'Do you provide an API?',
        content: 'Yes, we offer a comprehensive REST API for integration. Check our API documentation for details.',
        icon: HelpCircle,
      },
    ],
  };

  const filteredFAQs = faqData[activeCategory as keyof typeof faqData].filter(
    (faq) =>
      faq.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pb-20 bg-background">
      <PageHeader 
        title={t('faq.title')} 
        subtitle={t('faq.subtitle')} 
        onBack={onBack} 
      />

      <div className="max-w-3xl mx-auto px-adaptive py-adaptive">
        {/* Search Bar */}
        <Card variant="default" padding="md" className="mb-adaptive-lg">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search FAQ..."
          />
        </Card>

        {/* Category Tabs */}
        <Tabs
          tabs={categories}
          activeTab={activeCategory}
          onChange={setActiveCategory}
          variant="pills"
          fullWidth
          className="mb-adaptive-lg"
        />

        {/* FAQ Accordion */}
        {categories.map((category) => (
          <TabPanel key={category.id} activeTab={activeCategory} tabId={category.id}>
            {filteredFAQs.length > 0 ? (
              <Accordion items={filteredFAQs} allowMultiple />
            ) : (
              <Card variant="filled" padding="xl">
                <div className="text-center py-adaptive-lg">
                  <Text variant="body" color="muted">
                    No FAQs found matching "{searchQuery}"
                  </Text>
                </div>
              </Card>
            )}
          </TabPanel>
        ))}

        {/* Still Need Help? */}
        <Card variant="elevated" padding="lg" className="mt-adaptive-lg">
          <Text variant="h4" className="mb-adaptive-sm">
            Still need help?
          </Text>
          <Text variant="body" color="muted" className="mb-adaptive">
            Can't find the answer you're looking for? Our support team is here to help!
          </Text>
          <button className="text-indigo-600 dark:text-indigo-400 hover:underline">
            Contact Support →
          </button>
        </Card>
      </div>
    </div>
  );
}