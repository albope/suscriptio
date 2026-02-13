import { useUserProfile } from './useUserProfile';
import { TIER_LIMITS, type PremiumFeature } from '@/types/billing';

export const usePremiumFeature = (feature: PremiumFeature) => {
  const { profile } = useUserProfile();
  const tier = profile?.subscriptionTier ?? 'free';
  return {
    isAvailable: TIER_LIMITS[tier][feature] as boolean,
    tier,
  };
};
