import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_CURRENCY } from '@/constants/currencies';

export type PaymentView = 'timeline' | 'calendar';

interface SettingsStore {
  preferredCurrency: string;
  setPreferredCurrency: (currency: string) => void;
  paymentView: PaymentView;
  setPaymentView: (view: PaymentView) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      preferredCurrency: DEFAULT_CURRENCY,
      paymentView: 'timeline',

      setPreferredCurrency: (currency) => {
        set({ preferredCurrency: currency });
      },

      setPaymentView: (view) => {
        set({ paymentView: view });
      },
    }),
    {
      name: 'suscriptio-settings',
    }
  )
);
