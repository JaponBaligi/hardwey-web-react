/**
 * HeroSection component - EXACT copy of static HTML structure
 * Recreates the original hero section with pixel-perfect accuracy
 */

import React, { useEffect, useRef } from 'react';
import styles from './HeroSection.module.css';

interface HeroSectionProps {
  className?: string;
}

/**
 * Hero section with exact HTML structure from static site
 * @param className - Additional CSS classes
 */
export const HeroSection: React.FC<HeroSectionProps> = ({ className = '' }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const backgroundRef = useRef<HTMLImageElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Animation trigger can be added here if needed
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Scroll-based parallax animation
  useEffect(() => {
    // Skip parallax/blur effects on mobile for performance
    const isMobile = window.innerWidth <= 767;
    if (isMobile) return;

    let hasInitialAnimationPlayed = false;
    
    // Wait for initial zoom animation to complete (3s)
    const animationTimer = setTimeout(() => {
      hasInitialAnimationPlayed = true;
    }, 3000);

    const handleScroll = () => {
      if (!backgroundRef.current || !logoRef.current || !hasInitialAnimationPlayed) return;

      const scrolled = window.pageYOffset;
      const sectionHeight = sectionRef.current?.offsetHeight || window.innerHeight;
      
      // Only apply parallax when hero is visible
      if (scrolled < sectionHeight) {
        const parallaxSpeed = 0.3;
        const logoSpeed = 0.005;// Reduced from 0.15 for subtler movement
        
        // Calculate blur progress (0 to 1) based on scroll position
        const scrollProgress = Math.min(scrolled / sectionHeight, 1);
        const maxBlur = 8; // Maximum blur in pixels
        const blurAmount = scrollProgress * maxBlur;

        // Apply parallax to background image
        if (backgroundRef.current) {
          const offset = scrolled * parallaxSpeed;
          backgroundRef.current.style.transform = `translate3d(0, ${offset}px, 0) scale3d(1, 1, 1)`;
          backgroundRef.current.style.filter = `blur(${blurAmount}px)`;
        }

        // Subtle parallax to logo (moves slower than background for depth)
        if (logoRef.current) {
          const logoOffset = scrolled * logoSpeed;
          logoRef.current.style.transform = `translate3d(0, ${logoOffset}px, 0)`;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      clearTimeout(animationTimer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hardwey"
      className={`${styles.heroSection} ${className}`}
    >
      {/* Hero Logo Div */}
      <div ref={logoRef} className={styles.heroLogoDiv}>
        <img 
          src="/assets/img/hardweybannertext.png" 
          loading="lazy" 
          alt="Hardwey LOGO" 
          className={styles.heroLogo}
        />
      </div>

      {/* Hero Base Container */}
      <div className={styles.heroBaseContainer}>
        {/* Outer Identifiers */}
        <img 
          src="/assets/svg/investident-hero.svg" 
          loading="lazy" 
          alt="" 
          className={`${styles.outerIdent} ${styles.outerIdentLeft}`}
        />
        <img 
          src="/assets/svg/barcode-ident.svg" 
          loading="lazy" 
          alt="" 
          className={styles.outerIdent}
        />

        {/* Mobile MITA Text */}
        <h2 className={`${styles.mitaHeroText} ${styles.mitaHeroTextMobile}`}>
          Music is the answer™
        </h2>

        {/* Hero Idents Flex */}
        <div className={styles.heroIdentsFlex}>
          <img 
            src="/assets/svg/new-wave24.svg" 
            loading="lazy" 
            alt="" 
            className={`${styles.motif} ${styles.motif2k23}`}
          />
          <img 
            src="/assets/svg/restricted-change-ident.svg" 
            loading="lazy" 
            alt="" 
            className={`${styles.motif} ${styles.motifRestricted}`}
          />
          
          {/* Desktop MITA Text */}
          <h2 className={`${styles.mitaHeroText} ${styles.mitaHeroTextDesktop}`}>
            Music is the answer™
          </h2>
          
          <img 
            src="/assets/svg/international-blue.svg" 
            loading="lazy" 
            alt="" 
            className={`${styles.motif} ${styles.motifGlobal}`}
          />
          <img 
            src="/assets/svg/hardweyrights.svg" 
            loading="lazy" 
            alt="" 
            className={`${styles.motif} ${styles.motifRights}`}
          />
          <img 
            src="/assets/svg/star-ident-blue.svg" 
            loading="lazy" 
            alt="" 
            className={`${styles.motif} ${styles.motifStars}`}
          />
        </div>

        {/* Fixed Width Text Container */}
        <div className={`${styles.fixedWidthTextContainer} ${styles.fixedWidthTextContainerHh}`}>
          <h5 className={`${styles.bodyCaps} ${styles.bodyCapsBlue}`}>
            A movement in music. Redefining the rules.
          </h5>
        </div>
      </div>

      {/* Hero Overlay */}
      <div className={styles.heroOverlay}></div>

      {/* Background Image */}
      <img 
        ref={backgroundRef}
        src="/assets/banner/artistlarge1.jpg" 
        loading="lazy" 
        sizes="100vw" 
        alt="" 
        srcSet="/assets/banner/artistlarge%201-p-500.jpg 500w, /assets/banner/artistlarge1-p-800.jpg 800w, /assets/banner/artistlarge1-p-1080.jpg 1080w, /assets/banner/artistlarge1-p-1600.jpg 1600w, /assets/banner/artistlarge1-p-2000.jpg 2000w, /assets/banner/artistlarge1.jpg 2457w" 
        className={styles.image}
      />
    </section>
  );
};

export default HeroSection;