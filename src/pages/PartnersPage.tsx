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

// Helper component to render partner grid
interface PartnerGridProps {
  items: Array<{ id: string }>;
  isVisible: boolean;
  startIndex: number;
}

function PartnerGrid({ items, isVisible, startIndex }: PartnerGridProps) {
  return (
    <div className={`${styles.partnersGrid} ${isVisible ? styles.partnersGridVisible : ''}`}>
      {items.map((item, index) => (
        <div
          key={item.id}
          className={`${styles.gridItem} ${isVisible ? styles.gridItemVisible : ''}`}
          style={{ animationDelay: `${(startIndex + index) * 0.1}s` }}
        >
          <PartnerCard partner={item as Parameters<typeof PartnerCard>[0]['partner']} />
        </div>
      ))}
    </div>
  );
}

// Component for page header
interface PartnersPageHeaderProps {
  pageTitle: string;
  pageSubtitle?: string;
}

function PartnersPageHeader({ pageTitle, pageSubtitle }: PartnersPageHeaderProps) {
  return (
    <div className={styles.pageHeader}>
      <div className={styles.headerContent}>
        <h1 className={styles.pageTitle}>{pageTitle}</h1>
        {pageSubtitle && (
          <p className={styles.pageSubtitle}>{pageSubtitle}</p>
        )}
      </div>
    </div>
  );
}

// Component for section header
interface SectionHeaderProps {
  heading: string | undefined;
}

function SectionHeader({ heading }: SectionHeaderProps) {
  return (
    <div className={styles.sectionHeader}>
      <h2 className={styles.sectionHeading}>{heading}</h2>
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

// Component for partners section list
interface PartnersSectionListProps {
  partners: Array<{ id: string }>;
  collaboratives: Array<{ id: string }>;
  collaborativesHeading: string | undefined;
  isVisible: boolean;
}

function PartnersSectionList({
  partners,
  collaboratives,
  collaborativesHeading,
  isVisible,
}: PartnersSectionListProps) {
  const hasPartners = partners.length > 0;
  const hasCollaboratives = collaboratives.length > 0;

  if (!hasPartners && !hasCollaboratives) {
    return (
      <div className={styles.emptyState}>
        <p className={styles.emptyText}>No partners or collaboratives available at this time.</p>
      </div>
    );
  }

  return (
    <>
      {hasPartners && (
        <>
          <SectionHeader heading="Partners" />
          <PartnerGrid items={partners} isVisible={isVisible} startIndex={0} />
        </>
      )}

      {hasCollaboratives && (
        <>
          <SectionHeader heading={collaborativesHeading ?? 'Collaboratives'} />
          <PartnerGrid items={collaboratives} isVisible={isVisible} startIndex={partners.length} />
        </>
      )}
    </>
  );
}

/**
 * Partners page displaying all partner cards
 * @param className - Additional CSS classes
 */
export const PartnersPage: React.FC<PartnersPageProps> = ({
  className = '',
}) => {
  const pageRef = useRef<HTMLDivElement>(null);
  const isVisible = useVisibilityObserver(pageRef);

  const fallbackContent = getTemplateFor('partners') as PartnersSectionType;
  const { data: content } = useContent<PartnersSectionType>('partners', fallbackContent);

  const fallbackCollaboratives = getTemplateFor('collaboratives') as CollaborativesSectionType;
  const { data: collaborativesContent } = useContent<CollaborativesSectionType>('collaboratives', fallbackCollaboratives);

  const partners = content?.partners || [];
  const collaboratives = collaborativesContent?.collaboratives || [];
  const pageTitle = content?.pageTitle ?? fallbackContent.pageTitle ?? '';
  const pageSubtitle = content?.pageSubtitle;
  const collaborativesHeading = collaborativesContent?.heading;

  return (
    <div ref={pageRef} className={`${styles.pageContainer} ${className}`}>
      <PartnersPageHeader pageTitle={pageTitle} pageSubtitle={pageSubtitle} />

      <div className={styles.separator}></div>

      <PartnersSectionList
        partners={partners}
        collaboratives={collaboratives}
        collaborativesHeading={collaborativesHeading}
        isVisible={isVisible}
      />
    </div>
  );
};

export default PartnersPage;

