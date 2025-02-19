import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import getDefaultLanguage from './getDefaultLanguage ';

const defaultLanguage = getDefaultLanguage();

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: require('./locales/en.json'), // Path to your English translation file
    },
    nl: {
      translation: require('./locales/nl.json'), // Path to your Dutch translation file
    },
  },
  lng: defaultLanguage, // Set the default language to the detected language
  fallbackLng: 'en', // Fallback language
  interpolation: {
    escapeValue: false, // React already does escaping
  },
});
