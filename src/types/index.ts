/**
 * Global TypeScript type definitions for the Hardwey React application
 */

// Form types
export interface FormData {
  name: string;
  email: string;
  artist?: string;
}

export interface FormErrors {
  name?: string;
  email?: string;
  artist?: string;
}

// FAQ types
export interface FaqItem {
  id: string;
  question: string;
  subtitle: string;
  answer: string;
  additionalInfo?: string[];
  isOpen?: boolean;
}

// Modal types
export interface ModalState {
  isOpen: boolean;
  type?: 'join-us' | 'cookie-consent';
}

// Cookie consent types
export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

// Navigation types
export interface NavigationItem {
  label: string;
  href: string;
  external?: boolean;
}

export interface SocialLink {
  platform: 'instagram' | 'tiktok' | 'twitter' | 'linkedin';
  url: string;
  label: string;
}

// Playlist types
export interface PlaylistItem {
  id: string;
  title: string;
  description: string;
  spotifyUrl: string;
  imageUrl: string;
}

// Founder types
export interface Founder {
  id: string;
  name: string;
  role: string;
  bio: string;
  quote: string;
  imageUrl: string;
  additionalInfo?: string[];
}

// Animation types
export interface AnimationConfig {
  duration: number;
  easing: string;
  delay?: number;
}

// Component props types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// API response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Environment variables
export interface AppConfig {
  googleAnalyticsId?: string;
  apiBaseUrl?: string;
  environment: 'development' | 'production' | 'test';
}
