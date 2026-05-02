/**
 * InvestmentIntroSection component
 * Matches the "If you've never invested" section from live site
 */

import React, { useEffect, useRef, useState } from 'react';
import { useContent } from '@/hooks/useContent';
import type { InvestmentIntroSection as InvestmentIntroContent } from '@/types/content';
import styles from './InvestmentIntroSection.module.css';

interface InvestmentIntroSectionProps {
  className?: string;
}

/**
 * Simple investment intro text section
 * Matches the "If you've never invested" text-only section from live site
 * @param className - Additional CSS classes
 */
export const InvestmentIntroSection: React.FC<InvestmentIntroSectionProps> = ({ className = '' }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { data: content } = useContent<InvestmentIntroContent>('investmentIntro', {
    heading: "If you've never invested...",
    subtitle: "This one's for you",
  });

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
      id="investment-intro"
      className={`${styles.investmentIntroSection} ${className}`}
    >
      <div className={styles.textContainer}>
        <h4 className={`${styles.heading} ${isVisible ? styles.headingVisible : ''}`}>
          {content?.heading || "If you've never invested..."}
        </h4>
        <p className={`${styles.subtitle} ${isVisible ? styles.subtitleVisible : ''}`}>
          {content?.subtitle || "This one's for you"}
        </p>
      </div>
    </section>
  );
};

export default InvestmentIntroSection;
