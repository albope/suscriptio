import { formatDate, getDaysUntilPayment, getPaymentLabel, advancePaymentDate } from './dateUtils';
import { BillingFrequency } from '@/types';

describe('formatDate', () => {
  it('formats Date object correctly', () => {
    const date = new Date(2025, 0, 15); // January 15, 2025
    expect(formatDate(date)).toBe('15/01/2025');
  });

  it('formats ISO string correctly', () => {
    expect(formatDate('2025-12-25')).toBe('25/12/2025');
  });

  it('handles single-digit days and months', () => {
    const date = new Date(2025, 2, 5); // March 5, 2025
    expect(formatDate(date)).toBe('05/03/2025');
  });
});

describe('getDaysUntilPayment', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2025, 0, 15)); // January 15, 2025
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns 0 for today', () => {
    const today = new Date(2025, 0, 15);
    expect(getDaysUntilPayment(today)).toBe(0);
  });

  it('returns positive number for future dates', () => {
    const futureDate = new Date(2025, 0, 20); // January 20, 2025
    expect(getDaysUntilPayment(futureDate)).toBe(5);
  });

  it('returns negative number for past dates', () => {
    const pastDate = new Date(2025, 0, 10); // January 10, 2025
    expect(getDaysUntilPayment(pastDate)).toBe(-5);
  });

  it('works with string dates', () => {
    expect(getDaysUntilPayment('2025-01-20')).toBe(5);
  });
});

describe('getPaymentLabel', () => {
  it('returns "Vence hoy" for 0 days', () => {
    expect(getPaymentLabel(0)).toBe('Vence hoy');
  });

  it('returns "Vence mañana" for 1 day', () => {
    expect(getPaymentLabel(1)).toBe('Vence mañana');
  });

  it('returns "Vence en N días" for 2-7 days', () => {
    expect(getPaymentLabel(3)).toBe('Vence en 3 días');
    expect(getPaymentLabel(7)).toBe('Vence en 7 días');
  });

  it('returns empty string for more than 7 days', () => {
    expect(getPaymentLabel(8)).toBe('');
    expect(getPaymentLabel(30)).toBe('');
  });

  it('returns empty string for negative days', () => {
    expect(getPaymentLabel(-1)).toBe('');
  });
});

describe('advancePaymentDate', () => {
  it('advances monthly subscription by 1 month', () => {
    const date = new Date(2025, 0, 15); // January 15, 2025
    const result = advancePaymentDate(date, BillingFrequency.MONTHLY);
    expect(result.getMonth()).toBe(1); // February
    expect(result.getDate()).toBe(15);
    expect(result.getFullYear()).toBe(2025);
  });

  it('advances yearly subscription by 1 year', () => {
    const date = new Date(2025, 5, 20); // June 20, 2025
    const result = advancePaymentDate(date, BillingFrequency.YEARLY);
    expect(result.getFullYear()).toBe(2026);
    expect(result.getMonth()).toBe(5); // June
    expect(result.getDate()).toBe(20);
  });

  it('handles end of month for monthly (Feb 28 -> Mar 28)', () => {
    const date = new Date(2025, 0, 31); // January 31, 2025
    const result = advancePaymentDate(date, BillingFrequency.MONTHLY);
    // date-fns handles this by clamping to last day of February
    expect(result.getMonth()).toBe(1); // February
  });

  it('handles leap year for yearly advancement', () => {
    const date = new Date(2024, 1, 29); // February 29, 2024 (leap year)
    const result = advancePaymentDate(date, BillingFrequency.YEARLY);
    expect(result.getFullYear()).toBe(2025);
    // Non-leap year, so it should be Feb 28
    expect(result.getMonth()).toBe(1);
    expect(result.getDate()).toBe(28);
  });

  it('returns same date for unknown frequency', () => {
    const date = new Date(2025, 0, 15);
    // @ts-expect-error testing invalid input
    const result = advancePaymentDate(date, 'weekly');
    expect(result.getTime()).toBe(date.getTime());
  });
});
