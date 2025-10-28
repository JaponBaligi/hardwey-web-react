import React from 'react';
import { PlaylistContainer } from '@/components/PlaylistContainer/PlaylistContainer';
import styles from './FaqIntroSection.module.css';

interface FaqIntroSectionProps {
  className?: string;
}

/**
 * FAQ Intro Section component with graphic and title
 * Displays "FAQ It" heading with decorative stars
 */
export const FaqIntroSection: React.FC<FaqIntroSectionProps> = ({ className = '' }) => {
  return (
    <div className={`${styles.faqIntroContain} ${className}`}>
      <div className={styles.faqItGraphic}>
        <div className={`${styles.subheading} ${styles.subheadingBlack}`}>
          An FAQ that won't bore you
        </div>
      </div>
      <div className={styles.faqFlex}>
        <h3 className={styles.faqTitle}>FAQ It</h3>
        <div className={styles.faqSubMobile}>
          <div className={styles.starsFlex}>
            <img src="/assets/svg/form-star.svg" loading="lazy" alt="" className={styles.asterix} />
            <img src="/assets/svg/form-star.svg" loading="lazy" alt="" className={styles.asterix} />
            <img src="/assets/svg/form-star.svg" loading="lazy" alt="" className={styles.asterix} />
            <img src="/assets/svg/form-star.svg" loading="lazy" alt="" className={styles.asterix} />
            <img src="/assets/svg/form-star.svg" loading="lazy" alt="" className={styles.asterix} />
            <img src="/assets/svg/form-star.svg" loading="lazy" alt="" className={styles.asterix} />
            <img src="/assets/svg/form-star.svg" loading="lazy" alt="" className={styles.asterix} />
          </div>
        </div>
      </div>

      {/* Playlist Container with turning records */}
      <PlaylistContainer className={styles.playlistWrapper} />
    </div>
  );
};

export default FaqIntroSection;
