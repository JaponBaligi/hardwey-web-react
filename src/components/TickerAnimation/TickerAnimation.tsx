/**
 * TickerAnimation component for revenue streams
 * Replaces the original ticker animation with React implementation
 */

import React, { useEffect, useRef, useState } from 'react';
import { useContent } from '@/hooks/useContent';
import type { TickerSection as TickerContent } from '@/types/content';
import styles from './TickerAnimation.module.css';

interface TickerAnimationProps {
  className?: string;
  speed?: number;
  pauseOnHover?: boolean;
}

/**
 * Scrolling ticker animation displaying revenue streams
 * @param className - Additional CSS classes
 * @param speed - Animation speed multiplier (default: 2.5)
 * @param pauseOnHover - Whether to pause animation on hover (default: true)
 */
export const TickerAnimation: React.FC<TickerAnimationProps> = ({
  className = '',
  speed = 5.5,
  pauseOnHover = true,
}) => {
  const tickerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Default values for backward compatibility
  const defaultWords = ['Music', 'Shows', 'Merch', 'More'];
  const defaultBackgroundColor = '#bbdbfa';

  const { data: content } = useContent<TickerContent>('ticker', {
    backgroundColor: defaultBackgroundColor,
    tickerWords: defaultWords,
  });

  const revenueStreams = content?.tickerWords || defaultWords;
  const backgroundColor = content?.backgroundColor || defaultBackgroundColor;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (tickerRef.current) {
      observer.observe(tickerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || !trackRef.current) return;

    const track = trackRef.current;
    const trackWidth = track.scrollWidth;
    const containerWidth = track.parentElement?.offsetWidth || 0;
    
    // Calculate animation duration based on speed
    const duration = (trackWidth / containerWidth) * (20 / speed); // Base duration of 20s

    // Create CSS animation
    const keyframes = `
      @keyframes tickerScroll {
        0% {
          transform: translateX(0);
        }
        100% {
          transform: translateX(-${trackWidth / 2}px);
        }
      }
    `;

    // Remove existing style element
    const existingStyle = document.getElementById('ticker-animation-style');
    if (existingStyle) {
      existingStyle.remove();
    }

    // Add new style element
    const style = document.createElement('style');
    style.id = 'ticker-animation-style';
    style.textContent = keyframes;
    document.head.appendChild(style);

    // Apply animation
    track.style.animation = `tickerScroll ${duration}s linear infinite`;
    track.style.animationPlayState = isPaused ? 'paused' : 'running';

    return () => {
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, [isVisible, speed, isPaused]);

  const handleMouseEnter = () => {
    if (pauseOnHover) {
      setIsPaused(true);
    }
  };

  const handleMouseLeave = () => {
    if (pauseOnHover) {
      setIsPaused(false);
    }
  };

  // Duplicate the content for seamless loop
  const duplicatedStreams = [...revenueStreams, ...revenueStreams];

  return (
    <section
      ref={tickerRef}
      className={`${styles.sectionContainer} ${styles.sectionContainerTicker} ${className}`}
      style={{ backgroundColor }}
    >
      <div
        className={styles.tickerCamera}
        style={{ backgroundColor }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          ref={trackRef}
          className={`${styles.tickerTrack} ${isVisible ? styles.tickerTrackVisible : ''}`}
        >
          {duplicatedStreams.map((stream, index) => (
            <React.Fragment key={`${stream}-${index}`}>
              <h3 className={styles.tickerText}>
                {stream}
              </h3>
              {/* Add star after "More" instead of separator */}
              {stream === 'More' ? (
                <div className={styles.tickerStar}></div>
              ) : index < duplicatedStreams.length - 1 && (
                <div className={styles.tickerSeparator}>/</div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TickerAnimation;
