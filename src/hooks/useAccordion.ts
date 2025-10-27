/**
 * useAccordion hook - Accordion state management
 * Replaces the original accordion JavaScript with React hook
 */

import { useState, useCallback } from 'react';

interface UseAccordionOptions {
  allowMultiple?: boolean;
  defaultOpenItems?: string[];
}

interface UseAccordionReturn {
  openItems: Set<string>;
  toggleItem: (itemId: string) => void;
  openItem: (itemId: string) => void;
  closeItem: (itemId: string) => void;
  closeAll: () => void;
  openAll: (itemIds: string[]) => void;
  isItemOpen: (itemId: string) => boolean;
}

/**
 * Hook for accordion state management
 * @param options - Accordion configuration options
 * @returns Accordion state and control functions
 * 
 * @example
 * ```tsx
 * const { openItems, toggleItem, isItemOpen } = useAccordion({
 *   allowMultiple: true,
 *   defaultOpenItems: ['item1'],
 * });
 * ```
 */
export function useAccordion(options: UseAccordionOptions = {}): UseAccordionReturn {
  const { allowMultiple = false, defaultOpenItems = [] } = options;
  
  const [openItems, setOpenItems] = useState<Set<string>>(
    new Set(defaultOpenItems)
  );

  const toggleItem = useCallback((itemId: string) => {
    setOpenItems(prev => {
      const newSet = new Set(prev);
      
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        if (!allowMultiple) {
          newSet.clear();
        }
        newSet.add(itemId);
      }
      
      return newSet;
    });
  }, [allowMultiple]);

  const openItem = useCallback((itemId: string) => {
    setOpenItems(prev => {
      const newSet = new Set(prev);
      
      if (!allowMultiple) {
        newSet.clear();
      }
      newSet.add(itemId);
      
      return newSet;
    });
  }, [allowMultiple]);

  const closeItem = useCallback((itemId: string) => {
    setOpenItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(itemId);
      return newSet;
    });
  }, []);

  const closeAll = useCallback(() => {
    setOpenItems(new Set());
  }, []);

  const openAll = useCallback((itemIds: string[]) => {
    if (allowMultiple) {
      setOpenItems(new Set(itemIds));
    } else if (itemIds.length > 0) {
      setOpenItems(new Set([itemIds[0]]));
    }
  }, [allowMultiple]);

  const isItemOpen = useCallback((itemId: string) => {
    return openItems.has(itemId);
  }, [openItems]);

  return {
    openItems,
    toggleItem,
    openItem,
    closeItem,
    closeAll,
    openAll,
    isItemOpen,
  };
}

/**
 * Hook for single accordion item
 * @param itemId - Unique identifier for the accordion item
 * @param accordion - Accordion instance from useAccordion
 * @returns Item-specific accordion functions
 */
export function useAccordionItem(
  itemId: string,
  accordion: UseAccordionReturn
) {
  const { toggleItem, openItem, closeItem, isItemOpen } = accordion;

  return {
    isOpen: isItemOpen(itemId),
    toggle: () => toggleItem(itemId),
    open: () => openItem(itemId),
    close: () => closeItem(itemId),
  };
}
