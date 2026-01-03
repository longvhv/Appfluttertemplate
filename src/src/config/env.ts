/**
 * Environment configuration with type safety
 */

export const env = {
  // App info
  appName: import.meta.env.VITE_APP_NAME || 'Enterprise App',
  appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
  environment: import.meta.env.VITE_APP_ENVIRONMENT || import.meta.env.MODE || 'development',
  
  // API
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  apiTimeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000', 10),
  
  // Feature flags
  features: {
    analytics: import.meta.env.VITE_FEATURE_ANALYTICS === 'true',
    darkMode: import.meta.env.VITE_FEATURE_DARK_MODE !== 'false', // Default true
    pwa: import.meta.env.VITE_FEATURE_PWA === 'true',
  },
  
  // Analytics
  analyticsId: import.meta.env.VITE_ANALYTICS_ID || '',
  sentryDsn: import.meta.env.VITE_SENTRY_DSN || '',
  
  // Build
  enableSourceMaps: import.meta.env.VITE_ENABLE_SOURCE_MAPS === 'true',
  enableBundleAnalysis: import.meta.env.VITE_ENABLE_BUNDLE_ANALYSIS === 'true',
  
  // Computed
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
} as const;

// Validate required environment variables
export function validateEnv(): void {
  const required = ['VITE_APP_NAME'];
  const missing = required.filter(key => !import.meta.env[key]);
  
  if (missing.length > 0) {
    console.warn(`⚠️ Missing environment variables: ${missing.join(', ')}`);
  }
}

// Log environment info in development
if (env.isDevelopment) {
  console.log('🚀 Environment:', {
    mode: env.environment,
    version: env.appVersion,
    features: env.features,
  });
}
