/**
 * MoreFaqPage component
 * Extended FAQ page with additional questions and answers
 */

import React, { useState, useRef, useEffect } from 'react';
import type { FaqItem } from '@/types';
import { useContent } from '@/hooks/useContent';
import type { MoreFaqPageSection } from '@/types/content';
import { getTemplateFor } from '@/types/content';
import styles from './MoreFaqPage.module.css';

interface MoreFaqPageProps {
  className?: string;
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
      // Close the current item
      accordionPane.style.height = '0px';
      setOpenItem(null);
    } else {
      // Close all other items first
      accordionRefs.current.forEach((ref, refIndex) => {
        if (ref && refIndex !== index) {
          ref.style.height = '0px';
        }
      });

      // Open the selected item
      const naturalHeight = accordionPane.scrollHeight + 'px';
      accordionPane.style.height = '0px';
      setOpenItem(index);

      // Animate to natural height
      requestAnimationFrame(() => {
        accordionPane.style.height = naturalHeight;
      });
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
      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>{content?.pageTitle || fallbackContent.pageTitle}</h1>
          <p className={styles.pageSubtitle}>
            {content?.pageSubtitle || fallbackContent.pageSubtitle}
          </p>
        </div>
      </div>

      {/* FAQ Content */}
      <div className={`${styles.collectionList} ${isVisible ? styles.collectionListVisible : ''}`}>
        {extendedFaqItems.map((item, index) => (
          <div
            key={item.id}
            role="listitem"
            className={`${styles.accordionItem} ${isVisible ? styles.accordionItemVisible : ''}`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <button
              type="button"
              className={`${styles.accordionTabButton} ${openItem === index ? styles.accordionTabButtonActive : ''}`}
              onClick={() => handleToggle(index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              aria-expanded={openItem === index}
              aria-controls={`faq-panel-${item.id}`}
              aria-label={`Toggle FAQ: ${item.question}`}
            >
              {/* FAQ Number - Absolutely positioned */}
              <div className={styles.faqNumber}>
                {String(index + 6).padStart(2, '0')}
              </div>

              {/* FAQ Title Flex */}
              <div className={styles.faqTitleFlex}>
                <h3 className={`${styles.heading3} ${styles.heading3IsFaq}`}>
                  {item.question}
                </h3>
                <p className={styles.faqSupportTxt}>
                  {item.subtitle}
                </p>
              </div>

              {/* Arrow Wrapper */}
              <div className={styles.arrowDivWrapper}>
                <img
                  src="/assets/svg/arrow-red.svg"
                  alt=""
                  className={`${styles.arrowDiv} ${openItem === index ? styles.arrowDivActive : ''}`}
                  loading="lazy"
                />
              </div>
            </button>

            {/* Accordion Pane */}
            <div
              ref={(el) => {
                if (el) accordionRefs.current[index] = el;
              }}
              id={`faq-panel-${item.id}`}
              className={styles.accordionPane}
              style={{ height: '0px' }}
              aria-hidden={openItem !== index}
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
        ))}
      </div>

      {/* Image Section with Contact */}
      <section className={styles.imageSection}>
        <img
          src={content?.imageUrl || fallbackContent.imageUrl || ''}
          alt=""
          className={styles.imageFull}
          loading="lazy"
        />
        <div className={styles.bodyTextContain}>
          <h4 className={styles.heading2Image}>
            {content?.contactHeading || fallbackContent.contactHeading}
          </h4>
          <a
            href={`mailto:${content?.contactEmail || fallbackContent.contactEmail || 'hello@hardweyllc.com'}`}
            className={styles.emailButton}
            aria-label="Email us for support"
          >
            {content?.contactButtonText || fallbackContent.contactButtonText}
          </a>
        </div>
      </section>
    </div>
  );
};

export default MoreFaqPage;
