/**
 * Tests for useAccordion hook
 */

import { renderHook, act } from '@testing-library/react';
import { useAccordion, useAccordionItem } from '../useAccordion';

describe('useAccordion', () => {
  it('should initialize with empty open items', () => {
    const { result } = renderHook(() => useAccordion());
    
    expect(result.current.openItems.size).toBe(0);
  });

  it('should initialize with default open items', () => {
    const { result } = renderHook(() => useAccordion({ 
      defaultOpenItems: ['item1', 'item2'] 
    }));
    
    expect(result.current.openItems.has('item1')).toBe(true);
    expect(result.current.openItems.has('item2')).toBe(true);
  });

  it('should toggle item', () => {
    const { result } = renderHook(() => useAccordion());
    
    act(() => {
      result.current.toggleItem('item1');
    });
    
    expect(result.current.isItemOpen('item1')).toBe(true);
    
    act(() => {
      result.current.toggleItem('item1');
    });
    
    expect(result.current.isItemOpen('item1')).toBe(false);
  });

  it('should open item', () => {
    const { result } = renderHook(() => useAccordion());
    
    act(() => {
      result.current.openItem('item1');
    });
    
    expect(result.current.isItemOpen('item1')).toBe(true);
  });

  it('should close item', () => {
    const { result } = renderHook(() => useAccordion({ 
      defaultOpenItems: ['item1'] 
    }));
    
    act(() => {
      result.current.closeItem('item1');
    });
    
    expect(result.current.isItemOpen('item1')).toBe(false);
  });

  it('should close all items', () => {
    const { result } = renderHook(() => useAccordion({ 
      defaultOpenItems: ['item1', 'item2'] 
    }));
    
    act(() => {
      result.current.closeAll();
    });
    
    expect(result.current.openItems.size).toBe(0);
  });

  it('should open all items when multiple allowed', () => {
    const { result } = renderHook(() => useAccordion({ allowMultiple: true }));
    
    act(() => {
      result.current.openAll(['item1', 'item2']);
    });
    
    expect(result.current.isItemOpen('item1')).toBe(true);
    expect(result.current.isItemOpen('item2')).toBe(true);
  });

  it('should only open first item when multiple not allowed', () => {
    const { result } = renderHook(() => useAccordion({ allowMultiple: false }));
    
    act(() => {
      result.current.openAll(['item1', 'item2']);
    });
    
    expect(result.current.isItemOpen('item1')).toBe(true);
    expect(result.current.isItemOpen('item2')).toBe(false);
  });

  it('should close other items when opening new item (single mode)', () => {
    const { result } = renderHook(() => useAccordion({ 
      allowMultiple: false,
      defaultOpenItems: ['item1'] 
    }));
    
    act(() => {
      result.current.openItem('item2');
    });
    
    expect(result.current.isItemOpen('item1')).toBe(false);
    expect(result.current.isItemOpen('item2')).toBe(true);
  });

  it('should keep other items open when opening new item (multiple mode)', () => {
    const { result } = renderHook(() => useAccordion({ 
      allowMultiple: true,
      defaultOpenItems: ['item1'] 
    }));
    
    act(() => {
      result.current.openItem('item2');
    });
    
    expect(result.current.isItemOpen('item1')).toBe(true);
    expect(result.current.isItemOpen('item2')).toBe(true);
  });
});

describe('useAccordionItem', () => {
  it('should return item-specific functions', () => {
    const accordion = renderHook(() => useAccordion()).result.current;
    const { result } = renderHook(() => useAccordionItem('item1', accordion));
    
    expect(typeof result.current.isOpen).toBe('boolean');
    expect(typeof result.current.toggle).toBe('function');
    expect(typeof result.current.open).toBe('function');
    expect(typeof result.current.close).toBe('function');
  });

  it('should reflect accordion state', () => {
    const accordion = renderHook(() => useAccordion()).result.current;
    const { result } = renderHook(() => useAccordionItem('item1', accordion));
    
    expect(result.current.isOpen).toBe(false);
    
    act(() => {
      accordion.openItem('item1');
    });
    
    expect(result.current.isOpen).toBe(true);
  });

  it('should control item through item functions', () => {
    const accordion = renderHook(() => useAccordion()).result.current;
    const { result } = renderHook(() => useAccordionItem('item1', accordion));
    
    act(() => {
      result.current.open();
    });
    
    expect(result.current.isOpen).toBe(true);
    
    act(() => {
      result.current.close();
    });
    
    expect(result.current.isOpen).toBe(false);
    
    act(() => {
      result.current.toggle();
    });
    
    expect(result.current.isOpen).toBe(true);
  });
});
