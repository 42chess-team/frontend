import { initReactI18next } from "react-i18next"

import i18n from "i18next"

import authEn from "@/locales/en/auth.json"
import commonEn from "@/locales/en/common.json"
import lobbyEn from "@/locales/en/lobby.json"
import authKo from "@/locales/ko/auth.json"
import commonKo from "@/locales/ko/common.json"
import lobbyKo from "@/locales/ko/lobby.json"

i18n.use(initReactI18next).init({
  resources: {
    ko: {
      common: commonKo,
      auth: authKo,
      lobby: lobbyKo,
    },
    en: {
      common: commonEn,
      auth: authEn,
      lobby: lobbyEn,
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
