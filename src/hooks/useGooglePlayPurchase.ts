import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { isAndroid } from '@/lib/platform';
import { logger } from '@/lib/logger';

const log = logger.withContext('GooglePlayPurchase');

// RevenueCat product ID — must match Google Play Console product ID
const PRODUCT_ID = 'lifetime';
// Entitlement identifier — must match RevenueCat dashboard
const ENTITLEMENT_ID = 'Suscriptio Premium';

export const useGooglePlayPurchase = () => {
  const { user } = useAuth();
  const { refetch } = useUserProfile();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfileToPremium = useCallback(
    async (appUserId: string) => {
      if (!user) return;
      await supabase
        .from('user_profiles')
        .update({
          subscription_tier: 'premium',
          purchase_platform: 'google_play',
          purchase_token: appUserId,
          purchased_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);
      await refetch();
    },
    [user, refetch],
  );

  const purchase = useCallback(async () => {
    if (!user) {
      setError('Not authenticated');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (!isAndroid()) {
        setError('PLATFORM_NOT_SUPPORTED');
        return false;
      }

      // Dynamic import — only loads on Android with the package installed
      const { Purchases, PRODUCT_CATEGORY } = await import('@revenuecat/purchases-capacitor');

      // Get the product first, then purchase it
      const { products } = await Purchases.getProducts({
        productIdentifiers: [PRODUCT_ID],
        type: PRODUCT_CATEGORY.NON_SUBSCRIPTION,
      });

      if (products.length === 0) {
        setError('Product not found');
        return false;
      }

      const { customerInfo } = await Purchases.purchaseStoreProduct({
        product: products[0],
      });

      // Check if the entitlement is now active
      const isPremium = customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;

      if (isPremium) {
        await updateProfileToPremium(customerInfo.originalAppUserId);
        log.info('Purchase successful');
        return true;
      }

      setError('Purchase did not activate premium');
      return false;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Purchase failed';
      log.error('Purchase error', err);
      // RevenueCat user cancellation
      if (message.includes('userCancelled') || message.includes('PurchaseCancelled')) {
        setError(null);
        return false;
      }
      setError(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user, updateProfileToPremium]);

  const restore = useCallback(async () => {
    if (!user) {
      setError('Not authenticated');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (!isAndroid()) {
        setError('PLATFORM_NOT_SUPPORTED');
        return false;
      }

      const { Purchases } = await import('@revenuecat/purchases-capacitor');
      const { customerInfo } = await Purchases.restorePurchases();

      const isPremium = customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;

      if (isPremium) {
        await updateProfileToPremium(customerInfo.originalAppUserId);
        log.info('Restore successful');
        return true;
      }

      setError('No previous purchase found');
      return false;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Restore failed';
      log.error('Restore error', err);
      setError(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user, updateProfileToPremium]);

  return { purchase, restore, isLoading, error };
};
