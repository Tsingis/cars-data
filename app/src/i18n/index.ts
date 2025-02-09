import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import en from "./en.json"
import fi from "./fi.json"

const locales = {
  en: "en-FI",
  fi: "fi-FI",
}

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: en,
    },
    fi: {
      translation: fi,
    },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
})

export default i18n

export const getLocale = (language: string) => locales[language] || locales.en
