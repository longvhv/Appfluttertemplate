/**
 * Routing Utilities
 * 
 * Provides routing helpers and hooks (framework-agnostic)
 */

import { useState, useEffect, useCallback, useMemo } from 'react';

/**
 * Query parameters
 */
export type QueryParams = Record<string, string | string[] | undefined>;

/**
 * Route pattern
 */
export interface RoutePattern {
  path: string;
  params?: Record<string, string>;
}

/**
 * Parse query string to object
 */
export function parseQueryString(queryString: string): QueryParams {
  const params: QueryParams = {};
  
  if (!queryString) return params;
  
  const urlSearchParams = new URLSearchParams(queryString);
  
  urlSearchParams.forEach((value, key) => {
    const existing = params[key];
    
    if (existing) {
      if (Array.isArray(existing)) {
        existing.push(value);
      } else {
        params[key] = [existing, value];
      }
    } else {
      params[key] = value;
    }
  });
  
  return params;
}

/**
 * Stringify query params to string
 */
export function stringifyQueryParams(params: QueryParams): string {
  const urlSearchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined) return;
    
    if (Array.isArray(value)) {
      value.forEach(v => urlSearchParams.append(key, v));
    } else {
      urlSearchParams.append(key, value);
    }
  });
  
  const queryString = urlSearchParams.toString();
  return queryString ? `?${queryString}` : '';
}

/**
 * Parse URL pathname
 */
export function parsePathname(pathname: string): string[] {
  return pathname
    .split('/')
    .filter(segment => segment.length > 0);
}

/**
 * Match route pattern
 */
export function matchRoute(
  pathname: string,
  pattern: string
): { matches: boolean; params: Record<string, string> } {
  const pathnameSegments = parsePathname(pathname);
  const patternSegments = parsePathname(pattern);
  
  if (pathnameSegments.length !== patternSegments.length) {
    return { matches: false, params: {} };
  }
  
  const params: Record<string, string> = {};
  
  for (let i = 0; i < patternSegments.length; i++) {
    const patternSegment = patternSegments[i];
    const pathnameSegment = pathnameSegments[i];
    
    if (patternSegment.startsWith(':')) {
      // Dynamic segment
      const paramName = patternSegment.slice(1);
      params[paramName] = pathnameSegment;
    } else if (patternSegment !== pathnameSegment) {
      // Static segment doesn't match
      return { matches: false, params: {} };
    }
  }
  
  return { matches: true, params };
}

/**
 * Build URL with params
 */
export function buildUrl(
  pattern: string,
  params?: Record<string, string>,
  query?: QueryParams
): string {
  let url = pattern;
  
  // Replace dynamic segments
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`:${key}`, value);
    });
  }
  
  // Add query string
  if (query) {
    url += stringifyQueryParams(query);
  }
  
  return url;
}

/**
 * Use query params hook
 */
