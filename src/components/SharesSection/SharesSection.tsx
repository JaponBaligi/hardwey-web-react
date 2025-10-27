/**
 * SharesSection component - EXACT copy of static HTML structure
 * Recreates the original shares section with pixel-perfect accuracy
 */

import React, { useEffect, useRef, useState } from 'react';
import styles from './SharesSection.module.css';

interface SharesSectionProps {
  className?: string;
}

/**
 * Shares section with exact HTML structure from static site
 * @param className - Additional CSS classes
 */
export const SharesSection: React.FC<SharesSectionProps> = ({ className = '' }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsAnimated(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`${styles.sectionContainer} ${className}`}
    >
      {/* Divider */}
      <div className={styles.divider}></div>

      {/* Split Flex */}
      <div className={styles.splitFlex}>
        {/* Image */}
        <img 
          src="/assets/img/BUY%20SHARES%20IMAGE.jpg" 
          loading="eager" 
          sizes="(max-width: 991px) 98vw, 49vw" 
          srcSet="/assets/img/shares-500.jpg 500w, /assets/img/shares-800.jpg 800w, /assets/img/shares-800.jpg 1080w, /assets/img/BUY%20SHARES%20IMAGE.jpg 1440w" 
          alt="" 
          className={`${styles.imageFull} ${styles.imageFullIntro}`}
        />

        {/* Split Column Text */}
        <div className={`${styles.splitColumn} ${styles.splitColumnTxt}`}>
          <div className={styles.divBlock4}>
            <h2 className={`${styles.heading2} ${styles.heading2Brands}`}>
              Buy shares in artists' brands
            </h2>
            
            {/* Intro Sub Flex Inline */}
            <div className={`${styles.introSubFlex} ${styles.introSubFlexInline} ${isAnimated ? styles.introSubFlexAnimated : styles.introSubFlexInitial}`}>
              <div className={`${styles.subheading} ${styles.subheadingMobile}`}>
                A new way to invest
              </div>
              <div className={`${styles.subheading} ${styles.subheadingLeft} ${isAnimated ? styles.subheadingLeftAnimated : styles.subheadingLeftInitial}`}>
                A new way
              </div>
              <div className={`${styles.subheading} ${styles.subheadingDesktop}`}>
                to
              </div>
              <div className={`${styles.subheading} ${styles.subheadingRight} ${isAnimated ? styles.subheadingRightAnimated : styles.subheadingRightInitial}`}>
                Invest
              </div>
            </div>
          </div>

          {/* Body Copy */}
          <p className={`${styles.bodyCopy} ${styles.bodyCopyLeft}`}>
            Artists build brands that generate revenue from their music, shows, merch and more. HARDWEY is the first app that allows you to invest in those brands and own a piece of their success.
          </p>
        </div>
      </div>
    </section>
  );
};

export default SharesSection;