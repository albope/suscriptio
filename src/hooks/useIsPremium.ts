import { useUserProfile } from './useUserProfile';

export const useIsPremium = (): boolean => {
  const { profile } = useUserProfile();
  return profile?.subscriptionTier === 'premium';
};
