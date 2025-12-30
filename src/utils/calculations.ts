import { BillingFrequency } from '@/types';

export const normalizeToMonthly = (cost: number, frequency: BillingFrequency): number => {
  if (frequency === BillingFrequency.MONTHLY) return cost;
  if (frequency === BillingFrequency.YEARLY) return cost / 12;
  return 0;
};

export const normalizeToYearly = (cost: number, frequency: BillingFrequency): number => {
  if (frequency === BillingFrequency.MONTHLY) return cost * 12;
  if (frequency === BillingFrequency.YEARLY) return cost;
  return 0;
};

export const formatCurrency = (amount: number, currency: string = '€'): string => {
  return `${currency}${amount.toFixed(2)}`;
};
