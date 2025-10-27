/**
 * Environment configuration utilities
 * Centralized environment variable management with validation
 */

import { z } from 'zod';

// Environment schema validation
const envSchema = z.object({
  VITE_API_BASE_URL: z.string().url().optional(),
  VITE_ENVIRONMENT: z.enum(['development', 'staging', 'production']).default('development'),
  VITE_LENIS_ENABLED: z.string().transform(val => val === 'true').default(true),
  VITE_WEBGL_ANIMATION_ENABLED: z.string().transform(val => val === 'true').default(false),
  VITE_COOKIE_CONSENT_ENABLED: z.string().transform(val => val === 'true').default(true),
  VITE_DEBUG_MODE: z.string().transform(val => val === 'true').default(false),
  VITE_LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  VITE_CSP_ENABLED: z.string().transform(val => val === 'true').default(true),
  VITE_HTTPS_ONLY: z.string().transform(val => val === 'true').default(true),
});

// Parse and validate environment variables
const parseEnv = () => {
  try {
    return envSchema.parse(import.meta.env);
  } catch (error) {
    console.error('Environment validation failed:', error);
    // Return safe defaults
    return envSchema.parse({});
  }
};

export const env = parseEnv();

// Environment utilities
export const isDevelopment = env.VITE_ENVIRONMENT === 'development';
export const isProduction = env.VITE_ENVIRONMENT === 'production';
export const isStaging = env.VITE_ENVIRONMENT === 'staging';

// Feature flags
export const features = {
  lenis: env.VITE_LENIS_ENABLED,
  webglAnimation: env.VITE_WEBGL_ANIMATION_ENABLED,
  cookieConsent: env.VITE_COOKIE_CONSENT_ENABLED,
  debugMode: env.VITE_DEBUG_MODE,
  csp: env.VITE_CSP_ENABLED,
  httpsOnly: env.VITE_HTTPS_ONLY,
} as const;

// API configuration
export const apiConfig = {
  baseUrl: env.VITE_API_BASE_URL || 'https://api.hardwey.com',
  timeout: 10000,
  retries: 3,
} as const;

// Logging configuration
export const loggingConfig = {
  level: env.VITE_LOG_LEVEL,
  enabled: env.VITE_DEBUG_MODE || isDevelopment,
} as const;

// Security configuration
export const securityConfig = {
  cspEnabled: env.VITE_CSP_ENABLED,
  httpsOnly: env.VITE_HTTPS_ONLY,
  allowedOrigins: [
    'https://www.hardweymusic.com',
    'https://hardweymusic.com',
    'https://api.hardwey.com',
  ],
} as const;

// Type exports
export type Environment = z.infer<typeof envSchema>;
export type FeatureFlags = typeof features;
export type ApiConfig = typeof apiConfig;
export type LoggingConfig = typeof loggingConfig;
export type SecurityConfig = typeof securityConfig;
