/**
 * RevenueStreamsSection component
 * Matches the revenue streams section from live site
 */

import React, { useEffect, useRef, useState } from 'react';
import styles from './RevenueStreamsSection.module.css';

interface RevenueStreamsSectionProps {
  className?: string;
}

/**
 * Revenue streams section showing Music/Shows/merch/more
 * @param className - Additional CSS classes
 */
export const RevenueStreamsSection: React.FC<RevenueStreamsSectionProps> = ({ className = '' }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const streams = [
    { id: 'music', label: 'Music' },
    { id: 'shows', label: 'Shows' },
    { id: 'merch', label: 'merch' },
    { id: 'more', label: 'more' },
  ];

  return (
    <section
      ref={sectionRef}
      id="revenue-streams"
      className={`${styles.revenueStreamsSection} ${className}`}
    >
      <div className={styles.container}>
        {/* Main Content */}
        <div className={styles.content}>
          {/* Main Heading */}
          <h2 className={`${styles.mainHeading} ${isVisible ? styles.mainHeadingVisible : ''}`}>
            Buy shares in artists' brands
          </h2>

          {/* Subtitle */}
          <div className={`${styles.subtitle} ${isVisible ? styles.subtitleVisible : ''}`}>
            <span className={styles.subtitleText}>A new way</span>
            <span className={styles.subtitleText}>to</span>
            <span className={styles.subtitleText}>Invest</span>
          </div>

          {/* Description */}
          <p className={`${styles.description} ${isVisible ? styles.descriptionVisible : ''}`}>
            Artists build brands that generate revenue from their music, shows, merch and more. 
            HARDWEY is the first app that allows you to invest in those brands and own a piece of their success.
          </p>

          {/* Revenue Streams */}
          <div className={`${styles.streamsContainer} ${isVisible ? styles.streamsContainerVisible : ''}`}>
            {streams.map((stream, index) => (
              <div key={stream.id} className={styles.streamItem}>
                <h3 className={styles.streamLabel}>{stream.label}</h3>
                {index < streams.length - 1 && (
                  <span className={styles.separator}>/</span>
                )}
              </div>
            ))}
          </div>

          {/* Duplicate streams for visual effect */}
          <div className={`${styles.streamsContainer} ${styles.streamsDuplicate} ${isVisible ? styles.streamsContainerVisible : ''}`}>
            {streams.slice(0, 3).map((stream, index) => (
              <div key={`duplicate-${stream.id}`} className={styles.streamItem}>
                <h3 className={styles.streamLabel}>{stream.label}</h3>
                {index < 2 && (
                  <span className={styles.separator}>/</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RevenueStreamsSection;
