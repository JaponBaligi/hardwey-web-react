/**
 * MobileMenu component for mobile navigation overlay
 * Replaces the original mobile menu functionality with React implementation
 */

import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  const navigate = useNavigate();
  const location = useLocation();
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

  const handleNavLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    // If we're not on the home page, navigate to home page with hash
    if (location.pathname !== '/') {
      e.preventDefault();
      navigate('/', { state: { scrollTo: hash } });
      // Wait for navigation to complete, then scroll to the element
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    } else {
      // If we're on the home page, handle scrolling explicitly
      e.preventDefault();
      
      // For HARDWEY link, scroll to the top (homepage starting point)
      if (hash === '#hardwey') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        // For other links, scroll to the section
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }
    // Close menu after navigation
    onClose();
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
      {/* Background Watermark */}
      <div className={styles.watermark}>HARDWEY</div>

      {/* Close Button */}
      <button
        type="button"
        className={styles.closeButton}
        onClick={onClose}
        aria-label="Close mobile menu"
      >
        [CLOSE]
      </button>

      {/* Main Navigation Items */}
      <nav className={styles.mobileNav}>
        <a 
          href="#hardwey" 
          className={styles.navLink} 
          onClick={(e) => handleNavLinkClick(e, '#hardwey')}
        >
          HARDWEY
        </a>
        <a 
          href="#faq-it" 
          className={styles.navLink} 
          onClick={(e) => handleNavLinkClick(e, '#faq-it')}
        >
          FAQ IT
        </a>
        <a 
          href="#founders" 
          className={styles.navLink} 
          onClick={(e) => handleNavLinkClick(e, '#founders')}
        >
          FOUNDERS
        </a>
      </nav>

      {/* Social Links */}
      <div className={styles.socialLinks}>
        <a
          href="https://www.instagram.com/hardweymusicgroup/"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.socialLink}
          onClick={() => {
            const link = SOCIAL_LINKS.find(l => l.platform === 'instagram');
            if (link) {
              handleSocialClick(link);
            } else {
              onClose();
            }
          }}
          aria-label="Instagram"
        >
          IG
        </a>
        <a
          href="https://www.tiktok.com/@hardweymusicgroup"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.socialLink}
          onClick={() => {
            const link = SOCIAL_LINKS.find(l => l.platform === 'tiktok');
            if (link) {
              handleSocialClick(link);
            } else {
              onClose();
            }
          }}
          aria-label="TikTok"
        >
          TT
        </a>
        <a
          href="https://www.linkedin.com/company/hardwey"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.socialLink}
          onClick={() => {
            const link = SOCIAL_LINKS.find(l => l.platform === 'linkedin');
            if (link) {
              handleSocialClick(link);
            } else {
              onClose();
            }
          }}
          aria-label="LinkedIn"
        >
          IN
        </a>
      </div>
    </div>
  );
};

export default MobileMenu;
