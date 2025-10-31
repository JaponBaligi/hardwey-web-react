export type UrlString = string;

export interface LinkItem { label: string; url: UrlString }

export interface BaseSection {
  text?: string;
  images?: UrlString[];
  links?: LinkItem[];
}

export interface HeroSection extends BaseSection {
  logoUrl?: UrlString;
  backgroundImage?: UrlString;
  backgroundImageSrcSet?: string;
  mitaText?: string;
  subtitle?: string;
  leftIdentifier?: UrlString;
  rightIdentifier?: UrlString;
  motifs?: UrlString[];
}

export interface IntroSection extends BaseSection {
  heading?: string;
  headingMobile?: string;
  subheadingWords?: string[];
  comingSoon?: string;
  date?: string;
  welcomeText?: string;
}
export interface SharesSection extends BaseSection {
  heading?: string;
  subheadingMobile?: string;
  subheadingWords?: string[];
  bodyCopy?: string;
  imageUrl?: UrlString;
  imageSrcSet?: string;
}
export interface TickerSection extends BaseSection {
  backgroundColor?: string;
  tickerWords?: string[];
}
export interface InvestmentIntroSection extends BaseSection {
  heading?: string;
  subtitle?: string;
}
export interface InvestmentSection extends BaseSection {
  backgroundImage?: UrlString;
  mainHeading?: string;
  animatedWords?: string[];
  comingSoonTitle?: string;
  dateText?: string;
  logoImage?: UrlString;
  welcomeText?: string;
}
export interface NftDisclaimerSection extends BaseSection {
  nopeText?: string;
  wereText?: string;
  nftsText?: string;
  valueMusicText?: string;
  resonateText?: string;
  resonateTextMobile?: string;
  monaImageUrl?: UrlString;
  monaImageSrcSet?: string;
  gifImageUrl?: UrlString;
  starIconUrl?: UrlString;
  notGraphicUrl?: UrlString;
  backgroundColor?: string;
}
export interface FaqSectionType extends BaseSection {
  faqItems?: FaqItem[];
}
export interface FredAgainSection extends BaseSection {
  heading?: string;
  subheading?: string;
  backgroundImage?: UrlString;
  backgroundImageSrcSet?: string;
  logoUrls?: UrlString[];
}
export interface FounderItem {
  id?: string;
  name: string;
  role: string;
  bio: string;
  quote: string;
  imageUrl: UrlString;
  imageSrcSet?: string;
  additionalInfo?: string[];
}
export interface FoundersSectionType extends BaseSection {
  founders?: FounderItem[];
  heading?: string;
  headingSingular?: string;
  animatedWords?: string[];
  animatedTextMobile?: string;
}
export interface JoinUsModalType {
  heading?: string;
  movementText?: { text: string; isAbsolute?: boolean }[];
  formDescription?: string;
  namePlaceholder?: string;
  emailPlaceholder?: string;
  artistPlaceholder?: string;
  artistLabel?: string;
  submitButtonText?: string;
  submitReassurance?: string;
  contactText?: string;
  contactEmail?: string;
  joinTeamText?: string;
  joinTeamUrl?: string;
}

export interface JoinUsSectionType extends BaseSection { 
  formUrl?: UrlString;
  heading?: string;
  movementText?: { text: string; isAbsolute?: boolean }[];
  formDescription?: string;
  namePlaceholder?: string;
  emailPlaceholder?: string;
  artistPlaceholder?: string;
  artistLabel?: string;
  submitButtonText?: string;
  submitReassurance?: string;
  contactText?: string;
  contactEmail?: string;
  joinTeamText?: string;
  joinTeamUrl?: string;
}
export interface FooterSection extends BaseSection { }

export interface ErrorPageContent {
  title?: string;
  description?: string;
}

export interface ErrorPageSection extends BaseSection {
  error404?: ErrorPageContent;
  error500?: ErrorPageContent;
  error403?: ErrorPageContent;
  defaultError?: ErrorPageContent;
  backButtonText?: string;
  backgroundPatternImage?: UrlString;
  arrowIcon?: UrlString;
}

export interface FaqIntroSection extends BaseSection {
  starCount?: number;
  recordImage?: UrlString;
  recordCount?: number;
  spotifyUrl?: UrlString;
}

