/**
 * FoundersSection component
 * Replaces the original founders section with React implementation
 */

import React, { useState, useRef, useEffect } from 'react';
import { FOUNDERS } from '@/utils/constants';
import type { Founder } from '@/types';
import styles from './FoundersSection.module.css';

interface FoundersSectionProps {
  className?: string;
  founders?: Founder[];
  autoPlay?: boolean;
}

/**
 * Founders section with founder information and mission statement
 * @param className - Additional CSS classes
 * @param founders - Array of founder items (defaults to FOUNDERS from constants)
 * @param autoPlay - Whether to auto-play animations
 */
export const FoundersSection: React.FC<FoundersSectionProps> = ({
  className = '',
  founders = FOUNDERS,
  autoPlay = true,
}) => {
  const [currentFounder, setCurrentFounder] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && autoPlay) {
          startAnimation();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [autoPlay]);

  const startAnimation = () => {
    setIsAnimating(true);
    // Reset animation after completion
    setTimeout(() => {
      setIsAnimating(false);
    }, 2000);
  };

  const handleFounderChange = (index: number) => {
    if (index !== currentFounder && !isAnimating) {
      setIsAnimating(true);
      setCurrentFounder(index);
      
      setTimeout(() => {
        setIsAnimating(false);
      }, 500);
    }
  };

  const handleImageLoad = () => {
    if (imageRef.current) {
      imageRef.current.style.opacity = '1';
    }
  };

  const handleImageError = () => {
    if (imageRef.current) {
      imageRef.current.style.opacity = '0.5';
    }
  };

  return (
    <section
      ref={sectionRef}
      id="founders"
      className={`${styles.sectionContainer} ${className}`}
    >
      {/* Section Divider */}
      <div className={styles.divider} />

      {/* Main Content */}
      <div className={`${styles.splitFlex} ${styles.splitFlexReversed}`}>
        {/* Founder Image */}
        <div className={styles.imageContainer}>
          <img
            ref={imageRef}
            src={founders[currentFounder]?.imageUrl}
            alt={founders[currentFounder]?.name}
            className={`${styles.imageFull} ${styles.imageFounder}`}
            loading="eager"
            sizes="(max-width: 991px) 98vw, 49vw"
            srcSet="/assets/banner/founder.jpg 500w, /assets/banner/founder.jpg 1080w, /assets/banner/founder.jpg 1610w"
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{ opacity: 0 }}
          />
          
          {/* Image Overlay */}
          <div className={styles.imageOverlay} />
          
          {/* Founder Navigation Dots */}
          {founders.length > 1 && (
            <div className={styles.founderDots}>
              {founders.map((_, index) => (
                <button
                  key={index}
                  className={`${styles.dot} ${index === currentFounder ? styles.dotActive : ''}`}
                  onClick={() => handleFounderChange(index)}
                  aria-label={`View ${founders[index]?.name}`}
                  type="button"
                />
              ))}
            </div>
          )}
        </div>

        {/* Text Content */}
        <div className={`${styles.splitColumn} ${styles.splitColumnText}`}>
          {/* Header */}
          <div className={styles.headerContainer}>
            <h2 className={styles.heading2}>
              {founders.length > 1 ? 'The Founders' : 'The Founder'}
            </h2>
            
            <div className={styles.missionFlex}>
              <div className={`${styles.subheading} ${styles.subheadingDesktop}`}>
                long
              </div>
              <div className={`${styles.subheading} ${styles.subheadingDesktop}`}>
                story
              </div>
              <div className={`${styles.subheading} ${styles.subheadingDesktop}`}>
                short
              </div>
              <div className={`${styles.subheading} ${styles.subheadingMobile}`}>
                Long story short
              </div>
            </div>
          </div>

          {/* Founder Content */}
          <div className={styles.contentContainer}>
            {/* Quote */}
            <div className={styles.quoteContainer}>
              <h4 className={styles.heading5}>
                "{founders[currentFounder]?.quote}" {founders[currentFounder]?.name?.toUpperCase()}
              </h4>
            </div>

            {/* Bio */}
            <p className={styles.bodyCopy}>
              {founders[currentFounder]?.bio}
            </p>

            {/* Additional Info */}
            {founders[currentFounder]?.additionalInfo && (
              <div className={styles.additionalInfo}>
                {founders[currentFounder]?.additionalInfo.map((info, index) => (
                  <p key={index} className={styles.additionalText}>
                    {info}
                  </p>
                ))}
              </div>
            )}

            {/* Founder Navigation */}
            {founders.length > 1 && (
              <div className={styles.founderNavigation}>
                <button
                  className={styles.navButton}
                  onClick={() => handleFounderChange(
                    currentFounder === 0 ? founders.length - 1 : currentFounder - 1
                  )}
                  disabled={isAnimating}
                  aria-label="Previous founder"
                  type="button"
                >
                  <span className={styles.navArrow}>←</span>
                </button>
                
                <div className={styles.founderInfo}>
                  <span className={styles.founderName}>
                    {founders[currentFounder]?.name}
                  </span>
                  <span className={styles.founderRole}>
                    {founders[currentFounder]?.role}
                  </span>
                </div>
                
                <button
                  className={styles.navButton}
                  onClick={() => handleFounderChange(
                    currentFounder === founders.length - 1 ? 0 : currentFounder + 1
                  )}
                  disabled={isAnimating}
                  aria-label="Next founder"
                  type="button"
                >
                  <span className={styles.navArrow}>→</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Background Elements */}
      <div className={styles.backgroundElements}>
        <div className={styles.gradientOverlay} />
        <div className={styles.patternOverlay} />
      </div>
    </section>
  );
};

export default FoundersSection;
