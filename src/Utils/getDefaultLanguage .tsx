import * as RNLocalize from 'react-native-localize';

const getDefaultLanguage = () => {
  const locales = RNLocalize.getLocales();
  if (Array.isArray(locales) && locales.length > 0) {
    const languageTag = locales[0].languageTag; // e.g., 'en', 'nl'
    console.log('Detected language:', languageTag); // Console log the detected language
    return languageTag;
  }
  console.log('No language detected, defaulting to English.');
  return 'en';
};

export default getDefaultLanguage;
