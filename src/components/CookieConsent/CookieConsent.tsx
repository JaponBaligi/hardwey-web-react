/**
 * CookieConsent component with DOMPurify sanitization
 * Replaces the original Finsweet cookie consent with React implementation
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import DOMPurify from 'dompurify';
import styles from './CookieConsent.module.css';

interface CookieConsentProps {
  onAccept?: () => void;
  onDecline?: () => void;
  className?: string;
  privacyPolicyUrl?: string;
  termsOfServiceUrl?: string;
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
 * Cookie consent banner with DOMPurify sanitization and GDPR compliance
 * @param onAccept - Callback when user accepts cookies
 * @param onDecline - Callback when user declines cookies
 * @param className - Additional CSS classes
 * @param privacyPolicyUrl - URL to privacy policy page
 * @param termsOfServiceUrl - URL to terms of service page
 * @param showDeclineButton - Whether to show decline button
 * @param autoHide - Whether to auto-hide after delay
 * @param hideDelay - Delay in milliseconds before auto-hide
 */
export const CookieConsent: React.FC<CookieConsentProps> = ({
  onAccept,
  onDecline,
  className = '',
  privacyPolicyUrl = '/privacy-policy',
  termsOfServiceUrl = '/terms-of-service',
  showDeclineButton = true,
  autoHide = false,
  hideDelay = 5000,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
    functional: false,
  });
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
    // Set only necessary cookies
    const necessaryOnly: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
    };

    setPreferences(necessaryOnly);
    localStorage.setItem('cookie-consent', JSON.stringify(necessaryOnly));
    localStorage.setItem('cookie-consent-timestamp', Date.now().toString());

    // Track consent decline
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        functionality_storage: 'denied',
      });
    }

    // Call callback
    if (onDecline) {
      onDecline();
    }

    // Hide banner with animation
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
    }, 300);
  }, [onDecline]);

  // Auto-hide functionality
  useEffect(() => {
    if (autoHide && isVisible) {
      const timer = setTimeout(() => {
        handleDecline();
      }, hideDelay);

      return () => clearTimeout(timer);
    }
  }, [autoHide, hideDelay, isVisible, handleDecline]);

  // Sanitize HTML content with DOMPurify
  const sanitizeContent = (content: string): string => {
    return DOMPurify.sanitize(content, {
      ALLOWED_TAGS: ['a', 'strong', 'em', 'span', 'br'],
      ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
      ALLOW_DATA_ATTR: false,
    });
  };

  const handleAccept = () => {
    // Set all cookies as accepted
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
    };

    setPreferences(allAccepted);
    localStorage.setItem('cookie-consent', JSON.stringify(allAccepted));
    localStorage.setItem('cookie-consent-timestamp', Date.now().toString());

    // Track consent acceptance
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'granted',
        functionality_storage: 'granted',
      });
    }

    // Call callback
    if (onAccept) {
      onAccept();
    }

    // Hide banner with animation
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
    }, 300);
  };

  const handlePreferenceChange = (category: keyof CookiePreferences) => {
    setPreferences(prev => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleSavePreferences = () => {
    localStorage.setItem('cookie-consent', JSON.stringify(preferences));
    localStorage.setItem('cookie-consent-timestamp', Date.now().toString());

    // Update Google Analytics consent
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: preferences.analytics ? 'granted' : 'denied',
        ad_storage: preferences.marketing ? 'granted' : 'denied',
        functionality_storage: preferences.functional ? 'granted' : 'denied',
      });
    }

    // Hide banner with animation
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
    }, 300);
  };

  // Generate sanitized privacy policy link
  const privacyPolicyLink = sanitizeContent(
    `<a href="${privacyPolicyUrl}" target="_blank" rel="noopener noreferrer" class="${styles.privacyLink}">Privacy Policy</a>`
  );

  // Generate sanitized terms of service link
  const termsOfServiceLink = sanitizeContent(
    `<a href="${termsOfServiceUrl}" target="_blank" rel="noopener noreferrer" class="${styles.termsLink}">Terms of Service</a>`
  );

  if (!isVisible) return null;

  return (
    <div
      ref={bannerRef}
      className={`${styles.cookieContainer} ${isAnimating ? styles.cookieContainerVisible : ''} ${className}`}
      role="banner"
      aria-label="Cookie consent banner"
    >
      {/* Cookie Text Content */}
      <div className={styles.cookieTextContain}>
        <h4 className={styles.cookieSubhead}>We use Cookies</h4>
        <div className={styles.flexBlock}>
          <div className={styles.subheading}>
            For more info, check our{' '}
            <span
              dangerouslySetInnerHTML={{ __html: privacyPolicyLink }}
            />
            {termsOfServiceUrl && (
              <>
                {' '}and{' '}
                <span
                  dangerouslySetInnerHTML={{ __html: termsOfServiceLink }}
                />
              </>
            )}
          </div>
        </div>

        {/* Cookie Categories */}
        <div className={styles.cookieCategories}>
          <div className={styles.cookieCategory}>
            <label className={styles.categoryLabel}>
              <input
                type="checkbox"
                checked={preferences.necessary}
                disabled
                className={styles.categoryCheckbox}
                aria-label="Necessary cookies (required)"
              />
              <span className={styles.categoryName}>Necessary</span>
              <span className={styles.categoryDescription}>
                Required for basic website functionality
              </span>
            </label>
          </div>

          <div className={styles.cookieCategory}>
            <label className={styles.categoryLabel}>
              <input
                type="checkbox"
                checked={preferences.analytics}
                onChange={() => handlePreferenceChange('analytics')}
                className={styles.categoryCheckbox}
                aria-label="Analytics cookies"
              />
              <span className={styles.categoryName}>Analytics</span>
              <span className={styles.categoryDescription}>
                Help us understand how visitors interact with our website
              </span>
            </label>
          </div>

          <div className={styles.cookieCategory}>
            <label className={styles.categoryLabel}>
              <input
                type="checkbox"
                checked={preferences.marketing}
                onChange={() => handlePreferenceChange('marketing')}
                className={styles.categoryCheckbox}
                aria-label="Marketing cookies"
              />
              <span className={styles.categoryName}>Marketing</span>
              <span className={styles.categoryDescription}>
                Used to deliver relevant advertisements
              </span>
            </label>
          </div>

          <div className={styles.cookieCategory}>
            <label className={styles.categoryLabel}>
              <input
                type="checkbox"
                checked={preferences.functional}
                onChange={() => handlePreferenceChange('functional')}
                className={styles.categoryCheckbox}
                aria-label="Functional cookies"
              />
              <span className={styles.categoryName}>Functional</span>
              <span className={styles.categoryDescription}>
                Enable enhanced functionality and personalization
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className={styles.actionButtons}>
        <button
          onClick={handleAccept}
          className={`${styles.cookieAccept} ${styles.acceptButton}`}
          aria-label="Accept all cookies"
        >
          Accept All
          <img
            src="/assets/svg/arrow-black.svg"
            alt=""
            className={styles.acceptArrow}
            loading="lazy"
          />
        </button>

        {showDeclineButton && (
          <button
            onClick={handleDecline}
            className={`${styles.cookieAccept} ${styles.declineButton}`}
            aria-label="Decline non-necessary cookies"
          >
            Decline
            <img
              src="/assets/svg/arrow-black.svg"
              alt=""
              className={styles.acceptArrow}
              loading="lazy"
            />
          </button>
        )}

        <button
          onClick={handleSavePreferences}
          className={`${styles.cookieAccept} ${styles.saveButton}`}
          aria-label="Save cookie preferences"
        >
          Save Preferences
          <img
            src="/assets/svg/arrow-black.svg"
            alt=""
            className={styles.acceptArrow}
            loading="lazy"
          />
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;
