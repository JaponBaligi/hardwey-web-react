/**
 * Application constants and configuration values
 * Centralized location for all magic numbers and static values
 */

// Application metadata
export const APP_CONFIG = {
  name: 'HARDWEY',
  tagline: 'Invest in Artists',
  description: 'HARDWEY Music Group - Investing in the future of music',
  version: '1.0.0',
} as const;

// External URLs
export const EXTERNAL_URLS = {
  spotify: 'https://open.spotify.com',
  instagram: 'https://instagram.com',
  tiktok: 'https://tiktok.com',
  twitter: 'https://twitter.com',
  linkedin: 'https://linkedin.com',
} as const;

// Social media links
export const SOCIAL_LINKS = [
  {
    platform: 'instagram' as const,
    url: 'https://instagram.com/hardwey',
    label: 'Follow us on Instagram',
  },
  {
    platform: 'tiktok' as const,
    url: 'https://tiktok.com/@hardwey',
    label: 'Follow us on TikTok',
  },
  {
    platform: 'twitter' as const,
    url: 'https://twitter.com/hardwey',
    label: 'Follow us on Twitter',
  },
  {
    platform: 'linkedin' as const,
    url: 'https://linkedin.com/company/hardwey',
    label: 'Follow us on LinkedIn',
  },
] as const;

// Animation durations (in milliseconds)
export const ANIMATION_DURATIONS = {
  fast: 150,
  normal: 250,
  slow: 350,
  verySlow: 500,
} as const;

// Breakpoints (in pixels)
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

// Z-index values
export const Z_INDEX = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  toast: 1080,
} as const;

// Form validation limits
export const FORM_LIMITS = {
  name: {
    minLength: 2,
    maxLength: 50,
  },
  email: {
    maxLength: 100,
  },
  artist: {
    maxLength: 100,
  },
  message: {
    maxLength: 500,
  },
} as const;

// Cookie consent configuration
export const COOKIE_CONFIG = {
  cookieName: 'hardwey-cookie-consent',
  expirationDays: 365,
  categories: ['necessary', 'analytics', 'marketing'] as const,
} as const;

// FAQ data
export const FAQ_ITEMS = [
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
    id: 'will-i-have-to-pay',
    question: 'Will I have to pay to be on HARDWEY?',
    subtitle: 'Joking?Right?',
    answer: 'You won\'t find us on your monthly subscription bill next to Netflix and Spotify. We charge a small % fee per transaction. If you don\'t use HARDWEY, HARDWEY won\'t use you :)',
    additionalInfo: ['', ''],
  },
  {
    id: 'can-i-invest-5-million',
    question: 'Can I invest $5 million?',
    subtitle: 'Damn, call us',
    answer: 'Feeling generous today, huh? If so, please get in touch with our head of high-net-worth clients (HNWC), MRS. CENKER, at THISISJOKE@ABSOLUTELY.COM',
    additionalInfo: ['', ''],
  },
] as const;

// Playlist data
export const PLAYLISTS = [
  {
    id: 'rnb-retro',
    title: 'R&B Retro Nostalgia',
    description: 'Classic R&B hits that defined an era',
    spotifyUrl: 'https://open.spotify.com/playlist/rnb-retro',
    imageUrl: '/assets/img/Playlist R&B Retro Nostalgia.png',
  },
] as const;

// Founders data
export const FOUNDERS = [
  {
    id: 'metehan-ilikhan',
    name: 'Metehan İlikhan',
    role: 'Founder & CEO',
    bio: 'More than a decade ago, our friendship sparked from a conversation about who\'ll be the next David Bowie. Now, 10 years later, our shared passion for music has led us to a groundbreaking movement. We\'ve created HARDWEY, allowing folks like us to invest in the future success of artists.',
    quote: 'We\'re building a movement in music',
    imageUrl: '/assets/banner/founder.jpg',
    additionalInfo: [
      'Passionate about democratizing music investment',
      'Believes in the power of artist-fan connections',
      'Visionary leader in the music technology space',
    ],
  },
] as const;

// Error messages
export const ERROR_MESSAGES = {
  required: 'This field is required',
  invalidEmail: 'Please enter a valid email address',
  nameTooShort: 'Name must be at least 2 characters',
  nameTooLong: 'Name must be less than 50 characters',
  emailTooLong: 'Email must be less than 100 characters',
  artistTooLong: 'Artist name must be less than 100 characters',
  messageTooLong: 'Message must be less than 500 characters',
  genericError: 'Something went wrong. Please try again.',
  networkError: 'Network error. Please check your connection.',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  formSubmitted: 'Thank you! Your information has been submitted.',
  emailSubscribed: 'Successfully subscribed to updates!',
  cookieAccepted: 'Cookie preferences saved.',
} as const;
