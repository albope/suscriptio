import { useMemo } from 'react';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { useSupabaseSubscriptions } from './useSupabaseSubscriptions';
import { useAuth } from '@/contexts/AuthContext';
import { BillingFrequency, SubscriptionStatus, Subscription } from '@/types';
import { addDays } from 'date-fns';

export const useSubscriptions = () => {
  // Use selector to get subscriptions - this ensures reactivity
  const subscriptions = useSubscriptionStore((state) => state.subscriptions);
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

  const monthlySpend = useMemo(
    () =>
      activeSubscriptions.reduce((total: number, sub: Subscription) => {
        if (sub.billingFrequency === BillingFrequency.MONTHLY) {
          return total + sub.cost;
        } else if (sub.billingFrequency === BillingFrequency.YEARLY) {
          return total + sub.cost / 12;
        }
        return total;
      }, 0),
    [activeSubscriptions]
  );

  const yearlySpend = useMemo(
    () =>
      activeSubscriptions.reduce((total: number, sub: Subscription) => {
        if (sub.billingFrequency === BillingFrequency.MONTHLY) {
          return total + sub.cost * 12;
        } else if (sub.billingFrequency === BillingFrequency.YEARLY) {
          return total + sub.cost;
        }
        return total;
      }, 0),
    [activeSubscriptions]
  );

  const categoryBreakdown = useMemo(() => {
    const breakdown = new Map<string, { total: number; count: number }>();

    activeSubscriptions.forEach((sub: Subscription) => {
      const category = sub.category || 'other';
      const monthlyCost = sub.billingFrequency === BillingFrequency.MONTHLY ? sub.cost : sub.cost / 12;

      const existing = breakdown.get(category) || { total: 0, count: 0 };
      breakdown.set(category, {
        total: existing.total + monthlyCost,
        count: existing.count + 1,
      });
    });

    return Array.from(breakdown.entries()).map(([category, data]) => ({
      category,
      ...data,
    }));
  }, [activeSubscriptions]);

  const mostExpensive = useMemo(() => {
    if (activeSubscriptions.length === 0) return null;

    return activeSubscriptions.reduce((max: Subscription, sub: Subscription) => {
      const maxMonthlyCost = max.billingFrequency === BillingFrequency.MONTHLY ? max.cost : max.cost / 12;
      const subMonthlyCost = sub.billingFrequency === BillingFrequency.MONTHLY ? sub.cost : sub.cost / 12;

      return subMonthlyCost > maxMonthlyCost ? sub : max;
    });
  }, [activeSubscriptions]);

  const averageCost = useMemo(() => {
    if (activeSubscriptions.length === 0) return 0;
    return monthlySpend / activeSubscriptions.length;
  }, [activeSubscriptions, monthlySpend]);

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
