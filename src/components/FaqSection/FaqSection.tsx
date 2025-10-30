/**
 * FaqSection component with accordion functionality
 * Replaces the original FAQ section with React implementation
 */

import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FAQ_ITEMS } from '@/utils/constants';
import type { FaqItem } from '@/types';
import styles from './FaqSection.module.css';

interface FaqSectionProps {
  className?: string;
  faqItems?: FaqItem[];
}

/**
 * FAQ section with accordion functionality
 * @param className - Additional CSS classes
 * @param faqItems - Array of FAQ items (defaults to FAQ_ITEMS from constants)
 */
export const FaqSection: React.FC<FaqSectionProps> = ({
  className = '',
  faqItems = FAQ_ITEMS,
}) => {
  const [openItem, setOpenItem] = useState<number | null>(null);
  const accordionRefs = useRef<(HTMLDivElement | null)[]>([]);
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

    if (accordionRefs.current[0]) {
      observer.observe(accordionRefs.current[0]);
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
    <section
      id="faq-it"
      className={`${styles.faqSection} ${className}`}
    >
      <div className={styles.collectionList}>
        {faqItems.map((item, index) => (
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
                {String(index + 1).padStart(2, '0')}
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

{/* Hover overlay removed for simpler design */}
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
                  {item.additionalInfo && (
                    <>
                      <p className={styles.bodyCopy}>
                        {item.additionalInfo[0]}
                      </p>
                      <p className={styles.bodyCopy}>
                        {item.additionalInfo[1]}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* More Questions Button */}
        <Link
          to="/more-faq"
          className={`${styles.accordionItem} ${styles.accordionItemIsButton} ${isVisible ? styles.accordionItemVisible : ''}`}
          style={{ animationDelay: `${faqItems.length * 0.1}s` }}
        >
          <div className={styles.accordionTabButton}>
            <div className={styles.faqNumber}>+10</div>
            <div className={`${styles.faqTitleFlex} ${styles.faqTitleFlexIsNormal}`}>
              <img
                src="https://assets-global.website-files.com/64f45f425cb2cbb837b6f9b8/651005bf084d0dfd92bfc232_moreq.svg"
                alt="More Questions"
                className={styles.faqLarge}
                loading="lazy"
              />
              <img
                src="https://assets-global.website-files.com/64f45f425cb2cbb837b6f9b8/6510063a0f42653485288e95_clickme.svg"
                alt="Click me"
                className={styles.faqSmall}
                loading="lazy"
              />
            </div>
            <div className={styles.arrowDivWrapper}>
              <img
                src="/assets/svg/arrow-red.svg"
                alt=""
                className={styles.arrowDiv}
                loading="lazy"
              />
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
};

export default FaqSection;
