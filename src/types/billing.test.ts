// Tests for billing types and utilities

import { fromDbProfile, TIER_LIMITS } from './billing';
import type { DbUserProfile } from './billing';

describe('billing types', () => {
  describe('TIER_LIMITS', () => {
    it('free tier allows 3 subscriptions', () => {
      expect(TIER_LIMITS.free.maxActiveSubscriptions).toBe(3);
    });

    it('premium tier allows unlimited subscriptions', () => {
      expect(TIER_LIMITS.premium.maxActiveSubscriptions).toBe(Infinity);
    });

    it('has exactly two tiers', () => {
      expect(Object.keys(TIER_LIMITS)).toEqual(['free', 'premium']);
    });
  });

  describe('fromDbProfile', () => {
    const baseDbRow: DbUserProfile = {
      id: 'profile-1',
      user_id: 'user-123',
      subscription_tier: 'free',
      purchase_platform: null,
      purchase_token: null,
      purchased_at: null,
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z',
    };

    it('converts snake_case DB row to camelCase UserProfile', () => {
      const profile = fromDbProfile(baseDbRow);

      expect(profile.id).toBe('profile-1');
      expect(profile.userId).toBe('user-123');
      expect(profile.subscriptionTier).toBe('free');
      expect(profile.purchasePlatform).toBeNull();
      expect(profile.purchaseToken).toBeNull();
      expect(profile.purchasedAt).toBeNull();
      expect(profile.createdAt).toBeInstanceOf(Date);
      expect(profile.updatedAt).toBeInstanceOf(Date);
    });

    it('converts premium profile with Google Play purchase', () => {
      const premiumRow: DbUserProfile = {
        ...baseDbRow,
        subscription_tier: 'premium',
        purchase_platform: 'google_play',
        purchase_token: 'rc-user-abc',
        purchased_at: '2025-06-15T12:00:00Z',
      };

      const profile = fromDbProfile(premiumRow);

      expect(profile.subscriptionTier).toBe('premium');
      expect(profile.purchasePlatform).toBe('google_play');
      expect(profile.purchaseToken).toBe('rc-user-abc');
      expect(profile.purchasedAt).toBeInstanceOf(Date);
      expect(profile.purchasedAt!.toISOString()).toBe('2025-06-15T12:00:00.000Z');
    });

    it('converts date strings to Date objects', () => {
      const profile = fromDbProfile(baseDbRow);

      expect(profile.createdAt.toISOString()).toBe('2025-01-01T00:00:00.000Z');
      expect(profile.updatedAt.toISOString()).toBe('2025-01-01T00:00:00.000Z');
    });
  });
});
