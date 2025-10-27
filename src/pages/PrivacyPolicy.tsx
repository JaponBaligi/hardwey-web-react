/**
 * PrivacyPolicy component
 * Privacy policy page with comprehensive privacy information
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './PrivacyPolicy.module.css';

interface PrivacyPolicyProps {
  className?: string;
}

/**
 * Privacy policy page with comprehensive privacy information
 * @param className - Additional CSS classes
 */
export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({
  className = '',
}) => {
  const navigate = useNavigate();
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
          <h1 className={styles.pageTitle}>Privacy Policy</h1>
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
              reference this Privacy Policy (collectively, the "Services"). Should you wish to connect with us, 
              we invite you to email hello@hardweyllc.io.
            </p>
            <p className={styles.introText}>
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you 
              visit our website or use our services. Please read this privacy policy carefully. If you do not agree 
              with the terms of this privacy policy, please do not access the site.
            </p>
          </div>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Information We Collect</h2>
            <p className={styles.sectionText}>
              We may collect information about you in a variety of ways. The information we may collect via the 
              Services includes:
            </p>
            <ul className={styles.sectionList}>
              <li>Personal information you provide to us (name, email address, phone number, etc.)</li>
              <li>Account information and credentials</li>
              <li>Financial information for investment purposes</li>
              <li>Communication preferences and history</li>
              <li>Device information and usage data</li>
              <li>Cookies and tracking technologies</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>How We Use Your Information</h2>
            <p className={styles.sectionText}>
              We collect information strictly for the following outlined purposes and will not process this 
              information in ways not aligned with these activities:
            </p>
            <ul className={styles.sectionList}>
              <li>To upkeep and monitor our Service</li>
              <li>To oversee your user account, allowing access to our Service's features for registered users</li>
              <li>To communicate with you through various channels for updates or information regarding the Service</li>
              <li>To offer you updates, deals, and information about our goods, services, and events</li>
              <li>To handle and respond to your requests and inquiries, offer support, and improve our Service</li>
              <li>To comply with legal, court, and governmental directives</li>
              <li>For internal administration and auditing</li>
              <li>To identify and protect against fraudulent or illegal activities</li>
              <li>For data analysis, trend identification, and Service enhancement</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Security of Your Personal Information</h2>
            <p className={styles.sectionText}>
              We safeguard your personal information with commercially viable tools to prevent loss, theft, 
              unauthorized access, exposure, duplication, usage, or alteration. Despite our efforts, we recognize 
              that no electronic transmission or storage method is infallible, and absolute security cannot be 
              guaranteed. We are committed to adhering to our legal obligations in the event of a data breach.
            </p>
            <p className={styles.sectionText}>
              You play a vital role in maintaining the security of your personal data, particularly in the 
              management of your password's strength and confidentiality within our services.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Retention of Personal Information</h2>
            <p className={styles.sectionText}>
              We retain your personal information for no longer than necessary, based on the purpose outlined 
              in this policy. Once your information is no longer required, we will either delete it or anonymize it. 
              Nonetheless, we may hold onto your information to fulfill legal or regulatory duties or for certain 
              research purposes where appropriate.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Children's Privacy</h2>
            <p className={styles.sectionText}>
              Our services do not target children under the age of 13, and we do not intentionally gather 
              information from them. If you are a parent or guardian and believe your child has provided us with 
              personal information, please contact us immediately.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>International Data Transfers</h2>
            <p className={styles.sectionText}>
              We store and process personal information in various locations where our facilities or service 
              providers are situated. These international transfers are conducted in compliance with relevant laws, 
              and we ensure that your personal data is protected in line with this policy.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Your Rights</h2>
            <p className={styles.sectionText}>
              You have the discretion to share or withhold your personal information, which may affect your 
              website experience. We will not discriminate against any exercise of your privacy rights. If you 
              do share information with us, it will be handled in accordance with this policy.
            </p>
            <p className={styles.sectionText}>
              You may withdraw consent for marketing communications at any time. To assist us in verifying your 
              identity, we may need to ask for specific information from you.
            </p>
            <p className={styles.sectionText}>
              Should you find any inaccuracies in your information, please inform us. We will promptly correct 
              any erroneous data.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Policy Changes</h2>
            <p className={styles.sectionText}>
              We may update this privacy policy to reflect changes in our practices or legal updates, posting 
              the new version at this link. If legally required, we will seek your consent for any new policy 
              aspects that affect how we handle your personal information.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Contact Information</h2>
            <p className={styles.sectionText}>
              If you have any questions about this Privacy Policy, please contact us at:
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
        <button
          className={styles.actionButton}
          onClick={handleBackToHome}
          type="button"
        >
          Back to Home
        </button>
        <a
          href="mailto:hello@hardweyllc.com"
          className={styles.actionButton}
          aria-label="Contact us for privacy questions"
        >
          Contact Us
        </a>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
