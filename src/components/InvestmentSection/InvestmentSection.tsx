/**
 * InvestmentSection component
 * Matches the "invest in artists" section from live site
 */

import React, { useEffect, useRef, useState } from 'react';
import styles from './InvestmentSection.module.css';

interface InvestmentSectionProps {
  className?: string;
}

/**
 * Investment section with animated text and call-to-action
 * @param className - Additional CSS classes
 */
export const InvestmentSection: React.FC<InvestmentSectionProps> = ({ className = '' }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

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
            src="/assets/img/BUY SHARES IMAGE.jpg"
            alt="Investment Background"
            className={styles.backgroundImg}
            loading="lazy"
          />
        </div>

        {/* Main Content */}
        <div className={styles.content}>
          {/* Main Heading */}
          <h1 className={`${styles.mainHeading} ${isVisible ? styles.mainHeadingVisible : ''}`}>
            invest in artists
          </h1>

          {/* Animated Text */}
          <div className={`${styles.animatedText} ${isVisible ? styles.animatedTextVisible : ''}`}>
            <span className={styles.word}>it</span>
            <span className={styles.word}>hits</span>
            <span className={styles.word}>different</span>
          </div>

          {/* Coming Soon */}
          <div className={`${styles.comingSoon} ${isVisible ? styles.comingSoonVisible : ''}`}>
            <h2 className={styles.comingSoonTitle}>Coming soon</h2>
            <div className={styles.launchDate}>
              <h2 className={styles.dateText}>(?/?/2026)</h2>
              <img
                src="/assets/img/hardweymainlogo.jpg"
                alt="HARDWEY Logo"
                className={styles.logoImg}
                loading="lazy"
              />
            </div>
          </div>

          {/* Welcome Text */}
          <p className={`${styles.welcomeText} ${isVisible ? styles.welcomeTextVisible : ''}`}>
            Welcome to HARDWEY
          </p>
        </div>
      </div>
    </section>
  );
};

export default InvestmentSection;
