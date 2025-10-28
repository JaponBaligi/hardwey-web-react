/**
 * NftDisclaimer component with Mona Lisa image
 * Replaces the original NFT disclaimer section with React implementation
 */

import React, { useEffect, useRef, useState } from 'react';
import styles from './NftDisclaimer.module.css';

interface NftDisclaimerProps {
  className?: string;
}

/**
 * NFT disclaimer section with Mona Lisa image and messaging
 * @param className - Additional CSS classes
 */
export const NftDisclaimer: React.FC<NftDisclaimerProps> = ({ className = '' }) => {
  const sectionRef = useRef<HTMLElement>(null);
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

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleImageLoad = () => {
    // Trigger animations when image loads
    setIsVisible(true);
  };

  return (
    <section
      ref={sectionRef}
      id="not-nfts"
      className={`${styles.nftSection} ${className}`}
    >
      {/* First Row: "Nope" with Mona Lisa */}
      <div className={styles.nftFlex}>
        <div className={`${styles.nftText} ${styles.nftTextLeft} ${isVisible ? styles.nftTextVisible : ''}`}>
          Nope
        </div>
        <img
          src="/assets/img/mona-image2.jpg"
          alt="HARDWEY MONA - Not NFTs, real music investment"
          className={`${styles.imageFull} ${styles.imageFullFit} ${styles.imageFullNft} ${isVisible ? styles.imageVisible : ''}`}
          loading="lazy"
          onLoad={handleImageLoad}
          sizes="(max-width: 767px) 100vw, 21vw"
          srcSet="/assets/img/mona-image2-p-500.jpg 500w, /assets/img/mona-image2-p-800.jpg 800w, /assets/img/mona-image2.jpg 1004w"
        />
      </div>

      {/* Divider with "We're" */}
      <div className={styles.nftDividerFlex}>
        <div className={`${styles.divider} ${styles.dividerNft} ${styles.dividerShort}`}></div>
        <div className={`${styles.subheading} ${styles.subheadingNft} ${styles.subheadingWere} ${isVisible ? styles.subheadingVisible : ''}`}>
          We're
        </div>
        <div className={`${styles.divider} ${styles.dividerNft} ${styles.dividerShort} ${styles.dividerMobile}`}></div>
      </div>

      {/* Second Row: Content with "NOT" graphic */}
      <div className={styles.nftFlex}>
        <div className={`${styles.nftContent} ${isVisible ? styles.nftContentVisible : ''}`}>
          <h4 className={`${styles.valueMusicText} ${isVisible ? styles.subheadingVisible : ''}`}>
            We value mu$ic more than pixels
          </h4>
          <p className={`${styles.resonateText} ${isVisible ? styles.bodyVisible : ''}`}>
            We're building something that resonates with everyone. Not just "PR".
          </p>
          <img
            src="/assets/svg/hardwey-star.svg"
            alt="HARDWEY STAR"
            className={`${styles.nftStar} ${isVisible ? styles.starVisible : ''}`}
            loading="lazy"
          />
        </div>
        <div className={`${styles.notTemp} ${isVisible ? styles.notTempVisible : ''}`}></div>
      </div>

      {/* Full Width Divider */}
      <div className={`${styles.divider} ${styles.dividerNft}`}></div>

      {/* Third Row: "NFTs" with mobile content */}
      <div className={styles.nftFlex}>
        <img
          src="/assets/img/fav.gif"
          alt=""
          className={`${styles.imageFull} ${styles.imageFullGif} ${styles.nftGif} ${isVisible ? styles.nftGifVisible : ''}`}
          loading="lazy"
        />
        <div className={`${styles.nftText} ${isVisible ? styles.nftTextVisible : ''}`}>
          N<span className={styles.extraGap}>F</span>
          <br />
          Ts
        </div>
        
        {/* Mobile Content */}
        <div className={`${styles.nftContent} ${styles.nftContentMobile} ${isVisible ? styles.nftContentVisible : ''}`}>
          <h4 className={`${styles.valueMusicText} ${isVisible ? styles.subheadingVisible : ''}`}>
            We value mu$ic more than pixels
          </h4>
          <p className={`${styles.resonateText} ${isVisible ? styles.bodyVisible : ''}`}>
            we're building something that resonates with everyone. Not just crypto bros.
          </p>
        </div>

        {/* Mobile Image Container */}
        <div className={`${styles.nftImageContainer} ${styles.nftImageContainerMobile}`}>
          <img
            src="/assets/img/mona-image2.jpg"
            alt="HARDWEY MONA - Real music investment, not NFTs"
            className={`${styles.imageFull} ${styles.imageFullFit} ${isVisible ? styles.imageVisible : ''}`}
            loading="lazy"
            sizes="(max-width: 767px) 98vw, 100vw"
            srcSet="/assets/img/mona-image2-p-500.jpg 500w, /assets/img/mona-image2-p-800.jpg 800w, /assets/img/mona-image2.jpg 1004w"
          />
        </div>
      </div>
    </section>
  );
};

export default NftDisclaimer;
