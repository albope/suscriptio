export type SubscriptionTier = 'free' | 'premium';

export interface UserProfile {
  id: string;
  userId: string;
  subscriptionTier: SubscriptionTier;
  purchasePlatform: 'google_play' | 'web' | null;
  purchaseToken: string | null;
  purchasedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface TierLimits {
  maxActiveSubscriptions: number;
}

export const TIER_LIMITS: Record<SubscriptionTier, TierLimits> = {
  free: { maxActiveSubscriptions: 3 },
  premium: { maxActiveSubscriptions: Infinity },
};

// Database row type (snake_case from Supabase)
export interface DbUserProfile {
  id: string;
  user_id: string;
  subscription_tier: string;
  purchase_platform: string | null;
  purchase_token: string | null;
  purchased_at: string | null;
  created_at: string;
  updated_at: string;
}

// Convert DB row to app UserProfile
export const fromDbProfile = (row: DbUserProfile): UserProfile => ({
  id: row.id,
  userId: row.user_id,
  subscriptionTier: row.subscription_tier as SubscriptionTier,
  purchasePlatform: row.purchase_platform as UserProfile['purchasePlatform'],
  purchaseToken: row.purchase_token,
  purchasedAt: row.purchased_at ? new Date(row.purchased_at) : null,
  createdAt: new Date(row.created_at),
  updatedAt: new Date(row.updated_at),
});
