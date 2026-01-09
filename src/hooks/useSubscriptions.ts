import { useMemo } from 'react';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { useSettingsStore } from '@/store/settingsStore';
import { useSupabaseSubscriptions } from './useSupabaseSubscriptions';
import { useAuth } from '@/contexts/AuthContext';
import { BillingFrequency, SubscriptionStatus, Subscription } from '@/types';
import { addDays } from 'date-fns';

export const useSubscriptions = () => {
  // Use selector to get subscriptions - this ensures reactivity
  const subscriptions = useSubscriptionStore((state) => state.subscriptions);
  const preferredCurrency = useSettingsStore((state) => state.preferredCurrency);
  const addSubscriptionStore = useSubscriptionStore((state) => state.addSubscription);
  const updateSubscriptionStore = useSubscriptionStore((state) => state.updateSubscription);
  const deleteSubscriptionStore = useSubscriptionStore((state) => state.deleteSubscription);
  const permanentDeleteStore = useSubscriptionStore((state) => state.permanentDelete);
  const getLocalSubscriptions = useSubscriptionStore((state) => state.getLocalSubscriptions);
  const clearSubscriptions = useSubscriptionStore((state) => state.clearSubscriptions);

  const { user } = useAuth();
  const supabase = useSupabaseSubscriptions();

  // If user is authenticated, use Supabase operations
  // Otherwise, use local store operations
  const addSubscription = user ? supabase.addSubscription : addSubscriptionStore;
  const updateSubscription = user ? supabase.updateSubscription : updateSubscriptionStore;
  const deleteSubscription = user ? supabase.deleteSubscription : deleteSubscriptionStore;
  const permanentDelete = user ? supabase.permanentDelete : permanentDeleteStore;

  // Derive all computed values from subscriptions array to ensure reactivity
  const activeSubscriptions = useMemo(
    () => subscriptions.filter((sub: Subscription) => sub.status === SubscriptionStatus.ACTIVE),
    [subscriptions]
  );

  // Filter active subscriptions by preferred currency
  const activeInPreferredCurrency = useMemo(
    () => activeSubscriptions.filter((sub: Subscription) => sub.currency === preferredCurrency),
    [activeSubscriptions, preferredCurrency]
  );

  // Count subscriptions in other currencies
  const subscriptionsInOtherCurrencies = useMemo(
    () => activeSubscriptions.filter((sub: Subscription) => sub.currency !== preferredCurrency),
    [activeSubscriptions, preferredCurrency]
  );

  const upcomingPayments = useMemo(() => {
    const now = new Date();
    const futureDate = addDays(now, 30);
    return activeSubscriptions
      .filter((sub: Subscription) => {
        const paymentDate = new Date(sub.nextPaymentDate);
        return paymentDate >= now && paymentDate <= futureDate;
      })
      .sort((a: Subscription, b: Subscription) =>
        new Date(a.nextPaymentDate).getTime() - new Date(b.nextPaymentDate).getTime()
      );
  }, [activeSubscriptions]);

  // Calculate spend only for subscriptions in preferred currency
  const monthlySpend = useMemo(
    () =>
      activeInPreferredCurrency.reduce((total: number, sub: Subscription) => {
        if (sub.billingFrequency === BillingFrequency.MONTHLY) {
          return total + sub.cost;
        } else if (sub.billingFrequency === BillingFrequency.YEARLY) {
          return total + sub.cost / 12;
        }
        return total;
      }, 0),
    [activeInPreferredCurrency]
  );

  const yearlySpend = useMemo(
    () =>
      activeInPreferredCurrency.reduce((total: number, sub: Subscription) => {
        if (sub.billingFrequency === BillingFrequency.MONTHLY) {
          return total + sub.cost * 12;
        } else if (sub.billingFrequency === BillingFrequency.YEARLY) {
          return total + sub.cost;
        }
        return total;
      }, 0),
    [activeInPreferredCurrency]
  );

  // Calculate spend grouped by currency (for multi-currency display)
  const spendByCurrency = useMemo(() => {
    const byCurrency = new Map<string, { monthly: number; yearly: number; count: number }>();

    activeSubscriptions.forEach((sub: Subscription) => {
      const currency = sub.currency || preferredCurrency;
      const existing = byCurrency.get(currency) || { monthly: 0, yearly: 0, count: 0 };

      const monthlyCost = sub.billingFrequency === BillingFrequency.MONTHLY ? sub.cost : sub.cost / 12;
      const yearlyCost = sub.billingFrequency === BillingFrequency.MONTHLY ? sub.cost * 12 : sub.cost;

      byCurrency.set(currency, {
        monthly: existing.monthly + monthlyCost,
        yearly: existing.yearly + yearlyCost,
        count: existing.count + 1,
      });
    });

    // Convert to array and sort: preferred currency first, then alphabetically
    return Array.from(byCurrency.entries())
      .map(([currency, data]) => ({ currency, ...data }))
      .sort((a, b) => {
        if (a.currency === preferredCurrency) return -1;
        if (b.currency === preferredCurrency) return 1;
        return a.currency.localeCompare(b.currency);
      });
  }, [activeSubscriptions, preferredCurrency]);

  // Category breakdown - groups by currency within each category
  const categoryBreakdown = useMemo(() => {
    const breakdown = new Map<string, { totalsByCurrency: Map<string, number>; count: number }>();

    activeSubscriptions.forEach((sub: Subscription) => {
      const category = sub.category || 'other';
      const currency = sub.currency || preferredCurrency;
      const monthlyCost = sub.billingFrequency === BillingFrequency.MONTHLY ? sub.cost : sub.cost / 12;

      const existing = breakdown.get(category) || { totalsByCurrency: new Map(), count: 0 };
      const currentTotal = existing.totalsByCurrency.get(currency) || 0;
      existing.totalsByCurrency.set(currency, currentTotal + monthlyCost);
      existing.count += 1;
      breakdown.set(category, existing);
    });

    return Array.from(breakdown.entries()).map(([category, data]) => ({
      category,
      count: data.count,
      // For backwards compatibility, calculate total only from preferred currency
      total: data.totalsByCurrency.get(preferredCurrency) || 0,
      // New: provide totals by currency for multi-currency display
      totalsByCurrency: Array.from(data.totalsByCurrency.entries()).map(([currency, amount]) => ({
        currency,
        amount,
      })),
    }));
  }, [activeSubscriptions, preferredCurrency]);

  const mostExpensive = useMemo(() => {
    if (activeSubscriptions.length === 0) return null;

    return activeSubscriptions.reduce((max: Subscription, sub: Subscription) => {
      const maxMonthlyCost = max.billingFrequency === BillingFrequency.MONTHLY ? max.cost : max.cost / 12;
      const subMonthlyCost = sub.billingFrequency === BillingFrequency.MONTHLY ? sub.cost : sub.cost / 12;

      return subMonthlyCost > maxMonthlyCost ? sub : max;
    });
  }, [activeSubscriptions]);

  const averageCost = useMemo(() => {
    if (activeInPreferredCurrency.length === 0) return 0;
    return monthlySpend / activeInPreferredCurrency.length;
  }, [activeInPreferredCurrency, monthlySpend]);

  const subscriptionsByFrequency = useMemo(() => {
    const monthly = activeSubscriptions.filter((sub: Subscription) => sub.billingFrequency === BillingFrequency.MONTHLY).length;
    const yearly = activeSubscriptions.filter((sub: Subscription) => sub.billingFrequency === BillingFrequency.YEARLY).length;
    return { monthly, yearly };
  }, [activeSubscriptions]);

  return {
    subscriptions,
    activeSubscriptions,
    upcomingPayments,
    monthlySpend,
    yearlySpend,
    categoryBreakdown,
    mostExpensive,
    averageCost,
    subscriptionsByFrequency,
    // Multi-currency info
    preferredCurrency,
    spendByCurrency,
    subscriptionsInOtherCurrencies,
    hasOtherCurrencies: subscriptionsInOtherCurrencies.length > 0,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    permanentDelete,
    // Cloud sync states
    isLoading: supabase.isLoading,
    isSyncing: supabase.isSyncing,
    error: supabase.error,
    // Migration
    migrateLocalToCloud: supabase.migrateLocalToCloud,
    refetch: supabase.refetch,
    // Local data access (for migration check)
    getLocalSubscriptions,
    clearSubscriptions,
  };
};
