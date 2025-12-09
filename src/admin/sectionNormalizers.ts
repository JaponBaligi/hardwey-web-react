import { getTemplateFor } from '@/types/content';
import type {
  FredAgainSection,
  HeroSection,
  ErrorPageSection,
  FaqIntroSection,
  FaqIntroRecord,
  InvestmentIntroSection,
  PrivacyPolicySection,
  TermsSection,
  InvestmentSection,
  SharesSection,
  TickerSection,
  NftDisclaimerSection,
  FaqSectionType,
  FaqItem,
  FoundersSectionType,
  FounderItem,
  PartnersSectionType,
  CollaborativesSectionType,
  MoreFaqPageSection,
  PartnerItem,
  BaseSection,
  LinkItem
} from '@/types/content';

type NormalizedSection = Record<string, unknown>;

// Helper function to ensure arrays and common fields
function ensureBaseFields(d: Record<string, unknown>): { images: string[]; links: LinkItem[] } {
  const images = Array.isArray(d?.images) ? d.images : [];
  return {
    images: images.filter((img): img is string => typeof img === 'string'),
    links: Array.isArray(d?.links) ? d.links as LinkItem[] : []
  };
}

// Helper to safely get string value
function getString(value: unknown, defaultValue = ''): string {
  return typeof value === 'string' ? value : defaultValue;
}

// Helper to safely get array value
function getArray<T>(value: unknown, defaultValue: T[] = []): T[] {
  return Array.isArray(value) ? value : defaultValue;
}

function normalizeFredAgain(d: Record<string, unknown>): FredAgainSection {
  const base = ensureBaseFields(d);
  return {
    heading: getString(d?.heading),
    subheading: getString(d?.subheading),
    backgroundImage: getString(d?.backgroundImage),
    backgroundImageSrcSet: getString(d?.backgroundImageSrcSet),
    logoUrls: getArray<string>(d?.logoUrls),
    ...base
  };
}

function normalizeHero(d: Record<string, unknown>): HeroSection {
  const base = ensureBaseFields(d);
  return {
    logoUrl: getString(d?.logoUrl),
    backgroundImage: getString(d?.backgroundImage),
    backgroundImageSrcSet: getString(d?.backgroundImageSrcSet),
    mitaText: getString(d?.mitaText),
    subtitle: getString(d?.subtitle),
    leftIdentifier: getString(d?.leftIdentifier),
    rightIdentifier: getString(d?.rightIdentifier),
    motifs: getArray<string>(d?.motifs),
    ...base
  };
}

function normalizeErrorPage(d: Record<string, unknown>): ErrorPageSection {
  const base = ensureBaseFields(d);
  
  const normalizeErrorContent = (errorData: unknown) => {
    if (errorData && typeof errorData === 'object') {
      const err = errorData as Record<string, unknown>;
      return {
        title: getString(err.title),
        description: getString(err.description)
      };
    }
    return { title: '', description: '' };
  };

  return {
    error404: normalizeErrorContent(d?.error404),
    error500: normalizeErrorContent(d?.error500),
    error403: normalizeErrorContent(d?.error403),
    defaultError: normalizeErrorContent(d?.defaultError),
    backButtonText: getString(d?.backButtonText),
    backgroundPatternImage: getString(d?.backgroundPatternImage),
    arrowIcon: getString(d?.arrowIcon),
    ...base
  };
}

function normalizeFaqIntroRecord(r: unknown, idx: number): FaqIntroRecord {
  const record = r as Record<string, unknown>;
  return {
    id: getString(record?.id) || `record-${idx + 1}-${Date.now()}`,
    imageUrl: getString(record?.imageUrl),
    spotifyUrl: getString(record?.spotifyUrl, 'https://open.spotify.com/')
  };
}

function createFaqIntroRecordsFromLegacy(d: Record<string, unknown>): FaqIntroRecord[] {
  const recordCount = typeof d?.recordCount === 'number' && d.recordCount > 0 ? d.recordCount : 1;
  const recordImage = getString(d?.recordImage, '/assets/img/Playlist R&B Retro Nostalgia.png');
  const spotifyUrl = getString(d?.spotifyUrl, 'https://open.spotify.com/');
  return Array.from({ length: recordCount }, (_, idx) => ({
    id: `record-${idx + 1}-${Date.now()}`,
    imageUrl: recordImage,
    spotifyUrl: spotifyUrl
  }));
}

function getFaqIntroRecords(d: Record<string, unknown>): FaqIntroRecord[] {
  if (d?.records && Array.isArray(d.records)) {
    return d.records.map(normalizeFaqIntroRecord);
  }
  if (d?.recordImage || d?.recordCount || d?.spotifyUrl) {
    return createFaqIntroRecordsFromLegacy(d);
  }
  return [{
    id: `record-1-${Date.now()}`,
    imageUrl: '/assets/img/Playlist R&B Retro Nostalgia.png',
    spotifyUrl: 'https://open.spotify.com/'
  }];
}

