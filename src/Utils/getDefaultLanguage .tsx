import * as RNLocalize from 'react-native-localize';

const getDefaultLanguage = () => {
  const locales = RNLocalize.getLocales();
  if (Array.isArray(locales) && locales.length > 0) {
    const languageTag = locales[0].languageTag;
    return languageTag;
  }
  return 'en';
};

export default getDefaultLanguage;
