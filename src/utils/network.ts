/**
 * Network Utilities
 * 
 * Provides network helpers and hooks
 */

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Network status
 */
export interface NetworkStatus {
  online: boolean;
  effectiveType?: 'slow-2g' | '2g' | '3g' | '4g';
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
}

/**
 * Fetch options with retry
 */
export interface FetchOptions extends RequestInit {
  retries?: number;
  retryDelay?: number;
  timeout?: number;
  onRetry?: (attempt: number, error: Error) => void;
}

/**
 * Network status hook
 */
export function useNetworkStatus(): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>({
    online: typeof navigator !== 'undefined' ? navigator.onLine : true,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateStatus = () => {
      const connection = (navigator as any).connection || 
                        (navigator as any).mozConnection || 
                        (navigator as any).webkitConnection;

      setStatus({
        online: navigator.onLine,
        effectiveType: connection?.effectiveType,
        downlink: connection?.downlink,
        rtt: connection?.rtt,
        saveData: connection?.saveData,
      });
    };

    updateStatus();

    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);

    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener('change', updateStatus);
    }

    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
      
      if (connection) {
        connection.removeEventListener('change', updateStatus);
      }
    };
  }, []);

  return status;
}

/**
 * Online status hook
 */
export function useOnlineStatus(): boolean {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

/**
 * Fetch with timeout
 */
export async function fetchWithTimeout(
  url: string,
  options: RequestInit & { timeout?: number } = {}
): Promise<Response> {
  const { timeout = 10000, ...fetchOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

/**
 * Fetch with retry
 */
export async function fetchWithRetry(
  url: string,
  options: FetchOptions = {}
): Promise<Response> {
  const {
    retries = 3,
    retryDelay = 1000,
    timeout = 10000,
    onRetry,
    ...fetchOptions
  } = options;

  let lastError: Error;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fetchWithTimeout(url, { ...fetchOptions, timeout });
    } catch (error) {
      lastError = error as Error;

      if (attempt < retries) {
        onRetry?.(attempt + 1, lastError);
        await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
      }
    }
  }

  throw lastError!;
}

/**
 * Fetch JSON helper
 */
export async function fetchJSON<T = any>(
  url: string,
  options?: FetchOptions
): Promise<T> {
  const response = await fetchWithRetry(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

/**
 * POST JSON helper
 */
export async function postJSON<T = any>(
  url: string,
  data: any,
  options?: FetchOptions
): Promise<T> {
  return fetchJSON<T>(url, {
    ...options,
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Request queue for rate limiting
 */
class RequestQueue {
  private queue: Array<() => Promise<any>> = [];
  private processing = false;
  private delay: number;

  constructor(delay: number = 100) {
    this.delay = delay;
  }

  async add<T>(request: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await request();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      if (!this.processing) {
        this.process();
      }
    });
  }

  private async process() {
    this.processing = true;

    while (this.queue.length > 0) {
      const request = this.queue.shift()!;
      await request();
      await new Promise(resolve => setTimeout(resolve, this.delay));
    }

    this.processing = false;
  }
}

/**
 * Create request queue
 */
export function createRequestQueue(delay: number = 100) {
  return new RequestQueue(delay);
}

/**
 * Prefetch hook
 */
export function usePrefetch() {
  const prefetchedUrls = useRef(new Set<string>());

  const prefetch = useCallback((url: string, options?: RequestInit) => {
    if (prefetchedUrls.current.has(url)) {
      return;
    }

    prefetchedUrls.current.add(url);

    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        fetch(url, options).catch(() => {
          prefetchedUrls.current.delete(url);
        });
      });
    } else {
      setTimeout(() => {
        fetch(url, options).catch(() => {
          prefetchedUrls.current.delete(url);
        });
      }, 1);
    }
  }, []);

  return prefetch;
}

/**
 * API client creator
 */
export interface APIClientOptions {
  baseURL: string;
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  onError?: (error: Error) => void;
  onRequest?: (config: RequestInit) => RequestInit | Promise<RequestInit>;
  onResponse?: (response: Response) => Response | Promise<Response>;
}

export function createAPIClient(options: APIClientOptions) {
  const {
    baseURL,
    headers = {},
    timeout = 10000,
    retries = 3,
    retryDelay = 1000,
    onError,
    onRequest,
    onResponse,
  } = options;

  async function request<T = any>(
    endpoint: string,
    config: RequestInit = {}
  ): Promise<T> {
    const url = `${baseURL}${endpoint}`;

    let requestConfig: RequestInit = {
      ...config,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
        ...config.headers,
      },
    };

    // Call onRequest hook
    if (onRequest) {
      requestConfig = await onRequest(requestConfig);
    }

    try {
      let response = await fetchWithRetry(url, {
        ...requestConfig,
        timeout,
        retries,
        retryDelay,
      });

      // Call onResponse hook
      if (onResponse) {
        response = await onResponse(response);
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      onError?.(error as Error);
      throw error;
    }
  }

  return {
    get: <T = any>(endpoint: string, config?: RequestInit) =>
      request<T>(endpoint, { ...config, method: 'GET' }),

    post: <T = any>(endpoint: string, data?: any, config?: RequestInit) =>
      request<T>(endpoint, {
        ...config,
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined,
      }),

    put: <T = any>(endpoint: string, data?: any, config?: RequestInit) =>
      request<T>(endpoint, {
        ...config,
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined,
      }),

    patch: <T = any>(endpoint: string, data?: any, config?: RequestInit) =>
      request<T>(endpoint, {
        ...config,
        method: 'PATCH',
        body: data ? JSON.stringify(data) : undefined,
      }),

    delete: <T = any>(endpoint: string, config?: RequestInit) =>
      request<T>(endpoint, { ...config, method: 'DELETE' }),

    request,
  };
}

/**
 * Download file
 */
export async function downloadFile(
  url: string,
  filename?: string,
  options?: RequestInit
): Promise<void> {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = filename || url.split('/').pop() || 'download';
  link.click();

  URL.revokeObjectURL(objectUrl);
}

/**
 * Upload file with progress
 */
export async function uploadFile(
  url: string,
  file: File,
  options?: RequestInit & {
    onProgress?: (progress: number) => void;
  }
): Promise<Response> {
  const { onProgress, ...fetchOptions } = options || {};

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        const progress = (e.loaded / e.total) * 100;
        onProgress(progress);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(new Response(xhr.response));
      } else {
        reject(new Error(`HTTP error! status: ${xhr.status}`));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Upload failed'));
    });

    xhr.open(fetchOptions?.method || 'POST', url);

    // Set headers
    if (fetchOptions?.headers) {
      Object.entries(fetchOptions.headers).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value as string);
      });
    }

    const formData = new FormData();
    formData.append('file', file);

    xhr.send(formData);
  });
}

/**
 * Abort controller hook
 */
export function useAbortController() {
  const controllerRef = useRef<AbortController>();

  const getController = useCallback(() => {
    if (!controllerRef.current) {
      controllerRef.current = new AbortController();
    }
    return controllerRef.current;
  }, []);

  const abort = useCallback(() => {
    controllerRef.current?.abort();
    controllerRef.current = undefined;
  }, []);

  const getSignal = useCallback(() => {
    return getController().signal;
  }, [getController]);

  useEffect(() => {
    return () => {
      abort();
    };
  }, [abort]);

  return { getSignal, abort };
}

/**
 * Polling hook
 */
export function usePolling(
  callback: () => void | Promise<void>,
  interval: number,
  enabled: boolean = true
) {
  const savedCallback = useRef(callback);
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      return;
    }

    const tick = async () => {
      await savedCallback.current();
    };

    tick(); // Call immediately
    intervalRef.current = setInterval(tick, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [interval, enabled]);
}
