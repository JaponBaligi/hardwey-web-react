/**
 * useSmoothScroll hook - Lenis smooth scroll integration
 * Replaces the original Lenis inline script with React hook
 */

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

interface UseSmoothScrollOptions {
  duration?: number;
  easing?: (t: number) => number;
  direction?: 'vertical' | 'horizontal';
  gestureDirection?: 'vertical' | 'horizontal' | 'both';
  smooth?: boolean;
  mouseMultiplier?: number;
  smoothTouch?: boolean;
  touchMultiplier?: number;
  infinite?: boolean;
}

/**
 * Hook for smooth scrolling using Lenis library
 * @param options - Lenis configuration options
 * @returns Lenis instance for manual control
 * 
 * @example
 * ```tsx
 * const lenis = useSmoothScroll({
 *   duration: 1.2,
 *   easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
 *   direction: 'vertical',
 *   gestureDirection: 'vertical',
 *   smooth: true,
 *   mouseMultiplier: 1,
 *   smoothTouch: false,
 *   touchMultiplier: 2,
 *   infinite: false,
 * });
 * ```
 */
export function useSmoothScroll(options: UseSmoothScrollOptions = {}): Lenis | null {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize Lenis with default options
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
      ...options,
    });

    lenisRef.current = lenis;

    // Animation frame loop
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Cleanup
    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [options]);

  return lenisRef.current;
}

/**
 * Hook for smooth scroll to specific element
 * @param lenis - Lenis instance from useSmoothScroll
 * @returns Function to scroll to element
 */
export function useScrollTo() {
  const scrollToElement = (selector: string | HTMLElement) => {
    const element = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  return {
    scrollToElement,
    scrollToTop,
    scrollToBottom,
  };
}
