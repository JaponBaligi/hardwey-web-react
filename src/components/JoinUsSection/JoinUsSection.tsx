/**
 * JoinUsSection component
 * Recreates the "Join Us" footer section from the static site
 */

import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './JoinUsSection.module.css';

interface JoinUsSectionProps {
  className?: string;
  onSubmit?: (data: FormData) => void;
}

interface FormData {
  name: string;
  email: string;
  artist: string;
}

/**
 * Join Us section with pre-registration form
 * @param className - Additional CSS classes
 * @param onSubmit - Optional callback for form submission
 */
export const JoinUsSection: React.FC<JoinUsSectionProps> = ({
  className = '',
  onSubmit,
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    artist: '',
  });
  const sectionRef = useRef<HTMLElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (onSubmit) {
      onSubmit(formData);
    } else {
      // Default behavior: Create mailto link
      const emailBody = `Pre-Registration for Hardwey Music

Name: ${formData.name}
Email: ${formData.email}
Artist: ${formData.artist}

This is a pre-registration submission from the Hardwey Music website.`;
      
      const mailtoLink = `mailto:hello@hardweyllc.com?subject=Pre-registration for Hardwey Music Group&body=${encodeURIComponent(emailBody)}`;
      window.location.href = mailtoLink;
    }
    
    // Reset form
    setFormData({ name: '', email: '', artist: '' });
  };

  const headingLetters = ['J', 'O', 'I', 'N', 'U', 'S'];
  const movementText = [
    { text: 'A movement', isAbsolute: false },
    { text: 'in', isAbsolute: true },
    { text: 'music', isAbsolute: false },
  ];

  return (
    <section
      ref={sectionRef}
      id="join-us"
      className={`${styles.footerSection} ${className}`}
    >
      {/* Header Section */}
      <div className={styles.footerHeadingDiv}>
        <div className={styles.footerTitleContain}>
          {headingLetters.map((letter, index) => (
            <div
              key={index}
              className={`${styles.footerHeading} ${
                index === 1 || index === 2 || index === 3 ? styles.footerHeadingIs2 : ''
              } ${index === 4 ? styles.footerHeadingIs3 : ''}`}
            >
              {letter}
            </div>
          ))}
        </div>
        
        {/* A movement in music */}
        <div className={styles.horizontalFlexCmFoot}>
          {movementText.map((item, index) => (
            <div
              key={index}
              className={`${styles.subheadingBlackNm} ${
                item.isAbsolute ? styles.subheadingBlackAbsoluteNm : ''
              }`}
            >
              {item.text}
            </div>
          ))}
        </div>

        {/* Mobile Heading */}
        <div className={styles.footerHeadingMobile}>
          <h2 className={styles.footerHeadingMobileText}>join us</h2>
        </div>
      </div>

      {/* Form Section */}
      <div className={styles.footerBaseDiv}>
        <div className={styles.formExplainerDiv}>
          <p className={styles.bodyCopyBlackLeftForm}>
            Type your name, email and an emerging artist you'd invest in below to Pre-register for Join Us...
          </p>
        </div>

        <div className={styles.footerFormContainer}>
          <form onSubmit={handleSubmit} className={styles.formContainer}>
            <div className={styles.formFieldDiv}>
              <input
                type="text"
                name="name"
                placeholder="Your name..."
                value={formData.name}
                onChange={handleInputChange}
                className={styles.formField}
                required
                maxLength={256}
              />
              <img
                src="/assets/svg/form-star.svg"
                alt=""
                className={styles.formStarIcon}
                loading="lazy"
              />
            </div>

            <div className={styles.formFieldDiv}>
              <input
                type="email"
                name="email"
                placeholder="Your email..."
                value={formData.email}
                onChange={handleInputChange}
                className={styles.formField}
                required
                maxLength={256}
              />
              <img
                src="/assets/svg/form-star.svg"
                alt=""
                className={styles.formStarIcon}
                loading="lazy"
              />
            </div>

            <div className={`${styles.formFieldDiv} ${styles.formFieldDivArtist}`}>
              <input
                type="text"
                name="artist"
                placeholder="Your artist..."
                value={formData.artist}
                onChange={handleInputChange}
                className={`${styles.formField} ${styles.formFieldArtist}`}
                maxLength={256}
              />
              <label className={styles.subheadingBlackForm}>
                Name an emerging artist you'd invest in
              </label>
              <img
                src="/assets/svg/form-star.svg"
                alt=""
                className={`${styles.formStarIcon} ${styles.formStarIconNs}`}
                loading="lazy"
              />
            </div>

            <div className={styles.submitDiv}>
              <button type="submit" className={`${styles.submitButton} ${styles.submitButtonForm}`}>
                Pre-Register
                <div className={styles.buttonArrow}>
                  <img
                    src="/assets/svg/arrow-blue.svg"
                    alt=""
                    className={styles.buttonArrowImg}
                    loading="lazy"
                  />
                  <img
                    src="/assets/svg/arrow-blue.svg"
                    alt=""
                    className={styles.buttonArrowImg2}
                    loading="lazy"
                  />
                </div>
              </button>
              <div className={styles.buttonTextDiv}>
                <div className={styles.subheadingBlueForm}>
                  Don't worry, we won't spam you
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer Links */}
        <div className={styles.footerBaseFlex}>
          <div className={styles.footerLinks}>
            <div className={styles.footerLegals}>
              More Questions? <a href="mailto:hello@hardweyllc.com" className={styles.hyperlink}>Contact us</a>
            </div>
            <div className={styles.footerLegals}>
              Wanna <a href="https://wa.me/+905373178382" target="_blank" rel="noopener noreferrer" className={styles.hyperlink}>Join the team?</a>
            </div>
          </div>
          <div className={styles.footerLinks}>
            <div className={styles.footerLegals}>
              <Link to="/terms-of-service" className={styles.hyperlink}>Terms of Service</Link>
            </div>
            <div className={styles.footerLegals}>
              <Link to="/privacy-policy" className={styles.hyperlink}>Privacy Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JoinUsSection;

