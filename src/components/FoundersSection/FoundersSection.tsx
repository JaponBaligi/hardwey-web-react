/**
 * FoundersSection component
 * Replaces the original founders section with React implementation
 */

import React, { useState, useRef, useEffect } from 'react';
import { FOUNDERS } from '@/utils/constants';
import { useContent } from '@/hooks/useContent';
import type { Founder } from '@/types';
import type { FoundersSectionType } from '@/types/content';
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
  founders: propsFounders,
  autoPlay = true,
}) => {
  const [currentFounder, setCurrentFounder] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isTextAnimated, setIsTextAnimated] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const defaultFounders = FOUNDERS.map(f => ({
    id: f.id,
    name: f.name,
    role: f.role,
    bio: f.bio,
    quote: f.quote,
    imageUrl: f.imageUrl,
    imageSrcSet: '/assets/banner/founder.jpg 500w, /assets/banner/founder.jpg 1080w, /assets/banner/founder.jpg 1610w',
    additionalInfo: f.additionalInfo ? [...f.additionalInfo] : [],
  }));

  const { data: content } = useContent<FoundersSectionType>('founders', {
    founders: defaultFounders,
    heading: 'The Founders',
    headingSingular: 'The Founder',
    animatedWords: ['long', 'story', 'short'],
    animatedTextMobile: 'Long story short',
  });

  // Convert FounderItem[] to Founder[] format for component compatibility
  const cmsFounders: Founder[] | undefined = content?.founders?.map(f => ({
    id: f.id || `founder-${Date.now()}`,
    name: f.name,
    role: f.role,
    bio: f.bio,
    quote: f.quote,
    imageUrl: f.imageUrl,
    additionalInfo: f.additionalInfo || [],
  }));

  const founders = propsFounders || cmsFounders || FOUNDERS;
  const heading = founders.length > 1 
    ? (content?.heading || 'The Founders')
    : (content?.headingSingular || 'The Founder');
  const animatedWords = content?.animatedWords || ['long', 'story', 'short'];
  const animatedTextMobile = content?.animatedTextMobile || 'Long story short';
  
  // Get current founder's imageSrcSet if available
  const currentFounderData = content?.founders?.[currentFounder];
  const imageSrcSet = currentFounderData?.imageSrcSet || '/assets/banner/founder.jpg 500w, /assets/banner/founder.jpg 1080w, /assets/banner/founder.jpg 1610w';

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (autoPlay) {
            startAnimation();
          }
          setIsTextAnimated(true);
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
            srcSet={imageSrcSet}
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
              {heading}
            </h2>
            
            <div className={`${styles.missionFlex} ${isTextAnimated ? styles.missionFlexAnimated : styles.missionFlexInitial}`}>
              {animatedWords.length > 0 && (
                <>
                  <div className={`${styles.subheading} ${styles.subheadingDesktop} ${styles.subheadingLeft} ${isTextAnimated ? styles.subheadingLeftAnimated : styles.subheadingLeftInitial}`}>
                    {animatedWords[0]}
                  </div>
                  {animatedWords.length > 1 && (
                    <div className={`${styles.subheading} ${styles.subheadingDesktop}`}>
                      {animatedWords[1]}
                    </div>
                  )}
                  {animatedWords.length > 2 && (
                    <div className={`${styles.subheading} ${styles.subheadingDesktop} ${styles.subheadingRight} ${isTextAnimated ? styles.subheadingRightAnimated : styles.subheadingRightInitial}`}>
                      {animatedWords[2]}
                    </div>
                  )}
                </>
              )}
              <div className={`${styles.subheading} ${styles.subheadingMobile}`}>
                {animatedTextMobile}
              </div>
            </div>
          </div>

          {/* Founder Content */}
          <div className={styles.contentContainer}>
            {/* Quote */}
            <div className={styles.quoteContainer}>
              <h4 className={styles.heading5}>
                "{founders[currentFounder]?.quote}"
              </h4>
              <div className={styles.founderNameLarge}>
                {founders[currentFounder]?.name?.toUpperCase()}
              </div>
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
