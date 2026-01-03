/**
 * Accessibility Utilities for Web & Mobile
 * 
 * Provides ARIA helpers and accessibility hooks
 */

import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * ARIA role types
 */
export type AriaRole = 
  | 'button' | 'link' | 'checkbox' | 'radio' | 'tab' | 'tabpanel'
  | 'dialog' | 'alertdialog' | 'menu' | 'menuitem' | 'navigation'
  | 'search' | 'form' | 'region' | 'article' | 'main' | 'complementary'
  | 'banner' | 'contentinfo' | 'list' | 'listitem';

/**
 * ARIA attributes builder
 */
export interface AriaAttributes {
  role?: AriaRole;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-expanded'?: boolean;
  'aria-selected'?: boolean;
  'aria-checked'?: boolean | 'mixed';
  'aria-disabled'?: boolean;
  'aria-hidden'?: boolean;
  'aria-live'?: 'off' | 'polite' | 'assertive';
  'aria-atomic'?: boolean;
  'aria-busy'?: boolean;
  'aria-controls'?: string;
  'aria-current'?: boolean | 'page' | 'step' | 'location' | 'date' | 'time';
  'aria-haspopup'?: boolean | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
  'aria-invalid'?: boolean;
  'aria-modal'?: boolean;
  'aria-orientation'?: 'horizontal' | 'vertical';
  'aria-pressed'?: boolean | 'mixed';
  'aria-readonly'?: boolean;
  'aria-required'?: boolean;
  'aria-valuemin'?: number;
  'aria-valuemax'?: number;
  'aria-valuenow'?: number;
  'aria-valuetext'?: string;
}

/**
 * Generate unique ID for accessibility
 */
let idCounter = 0;
export function generateId(prefix: string = 'a11y'): string {
  return `${prefix}-${++idCounter}`;
}

/**
 * Hook for generating stable IDs
 */
export function useId(prefix: string = 'a11y'): string {
  const idRef = useRef<string>();
  
  if (!idRef.current) {
    idRef.current = generateId(prefix);
  }
  
  return idRef.current;
}

/**
 * Hook for ARIA attributes
 */
export function useAriaAttributes(
  attributes: Partial<AriaAttributes>
): AriaAttributes {
  return attributes;
}

/**
 * Focus trap hook for modals/dialogs
 */
export function useFocusTrap(
  enabled: boolean = true,
  restoreFocus: boolean = true
) {
  const containerRef = useRef<HTMLElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!enabled) return;

    // Store previous focus
    if (restoreFocus) {
      previousFocusRef.current = document.activeElement as HTMLElement;
    }

    const container = containerRef.current;
    if (!container) return;

    // Get all focusable elements
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus first element
    firstElement?.focus();

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener('keydown', handleTab);

    return () => {
      container.removeEventListener('keydown', handleTab);
      
      // Restore focus
      if (restoreFocus && previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [enabled, restoreFocus]);

  return containerRef;
}

/**
 * Keyboard navigation hook
 */
export function useKeyboardNavigation(
  items: any[],
  options: {
    orientation?: 'horizontal' | 'vertical';
    loop?: boolean;
    onSelect?: (index: number) => void;
  } = {}
) {
  const { orientation = 'vertical', loop = true, onSelect } = options;
  const [activeIndex, setActiveIndex] = useState(0);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const keys = orientation === 'horizontal' 
      ? ['ArrowLeft', 'ArrowRight']
      : ['ArrowUp', 'ArrowDown'];

    const [prevKey, nextKey] = keys;

    if (e.key === prevKey) {
      e.preventDefault();
      setActiveIndex(prev => {
        const next = prev - 1;
        if (next < 0) return loop ? items.length - 1 : 0;
        return next;
      });
    } else if (e.key === nextKey) {
      e.preventDefault();
      setActiveIndex(prev => {
        const next = prev + 1;
        if (next >= items.length) return loop ? 0 : items.length - 1;
        return next;
      });
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActiveIndex(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setActiveIndex(items.length - 1);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect?.(activeIndex);
    }
  }, [orientation, loop, items.length, activeIndex, onSelect]);

  return { activeIndex, setActiveIndex, handleKeyDown };
}

/**
 * Screen reader announcement hook
 */
export function useAnnouncement() {
  const announcementRef = useRef<HTMLDivElement>(null);

  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (!announcementRef.current) {
      // Create announcement element
      const div = document.createElement('div');
      div.setAttribute('role', 'status');
      div.setAttribute('aria-live', priority);
      div.setAttribute('aria-atomic', 'true');
      div.className = 'sr-only';
      document.body.appendChild(div);
      announcementRef.current = div;
    }

    // Update message
    announcementRef.current.textContent = message;

    // Clear after announcement
    setTimeout(() => {
      if (announcementRef.current) {
        announcementRef.current.textContent = '';
      }
    }, 1000);
  }, []);

  useEffect(() => {
    return () => {
      if (announcementRef.current) {
        document.body.removeChild(announcementRef.current);
      }
    };
  }, []);

  return announce;
}

