import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { Subscription, BillingFrequency, SubscriptionStatus, Category } from '@/types';

// Database row type (snake_case from Supabase)
interface DbSubscription {
  id: string;
  user_id: string;
  name: string;
  cost: number;
  currency: string;
  billing_frequency: string;
  next_payment_date: string;
  status: string;
  category: string | null;
  tags: string[] | null;
  notes: string | null;
  provider_url: string | null;
  created_at: string;
  updated_at: string;
}

// Convert DB row to app Subscription
const fromDb = (row: DbSubscription): Subscription => ({
  id: row.id,
  name: row.name,
  cost: Number(row.cost),
  currency: row.currency,
  billingFrequency: row.billing_frequency as BillingFrequency,
  nextPaymentDate: new Date(row.next_payment_date),
  status: row.status as SubscriptionStatus,
  category: row.category as Category | undefined,
  tags: row.tags || undefined,
  notes: row.notes || undefined,
  providerUrl: row.provider_url || undefined,
  createdAt: new Date(row.created_at),
  updatedAt: new Date(row.updated_at),
});

// Convert app Subscription to DB format
const toDb = (sub: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>, userId: string) => ({
  user_id: userId,
  name: sub.name,
  cost: sub.cost,
  currency: sub.currency,
  billing_frequency: sub.billingFrequency,
  next_payment_date:
    sub.nextPaymentDate instanceof Date
      ? sub.nextPaymentDate.toISOString().split('T')[0]
      : sub.nextPaymentDate,
  status: sub.status,
  category: sub.category || null,
  tags: sub.tags || null,
  notes: sub.notes || null,
  provider_url: sub.providerUrl || null,
});

export const useSupabaseSubscriptions = () => {
  const { user } = useAuth();
  // Use individual selectors for better reactivity
  const setSubscriptions = useSubscriptionStore((state) => state.setSubscriptions);
  const addSubscriptionFromCloud = useSubscriptionStore((state) => state.addSubscriptionFromCloud);
  const updateSubscriptionInStore = useSubscriptionStore((state) => state.updateSubscription);
  const permanentDeleteFromStore = useSubscriptionStore((state) => state.permanentDelete);
  const clearSubscriptions = useSubscriptionStore((state) => state.clearSubscriptions);

  // Only show loading if user is authenticated (will fetch from cloud)
  const [isLoading, setIsLoading] = useState(!!user);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch subscriptions from Supabase
  const fetchSubscriptions = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    // Limpiar store antes de fetch para evitar duplicados con datos de localStorage
    clearSubscriptions();

    const { data, error: fetchError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .order('next_payment_date', { ascending: true });

    if (fetchError) {
      setError(fetchError.message);
      setIsLoading(false);
      return;
    }

    // Update store with cloud data
    const subscriptions = (data || []).map(fromDb);
    setSubscriptions(subscriptions);
    setIsLoading(false);
  }, [user, clearSubscriptions, setSubscriptions]);

  // Add subscription to Supabase
  const addSubscription = async (
    subscription: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    if (!user) return;

    setIsSyncing(true);
    const { data, error: insertError } = await supabase
      .from('subscriptions')
      .insert(toDb(subscription, user.id))
      .select()
      .single();

    if (insertError) {
      setError(insertError.message);
      setIsSyncing(false);
      return;
    }

    // Add to local store
    if (data) {
      const newSub = fromDb(data);
      addSubscriptionFromCloud(newSub);
    }
    setIsSyncing(false);
  };

  // Update subscription in Supabase
  const updateSubscription = async (id: string, updates: Partial<Subscription>) => {
    if (!user) return;

    setIsSyncing(true);

    // Convert updates to DB format
    const dbUpdates: Record<string, unknown> = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.cost !== undefined) dbUpdates.cost = updates.cost;
    if (updates.currency !== undefined) dbUpdates.currency = updates.currency;
    if (updates.billingFrequency !== undefined)
      dbUpdates.billing_frequency = updates.billingFrequency;
    if (updates.nextPaymentDate !== undefined) {
      dbUpdates.next_payment_date =
        updates.nextPaymentDate instanceof Date
          ? updates.nextPaymentDate.toISOString().split('T')[0]
          : updates.nextPaymentDate;
    }
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.category !== undefined) dbUpdates.category = updates.category || null;
    if (updates.tags !== undefined) dbUpdates.tags = updates.tags || null;
    if (updates.notes !== undefined) dbUpdates.notes = updates.notes || null;
    if (updates.providerUrl !== undefined) dbUpdates.provider_url = updates.providerUrl || null;

    const { error: updateError } = await supabase
      .from('subscriptions')
      .update(dbUpdates)
      .eq('id', id)
      .eq('user_id', user.id);

    if (updateError) {
      setError(updateError.message);
      setIsSyncing(false);
      return;
    }

    // Update local store
    updateSubscriptionInStore(id, updates);
    setIsSyncing(false);
  };

  // Delete (cancel) subscription - soft delete
  const deleteSubscription = async (id: string) => {
    await updateSubscription(id, { status: SubscriptionStatus.CANCELED });
  };

  // Permanently delete subscription from database
  const permanentDelete = async (id: string) => {
    if (!user) return false;

    setIsSyncing(true);
    const { error: deleteError } = await supabase
      .from('subscriptions')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (deleteError) {
      setError(deleteError.message);
      setIsSyncing(false);
      return false;
    }

    // Remove from local store
    permanentDeleteFromStore(id);
    setIsSyncing(false);
    return true;
  };

  // Migrate local data to cloud
  const migrateLocalToCloud = async (localSubscriptions: Subscription[]) => {
    if (!user || localSubscriptions.length === 0) return;

    setIsSyncing(true);

    const dbSubscriptions = localSubscriptions.map((sub) => ({
      user_id: user.id,
      name: sub.name,
      cost: sub.cost,
      currency: sub.currency,
      billing_frequency: sub.billingFrequency,
      next_payment_date:
        sub.nextPaymentDate instanceof Date
          ? sub.nextPaymentDate.toISOString().split('T')[0]
          : String(sub.nextPaymentDate).split('T')[0],
      status: sub.status,
      category: sub.category || null,
      tags: sub.tags || null,
      notes: sub.notes || null,
      provider_url: sub.providerUrl || null,
    }));

    const { error: insertError } = await supabase.from('subscriptions').insert(dbSubscriptions);

    if (insertError) {
      setError(insertError.message);
      setIsSyncing(false);
      return false;
    }

    // Refetch to get server-assigned IDs
    await fetchSubscriptions();
    setIsSyncing(false);
    return true;
  };

  // Initial fetch when user logs in
  useEffect(() => {
    if (user) {
      fetchSubscriptions();
    } else {
      setIsLoading(false);
    }
  }, [user, fetchSubscriptions]);

  return {
    isLoading,
    isSyncing,
    error,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    permanentDelete,
    migrateLocalToCloud,
    refetch: fetchSubscriptions,
  };
};
