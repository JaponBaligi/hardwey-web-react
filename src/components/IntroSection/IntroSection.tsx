import React, { useEffect, useRef } from 'react';
// @ts-ignore
import lottie from 'lottie-web';
import { useContent } from '@/hooks/useContent';
import type { IntroSection as IntroContent } from '@/types/content';
import styles from './IntroSection.module.css';

interface IntroSectionProps {
  className?: string;
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
  }, []);

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
  }, []);

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

      {/* Intro Heading Container 1 */}
      <div className={`${styles.introHeadingContainer} ${styles.introHeadingContainer1}`}>
        <h1 
          className={`${styles.heading1} ${styles.heading1Intro}`}
          dangerouslySetInnerHTML={{ __html: content?.heading?.replace('artists', '<span class="artist-heading">artists</span>') || 'invest in <span class="artist-heading">artists</span>' }}
        />
        <h1 className={styles.introHeadingMob} dangerouslySetInnerHTML={{ __html: content?.headingMobile || 'Invest in artists,<br /><span class="subheading-mobile-text">it hits different.</span>' }} />
      </div>

      {/* Intro Sub Flex */}
      <div ref={subFlexRef} className={`${styles.introSubFlex} ${styles.introSubFlexIntro}`}>
        {(content?.subheadingWords || ['it', 'hits', 'different']).map((word, idx) => (
          <div
            key={idx}
            className={`${styles.subheading} ${
              idx === 0 ? styles.subheadingLeft : idx === (content?.subheadingWords?.length || 3) - 1 ? styles.subheadingRight : styles.subheadingDesktop
            }`}
          >
            {word}
          </div>
        ))}
      </div>

      {/* Intro Heading Container Second */}
      <div className={`${styles.introHeadingContainer} ${styles.introHeadingContainerSecond}`}>
        <div>
          <h2 className={`${styles.heading2} ${styles.heading2Intro}`}>
            {content?.comingSoon || 'Coming soon'}
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
            <h2 className={`${styles.heading2} ${styles.heading2Intro}`}>{content?.date?.split('/').pop() || '2026)'}</h2>
          </div>
        </div>
      </div>

      {/* Intro Video Container */}
      <div className={styles.introVideoContainer}>
        <div className={styles.playControls}>
        </div>
      </div>

      {/* Intro Body Contain */}
      <div className={styles.introBodyContain}>
        <div className={`${styles.bodyTextContain} ${styles.bodyTextContainWide} ${styles.bodyTextContainIntro}`}>
          <p className={`${styles.bodyCopy} ${styles.bodyCopyLam}`}>
            {content?.welcomeText || 'Welcome to HARDWEY'}
          </p>
        </div>
      </div>
    </section>
  );
};

export default IntroSection;