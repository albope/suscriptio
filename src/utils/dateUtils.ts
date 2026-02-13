import { differenceInDays, format, addMonths, addYears } from 'date-fns';
import { es } from 'date-fns/locale';
import { BillingFrequency } from '@/types';

export const formatDate = (date: Date | string): string => {
  return format(new Date(date), 'dd/MM/yyyy', { locale: es });
};

export const getDaysUntilPayment = (paymentDate: Date | string): number => {
  const now = new Date();
  const payment = new Date(paymentDate);
  return differenceInDays(payment, now);
};

export const getPaymentLabel = (daysUntil: number): string => {
  if (daysUntil === 0) return 'Vence hoy';
  if (daysUntil === 1) return 'Vence mañana';
  if (daysUntil > 1 && daysUntil <= 7) return `Vence en ${daysUntil} días`;
  return '';
};

export const advancePaymentDate = (currentDate: Date, frequency: BillingFrequency): Date => {
  if (frequency === BillingFrequency.MONTHLY) {
    return addMonths(currentDate, 1);
  } else if (frequency === BillingFrequency.YEARLY) {
    return addYears(currentDate, 1);
  }
  return currentDate;
};

export const getTrialDaysRemaining = (trialEndDate: Date | string): number => {
  const now = new Date();
  const end = new Date(trialEndDate);
  return differenceInDays(end, now);
};
