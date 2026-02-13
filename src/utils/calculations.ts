import { BillingFrequency } from '@/types';
import { getCurrencyByCode, DEFAULT_CURRENCY } from '@/constants/currencies';

export const normalizeToMonthly = (cost: number, frequency: BillingFrequency, customIntervalDays?: number): number => {
  switch (frequency) {
    case BillingFrequency.WEEKLY: return cost * (30.44 / 7);
    case BillingFrequency.MONTHLY: return cost;
    case BillingFrequency.QUARTERLY: return cost / 3;
    case BillingFrequency.YEARLY: return cost / 12;
    case BillingFrequency.CUSTOM:
      return customIntervalDays ? cost * (30.44 / customIntervalDays) : 0;
    default: return 0;
  }
};

export const normalizeToYearly = (cost: number, frequency: BillingFrequency, customIntervalDays?: number): number => {
  switch (frequency) {
    case BillingFrequency.WEEKLY: return cost * (365.25 / 7);
    case BillingFrequency.MONTHLY: return cost * 12;
    case BillingFrequency.QUARTERLY: return cost * 4;
    case BillingFrequency.YEARLY: return cost;
    case BillingFrequency.CUSTOM:
      return customIntervalDays ? cost * (365.25 / customIntervalDays) : 0;
    default: return 0;
  }
};

/**
 * Formats an amount with currency symbol.
 * @param amount - The numeric amount to format
 * @param currencyCode - ISO currency code (e.g., 'EUR', 'USD')
 * @returns Formatted string like "€15.99" or "$15.99 USD"
 */
export const formatCurrency = (amount: number, currencyCode: string = DEFAULT_CURRENCY): string => {
  const currency = getCurrencyByCode(currencyCode);
  if (!currency) {
    // Fallback for unknown currencies
    return `${amount.toFixed(2)} ${currencyCode}`;
  }
  return `${currency.symbol}${amount.toFixed(2)}`;
};

/**
 * Formats amount with currency code suffix for clarity in multi-currency contexts.
 * @param amount - The numeric amount
 * @param currencyCode - ISO currency code
 * @returns Formatted string like "€15.99 EUR" or "$15.99 USD"
 */
export const formatCurrencyWithCode = (
  amount: number,
  currencyCode: string = DEFAULT_CURRENCY
): string => {
  const currency = getCurrencyByCode(currencyCode);
  if (!currency) {
    return `${amount.toFixed(2)} ${currencyCode}`;
  }
  return `${currency.symbol}${amount.toFixed(2)} ${currencyCode}`;
};
