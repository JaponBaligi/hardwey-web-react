/**
 * ErrorPage component for 404 errors
 * Replaces the original 404.html with React implementation
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContent } from '@/hooks/useContent';
import type { ErrorPageSection } from '@/types/content';
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

interface DefaultContent {
  title: string;
  description: string;
}

// Helper function to get default content based on error code
function getDefaultContentForError(errorCode: number): DefaultContent {
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
}

// Helper function to extract error content from error object
function extractErrorContent(
  errorObj: { title?: string; description?: string } | undefined,
  defaultDescription: string
): DefaultContent | null {
  if (errorObj && typeof errorObj.title === 'string' && errorObj.title) {
    return {
      title: errorObj.title,
      description: errorObj.description || defaultDescription
    };
  }
  return null;
}

// Helper function to get error content from section data
function getErrorContentFromSection(
  content: ErrorPageSection | null | undefined,
  errorCode: number
): DefaultContent {
  const defaultContent = getDefaultContentForError(errorCode);
  
  if (!content) {
    return defaultContent;
  }

  const errorMap: Record<number, () => DefaultContent | null> = {
    404: () => extractErrorContent(content.error404, defaultContent.description),
    500: () => extractErrorContent(content.error500, defaultContent.description),
    403: () => extractErrorContent(content.error403, defaultContent.description),
  };

  const getErrorContent = errorMap[errorCode];
  if (getErrorContent) {
    const errorContent = getErrorContent();
    if (errorContent) return errorContent;
  }

  const defaultErrorContent = extractErrorContent(content.defaultError, defaultContent.description);
  return defaultErrorContent || defaultContent;
}

// Helper function to resolve final content values
function resolveContentValues(
  propsTitle: string | undefined,
  propsDescription: string | undefined,
  propsBackButtonText: string | undefined,
  content: ErrorPageSection | null | undefined,
  errorCode: number
) {
  const errorContent = getErrorContentFromSection(content, errorCode);
  const defaultContent = getDefaultContentForError(errorCode);

  return {
    title: propsTitle || errorContent.title || defaultContent.title,
    description: propsDescription || errorContent.description || defaultContent.description,
    backButtonText: propsBackButtonText || content?.backButtonText || 'Back to Home',
    backgroundPatternImage: content?.backgroundPatternImage || '/assets/img/Green eye.gif',
    arrowIcon: content?.arrowIcon || '/assets/svg/arrow-red.svg',
  };
}

// Back button component to reduce complexity
interface BackButtonProps {
  text: string;
  arrowIcon: string;
  onNavigate: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({ text, arrowIcon, onNavigate }) => {
  const [buttonHovered, setButtonHovered] = useState(false);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onNavigate();
    }
  };

  return (
    <button
      className={styles.backButton}
      onClick={onNavigate}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setButtonHovered(true)}
      onMouseLeave={() => setButtonHovered(false)}
      aria-label={`${text} - Navigate to homepage`}
      type="button"
    >
      <span className={styles.backButtonText}>
        {text}
      </span>
      <div className={`${styles.backButtonHover} ${buttonHovered ? styles.backButtonHoverActive : ''}`} />
      
      {/* Arrow Icon */}
      <div className={styles.arrowDivWrapper}>
        <img
          src={arrowIcon}
          alt=""
          className={`${styles.arrowDiv} ${buttonHovered ? styles.arrowDivInvert : ''}`}
          loading="lazy"
        />
      </div>
    </button>
  );
};

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

  const { data: content } = useContent<ErrorPageSection>('errorPage', {
    error404: {
      title: '404 NOT FOUND',
      description: 'You dive too deep so you discovered an unexplored place, congrats! Let me assist you the explored places granny you forgot your pills again...'
    },
    error500: {
      title: '500 SERVER ERROR',
      description: 'Oops! Something went wrong on our end. Our team has been notified and is working to fix this issue.'
    },
    error403: {
      title: '403 FORBIDDEN',
      description: 'Access denied. You don\'t have permission to view this page.'
    },
    defaultError: {
      title: 'ERROR',
      description: 'An unexpected error occurred. Please try again later.'
    },
    backButtonText: 'Back to Home',
    backgroundPatternImage: '/assets/img/Green eye.gif',
    arrowIcon: '/assets/svg/arrow-red.svg',
  });

  const resolvedContent = resolveContentValues(
    title,
    description,
    backButtonText,
    content,
    errorCode
  );

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

  return (
    <div className={`${styles.errorPageContainer} ${className}`}>
      {/* Animated Background Pattern */}
      {showBackgroundPattern && (
        <div className={styles.backgroundPattern} style={{ backgroundImage: `url(${resolvedContent.backgroundPatternImage})` }}>
          <div className={styles.patternOverlay} />
        </div>
      )}

      {/* Main Content */}
      <div className={`${styles.errorContent} ${isVisible ? styles.errorContentVisible : ''}`}>
        {/* Error Title */}
        <h1 className={styles.errorTitle}>
          {resolvedContent.title}
        </h1>

        {/* Error Description */}
        <p className={styles.errorDescription}>
          {resolvedContent.description}
        </p>

        {/* Back Button */}
        {showBackButton && (
          <BackButton
            text={resolvedContent.backButtonText}
            arrowIcon={resolvedContent.arrowIcon}
            onNavigate={handleBackToHome}
          />
        )}

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
