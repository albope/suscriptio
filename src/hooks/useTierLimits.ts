import { useMemo } from 'react';
import { useUserProfile } from './useUserProfile';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { TIER_LIMITS, SubscriptionTier } from '@/types/billing';
import { SubscriptionStatus } from '@/types/subscription';

export const useTierLimits = () => {
  const { profile, isLoading } = useUserProfile();
  const subscriptions = useSubscriptionStore((state) => state.subscriptions);

  return useMemo(() => {
    const tier: SubscriptionTier = profile?.subscriptionTier ?? 'free';
    const limits = TIER_LIMITS[tier];
    const currentCount = subscriptions.filter(
      (s) => s.status === SubscriptionStatus.ACTIVE
    ).length;
    const canAddSubscription = currentCount < limits.maxActiveSubscriptions;
    const remainingSlots = Math.max(0, limits.maxActiveSubscriptions - currentCount);

    return {
      tier,
      limits,
      currentCount,
      canAddSubscription,
      remainingSlots,
      isLoading,
    };
  }, [profile, subscriptions, isLoading]);
};
