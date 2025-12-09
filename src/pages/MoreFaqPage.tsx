/**
 * MoreFaqPage component
 * Extended FAQ page with additional questions and answers
 */

import React, { useState, useRef, useEffect } from 'react';
import type { FaqItem } from '@/types';
import { useContent } from '@/hooks/useContent';
import type { MoreFaqPageSection, FaqSectionType } from '@/types/content';
import { getTemplateFor } from '@/types/content';
import styles from './MoreFaqPage.module.css';

interface MoreFaqPageProps {
  className?: string;
}

// Helper function to close all accordion items except the target
function closeOtherAccordions(
  accordionRefs: React.MutableRefObject<(HTMLDivElement | null)[]>,
  excludeIndex: number
) {
  accordionRefs.current.forEach((ref, refIndex) => {
    if (ref && refIndex !== excludeIndex) {
      ref.style.height = '0px';
    }
  });
}

// Helper function to open accordion item
function openAccordionItem(
  accordionPane: HTMLDivElement,
  setOpenItem: (index: number | null) => void,
  index: number
) {
  const naturalHeight = accordionPane.scrollHeight + 'px';
  accordionPane.style.height = '0px';
  setOpenItem(index);

  requestAnimationFrame(() => {
    accordionPane.style.height = naturalHeight;
  });
}

// Helper component for FAQ accordion item
interface FaqAccordionItemProps {
  item: FaqItem;
  index: number;
  mainFaqCount: number;
  isOpen: boolean;
  isVisible: boolean;
  accordionRef: (el: HTMLDivElement | null) => void;
  onToggle: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

function FaqAccordionItem({
  item,
  index,
  mainFaqCount,
  isOpen,
  isVisible,
  accordionRef,
  onToggle,
  onKeyDown,
}: FaqAccordionItemProps) {
  return (
    <div
      key={item.id}
      role="listitem"
      className={`${styles.accordionItem} ${isVisible ? styles.accordionItemVisible : ''}`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <button
        type="button"
        className={`${styles.accordionTabButton} ${isOpen ? styles.accordionTabButtonActive : ''}`}
        onClick={onToggle}
        onKeyDown={onKeyDown}
        aria-expanded={isOpen}
        aria-controls={`faq-panel-${item.id}`}
        aria-label={`Toggle FAQ: ${item.question}`}
      >
        <div className={styles.faqNumber}>
          {String(index + mainFaqCount + 1).padStart(2, '0')}
        </div>
        <div className={styles.faqTitleFlex}>
          <h3 className={`${styles.heading3} ${styles.heading3IsFaq}`}>
            {item.question}
          </h3>
          <p className={styles.faqSupportTxt}>
            {item.subtitle}
          </p>
        </div>
        <div className={styles.arrowDivWrapper}>
          <img
            src="/assets/svg/arrow-red.svg"
            alt=""
            className={`${styles.arrowDiv} ${isOpen ? styles.arrowDivActive : ''}`}
            loading="lazy"
          />
        </div>
      </button>
      <div
        ref={accordionRef}
        id={`faq-panel-${item.id}`}
        className={styles.accordionPane}
        style={{ height: '0px' }}
        aria-hidden={!isOpen}
      >
        <div className={styles.accordionPaneContent}>
          <p className={styles.faqAnswer}>
            {item.answer}
          </p>
          <div className={styles.faqSecondaryFlex}>
            {item.additionalInfo && item.additionalInfo.length > 0 && item.additionalInfo[0] && (
              <p className={styles.bodyCopy}>
                {item.additionalInfo[0]}
              </p>
            )}
            {item.additionalInfo && item.additionalInfo.length > 1 && item.additionalInfo[1] && (
              <p className={styles.bodyCopy}>
                {item.additionalInfo[1]}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Component for page header
interface PageHeaderProps {
  pageTitle: string | undefined;
  pageSubtitle: string | undefined;
}

function PageHeader({ pageTitle, pageSubtitle }: PageHeaderProps) {
  return (
    <div className={styles.pageHeader}>
      <div className={styles.headerContent}>
        <h1 className={styles.pageTitle}>{pageTitle}</h1>
        <p className={styles.pageSubtitle}>{pageSubtitle}</p>
      </div>
    </div>
  );
}

// Component for image section with contact
interface ImageContactSectionProps {
  imageUrl?: string;
  contactHeading: string | undefined;
  contactEmail: string | undefined;
  contactButtonText: string | undefined;
}

function ImageContactSection({ imageUrl, contactHeading, contactEmail, contactButtonText }: ImageContactSectionProps) {
  return (
    <section className={styles.imageSection}>
      {imageUrl && (
        <img
          src={imageUrl}
          alt=""
          className={styles.imageFull}
          loading="lazy"
        />
      )}
      <div className={styles.bodyTextContain}>
        <h4 className={styles.heading2Image}>{contactHeading}</h4>
        <a
          href={`mailto:${contactEmail || 'hello@hardweyllc.com'}`}
          className={styles.emailButton}
          aria-label="Email us for support"
        >
          {contactButtonText}
        </a>
      </div>
    </section>
  );
}

/**
 * Extended FAQ page with comprehensive questions and answers
 * @param className - Additional CSS classes
 */
export const MoreFaqPage: React.FC<MoreFaqPageProps> = ({
  className = '',
}) => {
  const [openItem, setOpenItem] = useState<number | null>(null);
  const accordionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);

  const fallbackContent = getTemplateFor('moreFaq') as MoreFaqPageSection;
  const { data: content } = useContent<MoreFaqPageSection>('moreFaq', fallbackContent);

  // Get main FAQ section to count items for numbering
  const { data: mainFaqContent } = useContent<FaqSectionType>('faq', { faqItems: [] });
  const mainFaqCount = mainFaqContent?.faqItems?.length || 0;

  // Extended FAQ items
  const extendedFaqItems: FaqItem[] = content?.faqItems || fallbackContent.faqItems || [];

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

  const handleToggle = (index: number) => {
    const accordionPane = accordionRefs.current[index];
    if (!accordionPane) return;

    const isCurrentlyOpen = openItem === index;

    if (isCurrentlyOpen) {
      accordionPane.style.height = '0px';
      setOpenItem(null);
    } else {
      closeOtherAccordions(accordionRefs, index);
      openAccordionItem(accordionPane, setOpenItem, index);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleToggle(index);
    }
  };

  return (
    <div ref={pageRef} className={`${styles.pageContainer} ${className}`}>
      <PageHeader
        pageTitle={content?.pageTitle ?? fallbackContent.pageTitle}
        pageSubtitle={content?.pageSubtitle ?? fallbackContent.pageSubtitle}
      />

      {/* FAQ Content */}
      <div className={`${styles.collectionList} ${isVisible ? styles.collectionListVisible : ''}`}>
        {extendedFaqItems.map((item, index) => (
          <FaqAccordionItem
            key={item.id}
            item={item}
            index={index}
            mainFaqCount={mainFaqCount}
            isOpen={openItem === index}
            isVisible={isVisible}
            accordionRef={(el) => {
              if (el) accordionRefs.current[index] = el;
            }}
            onToggle={() => handleToggle(index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
          />
        ))}
      </div>

      <ImageContactSection
        imageUrl={content?.imageUrl ?? fallbackContent.imageUrl}
        contactHeading={content?.contactHeading ?? fallbackContent.contactHeading}
        contactEmail={content?.contactEmail ?? fallbackContent.contactEmail ?? 'hello@hardweyllc.com'}
        contactButtonText={content?.contactButtonText ?? fallbackContent.contactButtonText}
      />
    </div>
  );
};

export default MoreFaqPage;
