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

/**
 * Terms of service page with comprehensive terms and conditions
 * @param className - Additional CSS classes
 */
export const TermsOfService: React.FC<TermsOfServiceProps> = ({
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);

  const fallbackContent = getTemplateFor('terms') as TermsSection;
  const { data: content } = useContent<TermsSection>('terms', fallbackContent);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (pageRef.current) {
      observer.observe(pageRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const pageTitle = content?.pageTitle ?? fallbackContent.pageTitle;
  const lastUpdated = content?.lastUpdated ?? fallbackContent.lastUpdated;
  const introText = content?.introText ?? fallbackContent.introText ?? [];
  const sections = content?.sections ?? fallbackContent.sections ?? [];
  const footerEmail = content?.footerButtonEmail ?? fallbackContent.footerButtonEmail ?? 'hello@hardweyllc.com';
  const footerText = content?.footerButtonText ?? fallbackContent.footerButtonText ?? 'Contact Us';

  return (
    <div ref={pageRef} className={`${styles.pageContainer} ${className}`}>
      <TermsPageHeader
        pageTitle={pageTitle}
        lastUpdated={lastUpdated}
      />

      <div className={`${styles.contentContainer} ${isVisible ? styles.contentVisible : ''}`}>
        <div className={styles.contentWrapper}>
          <TermsIntroSection introText={introText} />
          {sections.map((section, sectionIdx) => (
            <TermsSectionItem key={sectionIdx} section={section} />
          ))}
        </div>
      </div>

      <TermsFooterActions
        email={footerEmail}
        buttonText={footerText}
      />
    </div>
  );
};

export default TermsOfService;
