import { useEffect, useCallback, useRef } from 'react';
import { useReminderStore } from '@/store/reminderStore';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { getDaysUntilPayment } from '@/utils/dateUtils';
import { formatCurrency } from '@/utils/calculations';

const CHECK_INTERVAL_MS = 60000; // Check every minute

interface UpcomingPayment {
  id: string;
  name: string;
  daysUntil: number;
  cost: number;
  currency: string;
}

export const useReminders = () => {
  const intervalRef = useRef<number | null>(null);

  const {
    enabled,
    daysBeforePayment,
    notificationPermission,
    notifiedSubscriptions,
    setNotificationPermission,
    markAsNotified,
    resetDailyNotifications,
  } = useReminderStore();

  const subscriptions = useSubscriptionStore((state) => state.subscriptions);

  // Request notification permission
  const requestPermission = useCallback(async (): Promise<NotificationPermission> => {
    if (!('Notification' in window)) {
      return 'denied';
    }

    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);
    return permission;
  }, [setNotificationPermission]);

  // Check if notifications are supported
  const isSupported = useCallback((): boolean => {
    return 'Notification' in window;
  }, []);

  // Get upcoming payments that need notification
  const getUpcomingPayments = useCallback((): UpcomingPayment[] => {
    return subscriptions
      .filter((sub) => {
        if (sub.status !== 'active') return false;

        const daysUntil = getDaysUntilPayment(sub.nextPaymentDate);
        return daysUntil >= 0 && daysUntil <= daysBeforePayment;
      })
      .map((sub) => ({
        id: sub.id,
        name: sub.name,
        daysUntil: getDaysUntilPayment(sub.nextPaymentDate),
        cost: sub.cost,
        currency: sub.currency,
      }));
  }, [subscriptions, daysBeforePayment]);

  // Show a notification
  const showNotification = useCallback(
    (payment: UpcomingPayment) => {
      if (notificationPermission !== 'granted') return;
      if (notifiedSubscriptions.includes(payment.id)) return;

      const daysText =
        payment.daysUntil === 0
          ? 'hoy'
          : payment.daysUntil === 1
            ? 'mañana'
            : `en ${payment.daysUntil} días`;

      const notification = new Notification('Pago próximo', {
        body: `${payment.name} (${formatCurrency(payment.cost, payment.currency)}) vence ${daysText}`,
        icon: '/icons/icon-192x192.png',
        tag: `payment-${payment.id}`,
        requireInteraction: false,
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      markAsNotified(payment.id);
    },
    [notificationPermission, notifiedSubscriptions, markAsNotified]
  );

  // Check and notify for upcoming payments
  const checkAndNotify = useCallback(() => {
    if (!enabled || notificationPermission !== 'granted') return;

    // Reset notifications if it's a new day
    resetDailyNotifications();

    const upcoming = getUpcomingPayments();

    upcoming.forEach((payment) => {
      if (!notifiedSubscriptions.includes(payment.id)) {
        showNotification(payment);
      }
    });
  }, [
    enabled,
    notificationPermission,
    resetDailyNotifications,
    getUpcomingPayments,
    notifiedSubscriptions,
    showNotification,
  ]);

  // Get pending reminders count (for badge/indicator)
  const getPendingRemindersCount = useCallback((): number => {
    if (!enabled) return 0;
    return getUpcomingPayments().length;
  }, [enabled, getUpcomingPayments]);

  // Setup interval for checking
  useEffect(() => {
    if (!enabled || notificationPermission !== 'granted') {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Check immediately on mount
    checkAndNotify();

    // Setup interval
    intervalRef.current = window.setInterval(checkAndNotify, CHECK_INTERVAL_MS);

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [enabled, notificationPermission, checkAndNotify]);

  // Check permission on mount
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, [setNotificationPermission]);

  return {
    enabled,
    isSupported,
    notificationPermission,
    requestPermission,
    checkAndNotify,
    getUpcomingPayments,
    getPendingRemindersCount,
  };
};
