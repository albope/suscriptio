export type SubscriptionTier = 'free' | 'premium';

export interface UserProfile {
  id: string;
  userId: string;
  subscriptionTier: SubscriptionTier;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  stripePriceId: string | null;
  tierPeriodEnd: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface TierLimits {
  maxActiveSubscriptions: number;
}

export const TIER_LIMITS: Record<SubscriptionTier, TierLimits> = {
  free: { maxActiveSubscriptions: 5 },
  premium: { maxActiveSubscriptions: Infinity },
};

// Database row type (snake_case from Supabase)
export interface DbUserProfile {
  id: string;
  user_id: string;
  subscription_tier: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  stripe_price_id: string | null;
  tier_period_end: string | null;
  created_at: string;
  updated_at: string;
}

// Convert DB row to app UserProfile
export const fromDbProfile = (row: DbUserProfile): UserProfile => ({
  id: row.id,
  userId: row.user_id,
  subscriptionTier: row.subscription_tier as SubscriptionTier,
  stripeCustomerId: row.stripe_customer_id,
  stripeSubscriptionId: row.stripe_subscription_id,
  stripePriceId: row.stripe_price_id,
  tierPeriodEnd: row.tier_period_end ? new Date(row.tier_period_end) : null,
  createdAt: new Date(row.created_at),
  updatedAt: new Date(row.updated_at),
});
