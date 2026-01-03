/**
 * State Management Utilities
 * 
 * Provides lightweight state management hooks
 */

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';

/**
 * Global state store
 */
class Store<T> {
  private state: T;
  private listeners: Set<(state: T) => void> = new Set();

  constructor(initialState: T) {
    this.state = initialState;
  }

  getState(): T {
    return this.state;
  }

  setState(update: Partial<T> | ((prev: T) => T)): void {
    this.state = typeof update === 'function'
      ? update(this.state)
      : { ...this.state, ...update };
    
    this.notifyListeners();
  }

  subscribe(listener: (state: T) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.state));
  }
}

/**
 * Create a global store
 */
export function createStore<T>(initialState: T) {
  const store = new Store(initialState);

  return {
    getState: () => store.getState(),
    setState: (update: Partial<T> | ((prev: T) => T)) => store.setState(update),
    subscribe: (listener: (state: T) => void) => store.subscribe(listener),
    
    // Hook to use the store
    useStore: <S = T>(selector?: (state: T) => S): [S, (update: Partial<T> | ((prev: T) => T)) => void] => {
      const [state, setState] = useState(() => 
        selector ? selector(store.getState()) : store.getState() as unknown as S
      );

      useEffect(() => {
        const unsubscribe = store.subscribe((newState) => {
          const selected = selector ? selector(newState) : newState as unknown as S;
          setState(selected);
        });

        return unsubscribe;
      }, [selector]);

      return [state, (update) => store.setState(update)];
    },
  };
}

/**
 * Local storage state hook
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }, [key, storedValue]);

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}

/**
 * Session storage state hook
 */
