import React, { useMemo } from 'react';
import { PlaylistContainer } from '@/components/PlaylistContainer/PlaylistContainer';
import { useContent } from '@/hooks/useContent';
import type { FaqIntroSection as FaqIntroContent } from '@/types/content';
import type { PlaylistItem } from '@/types';
import styles from './FaqIntroSection.module.css';

interface FaqIntroSectionProps {
  className?: string;
}

/**
 * FAQ Intro Section component with graphic and title
 * Displays "FAQ It" heading with decorative stars
 */
export const FaqIntroSection: React.FC<FaqIntroSectionProps> = ({ className = '' }) => {
  const { data: content } = useContent<FaqIntroContent>('faqIntro', {
    starCount: 7,
    recordImage: '/assets/img/Playlist R&B Retro Nostalgia.png',
    recordCount: 1,
    spotifyUrl: 'https://open.spotify.com/',
  });

  const starCount = content?.starCount ?? 7;
  const recordImage = content?.recordImage || '/assets/img/Playlist R&B Retro Nostalgia.png';
  const recordCount = content?.recordCount ?? 1;
  const spotifyUrl = content?.spotifyUrl || 'https://open.spotify.com/';

  // Generate playlist items based on record count and image
  const playlists = useMemo<PlaylistItem[]>(() => {
    return Array.from({ length: recordCount }, (_, index) => ({
      id: `faq-record-${index + 1}`,
      title: `Record ${index + 1}`,
      description: '',
      spotifyUrl: spotifyUrl,
      imageUrl: recordImage,
    }));
  }, [recordCount, recordImage, spotifyUrl]);

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
            {Array.from({ length: starCount }, (_, index) => (
              <img 
                key={index}
                src="/assets/svg/form-star.svg" 
                loading="lazy" 
                alt="" 
                className={styles.asterix} 
              />
            ))}
          </div>
        </div>
      </div>

      {/* Playlist Container with turning records */}
      <PlaylistContainer className={styles.playlistWrapper} playlists={playlists} />
    </div>
  );
};

export default FaqIntroSection;
