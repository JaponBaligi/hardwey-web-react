import React, { useEffect, useRef } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - lottie-web doesn't have TypeScript definitions
import lottie from 'lottie-web';
import { useContent } from '@/hooks/useContent';
import type { IntroSection as IntroContent } from '@/types/content';
import styles from './IntroSection.module.css';

interface IntroSectionProps {
  className?: string;
}

// Helper function to get subheading class based on index
function getSubheadingClass(idx: number, totalLength: number): string {
  if (idx === 0) return styles.subheadingLeft;
  if (idx === totalLength - 1) return styles.subheadingRight;
  return styles.subheadingDesktop;
}

// Helper component for subheading words
interface SubheadingWordsProps {
  words: string[];
}

function SubheadingWords({ words }: SubheadingWordsProps) {
  const totalLength = words.length;
  return (
    <>
      {words.map((word, idx) => (
        <div
          key={idx}
          className={`${styles.subheading} ${getSubheadingClass(idx, totalLength)}`}
        >
          {word}
        </div>
      ))}
    </>
  );
}

// Hook for subheading animation
function useSubheadingAnimation(subFlexRef: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && subFlexRef.current) {
          setTimeout(() => {
            if (subFlexRef.current) {
              subFlexRef.current.classList.add(styles.animated);
            }
          }, 300);
        }
      },
      { threshold: 0.1 }
    );

    if (subFlexRef.current) {
      observer.observe(subFlexRef.current);
    }

    return () => observer.disconnect();
  }, [subFlexRef]);
}

// Hook for lottie animation
function useLottieAnimation(lottieContainerRef: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    if (lottieContainerRef.current) {
      const animation = lottie.loadAnimation({
        container: lottieContainerRef.current,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        path: '/assets/js/marker.json'
      });

      // Autoplay when container is in view
      const playObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            animation.play();
          }
        },
        { threshold: 0.1 }
      );

      if (lottieContainerRef.current) {
        playObserver.observe(lottieContainerRef.current);
      }

      return () => {
        animation.destroy();
        playObserver.disconnect();
      };
    }
  }, [lottieContainerRef]);
}

// Helper function to format heading with artist span
function formatHeadingWithArtist(heading: string | undefined): string {
  const defaultHeading = 'invest in <span class="artist-heading">artists</span>';
  if (!heading) return defaultHeading;
  return heading.replace('artists', '<span class="artist-heading">artists</span>');
}

// Helper function to extract year from date
function extractYearFromDate(date: string | undefined): string {
  if (!date) return '2026)';
  const parts = date.split('/');
  return parts.length > 0 ? parts[parts.length - 1] : '2026)';
}

// Component for intro heading section
interface IntroHeadingProps {
  headingHtml: string;
  headingMobileHtml: string;
}

function IntroHeading({ headingHtml, headingMobileHtml }: IntroHeadingProps) {
  return (
    <div className={`${styles.introHeadingContainer} ${styles.introHeadingContainer1}`}>
      <h1 
        className={`${styles.heading1} ${styles.heading1Intro}`}
        dangerouslySetInnerHTML={{ __html: headingHtml }}
      />
      <h1 className={styles.introHeadingMob} dangerouslySetInnerHTML={{ __html: headingMobileHtml }} />
    </div>
  );
}

// Component for date section with spray
interface DateSectionProps {
  comingSoon: string;
  dateYear: string;
  lottieContainerRef: React.RefObject<HTMLDivElement | null>;
}

function DateSection({ comingSoon, dateYear, lottieContainerRef }: DateSectionProps) {
  return (
    <div className={`${styles.introHeadingContainer} ${styles.introHeadingContainerSecond}`}>
      <div>
        <h2 className={`${styles.heading2} ${styles.heading2Intro}`}>
          {comingSoon}
        </h2>
      </div>
      <div className={styles.textWrap}>
        <div className={styles.dateContainer}>
          <div className={styles.sprayWrapper}>
            <h2 className={`${styles.heading2} ${styles.heading2Intro} ${styles.dateSpray}`}>
              <span className={styles.sprayChar}>(</span>
              <span className={styles.sprayChar}>?</span>
              <span className={styles.sprayChar}>/</span>
              <span className={styles.sprayChar}>?</span>
              <span className={styles.sprayChar}>/</span>
            </h2>
            <div className={styles.jsonContain}>
              <div ref={lottieContainerRef} className={styles.lottieAnimation} />
            </div>
          </div>
          <h2 className={`${styles.heading2} ${styles.heading2Intro}`}>{dateYear}</h2>
        </div>
      </div>
    </div>
  );
}

/**
 * @param className 
 */
export const IntroSection: React.FC<IntroSectionProps> = ({ className = '' }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const lottieContainerRef = useRef<HTMLDivElement>(null);
  const subFlexRef = useRef<HTMLDivElement>(null);
  const { data: content } = useContent<IntroContent>('intro', {
    heading: 'invest in artists',
    headingMobile: 'Invest in artists, it hits different.',
    subheadingWords: ['it', 'hits', 'different'],
    comingSoon: 'Coming soon',
    date: '(?/?/2026)',
    welcomeText: 'Welcome to HARDWEY',
  });

  useSubheadingAnimation(subFlexRef);
  useLottieAnimation(lottieContainerRef);

  const headingHtml = formatHeadingWithArtist(content?.heading);
  const headingMobileHtml = content?.headingMobile || 'Invest in artists,<br /><span class="subheading-mobile-text">it hits different.</span>';
  const subheadingWords = content?.subheadingWords || ['it', 'hits', 'different'];
  const comingSoon = content?.comingSoon || 'Coming soon';
  const dateYear = extractYearFromDate(content?.date);
  const welcomeText = content?.welcomeText || 'Welcome to HARDWEY';

  return (
    <section
      ref={sectionRef}
      className={`${styles.introSection} ${className}`}
    >
      {/* MITA Logo Container */}
      <div className={styles.mitaLogoContain}>
        <div className={styles.mitaIdentContain}>
          <img
            className={styles.mitaIdent}
            src="/assets/img/HARDWEYMUSICGROUP.png"
            loading="lazy"
            srcSet="/assets/img/HARDWEYMUSICGROUP.png 500w, /assets/img/HARDWEYMUSICGROUP.png 529w"
            alt="HARDWEY Music Group"
          />
        </div>
      </div>

      <IntroHeading headingHtml={headingHtml} headingMobileHtml={headingMobileHtml} />

      {/* Intro Sub Flex */}
      <div ref={subFlexRef} className={`${styles.introSubFlex} ${styles.introSubFlexIntro}`}>
        <SubheadingWords words={subheadingWords} />
      </div>

      <DateSection comingSoon={comingSoon} dateYear={dateYear} lottieContainerRef={lottieContainerRef} />

      {/* Intro Video Container */}
      <div className={styles.introVideoContainer}>
        <div className={styles.playControls}>
        </div>
      </div>

      {/* Intro Body Contain */}
      <div className={styles.introBodyContain}>
        <div className={`${styles.bodyTextContain} ${styles.bodyTextContainWide} ${styles.bodyTextContainIntro}`}>
          <p className={`${styles.bodyCopy} ${styles.bodyCopyLam}`}>
            {welcomeText}
          </p>
        </div>
      </div>
    </section>
  );
};

export default IntroSection;