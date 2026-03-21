import { initReactI18next } from "react-i18next"

import i18n from "i18next"

import authEn from "@/locales/en/auth.json"
import commonEn from "@/locales/en/common.json"
import authKo from "@/locales/ko/auth.json"
import commonKo from "@/locales/ko/common.json"

i18n.use(initReactI18next).init({
  resources: {
    ko: {
      common: commonKo,
      auth: authKo,
    },
    en: {
      common: commonEn,
      auth: authEn,
    },
  },
  lng: "en",
  fallbackLng: "ko",
  defaultNS: "common",
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
