import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Subscription, BillingFrequency, SubscriptionStatus, CategoryBreakdown } from '@/types';
import { addDays } from 'date-fns';

interface SubscriptionStore {
  subscriptions: Subscription[];
  addSubscription: (subscription: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSubscription: (id: string, updates: Partial<Subscription>) => void;
  deleteSubscription: (id: string) => void;
  permanentDelete: (id: string) => void;
  getSubscriptionById: (id: string) => Subscription | undefined;
  getActiveSubscriptions: () => Subscription[];
  getCanceledSubscriptions: () => Subscription[];
  getUpcomingPayments: (days: number) => Subscription[];
  getMonthlySpend: () => number;
  getYearlySpend: () => number;
  getCategoryBreakdown: () => CategoryBreakdown[];
  getMostExpensiveSubscription: () => Subscription | null;
  // Cloud sync methods
  setSubscriptions: (subscriptions: Subscription[]) => void;
  addSubscriptionFromCloud: (subscription: Subscription) => void;
  clearSubscriptions: () => void;
  getLocalSubscriptions: () => Subscription[];
}

export const useSubscriptionStore = create<SubscriptionStore>()(
  persist(
    (set, get) => ({
      subscriptions: [],

      addSubscription: (subscription) => {
        const newSubscription: Subscription = {
          ...subscription,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({
          subscriptions: [...state.subscriptions, newSubscription],
        }));
      },

      updateSubscription: (id, updates) => {
        set((state) => ({
          subscriptions: state.subscriptions.map((sub) =>
            sub.id === id ? { ...sub, ...updates, updatedAt: new Date() } : sub
          ),
        }));
      },

      deleteSubscription: (id) => {
        get().updateSubscription(id, { status: SubscriptionStatus.CANCELED });
      },

      permanentDelete: (id) => {
        set((state) => ({
          subscriptions: state.subscriptions.filter((sub) => sub.id !== id),
        }));
      },

      getSubscriptionById: (id) => {
        return get().subscriptions.find((sub) => sub.id === id);
      },

      getActiveSubscriptions: () => {
        return get().subscriptions.filter((sub) => sub.status === SubscriptionStatus.ACTIVE);
      },

      getCanceledSubscriptions: () => {
        return get().subscriptions.filter((sub) => sub.status === SubscriptionStatus.CANCELED);
      },

      getUpcomingPayments: (days) => {
        const now = new Date();
        const futureDate = addDays(now, days);
        return get()
          .getActiveSubscriptions()
          .filter((sub) => {
            const paymentDate = new Date(sub.nextPaymentDate);
            return paymentDate >= now && paymentDate <= futureDate;
          })
          .sort((a, b) => new Date(a.nextPaymentDate).getTime() - new Date(b.nextPaymentDate).getTime());
      },

      getMonthlySpend: () => {
        return get()
          .getActiveSubscriptions()
          .reduce((total, sub) => {
            if (sub.billingFrequency === BillingFrequency.MONTHLY) {
              return total + sub.cost;
            } else if (sub.billingFrequency === BillingFrequency.YEARLY) {
              return total + sub.cost / 12;
            }
            return total;
          }, 0);
      },

      getYearlySpend: () => {
        return get()
          .getActiveSubscriptions()
          .reduce((total, sub) => {
            if (sub.billingFrequency === BillingFrequency.MONTHLY) {
              return total + sub.cost * 12;
            } else if (sub.billingFrequency === BillingFrequency.YEARLY) {
              return total + sub.cost;
            }
            return total;
          }, 0);
      },

      getCategoryBreakdown: () => {
        const breakdown = new Map<string, { total: number; count: number }>();

        get().getActiveSubscriptions().forEach((sub) => {
          const category = sub.category || 'other';
          const monthlyCost =
            sub.billingFrequency === BillingFrequency.MONTHLY ? sub.cost : sub.cost / 12;

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
      },

      getMostExpensiveSubscription: () => {
        const active = get().getActiveSubscriptions();
        if (active.length === 0) return null;

        return active.reduce((max, sub) => {
          const maxMonthlyCost =
            max.billingFrequency === BillingFrequency.MONTHLY ? max.cost : max.cost / 12;
          const subMonthlyCost =
            sub.billingFrequency === BillingFrequency.MONTHLY ? sub.cost : sub.cost / 12;

          return subMonthlyCost > maxMonthlyCost ? sub : max;
        });
      },

      // Cloud sync methods
      setSubscriptions: (subscriptions) => {
        set({ subscriptions });
      },

      addSubscriptionFromCloud: (subscription) => {
        set((state) => ({
          subscriptions: [...state.subscriptions, subscription],
        }));
      },

      clearSubscriptions: () => {
        set({ subscriptions: [] });
      },

      getLocalSubscriptions: () => {
        return get().subscriptions;
      },
    }),
    {
      name: 'subscriptions-storage',
    }
  )
);
