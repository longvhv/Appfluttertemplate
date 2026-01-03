/**
 * Lazy Loading Utilities for React Native
 * 
 * Provides lazy loading patterns for components and data
 */

import React, { ComponentType, lazy, Suspense, ReactNode } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

/**
 * Default loading component
 */
const DefaultLoader: React.FC<{ size?: 'small' | 'large' }> = ({ size = 'large' }) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
  });

  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} />
    </View>
  );
};

/**
 * Lazy load a component with custom fallback
 */
export function lazyLoad<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  fallback?: ReactNode
) {
  const LazyComponent = lazy(factory);

  return (props: React.ComponentProps<T>) => (
    <Suspense fallback={fallback || <DefaultLoader />}>
      <LazyComponent {...props} />
    </Suspense>
  );
}

/**
 * Lazy load with retry on failure
 */
export function lazyLoadWithRetry<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  maxRetries: number = 3,
  fallback?: ReactNode
) {
  let retries = 0;

  const retryFactory = async (): Promise<{ default: T }> => {
    try {
      return await factory();
    } catch (error) {
      if (retries < maxRetries) {
        retries++;
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retries)));
        return retryFactory();
      }
      throw error;
    }
  };

  return lazyLoad(retryFactory, fallback);
}

/**
 * Preload a lazy component
 */
export function preloadComponent<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>
) {
  return factory();
}

/**
 * Lazy load multiple components
 */
export function lazyLoadMultiple<T extends Record<string, ComponentType<any>>>(
  factories: { [K in keyof T]: () => Promise<{ default: T[K] }> },
  fallback?: ReactNode
) {
  const components = {} as { [K in keyof T]: (props: React.ComponentProps<T[K]>) => JSX.Element };

  for (const key in factories) {
    components[key] = lazyLoad(factories[key], fallback);
  }

  return components;
}

/**
 * Component-level code splitting
 */
export class LazyBoundary extends React.Component<
  {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error) => void;
  },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    if (this.props.onError) {
      this.props.onError(error);
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <DefaultLoader />;
    }

    return this.props.children;
  }
}

/**
 * Hook for lazy loading data
 */
export function useLazyData<T>(
  fetcher: () => Promise<T>,
  deps: React.DependencyList = []
) {
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await fetcher();
        
        if (!cancelled) {
          setData(result);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err as Error);
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, deps);

  return { data, loading, error };
}

/**
 * Lazy load with intersection observer pattern
 * (Useful for loading components when they come into view)
 */
export function useLazyOnView<T>(
  factory: () => Promise<T>,
  enabled: boolean = true
) {
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(false);
  const loaded = React.useRef(false);

  React.useEffect(() => {
    if (enabled && !loaded.current && !loading) {
      loaded.current = true;
      setLoading(true);
      
      factory().then((result) => {
        setData(result);
        setLoading(false);
      }).catch(() => {
        setLoading(false);
        loaded.current = false;
      });
    }
  }, [enabled, factory, loading]);

  return { data, loading };
}

/**
 * Chunk loader for progressive data loading
 */
export function useChunkedData<T>(
  data: T[],
  chunkSize: number = 10,
  delay: number = 100
) {
  const [displayedData, setDisplayedData] = React.useState<T[]>([]);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    if (currentIndex < data.length) {
      const timer = setTimeout(() => {
        const nextChunk = data.slice(
          currentIndex,
          Math.min(currentIndex + chunkSize, data.length)
        );
        setDisplayedData(prev => [...prev, ...nextChunk]);
        setCurrentIndex(prev => prev + chunkSize);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, data, chunkSize, delay]);

  const hasMore = currentIndex < data.length;
  const loadMore = React.useCallback(() => {
    if (hasMore) {
      const nextChunk = data.slice(
        currentIndex,
        Math.min(currentIndex + chunkSize, data.length)
      );
      setDisplayedData(prev => [...prev, ...nextChunk]);
      setCurrentIndex(prev => prev + chunkSize);
    }
  }, [currentIndex, data, chunkSize, hasMore]);

  return { data: displayedData, hasMore, loadMore };
}

/**
 * Virtual list data provider
 * For extremely large lists
 */
export function useVirtualData<T>(
  totalItems: number,
  itemHeight: number,
  windowHeight: number,
  fetcher: (startIndex: number, endIndex: number) => Promise<T[]>
) {
  const [visibleData, setVisibleData] = React.useState<Map<number, T>>(new Map());
  const [scrollOffset, setScrollOffset] = React.useState(0);

  const visibleRange = React.useMemo(() => {
    const start = Math.floor(scrollOffset / itemHeight);
    const end = Math.ceil((scrollOffset + windowHeight) / itemHeight);
    return { start, end };
  }, [scrollOffset, itemHeight, windowHeight]);

  React.useEffect(() => {
    const { start, end } = visibleRange;
    
    fetcher(start, end).then(items => {
      const newData = new Map(visibleData);
      items.forEach((item, index) => {
        newData.set(start + index, item);
      });
      setVisibleData(newData);
    });
  }, [visibleRange, fetcher]);

  return {
    visibleData,
    setScrollOffset,
    visibleRange,
  };
}

/**
 * Image lazy loader
 */
export function useLazyImage(uri: string, preload: boolean = false) {
  const [loaded, setLoaded] = React.useState(false);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    if (preload) {
      // Preload image
      const image = new Image();
      image.onload = () => setLoaded(true);
      image.onerror = () => setError(true);
      image.src = uri;
    }
  }, [uri, preload]);

  const onLoad = React.useCallback(() => setLoaded(true), []);
  const onError = React.useCallback(() => setError(true), []);

  return { loaded, error, onLoad, onError };
}

// Note: Image is a class for preloading, React Native uses a different pattern
class Image {
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  src: string = '';
}
