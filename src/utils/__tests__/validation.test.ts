/**
 * Tests for validation utilities
 */

import { 
  emailSchema, 
  nameSchema, 
  joinUsFormSchema, 
  contactFormSchema,
  validateFormData,
  getFieldError,
  hasFieldError 
} from '../../utils/validation';

describe('Validation Schemas', () => {
  describe('emailSchema', () => {
    it('should validate correct email', () => {
      expect(emailSchema.parse('test@example.com')).toBe('test@example.com');
    });

    it('should reject invalid email', () => {
      expect(() => emailSchema.parse('invalid-email')).toThrow();
    });

    it('should reject empty email', () => {
      expect(() => emailSchema.parse('')).toThrow();
    });

    it('should reject email that is too long', () => {
      const longEmail = 'a'.repeat(300) + '@example.com';
      expect(() => emailSchema.parse(longEmail)).toThrow();
    });
  });

  describe('nameSchema', () => {
    it('should validate correct name', () => {
      expect(nameSchema.parse('John Doe')).toBe('John Doe');
    });

    it('should reject name with numbers', () => {
      expect(() => nameSchema.parse('John123')).toThrow();
    });

    it('should reject name that is too short', () => {
      expect(() => nameSchema.parse('J')).toThrow();
    });

    it('should reject name that is too long', () => {
      const longName = 'J'.repeat(100);
      expect(() => nameSchema.parse(longName)).toThrow();
    });
  });

  describe('joinUsFormSchema', () => {
    it('should validate correct form data', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        artist: 'Taylor Swift',
      };

      expect(joinUsFormSchema.parse(validData)).toEqual(validData);
    });

    it('should validate form data without artist', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
      };

      expect(joinUsFormSchema.parse(validData)).toEqual(validData);
    });

    it('should reject invalid form data', () => {
      const invalidData = {
        name: 'J',
        email: 'invalid-email',
      };

      expect(() => joinUsFormSchema.parse(invalidData)).toThrow();
    });
  });

  describe('contactFormSchema', () => {
    it('should validate correct form data', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Hello world',
      };

      expect(contactFormSchema.parse(validData)).toEqual(validData);
    });

    it('should validate form data without message', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
      };

      expect(contactFormSchema.parse(validData)).toEqual(validData);
    });
  });
});

describe('Validation Utilities', () => {
  describe('validateFormData', () => {
    it('should return success for valid data', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
      };

      const result = validateFormData(joinUsFormSchema, validData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it('should return errors for invalid data', () => {
      const invalidData = {
        name: 'J',
        email: 'invalid-email',
      };

      const result = validateFormData(joinUsFormSchema, invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toHaveProperty('name');
        expect(result.errors).toHaveProperty('email');
      }
    });
  });

  describe('getFieldError', () => {
    it('should return error for field', () => {
      const errors = {
        name: 'Name is required',
        email: 'Email is invalid',
      };

      expect(getFieldError(errors, 'name')).toBe('Name is required');
      expect(getFieldError(errors, 'email')).toBe('Email is invalid');
    });

    it('should return undefined for non-existent field', () => {
      const errors = {
        name: 'Name is required',
      };

      expect(getFieldError(errors, 'email')).toBeUndefined();
    });
  });

  describe('hasFieldError', () => {
    it('should return true for field with error', () => {
      const errors = {
        name: 'Name is required',
        email: 'Email is invalid',
      };

      expect(hasFieldError(errors, 'name')).toBe(true);
      expect(hasFieldError(errors, 'email')).toBe(true);
    });

    it('should return false for field without error', () => {
      const errors = {
        name: 'Name is required',
      };

      expect(hasFieldError(errors, 'email')).toBe(false);
    });
  });
});
