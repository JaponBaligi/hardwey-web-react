/**
 * PartnersPage component
 * Displays all partners in a grid layout
 */

import React, { useRef, useEffect, useState } from 'react';
import { useContent } from '@/hooks/useContent';
import type { PartnersSectionType, CollaborativesSectionType } from '@/types/content';
import { getTemplateFor } from '@/types/content';
import { PartnerCard } from '@/components/PartnerCard/PartnerCard';
import styles from './PartnersPage.module.css';

interface PartnersPageProps {
  className?: string;
}

/**
 * Partners page displaying all partner cards
 * @param className - Additional CSS classes
 */
export const PartnersPage: React.FC<PartnersPageProps> = ({
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);

  const fallbackContent = getTemplateFor('partners') as PartnersSectionType;
  const { data: content } = useContent<PartnersSectionType>('partners', fallbackContent);

  const fallbackCollaboratives = getTemplateFor('collaboratives') as CollaborativesSectionType;
  const { data: collaborativesContent } = useContent<CollaborativesSectionType>('collaboratives', fallbackCollaboratives);

  const partners = content?.partners || [];
  const collaboratives = collaborativesContent?.collaboratives || [];

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
          <h1 className={styles.pageTitle}>
            {content?.pageTitle || fallbackContent.pageTitle}
          </h1>
          {content?.pageSubtitle && (
            <p className={styles.pageSubtitle}>
              {content.pageSubtitle}
            </p>
          )}
        </div>
      </div>

      {/* Separator */}
      <div className={styles.separator}></div>

      {/* Partners Section */}
      {partners.length > 0 && (
        <>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionHeading}>Partners</h2>
          </div>
          <div className={`${styles.partnersGrid} ${isVisible ? styles.partnersGridVisible : ''}`}>
            {partners.map((partner, index) => (
              <div
                key={partner.id}
                className={`${styles.gridItem} ${isVisible ? styles.gridItemVisible : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <PartnerCard partner={partner} />
              </div>
            ))}
          </div>
        </>
      )}

      {/* Collaboratives Section */}
      {collaboratives.length > 0 && (
        <>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionHeading}>
              {collaborativesContent?.heading || 'Collaboratives'}
            </h2>
          </div>
          <div className={`${styles.partnersGrid} ${isVisible ? styles.partnersGridVisible : ''}`}>
            {collaboratives.map((collaborative, index) => (
              <div
                key={collaborative.id}
                className={`${styles.gridItem} ${isVisible ? styles.gridItemVisible : ''}`}
                style={{ animationDelay: `${(partners.length + index) * 0.1}s` }}
              >
                <PartnerCard partner={collaborative} />
              </div>
            ))}
          </div>
        </>
      )}

      {/* Empty State */}
      {partners.length === 0 && collaboratives.length === 0 && (
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>No partners or collaboratives available at this time.</p>
        </div>
      )}
    </div>
  );
};

export default PartnersPage;

