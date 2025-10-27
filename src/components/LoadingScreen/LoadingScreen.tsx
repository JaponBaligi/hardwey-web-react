/**
 * LoadingScreen component with animated logo and background
 * Replaces the original loading screen with React implementation
 */

import React, { useEffect, useState } from 'react';
import styles from './LoadingScreen.module.css';

interface LoadingScreenProps {
  isLoading: boolean;
  onLoadingComplete?: () => void;
  minLoadingTime?: number;
}

/**
 * Loading screen with animated logo and background video
 * @param isLoading - Whether the loading screen should be visible
 * @param onLoadingComplete - Callback when loading is complete
 * @param minLoadingTime - Minimum time to show loading screen (ms)
 */
export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  isLoading,
  onLoadingComplete,
  minLoadingTime = 2000,
}) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(isLoading);

  useEffect(() => {
    if (!isLoading) {
      // Start exit animation
      const timer = setTimeout(() => {
        setIsVisible(false);
        onLoadingComplete?.();
      }, 500); // Animation duration

      return () => clearTimeout(timer);
    } else {
      setIsVisible(true);
      setProgress(0);
    }
  }, [isLoading, onLoadingComplete]);

  useEffect(() => {
    if (!isLoading) return;

    const startTime = Date.now();
    const duration = minLoadingTime;

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      
      setProgress(newProgress);

      if (newProgress < 100) {
        requestAnimationFrame(updateProgress);
      }
    };

    requestAnimationFrame(updateProgress);
  }, [isLoading, minLoadingTime]);

  if (!isVisible) return null;

  return (
    <div className={`${styles.loadingScreen} ${!isLoading ? styles.loadingScreenExit : ''}`}>
      {/* Background Video */}
      <div className={styles.backgroundVideo}>
        <video
          className={styles.video}
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/assets/video/loading-background.mp4" type="video/mp4" />
          {/* Fallback for browsers that don't support video */}
          <div className={styles.videoFallback}></div>
        </video>
      </div>

      {/* Loading Content */}
      <div className={styles.loadingContent}>
        {/* Logo Animation */}
        <div className={styles.logoContainer}>
          <img
            src="/assets/img/hardweymainlogo.jpg"
            alt="HARDWEY"
            className={styles.logo}
          />
          <div className={styles.logoGlow}></div>
        </div>

        {/* Loading Text */}
        <div className={styles.loadingText}>
          <h1 className={styles.brandName}>HARDWEY</h1>
          <p className={styles.tagline}>Invest in Artists</p>
        </div>

        {/* Progress Bar */}
        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className={styles.progressText}>
            {Math.round(progress)}%
          </span>
        </div>

        {/* Loading Animation */}
        <div className={styles.loadingAnimation}>
          <div className={styles.spinner}></div>
        </div>
      </div>

      {/* Overlay */}
      <div className={styles.overlay}></div>
    </div>
  );
};

export default LoadingScreen;
