import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_CURRENCY } from '@/constants/currencies';

interface SettingsStore {
  preferredCurrency: string;
  setPreferredCurrency: (currency: string) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      preferredCurrency: DEFAULT_CURRENCY,

      setPreferredCurrency: (currency) => {
        set({ preferredCurrency: currency });
      },
    }),
    {
      name: 'suscriptio-settings',
    }
  )
);
