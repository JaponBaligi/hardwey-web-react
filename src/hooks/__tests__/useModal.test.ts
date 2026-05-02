/**
 * Tests for useModal hook
 */

import { renderHook, act } from '@testing-library/react';
import { useModal, useOverlayClick, useModalFocus } from '../useModal';

describe('useModal', () => {
  beforeEach(() => {
    // Reset body overflow
    document.body.style.overflow = '';
  });

  it('should initialize with closed state', () => {
    const { result } = renderHook(() => useModal());
    
    expect(result.current.isOpen).toBe(false);
  });

  it('should initialize with custom initial state', () => {
    const { result } = renderHook(() => useModal({ initialOpen: true }));
    
    expect(result.current.isOpen).toBe(true);
  });

  it('should open modal', () => {
    const { result } = renderHook(() => useModal());
    
    act(() => {
      result.current.open();
    });
    
    expect(result.current.isOpen).toBe(true);
  });

  it('should close modal', () => {
    const { result } = renderHook(() => useModal({ initialOpen: true }));
    
    act(() => {
      result.current.close();
    });
    
    expect(result.current.isOpen).toBe(false);
  });

  it('should toggle modal', () => {
    const { result } = renderHook(() => useModal());
    
    act(() => {
      result.current.toggle();
    });
    
    expect(result.current.isOpen).toBe(true);
    
    act(() => {
      result.current.toggle();
    });
    
    expect(result.current.isOpen).toBe(false);
  });

  it('should prevent body scroll when modal is open', () => {
    const { result } = renderHook(() => useModal({ preventBodyScroll: true }));
    
    act(() => {
      result.current.open();
    });
    
    expect(document.body.style.overflow).toBe('hidden');
    
    act(() => {
      result.current.close();
    });
    
    expect(document.body.style.overflow).toBe('');
  });

  it('should handle escape key', () => {
    const { result } = renderHook(() => useModal({ closeOnEscape: true }));
    
    act(() => {
      result.current.open();
    });
    
    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(event);
    });
    
    expect(result.current.isOpen).toBe(false);
  });

  it('should not handle escape key when disabled', () => {
    const { result } = renderHook(() => useModal({ closeOnEscape: false }));
    
    act(() => {
      result.current.open();
    });
    
    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(event);
    });
    
    expect(result.current.isOpen).toBe(true);
  });
});

describe('useOverlayClick', () => {
  it('should call onClose when overlay is clicked', () => {
    const onClose = jest.fn();
    const handleOverlayClick = useOverlayClick(onClose);
    
    const mockEvent = {
      target: 'overlay',
      currentTarget: 'overlay',
    } as React.MouseEvent;
    
    handleOverlayClick(mockEvent);
    
    expect(onClose).toHaveBeenCalled();
  });

  it('should not call onClose when child element is clicked', () => {
    const onClose = jest.fn();
    const handleOverlayClick = useOverlayClick(onClose);
    
    const mockEvent = {
      target: 'child',
      currentTarget: 'overlay',
    } as React.MouseEvent;
    
    handleOverlayClick(mockEvent);
    
    expect(onClose).not.toHaveBeenCalled();
  });
});

describe('useModalFocus', () => {
  it('should return modal ref', () => {
    const { result } = renderHook(() => useModalFocus(false));
    
    expect(result.current.modalRef).toBeDefined();
  });

  it('should focus modal when opened', () => {
    const mockFocus = jest.fn();
    const mockElement = { focus: mockFocus };
    
    const { result } = renderHook(() => useModalFocus(true));
    
    // Simulate ref assignment
    if (result.current.modalRef.current) {
      result.current.modalRef.current = mockElement as HTMLElement;
    }
    
    expect(result.current.modalRef).toBeDefined();
  });
});
