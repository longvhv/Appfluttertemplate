/**
 * Cache Utilities for React Native
 * 
 * Provides caching mechanisms for data and components
 */

import { useRef, useEffect, useCallback, useState } from 'react';

/**
 * Simple in-memory cache
 */
class MemoryCache<T> {
  private cache: Map<string, { value: T; timestamp: number }> = new Map();
  private maxSize: number;
  private ttl: number; // Time to live in milliseconds

  constructor(maxSize: number = 100, ttl: number = 5 * 60 * 1000) {
    this.maxSize = maxSize;
    this.ttl = ttl;
  }

  set(key: string, value: T): void {
    // Remove oldest if at capacity
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now(),
    });
  }

  get(key: string): T | undefined {
    const item = this.cache.get(key);

    if (!item) {
      return undefined;
    }

    // Check if expired
    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return undefined;
    }

    return item.value;
  }

  has(key: string): boolean {
    return this.get(key) !== undefined;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  get size(): number {
    return this.cache.size;
  }

  // Cleanup expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > this.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

/**
 * Global cache instances
 */
export const globalCache = new MemoryCache(100, 5 * 60 * 1000); // 5 minutes
export const imageCache = new MemoryCache(50, 30 * 60 * 1000); // 30 minutes
export const apiCache = new MemoryCache(50, 2 * 60 * 1000); // 2 minutes

/**
 * Cache hook for component data
 */
export function useCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: {
    cache?: MemoryCache<T>;
    ttl?: number;
    enabled?: boolean;
  } = {}
) {
  const {
    cache = globalCache,
    ttl = 5 * 60 * 1000,
    enabled = true,
  } = options;

  const [data, setData] = useState<T | undefined>(() =>
    enabled ? cache.get(key) : undefined
  );
  const [loading, setLoading] = useState(!data);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    // Check cache first
    const cached = cache.get(key);
    if (cached) {
      setData(cached);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await fetcher();
      cache.set(key, result);
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [key, fetcher, cache, enabled]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refresh = useCallback(() => {
    cache.delete(key);
    return fetchData();
  }, [key, cache, fetchData]);

  const invalidate = useCallback(() => {
    cache.delete(key);
    setData(undefined);
  }, [key, cache]);

  return { data, loading, error, refresh, invalidate };
}

/**
 * Memoize expensive function calls
 */
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  options: {
    maxSize?: number;
    keyGenerator?: (...args: Parameters<T>) => string;
  } = {}
): T {
  const { maxSize = 100, keyGenerator = JSON.stringify } = options;
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>) => {
    const key = keyGenerator(...args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn(...args);

    // Limit cache size
    if (cache.size >= maxSize) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }

    cache.set(key, result);
    return result;
  }) as T;
}

/**
 * Hook for memoized async function
 */
export function useMemoizedAsync<T, Args extends any[]>(
  fn: (...args: Args) => Promise<T>,
  deps: React.DependencyList = []
) {
  const cacheRef = useRef(new Map<string, T>());

  return useCallback(
    async (...args: Args) => {
      const key = JSON.stringify(args);
      const cached = cacheRef.current.get(key);

      if (cached !== undefined) {
        return cached;
      }

      const result = await fn(...args);
      cacheRef.current.set(key, result);
      return result;
    },
    deps
  );
}

/**
 * LRU Cache implementation
 */
class LRUCache<K, V> {
  private maxSize: number;
  private cache: Map<K, V>;

  constructor(maxSize: number = 100) {
    this.maxSize = maxSize;
    this.cache = new Map();
  }

  get(key: K): V | undefined {
    if (!this.cache.has(key)) {
      return undefined;
    }

    // Move to end (most recent)
    const value = this.cache.get(key)!;
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  set(key: K, value: V): void {
    // Remove if exists
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }

    // Remove oldest if at capacity
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, value);
  }

  has(key: K): boolean {
    return this.cache.has(key);
  }

  delete(key: K): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  get size(): number {
    return this.cache.size;
  }
}

