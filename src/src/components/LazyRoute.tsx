import React, { Suspense, lazy, ComponentType } from 'react';
import { Spinner } from './Spinner';
import { ErrorBoundary } from './ErrorBoundary';

/**
 * LazyRoute Component
 * 
 * A wrapper component that combines lazy loading, Suspense, and ErrorBoundary
 * for optimal performance and error handling.
 * 
 * @example
 * ```tsx
 * // For named exports
 * const HomePage = lazyLoad(() => import('./pages/Home'), 'Home');
 * 
 * // For default exports
 * const HomePage = lazyLoad(() => import('./pages/Home'));
 * 
 * // Usage in App
 * <LazyRoute component={HomePage} />
 * ```
 */

interface LazyRouteProps {
  component: ComponentType<any>;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  [key: string]: any; // Allow passing any props to the component
}

// Custom loading fallback
export function RouteLoader({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background dark:bg-background">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>
      </div>
    </div>
  );
}

// Minimal loading fallback for inline components
export function InlineLoader() {
  return (
    <div className="flex items-center justify-center p-8">
      <Spinner size="md" />
    </div>
  );
}

/**
 * LazyRoute Component - Combines lazy loading with error boundary and suspense
 */
export function LazyRoute({
  component: Component,
  fallback = <RouteLoader />,
  onError,
  ...props
}: LazyRouteProps) {
  return (
    <ErrorBoundary onError={onError}>
      <Suspense fallback={fallback}>
        <Component {...props} />
      </Suspense>
    </ErrorBoundary>
  );
}

/**
 * Helper function to create lazy-loaded components with proper typing
 * Handles both default and named exports
 * 
 * @param importFn - The dynamic import function
 * @param exportName - Optional name of the export (for named exports)
 * @returns Lazy-loaded component
 * 
 * @example
 * ```tsx
 * // For named exports
 * const Home = lazyLoad(() => import('./pages/Home'), 'Home');
 * 
 * // For default exports
 * const Home = lazyLoad(() => import('./pages/Home'));
 * ```
 */
export function lazyLoad<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T } | any>,
  exportName?: string
): React.LazyExoticComponent<T> {
  if (exportName) {
    // Named export
    return lazy(() =>
      importFn().then((module) => ({
        default: module[exportName],
      }))
    ) as React.LazyExoticComponent<T>;
  }
  // Default export
  return lazy(importFn) as React.LazyExoticComponent<T>;
}

/**
 * Preload a lazy component before it's needed
 * Useful for prefetching routes on hover/focus
 * 
 * @example
 * ```tsx
 * const HomePage = lazyLoad(() => import('./pages/Home'), 'Home');
 * 
 * // Preload on hover
 * <button onMouseEnter={() => preloadComponent(HomePage)}>
 *   Go to Home
 * </button>
 * ```
 */
export function preloadComponent<T extends ComponentType<any>>(
  component: React.LazyExoticComponent<T>
): void {
  // Force React to load the lazy component
  const preloadPromise = (component as any)._ctor?.();
  
  if (preloadPromise && typeof preloadPromise.catch === 'function') {
    preloadPromise.catch(() => {
      console.warn('Failed to preload component');
    });
  }
}

/**
 * HOC to wrap a component with lazy loading, suspense, and error boundary
 * 
 * @example
 * ```tsx
 * const LazyHome = withLazyLoad(() => import('./pages/Home'), 'Home');
 * 
 * // Usage
 * <LazyHome />
 * ```
 */
export function withLazyLoad<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T } | any>,
  exportName?: string,
  options?: {
    fallback?: React.ReactNode;
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  }
) {
  const LazyComponent = lazyLoad(importFn, exportName);

  return (props: any) => (
    <LazyRoute
      component={LazyComponent}
      fallback={options?.fallback}
      onError={options?.onError}
      {...props}
    />
  );
}
