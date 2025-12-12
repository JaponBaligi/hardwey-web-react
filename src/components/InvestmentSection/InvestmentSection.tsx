/**
 * InvestmentSection component
 * Matches the "invest in artists" section from live site
 */

import React, { useEffect, useRef, useState } from 'react';
import { useContent } from '@/hooks/useContent';
import type { InvestmentSection as InvestmentContent } from '@/types/content';
import styles from './InvestmentSection.module.css';

interface InvestmentSectionProps {
  className?: string;
}

// Helper function to resolve content values with defaults
function resolveInvestmentContent(content: InvestmentContent | null | undefined) {
  const defaultBackgroundImage = '/assets/img/BUY SHARES IMAGE.jpg';
  const defaultAnimatedWords = ['it', 'hits', 'different'];

  return {
    backgroundImage: content?.backgroundImage || defaultBackgroundImage,
    mainHeading: content?.mainHeading || 'invest in artists',
    animatedWords: content?.animatedWords || defaultAnimatedWords,
    comingSoonTitle: content?.comingSoonTitle || 'Coming soon',
    dateText: content?.dateText || '(?/?/2026)',
    logoImage: content?.logoImage || '/assets/img/hardweymainlogo.jpg',
    welcomeText: content?.welcomeText || 'Welcome to HARDWEY',
  };
}

/**
 * Investment section with animated text and call-to-action
 * @param className - Additional CSS classes
 */
export const InvestmentSection: React.FC<InvestmentSectionProps> = ({ className = '' }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const defaultBackgroundImage = '/assets/img/BUY SHARES IMAGE.jpg';
  const defaultAnimatedWords = ['it', 'hits', 'different'];

  const { data: content } = useContent<InvestmentContent>('investment', {
    backgroundImage: defaultBackgroundImage,
    mainHeading: 'invest in artists',
    animatedWords: defaultAnimatedWords,
    comingSoonTitle: 'Coming soon',
    dateText: '(?/?/2026)',
    logoImage: '/assets/img/hardweymainlogo.jpg',
    welcomeText: 'Welcome to HARDWEY',
  });

  const resolvedContent = resolveInvestmentContent(content);

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

  return (
    <section
      ref={sectionRef}
      id="investment"
      className={`${styles.investmentSection} ${className}`}
    >
      <div className={styles.container}>
        {/* Background Image */}
        <div className={styles.backgroundImage}>
          <img
            src={resolvedContent.backgroundImage || undefined}
            alt="Investment Background"
            className={styles.backgroundImg}
            loading="lazy"
          />
        </div>

        {/* Main Content */}
        <div className={styles.content}>
          {/* Main Heading */}
          <h1 className={`${styles.mainHeading} ${isVisible ? styles.mainHeadingVisible : ''}`}>
            {resolvedContent.mainHeading}
          </h1>

          {/* Animated Text */}
          <div className={`${styles.animatedText} ${isVisible ? styles.animatedTextVisible : ''}`}>
            {resolvedContent.animatedWords.map((word, index) => (
              <span key={index} className={styles.word}>{word}</span>
            ))}
          </div>

          {/* Coming Soon */}
          <div className={`${styles.comingSoon} ${isVisible ? styles.comingSoonVisible : ''}`}>
            <h2 className={styles.comingSoonTitle}>{resolvedContent.comingSoonTitle}</h2>
            <div className={styles.launchDate}>
              <h2 className={styles.dateText}>{resolvedContent.dateText}</h2>
              <img
                src={resolvedContent.logoImage || undefined}
                alt="HARDWEY Logo"
                className={styles.logoImg}
                loading="lazy"
              />
            </div>
          </div>

          {/* Welcome Text */}
          <p className={`${styles.welcomeText} ${isVisible ? styles.welcomeTextVisible : ''}`}>
            {resolvedContent.welcomeText}
          </p>
        </div>
      </div>
    </section>
  );
};

export default InvestmentSection;
