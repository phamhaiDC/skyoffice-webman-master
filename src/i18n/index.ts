import { initReactI18next } from 'react-i18next'
import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import Backend from 'i18next-http-backend'

i18n
  .use(LanguageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(Backend)
  .init({
    fallbackLng: 'en',
    // lng: 'en',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    returnEmptyString: false,

    debug: false,
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
  })

export default i18n
