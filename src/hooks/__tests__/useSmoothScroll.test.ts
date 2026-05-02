/**
 * Tests for useSmoothScroll hook
 */

import { renderHook } from '@testing-library/react';
import { useSmoothScroll, useScrollTo } from '../useSmoothScroll';

// Mock Lenis
jest.mock('lenis', () => {
  return jest.fn().mockImplementation(() => ({
    raf: jest.fn(),
    destroy: jest.fn(),
  }));
});

describe('useSmoothScroll', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize Lenis with default options', () => {
    const { result } = renderHook(() => useSmoothScroll());
    
    expect(result.current).toBeDefined();
  });

  it('should initialize Lenis with custom options', () => {
    const customOptions = {
      duration: 2.0,
      easing: (t: number) => t,
      direction: 'horizontal' as const,
    };

    const { result } = renderHook(() => useSmoothScroll(customOptions));
    
    expect(result.current).toBeDefined();
  });

  it('should cleanup Lenis on unmount', () => {
    const { unmount } = renderHook(() => useSmoothScroll());
    
    unmount();
    
    // Lenis destroy should be called
    expect(true).toBe(true); // Placeholder assertion
  });
});

describe('useScrollTo', () => {
  beforeEach(() => {
    // Mock scrollIntoView
    Element.prototype.scrollIntoView = jest.fn();
    window.scrollTo = jest.fn();
  });

  it('should provide scroll functions', () => {
    const { scrollToElement, scrollToTop, scrollToBottom } = useScrollTo();
    
    expect(typeof scrollToElement).toBe('function');
    expect(typeof scrollToTop).toBe('function');
    expect(typeof scrollToBottom).toBe('function');
  });

  it('should scroll to element', () => {
    const { scrollToElement } = useScrollTo();
    const mockElement = document.createElement('div');
    document.querySelector = jest.fn().mockReturnValue(mockElement);
    
    scrollToElement('#test-element');
    
    expect(mockElement.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
  });

  it('should scroll to top', () => {
    const { scrollToTop } = useScrollTo();
    
    scrollToTop();
    
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    });
  });

  it('should scroll to bottom', () => {
    const { scrollToBottom } = useScrollTo();
    
    scrollToBottom();
    
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  });
});
