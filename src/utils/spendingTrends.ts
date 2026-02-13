import { Subscription, SubscriptionStatus } from '@/types';
import { normalizeToMonthly } from './calculations';
import { subMonths, startOfMonth, endOfMonth, isBefore, isAfter } from 'date-fns';

export interface MonthlySpendData {
  month: string;       // 'YYYY-MM'
  label: string;       // Localized month label
  total: number;
  count: number;
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
}

/**
 * Calculates estimated historical spending trends based on current subscriptions.
 * This is an approximation — we derive which subscriptions were likely active
 * in past months based on createdAt and status/updatedAt.
 */
export function calculateSpendingTrends(
  subscriptions: Subscription[],
  monthsBack: number,
  currency: string
): MonthlySpendData[] {
  const now = new Date();
  const data: MonthlySpendData[] = [];

  for (let i = monthsBack - 1; i >= 0; i--) {
    const targetDate = subMonths(now, i);
    const monthStart = startOfMonth(targetDate);
    const monthEnd = endOfMonth(targetDate);
    const monthKey = `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, '0')}`;
    const monthLabel = targetDate.toLocaleDateString('es', { month: 'short' });

    let total = 0;
    let count = 0;

    subscriptions.forEach((sub) => {
      // Only count subs in the target currency
      if (sub.currency !== currency) return;

      const createdAt = new Date(sub.createdAt);

      // Sub must have been created before or during this month
      if (isAfter(createdAt, monthEnd)) return;

      // If canceled, check if it was canceled before this month
      if (sub.status === SubscriptionStatus.CANCELED) {
        const updatedAt = new Date(sub.updatedAt);
        // If updated (canceled) before this month started, skip it
        if (isBefore(updatedAt, monthStart)) return;
      }

      // This subscription was active during this month
      total += normalizeToMonthly(sub.cost, sub.billingFrequency, sub.customIntervalDays);
      count++;
    });

    data.push({
      month: monthKey,
      label: monthLabel,
      total: Math.round(total * 100) / 100,
      count,
      trend: 'stable',
      changePercent: 0,
    });
  }

  // Calculate trends (compare each month to the previous)
  for (let i = 1; i < data.length; i++) {
    const prev = data[i - 1].total;
    const curr = data[i].total;

    if (prev === 0) {
      data[i].trend = curr > 0 ? 'up' : 'stable';
      data[i].changePercent = curr > 0 ? 100 : 0;
    } else {
      const change = ((curr - prev) / prev) * 100;
      data[i].changePercent = Math.round(change * 10) / 10;

      if (change > 2) data[i].trend = 'up';
      else if (change < -2) data[i].trend = 'down';
      else data[i].trend = 'stable';
    }
  }

  return data;
}
