import React, { useState, useRef, useEffect } from 'react';
import { PLAYLISTS } from '@/utils/constants';
import type { PlaylistItem } from '@/types';
import styles from './PlaylistContainer.module.css';

interface PlaylistContainerProps {
  className?: string;
  playlists?: PlaylistItem[];
  variant?: 'default' | '404';
}

/**
 * Playlist container with Spotify links and vinyl disc styling
 * @param className - Additional CSS classes
 * @param playlists - Array of playlist items (defaults to PLAYLISTS from constants)
 * @param variant - Visual variant (default or 404)
 */
export const PlaylistContainer: React.FC<PlaylistContainerProps> = ({
  className = '',
  playlists = PLAYLISTS,
  variant = 'default',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handlePlaylistClick = (playlist: PlaylistItem) => {
    // Track playlist clicks for analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'click', {
        event_category: 'playlist',
        event_label: playlist.title,
        value: playlist.spotifyUrl,
      });
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      ref={containerRef}
      className={`${styles.discContainers} ${className}`}
    >
      {playlists.map((playlist, index) => (
        <a
          key={playlist.id}
          href={playlist.spotifyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.playlistContainer} ${styles[`playlistContainer${variant.charAt(0).toUpperCase() + variant.slice(1)}`]} ${isVisible ? styles.playlistContainerVisible : ''}`}
          onClick={() => handlePlaylistClick(playlist)}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          aria-label={`Listen to ${playlist.title} on Spotify`}
          style={{ animationDelay: `${index * 0.2}s` }}
        >
          {/* Disc Overlay */}
          <div className={`${styles.discOverlay} ${isHovered ? styles.discOverlayVisible : ''}`}>
            <img
              src="/assets/svg/arrow-red.svg"
              alt=""
              className={styles.discArrow}
              loading="lazy"
            />
          </div>

          {/* Disc Fill */}
          <div className={styles.discFill}>
            <img
              src={playlist.imageUrl}
              alt={playlist.title}
              className={styles.discImg}
              loading="lazy"
              sizes="(max-width: 479px) 30vw, (max-width: 767px) 28vw, (max-width: 991px) 22vw, 16vw"
              srcSet="/assets/img/Playlist500x.png 500w, /assets/img/playlist800px.png 800w, /assets/img/playlist1151px.png 1151w"
            />
          </div>
        </a>
      ))}
    </div>
  );
};

export default PlaylistContainer;