export function useSessionStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from sessionStorage:', error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error writing to sessionStorage:', error);
    }
  }, [key, storedValue]);

  const removeValue = useCallback(() => {
    try {
      window.sessionStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error('Error removing from sessionStorage:', error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}

/**
 * Toggle state hook
 */
export function useToggle(
  initialValue: boolean = false
): [boolean, () => void, (value: boolean) => void] {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue(prev => !prev);
  }, []);

  const set = useCallback((newValue: boolean) => {
    setValue(newValue);
  }, []);

  return [value, toggle, set];
}

/**
 * Counter hook
 */
export function useCounter(
  initialValue: number = 0,
  options: { min?: number; max?: number } = {}
) {
  const { min, max } = options;
  const [count, setCount] = useState(initialValue);

  const increment = useCallback(() => {
    setCount(prev => {
      const next = prev + 1;
      if (max !== undefined && next > max) return prev;
      return next;
    });
  }, [max]);

  const decrement = useCallback(() => {
    setCount(prev => {
      const next = prev - 1;
      if (min !== undefined && next < min) return prev;
      return next;
    });
  }, [min]);

  const reset = useCallback(() => {
    setCount(initialValue);
  }, [initialValue]);

  const set = useCallback((value: number | ((prev: number) => number)) => {
    setCount(prev => {
      const next = typeof value === 'function' ? value(prev) : value;
      if (min !== undefined && next < min) return min;
      if (max !== undefined && next > max) return max;
      return next;
    });
  }, [min, max]);

  return { count, increment, decrement, reset, set };
}

/**
 * Array state hook
 */
export function useArray<T>(initialArray: T[] = []) {
  const [array, setArray] = useState(initialArray);

  const push = useCallback((item: T) => {
    setArray(prev => [...prev, item]);
  }, []);

  const remove = useCallback((index: number) => {
    setArray(prev => prev.filter((_, i) => i !== index));
  }, []);

  const update = useCallback((index: number, item: T) => {
    setArray(prev => prev.map((prevItem, i) => i === index ? item : prevItem));
  }, []);

  const clear = useCallback(() => {
    setArray([]);
  }, []);

  const filter = useCallback((predicate: (item: T) => boolean) => {
    setArray(prev => prev.filter(predicate));
  }, []);

  const sort = useCallback((compareFn?: (a: T, b: T) => number) => {
    setArray(prev => [...prev].sort(compareFn));
  }, []);

  const reverse = useCallback(() => {
    setArray(prev => [...prev].reverse());
  }, []);

  return { 
    array, 
    set: setArray, 
    push, 
    remove, 
    update, 
    clear, 
    filter, 
    sort, 
    reverse 
  };
}

/**
 * Map state hook
 */
export function useMap<K, V>(initialMap: Map<K, V> = new Map()) {
  const [map, setMap] = useState(initialMap);

  const set = useCallback((key: K, value: V) => {
    setMap(prev => new Map(prev).set(key, value));
  }, []);

  const remove = useCallback((key: K) => {
    setMap(prev => {
      const next = new Map(prev);
      next.delete(key);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setMap(new Map());
  }, []);

  return { 
    map, 
    set, 
    remove, 
    clear,
    get: (key: K) => map.get(key),
    has: (key: K) => map.has(key),
  };
}

/**
 * Set state hook
 */
export function useSet<T>(initialSet: Set<T> = new Set()) {
  const [set, setSet] = useState(initialSet);

  const add = useCallback((item: T) => {
    setSet(prev => new Set(prev).add(item));
  }, []);

  const remove = useCallback((item: T) => {
    setSet(prev => {
      const next = new Set(prev);
      next.delete(item);
      return next;
    });
  }, []);

  const toggle = useCallback((item: T) => {
    setSet(prev => {
      const next = new Set(prev);
      if (next.has(item)) {
        next.delete(item);
      } else {
        next.add(item);
      }
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setSet(new Set());
  }, []);

  return { 
    set, 
    add, 
    remove, 
    toggle, 
    clear,
    has: (item: T) => set.has(item),
  };
}

/**
 * Undo/Redo hook
 */
export function useHistory<T>(initialState: T) {
  const [history, setHistory] = useState<T[]>([initialState]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const state = history[currentIndex];

  const set = useCallback((newState: T | ((prev: T) => T)) => {
    const value = typeof newState === 'function' 
      ? (newState as (prev: T) => T)(state) 
      : newState;

    setHistory(prev => [...prev.slice(0, currentIndex + 1), value]);
    setCurrentIndex(prev => prev + 1);
  }, [currentIndex, state]);

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, history.length]);

  const reset = useCallback(() => {
    setHistory([initialState]);
    setCurrentIndex(0);
  }, [initialState]);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  return { 
    state, 
    set, 
    undo, 
    redo, 
    reset, 
    canUndo, 
    canRedo,
    history,
    currentIndex,
  };
}

/**
 * Async state hook
 */
export function useAsync<T, E = Error>(
  asyncFunction: () => Promise<T>,
  immediate: boolean = true
) {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<E | null>(null);

  const execute = useCallback(async () => {
    setStatus('pending');
    setData(null);
    setError(null);

    try {
      const response = await asyncFunction();
      setData(response);
      setStatus('success');
      return response;
    } catch (err) {
      setError(err as E);
      setStatus('error');
      throw err;
    }
  }, [asyncFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { 
    execute, 
    status, 
    data, 
    error,
    isIdle: status === 'idle',
    isPending: status === 'pending',
    isSuccess: status === 'success',
    isError: status === 'error',
  };
}

/**
 * Queue state hook
 */
export function useQueue<T>(initialQueue: T[] = []) {
  const [queue, setQueue] = useState(initialQueue);

  const enqueue = useCallback((item: T) => {
    setQueue(prev => [...prev, item]);
  }, []);

  const dequeue = useCallback((): T | undefined => {
    let item: T | undefined;
    setQueue(prev => {
      [item] = prev;
      return prev.slice(1);
    });
    return item;
  }, []);

  const peek = useCallback((): T | undefined => {
    return queue[0];
  }, [queue]);

  const clear = useCallback(() => {
    setQueue([]);
  }, []);

  return { 
    queue, 
    enqueue, 
    dequeue, 
    peek, 
    clear,
    size: queue.length,
    isEmpty: queue.length === 0,
  };
}

/**
 * Clipboard hook
 */
export function useClipboard(timeout: number = 2000) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setCopied(false);
      }, timeout);

      return true;
    } catch (error) {
      console.error('Failed to copy:', error);
      setCopied(false);
      return false;
    }
  }, [timeout]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { copied, copy };
}

/**
 * Batch updates hook
 */
export function useBatchUpdates<T>(
  initialState: T,
  delay: number = 100
) {
  const [state, setState] = useState(initialState);
  const pendingUpdatesRef = useRef<Partial<T>[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const batchUpdate = useCallback((update: Partial<T>) => {
    pendingUpdatesRef.current.push(update);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setState(prev => {
        let next = { ...prev };
        pendingUpdatesRef.current.forEach(u => {
          next = { ...next, ...u };
        });
        pendingUpdatesRef.current = [];
        return next;
      });
    }, delay);
  }, [delay]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return [state, batchUpdate] as const;
}
