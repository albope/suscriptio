export const FREE_TIER_MAX_SUBSCRIPTIONS = 5;

export const STRIPE_PRICES = {
  monthly: import.meta.env.VITE_STRIPE_PRICE_MONTHLY as string | undefined,
  annual: import.meta.env.VITE_STRIPE_PRICE_ANNUAL as string | undefined,
};

export const PRICING = {
  monthly: { amount: 2.99, currency: 'EUR' },
  annual: { amount: 24.99, currency: 'EUR' },
} as const;

// Annual savings percentage
export const ANNUAL_SAVINGS_PERCENT = Math.round(
  (1 - PRICING.annual.amount / (PRICING.monthly.amount * 12)) * 100
);
