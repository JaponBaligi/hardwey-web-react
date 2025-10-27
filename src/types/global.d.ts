/**
 * Global type declarations for HARDWEY Music Group
 * Extends global interfaces with third-party library types
 */

// Google Analytics gtag
declare global {
  interface Window {
    gtag?: (
      command: 'consent' | 'event' | 'config',
      action: string,
      parameters?: Record<string, unknown>
    ) => void;
  }
}

// Export empty object to make this a module
export {};
