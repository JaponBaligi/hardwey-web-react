/**
 * MoreFaqPage component
 * Extended FAQ page with additional questions and answers
 */

import React, { useState, useRef, useEffect } from 'react';
import type { FaqItem } from '@/types';
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

  // Extended FAQ items
  const extendedFaqItems: FaqItem[] = [
    {
      id: 'how-does-it-work',
      question: 'How does it work?',
      subtitle: "It's remarkably simple",
      answer: 'We work closely with artists and their teams to launch their shares on HARDWEY. Just like with stocks, when shares become available on the app, you\'ll be able to buy and trade them all in one place.',
      additionalInfo: ['', ''],
    },
    {
      id: 'what-am-i-buying',
      question: 'What am I actually buying?',
      subtitle: "Not NFTs, that's for sure",
      answer: 'Artists own companies that collect their income from music royalties, shows, merch, and more. With HARDWEY, you\'ll be buying shares in those companies, owning a piece of the pie. You\'re becoming an investor in the artist.',
      additionalInfo: ['', ''],
    },
    {
      id: 'how-do-i-make-money',
      question: 'How do I make money?',
      subtitle: 'Buy low, sell high',
      answer: 'We\'re setting up a market where buying and selling shares takes just a few clicks. If the value of your shares rises, you can sell them to make a profit. Plus, every so often, artists may pay out dividends to their investors.',
      additionalInfo: ['', ''],
    },
    {
      id: 'is-it-safe',
      question: 'Is it safe to invest?',
      subtitle: 'Security is our priority',
      answer: 'We implement industry-standard security measures to protect your investments. All transactions are secured with bank-level encryption, and we work with regulated financial institutions to ensure your funds are safe.',
      additionalInfo: [
        'All investments are backed by real artist assets',
        'We provide transparent reporting on all transactions',
      ],
    },
    {
      id: 'minimum-investment',
      question: 'What\'s the minimum investment?',
      subtitle: 'Start small, dream big',
      answer: 'You can start investing with as little as $10. We believe everyone should have access to music investment opportunities, regardless of their financial situation.',
      additionalInfo: [
        'No hidden fees or charges',
        'Transparent pricing for all transactions',
      ],
    },
    {
      id: 'artist-selection',
      question: 'How do you choose artists?',
      subtitle: 'Quality over quantity',
      answer: 'We carefully vet all artists before they join our platform. We look for established artists with proven track records, strong fan bases, and sustainable revenue streams.',
      additionalInfo: [
        'All artists undergo financial due diligence',
        'We prioritize artists with diverse revenue sources',
      ],
    },
    {
      id: 'trading-hours',
      question: 'When can I trade?',
      subtitle: '24/7 trading available',
      answer: 'Our platform operates 24/7, so you can buy and sell shares whenever you want. However, settlement times may vary depending on market conditions and banking hours.',
      additionalInfo: [
        'Real-time price updates',
        'Instant order execution',
      ],
    },
    {
      id: 'dividends',
      question: 'How do dividends work?',
      subtitle: 'Share in the success',
      answer: 'When artists generate revenue from their music, shows, or merchandise, they may choose to distribute dividends to their shareholders. These payments are proportional to your share ownership.',
      additionalInfo: [
        'Dividends are distributed quarterly',
        'All payments are transparent and trackable',
      ],
    },
    {
      id: 'tax-implications',
      question: 'What are the tax implications?',
      subtitle: 'Stay compliant',
      answer: 'Investment gains and dividends may be subject to taxation depending on your jurisdiction. We recommend consulting with a tax professional to understand your specific tax obligations.',
      additionalInfo: [
        'We provide tax documents for all transactions',
        'Consult your tax advisor for specific guidance',
      ],
    },
    {
      id: 'customer-support',
      question: 'How can I get help?',
      subtitle: 'We\'re here for you',
      answer: 'Our customer support team is available 24/7 to help with any questions or issues. You can reach us through the app, email, or our website chat feature.',
      additionalInfo: [
        'Email: hello@hardweyllc.com',
        'Live chat available in the app',
      ],
    },
  ];

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
          <h1 className={styles.pageTitle}>More FAQ It</h1>
          <p className={styles.pageSubtitle}>
            Everything you need to know about investing in artists
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
          src="https://assets-global.website-files.com/64f45f425cb2cbb837b6f9b8/652ce8621b4433a6c86c936b_1.%20COLOR%20TREATMENT%20%2B%20NOISE%20(FAV).jpg"
          alt=""
          className={styles.imageFull}
          loading="lazy"
        />
        <div className={styles.bodyTextContain}>
          <h4 className={styles.heading2Image}>More questions? We've got more answers</h4>
          <a
            href="mailto:hello@hardweyllc.com"
            className={styles.emailButton}
            aria-label="Email us for support"
          >
            don't be shy, it's okay to send mail
          </a>
        </div>
      </section>
    </div>
  );
};

export default MoreFaqPage;
