// Native local notifications for Android via @capacitor/local-notifications
// No-op on web — the web path uses Web Notifications API in useReminders.ts

import { isAndroid } from '@/lib/platform';
import { logger } from '@/lib/logger';
import { formatCurrency } from '@/utils/calculations';
import type { Subscription } from '@/types';
import type { TFunction } from 'i18next';

const log = logger.withContext('LocalNotifications');

let channelCreated = false;

/** djb2 hash → positive 32-bit integer (Android requires numeric IDs) */
export const hashSubscriptionId = (uuid: string): number => {
  let hash = 5381;
  for (let i = 0; i < uuid.length; i++) {
    hash = ((hash << 5) + hash + uuid.charCodeAt(i)) | 0;
  }
  return Math.abs(hash % 2147483647) + 1; // Ensure positive and non-zero
};

async function ensureChannel(): Promise<void> {
  if (channelCreated || !isAndroid()) return;

  try {
    const { LocalNotifications } = await import('@capacitor/local-notifications');
    await LocalNotifications.createChannel({
      id: 'payment-reminders',
      name: 'Payment Reminders',
      description: 'Notifications for upcoming subscription payments',
      importance: 4,
      visibility: 1,
      sound: 'default',
      vibration: true,
    });
    channelCreated = true;
    log.info('Notification channel created');
  } catch (err) {
    log.error('Failed to create notification channel', err);
  }
}

export const checkNativePermission = async (): Promise<'granted' | 'denied' | 'prompt'> => {
  if (!isAndroid()) return 'denied';

  try {
    const { LocalNotifications } = await import('@capacitor/local-notifications');
    const result = await LocalNotifications.checkPermissions();
    return result.display as 'granted' | 'denied' | 'prompt';
  } catch (err) {
    log.error('Failed to check native permissions', err);
    return 'denied';
  }
};

export const requestNativePermission = async (): Promise<'granted' | 'denied'> => {
  if (!isAndroid()) return 'denied';

  try {
    const { LocalNotifications } = await import('@capacitor/local-notifications');
    const result = await LocalNotifications.requestPermissions();
    return result.display === 'granted' ? 'granted' : 'denied';
  } catch (err) {
    log.error('Failed to request native permissions', err);
    return 'denied';
  }
};

export const cancelAllNotifications = async (): Promise<void> => {
  if (!isAndroid()) return;

  try {
    const { LocalNotifications } = await import('@capacitor/local-notifications');
    const { notifications: pending } = await LocalNotifications.getPending();
    if (pending.length > 0) {
      await LocalNotifications.cancel({ notifications: pending });
      log.info(`Cancelled ${pending.length} pending notifications`);
    }
  } catch (err) {
    log.error('Failed to cancel notifications', err);
  }
};

export const scheduleSubscriptionNotifications = async (
  subscriptions: Subscription[],
  daysBeforePayment: number,
  t: TFunction,
): Promise<void> => {
  if (!isAndroid()) return;

  try {
    const { LocalNotifications } = await import('@capacitor/local-notifications');

    await ensureChannel();

    // Cancel all existing first (clean-slate)
    const { notifications: pending } = await LocalNotifications.getPending();
    if (pending.length > 0) {
      await LocalNotifications.cancel({ notifications: pending });
    }

    const now = new Date();
    const toSchedule: Array<{
      id: number;
      title: string;
      body: string;
      schedule: { at: Date; allowWhileIdle: boolean };
      channelId: string;
      autoCancel: boolean;
      extra: { subscriptionId: string };
    }> = [];

    for (const sub of subscriptions) {
      if (sub.status !== 'active') continue;

      const paymentDate = new Date(sub.nextPaymentDate);
      const notifyDate = new Date(paymentDate);
      notifyDate.setDate(notifyDate.getDate() - daysBeforePayment);
      notifyDate.setHours(9, 0, 0, 0);

      if (notifyDate <= now) continue;

      const daysText =
        daysBeforePayment === 0
          ? t('reminders.notificationDays.today')
          : daysBeforePayment === 1
            ? t('reminders.notificationDays.tomorrow')
            : t('reminders.notificationDays.inDays', { count: daysBeforePayment });

      toSchedule.push({
        id: hashSubscriptionId(sub.id),
        title: t('reminders.notificationTitle'),
        body: t('reminders.notificationBody', {
          name: sub.name,
          amount: formatCurrency(sub.cost, sub.currency),
          days: daysText,
        }),
        schedule: { at: notifyDate, allowWhileIdle: true },
        channelId: 'payment-reminders',
        autoCancel: true,
        extra: { subscriptionId: sub.id },
      });
    }

    if (toSchedule.length > 0) {
      await LocalNotifications.schedule({ notifications: toSchedule });
      log.info(`Scheduled ${toSchedule.length} notifications`);
    } else {
      log.info('No notifications to schedule');
    }
  } catch (err) {
    log.error('Failed to schedule notifications', err);
  }
};
