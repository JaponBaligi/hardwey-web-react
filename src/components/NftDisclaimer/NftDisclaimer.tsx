/**
 * NftDisclaimer component with Mona Lisa image
 * Replaces the original NFT disclaimer section with React implementation
 */

import React, { useEffect, useRef, useState } from 'react';
import { FaqIntroSection } from '@/components/FaqIntroSection/FaqIntroSection';
import { useContent } from '@/hooks/useContent';
import type { NftDisclaimerSection as NftDisclaimerContent } from '@/types/content';
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

  // Default values matching current hardcoded content for backward compatibility
  const defaultMonaImageUrl = '/assets/img/mona-image2.jpg';
  const defaultMonaImageSrcSet = '/assets/img/mona-image2-p-500.jpg 500w, /assets/img/mona-image2-p-800.jpg 800w, /assets/img/mona-image2.jpg 1004w';

  const { data: content } = useContent<NftDisclaimerContent>('nftDisclaimer', {
    nopeText: 'Nope',
    wereText: "We're",
    nftsText: 'NFTs',
    valueMusicText: 'We value mu$ic more than pixels',
    resonateText: "We're building something that resonates with everyone. Not just \"PR\".",
    resonateTextMobile: "we're building something that resonates with everyone. Not just crypto bros.",
    monaImageUrl: defaultMonaImageUrl,
    monaImageSrcSet: defaultMonaImageSrcSet,
    gifImageUrl: '/assets/img/fav.gif',
    starIconUrl: '/assets/svg/hardwey-star.svg',
    notGraphicUrl: 'https://assets-global.website-files.com/64f45f425cb2cbb837b6f9b8/6510100a109f7d930dd06744_not-svg.svg',
    backgroundColor: '#d12d37',
  });

  const nopeText = content?.nopeText || 'Nope';
  const wereText = content?.wereText || "We're";
  const nftsText = content?.nftsText || 'NFTs';
  const valueMusicText = content?.valueMusicText || 'We value mu$ic more than pixels';
  const resonateText = content?.resonateText || "We're building something that resonates with everyone. Not just \"PR\".";
  const resonateTextMobile = content?.resonateTextMobile || "we're building something that resonates with everyone. Not just crypto bros.";
  const monaImageUrl = content?.monaImageUrl || defaultMonaImageUrl;
  const monaImageSrcSet = content?.monaImageSrcSet || defaultMonaImageSrcSet;
  const gifImageUrl = content?.gifImageUrl || '/assets/img/fav.gif';
  const starIconUrl = content?.starIconUrl || '/assets/svg/hardwey-star.svg';
  const notGraphicUrl = content?.notGraphicUrl || 'https://assets-global.website-files.com/64f45f425cb2cbb837b6f9b8/6510100a109f7d930dd06744_not-svg.svg';
  const backgroundColor = content?.backgroundColor || '#d12d37';

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
      style={{ backgroundColor }}
    >
      {/* First Row: "Nope" with Mona Lisa */}
      <div className={styles.nftFlex}>
        <div className={`${styles.nftText} ${styles.nftTextLeft} ${isVisible ? styles.nftTextVisible : ''}`}>
          {nopeText}
        </div>
        <img
          src={monaImageUrl}
          alt="HARDWEY MONA - Not NFTs, real music investment"
          className={`${styles.imageFull} ${styles.imageFullFit} ${styles.imageFullNft} ${isVisible ? styles.imageVisible : ''}`}
          loading="lazy"
          onLoad={handleImageLoad}
          sizes="(max-width: 767px) 100vw, 21vw"
          srcSet={monaImageSrcSet}
        />
      </div>

      {/* Divider with "We're" */}
      <div className={styles.nftDividerFlex}>
        <div className={`${styles.divider} ${styles.dividerNft} ${styles.dividerShort}`}></div>
        <div className={`${styles.subheading} ${styles.subheadingNft} ${styles.subheadingWere} ${isVisible ? styles.subheadingVisible : ''}`}>
          {wereText}
        </div>
        <div className={`${styles.divider} ${styles.dividerNft} ${styles.dividerShort} ${styles.dividerMobile}`}></div>
      </div>

      {/* Second Row: Content with "NOT" graphic */}
      <div className={styles.nftFlex}>
        <div className={`${styles.nftContent} ${isVisible ? styles.nftContentVisible : ''}`}>
          <h4 className={`${styles.valueMusicText} ${isVisible ? styles.subheadingVisible : ''}`}>
            {valueMusicText}
          </h4>
          <p className={`${styles.resonateText} ${isVisible ? styles.bodyVisible : ''}`}>
            {resonateText}
          </p>
          <img
            src={starIconUrl}
            alt="HARDWEY STAR"
            className={`${styles.nftStar} ${isVisible ? styles.starVisible : ''}`}
            loading="lazy"
          />
        </div>
        <div 
          className={`${styles.notTemp} ${isVisible ? styles.notTempVisible : ''}`}
          style={{ backgroundImage: `url(${notGraphicUrl})` }}
        ></div>
      </div>

      {/* Full Width Divider */}
      <div className={`${styles.divider} ${styles.dividerNft}`}></div>

      {/* Third Row: "NFTs" with mobile content */}
      <div className={styles.nftFlex}>
        <img
          src={gifImageUrl}
          alt=""
          className={`${styles.imageFull} ${styles.imageFullGif} ${styles.nftGif} ${isVisible ? styles.nftGifVisible : ''}`}
          loading="lazy"
        />
        <div className={`${styles.nftText} ${isVisible ? styles.nftTextVisible : ''}`}>
          {nftsText.split('').map((char, idx) => {
            if (char === 'F' && idx === 1) {
              return <span key={idx} className={styles.extraGap}>{char}</span>;
            }
            return <React.Fragment key={idx}>{char}</React.Fragment>;
          })}
        </div>
        
        {/* Mobile Content */}
        <div className={`${styles.nftContent} ${styles.nftContentMobile} ${isVisible ? styles.nftContentVisible : ''}`}>
          <h4 className={`${styles.valueMusicText} ${isVisible ? styles.subheadingVisible : ''}`}>
            {valueMusicText}
          </h4>
          <p className={`${styles.resonateText} ${isVisible ? styles.bodyVisible : ''}`}>
            {resonateTextMobile}
          </p>
        </div>

        {/* Mobile Image Container */}
        <div className={`${styles.nftImageContainer} ${styles.nftImageContainerMobile}`}>
          <img
            src={monaImageUrl}
            alt="HARDWEY MONA - Real music investment, not NFTs"
            className={`${styles.imageFull} ${styles.imageFullFit} ${isVisible ? styles.imageVisible : ''}`}
            loading="lazy"
            sizes="(max-width: 767px) 98vw, 100vw"
            srcSet={monaImageSrcSet}
          />
        </div>
      </div>

      {/* FAQ Intro Section */}
      <div id="faq-it" className={styles.nftFaqFlex}>
        <FaqIntroSection />
      </div>
    </section>
  );
};

export default NftDisclaimer;
