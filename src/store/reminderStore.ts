import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ReminderSettings {
  enabled: boolean;
  daysBeforePayment: number;
  notificationPermission: NotificationPermission | 'default';
  lastNotificationCheck: string | null;
  notifiedSubscriptions: string[]; // IDs of subscriptions already notified today
}

interface ReminderStore extends ReminderSettings {
  setEnabled: (enabled: boolean) => void;
  setDaysBeforePayment: (days: number) => void;
  setNotificationPermission: (permission: NotificationPermission) => void;
  markAsNotified: (subscriptionId: string) => void;
  resetDailyNotifications: () => void;
  clearNotifiedSubscriptions: () => void;
}

export const useReminderStore = create<ReminderStore>()(
  persist(
    (set, get) => ({
      enabled: false,
      daysBeforePayment: 1,
      notificationPermission: 'default',
      lastNotificationCheck: null,
      notifiedSubscriptions: [],

      setEnabled: (enabled) => set({ enabled }),

      setDaysBeforePayment: (days) => set({ daysBeforePayment: days }),

      setNotificationPermission: (permission) => set({ notificationPermission: permission }),

      markAsNotified: (subscriptionId) =>
        set((state) => ({
          notifiedSubscriptions: [...state.notifiedSubscriptions, subscriptionId],
          lastNotificationCheck: new Date().toISOString(),
        })),

      resetDailyNotifications: () => {
        const today = new Date().toDateString();
        const lastCheck = get().lastNotificationCheck;

        if (lastCheck) {
          const lastCheckDate = new Date(lastCheck).toDateString();
          if (lastCheckDate !== today) {
            set({ notifiedSubscriptions: [], lastNotificationCheck: null });
          }
        }
      },

      clearNotifiedSubscriptions: () =>
        set({ notifiedSubscriptions: [], lastNotificationCheck: null }),
    }),
    {
      name: 'reminder-settings',
      version: 1,
    }
  )
);
