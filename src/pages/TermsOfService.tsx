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


  return (
    <div ref={pageRef} className={`${styles.pageContainer} ${className}`}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>{content?.pageTitle || fallbackContent.pageTitle}</h1>
          <p className={styles.pageSubtitle}>
            Last updated: {content?.lastUpdated || fallbackContent.lastUpdated}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className={`${styles.contentContainer} ${isVisible ? styles.contentVisible : ''}`}>
        <div className={styles.contentWrapper}>
          <div className={styles.introSection}>
            {(content?.introText || fallbackContent.introText || []).map((text, idx) => (
              <p key={idx} className={styles.introText} dangerouslySetInnerHTML={{ __html: text }} />
            ))}
          </div>

          {(content?.sections || fallbackContent.sections || []).map((section, sectionIdx) => (
            <section key={sectionIdx} className={styles.section}>
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
          ))}
        </div>
      </div>

      {/* Footer Actions */}
      <div className={styles.footerActions}>
        <a
          href={`mailto:${content?.footerButtonEmail || fallbackContent.footerButtonEmail || 'hello@hardweyllc.com'}`}
          className={styles.actionButton}
          aria-label="Contact us for terms questions"
        >
          {content?.footerButtonText || fallbackContent.footerButtonText || 'Contact Us'}
        </a>
      </div>
    </div>
  );
};

export default TermsOfService;
