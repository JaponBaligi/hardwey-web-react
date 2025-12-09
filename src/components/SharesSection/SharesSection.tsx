/**
 * SharesSection component - EXACT copy of static HTML structure
 * Recreates the original shares section with pixel-perfect accuracy
 */

import React, { useEffect, useRef, useState } from 'react';
import { useContent } from '@/hooks/useContent';
import type { SharesSection as SharesContent } from '@/types/content';
import styles from './SharesSection.module.css';

interface SharesSectionProps {
  className?: string;
}

// Helper function to resolve content values with defaults
function resolveSharesContent(content: SharesContent | null | undefined) {
  const defaultImageUrl = '/assets/img/BUY%20SHARES%20IMAGE.jpg';
  const defaultImageSrcSet = '/assets/img/shares-500.jpg 500w, /assets/img/shares-800.jpg 800w, /assets/img/shares-800.jpg 1080w, /assets/img/BUY%20SHARES%20IMAGE.jpg 1440w';
  const defaultSubheadingWords = ['A new way', 'to', 'Invest'];

  return {
    heading: content?.heading || "Buy shares in artists' brands",
    subheadingMobile: content?.subheadingMobile || 'A new way to invest',
    subheadingWords: content?.subheadingWords || defaultSubheadingWords,
    bodyCopy: content?.bodyCopy || "Artists build brands that generate revenue from their music, shows, merch and more. HARDWEY is the first app that allows you to invest in those brands and own a piece of their success.",
    imageUrl: content?.imageUrl || defaultImageUrl,
    imageSrcSet: content?.imageSrcSet || defaultImageSrcSet,
  };
}

/**
 * Shares section with exact HTML structure from static site
 * @param className - Additional CSS classes
 */
export const SharesSection: React.FC<SharesSectionProps> = ({ className = '' }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isAnimated, setIsAnimated] = useState(false);

  // Default values matching current hardcoded content for backward compatibility
  const defaultImageUrl = '/assets/img/BUY%20SHARES%20IMAGE.jpg';
  const defaultImageSrcSet = '/assets/img/shares-500.jpg 500w, /assets/img/shares-800.jpg 800w, /assets/img/shares-800.jpg 1080w, /assets/img/BUY%20SHARES%20IMAGE.jpg 1440w';
  const defaultSubheadingWords = ['A new way', 'to', 'Invest'];

  const { data: content } = useContent<SharesContent>('shares', {
    heading: "Buy shares in artists' brands",
    subheadingMobile: 'A new way to invest',
    subheadingWords: defaultSubheadingWords,
    bodyCopy: "Artists build brands that generate revenue from their music, shows, merch and more. HARDWEY is the first app that allows you to invest in those brands and own a piece of their success.",
    imageUrl: defaultImageUrl,
    imageSrcSet: defaultImageSrcSet,
  });

  const resolvedContent = resolveSharesContent(content);

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
          src={resolvedContent.imageUrl} 
          loading="eager" 
          sizes="(max-width: 991px) 98vw, 49vw" 
          srcSet={resolvedContent.imageSrcSet} 
          alt="" 
          className={`${styles.imageFull} ${styles.imageFullIntro}`}
        />

        {/* Split Column Text */}
        <div className={`${styles.splitColumn} ${styles.splitColumnTxt}`}>
          <div className={styles.divBlock4}>
            <h2 className={`${styles.heading2} ${styles.heading2Brands}`}>
              {resolvedContent.heading}
            </h2>
            
            {/* Intro Sub Flex Inline */}
            <div className={`${styles.introSubFlex} ${styles.introSubFlexInline} ${isAnimated ? styles.introSubFlexAnimated : styles.introSubFlexInitial}`}>
              <div className={`${styles.subheading} ${styles.subheadingMobile}`}>
                {resolvedContent.subheadingMobile}
              </div>
              {resolvedContent.subheadingWords.length > 0 && (
                <div className={`${styles.subheading} ${styles.subheadingLeft} ${isAnimated ? styles.subheadingLeftAnimated : styles.subheadingLeftInitial}`}>
                  {resolvedContent.subheadingWords[0]}
                </div>
              )}
              {resolvedContent.subheadingWords.length > 1 && (
                <div className={`${styles.subheading} ${styles.subheadingDesktop}`}>
                  {resolvedContent.subheadingWords[1]}
                </div>
              )}
              {resolvedContent.subheadingWords.length > 2 && (
                <div className={`${styles.subheading} ${styles.subheadingRight} ${isAnimated ? styles.subheadingRightAnimated : styles.subheadingRightInitial}`}>
                  {resolvedContent.subheadingWords[2]}
                </div>
              )}
            </div>
          </div>

          {/* Body Copy */}
          <p className={`${styles.bodyCopy} ${styles.bodyCopyLeft}`}>
            {resolvedContent.bodyCopy}
          </p>
        </div>
      </div>
    </section>
  );
};

export default SharesSection;