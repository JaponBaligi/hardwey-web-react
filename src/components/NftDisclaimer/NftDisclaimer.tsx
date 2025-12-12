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

// Default NFT content values
const DEFAULT_NFT_CONTENT = {
  nopeText: 'Nope',
  wereText: "We're",
  nftsText: 'NFTs',
  valueMusicText: 'We value mu$ic more than pixels',
  resonateText: "We're building something that resonates with everyone. Not just \"PR\".",
  resonateTextMobile: "we're building something that resonates with everyone. Not just crypto bros.",
  monaImageUrl: '/assets/img/mona-image2.jpg',
  monaImageSrcSet: '/assets/img/mona-image2-p-500.jpg 500w, /assets/img/mona-image2-p-800.jpg 800w, /assets/img/mona-image2.jpg 1004w',
  gifImageUrl: '/assets/img/fav.gif',
  starIconUrl: '/assets/svg/hardwey-star.svg',
  notGraphicUrl: 'https://assets-global.website-files.com/64f45f425cb2cbb837b6f9b8/6510100a109f7d930dd06744_not-svg.svg',
  backgroundColor: '#d12d37',
} as const;

// Helper function to resolve content values with defaults
function resolveNftContent(content: NftDisclaimerContent | null | undefined) {
  if (!content) {
    return DEFAULT_NFT_CONTENT;
  }

  return {
    nopeText: content.nopeText || DEFAULT_NFT_CONTENT.nopeText,
    wereText: content.wereText || DEFAULT_NFT_CONTENT.wereText,
    nftsText: content.nftsText || DEFAULT_NFT_CONTENT.nftsText,
    valueMusicText: content.valueMusicText || DEFAULT_NFT_CONTENT.valueMusicText,
    resonateText: content.resonateText || DEFAULT_NFT_CONTENT.resonateText,
    resonateTextMobile: content.resonateTextMobile || DEFAULT_NFT_CONTENT.resonateTextMobile,
    monaImageUrl: content.monaImageUrl || DEFAULT_NFT_CONTENT.monaImageUrl,
    monaImageSrcSet: content.monaImageSrcSet || DEFAULT_NFT_CONTENT.monaImageSrcSet,
    gifImageUrl: content.gifImageUrl || DEFAULT_NFT_CONTENT.gifImageUrl,
    starIconUrl: content.starIconUrl || DEFAULT_NFT_CONTENT.starIconUrl,
    notGraphicUrl: content.notGraphicUrl || DEFAULT_NFT_CONTENT.notGraphicUrl,
    backgroundColor: content.backgroundColor || DEFAULT_NFT_CONTENT.backgroundColor,
  };
}

// Component for first row with "Nope" and Mona Lisa
interface NftFirstRowProps {
  nopeText: string;
  monaImageUrl: string;
  monaImageSrcSet: string;
  isVisible: boolean;
  onImageLoad: () => void;
}

function NftFirstRow({ nopeText, monaImageUrl, monaImageSrcSet, isVisible, onImageLoad }: NftFirstRowProps) {
  return (
    <div className={styles.nftFlex}>
      <div className={`${styles.nftText} ${styles.nftTextLeft} ${isVisible ? styles.nftTextVisible : ''}`}>
        {nopeText}
      </div>
      <img
        src={monaImageUrl || undefined}
        alt="HARDWEY MONA - Not NFTs, real music investment"
        className={`${styles.imageFull} ${styles.imageFullFit} ${styles.imageFullNft} ${isVisible ? styles.imageVisible : ''}`}
        loading="lazy"
        onLoad={onImageLoad}
        sizes="(max-width: 767px) 100vw, 21vw"
        srcSet={monaImageSrcSet}
      />
    </div>
  );
}

// Component for second row with content and NOT graphic
interface NftSecondRowProps {
  valueMusicText: string;
  resonateText: string;
  starIconUrl: string;
  notGraphicUrl: string;
  isVisible: boolean;
}

