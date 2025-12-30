import { useEffect } from 'react';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { addMonths, addYears, isBefore } from 'date-fns';
import { BillingFrequency, SubscriptionStatus } from '@/types';

export const useAutoAdvanceDates = () => {
  const { subscriptions, updateSubscription } = useSubscriptionStore();

  useEffect(() => {
    const now = new Date();

    subscriptions.forEach((sub) => {
      if (sub.status !== SubscriptionStatus.ACTIVE) return;

      const nextPayment = new Date(sub.nextPaymentDate);
      if (!isBefore(nextPayment, now)) return;

      let newDate = nextPayment;
      if (sub.billingFrequency === BillingFrequency.MONTHLY) {
        while (isBefore(newDate, now)) {
          newDate = addMonths(newDate, 1);
        }
      } else if (sub.billingFrequency === BillingFrequency.YEARLY) {
        while (isBefore(newDate, now)) {
          newDate = addYears(newDate, 1);
        }
      }

      updateSubscription(sub.id, { nextPaymentDate: newDate });
    });
  }, []);
};