/**
 * Hook for LRU cache
 */
export function useLRUCache<K, V>(maxSize: number = 100) {
  const cacheRef = useRef(new LRUCache<K, V>(maxSize));

  const get = useCallback((key: K) => {
    return cacheRef.current.get(key);
  }, []);

  const set = useCallback((key: K, value: V) => {
    cacheRef.current.set(key, value);
  }, []);

  const has = useCallback((key: K) => {
    return cacheRef.current.has(key);
  }, []);

  const remove = useCallback((key: K) => {
    cacheRef.current.delete(key);
  }, []);

  const clear = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  return { get, set, has, remove, clear, size: cacheRef.current.size };
}

/**
 * Cache with expiration
 */
export class ExpiringCache<T> {
  private cache: Map<string, { value: T; expiry: number }> = new Map();

  set(key: string, value: T, ttl: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      value,
      expiry: Date.now() + ttl,
    });
  }

  get(key: string): T | undefined {
    const item = this.cache.get(key);

    if (!item) {
      return undefined;
    }

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return undefined;
    }

    return item.value;
  }

  has(key: string): boolean {
    return this.get(key) !== undefined;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
      }
    }
  }
}

/**
 * Hook for component-level cache
 */
export function useComponentCache<T>() {
  const cacheRef = useRef(new Map<string, T>());

  const get = useCallback((key: string) => {
    return cacheRef.current.get(key);
  }, []);

  const set = useCallback((key: string, value: T) => {
    cacheRef.current.set(key, value);
  }, []);

  const has = useCallback((key: string) => {
    return cacheRef.current.has(key);
  }, []);

  const remove = useCallback((key: string) => {
    cacheRef.current.delete(key);
  }, []);

  const clear = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  return { get, set, has, remove, clear };
}

/**
 * Persistent cache key generator
 */
export function generateCacheKey(...parts: (string | number | boolean | null | undefined)[]): string {
  return parts
    .filter((p) => p !== null && p !== undefined)
    .map((p) => String(p))
    .join(':');
}

/**
 * Cache invalidation helper
 */
export function invalidateCache(pattern: string | RegExp, cache = globalCache) {
  // Note: This requires extending the cache class to expose keys
  // For now, just clear entire cache
  cache.clear();
}

/**
 * Automatic cache cleanup
 */
export function useAutoCacheCleanup(interval: number = 60 * 1000) {
  useEffect(() => {
    const timer = setInterval(() => {
      globalCache.cleanup();
      apiCache.cleanup();
      imageCache.cleanup();
    }, interval);

    return () => clearInterval(timer);
  }, [interval]);
}

/**
 * Query cache hook (React Query-like)
 */
export function useQuery<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: {
    staleTime?: number;
    cacheTime?: number;
    refetchOnMount?: boolean;
    enabled?: boolean;
  } = {}
) {
  const {
    staleTime = 0,
    cacheTime = 5 * 60 * 1000,
    refetchOnMount = true,
    enabled = true,
  } = options;

  const cache = useRef(new ExpiringCache<T>()).current;
  const [data, setData] = useState<T | undefined>(cache.get(key));
  const [loading, setLoading] = useState(!data && enabled);
  const [error, setError] = useState<Error | null>(null);
  const lastFetchRef = useRef(0);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    const now = Date.now();
    const stale = now - lastFetchRef.current > staleTime;

    // Use cache if not stale
    if (!stale && data) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await fetcher();
      cache.set(key, result, cacheTime);
      setData(result);
      lastFetchRef.current = now;
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [key, fetcher, cache, cacheTime, staleTime, enabled, data]);

  useEffect(() => {
    if (refetchOnMount) {
      fetchData();
    }
  }, [fetchData, refetchOnMount]);

  const refetch = useCallback(() => {
    cache.delete(key);
    return fetchData();
  }, [key, cache, fetchData]);

  const invalidate = useCallback(() => {
    cache.delete(key);
    setData(undefined);
  }, [key, cache]);

  return { data, loading, error, refetch, invalidate };
}
