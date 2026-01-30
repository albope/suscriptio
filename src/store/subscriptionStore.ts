import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Subscription, BillingFrequency, SubscriptionStatus, CategoryBreakdown } from '@/types';
import { addDays, addMonths, addYears, isBefore, startOfDay } from 'date-fns';
import { DEFAULT_CURRENCY } from '@/constants/currencies';

// Helper function to advance past payment dates
function advancePaymentDates(subscriptions: Subscription[]): Subscription[] {
  const today = startOfDay(new Date());

  return subscriptions.map((sub) => {
    if (sub.status !== SubscriptionStatus.ACTIVE) return sub;

    const nextPayment = startOfDay(new Date(sub.nextPaymentDate));
    if (!isBefore(nextPayment, today)) return sub;

    let newDate = nextPayment;
    if (sub.billingFrequency === BillingFrequency.MONTHLY) {
      while (isBefore(newDate, today)) {
        newDate = addMonths(newDate, 1);
      }
    } else if (sub.billingFrequency === BillingFrequency.YEARLY) {
      while (isBefore(newDate, today)) {
        newDate = addYears(newDate, 1);
      }
    }

    if (newDate.getTime() !== nextPayment.getTime()) {
      return { ...sub, nextPaymentDate: newDate, updatedAt: new Date() };
    }

    return sub;
  });
}

// Undo state (outside store to avoid persistence)
let lastDeletedSubscription: Subscription | null = null;
let undoTimeout: ReturnType<typeof setTimeout> | null = null;

interface SubscriptionStore {
  subscriptions: Subscription[];
  addSubscription: (subscription: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSubscription: (id: string, updates: Partial<Subscription>) => void;
  deleteSubscription: (id: string) => void;
  permanentDelete: (id: string) => void;
  undoDelete: () => boolean;
  getSubscriptionById: (id: string) => Subscription | undefined;
  getActiveSubscriptions: () => Subscription[];
  getCanceledSubscriptions: () => Subscription[];
  getUpcomingPayments: (days: number) => Subscription[];
  getMonthlySpend: () => number;
  getYearlySpend: () => number;
  getCategoryBreakdown: () => CategoryBreakdown[];
  getMostExpensiveSubscription: () => Subscription | null;
  getAverageCost: () => number;
  getSubscriptionsByFrequency: () => { monthly: number; yearly: number };
  getAllTags: () => string[];
  // Cloud sync methods
  setSubscriptions: (subscriptions: Subscription[]) => void;
  addSubscriptionFromCloud: (subscription: Subscription) => void;
  clearSubscriptions: () => void;
  getLocalSubscriptions: () => Subscription[];
  // Import methods
  replaceAllSubscriptions: (subscriptions: Subscription[]) => void;
  addMultipleSubscriptions: (subscriptions: Subscription[]) => void;
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
        const sub = get().subscriptions.find((s) => s.id === id);
        if (sub) {
          // Store for potential undo
          lastDeletedSubscription = sub;

          // Clear any existing timeout
          if (undoTimeout) {
            clearTimeout(undoTimeout);
          }

          // Auto-clear undo after 5 seconds
          undoTimeout = setTimeout(() => {
            lastDeletedSubscription = null;
            undoTimeout = null;
          }, 5000);
        }

        set((state) => ({
          subscriptions: state.subscriptions.filter((s) => s.id !== id),
        }));
      },