function normalizeFaqIntro(d: Record<string, unknown>): FaqIntroSection {
  const base = ensureBaseFields(d);
  const records = getFaqIntroRecords(d);
  
  return {
    starCount: typeof d?.starCount === 'number' ? d.starCount : 7,
    records: records,
    ...base
  };
}

function normalizeInvestmentIntro(d: Record<string, unknown>): InvestmentIntroSection {
  const base = ensureBaseFields(d);
  return {
    heading: getString(d?.heading),
    subtitle: getString(d?.subtitle),
    ...base
  };
}

type PolicySectionItem = NonNullable<PrivacyPolicySection['sections']>[number];

function normalizePolicySection(s: unknown): PolicySectionItem {
  const section = s as Record<string, unknown>;
  const contactInfo = section?.contactInfo && typeof section.contactInfo === 'object'
    ? {
        email: getString((section.contactInfo as Record<string, unknown>)?.email),
        address: getString((section.contactInfo as Record<string, unknown>)?.address)
      }
    : undefined;

  return {
    title: getString(section?.title),
    paragraphs: getArray<string>(section?.paragraphs),
    lists: getArray<string[]>(section?.lists),
    contactInfo
  };
}

function getPolicyIntroText(d: Record<string, unknown>): string[] {
  if (Array.isArray(d?.introText)) {
    return (d.introText as unknown[]).filter((t: unknown) => typeof t === 'string') as string[];
  }
  if (typeof d?.introText === 'string') {
    return [d.introText];
  }
  return [];
}

function normalizePrivacyPolicy(d: Record<string, unknown>): PrivacyPolicySection {
  const hasOldFormat = d?.text && !d?.sections && !d?.introText && !d?.pageTitle;
  if (hasOldFormat) {
    d = getTemplateFor('privacyPolicy') as Record<string, unknown>;
  }
  
  const sections = d?.sections && Array.isArray(d.sections)
    ? d.sections.map(normalizePolicySection)
    : [];
  const introText = getPolicyIntroText(d);
  
  return {
    pageTitle: getString(d?.pageTitle, 'Privacy Policy'),
    lastUpdated: getString(d?.lastUpdated),
    introText: introText,
    sections: sections,
    footerButtonText: getString(d?.footerButtonText),
    footerButtonEmail: getString(d?.footerButtonEmail)
  };
}

type TermsSectionItem = NonNullable<TermsSection['sections']>[number];

function normalizeTermsSection(s: unknown): TermsSectionItem {
  const section = s as Record<string, unknown>;
  const disclaimer = section?.disclaimer && typeof section.disclaimer === 'object'
    ? {
        title: getString((section.disclaimer as Record<string, unknown>)?.title),
        text: getString((section.disclaimer as Record<string, unknown>)?.text)
      }
    : undefined;
  const contactInfo = section?.contactInfo && typeof section.contactInfo === 'object'
    ? {
        email: getString((section.contactInfo as Record<string, unknown>)?.email),
        address: getString((section.contactInfo as Record<string, unknown>)?.address)
      }
    : undefined;

  return {
    title: getString(section?.title),
    paragraphs: getArray<string>(section?.paragraphs),
    lists: getArray<string[]>(section?.lists),
    disclaimer,
    contactInfo
  };
}

function normalizeTerms(d: Record<string, unknown>): TermsSection {
  const hasOldFormat = d?.text && !d?.sections && !d?.introText && !d?.pageTitle;
  if (hasOldFormat) {
    d = getTemplateFor('terms') as Record<string, unknown>;
  }
  
  const sections = d?.sections && Array.isArray(d.sections)
    ? d.sections.map(normalizeTermsSection)
    : [];
  const introText = getPolicyIntroText(d);
  
  return {
    pageTitle: getString(d?.pageTitle, 'Terms of Service'),
    lastUpdated: getString(d?.lastUpdated),
    introText: introText,
    sections: sections,
    footerButtonText: getString(d?.footerButtonText),
    footerButtonEmail: getString(d?.footerButtonEmail)
  };
}

function normalizeInvestment(d: Record<string, unknown>): InvestmentSection {
  const base = ensureBaseFields(d);
  return {
    backgroundImage: getString(d?.backgroundImage),
    mainHeading: getString(d?.mainHeading),
    animatedWords: getArray<string>(d?.animatedWords),
    comingSoonTitle: getString(d?.comingSoonTitle),
    dateText: getString(d?.dateText),
    logoImage: getString(d?.logoImage),
    welcomeText: getString(d?.welcomeText),
    ...base
  };
}

