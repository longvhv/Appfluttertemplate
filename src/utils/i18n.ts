/**
 * Internationalization (i18n) Utilities
 * 
 * Provides translation and localization helpers
 */

import { useState, useEffect, useCallback, useMemo, createContext, useContext } from 'react';

/**
 * Locale type
 */
export type Locale = string;

/**
 * Translation dictionary
 */
export type Translations = Record<string, any>;

/**
 * Translation function
 */
export type TranslateFunction = (key: string, params?: Record<string, any>) => string;

/**
 * I18n context
 */
export interface I18nContext {
  locale: Locale;
  translations: Translations;
  setLocale: (locale: Locale) => void;
  t: TranslateFunction;
}

/**
 * I18n configuration
 */
export interface I18nConfig {
  defaultLocale: Locale;
  locales: Locale[];
  translations: Record<Locale, Translations>;
  fallbackLocale?: Locale;
}

/**
 * Create I18n context
 */
export const I18nContext = createContext<I18nContext | null>(null);

/**
 * Get nested value from object
 */
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

/**
 * Interpolate translation with params
 */
function interpolate(template: string, params?: Record<string, any>): string {
  if (!params) return template;
  
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return params[key] !== undefined ? String(params[key]) : match;
  });
}

/**
 * Create translation function
 */
export function createTranslate(
  translations: Translations,
  fallbackTranslations?: Translations
): TranslateFunction {
  return (key: string, params?: Record<string, any>) => {
    let value = getNestedValue(translations, key);
    
    // Try fallback if value not found
    if (value === undefined && fallbackTranslations) {
      value = getNestedValue(fallbackTranslations, key);
    }
    
    // Return key if no translation found
    if (value === undefined) {
      return key;
    }
    
    // Interpolate if string
    if (typeof value === 'string') {
      return interpolate(value, params);
    }
    
    return String(value);
  };
}

/**
 * I18n provider props
 */
export interface I18nProviderProps {
  config: I18nConfig;
  children: React.ReactNode;
}

/**
 * I18n provider component
 */
export function I18nProvider({ config, children }: I18nProviderProps) {
  const [locale, setLocale] = useState<Locale>(config.defaultLocale);

  const translations = useMemo(() => {
    return config.translations[locale] || {};
  }, [config.translations, locale]);

  const fallbackTranslations = useMemo(() => {
    const fallback = config.fallbackLocale || config.defaultLocale;
    return config.translations[fallback] || {};
  }, [config.translations, config.fallbackLocale, config.defaultLocale]);

  const t = useMemo(() => {
    return createTranslate(translations, fallbackTranslations);
  }, [translations, fallbackTranslations]);

  const value = useMemo<I18nContext>(() => ({
    locale,
    translations,
    setLocale,
    t,
  }), [locale, translations, t]);

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

/**
 * Use i18n hook
 */
export function useI18n(): I18nContext {
  const context = useContext(I18nContext);
  
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  
  return context;
}

/**
 * Use translation hook
 */
export function useTranslation(): TranslateFunction {
  const { t } = useI18n();
  return t;
}

/**
 * Use locale hook
 */
export function useLocale(): [Locale, (locale: Locale) => void] {
  const { locale, setLocale } = useI18n();
  return [locale, setLocale];
}

/**
 * Detect browser locale
 */
export function detectBrowserLocale(availableLocales: Locale[]): Locale | null {
  if (typeof navigator === 'undefined') return null;
  
  const browserLocales = [
    navigator.language,
    ...(navigator.languages || []),
  ];
  
  // Try exact match first
  for (const browserLocale of browserLocales) {
    if (availableLocales.includes(browserLocale)) {
      return browserLocale;
    }
  }
  
  // Try language prefix match (e.g., 'en' for 'en-US')
  for (const browserLocale of browserLocales) {
    const language = browserLocale.split('-')[0];
    const match = availableLocales.find(locale => locale.startsWith(language));
    if (match) return match;
  }
  
  return null;
}

/**
 * Format number
 */
export function formatNumber(
  value: number,
  locale: Locale,
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat(locale, options).format(value);
}

/**
 * Format currency
 */
export function formatCurrency(
  value: number,
  locale: Locale,
  currency: string,
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    ...options,
  }).format(value);
}

/**
 * Format date
 */
export function formatDate(
  value: Date | number,
  locale: Locale,
  options?: Intl.DateTimeFormatOptions
): string {
  return new Intl.DateTimeFormat(locale, options).format(value);
}

/**
 * Format relative time
 */
export function formatRelativeTime(
  value: number,
  unit: Intl.RelativeTimeFormatUnit,
  locale: Locale,
  options?: Intl.RelativeTimeFormatOptions
): string {
  return new Intl.RelativeTimeFormat(locale, options).format(value, unit);
}

/**
 * Use number formatter hook
 */
