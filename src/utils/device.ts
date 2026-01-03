/**
 * Device Detection Utilities
 * 
 * Provides device detection and responsive hooks
 */

import { useState, useEffect, useMemo } from 'react';

/**
 * Device type
 */
export type DeviceType = 'mobile' | 'tablet' | 'desktop';

/**
 * Operating system
 */
export type OperatingSystem = 'ios' | 'android' | 'windows' | 'macos' | 'linux' | 'unknown';

/**
 * Browser type
 */
export type BrowserType = 'chrome' | 'firefox' | 'safari' | 'edge' | 'opera' | 'unknown';

/**
 * Device info
 */
export interface DeviceInfo {
  type: DeviceType;
  os: OperatingSystem;
  browser: BrowserType;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouchDevice: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isWindows: boolean;
  isMacOS: boolean;
  isLinux: boolean;
  userAgent: string;
  screenWidth: number;
  screenHeight: number;
  pixelRatio: number;
}

/**
 * Breakpoints
 */
export const BREAKPOINTS = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

/**
 * Detect device type from user agent
 */
export function detectDeviceType(): DeviceType {
  if (typeof window === 'undefined') return 'desktop';

  const ua = navigator.userAgent.toLowerCase();
  
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  
  if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile|wpdesktop/i.test(ua)) {
    return 'mobile';
  }
  
  return 'desktop';
}

/**
 * Detect operating system
 */
export function detectOS(): OperatingSystem {
  if (typeof window === 'undefined') return 'unknown';

  const ua = navigator.userAgent.toLowerCase();
  
  if (/iphone|ipad|ipod/.test(ua)) return 'ios';
  if (/android/.test(ua)) return 'android';
  if (/win/.test(ua)) return 'windows';
  if (/mac/.test(ua)) return 'macos';
  if (/linux/.test(ua)) return 'linux';
  
  return 'unknown';
}

/**
 * Detect browser
 */
export function detectBrowser(): BrowserType {
  if (typeof window === 'undefined') return 'unknown';

  const ua = navigator.userAgent.toLowerCase();
  
  if (/edg/.test(ua)) return 'edge';
  if (/chrome/.test(ua) && !/edg/.test(ua)) return 'chrome';
  if (/firefox/.test(ua)) return 'firefox';
  if (/safari/.test(ua) && !/chrome/.test(ua)) return 'safari';
  if (/opera|opr/.test(ua)) return 'opera';
  
  return 'unknown';
}

/**
 * Check if touch device
 */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    (navigator as any).msMaxTouchPoints > 0
  );
}

/**
 * Get device info
 */
export function getDeviceInfo(): DeviceInfo {
  if (typeof window === 'undefined') {
    return {
      type: 'desktop',
      os: 'unknown',
      browser: 'unknown',
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      isTouchDevice: false,
      isIOS: false,
      isAndroid: false,
      isWindows: false,
      isMacOS: false,
      isLinux: false,
      userAgent: '',
      screenWidth: 1920,
      screenHeight: 1080,
      pixelRatio: 1,
    };
  }

  const type = detectDeviceType();
  const os = detectOS();
  const browser = detectBrowser();

  return {
    type,
    os,
    browser,
    isMobile: type === 'mobile',
    isTablet: type === 'tablet',
    isDesktop: type === 'desktop',
    isTouchDevice: isTouchDevice(),
    isIOS: os === 'ios',
    isAndroid: os === 'android',
    isWindows: os === 'windows',
    isMacOS: os === 'macos',
    isLinux: os === 'linux',
    userAgent: navigator.userAgent,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    pixelRatio: window.devicePixelRatio || 1,
  };
}

/**
 * Device info hook
 */
