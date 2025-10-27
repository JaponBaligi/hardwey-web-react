/**
 * MoreFaqPage component
 * Extended FAQ page with additional questions and answers
 */

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
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

  const toggleItem = (itemId: string) => {
    setOpenItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const handleBackToHome = () => {
    navigate('/', { replace: true });
  };

  return (
    <div ref={pageRef} className={`${styles.pageContainer} ${className}`}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <button
          className={styles.backButton}
          onClick={handleBackToHome}
          aria-label="Back to home"
          type="button"
        >
          <img
            src="/assets/svg/arrow-black.svg"
            alt=""
            className={styles.backArrow}
            loading="lazy"
          />
          Back to Home
        </button>

        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>More FAQ It</h1>
          <p className={styles.pageSubtitle}>
            Everything you need to know about investing in artists
          </p>
        </div>
      </div>

      {/* FAQ Content */}
      <div className={`${styles.faqContainer} ${isVisible ? styles.faqContainerVisible : ''}`}>
        {extendedFaqItems.map((item, index) => (
          <div
            key={item.id}
            className={`${styles.faqItem} ${openItems.has(item.id) ? styles.faqItemOpen : ''}`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <button
              className={styles.faqButton}
              onClick={() => toggleItem(item.id)}
              aria-expanded={openItems.has(item.id)}
              aria-controls={`faq-content-${item.id}`}
              type="button"
            >
              <div className={styles.faqNumber}>
                {String(index + 1).padStart(2, '0')}
              </div>
              
              <div className={styles.faqContent}>
                <h3 className={styles.faqQuestion}>
                  {item.question}
                </h3>
                <p className={styles.faqSubtitle}>
                  {item.subtitle}
                </p>
              </div>

              <div className={styles.faqArrow}>
                <img
                  src="/assets/svg/arrow-black.svg"
                  alt=""
                  className={styles.arrowIcon}
                  loading="lazy"
                />
              </div>

              <div className={styles.faqHover} />
            </button>

            <div
              id={`faq-content-${item.id}`}
              className={`${styles.faqAnswer} ${openItems.has(item.id) ? styles.faqAnswerOpen : ''}`}
            >
              <div className={styles.answerContent}>
                <p className={styles.answerText}>
                  {item.answer}
                </p>
                
                {item.additionalInfo && item.additionalInfo.length > 0 && (
                  <ul className={styles.additionalInfo}>
                    {item.additionalInfo.map((info, infoIndex) => (
                      info && (
                        <li key={infoIndex} className={styles.additionalItem}>
                          {info}
                        </li>
                      )
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Contact Section */}
      <div className={styles.contactSection}>
        <h2 className={styles.contactTitle}>Still have questions?</h2>
        <p className={styles.contactText}>
          Our team is here to help. Reach out to us anytime.
        </p>
        <div className={styles.contactButtons}>
          <a
            href="mailto:hello@hardweyllc.com"
            className={styles.contactButton}
            aria-label="Email us for support"
          >
            Email Support
          </a>
          <button
            className={styles.contactButton}
            onClick={handleBackToHome}
            type="button"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoreFaqPage;
