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

// Helper function to convert FounderItem[] to Founder[]
function convertFounders(founders: FoundersSectionType['founders']): Founder[] | undefined {
  return founders?.map(f => ({
    id: f.id || `founder-${Date.now()}`,
    name: f.name,
    role: f.role,
    bio: f.bio,
    quote: f.quote,
    imageUrl: f.imageUrl,
    additionalInfo: f.additionalInfo || [],
  }));
}

// Helper function to resolve founders and content
function resolveFoundersContent(
  propsFounders: Founder[] | undefined,
  content: FoundersSectionType | null | undefined,
  defaultFounders: Founder[]
) {
  const cmsFounders = convertFounders(content?.founders);
  const founders = propsFounders || cmsFounders || defaultFounders;
  const heading = founders.length > 1 
    ? (content?.heading || 'The Founders')
    : (content?.headingSingular || 'The Founder');
  const animatedWords = content?.animatedWords || ['long', 'story', 'short'];
  const animatedTextMobile = content?.animatedTextMobile || 'Long story short';
  
  return { founders, heading, animatedWords, animatedTextMobile };
}

// Component for animated words section
interface AnimatedWordsProps {
  animatedWords: string[];
  animatedTextMobile: string;
  isTextAnimated: boolean;
  styles: typeof styles;
}

const AnimatedWords: React.FC<AnimatedWordsProps> = ({ animatedWords, animatedTextMobile, isTextAnimated, styles }) => {
  return (
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
  );
};

// Component for founder image section
interface FounderImageSectionProps {
  founders: Founder[];
  currentFounder: number;
  imageSrcSet: string;
  imageRef: React.RefObject<HTMLImageElement | null>;
  onImageLoad: () => void;
  onImageError: () => void;
  onFounderChange: (index: number) => void;
  styles: typeof styles;
}

const FounderImageSection: React.FC<FounderImageSectionProps> = ({
  founders,
  currentFounder,
  imageSrcSet,
  imageRef,
  onImageLoad,
  onImageError,
  onFounderChange,
  styles,
}) => {
  return (
    <div className={styles.imageContainer}>
      <img
        ref={imageRef}
        src={founders[currentFounder]?.imageUrl}
        alt={founders[currentFounder]?.name}
        className={`${styles.imageFull} ${styles.imageFounder}`}
        loading="eager"
        sizes="(max-width: 991px) 98vw, 49vw"
        srcSet={imageSrcSet}
        onLoad={onImageLoad}
        onError={onImageError}
        style={{ opacity: 0 }}
      />
      
      <div className={styles.imageOverlay} />
      
      {founders.length > 1 && (
        <div className={styles.founderDots}>
          {founders.map((_, index) => (
            <button
              key={index}
              className={`${styles.dot} ${index === currentFounder ? styles.dotActive : ''}`}
              onClick={() => onFounderChange(index)}
              aria-label={`View ${founders[index]?.name}`}
              type="button"
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Component for founder content section
interface FounderContentSectionProps {
  founder: Founder;
  styles: typeof styles;
}

const FounderContentSection: React.FC<FounderContentSectionProps> = ({ founder, styles }) => {
  return (
    <div className={styles.contentContainer}>
      <div className={styles.quoteContainer}>
        <h4 className={styles.heading5}>
          "{founder?.quote}"
        </h4>
        <div className={styles.founderNameLarge}>
          {founder?.name?.toUpperCase()}
        </div>
      </div>

      <p className={styles.bodyCopy}>
        {founder?.bio}
      </p>

      {founder?.additionalInfo && (
        <div className={styles.additionalInfo}>
          {founder.additionalInfo.map((info, index) => (
            <p key={index} className={styles.additionalText}>
              {info}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

// Component for founder navigation
interface FounderNavigationProps {
  founders: Founder[];
  currentFounder: number;
  isAnimating: boolean;
  onFounderChange: (index: number) => void;
  styles: typeof styles;
}

const FounderNavigation: React.FC<FounderNavigationProps> = ({
  founders,
  currentFounder,
  isAnimating,
  onFounderChange,
  styles,
}) => {
  const handlePrevious = () => {
    const prevIndex = currentFounder === 0 ? founders.length - 1 : currentFounder - 1;
    onFounderChange(prevIndex);
  };

  const handleNext = () => {
    const nextIndex = currentFounder === founders.length - 1 ? 0 : currentFounder + 1;
    onFounderChange(nextIndex);
  };

  if (founders.length <= 1) {
    return null;
  }

  return (
    <div className={styles.founderNavigation}>
      <button
        className={styles.navButton}
        onClick={handlePrevious}
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
        onClick={handleNext}
        disabled={isAnimating}
        aria-label="Next founder"
        type="button"
      >
        <span className={styles.navArrow}>→</span>
      </button>
    </div>
  );
};

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

  const { founders, heading, animatedWords, animatedTextMobile } = resolveFoundersContent(
    propsFounders,
    content,
    defaultFounders
  );
  
  // Get current founder's imageSrcSet if available
  const currentFounderData = content?.founders?.[currentFounder];
  const imageSrcSet = currentFounderData?.imageSrcSet || '/assets/banner/founder.jpg 500w, /assets/banner/founder.jpg 1080w, /assets/banner/founder.jpg 1610w';

  const startAnimation = React.useCallback(() => {
    setIsAnimating(true);
    // Reset animation after completion
    setTimeout(() => {
      setIsAnimating(false);
    }, 2000);
  }, []);

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
  }, [autoPlay, startAnimation]);

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
        <FounderImageSection
          founders={founders}
          currentFounder={currentFounder}
          imageSrcSet={imageSrcSet}
          imageRef={imageRef}
          onImageLoad={handleImageLoad}
          onImageError={handleImageError}
          onFounderChange={handleFounderChange}
          styles={styles}
        />

        {/* Text Content */}
        <div className={`${styles.splitColumn} ${styles.splitColumnText}`}>
          <div className={styles.headerContainer}>
            <h2 className={styles.heading2}>
              {heading}
            </h2>
            
            <AnimatedWords
              animatedWords={animatedWords}
              animatedTextMobile={animatedTextMobile}
              isTextAnimated={isTextAnimated}
              styles={styles}
            />
          </div>

          <FounderContentSection
            founder={founders[currentFounder]}
            styles={styles}
          />

          <FounderNavigation
            founders={founders}
            currentFounder={currentFounder}
            isAnimating={isAnimating}
            onFounderChange={handleFounderChange}
            styles={styles}
          />
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
