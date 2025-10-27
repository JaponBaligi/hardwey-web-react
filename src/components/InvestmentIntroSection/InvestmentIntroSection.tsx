/**
 * InvestmentIntroSection component
 * Matches the "If you've never invested" section from live site
 */

import React, { useEffect, useRef, useState } from 'react';
import styles from './InvestmentIntroSection.module.css';

interface InvestmentIntroSectionProps {
  className?: string;
}

/**
 * Investment intro section with Mona Lisa image and messaging
 * @param className - Additional CSS classes
 */
export const InvestmentIntroSection: React.FC<InvestmentIntroSectionProps> = ({ className = '' }) => {
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
      id="investment-intro"
      className={`${styles.investmentIntroSection} ${className}`}
    >
      <div className={styles.container}>
        {/* Left Side */}
        <div className={styles.leftSide}>
          <h4 className={`${styles.heading} ${isVisible ? styles.headingVisible : ''}`}>
            If you've never invested...
          </h4>
          <p className={`${styles.subtitle} ${isVisible ? styles.subtitleVisible : ''}`}>
            This one's for you
          </p>
        </div>

        {/* Center */}
        <div className={styles.center}>
          <div className={`${styles.monaContainer} ${isVisible ? styles.monaContainerVisible : ''}`}>
            <span className={styles.nopeText}>Nope</span>
            <img
              src="/assets/img/mona-image2.jpg"
              alt="HARDWEY MONA"
              className={styles.monaImage}
              loading="lazy"
            />
          </div>
          <p className={`${styles.weAreText} ${isVisible ? styles.weAreTextVisible : ''}`}>
            We're
          </p>
        </div>

        {/* Right Side */}
        <div className={styles.rightSide}>
          <h4 className={`${styles.valueHeading} ${isVisible ? styles.valueHeadingVisible : ''}`}>
            We value mu$ic more than pixels
          </h4>
          <p className={`${styles.valueText} ${isVisible ? styles.valueTextVisible : ''}`}>
            We're building something that resonates with everyone. Not just "PR".
          </p>
          <img
            src="/assets/svg/hardwey-star.svg"
            alt="HARDWEY STAR"
            className={`${styles.starImage} ${isVisible ? styles.starImageVisible : ''}`}
            loading="lazy"
          />
        </div>

        {/* Bottom */}
        <div className={styles.bottom}>
          <span className={`${styles.nftText} ${isVisible ? styles.nftTextVisible : ''}`}>
            NFTs
          </span>
        </div>
      </div>
    </section>
  );
};

export default InvestmentIntroSection;
