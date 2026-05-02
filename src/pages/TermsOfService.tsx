/**
 * TermsOfService component
 * Terms of service page with comprehensive terms and conditions
 */

import React, { useState, useEffect, useRef } from 'react';
import { useContent } from '@/hooks/useContent';
import type { TermsSection } from '@/types/content';
import { getTemplateFor } from '@/types/content';
import styles from './TermsOfService.module.css';

interface TermsOfServiceProps {
  className?: string;
}

// Helper component for rendering terms sections
interface TermsSectionProps {
  section: {
    title: string;
    paragraphs?: string[];
    lists?: string[][];
    disclaimer?: {
      title?: string;
      text?: string;
    };
    contactInfo?: {
      email?: string;
      address?: string;
    };
  };
}

function TermsSectionItem({ section }: TermsSectionProps) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{section.title}</h2>
      {section.disclaimer && (
        <div className={styles.disclaimerSection}>
          {section.disclaimer.title && (
            <h4 className={styles.disclaimerTitle}>{section.disclaimer.title}</h4>
          )}
          {section.disclaimer.text && (
            <p className={styles.disclaimerText} dangerouslySetInnerHTML={{ __html: section.disclaimer.text }} />
          )}
        </div>
      )}
      {section.paragraphs?.map((paragraph, pIdx) => (
        <p key={pIdx} className={styles.sectionText} dangerouslySetInnerHTML={{ __html: paragraph }} />
      ))}
      {section.lists?.map((list, listIdx) => (
        <ul key={listIdx} className={styles.sectionList}>
          {list.map((item, itemIdx) => (
            <li key={itemIdx} dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </ul>
      ))}
      {section.contactInfo && (
        <div className={styles.contactInfo}>
          {section.contactInfo.email && (
            <p><strong>Email:</strong> {section.contactInfo.email}</p>
          )}
          {section.contactInfo.address && (
            <p><strong>Address:</strong> {section.contactInfo.address}</p>
          )}
        </div>
      )}
    </section>
  );
}

// Component for page header
interface TermsPageHeaderProps {
  pageTitle: string | undefined;
  lastUpdated: string | undefined;
}

function TermsPageHeader({ pageTitle, lastUpdated }: TermsPageHeaderProps) {
  return (
    <div className={styles.pageHeader}>
      <div className={styles.headerContent}>
        <h1 className={styles.pageTitle}>{pageTitle}</h1>
        <p className={styles.pageSubtitle}>Last updated: {lastUpdated}</p>
      </div>
    </div>
  );
}

// Component for intro section
interface TermsIntroSectionProps {
  introText: string[];
}

function TermsIntroSection({ introText }: TermsIntroSectionProps) {
  return (
    <div className={styles.introSection}>
      {introText.map((text, idx) => (
        <p key={idx} className={styles.introText} dangerouslySetInnerHTML={{ __html: text }} />
      ))}
    </div>
  );
}

// Component for footer actions
interface TermsFooterActionsProps {
  email: string | undefined;
  buttonText: string | undefined;
}

function TermsFooterActions({ email, buttonText }: TermsFooterActionsProps) {
  return (
    <div className={styles.footerActions}>
      <a
        href={`mailto:${email || 'hello@hardweyllc.com'}`}
        className={styles.actionButton}
        aria-label="Contact us for terms questions"
      >
        {buttonText}
      </a>
    </div>
  );
}

// Hook for visibility observer
function useVisibilityObserver(ref: React.RefObject<HTMLDivElement | null>) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [ref]);

  return isVisible;
}

// Component for content section
interface TermsContentSectionProps {
  introText: string[];
  sections: Array<{
    title: string;
    paragraphs?: string[];
    lists?: string[][];
    disclaimer?: {
      title?: string;
      text?: string;
    };
    contactInfo?: {
      email?: string;
      address?: string;
    };
  }>;
  isVisible: boolean;
}

function TermsContentSection({ introText, sections, isVisible }: TermsContentSectionProps) {
  return (
    <div className={`${styles.contentContainer} ${isVisible ? styles.contentVisible : ''}`}>
      <div className={styles.contentWrapper}>
        <TermsIntroSection introText={introText} />
        {sections.map((section, sectionIdx) => (
          <TermsSectionItem key={sectionIdx} section={section} />
        ))}
      </div>
    </div>
  );
}

// Helper to get value with fallback
function getValue<T>(value: T | null | undefined, fallback: T): T {
  return value ?? fallback;
}

// Helper function to normalize terms of service content
function normalizeTermsContent(
  content: TermsSection | null | undefined,
  fallbackContent: TermsSection
) {
  if (!content) {
    return {
      pageTitle: fallbackContent.pageTitle,
      lastUpdated: fallbackContent.lastUpdated,
      introText: fallbackContent.introText ?? [],
      sections: fallbackContent.sections ?? [],
      footerEmail: getValue(fallbackContent.footerButtonEmail, 'hello@hardweyllc.com'),
      footerText: getValue(fallbackContent.footerButtonText, 'Contact Us'),
    };
  }

  return {
    pageTitle: getValue(content.pageTitle, fallbackContent.pageTitle),
    lastUpdated: getValue(content.lastUpdated, fallbackContent.lastUpdated),
    introText: getValue(content.introText, getValue(fallbackContent.introText, [])),
    sections: getValue(content.sections, getValue(fallbackContent.sections, [])),
    footerEmail: getValue(content.footerButtonEmail, getValue(fallbackContent.footerButtonEmail, 'hello@hardweyllc.com')),
    footerText: getValue(content.footerButtonText, getValue(fallbackContent.footerButtonText, 'Contact Us')),
  };
}

/**
 * Terms of service page with comprehensive terms and conditions
 * @param className - Additional CSS classes
 */
export const TermsOfService: React.FC<TermsOfServiceProps> = ({
  className = '',
}) => {
  const pageRef = useRef<HTMLDivElement>(null);
  const isVisible = useVisibilityObserver(pageRef);

  const fallbackContent = getTemplateFor('terms') as TermsSection;
  const { data: content } = useContent<TermsSection>('terms', fallbackContent);

  const normalizedContent = normalizeTermsContent(content, fallbackContent);

  return (
    <div ref={pageRef} className={`${styles.pageContainer} ${className}`}>
      <TermsPageHeader pageTitle={normalizedContent.pageTitle} lastUpdated={normalizedContent.lastUpdated} />

      <TermsContentSection introText={normalizedContent.introText} sections={normalizedContent.sections} isVisible={isVisible} />

      <TermsFooterActions email={normalizedContent.footerEmail} buttonText={normalizedContent.footerText} />
    </div>
  );
};

export default TermsOfService;
