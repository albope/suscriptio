// RevenueCat SDK initialization for Android (Google Play Billing)
// Only runs on native Android — no-op on web

import { isAndroid } from '@/lib/platform';
import { logger } from '@/lib/logger';

const log = logger.withContext('RevenueCat');

let initialized = false;

/**
 * Initialize RevenueCat Purchases SDK.
 * Must be called once at app startup (before any purchase calls).
 * Safe to call on web — does nothing.
 */
export const initRevenueCat = async (): Promise<void> => {
  if (initialized || !isAndroid()) return;

  const apiKey = import.meta.env.VITE_REVENUECAT_API_KEY;
  if (!apiKey) {
    log.warn('VITE_REVENUECAT_API_KEY not set — purchases disabled');
    return;
  }

  try {
    const { Purchases } = await import('@revenuecat/purchases-capacitor');
    await Purchases.configure({ apiKey });
    initialized = true;
    log.info('RevenueCat initialized');
  } catch (err) {
    log.error('Failed to initialize RevenueCat', err);
  }
};

/**
 * Identify the current user in RevenueCat (links purchases to Supabase user).
 * Call after login/register.
 */
export const identifyUser = async (userId: string): Promise<void> => {
  if (!initialized || !isAndroid()) return;

  try {
    const { Purchases } = await import('@revenuecat/purchases-capacitor');
    await Purchases.logIn({ appUserID: userId });
    log.info('User identified', { userId });
  } catch (err) {
    log.error('Failed to identify user in RevenueCat', err);
  }
};

/**
 * Reset RevenueCat user identity.
 * Call on logout.
 */
export const resetUser = async (): Promise<void> => {
  if (!initialized || !isAndroid()) return;

  try {
    const { Purchases } = await import('@revenuecat/purchases-capacitor');
    await Purchases.logOut();
    log.info('User reset');
  } catch (err) {
    // logOut throws if there's no current user — safe to ignore
    log.warn('Failed to reset RevenueCat user', err);
  }
};