export function useQueryParams<T extends QueryParams = QueryParams>(): [
  T,
  (params: Partial<T>, replace?: boolean) => void
] {
  const [params, setParams] = useState<T>(() => {
    if (typeof window === 'undefined') return {} as T;
    
    const search = window.location.search.slice(1);
    return parseQueryString(search) as T;
  });

  const updateParams = useCallback((newParams: Partial<T>, replace: boolean = false) => {
    const updated = replace ? newParams : { ...params, ...newParams };
    
    const queryString = stringifyQueryParams(updated as QueryParams);
    const url = `${window.location.pathname}${queryString}`;
    
    if (replace) {
      window.history.replaceState({}, '', url);
    } else {
      window.history.pushState({}, '', url);
    }
    
    setParams(updated as T);
  }, [params]);

  useEffect(() => {
    const handlePopState = () => {
      const search = window.location.search.slice(1);
      setParams(parseQueryString(search) as T);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return [params, updateParams];
}

/**
 * Use pathname hook
 */
export function usePathname(): string {
  const [pathname, setPathname] = useState(() => {
    if (typeof window === 'undefined') return '/';
    return window.location.pathname;
  });

  useEffect(() => {
    const handlePopState = () => {
      setPathname(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return pathname;
}

/**
 * Use navigation hook
 */
export function useNavigation() {
  const push = useCallback((url: string, state?: any) => {
    window.history.pushState(state || {}, '', url);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }, []);

  const replace = useCallback((url: string, state?: any) => {
    window.history.replaceState(state || {}, '', url);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }, []);

  const back = useCallback(() => {
    window.history.back();
  }, []);

  const forward = useCallback(() => {
    window.history.forward();
  }, []);

  const go = useCallback((delta: number) => {
    window.history.go(delta);
  }, []);

  return { push, replace, back, forward, go };
}

/**
 * Use route params hook
 */
export function useRouteParams<T extends Record<string, string> = Record<string, string>>(
  pattern: string
): T {
  const pathname = usePathname();
  
  return useMemo(() => {
    const { matches, params } = matchRoute(pathname, pattern);
    return matches ? (params as T) : ({} as T);
  }, [pathname, pattern]);
}

/**
 * Use hash hook
 */
export function useHash(): [string, (hash: string) => void] {
  const [hash, setHashState] = useState(() => {
    if (typeof window === 'undefined') return '';
    return window.location.hash.slice(1);
  });

  const setHash = useCallback((newHash: string) => {
    window.location.hash = newHash;
    setHashState(newHash);
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      setHashState(window.location.hash.slice(1));
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return [hash, setHash];
}

/**
 * Breadcrumb item
 */
export interface BreadcrumbItem {
  label: string;
  path: string;
}

/**
 * Generate breadcrumbs from pathname
 */
export function generateBreadcrumbs(
  pathname: string,
  labels?: Record<string, string>
): BreadcrumbItem[] {
  const segments = parsePathname(pathname);
  const breadcrumbs: BreadcrumbItem[] = [];
  
  let currentPath = '';
  
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    breadcrumbs.push({
      label: labels?.[segment] || segment,
      path: currentPath,
    });
  });
  
  return breadcrumbs;
}

/**
 * Use breadcrumbs hook
 */
export function useBreadcrumbs(labels?: Record<string, string>): BreadcrumbItem[] {
  const pathname = usePathname();
  
  return useMemo(() => {
    return generateBreadcrumbs(pathname, labels);
  }, [pathname, labels]);
}

/**
 * Active link checker
 */
export function isActiveLink(
  currentPath: string,
  linkPath: string,
  exact: boolean = false
): boolean {
  if (exact) {
    return currentPath === linkPath;
  }
  
  return currentPath.startsWith(linkPath);
}

/**
 * Use active link hook
 */
export function useActiveLink(linkPath: string, exact: boolean = false): boolean {
  const pathname = usePathname();
  
  return useMemo(() => {
    return isActiveLink(pathname, linkPath, exact);
  }, [pathname, linkPath, exact]);
}

/**
 * Scroll restoration hook
 */
export function useScrollRestoration(key?: string) {
  useEffect(() => {
    const scrollKey = key || window.location.pathname;
    
    // Restore scroll position
    const savedPosition = sessionStorage.getItem(`scroll-${scrollKey}`);
    if (savedPosition) {
      const { x, y } = JSON.parse(savedPosition);
      window.scrollTo(x, y);
    }

    // Save scroll position on unmount
    return () => {
      const position = {
        x: window.scrollX,
        y: window.scrollY,
      };
      sessionStorage.setItem(`scroll-${scrollKey}`, JSON.stringify(position));
    };
  }, [key]);
}

/**
 * Page transition hook
 */
export function usePageTransition(duration: number = 300) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsTransitioning(true);
    
    const timeout = setTimeout(() => {
      setIsTransitioning(false);
    }, duration);

    return () => clearTimeout(timeout);
  }, [pathname, duration]);

  return isTransitioning;
}

/**
 * Prefetch link
 */
export function prefetchLink(url: string) {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = url;
  document.head.appendChild(link);
}

/**
 * Use prefetch hook
 */
export function usePrefetchLink() {
  return useCallback((url: string) => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => prefetchLink(url));
    } else {
      setTimeout(() => prefetchLink(url), 1);
    }
  }, []);
}

/**
 * Route guard hook
 */
export function useRouteGuard(
  canActivate: () => boolean | Promise<boolean>,
  redirectTo?: string
) {
  const { push } = useNavigation();
  const pathname = usePathname();

  useEffect(() => {
    const checkAccess = async () => {
      const allowed = await canActivate();
      
      if (!allowed && redirectTo) {
        push(redirectTo);
      }
    };

    checkAccess();
  }, [pathname, canActivate, redirectTo, push]);
}

/**
 * Search params class (modern URLSearchParams wrapper)
 */
export class SearchParams {
  private params: URLSearchParams;

  constructor(init?: string | QueryParams) {
    if (typeof init === 'string') {
      this.params = new URLSearchParams(init);
    } else {
      this.params = new URLSearchParams();
      if (init) {
        Object.entries(init).forEach(([key, value]) => {
          if (value !== undefined) {
            if (Array.isArray(value)) {
              value.forEach(v => this.params.append(key, v));
            } else {
              this.params.set(key, value);
            }
          }
        });
      }
    }
  }

  get(key: string): string | null {
    return this.params.get(key);
  }

  getAll(key: string): string[] {
    return this.params.getAll(key);
  }

  has(key: string): boolean {
    return this.params.has(key);
  }

  set(key: string, value: string): void {
    this.params.set(key, value);
  }

  append(key: string, value: string): void {
    this.params.append(key, value);
  }

  delete(key: string): void {
    this.params.delete(key);
  }

  toString(): string {
    const str = this.params.toString();
    return str ? `?${str}` : '';
  }

  toObject(): QueryParams {
    const obj: QueryParams = {};
    
    this.params.forEach((value, key) => {
      const existing = obj[key];
      
      if (existing) {
        if (Array.isArray(existing)) {
          existing.push(value);
        } else {
          obj[key] = [existing, value];
        }
      } else {
        obj[key] = value;
      }
    });
    
    return obj;
  }
}
