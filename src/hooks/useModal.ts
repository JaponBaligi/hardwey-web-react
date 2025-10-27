/**
 * useModal hook - Modal state management
 * Replaces the original modal JavaScript with React hook
 */

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseModalOptions {
  closeOnEscape?: boolean;
  closeOnOverlayClick?: boolean;
  preventBodyScroll?: boolean;
  initialOpen?: boolean;
}

interface UseModalReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

/**
 * Hook for modal state management
 * @param options - Modal configuration options
 * @returns Modal state and control functions
 * 
 * @example
 * ```tsx
 * const { isOpen, open, close, toggle } = useModal({
 *   closeOnEscape: true,
 *   closeOnOverlayClick: true,
 *   preventBodyScroll: true,
 * });
 * ```
 */
export function useModal(options: UseModalOptions = {}): UseModalReturn {
  const {
    closeOnEscape = true,
    preventBodyScroll = true,
    initialOpen = false,
  } = options;

  const [isOpen, setIsOpen] = useState(initialOpen);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  // Handle escape key
  useEffect(() => {
    if (!closeOnEscape || !isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [closeOnEscape, isOpen, close]);

  // Handle body scroll
  useEffect(() => {
    if (!preventBodyScroll) return;

    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [preventBodyScroll, isOpen]);

  return {
    isOpen,
    open,
    close,
    toggle,
  };
}

/**
 * Hook for overlay click handling
 * @param onClose - Function to call when overlay is clicked
 * @returns Click handler for overlay
 */
export function useOverlayClick(onClose: () => void) {
  const handleOverlayClick = useCallback((event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }, [onClose]);

  return handleOverlayClick;
}

/**
 * Hook for focus management in modals
 * @param isOpen - Whether modal is open
 * @returns Focus management functions
 */
export function useModalFocus(isOpen: boolean) {
  const modalRef = useRef<HTMLElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Store the currently focused element
    previousActiveElement.current = document.activeElement as HTMLElement;

    // Focus the modal
    if (modalRef.current) {
      modalRef.current.focus();
    }

    // Return focus when modal closes
    return () => {
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen]);

  return { modalRef };
}
