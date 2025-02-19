import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import 'intl-pluralrules';
import en from '../locales/en.json';
import nl from '../locales/nl.json';

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  resources: {
    en: {translation: en},
    nl: {translation: nl},
  },
  fallbackLng: 'en',
  lng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