/**
 * Skip to content link helper
 */
export function SkipToContent({ contentId = 'main-content' }: { contentId?: string }) {
  return (
    <a
      href={`#${contentId}`}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded"
    >
      Skip to content
    </a>
  );
}

/**
 * Visually hidden but accessible to screen readers
 */
export function VisuallyHidden({ 
  children, 
  as: Component = 'span' 
}: { 
  children: React.ReactNode; 
  as?: keyof JSX.IntrinsicElements;
}) {
  return (
    <Component className="sr-only">
      {children}
    </Component>
  );
}

/**
 * Live region for dynamic content
 */
export function LiveRegion({
  children,
  priority = 'polite',
  atomic = true,
}: {
  children: React.ReactNode;
  priority?: 'off' | 'polite' | 'assertive';
  atomic?: boolean;
}) {
  return (
    <div
      role="status"
      aria-live={priority}
      aria-atomic={atomic}
      className="sr-only"
    >
      {children}
    </div>
  );
}

/**
 * Focus visible hook (keyboard vs mouse)
 */
export function useFocusVisible() {
  const [isFocusVisible, setIsFocusVisible] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);

  useEffect(() => {
    const handleMouseDown = () => setIsMouseDown(true);
    const handleMouseUp = () => setIsMouseDown(false);
    const handleFocus = () => {
      if (!isMouseDown) {
        setIsFocusVisible(true);
      }
    };
    const handleBlur = () => setIsFocusVisible(false);

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('focusin', handleFocus);
    window.addEventListener('focusout', handleBlur);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('focusin', handleFocus);
      window.removeEventListener('focusout', handleBlur);
    };
  }, [isMouseDown]);

  return isFocusVisible;
}

/**
 * Reduced motion hook
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}

/**
 * Color contrast checker
 */
export function getContrastRatio(color1: string, color2: string): number {
  const getLuminance = (color: string): number => {
    // Simple luminance calculation (would need proper implementation)
    // This is a placeholder
    return 0.5;
  };

  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * WCAG compliance checker
 */
export function isWCAGCompliant(
  contrastRatio: number,
  level: 'AA' | 'AAA',
  size: 'normal' | 'large' = 'normal'
): boolean {
  if (level === 'AAA') {
    return size === 'large' ? contrastRatio >= 4.5 : contrastRatio >= 7;
  }
  return size === 'large' ? contrastRatio >= 3 : contrastRatio >= 4.5;
}

/**
 * Heading level manager
 */
export function useHeadingLevel(startLevel: number = 1) {
  const [level, setLevel] = useState(startLevel);

  const increment = useCallback(() => {
    setLevel(prev => Math.min(prev + 1, 6));
  }, []);

  const decrement = useCallback(() => {
    setLevel(prev => Math.max(prev - 1, 1));
  }, []);

  const reset = useCallback(() => {
    setLevel(startLevel);
  }, [startLevel]);

  return { level, increment, decrement, reset };
}

/**
 * Roving tab index hook
 */
export function useRovingTabIndex(
  length: number,
  defaultIndex: number = 0
) {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);

  const getTabIndex = useCallback((index: number) => {
    return index === activeIndex ? 0 : -1;
  }, [activeIndex]);

  const setActive = useCallback((index: number) => {
    if (index >= 0 && index < length) {
      setActiveIndex(index);
    }
  }, [length]);

  return { activeIndex, getTabIndex, setActive };
}

/**
 * Dialog/Modal accessibility attributes
 */
export function getDialogAttributes(
  isOpen: boolean,
  titleId?: string,
  descriptionId?: string
): AriaAttributes {
  return {
    role: 'dialog',
    'aria-modal': true,
    'aria-hidden': !isOpen,
    'aria-labelledby': titleId,
    'aria-describedby': descriptionId,
  };
}

/**
 * Combobox accessibility attributes
 */
export function getComboboxAttributes(
  isExpanded: boolean,
  listboxId: string,
  activeDescendant?: string
): AriaAttributes {
  return {
    role: 'combobox',
    'aria-expanded': isExpanded,
    'aria-controls': listboxId,
    'aria-autocomplete': 'list',
    'aria-activedescendant': activeDescendant,
  };
}

/**
 * Tab accessibility attributes
 */
export function getTabAttributes(
  isSelected: boolean,
  panelId: string
): AriaAttributes {
  return {
    role: 'tab',
    'aria-selected': isSelected,
    'aria-controls': panelId,
    tabIndex: isSelected ? 0 : -1,
  } as any;
}

/**
 * Tab panel accessibility attributes
 */
export function getTabPanelAttributes(
  tabId: string,
  isHidden: boolean
): AriaAttributes {
  return {
    role: 'tabpanel',
    'aria-labelledby': tabId,
    'aria-hidden': isHidden,
    tabIndex: 0,
  } as any;
}
