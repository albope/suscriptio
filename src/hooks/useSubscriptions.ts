import { useSubscriptionStore } from '@/store/subscriptionStore';
import { useSupabaseSubscriptions } from './useSupabaseSubscriptions';
import { useAuth } from '@/contexts/AuthContext';

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

  return {
    subscriptions: store.subscriptions,
    activeSubscriptions: store.getActiveSubscriptions(),
    upcomingPayments: store.getUpcomingPayments(30),
    monthlySpend: store.getMonthlySpend(),
    yearlySpend: store.getYearlySpend(),
    categoryBreakdown: store.getCategoryBreakdown(),
    mostExpensive: store.getMostExpensiveSubscription(),
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
