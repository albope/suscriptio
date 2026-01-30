import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_CURRENCY } from '@/constants/currencies';
import i18n from '@/config/i18n';

export type PaymentView = 'timeline' | 'calendar';
export type Language = 'es' | 'en';

interface SettingsStore {
  preferredCurrency: string;
  setPreferredCurrency: (currency: string) => void;
  paymentView: PaymentView;
  setPaymentView: (view: PaymentView) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

// Detect initial language from browser
const getInitialLanguage = (): Language => {
  const browserLang = navigator.language.split('-')[0];
  return browserLang === 'en' ? 'en' : 'es';
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      preferredCurrency: DEFAULT_CURRENCY,
      paymentView: 'timeline',
      language: getInitialLanguage(),

      setPreferredCurrency: (currency) => {
        set({ preferredCurrency: currency });
      },

      setPaymentView: (view) => {
        set({ paymentView: view });
      },

      setLanguage: (lang) => {
        i18n.changeLanguage(lang);
        set({ language: lang });
      },
    }),
    {
      name: 'suscriptio-settings',
    }
  )
);
