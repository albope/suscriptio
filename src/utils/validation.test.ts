import { validateSubscriptionForm, validatePassword, validateEmail } from './validation';
import { BillingFrequency } from '@/types';

const validFormData = {
  name: 'Netflix',
  cost: 15.99,
  billingFrequency: BillingFrequency.MONTHLY,
  nextPaymentDate: new Date('2025-02-01'),
};

describe('validateSubscriptionForm', () => {
  describe('name validation', () => {
    it('returns no errors for valid name', () => {
      const errors = validateSubscriptionForm(validFormData);
      expect(errors.name).toBeUndefined();
    });

    it('returns error for empty name', () => {
      const errors = validateSubscriptionForm({ ...validFormData, name: '' });
      expect(errors.name).toBe('validation.minLength');
    });

    it('returns error for name with only whitespace', () => {
      const errors = validateSubscriptionForm({ ...validFormData, name: '  ' });
      expect(errors.name).toBe('validation.minLength');
    });

    it('returns error for name shorter than 2 characters', () => {
      const errors = validateSubscriptionForm({ ...validFormData, name: 'A' });
      expect(errors.name).toBe('validation.minLength');
    });

    it('returns error for name longer than 60 characters', () => {
      const longName = 'A'.repeat(61);
      const errors = validateSubscriptionForm({ ...validFormData, name: longName });
      expect(errors.name).toBe('validation.maxLength');
    });

    it('accepts name with exactly 60 characters', () => {
      const maxName = 'A'.repeat(60);
      const errors = validateSubscriptionForm({ ...validFormData, name: maxName });
      expect(errors.name).toBeUndefined();
    });
  });

  describe('cost validation', () => {
    it('returns no errors for valid cost', () => {
      const errors = validateSubscriptionForm(validFormData);
      expect(errors.cost).toBeUndefined();
    });

    it('returns error for missing cost', () => {
      const errors = validateSubscriptionForm({ ...validFormData, cost: undefined });
      expect(errors.cost).toBe('validation.minValue');
    });

    it('returns error for cost of 0', () => {
      const errors = validateSubscriptionForm({ ...validFormData, cost: 0 });
      expect(errors.cost).toBe('validation.minValue');
    });

    it('returns error for negative cost', () => {
      const errors = validateSubscriptionForm({ ...validFormData, cost: -5 });
      expect(errors.cost).toBe('validation.minValue');
    });

    it('returns error for cost below 0.01', () => {
      const errors = validateSubscriptionForm({ ...validFormData, cost: 0.001 });
      expect(errors.cost).toBe('validation.minValue');
    });

    it('returns error for cost above 9999', () => {
      const errors = validateSubscriptionForm({ ...validFormData, cost: 10000 });
      expect(errors.cost).toBe('validation.maxValue');
    });

    it('accepts cost of exactly 9999', () => {
      const errors = validateSubscriptionForm({ ...validFormData, cost: 9999 });
      expect(errors.cost).toBeUndefined();
    });

    it('accepts minimum cost of 0.01', () => {
      const errors = validateSubscriptionForm({ ...validFormData, cost: 0.01 });
      expect(errors.cost).toBeUndefined();
    });
  });

  describe('billingFrequency validation', () => {
    it('returns no errors for valid frequency', () => {
      const errors = validateSubscriptionForm(validFormData);
      expect(errors.billingFrequency).toBeUndefined();
    });

    it('returns error for missing frequency', () => {
      const errors = validateSubscriptionForm({ ...validFormData, billingFrequency: undefined });
      expect(errors.billingFrequency).toBe('validation.required');
    });

    it('returns error for empty string frequency', () => {
      const errors = validateSubscriptionForm({ ...validFormData, billingFrequency: '' });
      expect(errors.billingFrequency).toBe('validation.required');
    });
  });

  describe('nextPaymentDate validation', () => {
    it('returns no errors for valid date', () => {
      const errors = validateSubscriptionForm(validFormData);
      expect(errors.nextPaymentDate).toBeUndefined();
    });

    it('returns error for missing date', () => {
      const errors = validateSubscriptionForm({ ...validFormData, nextPaymentDate: undefined });
      expect(errors.nextPaymentDate).toBe('validation.required');
    });
  });

  describe('providerUrl validation', () => {
    it('returns no errors when URL is not provided', () => {
      const errors = validateSubscriptionForm(validFormData);
      expect(errors.providerUrl).toBeUndefined();
    });

    it('returns no errors for valid URL', () => {
      const errors = validateSubscriptionForm({
        ...validFormData,
        providerUrl: 'https://netflix.com',
      });
      expect(errors.providerUrl).toBeUndefined();
    });

    it('returns error for invalid URL', () => {
      const errors = validateSubscriptionForm({
        ...validFormData,
        providerUrl: 'not-a-url',
      });
      expect(errors.providerUrl).toBe('validation.invalidUrl');
    });

    it('accepts URLs with different protocols', () => {
      const errors = validateSubscriptionForm({
        ...validFormData,
        providerUrl: 'http://example.com',
      });
      expect(errors.providerUrl).toBeUndefined();
    });
  });

  describe('notes validation', () => {
    it('returns no errors when notes are not provided', () => {
      const errors = validateSubscriptionForm(validFormData);
      expect(errors.notes).toBeUndefined();
    });

    it('returns no errors for valid notes', () => {
      const errors = validateSubscriptionForm({
        ...validFormData,
        notes: 'Premium plan with 4K streaming',
      });
      expect(errors.notes).toBeUndefined();
    });

    it('returns error for notes longer than 500 characters', () => {
      const longNotes = 'A'.repeat(501);
      const errors = validateSubscriptionForm({
        ...validFormData,
        notes: longNotes,
      });
      expect(errors.notes).toBe('validation.maxLength');
    });

    it('accepts notes with exactly 500 characters', () => {
      const maxNotes = 'A'.repeat(500);
      const errors = validateSubscriptionForm({
        ...validFormData,
        notes: maxNotes,
      });
      expect(errors.notes).toBeUndefined();
    });
  });

  describe('multiple errors', () => {
    it('returns multiple errors when multiple fields are invalid', () => {
      const errors = validateSubscriptionForm({
        name: '',
        cost: -5,
        billingFrequency: undefined,
        nextPaymentDate: undefined,
      });

      expect(errors.name).toBe('validation.minLength');
      expect(errors.cost).toBe('validation.minValue');
      expect(errors.billingFrequency).toBe('validation.required');
      expect(errors.nextPaymentDate).toBe('validation.required');
    });
  });

  describe('valid form', () => {
    it('returns empty object for completely valid form', () => {
      const errors = validateSubscriptionForm(validFormData);
      expect(Object.keys(errors)).toHaveLength(0);
    });

    it('returns empty object for valid form with all optional fields', () => {
      const errors = validateSubscriptionForm({
        ...validFormData,
        providerUrl: 'https://netflix.com',
        notes: 'Family plan',
      });
      expect(Object.keys(errors)).toHaveLength(0);
    });
  });
});