export function useNumberFormatter(options?: Intl.NumberFormatOptions) {
  const { locale } = useI18n();
  
  return useCallback((value: number) => {
    return formatNumber(value, locale, options);
  }, [locale, options]);
}

/**
 * Use currency formatter hook
 */
export function useCurrencyFormatter(currency: string, options?: Intl.NumberFormatOptions) {
  const { locale } = useI18n();
  
  return useCallback((value: number) => {
    return formatCurrency(value, locale, currency, options);
  }, [locale, currency, options]);
}

/**
 * Use date formatter hook
 */
export function useDateFormatter(options?: Intl.DateTimeFormatOptions) {
  const { locale } = useI18n();
  
  return useCallback((value: Date | number) => {
    return formatDate(value, locale, options);
  }, [locale, options]);
}

/**
 * Use relative time formatter hook
 */
export function useRelativeTimeFormatter(options?: Intl.RelativeTimeFormatOptions) {
  const { locale } = useI18n();
  
  return useCallback((value: number, unit: Intl.RelativeTimeFormatUnit) => {
    return formatRelativeTime(value, unit, locale, options);
  }, [locale, options]);
}

/**
 * Pluralization rules
 */
export type PluralRule = 'zero' | 'one' | 'two' | 'few' | 'many' | 'other';

/**
 * Get plural rule
 */
export function getPluralRule(count: number, locale: Locale): PluralRule {
  const rules = new Intl.PluralRules(locale);
  return rules.select(count) as PluralRule;
}

/**
 * Pluralize
 */
export function pluralize(
  count: number,
  translations: Partial<Record<PluralRule, string>>,
  locale: Locale
): string {
  const rule = getPluralRule(count, locale);
  return translations[rule] || translations.other || '';
}

/**
 * Use pluralize hook
 */
export function usePluralize() {
  const { locale } = useI18n();
  
  return useCallback((count: number, translations: Partial<Record<PluralRule, string>>) => {
    return pluralize(count, translations, locale);
  }, [locale]);
}

/**
 * RTL (Right-to-Left) locales
 */
const RTL_LOCALES = ['ar', 'he', 'fa', 'ur'];

/**
 * Check if locale is RTL
 */
export function isRTL(locale: Locale): boolean {
  const language = locale.split('-')[0];
  return RTL_LOCALES.includes(language);
}

/**
 * Use RTL hook
 */
export function useRTL(): boolean {
  const { locale } = useI18n();
  return useMemo(() => isRTL(locale), [locale]);
}

/**
 * Use direction hook
 */
export function useDirection(): 'ltr' | 'rtl' {
  const isRTLLocale = useRTL();
  return isRTLLocale ? 'rtl' : 'ltr';
}

/**
 * Load translations dynamically
 */
export async function loadTranslations(locale: Locale): Promise<Translations> {
  try {
    const module = await import(`../locales/${locale}.json`);
    return module.default || module;
  } catch (error) {
    console.error(`Failed to load translations for locale: ${locale}`, error);
    return {};
  }
}

/**
 * Use dynamic translations hook
 */
export function useDynamicTranslations(locale: Locale) {
  const [translations, setTranslations] = useState<Translations>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    loadTranslations(locale)
      .then(setTranslations)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [locale]);

  return { translations, loading, error };
}

/**
 * Locale storage key
 */
const LOCALE_STORAGE_KEY = 'app-locale';

/**
 * Save locale to storage
 */
export function saveLocale(locale: Locale): void {
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch (error) {
    console.error('Failed to save locale to storage:', error);
  }
}

/**
 * Load locale from storage
 */
export function loadLocale(): Locale | null {
  try {
    return localStorage.getItem(LOCALE_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to load locale from storage:', error);
    return null;
  }
}

/**
 * Use persisted locale hook
 */
export function usePersistedLocale(defaultLocale: Locale): [Locale, (locale: Locale) => void] {
  const [locale, setLocaleState] = useState<Locale>(() => {
    return loadLocale() || defaultLocale;
  });

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    saveLocale(newLocale);
  }, []);

  return [locale, setLocale];
}

/**
 * Translation key extractor (for static analysis)
 */
export function extractTranslationKeys(
  translations: Translations,
  prefix: string = ''
): string[] {
  const keys: string[] = [];
  
  Object.entries(translations).forEach(([key, value]) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof value === 'object' && value !== null) {
      keys.push(...extractTranslationKeys(value, fullKey));
    } else {
      keys.push(fullKey);
    }
  });
  
  return keys;
}

/**
 * Validate translations (check for missing keys)
 */
export function validateTranslations(
  source: Translations,
  target: Translations
): string[] {
  const sourceKeys = extractTranslationKeys(source);
  const targetKeys = new Set(extractTranslationKeys(target));
  
  return sourceKeys.filter(key => !targetKeys.has(key));
}

/**
 * Merge translations
 */
export function mergeTranslations(...translations: Translations[]): Translations {
  return translations.reduce((merged, current) => {
    return { ...merged, ...current };
  }, {});
}
