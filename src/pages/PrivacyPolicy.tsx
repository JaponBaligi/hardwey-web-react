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

/**
 * Privacy policy page with comprehensive privacy information
 * @param className - Additional CSS classes
 */
export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);

  const fallbackContent = getTemplateFor('privacyPolicy') as PrivacyPolicySection;
  const { data: content } = useContent<PrivacyPolicySection>('privacyPolicy', fallbackContent);

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
      <PrivacyPolicyHeader
        pageTitle={pageTitle}
        lastUpdated={lastUpdated}
      />

      <div className={`${styles.contentContainer} ${isVisible ? styles.contentVisible : ''}`}>
        <div className={styles.contentWrapper}>
          <IntroSection introText={introText} />
          {sections.map((section, sectionIdx) => (
            <PolicySectionItem key={sectionIdx} section={section} />
          ))}
        </div>
      </div>

      <FooterActions
        email={footerEmail}
        buttonText={footerText}
      />
    </div>
  );
};

export default PrivacyPolicy;