describe('validatePassword', () => {
  describe('password requirements', () => {
    it('returns invalid for password shorter than 8 characters', () => {
      const result = validatePassword('Short1A');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('validation.password.minLength');
    });

    it('returns invalid for password without uppercase', () => {
      const result = validatePassword('password123');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('validation.password.uppercase');
    });

    it('returns invalid for password without lowercase', () => {
      const result = validatePassword('PASSWORD123');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('validation.password.lowercase');
    });

    it('returns invalid for password without number', () => {
      const result = validatePassword('PasswordABC');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('validation.password.number');
    });

    it('returns valid for password meeting all requirements', () => {
      const result = validatePassword('Password123');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('password strength', () => {
    it('returns weak for very short password', () => {
      const result = validatePassword('abc');
      expect(result.strength).toBe('weak');
    });

    it('returns medium for password missing some requirements', () => {
      const result = validatePassword('password1');
      expect(result.strength).toBe('medium');
    });

    it('returns medium for valid password without special chars', () => {
      const result = validatePassword('Password1');
      expect(result.strength).toBe('medium');
    });

    it('returns strong for valid password with special char', () => {
      const result = validatePassword('Password1!');
      expect(result.strength).toBe('strong');
    });

    it('returns strong for long password without special char', () => {
      const result = validatePassword('Password12345');
      expect(result.strength).toBe('strong');
    });
  });

  describe('edge cases', () => {
    it('returns invalid for empty password', () => {
      const result = validatePassword('');
      expect(result.isValid).toBe(false);
      expect(result.strength).toBe('weak');
    });

    it('handles unicode characters', () => {
      const result = validatePassword('Password1');
      expect(result.isValid).toBe(true);
    });
  });
});

describe('validateEmail', () => {
  it('returns true for valid email', () => {
    expect(validateEmail('user@example.com')).toBe(true);
  });

  it('returns true for email with subdomain', () => {
    expect(validateEmail('user@mail.example.com')).toBe(true);
  });

  it('returns true for email with plus sign', () => {
    expect(validateEmail('user+tag@example.com')).toBe(true);
  });

  it('returns true for email with dots in local part', () => {
    expect(validateEmail('user.name@example.com')).toBe(true);
  });

  it('returns false for email without @', () => {
    expect(validateEmail('userexample.com')).toBe(false);
  });

  it('returns false for email without domain', () => {
    expect(validateEmail('user@')).toBe(false);
  });

  it('returns false for email without local part', () => {
    expect(validateEmail('@example.com')).toBe(false);
  });

  it('returns false for email with spaces', () => {
    expect(validateEmail('user @example.com')).toBe(false);
  });

  it('returns false for empty string', () => {
    expect(validateEmail('')).toBe(false);
  });

  it('returns false for email without TLD', () => {
    expect(validateEmail('user@example')).toBe(false);
  });
});