export interface FaqItem {
  id: string;
  question: string;
  subtitle: string;
  answer: string;
  additionalInfo: string[];
}

export interface MoreFaqPageSection {
  pageTitle?: string;
  pageSubtitle?: string;
  faqItems?: FaqItem[];
  imageUrl?: UrlString;
  contactHeading?: string;
  contactButtonText?: string;
  contactEmail?: string;
}

export interface PrivacyPolicySection {
  pageTitle?: string;
  lastUpdated?: string;
  introText?: string[];
  sections?: Array<{
    title: string;
    paragraphs: string[];
    lists?: string[][];
    contactInfo?: {
      email?: string;
      address?: string;
    };
  }>;
  footerButtonText?: string;
  footerButtonEmail?: string;
}

export interface TermsSection {
  pageTitle?: string;
  lastUpdated?: string;
  introText?: string[];
  sections?: Array<{
    title: string;
    paragraphs: string[];
    lists?: string[][];
    disclaimer?: {
      title?: string;
      text?: string;
    };
    contactInfo?: {
      email?: string;
      address?: string;
    };
  }>;
  footerButtonText?: string;
  footerButtonEmail?: string;
}

export type SectionKey =
  | 'home'
  | 'hero'
  | 'intro'
  | 'shares'
  | 'ticker'
  | 'investmentIntro'
  | 'investment'
  | 'nftDisclaimer'
  | 'faq'
  | 'fredAgain'
  | 'founders'
  | 'joinUs'
  | 'footer'
  | 'moreFaq'
  | 'privacyPolicy'
  | 'terms'
  | 'errorPage'
  | 'faqIntro';

export const SECTION_KEYS: SectionKey[] = [
  'home',
  'hero',
  'intro',
  'shares',
  'ticker',
  'investmentIntro',
  'investment',
  'nftDisclaimer',
  'faq',
  'fredAgain',
  'founders',
  'joinUs',
  'footer',
  'moreFaq',
  'privacyPolicy',
  'terms',
  'errorPage',
  'faqIntro',
];

