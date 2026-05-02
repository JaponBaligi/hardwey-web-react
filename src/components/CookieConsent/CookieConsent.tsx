/**
 * CookieConsent component - React refactor from static HTML/CSS
 * Matches original design, animations, hovers, and functions
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './CookieConsent.module.css';

interface CookieConsentProps {
  onAccept?: () => void;
  onDecline?: () => void;
  className?: string;
  privacyPolicyUrl?: string;
  showDeclineButton?: boolean;
  autoHide?: boolean;
  hideDelay?: number;
}

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

/**
 * Cookie consent banner matching static design with animations and hover effects
 */
export const CookieConsent: React.FC<CookieConsentProps> = ({
  onAccept,
  onDecline,
  className = '',
  privacyPolicyUrl = '/privacy-policy',
  showDeclineButton = true,
  autoHide = false,
  hideDelay = 5000,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);

  // Check if user has already made a choice
  useEffect(() => {
    const hasConsent = localStorage.getItem('cookie-consent');
    if (!hasConsent) {
      setIsVisible(true);
      setIsAnimating(true);
    }
  }, []);

  const handleDecline = useCallback(() => {
    const necessaryOnly: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
    };

    localStorage.setItem('cookie-consent', JSON.stringify(necessaryOnly));
    localStorage.setItem('cookie-consent-timestamp', Date.now().toString());

    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        functionality_storage: 'denied',
      });
    }

    if (onDecline) {
      onDecline();
    }

    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
    }, 300);
  }, [onDecline]);

  useEffect(() => {
    if (autoHide && isVisible) {
      const timer = setTimeout(() => {
        handleDecline();
      }, hideDelay);

      return () => clearTimeout(timer);
    }
  }, [autoHide, hideDelay, isVisible, handleDecline]);

  const handleAccept = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
    };

    localStorage.setItem('cookie-consent', JSON.stringify(allAccepted));
    localStorage.setItem('cookie-consent-timestamp', Date.now().toString());

    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'granted',
        functionality_storage: 'granted',
      });
    }

    if (onAccept) {
      onAccept();
    }

    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div
      ref={bannerRef}
      className={`${styles.cookieContainer} ${isAnimating ? styles.cookieContainerVisible : ''} ${className}`}
      role="banner"
      aria-label="Cookie consent banner"
    >
      {/* Cookie Text Content - matches static structure */}
      <div className={styles.cookieTextContain}>
        <h4 className={styles.cookieSubhead}>We use Cookies</h4>
        <div className={styles.flexBlock}>
          <div className={`${styles.subheading} ${styles.isPrivacy}`}>
            For more info, check our
          </div>
          <a 
            href={privacyPolicyUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.cookiePrivacyFlex}
          >
            <div className={styles.privacyUnderlineFlex}>
              <div className={`${styles.subheading} ${styles.isPrivLink}`}>
                Privacy Policy
              </div>
              <div className={styles.privUnderline}></div>
            </div>
            <img 
              src="/assets/svg/arrow-black.svg" 
              loading="lazy" 
              alt="" 
              className={styles.image3}
            />
          </a>
        </div>
      </div>

      {/* Action Buttons - matches static structure with div-block-10 */}
      <div className={styles.divBlock10}>
        <div 
          className={styles.cookieAcceptDiv}
          onClick={handleAccept}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleAccept();
            }
          }}
          aria-label="Accept all cookies"
        >
          <div className={`${styles.cookieAccept} ${styles.isBm}`}>Accept</div>
          <div className={styles.buttonArrow}>
            <img
              src="/assets/svg/arrow-black.svg"
              loading="lazy"
              alt=""
              className={styles.buttonArrowImg}
            />
            <img
              src="/assets/svg/arrow-black.svg"
              loading="lazy"
              alt=""
              className={styles.buttonArrowImg2}
            />
          </div>
        </div>

        {showDeclineButton && (
          <div 
            className={styles.cookieDeclineDiv}
            onClick={handleDecline}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleDecline();
              }
            }}
            aria-label="Decline non-necessary cookies"
          >
            <div className={styles.cookieAccept}>Decline</div>
            <div className={styles.buttonArrow}>
              <img
                src="/assets/svg/arrow-black.svg"
                loading="lazy"
                alt=""
                className={styles.buttonArrowImg}
              />
              <img
                src="/assets/svg/arrow-black.svg"
                loading="lazy"
                alt=""
                className={styles.buttonArrowImg2}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CookieConsent;
