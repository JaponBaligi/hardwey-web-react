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

// Hook for accordion state management
function useAccordionState(
  accordionRefs: React.MutableRefObject<(HTMLDivElement | null)[]>
) {
  const [openItem, setOpenItem] = useState<number | null>(null);

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

  return { openItem, handleToggle };
}

// Component for FAQ list
interface FaqListProps {
  items: FaqItem[];
  mainFaqCount: number;
  isVisible: boolean;
  openItem: number | null;
  accordionRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  onToggle: (index: number) => void;
  onKeyDown: (event: React.KeyboardEvent, index: number) => void;
}

function FaqList({
  items,
  mainFaqCount,
  isVisible,
  openItem,
  accordionRefs,
  onToggle,
  onKeyDown,
}: FaqListProps) {
  return (
    <div className={`${styles.collectionList} ${isVisible ? styles.collectionListVisible : ''}`}>
      {items.map((item, index) => (
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
          onToggle={() => onToggle(index)}
          onKeyDown={(e) => onKeyDown(e, index)}
        />
      ))}
    </div>
  );
}

// Helper to get value with fallback
function getValue<T>(value: T | null | undefined, fallback: T): T {
  return value ?? fallback;
}

// Helper function to normalize FAQ page content
function normalizeFaqPageContent(
  content: MoreFaqPageSection | null | undefined,
  fallbackContent: MoreFaqPageSection
) {
  if (!content) {
    return {
      pageTitle: fallbackContent.pageTitle,
      pageSubtitle: fallbackContent.pageSubtitle,
      faqItems: fallbackContent.faqItems || [],
      imageUrl: fallbackContent.imageUrl,
      contactHeading: fallbackContent.contactHeading,
      contactEmail: getValue(fallbackContent.contactEmail, 'hello@hardweyllc.com'),
      contactButtonText: fallbackContent.contactButtonText,
    };
  }

  return {
    pageTitle: getValue(content.pageTitle, fallbackContent.pageTitle),
    pageSubtitle: getValue(content.pageSubtitle, fallbackContent.pageSubtitle),
    faqItems: content.faqItems || fallbackContent.faqItems || [],
    imageUrl: getValue(content.imageUrl, fallbackContent.imageUrl),
    contactHeading: getValue(content.contactHeading, fallbackContent.contactHeading),
    contactEmail: getValue(content.contactEmail, getValue(fallbackContent.contactEmail, 'hello@hardweyllc.com')),
    contactButtonText: getValue(content.contactButtonText, fallbackContent.contactButtonText),
  };
}

/**
 * Extended FAQ page with comprehensive questions and answers
 * @param className - Additional CSS classes
 */
export const MoreFaqPage: React.FC<MoreFaqPageProps> = ({
  className = '',
}) => {
  const accordionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pageRef = useRef<HTMLDivElement>(null);
  const isVisible = useVisibilityObserver(pageRef);

  const fallbackContent = getTemplateFor('moreFaq') as MoreFaqPageSection;
  const { data: content } = useContent<MoreFaqPageSection>('moreFaq', fallbackContent);

  const { data: mainFaqContent } = useContent<FaqSectionType>('faq', { faqItems: [] });
  const mainFaqCount = mainFaqContent?.faqItems?.length || 0;
  const normalizedContent = normalizeFaqPageContent(content, fallbackContent);

  const { openItem, handleToggle } = useAccordionState(accordionRefs);

  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleToggle(index);
    }
  };

  return (
    <div ref={pageRef} className={`${styles.pageContainer} ${className}`}>
      <PageHeader pageTitle={normalizedContent.pageTitle} pageSubtitle={normalizedContent.pageSubtitle} />

      <FaqList
        items={normalizedContent.faqItems}
        mainFaqCount={mainFaqCount}
        isVisible={isVisible}
        openItem={openItem}
        accordionRefs={accordionRefs}
        onToggle={handleToggle}
        onKeyDown={handleKeyDown}
      />

      <ImageContactSection
        imageUrl={normalizedContent.imageUrl}
        contactHeading={normalizedContent.contactHeading}
        contactEmail={normalizedContent.contactEmail}
        contactButtonText={normalizedContent.contactButtonText}
      />
    </div>
  );
};

export default MoreFaqPage;
