/**
 * MobileMenu component for mobile navigation overlay
 * Replaces the original mobile menu functionality with React implementation
 */

import React, { useEffect } from 'react';
import { SOCIAL_LINKS } from '@/utils/constants';
import type { SocialLink } from '@/types';
import styles from './MobileMenu.module.css';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onJoinUsClick: () => void;
}

/**
 * Mobile navigation menu overlay
 * @param isOpen - Whether the menu is currently open
 * @param onClose - Callback to close the menu
 * @param onJoinUsClick - Callback for Join Us button click
 */
export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  onJoinUsClick,
}) => {
  // Handle escape key to close menu
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleSocialClick = (link: SocialLink) => {
    // Track social media clicks for analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'click', {
        event_category: 'social',
        event_label: link.platform,
        value: link.url,
      });
    }
    onClose();
  };

  const handleJoinUsClick = () => {
    onJoinUsClick();
    onClose();
  };

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={styles.mobileMenuOverlay}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation menu"
    >
      <div className={styles.mobileMenuContent}>
        {/* Close Button */}
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close mobile menu"
        >
          <div className={styles.closeIcon}>
            <span className={styles.closeLine}></span>
            <span className={styles.closeLine}></span>
          </div>
        </button>

        {/* Navigation Items */}
        <nav className={styles.mobileNav}>
          <div className={styles.navSection}>
            <h3 className={styles.navSectionTitle}>Social</h3>
            <div className={styles.socialLinks}>
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  onClick={() => handleSocialClick(link)}
                  aria-label={link.label}
                >
                  <span className={styles.socialPlatform}>
                    {link.platform === 'instagram' && 'Instagram'}
                    {link.platform === 'tiktok' && 'TikTok'}
                    {link.platform === 'twitter' && 'Twitter'}
                    {link.platform === 'linkedin' && 'LinkedIn'}
                  </span>
                  <span className={styles.socialHandle}>
                    {link.platform === 'instagram' && '@hardweymusicgroup'}
                    {link.platform === 'tiktok' && '@hardweymusicgroup'}
                    {link.platform === 'twitter' && '@hardweyllc'}
                    {link.platform === 'linkedin' && '/company/hardwey'}
                  </span>
                </a>
              ))}
            </div>
          </div>

          <div className={styles.navSection}>
            <h3 className={styles.navSectionTitle}>Navigation</h3>
            <div className={styles.navLinks}>
              <a href="#hardwey" className={styles.navLink} onClick={onClose}>
                HARDWEY
              </a>
              <a href="#faq-it" className={styles.navLink} onClick={onClose}>
                FAQ It
              </a>
              <a href="#founders" className={styles.navLink} onClick={onClose}>
                Founders
              </a>
            </div>
          </div>

          <div className={styles.navSection}>
            <button
              type="button"
              className={styles.joinUsButton}
              onClick={handleJoinUsClick}
            >
              <div className={styles.buttonArrow}>
                <img
                  src="/assets/svg/arrow-blue.svg"
                  alt=""
                  className={styles.buttonArrowImg}
                />
                <img
                  src="/assets/svg/arrow-blue.svg"
                  alt=""
                  className={`${styles.buttonArrowImg} ${styles.buttonArrowImgSecond}`}
                />
              </div>
              <span className={styles.joinUsText}>Join Us</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default MobileMenu;
