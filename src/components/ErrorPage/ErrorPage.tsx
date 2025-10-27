/**
 * ErrorPage component for 404 errors
 * Replaces the original 404.html with React implementation
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ErrorPage.module.css';

interface ErrorPageProps {
  errorCode?: number;
  title?: string;
  description?: string;
  showBackButton?: boolean;
  backButtonText?: string;
  className?: string;
  showBackgroundPattern?: boolean;
}

/**
 * Error page component with animated background and interactive elements
 * @param errorCode - HTTP error code (defaults to 404)
 * @param title - Custom error title
 * @param description - Custom error description
 * @param showBackButton - Whether to show back to home button
 * @param backButtonText - Custom back button text
 * @param className - Additional CSS classes
 * @param showBackgroundPattern - Whether to show animated background pattern
 */
export const ErrorPage: React.FC<ErrorPageProps> = ({
  errorCode = 404,
  title,
  description,
  showBackButton = true,
  backButtonText = 'Back to Home',
  className = '',
  showBackgroundPattern = true,
}) => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [buttonHovered, setButtonHovered] = useState(false);

  // Default content based on error code
  const getDefaultContent = () => {
    switch (errorCode) {
      case 404:
        return {
          title: '404 NOT FOUND',
          description: 'You dive too deep so you discovered an unexplored place, congrats! Let me assist you the explored places granny you forgot your pills again...',
        };
      case 500:
        return {
          title: '500 SERVER ERROR',
          description: 'Oops! Something went wrong on our end. Our team has been notified and is working to fix this issue.',
        };
      case 403:
        return {
          title: '403 FORBIDDEN',
          description: 'Access denied. You don\'t have permission to view this page.',
        };
      default:
        return {
          title: `${errorCode} ERROR`,
          description: 'An unexpected error occurred. Please try again later.',
        };
    }
  };

  const defaultContent = getDefaultContent();
  const finalTitle = title || defaultContent.title;
  const finalDescription = description || defaultContent.description;

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleBackToHome = () => {
    navigate('/', { replace: true });
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleBackToHome();
    }
  };

  return (
    <div className={`${styles.errorPageContainer} ${className}`}>
      {/* Animated Background Pattern */}
      {showBackgroundPattern && (
        <div className={styles.backgroundPattern}>
          <div className={styles.patternOverlay} />
        </div>
      )}

      {/* Main Content */}
      <div className={`${styles.errorContent} ${isVisible ? styles.errorContentVisible : ''}`}>
        {/* Error Title */}
        <h1 className={styles.errorTitle}>
          {finalTitle}
        </h1>

        {/* Error Description */}
        <p className={styles.errorDescription}>
          {finalDescription}
        </p>

        {/* Back Button */}
        {showBackButton && (
          <button
            className={styles.backButton}
            onClick={handleBackToHome}
            onKeyDown={handleKeyDown}
            onMouseEnter={() => setButtonHovered(true)}
            onMouseLeave={() => setButtonHovered(false)}
            aria-label={`${backButtonText} - Navigate to homepage`}
            type="button"
          >
            <span className={styles.backButtonText}>
              {backButtonText}
            </span>
            <div className={`${styles.backButtonHover} ${buttonHovered ? styles.backButtonHoverActive : ''}`} />
            
            {/* Arrow Icon */}
            <div className={styles.arrowDivWrapper}>
              <img
                src="/assets/svg/arrow-red.svg"
                alt=""
                className={`${styles.arrowDiv} ${buttonHovered ? styles.arrowDivInvert : ''}`}
                loading="lazy"
              />
            </div>
          </button>
        )}

        {/* Additional Help Links */}
        <div className={styles.helpLinks}>
          <button
            className={styles.helpLink}
            onClick={() => navigate('/faq')}
            aria-label="Visit FAQ page for help"
            type="button"
          >
            FAQ
          </button>
          <span className={styles.helpSeparator}>•</span>
          <button
            className={styles.helpLink}
            onClick={() => navigate('/contact')}
            aria-label="Contact support"
            type="button"
          >
            Contact Support
          </button>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className={styles.decorativeElements}>
        <div className={styles.floatingElement} />
        <div className={styles.floatingElement} />
        <div className={styles.floatingElement} />
      </div>
    </div>
  );
};

export default ErrorPage;
