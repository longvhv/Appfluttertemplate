import React from 'react';
import { Sun, Moon, Smartphone, Type, Layout, Zap } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { useLanguage } from '../contexts/LanguageContext';
import { useAppearance } from '../contexts/AppearanceContext';
import { 
  Card, 
  RadioGroup, 
  Switch, 
  Text,
  Divider 
} from '../components/ui';
import { useToast, ToastContainer } from '../src/components/Toast';
import { Tooltip } from '../src/components/Tooltip';
import { IconButton } from '../src/components/IconButton';

interface AppearanceProps {
  onBack: () => void;
}

export function Appearance({ onBack }: AppearanceProps) {
  const { t } = useLanguage();
  const { 
    settings, 
    setTheme, 
    setFontSize, 
    setDensity, 
    setAnimations, 
    setHighContrast 
  } = useAppearance();
  const { toasts, success } = useToast();

  const handleThemeChange = (value: string) => {
    setTheme(value as 'light' | 'dark' | 'auto');
    success(`Theme changed to ${value}`, 'Theme Updated');
  };

  const handleFontSizeChange = (value: string) => {
    setFontSize(value as 'small' | 'medium' | 'large' | 'extra-large');
    success(`Font size changed to ${value}`, 'Font Size Updated');
  };

  const handleDensityChange = (value: string) => {
    setDensity(value as 'compact' | 'comfortable' | 'spacious');
    success(`Density changed to ${value}`, 'Density Updated');
  };

  const handleAnimationsToggle = (enabled: boolean) => {
    setAnimations(enabled);
    success(enabled ? 'Animations enabled' : 'Animations disabled', 'Animations');
  };

  const handleHighContrastToggle = (enabled: boolean) => {
    setHighContrast(enabled);
    success(enabled ? 'High contrast enabled' : 'High contrast disabled', 'Contrast');
  };

  return (
    <div className="pb-20 bg-background">
      <PageHeader 
        title={t('appearance.title')} 
        subtitle={t('appearance.subtitle')} 
        onBack={onBack} 
      />

      <div className="max-w-lg mx-auto px-adaptive py-adaptive space-adaptive-y-lg">
        {/* Theme Section */}
        <Card variant="default" padding="lg">
          <Text variant="h4" className="mb-adaptive">
            {t('appearance.theme')}
          </Text>
          
          <RadioGroup
            value={settings.theme}
            onChange={handleThemeChange}
            name="theme"
            options={[
              {
                value: 'light',
                label: t('appearance.light'),
                description: 'Classic bright interface',
              },
              {
                value: 'dark',
                label: t('appearance.dark'),
                description: 'Easy on your eyes',
              },
              {
                value: 'auto',
                label: t('appearance.auto'),
                description: 'Follows system preference',
              },
            ]}
          />
        </Card>

        {/* Font Size Section */}
        <Card variant="default" padding="lg">
          <Text variant="h4" className="mb-adaptive">
            {t('appearance.fontSize')}
          </Text>
          
          <RadioGroup
            value={settings.fontSize}
            onChange={handleFontSizeChange}
            name="fontSize"
            options={[
              {
                value: 'small',
                label: t('appearance.small'),
                description: '14px - Compact',
              },
              {
                value: 'medium',
                label: t('appearance.medium'),
                description: '16px - Comfortable (Default)',
              },
              {
                value: 'large',
                label: t('appearance.large'),
                description: '18px - Large',
              },
              {
                value: 'extra-large',
                label: t('appearance.extraLarge'),
                description: '20px - Extra Large',
              },
            ]}
          />
        </Card>

        {/* Display Density Section */}
        <Card variant="default" padding="lg">
          <Text variant="h4" className="mb-adaptive">
            {t('appearance.displayDensity')}
          </Text>
          
          <RadioGroup
            value={settings.density}
            onChange={handleDensityChange}
            name="density"
            options={[
              {
                value: 'compact',
                label: t('appearance.compact'),
                description: t('appearance.compactDesc'),
              },
              {
                value: 'normal',
                label: t('appearance.normal'),
                description: t('appearance.normalDesc'),
              },
              {
                value: 'comfortable',
                label: t('appearance.comfortable'),
                description: t('appearance.comfortableDesc'),
              },
            ]}
          />
        </Card>

        {/* Additional Options */}
        <Card variant="default" padding="lg">
          <Text variant="h4" className="mb-adaptive">
            {t('appearance.advanced')}
          </Text>
          
          <div className="space-adaptive-y">
            <Switch
              checked={settings.animations}
              onChange={handleAnimationsToggle}
              label={t('appearance.animations')}
              description={t('appearance.animationsDesc')}
            />
            
            <Divider />
            
            <Switch
              checked={settings.highContrast}
              onChange={handleHighContrastToggle}
              label={t('appearance.highContrast')}
              description={t('appearance.highContrastDesc')}
            />
          </div>
        </Card>

        {/* Preview Card */}
        <Card variant="elevated" padding="lg">
          <Text variant="h4" className="mb-adaptive">
            Preview
          </Text>
          <Text variant="body" color="muted" className="mb-adaptive">
            This is how your text will appear with current settings.
          </Text>
          <Card variant="filled" padding="md">
            <Text variant="h3">Sample Heading</Text>
            <Text variant="body" className="mt-2">
              The quick brown fox jumps over the lazy dog. This sample text demonstrates how your chosen settings affect readability.
            </Text>
          </Card>
        </Card>
      </div>
      <ToastContainer toasts={toasts} />
    </div>
  );
}