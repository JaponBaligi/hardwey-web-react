/**
 * Validation schemas and utilities using Zod
 */

import { z } from 'zod';
import { FORM_LIMITS } from './constants';

// Base validation schemas
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .max(FORM_LIMITS.email.maxLength, `Email must be less than ${FORM_LIMITS.email.maxLength} characters`)
  .email('Please enter a valid email address');

export const nameSchema = z
  .string()
  .min(FORM_LIMITS.name.minLength, `Name must be at least ${FORM_LIMITS.name.minLength} characters`)
  .max(FORM_LIMITS.name.maxLength, `Name must be less than ${FORM_LIMITS.name.maxLength} characters`)
  .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces');

export const artistSchema = z
  .string()
  .max(FORM_LIMITS.artist.maxLength, `Artist name must be less than ${FORM_LIMITS.artist.maxLength} characters`)
  .optional();

export const messageSchema = z
  .string()
  .max(FORM_LIMITS.message.maxLength, `Message must be less than ${FORM_LIMITS.message.maxLength} characters`)
  .optional();

// Form validation schemas
export const joinUsFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  artist: artistSchema,
});

export const contactFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  message: messageSchema,
});

export const cookieConsentSchema = z.object({
  necessary: z.boolean(),
  analytics: z.boolean(),
  marketing: z.boolean(),
});

// URL validation schema
export const urlSchema = z
  .string()
  .url('Please enter a valid URL')
  .refine(
    (url) => {
      try {
        const urlObj = new URL(url);
        return ['http:', 'https:'].includes(urlObj.protocol);
      } catch {
        return false;
      }
    },
    'URL must use HTTP or HTTPS protocol'
  );

// Phone number validation schema
export const phoneSchema = z
  .string()
  .regex(/^[+]?[1-9]\d{0,15}$/, 'Please enter a valid phone number')
  .optional();

// Date validation schema
export const dateSchema = z
  .string()
  .refine(
    (date) => {
      const parsedDate = new Date(date);
      return !isNaN(parsedDate.getTime());
    },
    'Please enter a valid date'
  );

// Number validation schemas
export const positiveNumberSchema = z
  .number()
  .positive('Number must be positive');

export const percentageSchema = z
  .number()
  .min(0, 'Percentage must be at least 0')
  .max(100, 'Percentage must be at most 100');

// File validation schemas
export const imageFileSchema = z
  .instanceof(File)
  .refine(
    (file) => file.size <= 5 * 1024 * 1024, // 5MB
    'File size must be less than 5MB'
  )
  .refine(
    (file) => ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type),
    'File must be an image (JPEG, PNG, GIF, or WebP)'
  );

export const audioFileSchema = z
  .instanceof(File)
  .refine(
    (file) => file.size <= 50 * 1024 * 1024, // 50MB
    'File size must be less than 50MB'
  )
  .refine(
    (file) => ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4'].includes(file.type),
    'File must be an audio file (MP3, WAV, OGG, or MP4)'
  );

// Validation utility functions
export function validateFormData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string> } {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.issues.forEach((err) => {
        const path = err.path.join('.');
        errors[path] = err.message;
      });
      return { success: false, errors };
    }
    throw error;
  }
}

export function getFieldError(
  errors: Record<string, string>,
  fieldName: string
): string | undefined {
  return errors[fieldName];
}

export function hasFieldError(
  errors: Record<string, string>,
  fieldName: string
): boolean {
  return fieldName in errors;
}

// Type exports for use in components
export type JoinUsFormData = z.infer<typeof joinUsFormSchema>;
export type ContactFormData = z.infer<typeof contactFormSchema>;
export type CookieConsentData = z.infer<typeof cookieConsentSchema>;
export type ValidationResult<T> = 
  | { success: true; data: T }
  | { success: false; errors: Record<string, string> };