function normalizeShares(d: Record<string, unknown>): SharesSection {
  const base = ensureBaseFields(d);
  return {
    heading: getString(d?.heading),
    subheadingMobile: getString(d?.subheadingMobile),
    subheadingWords: getArray<string>(d?.subheadingWords),
    bodyCopy: getString(d?.bodyCopy),
    imageUrl: getString(d?.imageUrl),
    imageSrcSet: getString(d?.imageSrcSet),
    ...base
  };
}

function normalizeTicker(d: Record<string, unknown>): TickerSection {
  const base = ensureBaseFields(d);
  return {
    backgroundColor: getString(d?.backgroundColor, '#bbdbfa'),
    tickerWords: getArray<string>(d?.tickerWords),
    ...base
  };
}

function normalizeNftDisclaimer(d: Record<string, unknown>): NftDisclaimerSection {
  const base = ensureBaseFields(d);
  return {
    nopeText: getString(d?.nopeText, 'Nope'),
    wereText: getString(d?.wereText, "We're"),
    nftsText: getString(d?.nftsText, 'NFTs'),
    valueMusicText: getString(d?.valueMusicText, 'We value mu$ic more than pixels'),
    resonateText: getString(d?.resonateText, 'We\'re building something that resonates with everyone. Not just "PR".'),
    resonateTextMobile: getString(d?.resonateTextMobile, "we're building something that resonates with everyone. Not just crypto bros."),
    monaImageUrl: getString(d?.monaImageUrl, '/assets/img/mona-image2.jpg'),
    monaImageSrcSet: getString(d?.monaImageSrcSet),
    gifImageUrl: getString(d?.gifImageUrl, '/assets/img/fav.gif'),
    starIconUrl: getString(d?.starIconUrl, '/assets/svg/hardwey-star.svg'),
    notGraphicUrl: getString(d?.notGraphicUrl, 'https://assets-global.website-files.com/64f45f425cb2cbb837b6f9b8/6510100a109f7d930dd06744_not-svg.svg'),
    backgroundColor: getString(d?.backgroundColor, '#d12d37'),
    ...base
  };
}

function normalizeFaq(d: Record<string, unknown>): FaqSectionType {
  const base = ensureBaseFields(d);
  
  const normalizeFaqItem = (item: unknown): FaqItem => {
    const faqItem = item as Record<string, unknown>;
    return {
      id: getString(faqItem?.id) || `faq-${Date.now()}`,
      question: getString(faqItem?.question),
      subtitle: getString(faqItem?.subtitle),
      answer: getString(faqItem?.answer),
      additionalInfo: getArray<string>(faqItem?.additionalInfo, ['', ''])
    };
  };
  
  return {
    faqItems: getArray(d?.faqItems).map(normalizeFaqItem),
    ...base
  };
}

function normalizeFounders(d: Record<string, unknown>): FoundersSectionType {
  const base = ensureBaseFields(d);
  
  const normalizeFounderItem = (item: unknown): FounderItem => {
    const founder = item as Record<string, unknown>;
    return {
      id: getString(founder?.id) || `founder-${Date.now()}`,
      name: getString(founder?.name),
      role: getString(founder?.role),
      bio: getString(founder?.bio),
      quote: getString(founder?.quote),
      imageUrl: getString(founder?.imageUrl),
      imageSrcSet: getString(founder?.imageSrcSet),
      additionalInfo: getArray<string>(founder?.additionalInfo)
    };
  };
  
  return {
    founders: getArray(d?.founders).map(normalizeFounderItem),
    heading: getString(d?.heading),
    headingSingular: getString(d?.headingSingular),
    animatedWords: getArray<string>(d?.animatedWords),
    animatedTextMobile: getString(d?.animatedTextMobile),
    ...base
  };
}

function normalizePartners(d: Record<string, unknown>): PartnersSectionType {
  const base = ensureBaseFields(d);
  
  const normalizeSocialLink = (sl: unknown): { platform: string; url: string } => {
    const social = sl as Record<string, unknown>;
    return {
      platform: getString(social?.platform),
      url: getString(social?.url)
    };
  };
  
  const normalizePartnerItem = (item: unknown, index: number): PartnerItem => {
    const partner = item as Record<string, unknown>;
    return {
      id: getString(partner?.id) || `partner-${index}-${Date.now()}`,
      name: getString(partner?.name),
      title: getString(partner?.title),
      description: getString(partner?.description),
      imageUrl: getString(partner?.imageUrl),
      imageSrcSet: getString(partner?.imageSrcSet),
      websiteUrl: getString(partner?.websiteUrl),
      socialLinks: getArray(partner?.socialLinks).map(normalizeSocialLink)
    };
  };
  
  return {
    pageTitle: getString(d?.pageTitle),
    pageSubtitle: getString(d?.pageSubtitle),
    partners: getArray(d?.partners).map((item, index) => normalizePartnerItem(item, index)),
    ...base
  };
}