function NftSecondRow({ valueMusicText, resonateText, starIconUrl, notGraphicUrl, isVisible }: NftSecondRowProps) {
  return (
    <div className={styles.nftFlex}>
      <div className={`${styles.nftContent} ${isVisible ? styles.nftContentVisible : ''}`}>
        <h4 className={`${styles.valueMusicText} ${isVisible ? styles.subheadingVisible : ''}`}>
          {valueMusicText}
        </h4>
        <p className={`${styles.resonateText} ${isVisible ? styles.bodyVisible : ''}`}>
          {resonateText}
        </p>
        <img
          src={starIconUrl || undefined}
          alt="HARDWEY STAR"
          className={`${styles.nftStar} ${isVisible ? styles.starVisible : ''}`}
          loading="lazy"
        />
      </div>
      <div 
        className={`${styles.notTemp} ${isVisible ? styles.notTempVisible : ''}`}
        style={{ backgroundImage: `url(${notGraphicUrl})` }}
      />
    </div>
  );
}

// Component for third row with NFTs text and mobile content
interface NftThirdRowProps {
  nftsText: string;
  gifImageUrl: string;
  valueMusicText: string;
  resonateTextMobile: string;
  monaImageUrl: string;
  monaImageSrcSet: string;
  isVisible: boolean;
}

function NftThirdRow({ nftsText, gifImageUrl, valueMusicText, resonateTextMobile, monaImageUrl, monaImageSrcSet, isVisible }: NftThirdRowProps) {
  return (
    <div className={styles.nftFlex}>
      <img
        src={gifImageUrl || undefined}
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
          src={monaImageUrl || undefined}
          alt="HARDWEY MONA - Real music investment, not NFTs"
          className={`${styles.imageFull} ${styles.imageFullFit} ${isVisible ? styles.imageVisible : ''}`}
          loading="lazy"
          sizes="(max-width: 767px) 98vw, 100vw"
          srcSet={monaImageSrcSet}
        />
      </div>
    </div>
  );
}

/**
 * NFT disclaimer section with Mona Lisa image and messaging
 * @param className - Additional CSS classes
 */
export const NftDisclaimer: React.FC<NftDisclaimerProps> = ({ className = '' }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const { data: content } = useContent<NftDisclaimerContent>('nftDisclaimer', DEFAULT_NFT_CONTENT);

  const resolvedContent = resolveNftContent(content);

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
    setIsVisible(true);
  };

  return (
    <section
      ref={sectionRef}
      id="not-nfts"
      className={`${styles.nftSection} ${className}`}
      style={{ backgroundColor: resolvedContent.backgroundColor }}
    >
      {/* First Row: "Nope" with Mona Lisa */}
      <NftFirstRow
        nopeText={resolvedContent.nopeText}
        monaImageUrl={resolvedContent.monaImageUrl}
        monaImageSrcSet={resolvedContent.monaImageSrcSet}
        isVisible={isVisible}
        onImageLoad={handleImageLoad}
      />

      {/* Divider with "We're" */}
      <div className={styles.nftDividerFlex}>
        <div className={`${styles.divider} ${styles.dividerNft} ${styles.dividerShort}`}></div>
        <div className={`${styles.subheading} ${styles.subheadingNft} ${styles.subheadingWere} ${isVisible ? styles.subheadingVisible : ''}`}>
          {resolvedContent.wereText}
        </div>
        <div className={`${styles.divider} ${styles.dividerNft} ${styles.dividerShort} ${styles.dividerMobile}`}></div>
      </div>

      {/* Second Row: Content with "NOT" graphic */}
      <NftSecondRow
        valueMusicText={resolvedContent.valueMusicText}
        resonateText={resolvedContent.resonateText}
        starIconUrl={resolvedContent.starIconUrl}
        notGraphicUrl={resolvedContent.notGraphicUrl}
        isVisible={isVisible}
      />

      {/* Full Width Divider */}
      <div className={`${styles.divider} ${styles.dividerNft}`}></div>

      {/* Third Row: "NFTs" with mobile content */}
      <NftThirdRow
        nftsText={resolvedContent.nftsText}
        gifImageUrl={resolvedContent.gifImageUrl}
        valueMusicText={resolvedContent.valueMusicText}
        resonateTextMobile={resolvedContent.resonateTextMobile}
        monaImageUrl={resolvedContent.monaImageUrl}
        monaImageSrcSet={resolvedContent.monaImageSrcSet}
        isVisible={isVisible}
      />

      {/* FAQ Intro Section */}
      <div id="faq-it" className={styles.nftFaqFlex}>
        <FaqIntroSection />
      </div>
    </section>
  );
};

export default NftDisclaimer;
