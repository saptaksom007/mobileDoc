import I18n from 'ex-react-native-i18n'

export const MISSING_TRANSLATION = '[no translation]'

I18n.defaultLocale = 'en'
I18n.fallbacks = true
I18n.translations = {
  en: require('./en.json'),
  de: require('./de.json')
}

I18n.missingTranslation = () => MISSING_TRANSLATION
I18n.localShort = () => I18n.locale.substr(0, 2)
I18n.getFallbackLocale = () =>
  I18n.currentLocale().substr(0, 2) === 'en' ||
  I18n.currentLocale().substr(0, 2) === 'de'
    ? I18n.currentLocale().substr(0, 2)
    : 'en'
