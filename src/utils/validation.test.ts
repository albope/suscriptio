import { describe, it, expect } from 'vitest';
import { validateSubscriptionForm } from './validation';
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
