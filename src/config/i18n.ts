import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import es from '@/locales/es/translation.json';
import en from '@/locales/en/translation.json';

// Get saved language from localStorage or detect from browser
const getSavedLanguage = (): string => {
  try {
    const stored = localStorage.getItem('suscriptio-settings');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.state?.language) {
        return parsed.state.language;
      }
    }
  } catch {
    // Ignore parse errors
  }
  // Detect browser language, default to Spanish
  const browserLang = navigator.language.split('-')[0];
  return browserLang === 'en' ? 'en' : 'es';
};

i18n.use(initReactI18next).init({
  resources: {
    es: { translation: es },
    en: { translation: en },
  },
  lng: getSavedLanguage(),
  fallbackLng: 'es',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
