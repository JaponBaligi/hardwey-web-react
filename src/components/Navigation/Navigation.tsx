/**
 * Navigation component
 * Exact recreation of the live Hardwey website navigation
 * Matches the original static HTML design precisely
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Navigation.module.css';
import { JoinUsModal } from '../JoinUsModal/JoinUsModal';

interface NavigationProps {
  onJoinUsClick?: () => void;
  onMenuClick: () => void;
  className?: string;
}

/**
 * Navigation component with social links and Join Us button
 * @param onJoinUsClick - Callback for Join Us button click
 * @param onMenuClick - Callback for mobile menu toggle
 * @param className - Additional CSS classes
 */
export const Navigation: React.FC<NavigationProps> = ({
  onJoinUsClick,
  onMenuClick,
  className = '',
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Trigger the navigation slide-in animation after mount
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleJoinUsClick = () => {
    setIsModalOpen(true);
    if (onJoinUsClick) {
      onJoinUsClick();
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalSubmit = (data: { name: string; email: string; artist: string }) => {
    console.log('Form submitted:', data);
    // Here you would typically send the data to your backend
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
  };

  return (
    <>
      <div 
        ref={navRef}
        className={`${styles.navigationWrapper} ${isVisible ? styles.visible : ''} ${className}`}
      >
      {/* Left side - Social Links + Join Us */}
      <div className={styles.navigationContainer}>
        <div className={styles.socialLinks}>
          <a 
            href="https://www.instagram.com/hardweymusicgroup/" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.socialLink}
          >
            IG
          </a>
          <a 
            href="https://www.tiktok.com/@hardweymusicgroup" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.socialLink}
          >
            TT
          </a>
          <a 
            href="https://twitter.com/hardweyllc" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.socialLink}
          >
            X
          </a>
          <a 
            href="https://www.linkedin.com/company/hardwey" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.socialLink}
          >
            IN
          </a>
        </div>
        
        {/* Join Us Button with Arrow */}
        <button
          className={styles.joinUsButton}
          onClick={handleJoinUsClick}
          aria-label="Join us"
          type="button"
        >
          <div className={styles.buttonArrow}>
            <img
              src="/assets/svg/arrow-blue.svg"
              alt=""
              className={styles.buttonArrowImg}
              loading="lazy"
            />
            <img
              src="/assets/svg/arrow-blue.svg"
              alt=""
              className={styles.buttonArrowImg2}
              loading="lazy"
            />
          </div>
          <div className={`${styles.joinUsText} body-caps is-nav`}>Join Us</div>
        </button>
      </div>

      {/* Center - Navigation Items (absolutely positioned) */}
      <div className={styles.navigationItems}>
        <a 
          href="#hardwey" 
          className={styles.navItem}
          onClick={(e) => handleNavLinkClick(e, '#hardwey')}
        >
          HARDWEY
        </a>
        <a 
          href="#faq-it" 
          className={styles.navItem}
          onClick={(e) => handleNavLinkClick(e, '#faq-it')}
        >
          FAQ IT
        </a>
        <a 
          href="#founders" 
          className={styles.navItem}
          onClick={(e) => handleNavLinkClick(e, '#founders')}
        >
          FOUNDERS
        </a>
        <a 
          href="/partners" 
          className={styles.navItem}
          onClick={(e) => {
            if (location.pathname !== '/partners') {
              e.preventDefault();
              navigate('/partners');
            }
          }}
        >
          PARTNERS
        </a>
      </div>

      {/* Mobile Menu Button */}
      <button
        className={styles.mobileMenuButton}
        onClick={onMenuClick}
        aria-label="Open mobile menu"
        type="button"
      >
        <span className={styles.mobileMenuText}>[Menu]</span>
      </button>
    </div>

    {/* Join Us Modal */}
    <JoinUsModal
      isOpen={isModalOpen}
      onClose={handleModalClose}
      onSubmit={handleModalSubmit}
    />
  </>
  );
};

export default Navigation;