      undoDelete: () => {
        if (lastDeletedSubscription) {
          const subToRestore = lastDeletedSubscription;

          // Clear undo state
          if (undoTimeout) {
            clearTimeout(undoTimeout);
            undoTimeout = null;
          }
          lastDeletedSubscription = null;

          // Restore the subscription
          set((state) => ({
            subscriptions: [...state.subscriptions, subToRestore],
          }));

          return true;
        }
        return false;
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
          .sort(
            (a, b) => new Date(a.nextPaymentDate).getTime() - new Date(b.nextPaymentDate).getTime()
          );
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
        const breakdown = new Map<
          string,
          { totalsByCurrency: Map<string, number>; count: number }
        >();

        get()
          .getActiveSubscriptions()
          .forEach((sub) => {
            const category = sub.category || 'other';
            const currency = sub.currency || 'EUR';
            const monthlyCost =
              sub.billingFrequency === BillingFrequency.MONTHLY ? sub.cost : sub.cost / 12;

            const existing = breakdown.get(category) || { totalsByCurrency: new Map(), count: 0 };
            const currentTotal = existing.totalsByCurrency.get(currency) || 0;
            existing.totalsByCurrency.set(currency, currentTotal + monthlyCost);
            existing.count += 1;
            breakdown.set(category, existing);
          });

        return Array.from(breakdown.entries()).map(([category, data]) => ({
          category,
          count: data.count,
          total: 0, // Deprecated, kept for compatibility
          totalsByCurrency: Array.from(data.totalsByCurrency.entries()).map(
            ([currency, amount]) => ({
              currency,
              amount,
            })
          ),
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

      getAverageCost: () => {
        const active = get().getActiveSubscriptions();
        if (active.length === 0) return 0;

        const totalMonthly = get().getMonthlySpend();
        return totalMonthly / active.length;
      },

      getSubscriptionsByFrequency: () => {
        const active = get().getActiveSubscriptions();
        const monthly = active.filter(
          (sub) => sub.billingFrequency === BillingFrequency.MONTHLY
        ).length;
        const yearly = active.filter(
          (sub) => sub.billingFrequency === BillingFrequency.YEARLY
        ).length;
        return { monthly, yearly };
      },

      getAllTags: () => {
        const tagSet = new Set<string>();
        get().subscriptions.forEach((sub) => {
          sub.tags?.forEach((tag) => {
            if (tag.trim()) tagSet.add(tag.trim());
          });
        });
        return Array.from(tagSet).sort();
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

      // Import methods
      replaceAllSubscriptions: (subscriptions) => {
        set({ subscriptions });
      },

      addMultipleSubscriptions: (newSubscriptions) => {
        set((state) => {
          // Filter out duplicates by ID
          const existingIds = new Set(state.subscriptions.map((s) => s.id));
          const uniqueNew = newSubscriptions.filter((s) => !existingIds.has(s.id));
          return {
            subscriptions: [...state.subscriptions, ...uniqueNew],
          };
        });
      },
    }),
    {
      name: 'subscriptions-storage',
      version: 2,
      migrate: (persistedState: unknown, version: number) => {
        const state = persistedState as { subscriptions: Subscription[] };

        // Migration from version 0 to 1: Add currency field
        if (version === 0) {
          console.log('[Migration] Migrating subscriptions to version 1: adding currency field');
          state.subscriptions = state.subscriptions.map((sub) => ({
            ...sub,
            currency: sub.currency || DEFAULT_CURRENCY,
          }));
        }

        // Migration from version 1 to 2: Add tags field
        if (version < 2) {
          console.log('[Migration] Migrating subscriptions to version 2: adding tags field');
          state.subscriptions = state.subscriptions.map((sub) => ({
            ...sub,
            tags: sub.tags || [],
          }));
        }

        return state;
      },
      onRehydrateStorage: () => {
        return (state) => {
          if (state && state.subscriptions.length > 0) {
            // Auto-advance payment dates on app load
            const advanced = advancePaymentDates(state.subscriptions);
            // Check if any subscription was actually updated (compare by timestamp)
            const hasChanges = advanced.some((sub, i) => {
              const original = state.subscriptions[i];
              if (!original) return true;
              const newTime = new Date(sub.nextPaymentDate).getTime();
              const oldTime = new Date(original.nextPaymentDate).getTime();
              return newTime !== oldTime;
            });
            if (hasChanges) {
              useSubscriptionStore.setState({ subscriptions: advanced });
            }
          }
        };
      },
    }
  )
);