function normalizeCollaboratives(d: Record<string, unknown>): CollaborativesSectionType {
  const base = ensureBaseFields(d);
  
  const normalizeSocialLink = (sl: unknown): { platform: string; url: string } => {
    const social = sl as Record<string, unknown>;
    return {
      platform: getString(social?.platform),
      url: getString(social?.url)
    };
  };
  
  const normalizeCollaborativeItem = (item: unknown, index: number): PartnerItem => {
    const collaborative = item as Record<string, unknown>;
    return {
      id: getString(collaborative?.id) || `collaborative-${index}-${Date.now()}`,
      name: getString(collaborative?.name),
      title: getString(collaborative?.title),
      description: getString(collaborative?.description),
      imageUrl: getString(collaborative?.imageUrl),
      imageSrcSet: getString(collaborative?.imageSrcSet),
      websiteUrl: getString(collaborative?.websiteUrl),
      socialLinks: getArray(collaborative?.socialLinks).map(normalizeSocialLink)
    };
  };
  
  return {
    heading: getString(d?.heading),
    collaboratives: getArray(d?.collaboratives).map((item, index) => normalizeCollaborativeItem(item, index)),
    ...base
  };
}

function normalizeMoreFaq(d: Record<string, unknown>): MoreFaqPageSection & BaseSection {
  const base = ensureBaseFields(d);
  
  const normalizeFaqItem = (item: unknown, index: number): FaqItem => {
    const faqItem = item as Record<string, unknown>;
    let additionalInfo: string[] = ['', ''];
    
    if (Array.isArray(faqItem?.additionalInfo) && faqItem.additionalInfo.length >= 2) {
      additionalInfo = (faqItem.additionalInfo as unknown[]).slice(0, 2) as string[];
    } else if (Array.isArray(faqItem?.additionalInfo) && faqItem.additionalInfo.length === 1) {
      additionalInfo = [faqItem.additionalInfo[0] as string, ''];
    } else if (typeof faqItem?.additionalInfo === 'string') {
      additionalInfo = [faqItem.additionalInfo, ''];
    }
    
    return {
      id: getString(faqItem?.id) || `faq-item-${index}-${Date.now()}`,
      question: getString(faqItem?.question),
      subtitle: getString(faqItem?.subtitle),
      answer: getString(faqItem?.answer),
      additionalInfo: additionalInfo
    };
  };
  
  let faqItems: FaqItem[] = [];
  if (d?.faqItems && Array.isArray(d.faqItems)) {
    faqItems = d.faqItems.map((item: unknown, index: number) => normalizeFaqItem(item, index));
  }
  
  return {
    pageTitle: getString(d?.pageTitle),
    pageSubtitle: getString(d?.pageSubtitle),
    faqItems: faqItems,
    imageUrl: getString(d?.imageUrl),
    contactHeading: getString(d?.contactHeading),
    contactButtonText: getString(d?.contactButtonText),
    contactEmail: getString(d?.contactEmail),
    ...base
  };
}

type NormalizerFunction = (d: Record<string, unknown>) => NormalizedSection;

const SECTION_NORMALIZERS: Record<string, NormalizerFunction> = {
  fredAgain: (d) => normalizeFredAgain(d) as NormalizedSection,
  hero: (d) => normalizeHero(d) as NormalizedSection,
  errorPage: (d) => normalizeErrorPage(d) as NormalizedSection,
  faqIntro: (d) => normalizeFaqIntro(d) as NormalizedSection,
  investmentIntro: (d) => normalizeInvestmentIntro(d) as NormalizedSection,
  privacyPolicy: (d) => normalizePrivacyPolicy(d) as NormalizedSection,
  terms: (d) => normalizeTerms(d) as NormalizedSection,
  investment: (d) => normalizeInvestment(d) as NormalizedSection,
  shares: (d) => normalizeShares(d) as NormalizedSection,
  ticker: (d) => normalizeTicker(d) as NormalizedSection,
  nftDisclaimer: (d) => normalizeNftDisclaimer(d) as NormalizedSection,
  faq: (d) => normalizeFaq(d) as NormalizedSection,
  founders: (d) => normalizeFounders(d) as NormalizedSection,
  partners: (d) => normalizePartners(d) as NormalizedSection,
  collaboratives: (d) => normalizeCollaboratives(d) as NormalizedSection,
  moreFaq: (d) => normalizeMoreFaq(d) as NormalizedSection,
};

export function normalizeSectionData(section: string, d: unknown): NormalizedSection {
  const data = (d as Record<string, unknown>) || {};
  const normalizer = SECTION_NORMALIZERS[section];
  
  if (normalizer) {
    return normalizer(data);
  }
  
  return {
    text: getString(data?.text),
    ...ensureBaseFields(data)
  };
}
