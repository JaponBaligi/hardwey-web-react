/**
 * TermsOfService component
 * Terms of service page with comprehensive terms and conditions
 */

import React, { useState, useEffect, useRef } from 'react';
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
          <h1 className={styles.pageTitle}>Terms of Service</h1>
          <p className={styles.pageSubtitle}>
            Last updated: October 11th, 2025
          </p>
        </div>
      </div>

      {/* Content */}
      <div className={`${styles.contentContainer} ${isVisible ? styles.contentVisible : ''}`}>
        <div className={styles.contentWrapper}>
          <div className={styles.introSection}>
            <p className={styles.introText}>
              Welcome to Hardwey Music, Inc. ("<strong>Hardwey</strong>", "we," "us," "our"), a Delaware corporation. 
              Our operations include the website www.hardweyllc.com (the "Site") and any related offerings that 
              reference these Terms of Use (collectively, the "Services"). Should you wish to connect with us, 
              we invite you to email hello@hardweyllc.io.
            </p>
            <p className={styles.introText}>
              By accessing or utilizing the Services, you, whether acting individually or on behalf of an entity 
              ("you"), enter into a binding contract with Hardwey Music, Inc. based on these Terms of Use. Your 
              use of the Services signifies your comprehensive understanding and unequivocal acceptance of these terms. 
              Should these Terms of Use not reflect your agreement, we must insist that you refrain from using the Services.
            </p>
            <p className={styles.introText}>
              We may occasionally amend these Terms of Use, which will be indicated by an updated "Last updated" date. 
              By continuing to use the Services after revisions are made, you accept and agree to the changes. Please 
              review these terms regularly to ensure you are informed of any updates.
            </p>
            <p className={styles.introText}>
              The Services are designed for individuals who are at least 18 years of age. If you are under 18, please 
              do not use or register for the Services. For your convenience, we suggest keeping a printed copy of these 
              Terms of Use for your records.
            </p>
          </div>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Regarding Our Services</h2>
            <p className={styles.sectionText}>
              Hardwey provides a platform that allows users to invest in artists and their music-related assets. 
              Our services include but are not limited to:
            </p>
            <ul className={styles.sectionList}>
              <li>Artist share trading platform</li>
              <li>Investment management tools</li>
              <li>Financial reporting and analytics</li>
              <li>Customer support and assistance</li>
              <li>Educational resources about music investment</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>User Accounts and Registration</h2>
            <p className={styles.sectionText}>
              To access certain features of our Services, you may be required to create an account. You agree to:
            </p>
            <ul className={styles.sectionList}>
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and update your account information</li>
              <li>Keep your password secure and confidential</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized use</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Investment Risks and Disclaimers</h2>
            <div className={styles.disclaimerSection}>
              <h4 className={styles.disclaimerTitle}>Important Investment Warning</h4>
              <p className={styles.disclaimerText}>
                Investing in artist shares involves significant risks and may result in the loss of your entire investment. 
                Past performance does not guarantee future results. You should carefully consider your investment objectives, 
                level of experience, and risk appetite before making any investment decisions.
              </p>
            </div>
            <p className={styles.sectionText}>
              By using our Services, you acknowledge and agree that:
            </p>
            <ul className={styles.sectionList}>
              <li>All investments carry risk of loss</li>
              <li>You understand the risks associated with music industry investments</li>
              <li>You have the financial capacity to bear potential losses</li>
              <li>You will not hold Hardwey liable for investment losses</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Prohibited Uses</h2>
            <p className={styles.sectionText}>
              You may not use our Services for any unlawful purpose or to solicit others to perform unlawful acts. 
              You agree not to:
            </p>
            <ul className={styles.sectionList}>
              <li>Violate any laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Transmit harmful or malicious code</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with the proper functioning of our Services</li>
              <li>Use our Services for fraudulent or deceptive practices</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Intellectual Property Rights</h2>
            <p className={styles.sectionText}>
              The Services and their original content, features, and functionality are and will remain the exclusive 
              property of Hardwey Music, Inc. and its licensors. The Services are protected by copyright, trademark, 
              and other laws. Our trademarks and trade dress may not be used in connection with any product or service 
              without our prior written consent.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Limitation of Liability</h2>
            <p className={styles.sectionText}>
              In no event shall Hardwey Music, Inc., nor its directors, employees, partners, agents, suppliers, or 
              affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including 
              without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your 
              use of the Services.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Termination</h2>
            <p className={styles.sectionText}>
              We may terminate or suspend your account and bar access to the Services immediately, without prior notice 
              or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not 
              limited to a breach of the Terms.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Governing Law</h2>
            <p className={styles.sectionText}>
              These Terms shall be interpreted and governed by the laws of the State of Delaware, United States, 
              without regard to its conflict of law provisions. Our failure to enforce any right or provision of these 
              Terms will not be considered a waiver of those rights.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Contact Information</h2>
            <p className={styles.sectionText}>
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <div className={styles.contactInfo}>
              <p><strong>Email:</strong> hello@hardweyllc.com</p>
              <p><strong>Address:</strong> Hardwey Music, Inc., Delaware, USA</p>
            </div>
          </section>
        </div>
      </div>

      {/* Footer Actions */}
      <div className={styles.footerActions}>
        <a
          href="mailto:hello@hardweyllc.com"
          className={styles.actionButton}
          aria-label="Contact us for terms questions"
        >
          Contact Us
        </a>
      </div>
    </div>
  );
};

export default TermsOfService;
