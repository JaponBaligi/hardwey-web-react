import React, { useEffect, useRef } from 'react';
import { useContent } from '@/hooks/useContent';
import type { HeroSection as HeroContent } from '@/types/content';
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

  // Default values matching current hardcoded content for backward compatibility
  const defaultLogo = '/assets/img/hardweybannertext.png';
  const defaultBackgroundImage = '/assets/banner/artistlarge1.jpg';
  const defaultBackgroundImageSrcSet = '/assets/banner/artistlarge%201-p-500.jpg 500w, /assets/banner/artistlarge1-p-800.jpg 800w, /assets/banner/artistlarge1-p-1080.jpg 1080w, /assets/banner/artistlarge1-p-1600.jpg 1600w, /assets/banner/artistlarge1-p-2000.jpg 2000w, /assets/banner/artistlarge1.jpg 2457w';
  const defaultMotifs = [
    '/assets/svg/new-wave24.svg',
    '/assets/svg/restricted-change-ident.svg',
    '/assets/svg/international-blue.svg',
    '/assets/svg/hardweyrights.svg',
    '/assets/svg/star-ident-blue.svg'
  ];

  const { data: content } = useContent<HeroContent>('hero', {
    logoUrl: defaultLogo,
    backgroundImage: defaultBackgroundImage,
    backgroundImageSrcSet: defaultBackgroundImageSrcSet,
    mitaText: 'Music is the answer™',
    subtitle: 'A movement in music. Redefining the rules.',
    leftIdentifier: '/assets/svg/investident-hero.svg',
    rightIdentifier: '/assets/svg/barcode-ident.svg',
    motifs: defaultMotifs,
  });

  const logoUrl = content?.logoUrl || defaultLogo;
  const backgroundImage = content?.backgroundImage || defaultBackgroundImage;
  const backgroundImageSrcSet = content?.backgroundImageSrcSet || defaultBackgroundImageSrcSet;
  const mitaText = content?.mitaText || 'Music is the answer™';
  const subtitle = content?.subtitle || 'A movement in music. Redefining the rules.';
  const leftIdentifier = content?.leftIdentifier || '/assets/svg/investident-hero.svg';
  const rightIdentifier = content?.rightIdentifier || '/assets/svg/barcode-ident.svg';
  const motifs = content?.motifs || defaultMotifs;

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
          src={logoUrl} 
          loading="lazy" 
          alt="Hardwey LOGO" 
          className={styles.heroLogo}
        />
      </div>

      {/* Hero Base Container */}
      <div className={styles.heroBaseContainer}>
        {/* Outer Identifiers */}
        {leftIdentifier && (
          <img 
            src={leftIdentifier} 
            loading="lazy" 
            alt="" 
            className={`${styles.outerIdent} ${styles.outerIdentLeft}`}
          />
        )}
        {rightIdentifier && (
          <img 
            src={rightIdentifier} 
            loading="lazy" 
            alt="" 
            className={styles.outerIdent}
          />
        )}

        {/* Mobile MITA Text */}
        <h2 className={`${styles.mitaHeroText} ${styles.mitaHeroTextMobile}`}>
          {mitaText}
        </h2>

        {/* Hero Idents Flex */}
        <div className={styles.heroIdentsFlex}>
          {motifs.length > 0 && (
            <>
              <img 
                src={motifs[0]} 
                loading="lazy" 
                alt="" 
                className={`${styles.motif} ${styles.motif2k23}`}
              />
              {motifs.length > 1 && (
                <img 
                  src={motifs[1]} 
                  loading="lazy" 
                  alt="" 
                  className={`${styles.motif} ${styles.motifRestricted}`}
                />
              )}
            </>
          )}
          
          {/* Desktop MITA Text */}
          <h2 className={`${styles.mitaHeroText} ${styles.mitaHeroTextDesktop}`}>
            {mitaText}
          </h2>
          
          {motifs.length > 2 && (
            <>
              <img 
                src={motifs[2]} 
                loading="lazy" 
                alt="" 
                className={`${styles.motif} ${styles.motifGlobal}`}
              />
              {motifs.length > 3 && (
                <img 
                  src={motifs[3]} 
                  loading="lazy" 
                  alt="" 
                  className={`${styles.motif} ${styles.motifRights}`}
                />
              )}
              {motifs.length > 4 && (
                <img 
                  src={motifs[4]} 
                  loading="lazy" 
                  alt="" 
                  className={`${styles.motif} ${styles.motifStars}`}
                />
              )}
            </>
          )}
        </div>

        {/* Fixed Width Text Container */}
        <div className={`${styles.fixedWidthTextContainer} ${styles.fixedWidthTextContainerHh}`}>
          <h5 className={`${styles.bodyCaps} ${styles.bodyCapsBlue}`}>
            {subtitle}
          </h5>
        </div>
      </div>

      {/* Hero Overlay */}
      <div className={styles.heroOverlay}></div>

      {/* Background Image */}
      <img 
        ref={backgroundRef}
        src={backgroundImage} 
        loading="lazy" 
        sizes="100vw" 
        alt="" 
        srcSet={backgroundImageSrcSet} 
        className={styles.image}
      />
    </section>
  );
};

export default HeroSection;