export function useDeviceInfo(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState(getDeviceInfo);

  useEffect(() => {
    const handleResize = () => {
      setDeviceInfo(getDeviceInfo());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return deviceInfo;
}

/**
 * Viewport size hook
 */
export function useViewportSize() {
  const [size, setSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}

/**
 * Breakpoint hook
 */
export function useBreakpoint(): Breakpoint {
  const { width } = useViewportSize();

  return useMemo(() => {
    if (width >= BREAKPOINTS['2xl']) return '2xl';
    if (width >= BREAKPOINTS.xl) return 'xl';
    if (width >= BREAKPOINTS.lg) return 'lg';
    if (width >= BREAKPOINTS.md) return 'md';
    if (width >= BREAKPOINTS.sm) return 'sm';
    return 'xs';
  }, [width]);
}

/**
 * Media query hook
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [query]);

  return matches;
}

/**
 * Responsive value hook
 */
export function useResponsiveValue<T>(values: Partial<Record<Breakpoint, T>>): T | undefined {
  const breakpoint = useBreakpoint();

  return useMemo(() => {
    const breakpoints: Breakpoint[] = ['2xl', 'xl', 'lg', 'md', 'sm', 'xs'];
    const currentIndex = breakpoints.indexOf(breakpoint);

    for (let i = currentIndex; i < breakpoints.length; i++) {
      const bp = breakpoints[i];
      if (values[bp] !== undefined) {
        return values[bp];
      }
    }

    return undefined;
  }, [breakpoint, values]);
}

/**
 * Is mobile hook
 */
export function useIsMobile(): boolean {
  return useMediaQuery(`(max-width: ${BREAKPOINTS.md - 1}px)`);
}

/**
 * Is tablet hook
 */
export function useIsTablet(): boolean {
  return useMediaQuery(
    `(min-width: ${BREAKPOINTS.md}px) and (max-width: ${BREAKPOINTS.lg - 1}px)`
  );
}

/**
 * Is desktop hook
 */
export function useIsDesktop(): boolean {
  return useMediaQuery(`(min-width: ${BREAKPOINTS.lg}px)`);
}

/**
 * Orientation hook
 */
export function useOrientation(): 'portrait' | 'landscape' {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(() => {
    if (typeof window === 'undefined') return 'portrait';
    return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setOrientation(
        window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
      );
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return orientation;
}

/**
 * Is portrait hook
 */
export function useIsPortrait(): boolean {
  return useOrientation() === 'portrait';
}

/**
 * Is landscape hook
 */
export function useIsLandscape(): boolean {
  return useOrientation() === 'landscape';
}

/**
 * Screen reader detection
 */
export function useScreenReader(): boolean {
  const [isScreenReader, setIsScreenReader] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check for common screen reader indicators
    const checkScreenReader = () => {
      const hasAriaLive = document.querySelectorAll('[aria-live]').length > 0;
      const hasAriaAtomic = document.querySelectorAll('[aria-atomic]').length > 0;
      const hasRole = document.querySelectorAll('[role]').length > 0;

      setIsScreenReader(hasAriaLive || hasAriaAtomic || hasRole);
    };

    checkScreenReader();

    // Monitor DOM changes
    const observer = new MutationObserver(checkScreenReader);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return isScreenReader;
}

/**
 * Color scheme preference
 */
export function useColorScheme(): 'light' | 'dark' | 'no-preference' {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const prefersLight = useMediaQuery('(prefers-color-scheme: light)');

  if (prefersDark) return 'dark';
  if (prefersLight) return 'light';
  return 'no-preference';
}

/**
 * Network information
 */
export interface NetworkInfo {
  effectiveType?: '2g' | '3g' | '4g' | 'slow-2g';
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
}

export function useNetworkInfo(): NetworkInfo {
  const [info, setInfo] = useState<NetworkInfo>({});

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const connection = (navigator as any).connection ||
                      (navigator as any).mozConnection ||
                      (navigator as any).webkitConnection;

    if (!connection) return;

    const updateInfo = () => {
      setInfo({
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData,
      });
    };

    updateInfo();
    connection.addEventListener('change', updateInfo);

    return () => connection.removeEventListener('change', updateInfo);
  }, []);

  return info;
}

/**
 * Battery status
 */
export interface BatteryInfo {
  level?: number;
  charging?: boolean;
  chargingTime?: number;
  dischargingTime?: number;
}

export function useBattery(): BatteryInfo {
  const [battery, setBattery] = useState<BatteryInfo>({});

  useEffect(() => {
    if (typeof navigator === 'undefined' || !(navigator as any).getBattery) return;

    (navigator as any).getBattery().then((batteryManager: any) => {
      const updateBattery = () => {
        setBattery({
          level: batteryManager.level,
          charging: batteryManager.charging,
          chargingTime: batteryManager.chargingTime,
          dischargingTime: batteryManager.dischargingTime,
        });
      };

      updateBattery();

      batteryManager.addEventListener('levelchange', updateBattery);
      batteryManager.addEventListener('chargingchange', updateBattery);
      batteryManager.addEventListener('chargingtimechange', updateBattery);
      batteryManager.addEventListener('dischargingtimechange', updateBattery);

      return () => {
        batteryManager.removeEventListener('levelchange', updateBattery);
        batteryManager.removeEventListener('chargingchange', updateBattery);
        batteryManager.removeEventListener('chargingtimechange', updateBattery);
        batteryManager.removeEventListener('dischargingtimechange', updateBattery);
      };
    });
  }, []);

  return battery;
}

/**
 * Hover capability detection
 */
export function useHoverCapability(): boolean {
  return useMediaQuery('(hover: hover) and (pointer: fine)');
}

/**
 * Pointer type detection
 */
export function usePointerType(): 'fine' | 'coarse' | 'none' {
  const isFine = useMediaQuery('(pointer: fine)');
  const isCoarse = useMediaQuery('(pointer: coarse)');

  if (isFine) return 'fine';
  if (isCoarse) return 'coarse';
  return 'none';
}
