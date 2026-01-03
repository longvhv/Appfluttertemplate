/**
 * Performance Utilities for React Native
 * 
 * Provides hooks and utilities for optimizing performance
 */

import { useCallback, useRef, useEffect, useMemo } from 'react';
import { InteractionManager, Platform } from 'react-native';

/**
 * Debounce hook
 * Delays function execution until after wait milliseconds
 */
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout>();

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  ) as T;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
}

/**
 * Throttle hook
 * Limits function execution to once per limit milliseconds
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  limit: number
): T {
  const inThrottle = useRef(false);

  const throttledCallback = useCallback(
    (...args: Parameters<T>) => {
      if (!inThrottle.current) {
        callback(...args);
        inThrottle.current = true;
        setTimeout(() => {
          inThrottle.current = false;
        }, limit);
      }
    },
    [callback, limit]
  ) as T;

  return throttledCallback;
}

/**
 * Run callback after interactions
 * Useful for delaying non-critical work
 */
export function useAfterInteractions(
  callback: () => void,
  deps: React.DependencyList = []
) {
  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      callback();
    });

    return () => task.cancel();
  }, deps);
}

/**
 * Stable callback hook
 * Alternative to useCallback with automatic dependency tracking
 */
export function useStableCallback<T extends (...args: any[]) => any>(
  callback: T
): T {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback((...args: Parameters<T>) => {
    return callbackRef.current(...args);
  }, []) as T;
}

/**
 * Previous value hook
 * Returns the previous value of a state/prop
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

/**
 * Mounted state hook
 * Prevents state updates on unmounted components
 */
export function useMounted(): () => boolean {
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return useCallback(() => mountedRef.current, []);
}

/**
 * Safe async callback hook
 * Only executes callback if component is still mounted
 */
export function useSafeCallback<T extends (...args: any[]) => Promise<any>>(
  callback: T
): T {
  const isMounted = useMounted();

  return useCallback(
    async (...args: Parameters<T>) => {
      if (isMounted()) {
        return await callback(...args);
      }
    },
    [callback, isMounted]
  ) as T;
}

/**
 * Lazy value hook
 * Only computes value when needed (on first access)
 */
export function useLazyValue<T>(factory: () => T): () => T {
  const ref = useRef<{ value: T; computed: boolean }>({
    value: undefined as any,
    computed: false,
  });

  return useCallback(() => {
    if (!ref.current.computed) {
      ref.current.value = factory();
      ref.current.computed = true;
    }
    return ref.current.value;
  }, [factory]);
}

/**
 * Constant value hook
 * Ensures a value is only computed once
 */
export function useConst<T>(factory: () => T): T {
  const ref = useRef<{ value: T }>();

  if (!ref.current) {
    ref.current = { value: factory() };
  }

  return ref.current.value;
}

/**
 * Update effect hook
 * Like useEffect but skips the first render
 */
export function useUpdateEffect(
  effect: React.EffectCallback,
  deps?: React.DependencyList
) {
  const isFirstMount = useRef(true);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    return effect();
  }, deps);
}

/**
 * Memoized object hook
 * Deep memoization for objects
 */
export function useMemoizedObject<T extends Record<string, any>>(
  obj: T
): T {
  return useMemo(() => obj, Object.values(obj));
}

/**
 * Performance monitor hook
 * Logs component render times (dev only)
 */
export function usePerformanceMonitor(componentName: string) {
  if (__DEV__) {
    const renderCount = useRef(0);
    const startTime = useRef(Date.now());

    renderCount.current += 1;

    useEffect(() => {
      const renderTime = Date.now() - startTime.current;
      console.log(
        `[Performance] ${componentName} rendered in ${renderTime}ms (render #${renderCount.current})`
      );
      startTime.current = Date.now();
    });
  }
}

/**
 * Optimized list key extractor
 * Creates a stable key extractor for FlatList
 */
export function createKeyExtractor<T extends { id: string | number }>(
  prefix?: string
) {
  return (item: T, index: number) =>
    prefix ? `${prefix}-${item.id}` : String(item.id);
}

/**
 * Batch state updates
 * Groups multiple state updates into one render
 */
export function useBatchedState<T>(
  initialState: T
): [T, (updates: Partial<T> | ((prev: T) => Partial<T>)) => void] {
  const [state, setState] = React.useState(initialState);

  const batchedSetState = useCallback(
    (updates: Partial<T> | ((prev: T) => Partial<T>)) => {
      setState((prev) => ({
        ...prev,
        ...(typeof updates === 'function' ? updates(prev) : updates),
      }));
    },
    []
  );

  return [state, batchedSetState];
}

/**
 * Optimize heavy computation with Web Worker-like pattern
 * Runs computation in InteractionManager
 */
export function useHeavyComputation<T, R>(
  data: T,
  computation: (data: T) => R,
  deps: React.DependencyList = []
): R | undefined {
  const [result, setResult] = React.useState<R>();

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      const computed = computation(data);
      setResult(computed);
    });

    return () => task.cancel();
  }, [data, ...deps]);

  return result;
}

/**
 * Platform-specific value hook
 */
export function usePlatformValue<T>(values: {
  ios?: T;
  android?: T;
  default: T;
}): T {
  return useMemo(() => {
    if (Platform.OS === 'ios' && values.ios !== undefined) {
      return values.ios;
    }
    if (Platform.OS === 'android' && values.android !== undefined) {
      return values.android;
    }
    return values.default;
  }, [values]);
}

/**
 * Async state hook with loading/error states
 */
export function useAsyncState<T>() {
  const [state, setState] = React.useState<{
    data: T | null;
    loading: boolean;
    error: Error | null;
  }>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (promise: Promise<T>) => {
    setState({ data: null, loading: true, error: null });
    try {
      const data = await promise;
      setState({ data, loading: false, error: null });
      return data;
    } catch (error) {
      setState({ data: null, loading: false, error: error as Error });
      throw error;
    }
  }, []);

  return { ...state, execute };
}

// Import React for hooks that need it
import * as React from 'react';