export const SECTION_TEMPLATES: Record<SectionKey, any> = {
  home: { text: 'Welcome to Hardwey LLC', images: [], links: [] },
  hero: {
    logoUrl: '/assets/img/hardweybannertext.png',
    backgroundImage: '/assets/banner/artistlarge1.jpg',
    backgroundImageSrcSet: '/assets/banner/artistlarge%201-p-500.jpg 500w, /assets/banner/artistlarge1-p-800.jpg 800w, /assets/banner/artistlarge1-p-1080.jpg 1080w, /assets/banner/artistlarge1-p-1600.jpg 1600w, /assets/banner/artistlarge1-p-2000.jpg 2000w, /assets/banner/artistlarge1.jpg 2457w',
    mitaText: 'Music is the answer™',
    subtitle: 'A movement in music. Redefining the rules.',
    leftIdentifier: '/assets/svg/investident-hero.svg',
    rightIdentifier: '/assets/svg/barcode-ident.svg',
    motifs: [
      '/assets/svg/new-wave24.svg',
      '/assets/svg/restricted-change-ident.svg',
      '/assets/svg/international-blue.svg',
      '/assets/svg/hardweyrights.svg',
      '/assets/svg/star-ident-blue.svg'
    ],
    images: [],
    links: []
  },
  intro: { 
    heading: 'invest in artists',
    headingMobile: 'Invest in artists, it hits different.',
    subheadingWords: ['it', 'hits', 'different'],
    comingSoon: 'Coming soon',
    date: '(?/?/2026)',
    welcomeText: 'Welcome to HARDWEY',
    images: [],
    links: []
  },
  shares: {
    heading: "Buy shares in artists' brands",
    subheadingMobile: 'A new way to invest',
    subheadingWords: ['A new way', 'to', 'Invest'],
    bodyCopy: "Artists build brands that generate revenue from their music, shows, merch and more. HARDWEY is the first app that allows you to invest in those brands and own a piece of their success.",
    imageUrl: '/assets/img/BUY%20SHARES%20IMAGE.jpg',
    imageSrcSet: '/assets/img/shares-500.jpg 500w, /assets/img/shares-800.jpg 800w, /assets/img/shares-800.jpg 1080w, /assets/img/BUY%20SHARES%20IMAGE.jpg 1440w',
    images: [],
    links: []
  },
  ticker: {
    backgroundColor: '#bbdbfa',
    tickerWords: ['Music', 'Shows', 'Merch', 'More'],
    images: [],
    links: []
  },
  investmentIntro: { 
    heading: "If you've never invested...",
    subtitle: "This one's for you",
    images: [],
    links: []
  },
  investment: {
    backgroundImage: '/assets/img/BUY SHARES IMAGE.jpg',
    mainHeading: 'invest in artists',
    animatedWords: ['it', 'hits', 'different'],
    comingSoonTitle: 'Coming soon',
    dateText: '(?/?/2026)',
    logoImage: '/assets/img/hardweymainlogo.jpg',
    welcomeText: 'Welcome to HARDWEY',
    images: [],
    links: []
  },
  nftDisclaimer: {
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
    images: [],
    links: []
  },
  faq: {
    faqItems: [
      {
        id: 'how-does-it-work',
        question: 'How does it work?',
        subtitle: "It's remarkably simple",
        answer: "We work closely with artists and their teams to launch their shares on HARDWEY. Just like with stocks, when shares become available on the app, you'll be able to buy and trade them all in one place.",
        additionalInfo: ['', '']
      },
      {
        id: 'what-am-i-buying',
        question: 'What am I actually buying?',
        subtitle: "Not NFTs, that's for sure",
        answer: "Artists own companies that collect their income from music royalties, shows, merch, and more. With HARDWEY, you'll be buying shares in those companies, owning a piece of the pie. You're becoming an investor in the artist.",
        additionalInfo: ['', '']
      },
      {
        id: 'how-do-i-make-money',
        question: 'How do I make money?',
        subtitle: 'Buy low, sell high',
        answer: "We're setting up a market where buying and selling shares takes just a few clicks. If the value of your shares rises, you can sell them to make a profit. Plus, every so often, artists may pay out dividends to their investors.",
        additionalInfo: ['', '']
      },
      {
        id: 'will-i-have-to-pay',
        question: 'Will I have to pay to be on HARDWEY?',
        subtitle: 'Joking?Right?',
        answer: "You won't find us on your monthly subscription bill next to Netflix and Spotify. We charge a small % fee per transaction. If you don't use HARDWEY, HARDWEY won't use you :)",
        additionalInfo: ['', '']
      },
      {
        id: 'can-i-invest-5-million',
        question: 'Can I invest $5 million?',
        subtitle: 'Damn, call us',
        answer: 'Feeling generous today, huh? If so, please get in touch with our head of high-net-worth clients (HNWC), MRS. CENKER, at THISISJOKE@ABSOLUTELY.COM',
        additionalInfo: ['', '']
      }
    ],
    images: [],
    links: []
  },
  fredAgain: {
    heading: 'Imagine you invested in Fred Again.. in 2020',
    subheading: "Braggin' rights now come with returns",
    backgroundImage: 'https://assets-global.website-files.com/64f45f425cb2cbb837b6f9b8/652ce8621b4433a6c86c936b_1.%20COLOR%20TREATMENT%20%2B%20NOISE%20(FAV).jpg',
    backgroundImageSrcSet: 'https://assets-global.website-files.com/64f45f425cb2cbb837b6f9b8/652ce8621b4433a6c86c936b_1.%20COLOR%20TREATMENT%20%2B%20NOISE%20(FAV)-p-500.jpg 500w, https://assets-global.website-files.com/64f45f425cb2cbb837b6f9b8/652ce8621b4433a6c86c936b_1.%20COLOR%20TREATMENT%20%2B%20NOISE%20(FAV)-p-800.jpg 800w, https://assets-global.website-files.com/64f45f425cb2cbb837b6f9b8/652ce8621b4433a6c86c936b_1.%20COLOR%20TREATMENT%20%2B%20NOISE%20(FAV)-p-1080.jpg 1080w, https://assets-global.website-files.com/64f45f425cb2cbb837b6f9b8/652ce8621b4433a6c86c936b_1.%20COLOR%20TREATMENT%20%2B%20NOISE%20(FAV)-p-1600.jpg 1600w, https://assets-global.website-files.com/64f45f425cb2cbb837b6f9b8/652ce8621b4433a6c86c936b_1.%20COLOR%20TREATMENT%20%2B%20NOISE%20(FAV)-p-2000.jpg 2000w, https://assets-global.website-files.com/64f45f425cb2cbb837b6f9b8/652ce8621b4433a6c86c936b_1.%20COLOR%20TREATMENT%20%2B%20NOISE%20(FAV).jpg 2858w',
    logoUrls: [
      '/assets/img/hardweybannertext.png',
      'https://assets-global.website-files.com/64f45f425cb2cbb837b6f9b8/64fde2e125f96a17e11dbc64_HIF-ident2.svg'
    ],
    images: [],
    links: []
  },
  founders: {
    founders: [{
      id: 'founder-1',
      name: 'Metehan İlikhan',
      role: 'Founder & CEO',
      bio: 'More than a decade ago, our friendship sparked from a conversation about who\'ll be the next David Bowie. Now, 10 years later, our shared passion for music has led us to a groundbreaking movement. We\'ve created HARDWEY, allowing folks like us to invest in the future success of artists.',
      quote: 'We\'re building a movement in music',
      imageUrl: '/assets/banner/founder.jpg',
      imageSrcSet: '/assets/banner/founder.jpg 500w, /assets/banner/founder.jpg 1080w, /assets/banner/founder.jpg 1610w',
      additionalInfo: [
        'Passionate about democratizing music investment',
        'Believes in the power of artist-fan connections',
        'Visionary leader in the music technology space',
      ],
    }],
    heading: 'The Founders',
    headingSingular: 'The Founder',
    animatedWords: ['long', 'story', 'short'],
    animatedTextMobile: 'Long story short',
    images: [],
    links: []
  },
  joinUs: { 
    heading: 'Join us',
    movementText: [
      { text: 'A movement', isAbsolute: false },
      { text: 'in', isAbsolute: true },
      { text: 'music', isAbsolute: false }
    ],
    formDescription: "Type your name, email and an emerging artist you'd invest in below to Pre-register for Join Us...",
    namePlaceholder: 'Your name...',
    emailPlaceholder: 'Your email...',
    artistPlaceholder: 'Your artist...',
    artistLabel: "Name an emerging artist you'd invest in",
    submitButtonText: 'Pre-Register',
    submitReassurance: "Don't worry, we won't spam you",
    contactText: 'More Questions?',
    contactEmail: 'hello@hardweyllc.com',
    joinTeamText: 'Wanna Join the team?',
    joinTeamUrl: 'https://wa.me/+905373178382',
    formUrl: '',
    images: [],
    links: []
  },
  footer: { text: 'Footer text', links: [{ label: 'Privacy', url: '/privacy-policy' }] },
  moreFaq: {
    pageTitle: 'More FAQ It',
    pageSubtitle: 'Everything you need to know about investing in artists',
    faqItems: [
      {
        id: 'how-does-it-work',
        question: 'How does it work?',
        subtitle: "It's remarkably simple",
        answer: "We work closely with artists and their teams to launch their shares on HARDWEY. Just like with stocks, when shares become available on the app, you'll be able to buy and trade them all in one place.",
        additionalInfo: ['', '']
      },
      {
        id: 'what-am-i-buying',
        question: 'What am I actually buying?',
        subtitle: "Not NFTs, that's for sure",
        answer: "Artists own companies that collect their income from music royalties, shows, merch, and more. With HARDWEY, you'll be buying shares in those companies, owning a piece of the pie. You're becoming an investor in the artist.",
        additionalInfo: ['', '']
      },
      {
        id: 'how-do-i-make-money',
        question: 'How do I make money?',
        subtitle: 'Buy low, sell high',
        answer: "We're setting up a market where buying and selling shares takes just a few clicks. If the value of your shares rises, you can sell them to make a profit. Plus, every so often, artists may pay out dividends to their investors.",
        additionalInfo: ['', '']
      },
      {
        id: 'is-it-safe',
        question: 'Is it safe to invest?',
        subtitle: 'Security is our priority',
        answer: 'We implement industry-standard security measures to protect your investments. All transactions are secured with bank-level encryption, and we work with regulated financial institutions to ensure your funds are safe.',
        additionalInfo: [
          'All investments are backed by real artist assets',
          'We provide transparent reporting on all transactions'
        ]
      },
      {
        id: 'minimum-investment',
        question: "What's the minimum investment?",
        subtitle: 'Start small, dream big',
        answer: 'You can start investing with as little as $10. We believe everyone should have access to music investment opportunities, regardless of their financial situation.',
        additionalInfo: [
          'No hidden fees or charges',
          'Transparent pricing for all transactions'
        ]
      },
      {
        id: 'artist-selection',
        question: 'How do you choose artists?',
        subtitle: 'Quality over quantity',
        answer: 'We carefully vet all artists before they join our platform. We look for established artists with proven track records, strong fan bases, and sustainable revenue streams.',
        additionalInfo: [
          'All artists undergo financial due diligence',
          'We prioritize artists with diverse revenue sources'
        ]
      },
      {
        id: 'trading-hours',
        question: 'When can I trade?',
        subtitle: '24/7 trading available',
        answer: 'Our platform operates 24/7, so you can buy and sell shares whenever you want. However, settlement times may vary depending on market conditions and banking hours.',
        additionalInfo: [
          'Real-time price updates',
          'Instant order execution'
        ]
      },
      {
        id: 'dividends',
        question: 'How do dividends work?',
        subtitle: 'Share in the success',
        answer: 'When artists generate revenue from their music, shows, or merchandise, they may choose to distribute dividends to their shareholders. These payments are proportional to your share ownership.',
        additionalInfo: [
          'Dividends are distributed quarterly',
          'All payments are transparent and trackable'
        ]
      },
      {
        id: 'tax-implications',
        question: 'What are the tax implications?',
        subtitle: 'Stay compliant',
        answer: 'Investment gains and dividends may be subject to taxation depending on your jurisdiction. We recommend consulting with a tax professional to understand your specific tax obligations.',
        additionalInfo: [
          'We provide tax documents for all transactions',
          'Consult your tax advisor for specific guidance'
        ]
      },
      {
        id: 'customer-support',
        question: 'How can I get help?',
        subtitle: "We're here for you",
        answer: 'Our customer support team is available 24/7 to help with any questions or issues. You can reach us through the app, email, or our website chat feature.',
        additionalInfo: [
          'Email: hello@hardweyllc.com',
          'Live chat available in the app'
        ]
      }
    ],
    imageUrl: 'https://assets-global.website-files.com/64f45f425cb2cbb837b6f9b8/652ce8621b4433a6c86c936b_1.%20COLOR%20TREATMENT%20%2B%20NOISE%20(FAV).jpg',
    contactHeading: "More questions? We've got more answers",
    contactButtonText: "don't be shy, it's okay to send mail",
    contactEmail: 'hello@hardweyllc.com'
  },
  privacyPolicy: {
    pageTitle: 'Privacy Policy',
    lastUpdated: 'October 11th, 2025',
    introText: [
      'Welcome to Hardwey Music, Inc. ("Hardwey", "we," "us," "our"), a Delaware corporation. Our operations include the website www.hardweyllc.com (the "Site") and any related offerings that reference this Privacy Policy (collectively, the "Services"). Should you wish to connect with us, we invite you to email hello@hardweyllc.io.',
      'This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.'
    ],
    sections: [
      {
        title: 'Information We Collect',
        paragraphs: [
          'We may collect information about you in a variety of ways. The information we may collect via the Services includes:'
        ],
        lists: [[
          'Personal information you provide to us (name, email address, phone number, etc.)',
          'Account information and credentials',
          'Financial information for investment purposes',
          'Communication preferences and history',
          'Device information and usage data',
          'Cookies and tracking technologies'
        ]]
      },
      {
        title: 'How We Use Your Information',
        paragraphs: [
          'We collect information strictly for the following outlined purposes and will not process this information in ways not aligned with these activities:'
        ],
        lists: [[
          'To upkeep and monitor our Service',
          'To oversee your user account, allowing access to our Service\'s features for registered users',
          'To communicate with you through various channels for updates or information regarding the Service',
          'To offer you updates, deals, and information about our goods, services, and events',
          'To handle and respond to your requests and inquiries, offer support, and improve our Service',
          'To comply with legal, court, and governmental directives',
          'For internal administration and auditing',
          'To identify and protect against fraudulent or illegal activities',
          'For data analysis, trend identification, and Service enhancement'
        ]]
      },
      {
        title: 'Security of Your Personal Information',
        paragraphs: [
          'We safeguard your personal information with commercially viable tools to prevent loss, theft, unauthorized access, exposure, duplication, usage, or alteration. Despite our efforts, we recognize that no electronic transmission or storage method is infallible, and absolute security cannot be guaranteed. We are committed to adhering to our legal obligations in the event of a data breach.',
          'You play a vital role in maintaining the security of your personal data, particularly in the management of your password\'s strength and confidentiality within our services.'
        ]
      },
      {
        title: 'Retention of Personal Information',
        paragraphs: [
          'We retain your personal information for no longer than necessary, based on the purpose outlined in this policy. Once your information is no longer required, we will either delete it or anonymize it. Nonetheless, we may hold onto your information to fulfill legal or regulatory duties or for certain research purposes where appropriate.'
        ]
      },
      {
        title: 'Children\'s Privacy',
        paragraphs: [
          'Our services do not target children under the age of 13, and we do not intentionally gather information from them. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.'
        ]
      },
      {
        title: 'International Data Transfers',
        paragraphs: [
          'We store and process personal information in various locations where our facilities or service providers are situated. These international transfers are conducted in compliance with relevant laws, and we ensure that your personal data is protected in line with this policy.'
        ]
      },
      {
        title: 'Your Rights',
        paragraphs: [
          'You have the discretion to share or withhold your personal information, which may affect your website experience. We will not discriminate against any exercise of your privacy rights. If you do share information with us, it will be handled in accordance with this policy.',
          'You may withdraw consent for marketing communications at any time. To assist us in verifying your identity, we may need to ask for specific information from you.',
          'Should you find any inaccuracies in your information, please inform us. We will promptly correct any erroneous data.'
        ]
      },
      {
        title: 'Policy Changes',
        paragraphs: [
          'We may update this privacy policy to reflect changes in our practices or legal updates, posting the new version at this link. If legally required, we will seek your consent for any new policy aspects that affect how we handle your personal information.'
        ]
      },
      {
        title: 'Contact Information',
        paragraphs: [
          'If you have any questions about this Privacy Policy, please contact us at:'
        ],
        contactInfo: {
          email: 'hello@hardweyllc.com',
          address: 'Hardwey Music, Inc., Delaware, USA'
        }
      }
    ],
    footerButtonText: 'Contact Us',
    footerButtonEmail: 'hello@hardweyllc.com'
  },
  terms: {
    pageTitle: 'Terms of Service',
    lastUpdated: 'October 11th, 2025',
    introText: [
      'Welcome to Hardwey Music, Inc. ("Hardwey", "we," "us," "our"), a Delaware corporation. Our operations include the website www.hardweyllc.com (the "Site") and any related offerings that reference these Terms of Use (collectively, the "Services"). Should you wish to connect with us, we invite you to email hello@hardweyllc.io.',
      'By accessing or utilizing the Services, you, whether acting individually or on behalf of an entity ("you"), enter into a binding contract with Hardwey Music, Inc. based on these Terms of Use. Your use of the Services signifies your comprehensive understanding and unequivocal acceptance of these terms. Should these Terms of Use not reflect your agreement, we must insist that you refrain from using the Services.',
      'We may occasionally amend these Terms of Use, which will be indicated by an updated "Last updated" date. By continuing to use the Services after revisions are made, you accept and agree to the changes. Please review these terms regularly to ensure you are informed of any updates.',
      'The Services are designed for individuals who are at least 18 years of age. If you are under 18, please do not use or register for the Services. For your convenience, we suggest keeping a printed copy of these Terms of Use for your records.'
    ],
    sections: [
      {
        title: 'Regarding Our Services',
        paragraphs: [
          'Hardwey provides a platform that allows users to invest in artists and their music-related assets. Our services include but are not limited to:'
        ],
        lists: [[
          'Artist share trading platform',
          'Investment management tools',
          'Financial reporting and analytics',
          'Customer support and assistance',
          'Educational resources about music investment'
        ]]
      },
      {
        title: 'User Accounts and Registration',
        paragraphs: [
          'To access certain features of our Services, you may be required to create an account. You agree to:'
        ],
        lists: [[
          'Provide accurate, current, and complete information',
          'Maintain and update your account information',
          'Keep your password secure and confidential',
          'Accept responsibility for all activities under your account',
          'Notify us immediately of any unauthorized use'
        ]]
      },
      {
        title: 'Investment Risks and Disclaimers',
        disclaimer: {
          title: 'Important Investment Warning',
          text: 'Investing in artist shares involves significant risks and may result in the loss of your entire investment. Past performance does not guarantee future results. You should carefully consider your investment objectives, level of experience, and risk appetite before making any investment decisions.'
        },
        paragraphs: [
          'By using our Services, you acknowledge and agree that:'
        ],
        lists: [[
          'All investments carry risk of loss',
          'You understand the risks associated with music industry investments',
          'You have the financial capacity to bear potential losses',
          'You will not hold Hardwey liable for investment losses'
        ]]
      },
      {
        title: 'Prohibited Uses',
        paragraphs: [
          'You may not use our Services for any unlawful purpose or to solicit others to perform unlawful acts. You agree not to:'
        ],
        lists: [[
          'Violate any laws or regulations',
          'Infringe on intellectual property rights',
          'Transmit harmful or malicious code',
          'Attempt to gain unauthorized access to our systems',
          'Interfere with the proper functioning of our Services',
          'Use our Services for fraudulent or deceptive practices'
        ]]
      },
      {
        title: 'Intellectual Property Rights',
        paragraphs: [
          'The Services and their original content, features, and functionality are and will remain the exclusive property of Hardwey Music, Inc. and its licensors. The Services are protected by copyright, trademark, and other laws. Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.'
        ]
      },
      {
        title: 'Limitation of Liability',
        paragraphs: [
          'In no event shall Hardwey Music, Inc., nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the Services.'
        ]
      },
      {
        title: 'Termination',
        paragraphs: [
          'We may terminate or suspend your account and bar access to the Services immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.'
        ]
      },
      {
        title: 'Governing Law',
        paragraphs: [
          'These Terms shall be interpreted and governed by the laws of the State of Delaware, United States, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.'
        ]
      },
      {
        title: 'Contact Information',
        paragraphs: [
          'If you have any questions about these Terms of Service, please contact us at:'
        ],
        contactInfo: {
          email: 'hello@hardweyllc.com',
          address: 'Hardwey Music, Inc., Delaware, USA'
        }
      }
    ],
    footerButtonText: 'Contact Us',
    footerButtonEmail: 'hello@hardweyllc.com'
  },
  errorPage: {
    error404: {
      title: '404 NOT FOUND',
      description: 'You dive too deep so you discovered an unexplored place, congrats! Let me assist you the explored places granny you forgot your pills again...'
    },
    error500: {
      title: '500 SERVER ERROR',
      description: 'Oops! Something went wrong on our end. Our team has been notified and is working to fix this issue.'
    },
    error403: {
      title: '403 FORBIDDEN',
      description: 'Access denied. You don\'t have permission to view this page.'
    },
    defaultError: {
      title: 'ERROR',
      description: 'An unexpected error occurred. Please try again later.'
    },
    backButtonText: 'Back to Home',
    backgroundPatternImage: '/assets/img/Green eye.gif',
    arrowIcon: '/assets/svg/arrow-red.svg',
    images: [],
    links: []
  },
  faqIntro: {
    starCount: 7,
    recordImage: '/assets/img/Playlist R&B Retro Nostalgia.png',
    recordCount: 1,
    spotifyUrl: 'https://open.spotify.com/',
    images: [],
    links: []
  },
};

export function getTemplateFor(section: string): any {
  return SECTION_TEMPLATES[(section as SectionKey)] ?? { text: '', images: [], links: [] };
}


