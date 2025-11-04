/**
 * WebGLAnimation component - Secure WebGL animation wrapper
 * Replaces the original inline WebGL script with React component
 */

import { useEffect, useRef, useState } from 'react';
import { features } from '@/utils/env';

interface WebGLAnimationProps {
  className?: string;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

/**
 * WebGL animation component with security hardening
 * @param className - Additional CSS classes
 * @param onLoad - Callback when animation loads
 * @param onError - Callback when animation fails
 * 
 * @example
 * ```tsx
 * <WebGLAnimation 
 *   onLoad={() => console.log('Animation loaded')}
 *   onError={(error) => console.error('Animation failed:', error)}
 * />
 * ```
 */
export function WebGLAnimation({ className = '', onLoad, onError }: WebGLAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!features.webglAnimation) {
      return;
    }

    // Security check: Ensure HTTPS
    if (window.location.protocol !== 'https:' && !window.location.hostname.includes('localhost')) {
      const error = new Error('WebGL animation requires HTTPS in production');
      setError(error);
      onError?.(error);
      return;
    }

    // Security check: Verify WebGL support
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      const error = new Error('WebGL not supported');
      setError(error);
      onError?.(error);
      return;
    }

    // Load WebGL animation script
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/gh/kujira22/kujira_webgl@main/Mita/22/app.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    
    // Add integrity check when available
    // script.integrity = 'sha384-...';
    
    script.onload = () => {
      setIsLoaded(true);
      onLoad?.();
    };
    
    script.onerror = () => {
      const error = new Error('Failed to load WebGL animation script');
      setError(error);
      onError?.(error);
    };

    if (containerRef.current) {
      containerRef.current.appendChild(script);
    }

    // Cleanup
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [onLoad, onError]);

  if (!features.webglAnimation) {
    return null;
  }

  if (error) {
    return (
      <div className={`webgl-error ${className}`}>
        <p>WebGL animation unavailable</p>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`webgl-animation ${className}`}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
      }}
    >
      {!isLoaded && (
        <div className="webgl-loading">
          <p>Loading animation...</p>
        </div>
      )}
    </div>
  );
}

export default WebGLAnimation;
