import { useMemo } from 'react';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { useSupabaseSubscriptions } from './useSupabaseSubscriptions';
import { useAuth } from '@/contexts/AuthContext';
import { BillingFrequency, SubscriptionStatus } from '@/types';
import { addDays } from 'date-fns';

export const useSubscriptions = () => {
  const store = useSubscriptionStore();
  const { user } = useAuth();
  const supabase = useSupabaseSubscriptions();

  // If user is authenticated, use Supabase operations
  // Otherwise, use local store operations
  const addSubscription = user ? supabase.addSubscription : store.addSubscription;
  const updateSubscription = user ? supabase.updateSubscription : store.updateSubscription;
  const deleteSubscription = user ? supabase.deleteSubscription : store.deleteSubscription;
  const permanentDelete = user ? supabase.permanentDelete : store.permanentDelete;

  // Derive all computed values from subscriptions array to ensure reactivity
  const activeSubscriptions = useMemo(
    () => store.subscriptions.filter((sub) => sub.status === SubscriptionStatus.ACTIVE),
    [store.subscriptions]
  );

  const upcomingPayments = useMemo(() => {
    const now = new Date();
    const futureDate = addDays(now, 30);
    return activeSubscriptions
      .filter((sub) => {
        const paymentDate = new Date(sub.nextPaymentDate);
        return paymentDate >= now && paymentDate <= futureDate;
      })
      .sort((a, b) => new Date(a.nextPaymentDate).getTime() - new Date(b.nextPaymentDate).getTime());
  }, [activeSubscriptions]);

  const monthlySpend = useMemo(
    () =>
      activeSubscriptions.reduce((total, sub) => {
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
      activeSubscriptions.reduce((total, sub) => {
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

    activeSubscriptions.forEach((sub) => {
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

    return activeSubscriptions.reduce((max, sub) => {
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
    const monthly = activeSubscriptions.filter((sub) => sub.billingFrequency === BillingFrequency.MONTHLY).length;
    const yearly = activeSubscriptions.filter((sub) => sub.billingFrequency === BillingFrequency.YEARLY).length;
    return { monthly, yearly };
  }, [activeSubscriptions]);

  return {
    subscriptions: store.subscriptions,
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
    getLocalSubscriptions: store.getLocalSubscriptions,
    clearSubscriptions: store.clearSubscriptions,
  };
};
