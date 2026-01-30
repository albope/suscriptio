import { describe, it, expect } from 'vitest';
import {
  normalizeToMonthly,
  normalizeToYearly,
  formatCurrency,
  formatCurrencyWithCode,
} from './calculations';
import { BillingFrequency } from '@/types';

describe('normalizeToMonthly', () => {
  it('returns same cost for monthly subscriptions', () => {
    expect(normalizeToMonthly(9.99, BillingFrequency.MONTHLY)).toBe(9.99);
  });

  it('divides yearly cost by 12 for yearly subscriptions', () => {
    expect(normalizeToMonthly(120, BillingFrequency.YEARLY)).toBe(10);
  });

  it('handles decimal values correctly for yearly', () => {
    expect(normalizeToMonthly(99.99, BillingFrequency.YEARLY)).toBeCloseTo(8.3325, 4);
  });

  it('returns 0 for unknown frequency', () => {
    // @ts-expect-error testing invalid input
    expect(normalizeToMonthly(100, 'weekly')).toBe(0);
  });
});

describe('normalizeToYearly', () => {
  it('multiplies monthly cost by 12', () => {
    expect(normalizeToYearly(10, BillingFrequency.MONTHLY)).toBe(120);
  });

  it('returns same cost for yearly subscriptions', () => {
    expect(normalizeToYearly(99.99, BillingFrequency.YEARLY)).toBe(99.99);
  });

  it('handles decimal values correctly for monthly', () => {
    expect(normalizeToYearly(9.99, BillingFrequency.MONTHLY)).toBeCloseTo(119.88, 2);
  });

  it('returns 0 for unknown frequency', () => {
    // @ts-expect-error testing invalid input
    expect(normalizeToYearly(100, 'weekly')).toBe(0);
  });
});

describe('formatCurrency', () => {
  it('formats EUR currency correctly', () => {
    expect(formatCurrency(15.99, 'EUR')).toBe('€15.99');
  });

  it('formats USD currency correctly', () => {
    expect(formatCurrency(25.5, 'USD')).toBe('$25.50');
  });

  it('defaults to EUR when no currency specified', () => {
    expect(formatCurrency(10)).toBe('€10.00');
  });

  it('handles zero amount', () => {
    expect(formatCurrency(0, 'EUR')).toBe('€0.00');
  });

  it('falls back for unknown currency codes', () => {
    expect(formatCurrency(100, 'XYZ')).toBe('100.00 XYZ');
  });
});

describe('formatCurrencyWithCode', () => {
  it('formats EUR with code suffix', () => {
    expect(formatCurrencyWithCode(15.99, 'EUR')).toBe('€15.99 EUR');
  });

  it('formats USD with code suffix', () => {
    expect(formatCurrencyWithCode(25.5, 'USD')).toBe('$25.50 USD');
  });

  it('defaults to EUR when no currency specified', () => {
    expect(formatCurrencyWithCode(10)).toBe('€10.00 EUR');
  });

  it('falls back for unknown currency codes', () => {
    expect(formatCurrencyWithCode(100, 'XYZ')).toBe('100.00 XYZ');
  });
});
