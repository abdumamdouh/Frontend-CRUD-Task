import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { appTheme } from "../config/theme";
import ar from "./locales/ar.json";
import en from "./locales/en.json";

const savedLanguage = localStorage.getItem(appTheme.storageKeys.language);
const initialLanguage = savedLanguage || appTheme.defaultLanguage;

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ar: { translation: ar },
  },
  lng: initialLanguage,
  fallbackLng: appTheme.defaultLanguage,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
