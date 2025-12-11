/**
 * PrivacyPolicy component
 * Privacy policy page with comprehensive privacy information
 */

import React, { useState, useEffect, useRef } from 'react';
import { useContent } from '@/hooks/useContent';
import type { PrivacyPolicySection } from '@/types/content';
import { getTemplateFor } from '@/types/content';
import styles from './PrivacyPolicy.module.css';

interface PrivacyPolicyProps {
  className?: string;
}

// Helper component for rendering policy sections
interface PolicySectionProps {
  section: {
    title: string;
    paragraphs?: string[];
    lists?: string[][];
    contactInfo?: {
      email?: string;
      address?: string;
    };
  };
}

function PolicySectionItem({ section }: PolicySectionProps) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{section.title}</h2>
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
interface PrivacyPolicyHeaderProps {
  pageTitle: string | undefined;
  lastUpdated: string | undefined;
}

function PrivacyPolicyHeader({ pageTitle, lastUpdated }: PrivacyPolicyHeaderProps) {
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
interface IntroSectionProps {
  introText: string[];
}

function IntroSection({ introText }: IntroSectionProps) {
  return (
    <div className={styles.introSection}>
      {introText.map((text, idx) => (
        <p key={idx} className={styles.introText} dangerouslySetInnerHTML={{ __html: text }} />
      ))}
    </div>
  );
}

// Component for footer actions
interface FooterActionsProps {
  email: string | undefined;
  buttonText: string | undefined;
}

function FooterActions({ email, buttonText }: FooterActionsProps) {
  return (
    <div className={styles.footerActions}>
      <a
        href={`mailto:${email || 'hello@hardweyllc.com'}`}
        className={styles.actionButton}
        aria-label="Contact us for privacy questions"
      >
        {buttonText}
      </a>
    </div>
  );
}

// Hook for visibility observer
function useVisibilityObserver(ref: React.RefObject<HTMLDivElement>) {
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
interface ContentSectionProps {
  introText: string[];
  sections: Array<{
    title: string;
    paragraphs?: string[];
    lists?: string[][];
    contactInfo?: {
      email?: string;
      address?: string;
    };
  }>;
  isVisible: boolean;
}

function ContentSection({ introText, sections, isVisible }: ContentSectionProps) {
  return (
    <div className={`${styles.contentContainer} ${isVisible ? styles.contentVisible : ''}`}>
      <div className={styles.contentWrapper}>
        <IntroSection introText={introText} />
        {sections.map((section, sectionIdx) => (
          <PolicySectionItem key={sectionIdx} section={section} />
        ))}
      </div>
    </div>
  );
}

// Helper to get value with fallback
function getValue<T>(value: T | null | undefined, fallback: T): T {
  return value ?? fallback;
}

// Helper function to normalize privacy policy content
function normalizePrivacyPolicyContent(
  content: PrivacyPolicySection | null | undefined,
  fallbackContent: PrivacyPolicySection
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
 * Privacy policy page with comprehensive privacy information
 * @param className - Additional CSS classes
 */
export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({
  className = '',
}) => {
  const pageRef = useRef<HTMLDivElement>(null);
  const isVisible = useVisibilityObserver(pageRef);

  const fallbackContent = getTemplateFor('privacyPolicy') as PrivacyPolicySection;
  const { data: content } = useContent<PrivacyPolicySection>('privacyPolicy', fallbackContent);

  const normalizedContent = normalizePrivacyPolicyContent(content, fallbackContent);

  return (
    <div ref={pageRef} className={`${styles.pageContainer} ${className}`}>
      <PrivacyPolicyHeader pageTitle={normalizedContent.pageTitle} lastUpdated={normalizedContent.lastUpdated} />

      <ContentSection introText={normalizedContent.introText} sections={normalizedContent.sections} isVisible={isVisible} />

      <FooterActions email={normalizedContent.footerEmail} buttonText={normalizedContent.footerText} />
    </div>
  );
};

export default PrivacyPolicy;
