import { useSubscriptionStore } from '@/store/subscriptionStore';

export const useSubscriptions = () => {
  const store = useSubscriptionStore();

  return {
    subscriptions: store.subscriptions,
    activeSubscriptions: store.getActiveSubscriptions(),
    upcomingPayments: store.getUpcomingPayments(30),
    monthlySpend: store.getMonthlySpend(),
    yearlySpend: store.getYearlySpend(),
    categoryBreakdown: store.getCategoryBreakdown(),
    mostExpensive: store.getMostExpensiveSubscription(),
    addSubscription: store.addSubscription,
    updateSubscription: store.updateSubscription,
    deleteSubscription: store.deleteSubscription,
  };
};
