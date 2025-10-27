import React, { useState, useEffect } from 'react';
import styles from './JoinUsModal.module.css';

interface JoinUsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: FormData) => void;
}

interface FormData {
  name: string;
  email: string;
  artist: string;
}

/**
 * Join Us Modal Component
 * Exact recreation of the live Hardwey website modal from static HTML
 * Matches original design, animation, and CSS styling
 */
export const JoinUsModal: React.FC<JoinUsModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    artist: '',
  });
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // Trigger animation after modal is shown
      setTimeout(() => {
        setIsAnimating(true);
      }, 10);
    } else {
      setIsAnimating(false);
      // Delay unmounting to allow closing animation
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Call onSubmit callback if provided
    if (onSubmit) {
      onSubmit(formData);
    } else {
      // Fallback: Create mailto link with form data
      const emailBody = `Pre-Registration for Hardwey Music

Name: ${formData.name}
Email: ${formData.email}
Artist: ${formData.artist}

This is a pre-registration submission from the Hardwey Music.`;
      
      const mailtoLink = `mailto:hello@hardweyllc.com?subject=Pre-registration for Hardwey Music Group&body=${encodeURIComponent(emailBody)}`;
      window.location.href = mailtoLink;
    }
    
    // Reset form
    setFormData({ name: '', email: '', artist: '' });
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!shouldRender) return null;

  return (
    <div 
      className={`${styles.formOverlayWrapper} ${isAnimating ? styles.isOpen : ''}`}
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className={styles.overlayFormTop}>
        <div className={styles.closeContainer}>
          <div className={styles.rotateTarget}>
            <div 
              className={styles.closeIcon}
              onClick={onClose}
              role="button"
              tabIndex={0}
              aria-label="Close modal"
            >
              <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
        <h3 className={styles.footerHeadingWhite}>Join us</h3>
        <div className={styles.horizontalFlexCmNs}>
          <div className={styles.subheadingBlackNmIsw}>A movement</div>
          <div className={styles.subheadingBlackAbsoluteNmIsw}>in</div>
          <div className={styles.subheadingBlackNmIsw}>music</div>
        </div>
      </div>
      <div className={styles.overlayFormWrap}>
        <div className={styles.formExplainerDiv}>
          <p className={styles.bodyCopyBlackLeftFormWhite}>
            Type your name, email and an emerging artist you'd invest in below to Pre-register for Join Us...
          </p>
        </div>
        <div className={styles.footerFormContainerOverlay}>
          <form className={styles.formContainer} onSubmit={handleSubmit}>
            <div className={styles.formFieldDiv}>
              <input
                type="text"
                name="name"
                placeholder="Your name..."
                value={formData.name}
                onChange={handleInputChange}
                className={styles.formFieldTp}
                required
              />
              <img src="/assets/svg/asterixwhite.svg" alt="" className={styles.formStarIcon} />
            </div>
            <div className={styles.formFieldDiv}>
              <input
                type="email"
                name="email"
                placeholder="Your email..."
                value={formData.email}
                onChange={handleInputChange}
                className={styles.formFieldTp}
                required
              />
              <img src="/assets/svg/asterixwhite.svg" alt="" className={styles.formStarIcon} />
            </div>
            <div className={styles.formFieldDiv}>
              <input
                type="text"
                name="artist"
                placeholder="Your artist..."
                value={formData.artist}
                onChange={handleInputChange}
                className={styles.formFieldTpArt}
              />
              <label className={styles.subheadingBlackFormIsw}>
                Name an emerging artist you'd invest in
              </label>
            </div>
            <div className={styles.submitDivOverlay}>
              <button type="submit" className={styles.submitButtonFormBlue}>
                <div className={styles.submitButtonText}>Pre-Register</div>
                <div className={styles.buttonArrow}>
                  <img
                    src="/assets/svg/arrow-black.svg"
                    alt=""
                    className={styles.buttonArrowImg}
                    loading="lazy"
                  />
                  <img
                    src="/assets/svg/arrow-black.svg"
                    alt=""
                    className={styles.buttonArrowImg2}
                    loading="lazy"
                  />
                </div>
              </button>
              <div className={styles.buttonTextDiv}>
                <div className={styles.subheadingBlueFormOverlay}>
                  Don't worry, we won't spam you
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};