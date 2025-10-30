/**
 * FredAgainSection component
 * Displays the "Imagine you invested in Fred Again.. in 2020" image section
 * Matches the original static HTML structure
 */

import React, { useEffect, useRef, useState } from 'react';
import styles from './FredAgainSection.module.css';

interface FredAgainSectionProps {
  className?: string;
}

/**
 * Fred Again investment example section
 * @param className - Additional CSS classes
 */
export const FredAgainSection: React.FC<FredAgainSectionProps> = ({ className = '' }) => {
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
      className={`${styles.imageSection} ${className}`}
    >
      {/* Background Image */}
      <img
        src="https://assets-global.website-files.com/64f45f425cb2cbb837b6f9b8/652ce8621b4433a6c86c936b_1.%20COLOR%20TREATMENT%20%2B%20NOISE%20(FAV).jpg"
        loading="lazy"
        sizes="100vw"
        srcSet="https://assets-global.website-files.com/64f45f425cb2cbb837b6f9b8/652ce8621b4433a6c86c936b_1.%20COLOR%20TREATMENT%20%2B%20NOISE%20(FAV)-p-500.jpg 500w, https://assets-global.website-files.com/64f45f425cb2cbb837b6f9b8/652ce8621b4433a6c86c936b_1.%20COLOR%20TREATMENT%20%2B%20NOISE%20(FAV)-p-800.jpg 800w, https://assets-global.website-files.com/64f45f425cb2cbb837b6f9b8/652ce8621b4433a6c86c936b_1.%20COLOR%20TREATMENT%20%2B%20NOISE%20(FAV)-p-1080.jpg 1080w, https://assets-global.website-files.com/64f45f425cb2cbb837b6f9b8/652ce8621b4433a6c86c936b_1.%20COLOR%20TREATMENT%20%2B%20NOISE%20(FAV)-p-1600.jpg 1600w, https://assets-global.website-files.com/64f45f425cb2cbb837b6f9b8/652ce8621b4433a6c86c936b_1.%20COLOR%20TREATMENT%20%2B%20NOISE%20(FAV)-p-2000.jpg 2000w, https://assets-global.website-files.com/64f45f425cb2cbb837b6f9b8/652ce8621b4433a6c86c936b_1.%20COLOR%20TREATMENT%20%2B%20NOISE%20(FAV).jpg 2858w"
        alt="Fred Again concert image"
        className={styles.imageFull}
      />

      {/* Heading Container */}
      <div className={`${styles.bodyTextContain} ${styles.bodyTextContainWide} ${styles.bodyTextContainFa}`}>
        <h4 className={`${styles.heading2} ${styles.heading2Image} ${isVisible ? styles.heading2Visible : ''}`}>
          Imagine you invested in Fred Again.. in 2020
        </h4>
      </div>

      {/* Credits Container */}
      <div className={styles.hifCreditsContainer}>
        <p className={`${styles.subheading} ${styles.subheadingLight} ${isVisible ? styles.subheadingVisible : ''}`}>
          Braggin' rights now come with returns
        </p>
        <div className={styles.hifIdentsFlex}>
          <img
            src="/assets/img/hardweybannertext.png"
            width="150"
            height="150"
            loading="lazy"
            alt="HARDWEY logo"
            className={`${styles.identLogo} ${isVisible ? styles.identLogoVisible : ''}`}
          />
          <img
            src="https://assets-global.website-files.com/64f45f425cb2cbb837b6f9b8/64fde2e125f96a17e11dbc64_HIF-ident2.svg"
            loading="lazy"
            alt="HIF ident logo"
            className={`${styles.identLogo} ${isVisible ? styles.identLogoVisible : ''}`}
          />
        </div>
      </div>

      {/* Gradient Overlay */}
      <div className={styles.divBlock3}></div>
    </section>
  );
};

export default FredAgainSection;

